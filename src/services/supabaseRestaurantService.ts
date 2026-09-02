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
      .or(`id.eq.${orderId},order_id.eq.${orderId}`);

    if (!error) {
      return true;
    }
  } catch (e) {
    console.warn("Could not sync order status to Supabase restaurant_orders:", e);
  }
  return false;
}

// Fetch orders from Supabase `restaurant_orders` table with fallback to `orders`
export async function fetchRestaurantOrdersFromSupabase(
  restaurantId?: string,
  restaurantName?: string
): Promise<Order[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    let query = client
      .from("restaurant_orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Only filter if not central kitchen admin
    if (
      restaurantId &&
      !restaurantId.includes("alloresto") &&
      restaurantId !== "resto-alloresto-kitchen" &&
      !restaurantId.includes("demo")
    ) {
      query = query.eq("restaurant_id", restaurantId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Error fetching from restaurant_orders, checking orders table:", error);
      // Fallback query from orders table
      const { data: rawOrders, error: rawError } = await client
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (rawError || !rawOrders) return [];

      return rawOrders.map((ro: any): Order => {
        const orderStatusMap: Record<string, OrderStatus> = {
          pending_confirmation: "received",
          pending: "received",
          to_confirm: "received",
          confirmed: "preparing",
          in_preparation: "preparing",
          preparing: "preparing",
          ready: "delivering",
          delivering: "delivering",
          delivered: "delivered",
          cancelled: "cancelled",
        };

        const statusKey = String(ro.status || "pending").toLowerCase();
        const mappedStatus = orderStatusMap[statusKey] || "received";

        return {
          id: ro.id || `ord-${Math.random().toString(36).substr(2, 6)}`,
          createdAt: ro.created_at || new Date().toISOString(),
          customerName: ro.customer_name || "Client Allôresto",
          customerPhone: ro.customer_phone || "+227 90 00 00 00",
          deliveryAddress: ro.delivery_address || "Niamey",
          city: "Niamey",
          serviceType: ro.fulfillment === "pickup" ? "takeaway" : "delivery",
          restaurantId: ro.restaurant_id || "resto-alloresto-kitchen",
          restaurantName: "Allôresto Kitchen (Cuisine Centrale)",
          restaurantPhone: "+227 96 00 00 00",
          items: [
            {
              id: `item-${ro.id}-1`,
              menuItem: {
                id: "dish-test-1",
                name: ro.notes?.includes("Riz") ? "Riz au gras spécial" : "Menu Commande Client",
                description: ro.notes || "Commande enregistrée via Supabase",
                price: Number(ro.subtotal_xof || ro.total_xof || 5000),
                category: "Plats Chauds",
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                isAvailable: true,
              },
              quantity: 1,
              selectedOptions: {},
              unitPrice: Number(ro.subtotal_xof || ro.total_xof || 5000),
              totalPrice: Number(ro.subtotal_xof || ro.total_xof || 5000),
              notes: ro.notes || undefined,
            },
          ],
          subtotal: Number(ro.subtotal_xof || ro.total_xof || 5000),
          deliveryFee: Number(ro.delivery_fee_xof || 1000),
          discount: Number(ro.discount_xof || 0),
          tip: 0,
          total: Number(ro.total_xof || 6000),
          paymentMethod: ro.payment_method?.includes("cash") ? "cash" : "mynita",
          paymentStatus: ro.payment_status === "paid" ? "paid" : "pending",
          orderStatus: mappedStatus,
          estimatedDeliveryTime: "25-35 min",
          deliveryPartner: "Billo Express Niamey 🏍️",
          kitchenNotes: ro.notes ? [ro.notes] : ["Commande Supabase en direct"],
        };
      });
    }

    if (!data || data.length === 0) return [];

    return data.map((ro: any): Order => {
      let parsedItems: any[] = [];
      if (Array.isArray(ro.items)) {
        parsedItems = ro.items;
      } else if (typeof ro.items === "string") {
        try {
          parsedItems = JSON.parse(ro.items);
        } catch {
          parsedItems = [];
        }
      }

      const orderStatusMap: Record<string, OrderStatus> = {
        pending: "received",
        to_confirm: "received",
        received: "received",
        confirmed: "preparing",
        in_preparation: "preparing",
        preparing: "preparing",
        ready: "delivering",
        delivering: "delivering",
        delivered: "delivered",
        cancelled: "cancelled",
      };

      const statusKey = String(ro.status || "pending").toLowerCase();
      const mappedStatus = orderStatusMap[statusKey] || "received";

      const mappedItems =
        parsedItems.length > 0
          ? parsedItems.map((it: any, idx: number) => ({
              id: `supa-it-${ro.id || ro.order_id}-${idx}`,
              menuItem: {
                id: `supa-dish-${idx}`,
                name: it.name || it.title || "Plat Allôresto",
                description: it.notes || "Plat sélectionné",
                price: Number(it.price || it.unitPrice || 2500),
                category: "Plats Chauds",
                image:
                  it.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                isAvailable: true,
                rating: 4.9,
                reviewsCount: 24,
              },
              quantity: Number(it.quantity || 1),
              selectedOptions: it.options || {},
              unitPrice: Number(it.price || it.unitPrice || 2500),
              totalPrice: Number((it.price || 2500) * (it.quantity || 1)),
              notes: it.notes,
            }))
          : [
              {
                id: `supa-default-${ro.id || ro.order_id}`,
                menuItem: {
                  id: "supa-dish-default",
                  name: ro.notes ? `Commande: ${ro.notes}` : "Formule Repas Allôresto",
                  description: "Commande enregistrée sur Supabase",
                  price: Number(ro.subtotal || 5000),
                  category: "Plats Chauds",
                  image:
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
                  isAvailable: true,
                  rating: 4.9,
                  reviewsCount: 18,
                },
                quantity: 1,
                selectedOptions: {},
                unitPrice: Number(ro.subtotal || 5000),
                totalPrice: Number(ro.subtotal || 5000),
                notes: ro.notes,
              },
            ];

      return {
        id: ro.order_id || ro.id || `ord-${ro.order_number || Date.now()}`,
        createdAt: ro.created_at || new Date().toISOString(),
        customerName: ro.customer_name || "Client Allôresto",
        customerPhone: ro.customer_phone || "+227 96 00 00 00",
        deliveryAddress: ro.customer_address || "Niamey Plateau",
        city: "Niamey",
        serviceType: "delivery",
        restaurantId: ro.restaurant_id || "resto-alloresto-kitchen",
        restaurantName: restaurantName || "Allôresto Kitchen (Cuisine Centrale)",
        restaurantPhone: "+227 96 00 00 00",
        items: mappedItems,
        subtotal: Number(ro.subtotal || 7700),
        deliveryFee: Number(ro.delivery_fee || 1000),
        discount: 0,
        tip: 0,
        total: Number(ro.total || 8700),
        paymentMethod: ro.payment_method?.includes("cash") ? "cash" : "mynita",
        paymentStatus: ro.payment_status === "paid" ? "paid" : "pending",
        orderStatus: mappedStatus,
        estimatedDeliveryTime: "20-30 min",
        deliveryPartner: "Billo Express Niamey 🏍️",
        kitchenNotes: ro.notes ? [ro.notes] : ["Commande Supabase live"],
      };
    });
  } catch (err) {
    console.warn("Exception fetching restaurant orders from Supabase:", err);
    return [];
  }
}

