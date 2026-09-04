'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface RestaurantOrderHistoryItem {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  items_summary: string;
  total_xof: number;
  payment_method: 'cash' | 'airtel_money' | 'flooz' | 'al_izza';
  status: 'pending' | 'confirmed' | 'cooking' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  delivery_district: string;
  driver_name?: string;
  created_at: string;
}

const SAMPLE_ORDERS: RestaurantOrderHistoryItem[] = [
  {
    id: 'RO-1029',
    order_number: 1029,
    customer_name: 'Moussa Garba',
    customer_phone: '+227 90 12 34 56',
    items_summary: '2x Choukouya Royal d’Agneau, 2x Jus de Baobab Frais',
    total_xof: 10000,
    payment_method: 'airtel_money',
    status: 'completed',
    delivery_district: 'Plateau',
    driver_name: 'Moussa Ibrahim (Billo Express)',
    created_at: '2026-09-04T12:15:00Z',
  },
  {
    id: 'RO-1028',
    order_number: 1028,
    customer_name: 'Aïchatou Seydou',
    customer_phone: '+227 96 44 22 11',
    items_summary: '1x Dambou Blanc & Moringa Bio, 1x Poulet Bicyclette Braisé',
    total_xof: 11000,
    payment_method: 'flooz',
    status: 'completed',
    delivery_district: 'Harobanda',
    driver_name: 'Abdoulaye Garba (Billo Express)',
    created_at: '2026-09-04T11:40:00Z',
  },
  {
    id: 'RO-1027',
    order_number: 1027,
    customer_name: 'Hamani Salifou',
    customer_phone: '+227 89 77 66 55',
    items_summary: '1x Capitaine Grillé du Fleuve Niger, Alloco & Piment Galmi',
    total_xof: 8000,
    payment_method: 'cash',
    status: 'completed',
    delivery_district: 'Koira Kano',
    driver_name: 'Oumarou Sani (Billo Express)',
    created_at: '2026-09-04T10:55:00Z',
  },
  {
    id: 'RO-1026',
    order_number: 1026,
    customer_name: 'Dr. Fatima Diallo',
    customer_phone: '+227 92 11 33 44',
    items_summary: '3x Box Sauces Terroir Kopto & Pâte d’Arachide',
    total_xof: 12500,
    payment_method: 'airtel_money',
    status: 'completed',
    delivery_district: 'Ryad',
    driver_name: 'Moussa Ibrahim (Billo Express)',
    created_at: '2026-09-03T19:20:00Z',
  },
  {
    id: 'RO-1025',
    order_number: 1025,
    customer_name: 'Ousmane Mamane',
    customer_phone: '+227 94 88 99 00',
    items_summary: '2x Sandwich Chawarma Sahel & Frites Galmi',
    total_xof: 6000,
    payment_method: 'cash',
    status: 'completed',
    delivery_district: 'Francophonie',
    driver_name: 'Souleymane Daouda (Billo Express)',
    created_at: '2026-09-03T13:10:00Z',
  },
  {
    id: 'RO-1024',
    order_number: 1024,
    customer_name: 'Balkissa Idriss',
    customer_phone: '+227 91 55 44 33',
    items_summary: '1x Salade Niameyenne, 2x Cocktail Bissap Ananas',
    total_xof: 4500,
    payment_method: 'flooz',
    status: 'cancelled',
    delivery_district: 'Plateau',
    created_at: '2026-09-02T12:05:00Z',
  },
];

export default function RestaurantHistoryPage() {
  const [orders, setOrders] = useState<RestaurantOrderHistoryItem[]>(SAMPLE_ORDERS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrderHistoryItem | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('restaurant_orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          const mapped: RestaurantOrderHistoryItem[] = data.map((d: any) => ({
            id: d.id,
            order_number: d.order_number || parseInt(d.id.replace(/\D/g, '')) || 1000,
            customer_name: d.customer_name || 'Client Allôresto',
            customer_phone: d.customer_phone || '+227 XX XX XX XX',
            items_summary: d.items_summary || 'Articles variés',
            total_xof: d.total_xof || d.total || 0,
            payment_method: d.payment_method || 'cash',
            status: d.status || 'completed',
            delivery_district: d.delivery_district || 'Niamey',
            driver_name: d.driver_name || 'Billo Express',
            created_at: d.created_at || new Date().toISOString(),
          }));
          setOrders(mapped);
        }
      }
    } catch (e) {
      console.warn('Utilisation historique restaurant local:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.order_number.toString().includes(searchTerm) ||
      ord.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.delivery_district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.items_summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && ord.status === 'completed') ||
      (statusFilter === 'cancelled' && ord.status === 'cancelled');
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.total_xof, 0);
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const avgBasket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête Navigation */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Historique des Commandes Restaurant
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Consultation des services passés, chiffre d’affaires et détails des clients
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/app/restaurant/dashboard"
              className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <span>🍳 Écran Cuisine</span>
            </a>
            <a
              href="/app/restaurant/menu"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>🥘 Carte &amp; Plats</span>
            </a>
            <a
              href="/app/restaurant/stats"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📊 Statistiques</span>
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>💳 Formules 0%</span>
            </a>
          </div>
        </header>

        {/* Stats KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Total Commandes</span>
            <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{completedCount} honorées avec succès</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Chiffre d’Affaires Réalisé</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">100% encaissé (0% commission)</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Panier Moyen</span>
            <div className="text-2xl font-black text-white mt-1">
              {avgBasket.toLocaleString()} FCFA
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Par commande livrée</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Taux de Réussite</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 100}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Fiabilité de préparation</div>
          </div>
        </div>

        {/* Recherche et Filtres */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par # n°, nom client, plat ou quartier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Livrées ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === 'cancelled'
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Annulées
            </button>
          </div>
        </div>

        {/* Tableau Responsive des Commandes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Commande</th>
                  <th className="py-3.5 px-4">Client &amp; Contact</th>
                  <th className="py-3.5 px-4">Plats Préparés</th>
                  <th className="py-3.5 px-4">Montant</th>
                  <th className="py-3.5 px-4">Paiement</th>
                  <th className="py-3.5 px-4">Livreur Billo</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      Aucune commande trouvée selon vos critères.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        #{ord.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{ord.customer_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{ord.customer_phone}</div>
                        <div className="text-[10px] text-orange-400">📍 {ord.delivery_district}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-300 text-[11px]">{ord.items_summary}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-amber-300 whitespace-nowrap">
                        {ord.total_xof.toLocaleString()} FCFA
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-medium">
                          {ord.payment_method === 'airtel_money' && '📱 Airtel Money'}
                          {ord.payment_method === 'flooz' && '📱 Moov Flooz'}
                          {ord.payment_method === 'cash' && '💵 Espèces'}
                          {ord.payment_method === 'al_izza' && '🏦 Al Izza'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-[11px] whitespace-nowrap">
                        {ord.driver_name || 'Non assigné'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(ord.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {ord.status === 'completed' ? 'Livrée' : ord.status === 'cancelled' ? 'Annulée' : 'En cours'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Détail Commande Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Ticket Commande</span>
                  <h3 className="text-base font-bold text-white">Commande #{selectedOrder.order_number}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Client</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customer_name}</div>
                  <div className="text-slate-300 font-mono">{selectedOrder.customer_phone}</div>
                  <div className="text-orange-400">📍 Quartier : {selectedOrder.delivery_district}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Plats commandés</div>
                  <div className="text-slate-200">{selectedOrder.items_summary}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block">Total Encaissé</span>
                    <span className="text-base font-black text-amber-400">
                      {selectedOrder.total_xof.toLocaleString()} FCFA
                    </span>
                  </div>
                  <span className="capitalize px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-bold">
                    {selectedOrder.payment_method.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Livreur assigné :</span>
                  <span className="font-bold text-slate-200">{selectedOrder.driver_name || 'Billo Express'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
