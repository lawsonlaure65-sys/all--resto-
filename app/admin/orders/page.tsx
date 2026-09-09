'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';
import {
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw,
  Settings,
  MessageSquare,
  Phone,
  Gift,
  Sparkles,
  Filter,
  Search,
  Check,
  ChefHat,
  Bike,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  AdminDeliveryDelayModal,
  DelayModalOrder,
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
}

export interface AdminOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  restaurant_name: string;
  delivery_address: string;
  district: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  payment_method: 'airtel_money' | 'flooz' | 'al_izza' | 'cash';
  payment_status: 'paid' | 'pending';
  status: 'pending' | 'confirmed' | 'cooking' | 'delivering' | 'delivered' | 'cancelled';
  driver_name?: string;
  created_at: string;
  delay_minutes?: number;
  delay_reason?: string;
  delay_notified_at?: string;
  delay_notified_count?: number;
}

// Generates dynamic sample orders relative to current time so delays are live and demonstrative
const getInitialSampleOrders = (): AdminOrder[] => {
  const now = Date.now();
  return [
    {
      id: 'ORD-9821',
      customer_name: 'Fatima Amadou',
      customer_phone: '+227 90 22 33 44',
      restaurant_name: 'Cuisine & Saveurs du Sahel',
      delivery_address: 'Villa 14, Rue du Grand Marché',
      district: 'Plateau',
      items: [
        { id: '1', name: 'Choukouya de Mouton Royal', quantity: 2, price: 6500 },
        { id: '2', name: 'Jus de Bissap Glacé', quantity: 2, price: 1000 },
      ],
      total_amount: 15000,
      delivery_fee: 1000,
      payment_method: 'airtel_money',
      payment_status: 'paid',
      status: 'delivering',
      driver_name: 'Moussa Ibrahim (Moto RN-8821-B)',
      created_at: new Date(now - 42 * 60 * 1000).toISOString(), // 42 minutes ago (delay detected!)
    },
    {
      id: 'ORD-9820',
      customer_name: 'Dr. Boubacar Seydou',
      customer_phone: '+227 96 55 66 77',
      restaurant_name: 'Le Dambou d’Or Niamey',
      delivery_address: 'Bâtiment Rectorat UAM',
      district: 'Harobanda',
      items: [
        { id: '3', name: 'Dambou Blanc & Moringa Bio', quantity: 3, price: 3500 },
        { id: '4', name: 'Capitaine Grillé du Fleuve', quantity: 1, price: 8000 },
      ],
      total_amount: 19500,
      delivery_fee: 1000,
      payment_method: 'flooz',
      payment_status: 'paid',
      status: 'cooking',
      driver_name: 'En attente d’assignation Billo Express',
      created_at: new Date(now - 36 * 60 * 1000).toISOString(), // 36 minutes ago (delay detected!)
    },
    {
      id: 'ORD-9819',
      customer_name: 'Mariama Hassane',
      customer_phone: '+227 94 11 22 33',
      restaurant_name: 'Fast Food Le Sahel',
      delivery_address: 'Cité Députés, Porte 08',
      district: 'Koira Kano',
      items: [
        { id: '5', name: 'Burger Sahel Double Steak', quantity: 2, price: 4000 },
        { id: '6', name: 'Frites de Patate Douce', quantity: 2, price: 1500 },
      ],
      total_amount: 12000,
      delivery_fee: 1000,
      payment_method: 'cash',
      payment_status: 'pending',
      status: 'confirmed',
      driver_name: 'Salifou Bello (KTM 150cc)',
      created_at: new Date(now - 14 * 60 * 1000).toISOString(), // 14 minutes ago (on time)
    },
    {
      id: 'ORD-9818',
      customer_name: 'Abdoul-Kader',
      customer_phone: '+227 88 99 00 11',
      restaurant_name: 'Massa & Douceurs de Niamey',
      delivery_address: 'Face Station Dan Kassoua',
      district: 'Yantala',
      items: [
        { id: '7', name: 'Lot de 10 Massas Sucrés', quantity: 2, price: 2000 },
        { id: '8', name: 'Bouillie de Mil au Lait Caillé', quantity: 2, price: 1500 },
      ],
      total_amount: 8000,
      delivery_fee: 1000,
      payment_method: 'paid' as any,
      payment_status: 'paid',
      status: 'delivered',
      driver_name: 'Oumarou Sani',
      created_at: new Date(now - 85 * 60 * 1000).toISOString(), // 85 minutes ago (delivered)
    },
  ];
};

interface AdminOrdersPageProps {
  isEmbedded?: boolean;
  onNavigate?: (tab: string) => void;
}

export default function AdminOrdersPage({ isEmbedded = false, onNavigate }: AdminOrdersPageProps = {}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [delayFilter, setDelayFilter] = useState<'all' | 'delayed_unnotified' | 'delayed_notified' | 'on_time'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Delay Automation & Notification States
  const [delayConfig, setDelayConfig] = useState<DelayAutomationConfig>(loadDelayAutomationConfig());
  const [showDelaySettings, setShowDelaySettings] = useState<boolean>(false);
  const [orderForDelayModal, setOrderForDelayModal] = useState<AdminOrder | null>(null);
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    loadOrders();
    const loadedConfig = loadDelayAutomationConfig();
    setDelayConfig(loadedConfig);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  const loadOrders = async () => {
    setLoading(true);
    let initialList: AdminOrder[] = [];

    // 1. Check localStorage for previously modified or saved orders
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('alloresto_admin_orders');
        if (stored) {
          initialList = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Erreur chargement local orders:', e);
      }
    }

    if (!initialList || initialList.length === 0) {
      initialList = getInitialSampleOrders();
    }

    // 2. Try Supabase if available
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          initialList = data;
        }
      }
    } catch (e) {
      console.warn('Utilisation commandes locales:', e);
    } finally {
      setOrders(initialList);
      setLoading(false);
    }
  };

  const persistOrders = (updatedOrders: AdminOrder[]) => {
    setOrders(updatedOrders);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alloresto_admin_orders', JSON.stringify(updatedOrders));
      } catch (e) {
        console.warn('Erreur sauvegarde localStorage orders:', e);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    persistOrders(updated);

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      }
    } catch (e) {
      console.warn('Mise à jour locale uniquement:', e);
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
  const handleDelayNotificationSent = (orderId: string, delayMinutes: number, reason: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          delay_minutes: delayMinutes,
          delay_reason: reason,
          delay_notified_at: new Date().toISOString(),
          delay_notified_count: (o.delay_notified_count || 0) + 1,
        };
      }
      return o;
    });

    persistOrders(updated);
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

      // Search query filter
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone.includes(searchTerm) ||
        order.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.district.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Payment filter
      const matchesPayment = paymentFilter === 'all' || order.payment_method === paymentFilter;

      // Delay filter
      let matchesDelay = true;
      if (delayFilter === 'delayed_unnotified') {
        matchesDelay = metrics.isDelayed && !metrics.alreadyNotified;
      } else if (delayFilter === 'delayed_notified') {
        matchesDelay = metrics.isDelayed && metrics.alreadyNotified;
      } else if (delayFilter === 'on_time') {
        matchesDelay = !metrics.isDelayed && !metrics.isTerminated;
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDelay;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, delayFilter, delayConfig]);

  // Global Delay Metrics
  const delayedOrders = useMemo(() => {
    return orders.filter((o) => getOrderDelayMetrics(o).isDelayed);
  }, [orders, delayConfig]);

  const unnotifiedDelayedOrders = useMemo(() => {
    return delayedOrders.filter((o) => !o.delay_notified_at);
  }, [delayedOrders]);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'cooking' || o.status === 'delivering'
  ).length;

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total_amount, 0);

  return (
    <div className={`min-h-screen ${isEmbedded ? 'p-0' : 'bg-slate-950 p-4 md:p-8 text-slate-100'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Notification Banner */}
        {toastNotification && (
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastNotification.message}</span>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-emerald-400 hover:text-white cursor-pointer"
            >
              ✕
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
              Tableau de bord logistique, suivi en temps réel des livraisons et gestion des retards clients via WhatsApp.
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

        {/* ======================================================== */}
        {/* DEDICATED BANNER: WHATSAPP DELIVERY DELAY NOTIFICATIONS */}
        {/* ======================================================== */}
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
                  Avertissez proactivement vos clients par WhatsApp en cas d&apos;embouteillage, forte affluence ou intempéries avec excuses et geste commercial offert.
                </p>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              {/* Quick Toggle */}
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

              {/* Notify First Delayed Order Button */}
              {unnotifiedDelayedOrders.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setOrderForDelayModal(unnotifiedDelayedOrders[0])}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 animate-pulse"
                >
                  <Send className="w-4 h-4" />
                  <span>Notifier Retard #{unnotifiedDelayedOrders[0].id}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const firstOngoing = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0];
                    if (firstOngoing) setOrderForDelayModal(firstOngoing);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tester une alerte type</span>
                </button>
              )}

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

          {/* Quick delay status pills */}
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
              <span className={`px-2.5 py-0.5 rounded-full font-mono font-black text-xs ${
                unnotifiedDelayedOrders.length > 0
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}>
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
            <span className="text-[11px] text-slate-500">Commandes enregistrées</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">En cours d&apos;exécution</span>
            <div className="text-2xl font-black text-orange-400 mt-1">{activeOrdersCount}</div>
            <span className="text-[11px] text-orange-300/80">Cuisine ou livraison active</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Livrées avec succès</span>
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
            <span className="text-[11px] text-slate-400">Total paniers + livraison</span>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (ID, client, téléphone, quartier)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tous statuts</option>
              <option value="pending">⏳ En attente</option>
              <option value="confirmed">✅ Confirmée</option>
              <option value="cooking">🍳 En cuisine</option>
              <option value="delivering">🛵 En livraison</option>
              <option value="delivered">🎉 Livrée</option>
              <option value="cancelled">❌ Annulée</option>
            </select>

            {/* Filter by Payment */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tous paiements</option>
              <option value="airtel_money">Airtel Money</option>
              <option value="flooz">Moov Flooz</option>
              <option value="al_izza">Al Izza</option>
              <option value="cash">Espèces</option>
            </select>

            {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || delayFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      Aucune commande ne correspond aux critères sélectionnés.
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
                            <span>{order.id}</span>
                            {metrics.isDelayed && !metrics.alreadyNotified && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
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
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {order.delivery_address}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 font-bold text-amber-300">
                          {order.total_amount.toLocaleString()} FCFA
                        </td>

                        {/* Payment */}
                        <td className="py-3 px-4">
                          <span className="capitalize px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold block w-fit">
                            {order.payment_method === 'airtel_money' && '🔴 Airtel Money'}
                            {order.payment_method === 'flooz' && '🔵 Moov Flooz'}
                            {order.payment_method === 'al_izza' && '🟡 Al Izza'}
                            {order.payment_method === 'cash' && '💵 Espèces'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as AdminOrder['status'])}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : order.status === 'delivering'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : order.status === 'cooking'
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                : order.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            <option value="pending">⏳ En attente</option>
                            <option value="confirmed">✅ Confirmée</option>
                            <option value="cooking">🍳 En cuisine</option>
                            <option value="delivering">🛵 En livraison</option>
                            <option value="delivered">🎉 Livrée</option>
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
                                    <span>
                                      Notifié (+{order.delay_minutes || 15}m)
                                    </span>
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
                          {order.driver_name || <span className="text-slate-500 italic">Non assigné</span>}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Delay Notification Trigger Button */}
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Commande {selectedOrder.id}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Passée le {new Date(selectedOrder.created_at).toLocaleString()}
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
                      Retard annoncé : +{selectedOrder.delay_minutes || 15} min &bull; Motif : {selectedOrder.delay_reason || 'Affluence cuisine'}
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
                  <div className="text-slate-400 font-medium">Informations Client :</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customer_name}</div>
                  <div className="text-emerald-400 font-mono">{selectedOrder.customer_phone}</div>
                  <div className="text-orange-400">{selectedOrder.delivery_address} ({selectedOrder.district})</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-medium">Plats Commandés :</div>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-200">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                    <span>Frais de livraison ({selectedOrder.district})</span>
                    <span>{selectedOrder.delivery_fee.toLocaleString()} FCFA</span>
                  </div>
                  <div className="pt-1 flex justify-between items-center text-white font-black text-sm">
                    <span>Total Commande</span>
                    <span className="text-amber-400">{selectedOrder.total_amount.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Livreur Affecté :</div>
                  <div className="text-white font-bold">{selectedOrder.driver_name || 'En attente d’assignation radar Billo Express'}</div>
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
