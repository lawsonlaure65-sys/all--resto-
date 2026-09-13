-- ============================================================
-- VUES SQL ANALYTICS POUR ALLÔRESTO NIGER
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- Suppression préalable des vues existantes pour éviter l'erreur PostgreSQL 42P16
-- (PostgreSQL interdit de modifier le type d'une colonne avec CREATE OR REPLACE VIEW)
drop view if exists public.admin_daily_revenue cascade;
drop view if exists public.admin_weekly_revenue cascade;
drop view if exists public.admin_monthly_revenue cascade;
drop view if exists public.admin_payment_method_stats cascade;
drop view if exists public.admin_order_status_stats cascade;

-- 1. Vue pour les stats journalières (CA et commandes)
create view public.admin_daily_revenue as
select 
  date(created_at) as date,
  count(*) as total_orders,
  coalesce(sum(total_xof), 0)::bigint as total_revenue,
  coalesce(sum(delivery_fee_xof), 0)::bigint as total_delivery_fees,
  coalesce(sum(subtotal_xof), 0)::bigint as total_subtotal
from public.orders
where status != 'cancelled'
group by date(created_at)
order by date desc
limit 30;

-- 2. Vue pour les stats par semaine
create view public.admin_weekly_revenue as
select 
  date_trunc('week', created_at) as week_start,
  count(*) as total_orders,
  coalesce(sum(total_xof), 0)::bigint as total_revenue
from public.orders
where status != 'cancelled'
group by date_trunc('week', created_at)
order by week_start desc
limit 12;

-- 3. Vue pour les stats par mois
create view public.admin_monthly_revenue as
select 
  date_trunc('month', created_at) as month_start,
  count(*) as total_orders,
  coalesce(sum(total_xof), 0)::bigint as total_revenue
from public.orders
where status != 'cancelled'
group by date_trunc('month', created_at)
order by month_start desc
limit 12;

-- 4. Vue pour les stats par méthode de paiement
create view public.admin_payment_method_stats as
select 
  payment_method::text as payment_method,
  count(*) as total_orders,
  coalesce(sum(total_xof), 0)::bigint as total_revenue
from public.orders
where payment_method is not null
  and status != 'cancelled'
group by payment_method
order by total_revenue desc;

-- 5. Vue pour les stats par statut de commande
create view public.admin_order_status_stats as
select 
  status::text as status,
  count(*) as total_orders,
  coalesce(sum(total_xof), 0)::bigint as total_revenue
from public.orders
group by status
order by total_orders desc;

-- Permissions de lecture pour authenticated et anon (ou staff)
grant select on public.admin_daily_revenue to anon, authenticated;
grant select on public.admin_weekly_revenue to anon, authenticated;
grant select on public.admin_monthly_revenue to anon, authenticated;
grant select on public.admin_payment_method_stats to anon, authenticated;
grant select on public.admin_order_status_stats to anon, authenticated;
