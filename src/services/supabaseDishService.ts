import { MenuItem, Restaurant } from "../types";
import { getSupabaseClient } from "./supabaseClient";
import { RESTAURANTS_DATA } from "../data/allorestoData";

// SQL Schema for Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- SCHEMA SQL POUR ALLÔRESTO NIGER SUR SUPABASE
-- À exécuter dans votre Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Table des Restaurants / Cuisines
CREATE TABLE IF NOT EXISTS public.restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  cuisine TEXT,
  cuisine_category TEXT,
  rating NUMERIC DEFAULT 4.8,
  review_count INTEGER DEFAULT 120,
  delivery_time TEXT DEFAULT '25-40 min',
  min_order INTEGER DEFAULT 1000,
  delivery_fee INTEGER DEFAULT 500,
  address TEXT DEFAULT 'Niamey, Niger',
  city TEXT DEFAULT 'Niamey',
  image TEXT,
  banner_image TEXT,
  is_promoted BOOLEAN DEFAULT false,
  promo_badge TEXT,
  is_open BOOLEAN DEFAULT true,
  opening_hours TEXT DEFAULT '07h30 - 23h00',
  phone TEXT DEFAULT '+227 96 00 00 00',
  services JSONB DEFAULT '["delivery", "takeaway", "booking"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des Plats et Boissons (Menu Items)
CREATE TABLE IF NOT EXISTS public.dishes (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  dish_category TEXT,
  image TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_halal BOOLEAN DEFAULT true,
  is_spicy BOOLEAN DEFAULT false,
  spice_level INTEGER DEFAULT 1,
  is_gluten_free BOOLEAN DEFAULT false,
  is_niger_local BOOLEAN DEFAULT false,
  is_express BOOLEAN DEFAULT false,
  is_chef_special BOOLEAN DEFAULT false,
  is_healthy BOOLEAN DEFAULT false,
  is_daily_special BOOLEAN DEFAULT false,
  is_menu_du_jour BOOLEAN DEFAULT false,
  menu_du_jour_includes TEXT,
  meal_moments JSONB DEFAULT '["dejeuner", "diner"]'::jsonb,
  meal_service_time TEXT,
  is_available BOOLEAN DEFAULT true,
  preparation_time INTEGER DEFAULT 20,
  calories INTEGER,
  allergens JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activer la lecture publique pour les clients
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (Tous les visiteurs peuvent voir le menu)
DROP POLICY IF EXISTS "Lecture publique des restaurants" ON public.restaurants;
CREATE POLICY "Lecture publique des restaurants" ON public.restaurants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lecture publique des plats" ON public.dishes;
CREATE POLICY "Lecture publique des plats" ON public.dishes FOR SELECT USING (true);

-- Politiques d'écriture (Permettre l'insertion, mise à jour et suppression par la clé anon)
DROP POLICY IF EXISTS "Gestion des restaurants" ON public.restaurants;
CREATE POLICY "Gestion des restaurants" ON public.restaurants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Gestion des plats" ON public.dishes;
CREATE POLICY "Gestion des plats" ON public.dishes FOR ALL USING (true) WITH CHECK (true);
`;

// Helper: Convert MenuItem to Supabase row format
export function mapDishToSupabaseRow(dish: MenuItem, restaurantId: string) {
  return {
    id: dish.id,
    restaurant_id: restaurantId,
    name: dish.name,
    description: dish.description || "",
    price: dish.price,
    category: dish.category || "africain",
    dish_category: dish.dishCategory || "africain",
    image: dish.image || "",
    is_popular: Boolean(dish.isPopular),
    is_vegetarian: Boolean(dish.isVegetarian),
    is_vegan: Boolean(dish.isVegan),
    is_halal: dish.isHalal !== false,
    is_spicy: Boolean(dish.isSpicy),
    spice_level: dish.spiceLevel ?? 1,
    is_gluten_free: Boolean(dish.isGlutenFree),
    is_niger_local: Boolean(dish.isNigerLocal),
    is_express: Boolean(dish.isExpress),
    is_chef_special: Boolean(dish.isChefSpecial),
    is_healthy: Boolean(dish.isHealthy),
    is_daily_special: Boolean(dish.isDailySpecial),
    is_menu_du_jour: Boolean(dish.isMenuDuJour),
    menu_du_jour_includes: dish.menuDuJourIncludes || null,
    meal_moments: dish.mealMoments || ["dejeuner", "diner"],
    meal_service_time: dish.mealServiceTime || null,
    is_available: dish.isAvailable !== false,
    preparation_time: dish.preparationTime || 20,
    calories: dish.calories || null,
    allergens: dish.allergens || [],
    options: dish.options || [],
    updated_at: new Date().toISOString(),
  };
}

// Helper: Convert Supabase row format to MenuItem
export function mapSupabaseRowToDish(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: Number(row.price),
    category: row.category || "africain",
    dishCategory: row.dish_category || "africain",
    image: row.image || "",
    isPopular: Boolean(row.is_popular),
    isVegetarian: Boolean(row.is_vegetarian),
    isVegan: Boolean(row.is_vegan),
    isHalal: row.is_halal !== false,
    isSpicy: Boolean(row.is_spicy),
    spiceLevel: Number(row.spice_level ?? 1),
    isGlutenFree: Boolean(row.is_gluten_free),
    isNigerLocal: Boolean(row.is_niger_local),
    isExpress: Boolean(row.is_express),
    isChefSpecial: Boolean(row.is_chef_special),
    isHealthy: Boolean(row.is_healthy),
    isDailySpecial: Boolean(row.is_daily_special),
    isMenuDuJour: Boolean(row.is_menu_du_jour),
    menuDuJourIncludes: row.menu_du_jour_includes || undefined,
    mealMoments: Array.isArray(row.meal_moments) ? row.meal_moments : ["dejeuner", "diner"],
    mealServiceTime: row.meal_service_time || undefined,
    isAvailable: row.is_available !== false,
    preparationTime: Number(row.preparation_time || 20),
    calories: row.calories ? Number(row.calories) : undefined,
    allergens: Array.isArray(row.allergens) ? row.allergens : [],
    options: Array.isArray(row.options) ? row.options : [],
  };
}

// Helper: Convert Restaurant to Supabase row format
export function mapRestaurantToSupabaseRow(resto: Restaurant) {
  return {
    id: resto.id,
    name: resto.name,
    tagline: resto.tagline || "",
    cuisine: resto.cuisine || "",
    cuisine_category: resto.cuisineCategory || "all",
    rating: resto.rating || 4.8,
    review_count: resto.reviewCount || 100,
    delivery_time: resto.deliveryTime || "25-40 min",
    min_order: resto.minOrder || 1000,
    delivery_fee: resto.deliveryFee || 500,
    address: resto.address || "Niamey, Niger",
    city: resto.city || "Niamey",
    image: resto.image || "",
    banner_image: resto.bannerImage || "",
    is_promoted: Boolean(resto.isPromoted),
    promo_badge: resto.promoBadge || null,
    is_open: resto.isOpen !== false,
    opening_hours: resto.openingHours || "07h30 - 23h00",
    phone: resto.phone || "+227 96 00 00 00",
    services: resto.services || ["delivery", "takeaway", "booking"],
    updated_at: new Date().toISOString(),
  };
}

// 1. Fetch all data from Supabase
export async function fetchRestaurantsFromSupabase(): Promise<{
  success: boolean;
  data?: Restaurant[];
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    // Fetch restaurants
    const { data: restosData, error: restosError } = await client
      .from("restaurants")
      .select("*")
      .order("name", { ascending: true });

    if (restosError) {
      return { success: false, error: restosError.message };
    }

    // Fetch all dishes
    const { data: dishesData, error: dishesError } = await client
      .from("dishes")
      .select("*")
      .order("name", { ascending: true });

    if (dishesError) {
      return { success: false, error: dishesError.message };
    }

    // If no restaurants in Supabase, return default fallback with dishes mapped
    if (!restosData || restosData.length === 0) {
      return { success: true, data: [] };
    }

    // Map dishes per restaurant
    const restaurants: Restaurant[] = restosData.map((r: any) => {
      const restoDishes = (dishesData || [])
        .filter((d: any) => d.restaurant_id === r.id)
        .map(mapSupabaseRowToDish);

      return {
        id: r.id,
        name: r.name,
        tagline: r.tagline || "",
        cuisine: r.cuisine || "",
        cuisineCategory: r.cuisine_category || "all",
        rating: Number(r.rating || 4.8),
        reviewCount: Number(r.review_count || 100),
        deliveryTime: r.delivery_time || "25-40 min",
        minOrder: Number(r.min_order || 1000),
        deliveryFee: Number(r.delivery_fee || 500),
        address: r.address || "Niamey, Niger",
        city: r.city || "Niamey",
        image: r.image || "",
        bannerImage: r.banner_image || "",
        isPromoted: Boolean(r.is_promoted),
        promoBadge: r.promo_badge || undefined,
        isOpen: r.is_open !== false,
        openingHours: r.opening_hours || "07h30 - 23h00",
        phone: r.phone || "+227 96 00 00 00",
        services: Array.isArray(r.services) ? r.services : ["delivery", "takeaway", "booking"],
        menu: restoDishes,
      };
    });

    return { success: true, data: restaurants };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// 2. Save / Upsert a single dish to Supabase
export async function saveDishToSupabase(
  dish: MenuItem,
  targetRestaurantId?: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase non configuré" };
  }

  const restoId = targetRestaurantId || "resto-khadys-food";

  try {
    // First ensure the restaurant exists
    const { data: existingResto } = await client
      .from("restaurants")
      .select("id")
      .eq("id", restoId)
      .single();

    if (!existingResto) {
      // Find matching default restaurant
      const defaultResto = RESTAURANTS_DATA.find((r) => r.id === restoId) || RESTAURANTS_DATA[0];
      await client.from("restaurants").upsert(mapRestaurantToSupabaseRow(defaultResto));
    }

    const row = mapDishToSupabaseRow(dish, restoId);
    const { error } = await client.from("dishes").upsert(row);

    if (error) {
      console.error("Supabase upsert dish error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase save dish exception:", err);
    return { success: false, error: err?.message || String(err) };
  }
}

// 3. Delete a dish from Supabase
export async function deleteDishFromSupabase(
  dishId: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: "Supabase non configuré" };
  }

  try {
    const { error } = await client.from("dishes").delete().eq("id", dishId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// 4. Synchronize all local restaurants & dishes to Supabase (One-Click Migration)
export async function syncAllLocalDataToSupabase(
  restaurants: Restaurant[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: "Supabase non configuré" };
  }

  try {
    // 1. Upsert all restaurants
    const restoRows = restaurants.map(mapRestaurantToSupabaseRow);
    const { error: restoErr } = await client.from("restaurants").upsert(restoRows);
    if (restoErr) {
      return { success: false, count: 0, error: `Erreur restaurants: ${restoErr.message}` };
    }

    // 2. Collect and upsert all dishes
    let totalDishes = 0;
    const allDishRows: any[] = [];

    restaurants.forEach((resto) => {
      resto.menu.forEach((dish) => {
        allDishRows.push(mapDishToSupabaseRow(dish, resto.id));
        totalDishes++;
      });
    });

    if (allDishRows.length > 0) {
      const { error: dishErr } = await client.from("dishes").upsert(allDishRows);
      if (dishErr) {
        return { success: false, count: 0, error: `Erreur plats: ${dishErr.message}` };
      }
    }

    return { success: true, count: totalDishes };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || String(err) };
  }
}
