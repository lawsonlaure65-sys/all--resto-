-- ============================================================
-- TABLE DE GESTION DES PAIEMENTS MOBILE MONEY (ALLÔRESTO NIGER)
-- À exécuter dans votre Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Table pour les paiements
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  amount_xof integer not null,
  payment_method text not null, -- 'airtel_money', 'moov_money', 'flooz', 'orange_zamany', 'mynita', 'amanata', 'all_iza', 'zeyna'
  payment_status text default 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  transaction_id text,
  phone_number text,
  provider_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index pour performance
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists payments_payment_status_idx on public.payments(payment_status);
create index if not exists payments_payment_method_idx on public.payments(payment_method);

-- 2. Table pour les configurations des providers
create table if not exists public.payment_providers (
  id text primary key,
  name text not null,
  api_url text,
  api_key text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insérer les providers officiels du Niger
insert into public.payment_providers (id, name, is_active) values
  ('airtel_money', 'Airtel Money Niger', true),
  ('moov_money', 'Moov Money Niger', true),
  ('flooz', 'Flooz (Togo/Niger)', true),
  ('orange_zamany', 'Orange Zamany Money', true),
  ('mynita', 'MyNita', true),
  ('amanata', 'Amanata', true),
  ('all_iza', 'All-Iza Business', true),
  ('zeyna', 'Zeyna', true)
on conflict (id) do nothing;

-- 3. Sécurité Row Level Security (RLS)
alter table public.payments enable row level security;
alter table public.payment_providers enable row level security;

-- Lecture publique pour les providers
drop policy if exists "Lecture des providers" on public.payment_providers;
create policy "Lecture des providers" on public.payment_providers for select using (true);

-- Lecture des paiements
drop policy if exists "Lecture des paiements" on public.payments;
create policy "Lecture des paiements" on public.payments for select using (true);

-- Création et mise à jour des paiements
drop policy if exists "Gestion des paiements" on public.payments;
create policy "Gestion des paiements" on public.payments for all using (true) with check (true);
