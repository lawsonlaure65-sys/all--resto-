import { getSupabaseClient } from "./supabaseClient";
import { supabase } from "../lib/supabase";
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "../types";

export interface RestaurantUserSession {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  email: string;
  role: string;
}

/**
 * Authentifie un utilisateur pour l'espace Restaurant.
 * Règle de sécurité :
 * 1. Tente Supabase Auth (email / mot de passe).
 * 2. Vérifie dans public.profiles que le rôle est 'admin' ou 'restaurant'.
 *    - Si le rôle est 'customer' : accès strictement refusé (fail-closed).
 * 3. En cas d'échec Auth, vérifie la table spécialisée restaurant_users.
 */
export async function authenticateRestaurantUser(
  email: string,
  password: string
): Promise<{ success: boolean; session?: RestaurantUserSession; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  // 1. Tenter Supabase Auth officiel
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (!authError && authData.user) {
      // Vérifier le rôle strict dans public.profiles
      const { data: profile } = await (supabase.from("profiles") as any)
        .select("role, is_active, full_name")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (profile && profile.is_active === false) {
        return {
          success: false,
          error: "Votre compte est désactivé. Veuillez contacter la Direction Allôresto.",
        };
      }

      const role = profile?.role;
      if (role === "admin") {
        // La Direction HQ a tous les droits de supervision sur la cuisine centrale
        const session: RestaurantUserSession = {
          userId: authData.user.id,
          restaurantId: "resto-alloresto-kitchen",
          restaurantName: "Allôresto Kitchen (Cuisine Centrale)",
          email: authData.user.email || trimmedEmail,
          role: "Direction HQ (Admin)",
        };
        localStorage.setItem("alloresto_restaurant_session", JSON.stringify(session));
        return { success: true, session };
      } else if (role === "restaurant") {
        // Rôle restaurant vérifié
        const client = getSupabaseClient() || supabase;
        const { data: restoUser } = await (client.from("restaurant_users") as any)
          .select("restaurant_id, full_name, role")
          .eq("email", trimmedEmail)
          .maybeSingle();

        const session: RestaurantUserSession = {
          userId: authData.user.id,
          restaurantId: restoUser?.restaurant_id || "resto-alloresto-kitchen",
          restaurantName: restoUser?.full_name || "Restaurant Partenaire",
          email: authData.user.email || trimmedEmail,
          role: restoUser?.role || "Gérant Restaurant",
        };
        localStorage.setItem("alloresto_restaurant_session", JSON.stringify(session));
        return { success: true, session };
      } else {
        // Rôle customer ou indéfini : REFUS FERME
        return {
          success: false,
          error: "Accès refusé : ce compte possède le rôle 'Client'. L'espace restaurant est réservé aux cuisines partenaires et à la Direction.",
        };
      }
    }
  } catch (err) {
    console.warn("Supabase Auth check skipped or failed:", err);
  }

  // 2. Vérification dans la table restaurant_users
  const client = getSupabaseClient();
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

        localStorage.setItem("alloresto_restaurant_session", JSON.stringify(session));
        return { success: true, session };
      }
    } catch (err) {
      console.warn("Supabase restaurant auth error:", err);
    }
  }

  return {
    success: false,
    error: "Identifiants invalides ou compte non autorisé pour l'espace restaurant.",
  };
}

// Retrieve active restaurant session from localStorage
export function getActiveRestaurantSession(): RestaurantUserSession | null {
  try {
    const stored = localStorage.getItem("alloresto_restaurant_session");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.userId && parsed.restaurantId) {
        return parsed;
      }
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
        paymentMethod: (ro.payment_method || (ro.payment_status === "cash_on_delivery" ? "cash_on_delivery" : "airtel_money")) as PaymentMethod,
        paymentStatus: (ro.payment_status || (ro.payment_method?.includes("cash") ? "cash_on_delivery" : "awaiting_mobile_money_validation")) as PaymentStatus,
        mobile_money_reference: ro.operator_reference || undefined,
        paymentReference: ro.operator_reference || undefined,
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

/**
 * Enregistre une nouvelle commande confirmée dans Supabase.
 * Permet à la cuisine centrale et à Billo Express de la recevoir instantanément.
 */
export async function persistOrderToSupabase(order: Order): Promise<{ success: boolean; id?: string }> {
  const client = getSupabaseClient() || supabase;
  if (!client) return { success: false };

  try {
    const itemsJson = JSON.stringify(
      order.items.map((it) => ({
        name: it.menuItem.name,
        quantity: it.quantity,
        price: it.unitPrice,
        options: it.selectedOptions,
        notes: it.notes,
      }))
    );

    const isCash = order.paymentMethod === "cash" || order.paymentMethod === "cash_on_delivery";
    const paymentLabel = isCash
      ? `À encaisser par le coursier Billo Express: ${order.total.toLocaleString()} FCFA`
      : `En attente de validation Mobile Money (Réf: ${order.mobile_money_reference || order.paymentReference || "Non renseignée"})`;

    const notesSummary = [
      paymentLabel,
      order.scheduledTime ? `Horaire: ${order.scheduledTime}` : null,
      order.cashChangeAmount ? `Rendre monnaie sur: ${order.cashChangeAmount} FCFA` : null,
      order.paymentReference ? `Réf Mobile Money: ${order.paymentReference}` : null,
      order.receiptProofAttached ? "Capture / Preuve SMS fournie" : null,
    ]
      .filter(Boolean)
      .join(" • ");

    const basePayload: Record<string, any> = {
      order_id: order.id,
      restaurant_id: order.restaurantId || "resto-alloresto-kitchen",
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.deliveryAddress,
      items: itemsJson,
      subtotal: Math.max(0, Number(order.subtotal || 0)),
      delivery_fee: Math.max(0, Number(order.deliveryFee || 0)),
      total: Math.max(1, Number(order.total || 0)),
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus || (isCash ? "cash_on_delivery" : "awaiting_mobile_money_validation"),
      status: "pending",
      notes: notesSummary || null,
    };

    if (order.paymentReference && order.paymentReference.trim()) {
      basePayload.operator_reference = order.paymentReference.trim();
    }

    let insertRes = await (client.from("restaurant_orders") as any)
      .insert(basePayload)
      .select("id")
      .maybeSingle();

    // Si la colonne operator_reference n'existe pas encore sur une ancienne version de la table, repli sans bloquer
    if (insertRes.error && (insertRes.error.message?.includes("operator_reference") || insertRes.error.code === "PGRST204")) {
      delete basePayload.operator_reference;
      insertRes = await (client.from("restaurant_orders") as any)
        .insert(basePayload)
        .select("id")
        .maybeSingle();
    }

    const { data, error } = insertRes;

    if (error) {
      console.warn("[persistOrderToSupabase] restaurant_orders insert note:", error);
    }

    // Persistance dans public.orders & public.order_items (Chantier 2 : intégrité SQL)
    try {
      const orderPayload: Record<string, any> = {
        id: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        delivery_address: order.deliveryAddress,
        subtotal_xof: Math.max(0, Number(order.subtotal || 0)),
        discount_xof: Math.max(0, Number(order.discount || 0)),
        delivery_fee_xof: Math.max(0, Number(order.deliveryFee || 0)),
        total_xof: Math.max(1, Number(order.total || 0)),
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus || (isCash ? "cash_on_delivery" : "awaiting_mobile_money_validation"),
        order_status: "received",
      };

      if (order.mobile_money_reference || order.paymentReference) {
        orderPayload.mobile_money_reference = (order.mobile_money_reference || order.paymentReference)?.trim();
      }
      if (order.cashChangeAmount) {
        const parsedTendered = Number(order.cashChangeAmount);
        if (!isNaN(parsedTendered) && parsedTendered >= 0) {
          orderPayload.cash_tendered_xof = parsedTendered;
        }
      }

      const { error: orderErr } = await (client.from("orders") as any).insert(orderPayload);
      if (!orderErr && order.items && order.items.length > 0) {
        const itemsPayload = order.items.map((it) => ({
          order_id: order.id,
          quantity: Math.max(1, Number(it.quantity || 1)),
          unit_price_xof: Math.max(0, Number(it.unitPrice || 0)),
          options_total_xof: 0,
          line_total_xof: Math.max(0, Number(it.totalPrice || (it.unitPrice * (it.quantity || 1)))),
        }));
        await (client.from("order_items") as any).insert(itemsPayload);
      }
    } catch (sqlErr) {
      console.warn("[persistOrderToSupabase] orders/order_items SQL sync note:", sqlErr);
    }

    return { success: !error, id: data?.id };
  } catch (e) {
    console.warn("[persistOrderToSupabase] Error:", e);
    return { success: false };
  }
}

