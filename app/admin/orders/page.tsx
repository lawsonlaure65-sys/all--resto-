'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
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
}

const SAMPLE_ORDERS: AdminOrder[] = [
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
    created_at: '2026-09-04T10:15:00Z',
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
    total_amount: 18500,
    delivery_fee: 1500,
    payment_method: 'flooz',
    payment_status: 'paid',
    status: 'cooking',
    driver_name: 'Abdoulaye Garba (En attente resto)',
    created_at: '2026-09-04T10:05:00Z',
  },
  {
    id: 'ORD-9819',
    customer_name: 'Amina Moussa',
    customer_phone: '+227 91 88 99 00',
    restaurant_name: 'Grillades & Braises du Sahel',
    delivery_address: 'Koira Kano Est, Rue KK-12',
    district: 'Koira Kano',
    items: [
      { id: '5', name: 'Poulet Bicyclette Braisé Galmi', quantity: 1, price: 7500 },
      { id: '6', name: 'Attiéké Frais & Aloco', quantity: 1, price: 2000 },
    ],
    total_amount: 9500,
    delivery_fee: 1200,
    payment_method: 'cash',
    payment_status: 'pending',
    status: 'pending',
    created_at: '2026-09-04T09:50:00Z',
  },
  {
    id: 'ORD-9818',
    customer_name: 'Idrissa Alio',
    customer_phone: '+227 89 11 22 33',
    restaurant_name: 'Le Palmier - Oasis Gourmande',
    delivery_address: 'Cité Francophonie, Villa 88',
    district: 'Koubia',
    items: [
      { id: '7', name: 'Massa Traditionnel au Miel', quantity: 4, price: 2000 },
    ],
    total_amount: 8000,
    delivery_fee: 1500,
    payment_method: 'al_izza',
    payment_status: 'paid',
    status: 'delivered',
    driver_name: 'Oumarou Sani',
    created_at: '2026-09-04T09:20:00Z',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(SAMPLE_ORDERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setOrders(data);
        }
      }
    } catch (e) {
      console.warn('Utilisation commandes locales:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_method === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'cooking' || o.status === 'delivering'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Supervision des Commandes Allôresto Niamey
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Flux en temps réel de toutes les commandes, restaurants, livreurs et paiements
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/app/admin/dashboard"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📊 Dashboard</span>
            </a>
            <a
              href="/app/admin/restaurants"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>🍽️ Restaurants</span>
            </a>
            <a
              href="/app/admin/drivers"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>🛵 Livreurs</span>
            </a>
            <a
              href="/app/admin/settings"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>⚙️ Paramètres</span>
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Volume Total</span>
            <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
            <span className="text-[11px] text-slate-500">Commandes enregistrées</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">En cours d'exécution</span>
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
            <span className="text-xs text-slate-400 font-medium">Chiffre d'Affaires Brut</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {totalRevenue.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-slate-400">Total paniers + livraison</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par n° commande, client, restaurant, quartier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tous statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cooking">En cuisine</option>
              <option value="delivering">En livraison</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>

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
                  <th className="py-3.5 px-4">Livreur</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      <div>{order.id}</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-400">{order.customer_phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{order.restaurant_name}</td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{order.district}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.delivery_address}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {order.total_amount.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold block w-fit">
                        {order.payment_method === 'airtel_money' && '🔴 Airtel Money'}
                        {order.payment_method === 'flooz' && '🔵 Moov Flooz'}
                        {order.payment_method === 'al_izza' && '🟡 Al Izza'}
                        {order.payment_method === 'cash' && '💵 Espèces'}
                      </span>
                    </td>
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
                    <td className="py-3 px-4 text-[11px] text-slate-300">
                      {order.driver_name || <span className="text-slate-500 italic">Non assigné</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Détails Commande */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Commande {selectedOrder.id}</h3>
                  <p className="text-xs text-slate-400">
                    Passée le {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
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
                  <div className="text-slate-400 font-medium">Informations Client :</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customer_name}</div>
                  <div className="text-slate-300">{selectedOrder.customer_phone}</div>
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
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
