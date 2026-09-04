'use client';

import React, { useState } from 'react';

export default function RestaurantStatsPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    totalRevenue: 2840000,
    totalOrders: 312,
    avgOrderValue: 9100,
    rating: 4.88,
    reviewsCount: 186,
    avgPrepTime: '19 min',
    commissionSaved: 426000, // Économies réalisées avec la formule abonnement Allôresto
  };

  const topDishes = [
    { name: 'Choukouya de Mouton Royal du Sahel', orders: 124, revenue: 806000, percentage: 28 },
    { name: 'Dambou Blanc & Moringa Bio', orders: 86, revenue: 301000, percentage: 20 },
    { name: 'Capitaine Grillé du Fleuve Niger', orders: 58, revenue: 464000, percentage: 16 },
    { name: 'Poulet Bicyclette Galmi', orders: 32, revenue: 240000, percentage: 11 },
    { name: 'Jus de Bissap Glacé', orders: 110, revenue: 110000, percentage: 8 },
  ];

  const paymentBreakdown = [
    { name: 'Airtel Money Niger', percent: 45, color: 'bg-rose-500' },
    { name: 'Moov Africa Flooz', percent: 32, color: 'bg-blue-500' },
    { name: 'Al Izza Mobile', percent: 14, color: 'bg-amber-500' },
    { name: 'Espèces à la livraison', percent: 9, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Performances &amp; Statistiques Ventes
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Suivi détaillé de vos commandes Allôresto et rentabilité de votre restaurant
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {(['week', 'month', 'year'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timeframe === t ? 'bg-orange-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'week' ? '7 Jours' : t === 'month' ? 'Ce Mois' : 'Année'}
                </button>
              ))}
            </div>

            <a
              href="/app/restaurant/dashboard"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>🍳 Cuisine</span>
            </a>
            <a
              href="/app/restaurant/menu"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📋 Menu</span>
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>💳 Formules</span>
            </a>
          </div>
        </header>

        {/* Highlight Banner: Économies de Commission */}
        <div className="p-4 md:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <h2 className="text-sm md:text-base font-black text-emerald-300">
                Grâce au modèle Allôresto sans commission exorbitante :
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Vous avez conservé <strong className="text-emerald-400 font-bold">+{stats.commissionSaved.toLocaleString()} FCFA</strong> dans votre trésorerie ce mois-ci par rapport à une commission classique de 20-30%.
            </p>
          </div>
          <a
            href="/app/restaurant/plans"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition whitespace-nowrap shadow-lg shadow-emerald-500/20"
          >
            Voir ma Formule
          </a>
        </div>

        {/* Stats KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Chiffre d'Affaires</span>
            <div className="text-2xl md:text-3xl font-black text-amber-400 mt-1">
              {stats.totalRevenue.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">↗ +18% vs mois précédent</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Commandes Livrées</span>
            <div className="text-2xl md:text-3xl font-black text-white mt-1">
              {stats.totalOrders}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Toutes zones Niamey confondues</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Panier Moyen</span>
            <div className="text-2xl md:text-3xl font-black text-white mt-1">
              {stats.avgOrderValue.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">~2.4 plats par commande</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Satisfaction &amp; Vitesse</span>
            <div className="text-2xl md:text-3xl font-black text-orange-400 mt-1 flex items-center gap-2">
              <span>★ {stats.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Préparation moyenne : {stats.avgPrepTime}</span>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 5 Bestsellers */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔥</span>
                <span>Top Plats les Plus Commandés</span>
              </h3>
              <span className="text-xs text-slate-400">{timeframe === 'month' ? 'Ce mois' : 'Période sélectionnée'}</span>
            </div>

            <div className="space-y-3">
              {topDishes.map((dish, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      #{i + 1} {dish.name}
                    </span>
                    <span className="font-black text-amber-300">
                      {dish.revenue.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full"
                      style={{ width: `${dish.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{dish.orders} portions commandées</span>
                    <span>{dish.percentage}% du volume total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>💳</span>
                <span>Canaux de Règlement</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Moyens de paiement choisis par les clients</p>
            </div>

            <div className="space-y-3 my-auto">
              {paymentBreakdown.map((pm, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{pm.name}</span>
                    <span className="font-bold text-white">{pm.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${pm.color} h-full rounded-full`} style={{ width: `${pm.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed mt-4">
              💡 Les paiements Mobile Money (Airtel &amp; Flooz) représentent plus de 75% des flux : virement garanti sous 24h.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
