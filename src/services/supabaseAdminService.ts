import { getSupabaseClient } from "./supabaseClient";

export interface AdminDailyStat {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_delivery_fees: number;
}

export interface AdminRestaurantStat {
  id: string;
  name: string;
  slug: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

export interface AdminZoneStat {
  delivery_district: string;
  total_orders: number;
  total_revenue: number;
}

/**
 * Fetch daily revenue & orders analytics from view or orders table
 */
export async function fetchAdminDailyStats(): Promise<AdminDailyStat[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("admin_daily_stats")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Falling back from admin_daily_stats view:", err);
  }

  return [];
}

/**
 * Fetch per-restaurant aggregate sales & order volumes
 */
export async function fetchAdminRestaurantStats(): Promise<AdminRestaurantStat[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("admin_restaurant_stats")
      .select("*")
      .order("total_revenue", { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Falling back from admin_restaurant_stats view:", err);
  }

  return [];
}

/**
 * Fetch delivery metrics by Niamey district
 */
export async function fetchAdminZoneStats(): Promise<AdminZoneStat[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from("admin_zone_stats")
      .select("*")
      .order("total_revenue", { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn("Falling back from admin_zone_stats view:", err);
  }

  return [];
}
