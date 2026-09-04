'use client';

import React, { useState, useEffect } from 'react';

interface KitchenOrder {
  id: string;
  customer_name: string;
  items: { name: string; quantity: number }[];
  total_price: number;
  delivery_district: string;
  status: 'pending' | 'cooking' | 'ready' | 'picked_up';
  created_at: string;
  driver_name?: string;
}

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: 'K-108',
    customer_name: 'Mme Aïchatou B.',
    items: [
      { name: 'Choukouya de Mouton Royal du Sahel', quantity: 2 },
      { name: 'Jus de Bissap Glacé', quantity: 2 },
    ],
    total_price: 15000,
    delivery_district: 'Plateau',
    status: 'cooking',
    created_at: '10:14',
    driver_name: 'Moussa Ibrahim (Billo Express)',
  },
  {
    id: 'K-109',
    customer_name: 'Ibrahim Ousmane',
    items: [
      { name: 'Dambou Blanc & Moringa Bio', quantity: 1 },
      { name: 'Poulet Bicyclette Braisé', quantity: 1 },
    ],
    total_price: 11000,
    delivery_district: 'Harobanda',
    status: 'pending',
    created_at: '10:22',
  },
  {
    id: 'K-107',
    customer_name: 'Hamani Salifou',
    items: [{ name: 'Capitaine Grillé du Fleuve Niger', quantity: 1 }],
    total_price: 8000,
    delivery_district: 'Koira Kano',
    status: 'ready',
    created_at: '09:58',
    driver_name: 'Abdoulaye Garba (En approche)',
  },
];

export default function RestaurantDashboardPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const updateStatus = (id: string, newStatus: KitchenOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍳</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Espace Cuisine &amp; Commandes en Direct
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Écran de préparation en temps réel - Cuisine &amp; Prise en charge Billo Express
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span>{soundEnabled ? '🔔 Alerte sonore ON' : '🔕 Alerte sonore OFF'}</span>
            </button>
            <a
              href="/app/restaurant/menu"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📋 Gérer le Menu</span>
            </a>
            <a
              href="/app/restaurant/stats"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📊 Statistiques</span>
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition shadow-sm"
            >
              <span>💳 Formules &amp; Tarifs</span>
            </a>
            <a
              href="/app/restaurant/contract"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              <span>📜 Mon Contrat</span>
            </a>
          </div>
        </header>

        {/* Orders Queue Columns: Responsive 1 -> 2 -> 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Nouvelles Commandes (En attente) */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-amber-400 text-sm flex items-center gap-1.5">
                <span>🔔</span> Nouvelles Commandes
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                {orders.filter((o) => o.status === 'pending').length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {orders
                .filter((o) => o.status === 'pending')
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-white font-mono">#{order.id}</span>
                      <span className="text-amber-400 font-bold">{order.created_at}</span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium">
                      Client : <strong>{order.customer_name}</strong> ({order.delivery_district})
                    </div>

                    <div className="space-y-1 py-1 border-y border-slate-800 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-200">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="font-bold text-amber-300">
                        {order.total_price.toLocaleString()} FCFA
                      </span>
                      <button
                        onClick={() => updateStatus(order.id, 'cooking')}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black cursor-pointer transition shadow"
                      >
                        Lancer Cuisine 🍳
                      </button>
                    </div>
                  </div>
                ))}

              {orders.filter((o) => o.status === 'pending').length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  Aucune nouvelle commande en attente
                </div>
              )}
            </div>
          </div>

          {/* Column 2: En Préparation (Cuisine) */}
          <div className="bg-slate-900/90 border border-orange-500/30 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-orange-400 text-sm flex items-center gap-1.5">
                <span>🍳</span> En Cuisine (Feu actif)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold">
                {orders.filter((o) => o.status === 'cooking').length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {orders
                .filter((o) => o.status === 'cooking')
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-white font-mono">#{order.id}</span>
                      <span className="text-orange-400 font-bold">{order.created_at}</span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium">
                      Client : <strong>{order.customer_name}</strong>
                    </div>

                    <div className="space-y-1 py-1 border-y border-slate-800 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-200">
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>

                    {order.driver_name && (
                      <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded-xl border border-cyan-800/40">
                        🛵 Livreur : {order.driver_name}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="font-bold text-amber-300">
                        {order.total_price.toLocaleString()} FCFA
                      </span>
                      <button
                        onClick={() => updateStatus(order.id, 'ready')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer transition shadow"
                      >
                        Prête ! Emballée 📦
                      </button>
                    </div>
                  </div>
                ))}

              {orders.filter((o) => o.status === 'cooking').length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  Aucun plat actuellement sur le feu
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Prêtes pour Coursier */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-emerald-400 text-sm flex items-center gap-1.5">
                <span>📦</span> Prêtes / Prise en Charge Coursier
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                {orders.filter((o) => o.status === 'ready').length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {orders
                .filter((o) => o.status === 'ready')
                .map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-white font-mono">#{order.id}</span>
                      <span className="text-emerald-400 font-bold">Prête</span>
                    </div>

                    <div className="text-xs text-slate-300 font-medium">
                      Destination : <strong>{order.delivery_district}</strong>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {order.driver_name ? `Coursier : ${order.driver_name}` : 'En attente du coursier au comptoir'}
                    </div>

                    <button
                      onClick={() => updateStatus(order.id, 'picked_up')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition"
                    >
                      Remis au livreur Billo Express ✓
                    </button>
                  </div>
                ))}

              {orders.filter((o) => o.status === 'ready').length === 0 && (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  Aucune commande en attente de ramassage
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
