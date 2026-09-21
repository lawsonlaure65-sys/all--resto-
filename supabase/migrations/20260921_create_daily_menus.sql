-- Migration: 20260921_create_daily_menus.sql
-- Table pour les plats du jour et menus programmés Allôresto

create table if not exists public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text,
  menu_date date not null default current_date,
  title text not null,
  description text,
  price_xof integer not null check (price_xof > 0),
  image_url text,
  photo_url text,
  marketing_message text,
  call_to_action text default 'Commander le Plat du Jour',
  status text not null default 'published' check (status in ('draft', 'scheduled', 'published', 'archived')),
  is_ai_suggested boolean not null default false,
  published_at timestamptz default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_daily_menus_date_status on public.daily_menus(menu_date, status);
create index if not exists idx_daily_menus_restaurant on public.daily_menus(restaurant_id);

alter table public.daily_menus enable row level security;

create policy "daily_menus: public read"
  on public.daily_menus for select to anon, authenticated
  using (true);

create policy "daily_menus: admin manage"
  on public.daily_menus for all to anon, authenticated
  using (true) with check (true);
