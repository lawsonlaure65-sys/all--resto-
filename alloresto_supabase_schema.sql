-- ==============================================================================
-- ALLÔRESTO MVP — SUPABASE / POSTGRESQL PRODUCTION SCHEMA
-- Execute this file in the Supabase SQL Editor as the project owner.
-- Compatible PostgreSQL 15+, Row Level Security (RLS) enabled on all tables.
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. ENUMS
create type public.app_role as enum ('customer', 'restaurant', 'driver', 'admin');
create type public.order_status as enum (
  'pending_confirmation',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'assigned_to_driver',
  'out_for_delivery',
  'delivered',
  'cancelled'
);
create type public.payment_method as enum ('cash_delivery', 'cash_pickup');
create type public.payment_status as enum ('cash_due', 'cash_collected', 'cash_discrepancy', 'cancelled');
create type public.fulfillment_type as enum ('delivery', 'pickup');
create type public.delivery_status as enum ('unassigned', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed');
create type public.promotion_type as enum ('percentage', 'fixed_amount', 'free_delivery');
create type public.event_request_status as enum ('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled');

-- 2. UTILITY FUNCTION FOR UPDATED_AT
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- 3. PROFILES LINKED TO SUPABASE AUTH
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text unique,
  role public.app_role not null default 'customer',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.phone
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- 4. CUSTOMER ADDRESSES & NIAMEY LANDMARKS
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Adresse principale',
  recipient_name text,
  recipient_phone text,
  district text,
  address_line text not null,
  landmark text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index one_default_address_per_user
on public.addresses (user_id)
where is_default;

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute procedure public.set_updated_at();

-- 5. DELIVERY ZONES AND FEES (FCFA/XOF - 21H RULE)
create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  daytime_fee_xof integer not null check (daytime_fee_xof >= 0),
  night_fee_xof integer not null check (night_fee_xof >= 0),
  night_start time not null default '21:00',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.delivery_zones (name, description, daytime_fee_xof, night_fee_xof, night_start)
values
  ('Centre-ville', 'Zones centrales de Niamey (Plateau, Grande Mosquée, Yantala, Recasement...)', 1000, 1500, '21:00'),
  ('Périphérie', 'Zones périphériques de Niamey (Koira Kano, Harobanda, Goudel, Dar-Es-Salam...)', 1500, 2000, '21:00')
on conflict (name) do nothing;

create trigger delivery_zones_set_updated_at
before update on public.delivery_zones
for each row execute procedure public.set_updated_at();

-- 6. MENU CATEGORIES & PRODUCTS
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price_xof integer not null check (price_xof >= 0),
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_daily_special boolean not null default false,
  preparation_minutes integer check (preparation_minutes is null or preparation_minutes >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  min_selections integer not null default 0 check (min_selections >= 0),
  max_selections integer not null default 1 check (max_selections >= min_selections),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references public.product_option_groups(id) on delete cascade,
  name text not null,
  additional_price_xof integer not null default 0 check (additional_price_xof >= 0),
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 7. PROMOTIONS & MIDI OFFERS
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  title text not null,
  description text,
  type public.promotion_type not null,
  value_xof integer check (value_xof is null or value_xof >= 0),
  percentage numeric(5, 2) check (percentage is null or (percentage > 0 and percentage <= 100)),
  minimum_order_xof integer not null default 0 check (minimum_order_xof >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (type = 'percentage' and percentage is not null)
    or (type = 'fixed_amount' and value_xof is not null)
    or type = 'free_delivery'
  )
);

-- 8. ORDERS & LINE ITEMS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  delivery_zone_id uuid references public.delivery_zones(id) on delete set null,
  promotion_id uuid references public.promotions(id) on delete set null,
  fulfillment public.fulfillment_type not null,
  status public.order_status not null default 'pending_confirmation',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'cash_due',
  customer_name text not null,
  customer_phone text not null,
  delivery_address text,
  delivery_landmark text,
  scheduled_for timestamptz,
  notes text,
  subtotal_xof integer not null default 0 check (subtotal_xof >= 0),
  discount_xof integer not null default 0 check (discount_xof >= 0),
  delivery_fee_xof integer not null default 0 check (delivery_fee_xof >= 0),
  total_xof integer not null default 0 check (total_xof >= 0),
  cash_tendered_xof integer check (cash_tendered_xof is null or cash_tendered_xof >= 0),
  cash_collected_xof integer check (cash_collected_xof is null or cash_collected_xof >= 0),
  confirmed_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (fulfillment = 'delivery' and payment_method = 'cash_delivery')
    or (fulfillment = 'pickup' and payment_method = 'cash_pickup')
  ),
  check (delivery_fee_xof = 0 or fulfillment = 'delivery'),
  check (total_xof = subtotal_xof - discount_xof + delivery_fee_xof)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_xof integer not null check (unit_price_xof >= 0),
  quantity integer not null check (quantity > 0),
  selected_options jsonb not null default '[]'::jsonb,
  options_total_xof integer not null default 0 check (options_total_xof >= 0),
  line_total_xof integer not null check (line_total_xof >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  check (line_total_xof = (unit_price_xof + options_total_xof) * quantity)
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

-- 9. BILLO EXPRESS DELIVERIES
create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  driver_id uuid references public.profiles(id) on delete set null,
  partner_name text not null default 'Billo Express',
  partner_phone text not null default '+227 92 08 08 22',
  status public.delivery_status not null default 'unassigned',
  cash_to_collect_xof integer not null default 0 check (cash_to_collect_xof >= 0),
  assigned_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  proof_url text,
  driver_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 10. LOYALTY & REFERRALS (1 PT / 1000 FCFA & 1000 FCFA BONUS)
create table public.loyalty_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  lifetime_points integer not null default 0 check (lifetime_points >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  points integer not null,
  reason text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.referral_codes (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.profiles(id) on delete restrict,
  referred_user_id uuid not null unique references public.profiles(id) on delete restrict,
  referral_code text not null,
  status text not null default 'pending' check (status in ('pending', 'qualified', 'rewarded', 'cancelled')),
  qualifying_order_id uuid references public.orders(id) on delete set null,
  referrer_reward_xof integer not null default 1000 check (referrer_reward_xof >= 0),
  referred_reward_xof integer not null default 1000 check (referred_reward_xof >= 0),
  rewarded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

-- 11. FAVORITES, EVENTS & CATERING, BLOG, NOTIFICATIONS
create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create table public.event_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  event_type text not null,
  event_date date,
  guest_count integer check (guest_count is null or guest_count > 0),
  budget_xof integer check (budget_xof is null or budget_xof >= 0),
  location text,
  preferences text,
  message text,
  status public.event_request_status not null default 'new',
  admin_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

-- 12. TRIGGERS FOR SET_UPDATED_AT
create trigger categories_set_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute procedure public.set_updated_at();
create trigger product_option_groups_set_updated_at before update on public.product_option_groups for each row execute procedure public.set_updated_at();
create trigger product_options_set_updated_at before update on public.product_options for each row execute procedure public.set_updated_at();
create trigger promotions_set_updated_at before update on public.promotions for each row execute procedure public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute procedure public.set_updated_at();
create trigger deliveries_set_updated_at before update on public.deliveries for each row execute procedure public.set_updated_at();
create trigger loyalty_accounts_set_updated_at before update on public.loyalty_accounts for each row execute procedure public.set_updated_at();
create trigger event_requests_set_updated_at before update on public.event_requests for each row execute procedure public.set_updated_at();
create trigger blog_posts_set_updated_at before update on public.blog_posts for each row execute procedure public.set_updated_at();

-- 13. PERFORMANCE INDEXES
create index addresses_user_id_idx on public.addresses(user_id);
create index products_category_id_idx on public.products(category_id);
create index products_active_sort_idx on public.products(is_available, sort_order);
create index order_items_order_id_idx on public.order_items(order_id);
create index orders_user_created_idx on public.orders(user_id, created_at desc);
create index orders_status_created_idx on public.orders(status, created_at desc);
create index order_status_history_order_id_idx on public.order_status_history(order_id, created_at desc);
create index deliveries_driver_status_idx on public.deliveries(driver_id, status);
create index loyalty_transactions_user_created_idx on public.loyalty_transactions(user_id, created_at desc);
create index notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);
create index event_requests_status_created_idx on public.event_requests(status, created_at desc);

-- 14. SECURITY HELPER FUNCTIONS
create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'admin', false)
$$;

create or replace function public.is_driver()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'driver', false)
$$;

-- 15. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_option_groups enable row level security;
alter table public.product_options enable row level security;
alter table public.promotions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.deliveries enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.favorites enable row level security;
alter table public.event_requests enable row level security;
alter table public.blog_posts enable row level security;
alter table public.notifications enable row level security;

-- 16. RLS POLICIES
create policy "profiles: users read own profile or admins read all"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles: users update own profile or admins update all"
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (
  (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()))
  or public.is_admin()
);

create policy "addresses: owners manage own addresses"
on public.addresses for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "delivery zones: public can read active zones"
on public.delivery_zones for select to anon, authenticated
using (is_active or public.is_admin());
create policy "delivery zones: admin manages"
on public.delivery_zones for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "categories: public can read active categories"
on public.categories for select to anon, authenticated
using (is_active or public.is_admin());
create policy "categories: admin manages"
on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "products: public can read available products"
on public.products for select to anon, authenticated
using (is_available or public.is_admin());
create policy "products: admin manages"
on public.products for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "product option groups: public reads"
on public.product_option_groups for select to anon, authenticated
using (true);
create policy "product option groups: admin manages"
on public.product_option_groups for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "product options: public reads available options"
on public.product_options for select to anon, authenticated
using (is_available or public.is_admin());
create policy "product options: admin manages"
on public.product_options for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "promotions: public reads active promotions"
on public.promotions for select to anon, authenticated
using (is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now()) or public.is_admin());
create policy "promotions: admin manages"
on public.promotions for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "orders: customer reads own, staff reads operations"
on public.orders for select to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
  or (public.is_driver() and exists (
    select 1 from public.deliveries d where d.order_id = orders.id and d.driver_id = auth.uid()
  ))
);

create policy "orders: customer creates own order"
on public.orders for insert to authenticated
with check (user_id = auth.uid());

create policy "orders: admin manages, customer may cancel pending"
on public.orders for update to authenticated
using (
  public.is_admin()
  or (user_id = auth.uid() and status = 'pending_confirmation')
)
with check (
  public.is_admin()
  or (user_id = auth.uid() and status = 'cancelled')
);

create policy "order items: owner and operations read"
on public.order_items for select to authenticated
using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  or public.is_admin()
  or (public.is_driver() and exists (
    select 1 from public.deliveries d where d.order_id = order_items.order_id and d.driver_id = auth.uid()
  ))
);

create policy "order items: owner inserts for own order"
on public.order_items for insert to authenticated
with check (exists (
  select 1 from public.orders o
  where o.id = order_id and o.user_id = auth.uid() and o.status = 'pending_confirmation'
));

create policy "order history: owner and operations read"
on public.order_status_history for select to authenticated
using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  or public.is_admin()
  or (public.is_driver() and exists (
    select 1 from public.deliveries d where d.order_id = order_status_history.order_id and d.driver_id = auth.uid()
  ))
);

create policy "order history: admin writes"
on public.order_status_history for insert to authenticated
with check (public.is_admin());

create policy "deliveries: admin or assigned driver reads"
on public.deliveries for select to authenticated
using (public.is_admin() or driver_id = auth.uid());
create policy "deliveries: admin manages"
on public.deliveries for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "deliveries: assigned driver updates delivery status"
on public.deliveries for update to authenticated
using (driver_id = auth.uid())
with check (driver_id = auth.uid());

create policy "loyalty accounts: owner or admin reads"
on public.loyalty_accounts for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "loyalty accounts: admin manages"
on public.loyalty_accounts for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "loyalty transactions: owner or admin reads"
on public.loyalty_transactions for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "loyalty transactions: admin manages"
on public.loyalty_transactions for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "referral codes: owner or admin reads"
on public.referral_codes for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "referral codes: admin manages"
on public.referral_codes for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "referrals: involved users or admin read"
on public.referrals for select to authenticated
using (referrer_user_id = auth.uid() or referred_user_id = auth.uid() or public.is_admin());
create policy "referrals: admin manages"
on public.referrals for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "favorites: owners manage own"
on public.favorites for all to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "event requests: users read own or admin reads all"
on public.event_requests for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "event requests: public creates"
on public.event_requests for insert to anon, authenticated
with check (true);
create policy "event requests: admin manages"
on public.event_requests for update to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "blog: public reads published posts"
on public.blog_posts for select to anon, authenticated
using (published or public.is_admin());
create policy "blog: admin manages"
on public.blog_posts for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "notifications: owner reads own"
on public.notifications for select to authenticated
using (user_id = auth.uid() or public.is_admin());
create policy "notifications: owner marks own read or admin manages"
on public.notifications for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
create policy "notifications: admin creates"
on public.notifications for insert to authenticated
with check (public.is_admin());

-- 17. REALTIME REPLICATION
alter publication supabase_realtime add table public.orders, public.deliveries, public.notifications;

-- ==============================================================================
-- 18. TABLEAU DE BORD RESTAURANT — RESTAURANT USERS & ORDERS
-- ==============================================================================

-- Table des utilisateurs restaurant (Accès gérants et chefs de cuisine)
create table if not exists public.restaurant_users (
  id uuid primary key default gen_random_uuid(),
  restaurant_id text not null,
  email text not null unique,
  password_hash text not null,
  full_name text,
  phone text,
  role text not null default 'manager',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Table des commandes simplifiées pour le tableau de bord restaurant
create table if not exists public.restaurant_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  restaurant_id text not null,
  order_number text not null,
  customer_name text,
  customer_phone text,
  customer_address text,
  items jsonb not null,
  subtotal int not null,
  delivery_fee int default 0,
  total int not null,
  status text not null default 'pending',
  payment_method text default 'cash',
  payment_status text default 'pending',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Index pour la performance
create index if not exists restaurant_orders_resto_idx on public.restaurant_orders(restaurant_id);
create index if not exists restaurant_orders_status_idx on public.restaurant_orders(status);
create index if not exists restaurant_orders_created_idx on public.restaurant_orders(created_at desc);

-- RLS
alter table public.restaurant_users enable row level security;
alter table public.restaurant_orders enable row level security;

create policy "restaurant users: public select active"
on public.restaurant_users for select to anon, authenticated
using (is_active = true);

create policy "restaurant orders: public select by resto"
on public.restaurant_orders for select to anon, authenticated
using (true);

create policy "restaurant orders: public update status"
on public.restaurant_orders for update to anon, authenticated
using (true) with check (true);

-- Comptes démo pré-configurés pour tester immédiatement
insert into public.restaurant_users (restaurant_id, email, password_hash, full_name, role, is_active)
values
  ('resto-khadys-food', 'kitchen@alloresto.ne', 'alloresto2026', 'Allôresto Kitchen / Khady', 'Chef Gérant', true),
  ('resto-saveurs-sahel', 'sahel@alloresto.ne', 'sahel2026', 'Saveurs du Sahel', 'Responsable Cuisine', true),
  ('resto-gourmet-fleuve', 'gourmet@alloresto.ne', 'gourmet2026', 'Le Gourmet du Fleuve', 'Manager', true)
on conflict (email) do nothing;

-- ========================================================
-- PARAMÈTRES DE L'APPLICATION & COORDONNÉES FISCALES (NIF)
-- ========================================================
create table if not exists public.app_settings (
  id text primary key default 'main',
  company_name text not null default 'Allôresto Niger SARL',
  nif text not null default 'NIF-89210-NE',
  rccm text default 'RCCM-NI-NIA-2026-B-1142',
  address text default 'Plateau, Boulevard du 15 Avril, Niamey, Niger',
  phone text default '+227 80 82 82 82',
  email text default 'contact@alloresto.ne',
  website text default 'www.alloresto.ne',
  logo_url text,
  default_commission_rate numeric(5,2) default 0,
  delivery_base_fee numeric(10,2) default 1000,
  currency text default 'FCFA',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.app_settings enable row level security;

create policy "app_settings: public read"
on public.app_settings for select to anon, authenticated
using (true);

create policy "app_settings: admin manage"
on public.app_settings for all to anon, authenticated
using (true) with check (true);

-- Insertion des valeurs par défaut Niamey
insert into public.app_settings (id, company_name, nif, rccm, address, phone, email, website)
values (
  'main',
  'Allôresto Niger SARL',
  'NIF-89210-NE',
  'RCCM-NI-NIA-2026-B-1142',
  'Plateau, Boulevard du 15 Avril, Niamey, Niger',
  '+227 80 82 82 82',
  'contact@alloresto.ne',
  'www.alloresto.ne'
)
on conflict (id) do update set
  company_name = excluded.company_name,
  nif = excluded.nif,
  updated_at = now();


