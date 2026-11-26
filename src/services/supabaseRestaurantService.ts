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

const LEGACY_TO_UUID_RESTAURANT_MAP: Record<string, string> = {
  "resto-khadys-food": "99e2e632-4efd-4a44-8754-b806b50babfe",
  "resto-alloresto-kitchen": "a8168cb5-fe46-4368-85fa-be1a64d854b5",
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resolveCanonicalRestaurantId(rawId?: string): string {
  const trimmed = (rawId || "").trim();
  if (!trimmed) return "";
  return LEGACY_TO_UUID_RESTAURANT_MAP[trimmed] || trimmed;
}

function mapUiStatusToDbStatus(status: string): string {
  const normalized = (status || "").toLowerCase();
  const map: Record<string, string> = {
    received: "pending_confirmation",
    pending: "pending_confirmation",
    pending_confirmation: "pending_confirmation",
    confirmed: "confirmed",
    preparing: "preparing",
    cooking: "preparing",
    ready: "ready_for_pickup",
    ready_for_pickup: "ready_for_pickup",
    assigned_to_driver: "assigned_to_driver",
    delivering: "out_for_delivery",
    out_for_delivery: "out_for_delivery",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[normalized] || "pending_confirmation";
}

function mapDbStatusToUiStatus(status?: string): OrderStatus {
  const normalized = String(status || "pending_confirmation").toLowerCase();
  const map: Record<string, OrderStatus> = {
    pending_confirmation: "received",
    pending: "received",
    to_confirm: "received",
    received: "received",
    confirmed: "preparing",
    in_preparation: "preparing",
    preparing: "preparing",
    cooking: "preparing",
    ready_for_pickup: "ready",
    ready: "ready",
    assigned_to_driver: "delivering",
    out_for_delivery: "delivering",
    delivering: "delivering",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[normalized] || "received";
}

// Sync order status to Supabase `public.orders` (no writes to legacy `restaurant_orders`)
export async function syncOrderStatusToSupabase(
  orderId: string,
  _restaurantId: string,
  newStatus: string
): Promise<boolean> {
  const client = getSupabaseClient() || supabase;
  if (!client || !orderId) return false;

  const dbStatus = mapUiStatusToDbStatus(newStatus);
  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    status: dbStatus,
    updated_at: now,
  };
  if (dbStatus === "confirmed") updatePayload.confirmed_at = now;
  if (dbStatus === "delivered") updatePayload.delivered_at = now;
  if (dbStatus === "cancelled") updatePayload.cancelled_at = now;

  try {
    let query = (client.from("orders") as any).update(updatePayload);
    if (UUID_REGEX.test(orderId)) {
      query = query.eq("id", orderId);
    } else {
      query = query.eq("client_order_ref", orderId);
    }
    const { error } = await query;
    return !error;
  } catch (e) {
    console.warn("Could not sync order status to Supabase public.orders:", e);
    return false;
  }
}

function mapPublicOrderRow(ro: any, fallbackRestaurantName?: string): Order {
  const rawItems = Array.isArray(ro.order_items) ? ro.order_items : [];
  const mappedItems = rawItems.map((it: any, idx: number) => {
    const qty = Math.max(1, Number(it.quantity || 1));
    const unitPrice = Math.max(0, Number(it.unit_price_xof || 0));
    const lineTotal = Math.max(0, Number(it.line_total_xof ?? unitPrice * qty));
    return {
      id: it.id || `item-${ro.id}-${idx}`,
      menuItem: {
        id: it.dish_id || it.product_id || `dish-${ro.id}-${idx}`,
        name: it.product_name || it.dish_name || "Plat Allôresto",
        description: it.notes || "Plat sélectionné",
        price: unitPrice,
        category: "Plats Chauds",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        isAvailable: true,
      },
      quantity: qty,
      selectedOptions:
        it.selected_options && typeof it.selected_options === "object"
          ? it.selected_options
          : {},
      unitPrice,
      totalPrice: lineTotal,
      notes: it.notes || undefined,
      restaurantId: ro.restaurant_id || undefined,
      restaurantName: ro.restaurant_name || fallbackRestaurantName || undefined,
    };
  });

  const subtotal = Number(ro.subtotal_xof ?? 0);
  const deliveryFee = Number(ro.delivery_fee_xof ?? 0);
  const discount = Number(ro.discount_xof ?? 0);
  const tip = Number(ro.tip_xof ?? 0);
  const total = Number(ro.total_xof ?? Math.max(0, subtotal - discount + deliveryFee + tip));

  return {
    id: ro.client_order_ref || ro.id || `CMD-${ro.order_number || Date.now()}`,
    dbId: ro.id,
    orderNumber: ro.order_number,
    idempotencyKey: ro.idempotency_key || undefined,
    createdAt: ro.created_at || new Date().toISOString(),
    customerName: ro.customer_name || "Client Allôresto",
    customerPhone: ro.customer_phone || "",
    deliveryAddress:
      ro.delivery_address ||
      (ro.fulfillment === "pickup" ? "Retrait sur place" : "Niamey"),
    district: ro.district || undefined,
    city: "Niamey",
    serviceType: ro.fulfillment === "pickup" ? "takeaway" : "delivery",
    restaurantId: ro.restaurant_id || "",
    restaurantName:
      ro.restaurant_name ||
      fallbackRestaurantName ||
      "Restaurant partenaire",
    restaurantPhone: "+227 96 05 23 10",
    items: mappedItems,
    subtotal,
    deliveryFee,
    discount,
    promoCode: ro.promo_code || undefined,
    tip,
    total,
    paymentMethod: (ro.payment_method || "cash_delivery") as PaymentMethod,
    paymentStatus: (ro.payment_status || "pending") as PaymentStatus,
    mobile_money_reference: ro.mobile_money_reference || undefined,
    paymentReference: ro.mobile_money_reference || undefined,
    orderStatus: mapDbStatusToUiStatus(ro.status),
    estimatedDeliveryTime: ro.fulfillment === "pickup" ? "20-30 min" : "35-50 min",
    scheduledTime: ro.scheduled_time || undefined,
    deliveryPartner:
      ro.fulfillment === "pickup" ? undefined : "Billo Express Niamey 🏍️",
    courierName: ro.driver_name || undefined,
    receiptProofAttached: Boolean(ro.receipt_proof_attached),
    kitchenNotes: ro.notes ? [ro.notes] : undefined,
  };
}

// Fetch orders from `public.orders` + `public.order_items` (primary source of truth).
// Keeps `restaurant_orders` strictly as a read-only legacy fallback with zero new writes.
export async function fetchRestaurantOrdersFromSupabase(
  restaurantId?: string,
  restaurantName?: string
): Promise<Order[]> {
  const client = getSupabaseClient() || supabase;
  if (!client) return [];

  const isCentralKitchen =
    !restaurantId ||
    restaurantId.includes("alloresto") ||
    restaurantId === "resto-alloresto-kitchen" ||
    restaurantId === "a8168cb5-fe46-4368-85fa-be1a64d854b5";

  try {
    let query = (client.from("orders") as any)
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!isCentralKitchen && restaurantId) {
      const canonicalId = resolveCanonicalRestaurantId(restaurantId);
      if (canonicalId !== restaurantId) {
        query = query.in("restaurant_id", [restaurantId, canonicalId]);
      } else {
        query = query.eq("restaurant_id", restaurantId);
      }
    }

    const { data: ordersData, error: ordersErr } = await query;

    if (!ordersErr && Array.isArray(ordersData) && ordersData.length > 0) {
      return ordersData.map((ro: any) => mapPublicOrderRow(ro, restaurantName));
    }

    // Si la jointure order_items(*) n'est pas disponible dans le cache PostgREST, relire orders + order_items séparément
    if (ordersErr) {
      let plainQuery = (client.from("orders") as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!isCentralKitchen && restaurantId) {
        const canonicalId = resolveCanonicalRestaurantId(restaurantId);
        if (canonicalId !== restaurantId) {
          plainQuery = plainQuery.in("restaurant_id", [restaurantId, canonicalId]);
        } else {
          plainQuery = plainQuery.eq("restaurant_id", restaurantId);
        }
      }

      const { data: plainOrders, error: plainErr } = await plainQuery;
      if (!plainErr && Array.isArray(plainOrders) && plainOrders.length > 0) {
        const orderIds = plainOrders.map((o: any) => o.id).filter(Boolean);
        let itemsByOrderId: Record<string, any[]> = {};
        if (orderIds.length > 0) {
          const { data: itemsRows } = await (client.from("order_items") as any)
            .select("*")
            .in("order_id", orderIds);
          if (Array.isArray(itemsRows)) {
            itemsByOrderId = itemsRows.reduce((acc: Record<string, any[]>, row: any) => {
              if (!acc[row.order_id]) acc[row.order_id] = [];
              acc[row.order_id].push(row);
              return acc;
            }, {});
          }
        }
        return plainOrders.map((ro: any) =>
          mapPublicOrderRow({ ...ro, order_items: itemsByOrderId[ro.id] || [] }, restaurantName)
        );
      }
    }

    // Lecture ancienne uniquement (restaurant_orders) sans aucune écriture
    let legacyQuery = (client.from("restaurant_orders") as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!isCentralKitchen && restaurantId) {
      legacyQuery = legacyQuery.eq("restaurant_id", restaurantId);
    }

    const { data: legacyData, error: legacyError } = await legacyQuery;
    if (legacyError || !Array.isArray(legacyData) || legacyData.length === 0) {
      return [];
    }

    return legacyData.map((ro: any): Order => {
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

      const mappedItems = parsedItems.map((it: any, idx: number) => ({
        id: `legacy-it-${ro.id || ro.order_id}-${idx}`,
        menuItem: {
          id: `legacy-dish-${idx}`,
          name: it.name || it.title || "Plat Allôresto",
          description: it.notes || "Plat sélectionné",
          price: Number(it.price || it.unitPrice || 0),
          category: "Plats Chauds",
          image:
            it.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          isAvailable: true,
        },
        quantity: Number(it.quantity || 1),
        selectedOptions: it.options || {},
        unitPrice: Number(it.price || it.unitPrice || 0),
        totalPrice: Number((it.price || it.unitPrice || 0) * (it.quantity || 1)),
        notes: it.notes,
      }));

      const isPickupLegacy =
        typeof ro.customer_address === "string" &&
        (ro.customer_address.includes("Point de retrait") ||
          ro.customer_address.toLowerCase().includes("retrait"));

      return {
        id: ro.order_id || ro.id || `ord-${ro.order_number || Date.now()}`,
        createdAt: ro.created_at || new Date().toISOString(),
        customerName: ro.customer_name || "Client Allôresto",
        customerPhone: ro.customer_phone || "",
        deliveryAddress: ro.customer_address || "Niamey",
        city: "Niamey",
        serviceType: isPickupLegacy ? "takeaway" : "delivery",
        restaurantId: ro.restaurant_id || "",
        restaurantName: restaurantName || "Restaurant partenaire",
        restaurantPhone: "+227 96 00 00 00",
        items: mappedItems,
        subtotal: Number(ro.subtotal || 0),
        deliveryFee: Number(ro.delivery_fee || 0),
        discount: 0,
        tip: 0,
        total: Number(ro.total || 0),
        paymentMethod: (ro.payment_method || "cash_delivery") as PaymentMethod,
        paymentStatus: (ro.payment_status || "pending") as PaymentStatus,
        mobile_money_reference: ro.operator_reference || undefined,
        paymentReference: ro.operator_reference || undefined,
        orderStatus: mapDbStatusToUiStatus(ro.status),
        estimatedDeliveryTime: "20-30 min",
        deliveryPartner: isPickupLegacy ? undefined : "Billo Express Niamey 🏍️",
        kitchenNotes: ro.notes ? [ro.notes] : undefined,
      };
    });
  } catch (err) {
    console.warn("Exception fetching orders from Supabase:", err);
    return [];
  }
}

function generateClientUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Enregistre une nouvelle commande dans `public.orders` et `public.order_items` uniquement.
 * Aucune écriture dans `restaurant_orders`, aucun repli automatique vers KHADY'S.
 */
export async function persistOrderToSupabase(
  order: Order
): Promise<{
  success: boolean;
  id?: string;
  orderNumber?: number;
  duplicate?: boolean;
  error?: string;
}> {
  const client = getSupabaseClient() || supabase;
  if (!client) {
    return {
      success: false,
      error: "Connexion à la base Supabase indisponible. Vérifiez votre réseau et réessayez.",
    };
  }

  const resolvedRestoId = resolveCanonicalRestaurantId(order.restaurantId);
  if (!resolvedRestoId) {
    return {
      success: false,
      error: "Restaurant introuvable pour ce panier. Veuillez sélectionner un restaurant valide.",
    };
  }

  if (!order.items || order.items.length === 0) {
    return {
      success: false,
      error: "Votre panier est vide. Ajoutez au moins un plat avant de commander.",
    };
  }

  const isCash =
    order.paymentMethod === "cash" ||
    order.paymentMethod === "cash_on_delivery" ||
    order.paymentMethod === "cash_delivery" ||
    order.paymentMethod === "cash_pickup";

  const fulfillmentType: "delivery" | "pickup" =
    order.serviceType === "takeaway" || order.deliveryAddress?.includes("Point de retrait")
      ? "pickup"
      : "delivery";

  let resolvedPaymentMethod = String(order.paymentMethod || "");
  if (resolvedPaymentMethod === "cash" || resolvedPaymentMethod === "cash_on_delivery") {
    resolvedPaymentMethod = fulfillmentType === "pickup" ? "cash_pickup" : "cash_delivery";
  } else if (
    resolvedPaymentMethod === "al_izza_cash" ||
    resolvedPaymentMethod === "al_izza_business" ||
    resolvedPaymentMethod === "al_izza_transfer"
  ) {
    resolvedPaymentMethod = "al_izza";
  }

  const resolvedPaymentStatus = isCash
    ? "cash_due"
    : order.paymentStatus || "awaiting_mobile_money_validation";

  const paymentLabel = isCash
    ? `À encaisser (${fulfillmentType === "pickup" ? "retrait" : "livraison"}): ${order.total.toLocaleString()} FCFA`
    : `Mobile Money (${resolvedPaymentMethod}) — Réf: ${order.mobile_money_reference || order.paymentReference || "Non renseignée"}`;

  const notesSummary = [
    paymentLabel,
    order.scheduledTime ? `Horaire: ${order.scheduledTime}` : null,
    order.cashChangeAmount ? `Monnaie demandée sur: ${order.cashChangeAmount} FCFA` : null,
    order.receiptProofAttached ? "Preuve SMS jointe" : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const parsedTendered = order.cashChangeAmount ? Number(order.cashChangeAmount) : null;
  const cashTenderedXof =
    parsedTendered !== null && !Number.isNaN(parsedTendered) && parsedTendered >= 0
      ? Math.round(parsedTendered)
      : null;

  const subtotalXof = Math.max(0, Math.round(Number(order.subtotal || 0)));
  const discountXof = Math.max(0, Math.round(Number(order.discount || 0)));
  const deliveryFeeXof = Math.max(0, Math.round(Number(order.deliveryFee || 0)));
  const tipXof = Math.max(0, Math.round(Number(order.tip || 0)));
  const totalXof = Math.max(0, subtotalXof - discountXof + deliveryFeeXof + tipXof);
  const mobileMoneyRef = (order.mobile_money_reference || order.paymentReference || "").trim() || null;
  const idempotencyKey = (order.idempotencyKey || `${order.id}-${resolvedRestoId}`).trim();

  const itemsForDb = order.items.map((it) => {
    const qty = Math.max(1, Math.round(Number(it.quantity || 1)));
    const unitPriceXof = Math.max(0, Math.round(Number(it.unitPrice ?? it.menuItem?.price ?? 0)));
    return {
      dish_id: it.menuItem?.id || null,
      product_name: it.menuItem?.name || "Plat Allôresto",
      unit_price_xof: unitPriceXof,
      quantity: qty,
      selected_options: it.selectedOptions || {},
      options_total_xof: 0,
      line_total_xof: unitPriceXof * qty,
      notes: it.notes || null,
    };
  });

  try {
    // 1. Voie principale atomique & idempotente via RPC create_alloresto_order
    const { data: rpcData, error: rpcError } = await (client as any).rpc(
      "create_alloresto_order",
      {
        p_idempotency_key: idempotencyKey,
        p_client_order_ref: order.id,
        p_restaurant_id: resolvedRestoId,
        p_restaurant_name: order.restaurantName || null,
        p_fulfillment: fulfillmentType,
        p_payment_method: resolvedPaymentMethod,
        p_payment_status: resolvedPaymentStatus,
        p_customer_name: order.customerName.trim(),
        p_customer_phone: order.customerPhone.trim(),
        p_delivery_address: order.deliveryAddress || null,
        p_district: order.district || null,
        p_notes: notesSummary || null,
        p_scheduled_time: order.scheduledTime || null,
        p_promo_code: order.promoCode || null,
        p_mobile_money_reference: mobileMoneyRef,
        p_receipt_proof_attached: Boolean(order.receiptProofAttached),
        p_cash_tendered_xof: cashTenderedXof,
        p_subtotal_xof: subtotalXof,
        p_discount_xof: discountXof,
        p_delivery_fee_xof: deliveryFeeXof,
        p_tip_xof: tipXof,
        p_items: itemsForDb,
      }
    );

    if (!rpcError && rpcData) {
      return {
        success: true,
        id: rpcData.id,
        orderNumber: rpcData.order_number,
        duplicate: Boolean(rpcData.duplicate),
      };
    }

    const isRpcMissing =
      rpcError &&
      (rpcError.code === "PGRST202" ||
        rpcError.code === "42883" ||
        rpcError.message?.includes("create_alloresto_order"));

    if (rpcError && !isRpcMissing) {
      return {
        success: false,
        error: rpcError.message || "Erreur lors de l'enregistrement de la commande.",
      };
    }

    // 2. Fallback direct sur public.orders + public.order_items uniquement si la RPC n'est pas encore déployée
    const orderUuid = generateClientUuid();
    let activeUserId: string | null = null;
    try {
      const { data: sessionData } = await client.auth.getSession();
      if (sessionData?.session?.user?.id) {
        const { data: profileRow } = await (client.from("profiles") as any)
          .select("id")
          .eq("id", sessionData.session.user.id)
          .maybeSingle();
        if (profileRow?.id) activeUserId = profileRow.id;
      }
    } catch {
      activeUserId = null;
    }

    const orderInsertPayload: Record<string, any> = {
      id: orderUuid,
      user_id: activeUserId,
      restaurant_id: resolvedRestoId,
      restaurant_name: order.restaurantName || null,
      client_order_ref: order.id,
      idempotency_key: idempotencyKey,
      fulfillment: fulfillmentType,
      status: "pending_confirmation",
      payment_method: resolvedPaymentMethod,
      payment_status: resolvedPaymentStatus,
      customer_name: order.customerName.trim(),
      customer_phone: order.customerPhone.trim(),
      delivery_address: order.deliveryAddress || null,
      district: order.district || null,
      notes: notesSummary || null,
      scheduled_time: order.scheduledTime || null,
      promo_code: order.promoCode || null,
      mobile_money_reference: mobileMoneyRef,
      receipt_proof_attached: Boolean(order.receiptProofAttached),
      cash_tendered_xof: cashTenderedXof,
      subtotal_xof: subtotalXof,
      discount_xof: discountXof,
      delivery_fee_xof: deliveryFeeXof,
      tip_xof: tipXof,
      total_xof: totalXof,
    };

    const { error: insertOrderErr } = await (client.from("orders") as any).insert(
      orderInsertPayload
    );

    if (insertOrderErr) {
      // Conflit d'idempotence (commande déjà enregistrée pour cette clé)
      if (insertOrderErr.code === "23505" && insertOrderErr.message?.includes("idempotency")) {
        return { success: true, id: orderUuid, duplicate: true };
      }
      return {
        success: false,
        error:
          insertOrderErr.message ||
          "Impossible d'enregistrer la commande dans Supabase (public.orders).",
      };
    }

    const itemsPayload = itemsForDb.map((it) => ({
      order_id: orderUuid,
      ...it,
    }));

    const { error: insertItemsErr } = await (client.from("order_items") as any).insert(
      itemsPayload
    );

    if (insertItemsErr) {
      return {
        success: false,
        error:
          insertItemsErr.message ||
          "La commande a été créée sans ses articles (public.order_items). Veuillez contacter le support.",
      };
    }

    return {
      success: true,
      id: orderUuid,
    };
  } catch (e: any) {
    console.warn("[persistOrderToSupabase] Error:", e);
    return {
      success: false,
      error: e?.message || "Erreur réseau lors de la validation de votre commande.",
    };
  }
}

