'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';
import { supabase as defaultSupabase } from '../../../src/lib/supabase';
import { RESTAURANTS_DATA } from '../../../src/data/allorestoData';
import {
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
  Settings,
  MessageSquare,
  Sparkles,
  Search,
  Check,
  Store,
  Bike,
} from 'lucide-react';
import {
  AdminDeliveryDelayModal,
} from '../../../src/components/AdminDeliveryDelayModal';
import { AdminDelaySettingsModal } from '../../../src/components/AdminDelaySettingsModal';
import {
  DelayAutomationConfig,
  loadDelayAutomationConfig,
  saveDelayAutomationConfig,
} from '../../../src/utils/whatsappNotifications';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export type CanonicalOrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'assigned_to_driver'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface AdminOrder {
  id: string;
  display_ref: string;
  order_number?: number;
  fulfillment: 'delivery' | 'pickup';
  customer_name: string;
  customer_phone: string;
  restaurant_id?: string;
  restaurant_name: string;
  delivery_address: string;
  district: string;
  items: OrderItem[];
  subtotal_amount: number;
  discount_amount: number;
  tip_amount: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  mobile_money_reference?: string;
  status: CanonicalOrderStatus;
  driver_name?: string;
  created_at: string;
  notes?: string;
  scheduled_time?: string;
  delay_minutes?: number;
  delay_reason?: string;
  delay_notified_at?: string;
  delay_notified_count?: number;
}

const KNOWN_RESTAURANT_NAMES: Record<string, string> = {
  '99e2e632-4efd-4a44-8754-b806b50babfe': "Khady's Food & Event",
  'resto-khadys-food': "Khady's Food & Event",
  'a8168cb5-fe46-4368-85fa-be1a64d854b5': 'Allôresto Kitchen (Cuisine Centrale)',
  'resto-alloresto-kitchen': 'Allôresto Kitchen (Cuisine Centrale)',
};

function resolveRestaurantName(restaurantId?: string | null, restaurantName?: string | null): string {
  if (restaurantName && restaurantName.trim()) return restaurantName.trim();
  if (!restaurantId) return 'Restaurant non précisé';
  if (KNOWN_RESTAURANT_NAMES[restaurantId]) return KNOWN_RESTAURANT_NAMES[restaurantId];
  const found = RESTAURANTS_DATA.find((r) => r.id === restaurantId);
  return found?.name || restaurantId;
}

function normalizeDbStatus(raw?: string | null): CanonicalOrderStatus {
  const s = String(raw || 'pending_confirmation').toLowerCase();
  if (s === 'pending' || s === 'received' || s === 'to_confirm') return 'pending_confirmation';
  if (s === 'cooking' || s === 'in_preparation') return 'preparing';
  if (s === 'ready') return 'ready_for_pickup';
  if (s === 'delivering') return 'out_for_delivery';
  if (
    s === 'pending_confirmation' ||
    s === 'confirmed' ||
    s === 'preparing' ||
    s === 'ready_for_pickup' ||
    s === 'assigned_to_driver' ||
    s === 'out_for_delivery' ||
    s === 'delivered' ||
    s === 'cancelled'
  ) {
    return s;
  }
  return 'pending_confirmation';
}

function formatPaymentMethodLabel(method?: string): string {
  const m = String(method || '').toLowerCase();
  if (m === 'airtel_money') return '🔴 Airtel Money';
  if (m === 'moov_money' || m === 'flooz') return '🔵 Moov Flooz';
  if (m === 'al_izza') return '🟡 Al Izza';
  if (m === 'mynita') return '📱 MyNita';
  if (m === 'amanata') return '💰 Amanata';
  if (m === 'zamany_cash') return '🟠 Zamany Cash';
  if (m === 'zeyna') return '✨ Zeyna';
  if (m === 'cash_pickup') return '🏪 Espèces (Retrait)';
  if (m === 'cash_delivery' || m === 'cash' || m === 'cash_on_delivery') {
    return '💵 Espèces (Livraison)';
  }
  return m || 'Non précisé';
}

function formatStatusLabel(status: CanonicalOrderStatus): string {
  switch (status) {
    case 'pending_confirmation':
      return '⏳ En attente';
    case 'confirmed':
      return '✅ Confirmée';
    case 'preparing':
      return '🍳 En préparation';
    case 'ready_for_pickup':
      return '🛍️ Prête (retrait / coursier)';
    case 'assigned_to_driver':
      return '📋 Livreur assigné';
    case 'out_for_delivery':
      return '🛵 En livraison';
    case 'delivered':
      return '🎉 Terminée / Livrée';
    case 'cancelled':
      return '❌ Annulée';
  }
}

function mapSupabaseOrderRow(row: any): AdminOrder {
  const fulfillment: 'delivery' | 'pickup' =
    row.fulfillment === 'pickup' ? 'pickup' : 'delivery';

  const rawItems = Array.isArray(row.order_items) ? row.order_items : [];
  const items: OrderItem[] = rawItems.map((it: any, idx: number) => ({
    id: it.id || `item-${row.id}-${idx}`,
    name: it.product_name || it.dish_name || 'Plat Allôresto',
    quantity: Math.max(1, Number(it.quantity || 1)),
    price: Math.max(0, Number(it.unit_price_xof ?? 0)),
    notes: it.notes || undefined,
  }));

  const displayRef =
    row.client_order_ref ||
    (row.order_number ? `CMD-${row.order_number}` : String(row.id).slice(0, 8).toUpperCase());

  const defaultAddress =
    fulfillment === 'pickup' ? 'Retrait sur place' : 'Adresse non précisée';
  const defaultDistrict =
    fulfillment === 'pickup' ? 'Retrait sur place' : 'Niamey';

  return {
    id: String(row.id),
    display_ref: displayRef,
    order_number: typeof row.order_number === 'number' ? row.order_number : undefined,
    fulfillment,
    customer_name: row.customer_name || 'Client Allôresto',
    customer_phone: row.customer_phone || '',
    restaurant_id: row.restaurant_id || undefined,
    restaurant_name: resolveRestaurantName(row.restaurant_id, row.restaurant_name),
    delivery_address: row.delivery_address || defaultAddress,
    district: row.district || defaultDistrict,
    items,
    subtotal_amount: Number(row.subtotal_xof ?? 0),
    discount_amount: Number(row.discount_xof ?? 0),
    tip_amount: Number(row.tip_xof ?? 0),
    delivery_fee: Number(row.delivery_fee_xof ?? 0),
    total_amount: Number(row.total_xof ?? 0),
    payment_method: String(row.payment_method || (fulfillment === 'pickup' ? 'cash_pickup' : 'cash_delivery')),
    payment_status: String(row.payment_status || 'cash_due'),
    mobile_money_reference: row.mobile_money_reference || undefined,
    status: normalizeDbStatus(row.status),
    driver_name: row.driver_name || undefined,
    created_at: row.created_at || new Date().toISOString(),
    notes: row.notes || undefined,
    scheduled_time: row.scheduled_time || undefined,
    delay_minutes: typeof row.delay_minutes === 'number' ? row.delay_minutes : undefined,
    delay_reason: row.delay_reason || undefined,
    delay_notified_at: row.delay_notified_at || undefined,
    delay_notified_count: typeof row.delay_notified_count === 'number' ? row.delay_notified_count : undefined,
  };
}

interface AdminOrdersPageProps {
  isEmbedded?: boolean;
  onNavigate?: (tab: string) => void;
}

export default function AdminOrdersPage({ isEmbedded = false, onNavigate }: AdminOrdersPageProps = {}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'delivery' | 'pickup'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [delayFilter, setDelayFilter] = useState<'all' | 'delayed_unnotified' | 'delayed_notified' | 'on_time'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Delay Automation & Notification States
  const [delayConfig, setDelayConfig] = useState<DelayAutomationConfig>(loadDelayAutomationConfig());
  const [showDelaySettings, setShowDelaySettings] = useState<boolean>(false);
  const [orderForDelayModal, setOrderForDelayModal] = useState<AdminOrder | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  useEffect(() => {
    loadOrders();
    const loadedConfig = loadDelayAutomationConfig();
    setDelayConfig(loadedConfig);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 5000);
  };

  const loadOrders = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const client = getSupabaseClient() || defaultSupabase;
      if (!client) {
        setOrders([]);
        setLoadError("Client Supabase non configuré. Impossible de charger les commandes.");
        return;
      }

      // Lecture directe sur public.orders + public.order_items (aucune donnée de démonstration)
      const { data, error } = await (client.from('orders') as any)
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(200);

      if (!error && Array.isArray(data)) {
        setOrders(data.map(mapSupabaseOrderRow));
        return;
      }

      // Repli technique si la relation PostgREST order_items n'est pas encore en cache : requêtes séparées sur orders + order_items
      const { data: plainOrders, error: plainErr } = await (client.from('orders') as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (plainErr) {
        setOrders([]);
        setLoadError(
          plainErr.message ||
            "Erreur lors de la lecture des commandes dans Supabase (vérifiez la session admin et les droits RLS)."
        );
        return;
      }

      const rows = Array.isArray(plainOrders) ? plainOrders : [];
      const orderIds = rows.map((o: any) => o.id).filter(Boolean);
      let itemsByOrderId: Record<string, any[]> = {};

      if (orderIds.length > 0) {
        const { data: itemRows } = await (client.from('order_items') as any)
          .select('*')
          .in('order_id', orderIds);
        if (Array.isArray(itemRows)) {
          itemsByOrderId = itemRows.reduce((acc: Record<string, any[]>, item: any) => {
            if (!acc[item.order_id]) acc[item.order_id] = [];
            acc[item.order_id].push(item);
            return acc;
          }, {});
        }
      }

      setOrders(
        rows.map((o: any) =>
          mapSupabaseOrderRow({ ...o, order_items: itemsByOrderId[o.id] || [] })
        )
      );
    } catch (e: any) {
      setOrders([]);
      setLoadError(
        e?.message || 'Erreur réseau lors du chargement des commandes depuis Supabase.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: CanonicalOrderStatus) => {
    const previousOrders = orders;
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const client = getSupabaseClient() || defaultSupabase;
      if (!client) {
        throw new Error('Connexion Supabase indisponible.');
      }

      const now = new Date().toISOString();
      const payload: Record<string, any> = {
        status: newStatus,
        updated_at: now,
      };
      if (newStatus === 'confirmed') payload.confirmed_at = now;
      if (newStatus === 'delivered') payload.delivered_at = now;
      if (newStatus === 'cancelled') payload.cancelled_at = now;

      const { error } = await (client.from('orders') as any)
        .update(payload)
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      showToast(`Statut mis à jour : ${formatStatusLabel(newStatus)}`, 'success');
    } catch (e: any) {
      setOrders(previousOrders);
      showToast(
        `Échec de la mise à jour du statut : ${e?.message || 'erreur Supabase'}`,
        'error'
      );
    }
  };

  // Helper for computing delay info
  const getOrderDelayMetrics = (order: AdminOrder) => {
    const isTerminated = order.status === 'delivered' || order.status === 'cancelled';
    const elapsedMinutes = Math.max(
      0,
      Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)
    );
    const isDelayed = !isTerminated && elapsedMinutes >= delayConfig.thresholdMinutes;
    const overdueMinutes = Math.max(0, elapsedMinutes - delayConfig.thresholdMinutes);
    const alreadyNotified = !!order.delay_notified_at;

    return {
      elapsedMinutes,
      isDelayed,
      overdueMinutes,
      alreadyNotified,
      isTerminated,
    };
  };

  // Handle delay notification sent from modal
  const handleDelayNotificationSent = async (
    orderId: string,
    delayMinutes: number,
    reason: string
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const now = new Date().toISOString();
    const nextCount = (targetOrder?.delay_notified_count || 0) + 1;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              delay_minutes: delayMinutes,
              delay_reason: reason,
              delay_notified_at: now,
              delay_notified_count: nextCount,
            }
          : o
      )
    );

    try {
      const client = getSupabaseClient() || defaultSupabase;
      if (client) {
        await (client.from('orders') as any)
          .update({
            delay_minutes: delayMinutes,
            delay_reason: reason,
            delay_notified_at: now,
            delay_notified_count: nextCount,
            updated_at: now,
          })
          .eq('id', orderId);
      }
    } catch {
      // ignore optional delay columns if not yet migrated
    }

    showToast(
      `📲 Notification WhatsApp de retard (+${delayMinutes} min) envoyée à ${targetOrder?.customer_name || 'client'} !`,
      'success'
    );
  };

  // Quick toggle for Auto-Alerts
  const handleToggleAutoAlerts = () => {
    const updatedConfig: DelayAutomationConfig = {
      ...delayConfig,
      autoAlertEnabled: !delayConfig.autoAlertEnabled,
    };
    setDelayConfig(updatedConfig);
    saveDelayAutomationConfig(updatedConfig);
    showToast(
      updatedConfig.autoAlertEnabled
        ? `🔔 Détection et alertes retards activées (seuil: ${updatedConfig.thresholdMinutes} min).`
        : '🔕 Alertes retards automatiques désactivées (mode manuel).',
      'info'
    );
  };

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const metrics = getOrderDelayMetrics(order);
      const q = searchTerm.toLowerCase();

      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.display_ref.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.customer_phone.toLowerCase().includes(q) ||
        order.restaurant_name.toLowerCase().includes(q) ||
        order.district.toLowerCase().includes(q) ||
        order.delivery_address.toLowerCase().includes(q);

      const matchesFulfillment =
        fulfillmentFilter === 'all' || order.fulfillment === fulfillmentFilter;

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      let matchesPayment = true;
      if (paymentFilter === 'cash') {
        matchesPayment = order.payment_method.startsWith('cash');
      } else if (paymentFilter === 'flooz') {
        matchesPayment = order.payment_method === 'moov_money' || order.payment_method === 'flooz';
      } else if (paymentFilter !== 'all') {
        matchesPayment = order.payment_method === paymentFilter;
      }

      let matchesDelay = true;
      if (delayFilter === 'delayed_unnotified') {
        matchesDelay = metrics.isDelayed && !metrics.alreadyNotified;
      } else if (delayFilter === 'delayed_notified') {
        matchesDelay = metrics.isDelayed && metrics.alreadyNotified;
      } else if (delayFilter === 'on_time') {
        matchesDelay = !metrics.isDelayed && !metrics.isTerminated;
      }

      return matchesSearch && matchesFulfillment && matchesStatus && matchesPayment && matchesDelay;
    });
  }, [orders, searchTerm, fulfillmentFilter, statusFilter, paymentFilter, delayFilter, delayConfig]);

  // Global Delay Metrics
  const delayedOrders = useMemo(() => {
    return orders.filter((o) => getOrderDelayMetrics(o).isDelayed);
  }, [orders, delayConfig]);

  const unnotifiedDelayedOrders = useMemo(() => {
    return delayedOrders.filter((o) => !o.delay_notified_at);
  }, [delayedOrders]);

  const activeOrdersCount = orders.filter(
    (o) =>
      o.status === 'pending_confirmation' ||
      o.status === 'confirmed' ||
      o.status === 'preparing' ||
      o.status === 'ready_for_pickup' ||
      o.status === 'assigned_to_driver' ||
      o.status === 'out_for_delivery'
  ).length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div className={`min-h-screen ${isEmbedded ? 'p-0' : 'bg-slate-950 p-4 md:p-8 text-slate-100'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Notification Banner */}
        {toastNotification && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in ${
              toastNotification.type === 'error'
                ? 'bg-rose-950 border-rose-500/50 text-rose-200'
                : 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastNotification.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{toastNotification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="opacity-80 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Load Error Banner */}
        {loadError && (
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-rose-200">
                  Impossible de charger les commandes réelles depuis Supabase
                </p>
                <p className="text-rose-100/90 mt-0.5">{loadError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadOrders}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shrink-0"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Supervision des Commandes Niamey
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold">
                {orders.length} au total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Commandes réelles Supabase (`public.orders`) : livraisons &amp; retraits sur place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadOrders}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
              title="Rafraîchir les commandes"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDelaySettings(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Paramétrer les règles de notification de retard"
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>⚙️ Règles Retard WhatsApp</span>
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Supervision HQ
              </button>
            )}
          </div>
        </header>

        {/* DEDICATED BANNER: WHATSAPP DELIVERY DELAY NOTIFICATIONS */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-white">
                    Système d&apos;Alerte &amp; Notifications WhatsApp de Retard
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                      delayConfig.autoAlertEnabled
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        delayConfig.autoAlertEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    {delayConfig.autoAlertEnabled ? 'Actif (Détection Auto)' : 'Désactivé (Manuel)'}
                  </span>
                  <span className="text-[11px] text-amber-300/90 font-mono bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                    Seuil alerte : {delayConfig.thresholdMinutes} min
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Avertissez proactivement vos clients par WhatsApp en cas d&apos;embouteillage, forte affluence ou intempéries.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              <button
                type="button"
                onClick={handleToggleAutoAlerts}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  delayConfig.autoAlertEnabled
                    ? 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                }`}
              >
                <span>{delayConfig.autoAlertEnabled ? 'Désactiver Détection' : 'Activer Détection'}</span>
              </button>

              {unnotifiedDelayedOrders.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setOrderForDelayModal(unnotifiedDelayedOrders[0])}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 animate-pulse"
                >
                  <Send className="w-4 h-4" />
                  <span>Notifier Retard #{unnotifiedDelayedOrders[0].display_ref}</span>
                </button>
              ) : orders.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const firstOngoing =
                      orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') ||
                      orders[0];
                    if (firstOngoing) setOrderForDelayModal(firstOngoing);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tester une alerte type</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setShowDelaySettings(true)}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Configurer le message d'excuse et code promo"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Paramètres</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div
              onClick={() => setDelayFilter(delayFilter === 'delayed_unnotified' ? 'all' : 'delayed_unnotified')}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                delayFilter === 'delayed_unnotified'
                  ? 'bg-amber-950 border-amber-500 text-white'
                  : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold">Retards à notifier immédiatement</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono font-black text-xs ${
                  unnotifiedDelayedOrders.length > 0
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {unnotifiedDelayedOrders.length}
              </span>
            </div>

            <div
              onClick={() => setDelayFilter(delayFilter === 'delayed_notified' ? 'all' : 'delayed_notified')}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                delayFilter === 'delayed_notified'
                  ? 'bg-emerald-950 border-emerald-500 text-white'
                  : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">Retards déjà informés sur WhatsApp</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-black text-xs">
                {delayedOrders.length - unnotifiedDelayedOrders.length}
              </span>
            </div>

            <div
              onClick={() => setDelayFilter(delayFilter === 'on_time' ? 'all' : 'on_time')}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                delayFilter === 'on_time'
                  ? 'bg-blue-950 border-blue-500 text-white'
                  : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold">Dans les temps (&lt; {delayConfig.thresholdMinutes} min)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-500/30 font-mono font-black text-xs">
                {orders.filter((o) => !getOrderDelayMetrics(o).isDelayed && !getOrderDelayMetrics(o).isTerminated).length}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Volume Total</span>
            <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
            <span className="text-[11px] text-slate-500">
              {orders.filter((o) => o.fulfillment === 'delivery').length} livraisons &bull;{' '}
              {orders.filter((o) => o.fulfillment === 'pickup').length} retraits
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">En cours d&apos;exécution</span>
            <div className="text-2xl font-black text-orange-400 mt-1">{activeOrdersCount}</div>
            <span className="text-[11px] text-orange-300/80">Cuisine, retrait ou livraison active</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Terminées avec succès</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {orders.filter((o) => o.status === 'delivered').length}
            </div>
            <span className="text-[11px] text-emerald-400/80">Clients servis à Niamey</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Chiffre d&apos;Affaires Brut</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-slate-400">Hors commandes annulées</span>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (réf, client, tél, restaurant, quartier)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Filter by Fulfillment Mode */}
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tous modes (Livraison &amp; Retrait)</option>
              <option value="delivery">🛵 Livraison uniquement</option>
              <option value="pickup">🏪 Retrait sur place uniquement</option>
            </select>

            {/* Filter by Delay */}
            <select
              value={delayFilter}
              onChange={(e) => setDelayFilter(e.target.value as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                delayFilter !== 'all'
                  ? 'bg-amber-950 text-amber-300 border-amber-500'
                  : 'bg-slate-950 text-white border-slate-800'
              }`}
            >
              <option value="all">Tous délais</option>
              <option value="delayed_unnotified">⚠️ Retards à notifier ({unnotifiedDelayedOrders.length})</option>
              <option value="delayed_notified">✅ Retards déjà notifiés</option>
              <option value="on_time">⏱️ Dans les temps</option>
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tous statuts</option>
              <option value="pending_confirmation">⏳ En attente</option>
              <option value="confirmed">✅ Confirmée</option>
              <option value="preparing">🍳 En préparation</option>
              <option value="ready_for_pickup">🛍️ Prête</option>
              <option value="assigned_to_driver">📋 Livreur assigné</option>
              <option value="out_for_delivery">🛵 En livraison</option>
              <option value="delivered">🎉 Terminée / Livrée</option>
              <option value="cancelled">❌ Annulée</option>
            </select>

            {/* Filter by Payment */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Tous paiements</option>
              <option value="cash">Espèces</option>
              <option value="airtel_money">Airtel Money</option>
              <option value="flooz">Moov Flooz</option>
              <option value="al_izza">Al Izza</option>
              <option value="mynita">MyNita</option>
              <option value="amanata">Amanata</option>
              <option value="zamany_cash">Zamany Cash</option>
            </select>

            {(searchTerm ||
              fulfillmentFilter !== 'all' ||
              statusFilter !== 'all' ||
              paymentFilter !== 'all' ||
              delayFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFulfillmentFilter('all');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setDelayFilter('all');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Commande</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Restaurant</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Paiement</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Délai / Retard</th>
                  <th className="py-3.5 px-4">Livreur</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-slate-400">
                      Chargement des commandes réelles depuis Supabase...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-slate-500">
                      {orders.length === 0
                        ? 'Aucune commande enregistrée dans Supabase pour le moment.'
                        : 'Aucune commande ne correspond aux critères sélectionnés.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const metrics = getOrderDelayMetrics(order);
                    return (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition">
                        {/* ID */}
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{order.display_ref}</span>
                            {metrics.isDelayed && !metrics.alreadyNotified && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {new Date(order.created_at).toLocaleString([], {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        {/* Mode (Livraison vs Retrait) */}
                        <td className="py-3 px-4">
                          {order.fulfillment === 'pickup' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                              <Store className="w-3 h-3" />
                              Retrait
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                              <Bike className="w-3 h-3" />
                              Livraison
                            </span>
                          )}
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{order.customer_name}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">{order.customer_phone}</div>
                        </td>

                        {/* Restaurant */}
                        <td className="py-3 px-4 font-medium text-slate-200">{order.restaurant_name}</td>

                        {/* Destination */}
                        <td className="py-3 px-4">
                          <div className="text-white font-medium">{order.district}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {order.delivery_address}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 font-bold text-amber-300">
                          {order.total_amount.toLocaleString()} FCFA
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold block w-fit">
                            {formatPaymentMethodLabel(order.payment_method)}
                          </span>
                          {order.mobile_money_reference && (
                            <span className="text-[9px] text-orange-300 font-mono block mt-0.5">
                              Réf: {order.mobile_money_reference}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as CanonicalOrderStatus)
                            }
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : order.status === 'out_for_delivery' || order.status === 'assigned_to_driver'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : order.status === 'preparing' || order.status === 'ready_for_pickup'
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                : order.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            <option value="pending_confirmation">⏳ En attente</option>
                            <option value="confirmed">✅ Confirmée</option>
                            <option value="preparing">🍳 En préparation</option>
                            <option value="ready_for_pickup">🛍️ Prête</option>
                            <option value="assigned_to_driver">📋 Livreur assigné</option>
                            <option value="out_for_delivery">🛵 En livraison</option>
                            <option value="delivered">🎉 Terminée / Livrée</option>
                            <option value="cancelled">❌ Annulée</option>
                          </select>
                        </td>

                        {/* Delay / Real-time Status */}
                        <td className="py-3 px-4">
                          {metrics.isTerminated ? (
                            <span className="text-[11px] text-slate-500">
                              Terminée ({metrics.elapsedMinutes}m)
                            </span>
                          ) : metrics.isDelayed ? (
                            <div className="space-y-1">
                              {metrics.alreadyNotified ? (
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 w-fit">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Notifié (+{order.delay_minutes || 15}m)</span>
                                  </span>
                                  <span className="text-[9px] text-slate-400 block">
                                    {order.delay_notified_count || 1} alerte(s) envoyée(s)
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOrderForDelayModal(order)}
                                  className="px-2 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/50 text-[10px] font-black flex items-center gap-1 transition cursor-pointer shadow-sm hover:scale-105"
                                  title="Cliquer pour envoyer la notification WhatsApp au client"
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
                                  <span>RETARD (+{metrics.overdueMinutes}m)</span>
                                </button>
                              )}
                              <span className="text-[10px] text-slate-400 block font-mono">
                                ⏱️ {metrics.elapsedMinutes} min écoulées
                              </span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400">
                              <span className="text-emerald-400 font-bold">À l&apos;heure</span>
                              <span className="text-[10px] text-slate-500 block">
                                ({metrics.elapsedMinutes} min)
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Courier */}
                        <td className="py-3 px-4 text-[11px] text-slate-300">
                          {order.fulfillment === 'pickup' ? (
                            <span className="text-emerald-400/90 italic">Retrait comptoir</span>
                          ) : (
                            order.driver_name || <span className="text-slate-500 italic">Non assigné</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!metrics.isTerminated && (
                              <button
                                type="button"
                                onClick={() => setOrderForDelayModal(order)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                                  metrics.isDelayed && !metrics.alreadyNotified
                                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20'
                                    : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border-emerald-500/30'
                                }`}
                                title="Envoyer notification WhatsApp de retard au client"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>{metrics.alreadyNotified ? 'Relance' : 'Retard'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                            >
                              Détails
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Détails Commande */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-fade-in my-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white">
                      Commande {selectedOrder.display_ref}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {formatStatusLabel(selectedOrder.status)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/30 text-[10px] font-bold">
                      {selectedOrder.fulfillment === 'pickup' ? 'Retrait sur place' : 'Livraison'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Passée le {new Date(selectedOrder.created_at).toLocaleString()} &bull; ID:{' '}
                    <span className="font-mono text-[10px]">{selectedOrder.id}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Delay Tracking Highlight in Details Modal */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 to-slate-950 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Suivi Délais &amp; Alertes Client</span>
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono font-bold">
                    ⏱️ {getOrderDelayMetrics(selectedOrder).elapsedMinutes} min écoulées
                  </span>
                </div>

                {selectedOrder.delay_notified_at ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Client déjà notifié sur WhatsApp</span>
                    </div>
                    <div className="text-slate-300 text-[10px]">
                      Retard annoncé : +{selectedOrder.delay_minutes || 15} min &bull; Motif :{' '}
                      {selectedOrder.delay_reason || 'Affluence cuisine'}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Seuil de tolérance : {delayConfig.thresholdMinutes} minutes.
                    {getOrderDelayMetrics(selectedOrder).isDelayed && (
                      <span className="text-amber-400 font-bold block mt-0.5">
                        ⚠️ Dépassement de délai en cours ! Vous pouvez notifier le client dès maintenant.
                      </span>
                    )}
                  </p>
                )}

                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => {
                      const order = selectedOrder;
                      setSelectedOrder(null);
                      setOrderForDelayModal(order);
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>📲 Envoyer / Relancer Notification WhatsApp de Retard</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Restaurant &amp; Client :</div>
                  <div className="text-amber-300 font-bold">{selectedOrder.restaurant_name}</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customer_name}</div>
                  <div className="text-emerald-400 font-mono">{selectedOrder.customer_phone}</div>
                  <div className="text-orange-400">
                    {selectedOrder.delivery_address} ({selectedOrder.district})
                  </div>
                  {selectedOrder.scheduled_time && (
                    <div className="text-slate-300 text-[11px]">
                      Créneau souhaité : {selectedOrder.scheduled_time}
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                      Notes : {selectedOrder.notes}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-medium">Plats Commandés :</div>
                  {selectedOrder.items.length === 0 ? (
                    <div className="text-slate-500 italic">Aucun détail d&apos;article enregistré.</div>
                  ) : (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-200">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                    <span>Sous-total</span>
                    <span>{selectedOrder.subtotal_amount.toLocaleString()} FCFA</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Remise</span>
                      <span>-{selectedOrder.discount_amount.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Frais de livraison ({selectedOrder.district})</span>
                    <span>{selectedOrder.delivery_fee.toLocaleString()} FCFA</span>
                  </div>
                  {selectedOrder.tip_amount > 0 && (
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Pourboire</span>
                      <span>{selectedOrder.tip_amount.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="pt-1 flex justify-between items-center text-white font-black text-sm">
                    <span>Total Commande</span>
                    <span className="text-amber-400">
                      {selectedOrder.total_amount.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Logistique &amp; Paiement :</div>
                  <div className="text-white font-bold">
                    {selectedOrder.fulfillment === 'pickup'
                      ? 'Retrait client sur place'
                      : selectedOrder.driver_name || "En attente d'assignation Billo Express"}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    {formatPaymentMethodLabel(selectedOrder.payment_method)} &bull; Statut paiement :{' '}
                    <span className="font-mono text-orange-300">{selectedOrder.payment_status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Interactive Delay Notification */}
        {orderForDelayModal && (
          <AdminDeliveryDelayModal
            isOpen={!!orderForDelayModal}
            onClose={() => setOrderForDelayModal(null)}
            order={orderForDelayModal}
            onNotificationSent={handleDelayNotificationSent}
          />
        )}

        {/* Modal: Delay Rules & Settings */}
        {showDelaySettings && (
          <AdminDelaySettingsModal
            isOpen={showDelaySettings}
            onClose={() => setShowDelaySettings(false)}
            config={delayConfig}
            onSave={(newConfig) => {
              setDelayConfig(newConfig);
              showToast('Règles d’alerte WhatsApp enregistrées avec succès !', 'success');
            }}
          />
        )}
      </div>
    </div>
  );
}
