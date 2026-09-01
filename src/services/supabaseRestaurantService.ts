import { getSupabaseClient } from "./supabaseClient";
import { Order, OrderStatus } from "../types";

export interface RestaurantUserSession {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  email: string;
  role: string;
}

export const DEMO_RESTAURANT_ACCOUNTS: Array<{
  email: string;
  password: string;
  restaurantId: string;
  restaurantName: string;
  role: string;
}> = [
  {
    email: "restaurant@alloresto.ne",
    password: "admin123",
    restaurantId: "resto-alloresto-kitchen",
    restaurantName: "Allôresto Kitchen (Cuisine Centrale)",
    role: "Administrateur Restaurant",
  },
  {
    email: "kitchen@alloresto.ne",
    password: "alloresto2026",
    restaurantId: "resto-khadys-food",
    restaurantName: "Allôresto Kitchen / Khady's Food",
    role: "Chef Gérant",
  },
  {
    email: "sahel@alloresto.ne",
    password: "sahel2026",
    restaurantId: "resto-saveurs-sahel",
    restaurantName: "Saveurs du Sahel",
    role: "Responsable Cuisine",
  },
  {
    email: "gourmet@alloresto.ne",
    password: "gourmet2026",
    restaurantId: "resto-gourmet-fleuve",
    restaurantName: "Le Gourmet du Fleuve",
    role: "Manager",
  },
];

// Authenticate against Supabase `restaurant_users` or fallback to verified demo accounts
export async function authenticateRestaurantUser(
  email: string,
  password: string
): Promise<{ success: boolean; session?: RestaurantUserSession; error?: string }> {
  const client = getSupabaseClient();
  const trimmedEmail = email.trim().toLowerCase();

  // 1. Try Supabase if client is active
  if (client) {
    try {
      const { data, error } = await client
        .from("restaurant_users")
        .select("id, restaurant_id, email, full_name, role, is_active")
        .eq("email", trimmedEmail)
        .eq("password_hash", password)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        // Fetch restaurant name
        let restaurantName = data.full_name || "Restaurant Partenaire";
        const { data: restoData } = await client
          .from("restaurants")
          .select("name")
          .eq("id", data.restaurant_id)
          .maybeSingle();

        if (restoData?.name) {
          restaurantName = restoData.name;
        }

        const session: RestaurantUserSession = {
          userId: data.id,
          restaurantId: data.restaurant_id,
          restaurantName,
          email: data.email,
          role: data.role || "manager",
        };

        // Persist session
        localStorage.setItem("alloresto_restaurant_session", JSON.stringify(session));
        localStorage.setItem("restaurant_id", session.restaurantId);
        localStorage.setItem("restaurant_name", session.restaurantName);
        localStorage.setItem("restaurant_user_id", session.userId);

        return { success: true, session };
      }
    } catch (err) {
      console.warn("Supabase restaurant auth error, trying local demo fallback:", err);
    }
  }

  // 2. Demo accounts validation fallback
  const demo = DEMO_RESTAURANT_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === trimmedEmail && acc.password === password
  );

  if (demo) {
    const session: RestaurantUserSession = {
      userId: `demo-user-${demo.restaurantId}`,
      restaurantId: demo.restaurantId,
      restaurantName: demo.restaurantName,
      email: demo.email,
      role: demo.role,
    };

    localStorage.setItem("alloresto_restaurant_session", JSON.stringify(session));
    localStorage.setItem("restaurant_id", session.restaurantId);
    localStorage.setItem("restaurant_name", session.restaurantName);
    localStorage.setItem("restaurant_user_id", session.userId);

    return { success: true, session };
  }

  return {
    success: false,
    error: "Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.",
  };
}

// Retrieve active restaurant session from localStorage
export function getActiveRestaurantSession(): RestaurantUserSession | null {
  try {
    const stored = localStorage.getItem("alloresto_restaurant_session");
    if (stored) {
      return JSON.parse(stored);
    }
    const legacyId = localStorage.getItem("restaurant_id");
    const legacyName = localStorage.getItem("restaurant_name");
    if (legacyId) {
      return {
        userId: localStorage.getItem("restaurant_user_id") || "user-1",
        restaurantId: legacyId,
        restaurantName: legacyName || "Allôresto Kitchen",
        email: "kitchen@alloresto.ne",
        role: "Gérant",
      };
    }
  } catch (e) {
    console.error("Error parsing restaurant session:", e);
  }
  return null;
}

// Clear restaurant session
export function logoutRestaurantSession(): void {
  localStorage.removeItem("alloresto_restaurant_session");
  localStorage.removeItem("restaurant_id");
  localStorage.removeItem("restaurant_user_id");
  localStorage.removeItem("restaurant_name");
}

// Sync order status to Supabase `restaurant_orders` if table exists
export async function syncOrderStatusToSupabase(
  orderId: string,
  restaurantId: string,
  newStatus: string
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from("restaurant_orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .match({ id: orderId, restaurant_id: restaurantId });

    if (!error) {
      return true;
    }
  } catch (e) {
    console.warn("Could not sync order status to Supabase restaurant_orders:", e);
  }
  return false;
}
