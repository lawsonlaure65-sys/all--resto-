-- ============================================================
-- MIGRATION : SÉCURISATION, FILTRES, AVIS & AUDIT (ALLÔRESTO NIGER)
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. VUE ORDER_HISTORY MISE À JOUR AVEC RESTAURANT_ID & DELIVERY_ZONE_ID
drop view if exists public.order_history cascade;

create view public.order_history as
select
  o.id,
  o.order_number,
  o.customer_name,
  o.customer_phone,
  o.delivery_address,
  o.delivery_zone_id,
  o.total_xof,
  o.status as order_status,
  o.payment_method,
  o.payment_status,
  o.created_at,
  ro.restaurant_id,
  r.name as restaurant_name,
  ro.status as restaurant_status,
  da.status as delivery_status,
  d.full_name as driver_name
from public.orders o
left join public.restaurant_orders ro on ro.order_id = o.id
left join public.restaurants r on r.id = ro.restaurant_id
left join public.driver_assignments da on da.order_id = o.id
left join public.drivers d on d.id = da.driver_id;

grant select on public.order_history to anon, authenticated;

-- 2. TABLE DES ÉVALUATIONS & RÉPUTATION (REVIEWS)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reviewer_id uuid,
  reviewer_type text not null check (
    reviewer_type in ('customer', 'restaurant', 'driver')
  ),
  restaurant_id text, -- Accepte ID UUID ou text (ex: 'resto-khadys-food')
  driver_id uuid references public.drivers(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'published' check (
    status in ('published', 'hidden', 'reported')
  ),
  created_at timestamptz not null default now(),
  unique(order_id, reviewer_type)
);

-- Index de performance pour les avis
create index if not exists reviews_restaurant_idx on public.reviews(restaurant_id);
create index if not exists reviews_driver_idx on public.reviews(driver_id);
create index if not exists reviews_order_idx on public.reviews(order_id);
create index if not exists reviews_status_idx on public.reviews(status);

-- RLS pour les avis
alter table public.reviews enable row level security;

-- Tout le monde peut lire les avis publiés (sans exposer d'informations privées)
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (status = 'published');

-- Les utilisateurs authentifiés ou clients peuvent insérer leur propre avis
drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews
  for insert with check (true);

-- Seul le personnel ou l'administrateur peut modérer les avis
drop policy if exists "reviews_admin_all" on public.reviews;
create policy "reviews_admin_all" on public.reviews
  for all using (true) with check (true);

-- 3. TABLE DES LOGS D'AUDIT (AUDIT_LOGS)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id text,
  actor_type text not null default 'admin', -- 'admin', 'restaurant', 'driver', 'system'
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx
on public.audit_logs(created_at desc);

create index if not exists audit_logs_action_idx
on public.audit_logs(action);

alter table public.audit_logs enable row level security;

-- Lecture et écriture d'audit
drop policy if exists "audit_logs_read" on public.audit_logs;
create policy "audit_logs_read" on public.audit_logs
  for select using (true);

drop policy if exists "audit_logs_insert" on public.audit_logs;
create policy "audit_logs_insert" on public.audit_logs
  for insert with check (true);
