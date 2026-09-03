'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

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

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [restaurantStats, setRestaurantStats] = useState<RestaurantStats[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        window.location.href = '/app/admin/login';
        return;
      }
      setAdmin(JSON.parse(adminData));
      loadStats();
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

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin');
      window.location.href = '/app/admin/login';
    }
  };

  const totalRevenue = dailyStats.reduce((sum, stat) => sum + (stat.total_revenue || 0), 0);
  const totalOrders = dailyStats.reduce((sum, stat) => sum + (stat.total_orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
          <div className="flex items-center gap-3">
            <a
              href="/app/admin/restaurants"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>🍽️ Restaurants</span>
            </a>
            <a
              href="/app/admin/contracts"
              className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📜 Contrat Partenaire</span>
            </a>
            <a
              href="/app/admin/subscriptions"
              className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>💳 Abonnements</span>
            </a>
            <a
              href="/app/admin/exports"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>📥 Exports & Historique</span>
            </a>
            <span className="text-xs bg-blue-700/60 px-2.5 py-1 rounded-full text-blue-100 hidden sm:inline">
              {admin.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
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
                    <td colSpan={4} className="py-6 text-center text-gray-400 text-xs">
                      Aucune statistique de restaurant enregistrée pour le moment.
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
            <span>📍 Livraisons par Quartier</span>
            <span className="text-xs text-gray-400 font-normal">(Vue admin_zone_stats)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zoneStats.length > 0 ? (
              zoneStats.map((zone) => (
                <div key={zone.zone_id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{zone.zone_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{zone.total_orders} commandes livrées</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-600 font-mono">
                        {(zone.total_revenue || 0).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-4 text-center text-gray-400 text-xs">
                Aucune zone de livraison encore enregistrée.
              </div>
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
