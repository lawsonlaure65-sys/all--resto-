'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DailyStat {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_delivery_fees?: number;
  total_subtotal?: number;
}

interface PaymentMethodStat {
  payment_method: string;
  total_orders: number;
  total_revenue: number;
}

interface StatusStat {
  status: string;
  total_orders: number;
  total_revenue: number;
}

// Données d'exemple représentatives de Niamey si Supabase n'est pas encore synchronisé ou si les vues SQL ne sont pas encore créées
const FALLBACK_DAILY_STATS: DailyStat[] = [
  { date: '2026-09-07', total_orders: 14, total_revenue: 148500, total_delivery_fees: 14000 },
  { date: '2026-09-08', total_orders: 19, total_revenue: 215000, total_delivery_fees: 19000 },
  { date: '2026-09-09', total_orders: 22, total_revenue: 245000, total_delivery_fees: 22000 },
  { date: '2026-09-10', total_orders: 18, total_revenue: 195000, total_delivery_fees: 18000 },
  { date: '2026-09-11', total_orders: 28, total_revenue: 320000, total_delivery_fees: 28000 },
  { date: '2026-09-12', total_orders: 34, total_revenue: 395000, total_delivery_fees: 34000 },
  { date: '2026-09-13', total_orders: 25, total_revenue: 285000, total_delivery_fees: 25000 },
];

const FALLBACK_PAYMENT_STATS: PaymentMethodStat[] = [
  { payment_method: 'airtel_money', total_orders: 58, total_revenue: 620000 },
  { payment_method: 'moov_money', total_orders: 34, total_revenue: 375000 },
  { payment_method: 'orange_zamany', total_orders: 26, total_revenue: 285000 },
  { payment_method: 'cash_delivery', total_orders: 20, total_revenue: 215000 },
  { payment_method: 'flooz', total_orders: 12, total_revenue: 130000 },
  { payment_method: 'mynita', total_orders: 10, total_revenue: 98000 },
];

const FALLBACK_STATUS_STATS: StatusStat[] = [
  { status: 'delivered', total_orders: 132, total_revenue: 1460000 },
  { status: 'confirmed', total_orders: 18, total_revenue: 195000 },
  { status: 'pending_confirmation', total_orders: 6, total_revenue: 58000 },
  { status: 'cancelled', total_orders: 4, total_revenue: 40000 },
];

export default function AdminAnalyticsPage() {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentMethodStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [supabaseMessage, setSupabaseMessage] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setDailyStats(FALLBACK_DAILY_STATS);
        setPaymentStats(FALLBACK_PAYMENT_STATS);
        setStatusStats(FALLBACK_STATUS_STATS);
        setIsLiveSupabase(false);
        setSupabaseMessage("Supabase non connecté — Affichage des données de simulation.");
        return;
      }

      // Stats journalières
      const { data: daily, error: dailyError } = await supabase
        .from('admin_daily_revenue')
        .select('*')
        .order('date', { ascending: true });

      // Stats par méthode de paiement
      const { data: payments, error: paymentError } = await supabase
        .from('admin_payment_method_stats')
        .select('*');

      // Stats par statut
      const { data: statuses, error: statusError } = await supabase
        .from('admin_order_status_stats')
        .select('*');

      if (dailyError || paymentError || statusError) {
        console.warn('Vues SQL Supabase non encore créées ou erreur:', { dailyError, paymentError, statusError });
        setDailyStats(FALLBACK_DAILY_STATS);
        setPaymentStats(FALLBACK_PAYMENT_STATS);
        setStatusStats(FALLBACK_STATUS_STATS);
        setIsLiveSupabase(false);
        setSupabaseMessage("Vues SQL absentes sur Supabase — Veuillez exécuter le script SQL fourni dans SQL Editor.");
      } else if (daily && daily.length > 0) {
        setDailyStats(daily);
        setPaymentStats(payments || []);
        setStatusStats(statuses || []);
        setIsLiveSupabase(true);
        setSupabaseMessage(null);
      } else {
        // Vues présentes mais aucune commande
        setDailyStats(FALLBACK_DAILY_STATS);
        setPaymentStats(FALLBACK_PAYMENT_STATS);
        setStatusStats(FALLBACK_STATUS_STATS);
        setIsLiveSupabase(false);
        setSupabaseMessage("Vues connectées mais aucune commande enregistrée — Affichage de données témoins.");
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setDailyStats(FALLBACK_DAILY_STATS);
      setPaymentStats(FALLBACK_PAYMENT_STATS);
      setStatusStats(FALLBACK_STATUS_STATS);
      setIsLiveSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  // Données pour le graphique en ligne (évolution CA)
  const lineChartData = {
    labels: dailyStats.map(stat => 
      new Date(stat.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    ),
    datasets: [
      {
        label: "Chiffre d'affaires (FCFA)",
        data: dailyStats.map(stat => stat.total_revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointRadius: 4,
      },
    ],
  };

  // Données pour le graphique en barres (commandes par jour)
  const barChartData = {
    labels: dailyStats.map(stat => 
      new Date(stat.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    ),
    datasets: [
      {
        label: 'Nombre de commandes',
        data: dailyStats.map(stat => stat.total_orders),
        backgroundColor: 'rgb(34, 197, 94)',
        borderRadius: 8,
      },
    ],
  };

  // Données pour le graphique en beignet (méthodes de paiement)
  const doughnutChartData = {
    labels: paymentStats.map(stat => {
      const names: Record<string, string> = {
        airtel_money: 'Airtel Money',
        moov_money: 'Moov Money',
        orange_zamany: 'Orange Zamany',
        flooz: 'Flooz',
        mynita: 'MyNita',
        amanata: 'Amanata',
        all_iza: 'All-Iza',
        zeyna: 'Zeyna',
        cash_delivery: 'Espèces / Cash',
      };
      return names[stat.payment_method] || stat.payment_method;
    }),
    datasets: [
      {
        label: 'Répartition par paiement (FCFA)',
        data: paymentStats.map(stat => stat.total_revenue),
        backgroundColor: [
          'rgb(239, 68, 68)',   // Airtel (Rouge)
          'rgb(59, 130, 246)',  // Moov (Bleu)
          'rgb(249, 115, 22)',  // Orange (Orange)
          'rgb(168, 85, 247)',  // Flooz (Violet)
          'rgb(34, 197, 94)',   // MyNita (Vert)
          'rgb(20, 184, 166)',  // Amanata (Teal)
          'rgb(99, 102, 241)',  // All-Iza (Indigo)
          'rgb(236, 72, 153)',  // Zeyna (Rose)
          'rgb(107, 114, 128)', // Cash (Gris)
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 11,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 font-medium text-sm flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Chargement des graphiques Chart.js & statistiques Niamey...</span>
        </div>
      </div>
    );
  }

  const totalRevenue = dailyStats.reduce((sum, stat) => sum + (stat.total_revenue || 0), 0);
  const totalOrders = dailyStats.reduce((sum, stat) => sum + (stat.total_orders || 0), 0);
  const avgDailyRevenue = dailyStats.length > 0 ? totalRevenue / dailyStats.length : 0;
  const avgDailyOrders = dailyStats.length > 0 ? totalOrders / dailyStats.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-full md:max-w-7xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Analytics &amp; Graphiques (Chart.js)
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Plateforme Allôresto Niger &bull; Analyse des volumes, du CA et des paiements Mobile Money
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/app/admin/dashboard"
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <span>← Tableau de Bord</span>
            </a>
            <button
              onClick={loadStats}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>🔄 Actualiser</span>
            </button>
          </div>
        </div>

        {/* Supabase Status Banner */}
        {supabaseMessage && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{supabaseMessage}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
              {isLiveSupabase ? "Supabase Live" : "Mode Démo Sécurisé"}
            </span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">CA Total (Période)</p>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {totalRevenue.toLocaleString()} FCFA
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Revenu cumulé des commandes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Commandes</p>
            <p className="text-2xl font-black text-blue-600 mt-1 font-mono">{totalOrders}</p>
            <p className="text-[11px] text-gray-400 mt-1">Commandes traitées</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">CA Moyen / Jour</p>
            <p className="text-2xl font-black text-purple-600 mt-1 font-mono">
              {Math.round(avgDailyRevenue).toLocaleString()} FCFA
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Moyenne quotidienne</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Commandes / Jour</p>
            <p className="text-2xl font-black text-orange-600 mt-1 font-mono">
              {Math.round(avgDailyOrders)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Fréquence moyenne</p>
          </div>
        </div>

        {/* Graphiques 1: Évolution CA (Line) & Commandes (Bar) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution du CA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>📈 Évolution du Chiffre d'Affaires</span>
                <span className="text-xs text-gray-400 font-normal">(Chart.js Line)</span>
              </h2>
              <span className="text-xs font-mono font-bold text-blue-600">FCFA</span>
            </div>
            <div className="h-72 w-full">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>📦 Volume de Commandes par Jour</span>
                <span className="text-xs text-gray-400 font-normal">(Chart.js Bar)</span>
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-600">Unités</span>
            </div>
            <div className="h-72 w-full">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Graphiques 2: Répartition par paiement (Doughnut) & Statuts des commandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>💳 Répartition par Moyen de Paiement</span>
                <span className="text-xs text-gray-400 font-normal">(Chart.js Doughnut)</span>
              </h2>
              <span className="text-xs text-gray-400">Niger Mobile Money &amp; Cash</span>
            </div>
            <div className="h-72 w-full flex items-center justify-center">
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </div>
          </div>

          {/* Stats par statut */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>✅ Statuts des Commandes</span>
                  <span className="text-xs text-gray-400 font-normal">(Vue admin_order_status_stats)</span>
                </h2>
              </div>
              <div className="space-y-3">
                {statusStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/70 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          stat.status === 'delivered'
                            ? 'bg-emerald-500 ring-2 ring-emerald-200'
                            : stat.status === 'pending_confirmation'
                            ? 'bg-amber-500 ring-2 ring-amber-200'
                            : stat.status === 'confirmed'
                            ? 'bg-blue-500 ring-2 ring-blue-200'
                            : 'bg-rose-500 ring-2 ring-rose-200'
                        }`}
                      />
                      <div>
                        <span className="text-xs font-bold text-gray-800 capitalize">
                          {stat.status === 'delivered'
                            ? 'Livrée & Encaissée'
                            : stat.status === 'confirmed'
                            ? 'En cours de livraison / Préparation'
                            : stat.status === 'pending_confirmation'
                            ? 'En attente de confirmation'
                            : stat.status}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono">Code: {stat.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-900 font-mono">
                        {stat.total_orders} commande{stat.total_orders > 1 ? 's' : ''}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-bold font-mono">
                        {stat.total_revenue?.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-right">
              <span className="text-[11px] text-gray-500">
                Total traité : <strong className="text-gray-900 font-mono">{totalOrders}</strong> commandes
              </span>
            </div>
          </div>
        </div>

        {/* Tableau détaillé */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>📋 Détail Journalier (Vue admin_daily_revenue)</span>
            </h2>
            <span className="text-xs text-gray-400 font-mono">{dailyStats.length} jours répertoriés</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Commandes</th>
                  <th className="text-right py-3 px-4">Chiffre d'Affaires</th>
                  <th className="text-right py-3 px-4">Frais de Livraison</th>
                  <th className="text-right py-3 px-4">Panier Moyen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyStats.slice().reverse().map((stat, index) => {
                  const avgBasket = stat.total_orders > 0 ? stat.total_revenue / stat.total_orders : 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {new Date(stat.date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700">
                        {stat.total_orders}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-emerald-600">
                        {stat.total_revenue.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-500">
                        {(stat.total_delivery_fees || 0).toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700">
                        {Math.round(avgBasket).toLocaleString()} FCFA
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
