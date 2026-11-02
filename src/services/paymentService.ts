import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface PaymentRecord {
  id: string;
  order_id: string;
  amount_xof: number;
  payment_method: string;
  payment_status: "awaiting_mobile_money_validation" | "paid" | "cash_on_delivery" | "failed" | "refunded" | "pending" | "completed";
  transaction_id: string;
  operator_reference?: string;
  mobile_money_reference?: string;
  phone_number: string;
  provider_response?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  ussdCode?: string;
  accountNumber?: string;
  is_active: boolean;
}

export const PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: "airtel_money",
    name: "Airtel Money Niger",
    logo: "🔴",
    color: "bg-red-600",
    description: "Paiement instantané *155#",
    ussdCode: "*155#",
    accountNumber: "+227 96 05 23 10",
    is_active: true,
  },
  {
    id: "moov_money",
    name: "Moov Money Niger",
    logo: "🔵",
    color: "bg-blue-600",
    description: "Paiement sécurisé *156#",
    ussdCode: "*156#",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "orange_zamany",
    name: "Orange Zamany",
    logo: "🟠",
    color: "bg-orange-500",
    description: "Rapide et fiable *144#",
    ussdCode: "*144#",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "flooz",
    name: "Flooz",
    logo: "💳",
    color: "bg-purple-600",
    description: "Mobile money Sahel",
    ussdCode: "*155#",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "mynita",
    name: "MyNita",
    logo: "📱",
    color: "bg-emerald-600",
    description: "Paiement agence & mobile",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "amanata",
    name: "Amanata",
    logo: "💰",
    color: "bg-teal-600",
    description: "Service de paiement national",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "all_iza",
    name: "All-Iza Business",
    logo: "🏦",
    color: "bg-indigo-600",
    description: "Compte marchand Al-Izza",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
  {
    id: "zeyna",
    name: "Zeyna",
    logo: "✨",
    color: "bg-pink-600",
    description: "Paiement digital & transfert",
    accountNumber: "+227 90 40 51 18",
    is_active: true,
  },
];

const PAYMENTS_STORAGE_KEY = "alloresto_mobile_money_payments";

export function getLocalPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    // Filtrer d'éventuelles anciennes données de démo (CMD-88*, CMD-87*)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (p: PaymentRecord) => !p.order_id?.startsWith("CMD-88") && !p.order_id?.startsWith("CMD-87")
      );
    }
    return [];
  } catch (err) {
    console.error("Error reading local payments:", err);
    return [];
  }
}

export function saveLocalPayments(payments: PaymentRecord[]): void {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  } catch (err) {
    console.error("Error saving local payments:", err);
  }
}

export async function fetchAllPayments(): Promise<PaymentRecord[]> {
  // If Supabase is connected, fetch from database first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        return data as PaymentRecord[];
      }
    } catch (err) {
      console.warn("Could not query Supabase payments table, falling back to local:", err);
    }
  }

  // Fallback to local storage
  return getLocalPayments();
}

export async function processPayment(params: {
  orderId: string;
  amount: number;
  paymentMethod: string;
  phoneNumber: string;
  reference?: string;
  paymentStatus?: "awaiting_mobile_money_validation" | "paid" | "cash_on_delivery" | "failed" | "refunded" | "pending" | "completed";
}): Promise<{ success: boolean; transactionId?: string; payment?: PaymentRecord; error?: string }> {
  const transactionPrefix = params.paymentMethod.toUpperCase().replace(/_MONEY/g, "");
  const transactionId = params.reference && params.reference.trim().length > 3
    ? params.reference.trim()
    : `${transactionPrefix}-${Date.now().toString().slice(-6)}`;

  // Statut logique :
  // Espèces -> cash_on_delivery (à encaisser par le coursier)
  // Mobile Money -> awaiting_mobile_money_validation (la référence déclarée par le client reste à valider par le gérant)
  const isCash = params.paymentMethod === "cash" || params.paymentMethod === "cash_on_delivery";
  const resolvedStatus =
    params.paymentStatus || (isCash ? "cash_on_delivery" : "awaiting_mobile_money_validation");

  try {
    // Try calling Express backend /api/payment/process first
    const res = await fetch("/api/payment/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: params.orderId,
        amount: params.amount,
        paymentMethod: params.paymentMethod,
        phoneNumber: params.phoneNumber,
        reference: transactionId,
        paymentStatus: resolvedStatus,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const newRecord: PaymentRecord = data.payment || {
          id: `pay_${Date.now()}`,
          order_id: params.orderId,
          amount_xof: params.amount,
          payment_method: params.paymentMethod,
          payment_status: resolvedStatus,
          transaction_id: transactionId,
          operator_reference: transactionId,
          mobile_money_reference: transactionId,
          phone_number: params.phoneNumber,
          provider_response: { status: resolvedStatus, reference: transactionId },
          created_at: new Date().toISOString(),
        };

        const list = getLocalPayments();
        saveLocalPayments([newRecord, ...list]);
        return { success: true, transactionId: newRecord.transaction_id, payment: newRecord };
      }
    }
  } catch (e) {
    console.warn("Backend API payment process call failed, executing client fallback:", e);
  }

  // Client-side execution with Supabase if configured
  const newPayment: PaymentRecord = {
    id: `pay_${Date.now()}`,
    order_id: params.orderId,
    amount_xof: params.amount,
    payment_method: params.paymentMethod,
    payment_status: resolvedStatus,
    transaction_id: transactionId,
    operator_reference: transactionId,
    mobile_money_reference: transactionId,
    phone_number: params.phoneNumber,
    provider_response: {
      status: resolvedStatus,
      reference: transactionId,
      gateway: "Allôresto Mobile Gateway Niger",
    },
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const paymentPayload: Record<string, any> = {
        order_id: params.orderId,
        amount_xof: Math.max(1, Number(params.amount || 0)),
        payment_method: params.paymentMethod,
        payment_status: resolvedStatus,
        transaction_id: transactionId,
        phone_number: params.phoneNumber,
        provider_response: { status: resolvedStatus, reference: transactionId },
      };
      if (transactionId) {
        paymentPayload.operator_reference = transactionId;
        paymentPayload.mobile_money_reference = transactionId;
      }

      let res = await (supabase.from("payments") as any).insert(paymentPayload);
      if (res.error && (res.error.message?.includes("operator_reference") || res.error.message?.includes("mobile_money_reference"))) {
        delete paymentPayload.operator_reference;
        delete paymentPayload.mobile_money_reference;
        res = await (supabase.from("payments") as any).insert(paymentPayload);
      }
    } catch (dbErr) {
      console.warn("Supabase insert error in payments table:", dbErr);
    }
  }

  // Update local storage
  const currentList = getLocalPayments();
  saveLocalPayments([newPayment, ...currentList]);

  return {
    success: true,
    transactionId,
    payment: newPayment,
  };
}

export function updatePaymentStatus(
  paymentId: string,
  newStatus: "pending" | "completed" | "failed" | "refunded"
): void {
  const list = getLocalPayments();
  const updated = list.map((p) =>
    p.id === paymentId ? { ...p, payment_status: newStatus, updated_at: new Date().toISOString() } : p
  );
  saveLocalPayments(updated);

  if (isSupabaseConfigured()) {
    Promise.resolve(
      (supabase.from("payments") as any)
        .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", paymentId)
    ).catch((e: any) => console.warn("Supabase payment status update error:", e));
  }
}
