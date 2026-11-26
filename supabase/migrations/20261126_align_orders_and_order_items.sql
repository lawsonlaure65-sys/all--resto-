-- ==============================================================================
-- ALLÔRESTO — ALIGNEMENT SCHEMA & SÉCURISATION DU FLUX DE COMMANDE
-- Fichier de migration à relire puis exécuter manuellement dans Supabase SQL Editor.
-- Ne modifie ni les plats (public.dishes) ni les vues analytics existantes.
-- ==============================================================================

-- 1. EXTENSION DES ENUMS DE PAIEMENT (Mobile Money Niger + Espèces)
-- Note PostgreSQL : ALTER TYPE ... ADD VALUE IF NOT EXISTS ne doit pas être suivi
-- d'une utilisation directe des nouvelles valeurs littérales dans la même transaction.
alter type public.payment_method add value if not exists 'airtel_money';
alter type public.payment_method add value if not exists 'moov_money';
alter type public.payment_method add value if not exists 'flooz';
alter type public.payment_method add value if not exists 'zamany_cash';
alter type public.payment_method add value if not exists 'al_izza';
alter type public.payment_method add value if not exists 'mynita';
alter type public.payment_method add value if not exists 'amanata';
alter type public.payment_method add value if not exists 'zeyna';
alter type public.payment_method add value if not exists 'mobile_money';
alter type public.payment_method add value if not exists 'card';
alter type public.payment_method add value if not exists 'apple_pay';
alter type public.payment_method add value if not exists 'cash';

alter type public.payment_status add value if not exists 'awaiting_mobile_money_validation';
alter type public.payment_status add value if not exists 'paid';
alter type public.payment_status add value if not exists 'cash_on_delivery';
alter type public.payment_status add value if not exists 'pending';
alter type public.payment_status add value if not exists 'failed';
alter type public.payment_status add value if not exists 'refunded';

-- 2. ALIGNEMENT DE public.orders AVEC LES COMMANDES RÉELLES DE L'APPLICATION
-- Autorise les commandes invités sans compte Auth obligatoire
alter table public.orders
  alter column user_id drop not null;

alter table public.orders
  add column if not exists restaurant_id text,
  add column if not exists restaurant_name text,
  add column if not exists client_order_ref text,
  add column if not exists idempotency_key text,
  add column if not exists district text,
  add column if not exists tip_xof integer not null default 0,
  add column if not exists promo_code text,
  add column if not exists scheduled_time text,
  add column if not exists mobile_money_reference text,
  add column if not exists receipt_proof_attached boolean not null default false,
  add column if not exists driver_name text,
  add column if not exists delay_minutes integer,
  add column if not exists delay_reason text,
  add column if not exists delay_notified_at timestamptz,
  add column if not exists delay_notified_count integer not null default 0;

-- Supprime uniquement les anciennes contraintes CHECK incompatibles (cash-only / total sans pourboire)
do $$
declare
  c record;
begin
  for c in
    select conname, pg_get_constraintdef(oid) as def
    from pg_constraint
    where conrelid = 'public.orders'::regclass
      and contype = 'c'
  loop
    if c.def ilike '%payment_method%'
       or c.def ilike '%subtotal_xof%'
       or c.def ilike '%delivery_fee_xof = 0 or fulfillment%' then
      execute format('alter table public.orders drop constraint if exists %I', c.conname);
    end if;
  end loop;
end $$;

alter table public.orders
  drop constraint if exists orders_tip_xof_check,
  add constraint orders_tip_xof_check check (tip_xof >= 0);

alter table public.orders
  drop constraint if exists orders_total_formula_check,
  add constraint orders_total_formula_check check (
    total_xof = greatest(0, subtotal_xof - discount_xof + delivery_fee_xof + coalesce(tip_xof, 0))
  );

-- Clé d'idempotence unique pour bloquer tout doublon sur double-clic ou retry réseau
create unique index if not exists orders_idempotency_key_uidx
  on public.orders(idempotency_key)
  where idempotency_key is not null;

create index if not exists orders_restaurant_id_idx
  on public.orders(restaurant_id);

create index if not exists orders_created_at_idx
  on public.orders(created_at desc);

-- 3. ALIGNEMENT DE public.order_items
alter table public.order_items
  add column if not exists dish_id text;

create index if not exists order_items_order_id_idx
  on public.order_items(order_id);

-- 4. POLITIQUES RLS SÉCURISÉES POUR COMMANDES CLIENTS (AUTH + INVITÉS) & ADMIN
drop policy if exists "orders: customer creates own order" on public.orders;
drop policy if exists "orders: customer or guest creates pending order" on public.orders;
create policy "orders: customer or guest creates pending order"
on public.orders for insert to anon, authenticated
with check (
  status = 'pending_confirmation'
  and restaurant_id is not null
  and length(trim(restaurant_id)) > 0
  and (user_id is null or user_id = auth.uid())
);

drop policy if exists "orders: customer reads own, staff reads operations" on public.orders;
create policy "orders: customer reads own, staff reads operations"
on public.orders for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.current_role() = 'restaurant'
  or (public.is_driver() and exists (
    select 1 from public.deliveries d where d.order_id = orders.id and d.driver_id = auth.uid()
  ))
);

drop policy if exists "order items: owner inserts for own order" on public.order_items;
drop policy if exists "order items: inserts for pending order" on public.order_items;
create policy "order items: inserts for pending order"
on public.order_items for insert to anon, authenticated
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.status = 'pending_confirmation'
      and (o.user_id is null or o.user_id = auth.uid())
  )
);

drop policy if exists "order items: owner and operations read" on public.order_items;
create policy "order items: owner and operations read"
on public.order_items for select to authenticated
using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  or public.is_admin()
  or public.current_role() = 'restaurant'
  or (public.is_driver() and exists (
    select 1 from public.deliveries d where d.order_id = order_items.order_id and d.driver_id = auth.uid()
  ))
);

-- 5. RPC ATOMIQUE ET IDEMPOTENTE DE CRÉATION DE COMMANDE (public.orders + public.order_items)
-- Permet aux clients connectés ou invités de créer une commande complète sans exposer
-- les lectures anonymes sur public.orders.
create or replace function public.create_alloresto_order(
  p_idempotency_key text,
  p_client_order_ref text,
  p_restaurant_id text,
  p_restaurant_name text,
  p_fulfillment text,
  p_payment_method text,
  p_payment_status text,
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text default null,
  p_district text default null,
  p_notes text default null,
  p_scheduled_time text default null,
  p_promo_code text default null,
  p_mobile_money_reference text default null,
  p_receipt_proof_attached boolean default false,
  p_cash_tendered_xof integer default null,
  p_subtotal_xof integer default 0,
  p_discount_xof integer default 0,
  p_delivery_fee_xof integer default 0,
  p_tip_xof integer default 0,
  p_items jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing record;
  v_user_id uuid;
  v_order_id uuid;
  v_order_number bigint;
  v_status public.order_status := 'pending_confirmation';
  v_fulfillment public.fulfillment_type;
  v_payment_method public.payment_method;
  v_payment_status public.payment_status;
  v_subtotal integer := greatest(0, coalesce(p_subtotal_xof, 0));
  v_discount integer := greatest(0, coalesce(p_discount_xof, 0));
  v_delivery_fee integer := greatest(0, coalesce(p_delivery_fee_xof, 0));
  v_tip integer := greatest(0, coalesce(p_tip_xof, 0));
  v_total integer;
  v_item jsonb;
  v_unit_price integer;
  v_qty integer;
  v_options_total integer;
  v_line_total integer;
begin
  if p_restaurant_id is null or length(trim(p_restaurant_id)) = 0 then
    raise exception 'restaurant_id manquant pour enregistrer la commande';
  end if;

  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'Nom client obligatoire';
  end if;

  if p_customer_phone is null or length(trim(p_customer_phone)) = 0 then
    raise exception 'Téléphone client obligatoire';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Le panier est vide';
  end if;

  -- Vérification idempotence (anti-doublon)
  if p_idempotency_key is not null and length(trim(p_idempotency_key)) > 0 then
    select id, order_number, client_order_ref, status
      into v_existing
      from public.orders
     where idempotency_key = trim(p_idempotency_key)
     limit 1;

    if found then
      return jsonb_build_object(
        'id', v_existing.id,
        'order_number', v_existing.order_number,
        'client_order_ref', v_existing.client_order_ref,
        'status', v_existing.status::text,
        'duplicate', true
      );
    end if;
  end if;

  v_user_id := auth.uid();
  if v_user_id is not null then
    if not exists (select 1 from public.profiles where id = v_user_id) then
      v_user_id := null;
    end if;
  end if;

  v_fulfillment := case
    when lower(coalesce(p_fulfillment, 'delivery')) in ('pickup', 'takeaway')
      then 'pickup'::public.fulfillment_type
    else 'delivery'::public.fulfillment_type
  end;

  v_payment_method := (
    case lower(coalesce(p_payment_method, ''))
      when 'cash_delivery' then 'cash_delivery'
      when 'cash_pickup' then 'cash_pickup'
      when 'cash' then case when v_fulfillment = 'pickup' then 'cash_pickup' else 'cash_delivery' end
      when 'cash_on_delivery' then case when v_fulfillment = 'pickup' then 'cash_pickup' else 'cash_delivery' end
      when 'airtel_money' then 'airtel_money'
      when 'moov_money' then 'moov_money'
      when 'flooz' then 'flooz'
      when 'zamany_cash' then 'zamany_cash'
      when 'al_izza' then 'al_izza'
      when 'al_izza_cash' then 'al_izza'
      when 'al_izza_business' then 'al_izza'
      when 'al_izza_transfer' then 'al_izza'
      when 'mynita' then 'mynita'
      when 'amanata' then 'amanata'
      when 'zeyna' then 'zeyna'
      when 'mobile_money' then 'mobile_money'
      when 'card' then 'card'
      when 'apple_pay' then 'apple_pay'
      else case when v_fulfillment = 'pickup' then 'cash_pickup' else 'cash_delivery' end
    end
  )::public.payment_method;

  v_payment_status := (
    case lower(coalesce(p_payment_status, ''))
      when 'paid' then 'paid'
      when 'cash_collected' then 'cash_collected'
      when 'cash_due' then 'cash_due'
      when 'cash_on_delivery' then 'cash_due'
      when 'awaiting_mobile_money_validation' then 'awaiting_mobile_money_validation'
      when 'pending' then 'awaiting_mobile_money_validation'
      when 'failed' then 'failed'
      when 'refunded' then 'refunded'
      when 'cancelled' then 'cancelled'
      else case
        when v_payment_method in ('cash_delivery', 'cash_pickup', 'cash') then 'cash_due'
        else 'awaiting_mobile_money_validation'
      end
    end
  )::public.payment_status;

  v_total := greatest(0, v_subtotal - v_discount + v_delivery_fee + v_tip);

  insert into public.orders (
    user_id,
    restaurant_id,
    restaurant_name,
    client_order_ref,
    idempotency_key,
    fulfillment,
    status,
    payment_method,
    payment_status,
    customer_name,
    customer_phone,
    delivery_address,
    district,
    notes,
    scheduled_time,
    promo_code,
    mobile_money_reference,
    receipt_proof_attached,
    cash_tendered_xof,
    subtotal_xof,
    discount_xof,
    delivery_fee_xof,
    tip_xof,
    total_xof
  )
  values (
    v_user_id,
    trim(p_restaurant_id),
    nullif(trim(coalesce(p_restaurant_name, '')), ''),
    nullif(trim(coalesce(p_client_order_ref, '')), ''),
    nullif(trim(coalesce(p_idempotency_key, '')), ''),
    v_fulfillment,
    'pending_confirmation'::public.order_status,
    v_payment_method,
    v_payment_status,
    trim(p_customer_name),
    trim(p_customer_phone),
    nullif(trim(coalesce(p_delivery_address, '')), ''),
    nullif(trim(coalesce(p_district, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    nullif(trim(coalesce(p_scheduled_time, '')), ''),
    nullif(trim(coalesce(p_promo_code, '')), ''),
    nullif(trim(coalesce(p_mobile_money_reference, '')), ''),
    coalesce(p_receipt_proof_attached, false),
    case when p_cash_tendered_xof is not null and p_cash_tendered_xof >= 0 then p_cash_tendered_xof else null end,
    v_subtotal,
    v_discount,
    v_delivery_fee,
    v_tip,
    v_total
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_unit_price := greatest(0, coalesce((v_item ->> 'unit_price_xof')::integer, 0));
    v_qty := greatest(1, coalesce((v_item ->> 'quantity')::integer, 1));
    v_options_total := greatest(0, coalesce((v_item ->> 'options_total_xof')::integer, 0));
    v_line_total := (v_unit_price + v_options_total) * v_qty;

    insert into public.order_items (
      order_id,
      dish_id,
      product_name,
      unit_price_xof,
      quantity,
      selected_options,
      options_total_xof,
      line_total_xof,
      notes
    )
    values (
      v_order_id,
      nullif(trim(coalesce(v_item ->> 'dish_id', '')), ''),
      coalesce(nullif(trim(coalesce(v_item ->> 'product_name', '')), ''), 'Plat Allôresto'),
      v_unit_price,
      v_qty,
      coalesce(v_item -> 'selected_options', '{}'::jsonb),
      v_options_total,
      v_line_total,
      nullif(trim(coalesce(v_item ->> 'notes', '')), '')
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'client_order_ref', p_client_order_ref,
    'status', v_status::text,
    'duplicate', false
  );
end;
$$;

grant execute on function public.create_alloresto_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text, boolean, integer, integer, integer, integer, integer, jsonb
) to anon, authenticated;
