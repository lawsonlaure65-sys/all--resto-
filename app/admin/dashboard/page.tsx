'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';
import { RESTAURANTS_DATA } from '../../../src/data/allorestoData';
import { NIAMEY_DISTRICTS_DATA } from '../../../src/data/niameyDistrictsData';
import {
  Filter,
  Calendar,
  Building2,
  MapPin,
  RotateCcw,
  Search,
  CheckCircle2,
  FileText,
  Star,
} from 'lucide-react';

interface DailyStats {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_delivery_fees: number;
}

interface RestaurantStats {
  id: string;
  name: string;
  slug: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
}

interface ZoneStats {
  zone_id: string;
  zone_name: string;
  total_orders: number;
  total_revenue: number;
}

interface FilteredOrder {
  id: string;
  order_number: number | string;
  customer_name: string;
  delivery_address: string;
  delivery_zone_id?: string;
  restaurant_id?: string;
  restaurant_name?: string;
  total_xof: number;
  order_status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  driver_name?: string;
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [restaurantStats, setRestaurantStats] = useState<RestaurantStats[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres du tableau de bord
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string>('all');
  const [zoneId, setZoneId] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<FilteredOrder[]>([]);
  const [filterLoading, setFilterLoading] = useState<boolean>(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        const demoAdmin = { email: 'admin@alloresto.ne', role: 'super_admin' };
        localStorage.setItem('admin', JSON.stringify(demoAdmin));
        setAdmin(demoAdmin);
      } else {
        try {
          setAdmin(JSON.parse(adminData));
        } catch {
          setAdmin({ email: 'admin@alloresto.ne', role: 'super_admin' });
        }
      }
      loadStats();
      loadFilteredOrders();
    }
  }, []);

  const loadStats = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Stats journalières
      const { data: daily, error: dailyError } = await supabase
        .from('admin_daily_stats')
        .select('*')
        .limit(7);

      // Stats par restaurant
      const { data: restaurants, error: restoError } = await supabase
        .from('admin_restaurant_stats')
        .select('*');

      // Stats par zone
      const { data: zones, error: zoneError } = await supabase
        .from('admin_zone_stats')
        .select('*');

      if (dailyError) console.warn('Daily stats error:', dailyError);
      if (restoError) console.warn('Resto stats error:', restoError);
      if (zoneError) console.warn('Zone stats error:', zoneError);

      setDailyStats(daily || []);
      setRestaurantStats(restaurants || []);
      setZoneStats(zones || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredOrders = async () => {
    setFilterLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        let query = supabase
          .from('order_history')
          .select('*')
          .order('created_at', { ascending: false });

        if (startDate) {
          query = query.gte('created_at', `${startDate}T00:00:00`);
        }

        if (endDate) {
          query = query.lte('created_at', `${endDate}T23:59:59`);
        }

        if (restaurantId && restaurantId !== 'all') {
          query = query.eq('restaurant_id', restaurantId);
        }

        if (zoneId && zoneId !== 'all') {
          query = query.eq('delivery_zone_id', zoneId);
        }

        const { data, error } = await query;
        if (!error && data) {
          setFilteredOrders(data);
          setHasAppliedFilters(Boolean(startDate || endDate || (restaurantId !== 'all') || (zoneId !== 'all')));
          setFilterLoading(false);
          return;
        }
      }

      // Repli local
      const stored = localStorage.getItem('alloresto_admin_orders');
      if (stored) {
        let list = JSON.parse(stored);
        if (startDate) {
          list = list.filter((o: any) => o.created_at >= `${startDate}T00:00:00`);
        }
        if (endDate) {
          list = list.filter((o: any) => o.created_at <= `${endDate}T23:59:59`);
        }
        if (restaurantId && restaurantId !== 'all') {
          list = list.filter((o: any) => o.restaurant_name?.toLowerCase().includes(restaurantId.toLowerCase()) || o.restaurant_id === restaurantId);
        }
        if (zoneId && zoneId !== 'all') {
          list = list.filter((o: any) => o.district?.toLowerCase().includes(zoneId.toLowerCase()) || o.delivery_zone_id === zoneId);
        }
        setFilteredOrders(
          list.map((o: any) => ({
            id: o.id,
            order_number: o.id,
            customer_name: o.customer_name || 'Client',
            delivery_address: o.delivery_address || 'Niamey',
            restaurant_name: o.restaurant_name,
            total_xof: Number(o.total_amount) || Number(o.total_xof) || 0,
            order_status: o.status || o.order_status || 'delivered',
            payment_method: o.payment_method || 'cash',
            payment_status: o.payment_status || 'paid',
            created_at: o.created_at || new Date().toISOString(),
            driver_name: o.driver_name,
          }))
        );
      }
    } catch (e) {
      console.warn('Erreur filtrage:', e);
    } finally {
      setHasAppliedFilters(Boolean(startDate || endDate || (restaurantId !== 'all') || (zoneId !== 'all')));
      setFilterLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setRestaurantId('all');
    setZoneId('all');
    setHasAppliedFilters(false);
    setTimeout(() => {
      loadStats();
    }, 50);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin');
      window.location.href = '/app/admin/login';
    }
  };

  const totalRevenue = dailyStats.reduce((sum, stat) => sum + (stat.total_revenue || 0), 0);
  const totalOrders = dailyStats.reduce((sum, stat) => sum + (stat.total_orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculs sur les filtres appliqués
  const filteredRevenue = filteredOrders.reduce((sum, o) => sum + (o.total_xof || 0), 0);
  const filteredCount = filteredOrders.length;
  const filteredAvg = filteredCount > 0 ? Math.round(filteredRevenue / filteredCount) : 0;

  if (!admin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
          <span>Chargement du tableau de bord Niamey...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Allôresto - Super Admin 🇳🇪</h1>
            <p className="text-blue-100 text-xs">Tableau de bord Niamey (Temps Réel)</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/app/admin/analytics"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📊 Analytics</span>
            </a>
            <a
              href="/app/admin/reports"
              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📑 Rapports &amp; PDF</span>
            </a>
            <a
              href="/app/admin/reviews"
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Star className="w-3.5 h-3.5" />
              <span>⭐ Avis</span>
            </a>
            <a
              href="/app/admin/restaurants"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>🍽️ Restaurants</span>
            </a>
            <a
              href="/app/admin/drivers"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>🛵 Livreurs</span>
            </a>
            <a
              href="/app/admin/orders"
              className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📦 Commandes</span>
            </a>
            <a
              href="/app/admin/subscriptions"
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>💳 Abonnements</span>
            </a>
            <a
              href="/app/admin/exports"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📥 Exports</span>
            </a>
            <a
              href="/app/admin/settings"
              className="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>⚙️ Paramètres</span>
            </a>
            <a
              href="/app/admin/contracts"
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📜 Contrat</span>
            </a>
            <span className="text-xs bg-blue-700/60 px-2.5 py-1 rounded-full text-blue-100 hidden lg:inline">
              {admin.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

        {/* SECTION 1: PANNEAU DES 3 FILTRES CONTRÔLÉS DU DASHBOARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-gray-900">
                Filtres du Tableau de Bord (Période, Restaurant, Quartier)
              </h2>
            </div>
            {hasAppliedFilters && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Filtres actifs ({filteredCount} commande{filteredCount > 1 ? 's' : ''})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Filtre Période : Date de début */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Date de début</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Filtre Période : Date de fin */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Date de fin</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Filtre Restaurant : Liste des restaurants actifs */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span>Restaurant</span>
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Tous les restaurants</option>
                {RESTAURANTS_DATA.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Quartier : Liste des zones de livraison */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Quartier / Zone Niamey</span>
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Tous les quartiers</option>
                {NIAMEY_DISTRICTS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.zoneLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons d'action pour les filtres */}
          <div className="flex items-center justify-end gap-2 pt-2">
            {hasAppliedFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            )}
            <button
              onClick={loadFilteredOrders}
              disabled={filterLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{filterLoading ? 'Filtrage en cours...' : 'Appliquer les filtres'}</span>
            </button>
          </div>

          {/* Résumé chiffré si filtres actifs */}
          {hasAppliedFilters && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500 font-medium">CA Filtré :</span>
                <span className="ml-1.5 font-bold font-mono text-emerald-700 text-sm">
                  {filteredRevenue.toLocaleString()} FCFA
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Commandes trouvées :</span>
                <span className="ml-1.5 font-bold font-mono text-blue-700 text-sm">
                  {filteredCount}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Panier moyen filtré :</span>
                <span className="ml-1.5 font-bold font-mono text-purple-700 text-sm">
                  {filteredAvg.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: TABLE DES COMMANDES FILTRÉES (Si des filtres sont appliqués) */}
        {hasAppliedFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Commandes filtrées selon les critères ({filteredOrders.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">N° Commande</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Restaurant</th>
                    <th className="py-2.5 px-3">Quartier / Adresse</th>
                    <th className="py-2.5 px-3 text-right">Montant</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/70">
                        <td className="py-2 px-3 font-mono font-semibold text-gray-900">{o.order_number}</td>
                        <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                          {new Date(o.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-900">{o.customer_name}</td>
                        <td className="py-2 px-3 text-gray-700">{o.restaurant_name || '—'}</td>
                        <td className="py-2 px-3 text-gray-500 truncate max-w-[150px]">{o.delivery_address}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                          {o.total_xof.toLocaleString()} FCFA
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                            {o.order_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-400">
                        Aucune commande trouvée pour ces filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: KPI Cards standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Chiffre d'affaires (7j)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                  {totalRevenue.toLocaleString()} FCFA
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Commandes (7j)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                  {totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Panier moyen</p>
                <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                  {Math.round(avgOrderValue).toLocaleString()} FCFA
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats par restaurant */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊 Performance par Restaurant</span>
            <span className="text-xs text-gray-400 font-normal">(Vue admin_restaurant_stats)</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-bold">
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="text-right py-3 px-4">Commandes</th>
                  <th className="text-right py-3 px-4">CA Total</th>
                  <th className="text-right py-3 px-4">Panier moyen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurantStats.length > 0 ? (
                  restaurantStats.map((resto) => (
                    <tr key={resto.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-gray-900">{resto.name}</td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700">{resto.total_orders}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-bold font-mono text-emerald-600">
                        {(resto.total_revenue || 0).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700">
                        {Math.round(resto.avg_order_value || 0).toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400 text-xs">
                      Aucune donnée enregistrée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats par zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📍 Répartition par Quartier de Niamey</span>
            <span className="text-xs text-gray-400 font-normal">(Vue admin_zone_stats)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {zoneStats.length > 0 ? (
              zoneStats.map((zone) => (
                <div key={zone.zone_id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/70 transition">
                  <p className="font-bold text-gray-900 text-sm">{zone.zone_name}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">Commandes:</span>
                    <span className="font-bold font-mono text-gray-800">{zone.total_orders}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-gray-500">CA:</span>
                    <span className="font-bold font-mono text-emerald-600">
                      {(zone.total_revenue || 0).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs col-span-full">Aucune donnée de quartier</p>
            )}
          </div>
        </div>

        {/* Stats journalières */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📈 Activité Quotidienne</span>
            <span className="text-xs text-gray-400 font-normal">(Vue admin_daily_stats)</span>
          </h2>
          <div className="space-y-3">
            {dailyStats.length > 0 ? (
              dailyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(stat.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{stat.total_orders} commandes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 font-mono">{(stat.total_revenue || 0).toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-500 font-mono">Frais: {(stat.total_delivery_fees || 0).toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                En attente des premières commandes du jour.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
