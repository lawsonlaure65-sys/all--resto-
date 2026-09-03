'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface OrderHistoryRecord {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_xof: number;
  order_status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  restaurant_name: string | null;
  restaurant_status: string | null;
  delivery_status: string | null;
  driver_name: string | null;
}

interface DriverHistoryRecord {
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  assignment_id: string;
  order_number: number;
  customer_name: string;
  total_xof: number;
  delivery_status: string;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  is_completed: boolean;
}

export default function AdminExportsPage() {
  const [admin, setAdmin] = useState<{ email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'drivers'>('orders');
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);
  const [driversData, setDriversData] = useState<DriverHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | 'month'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        window.location.href = '/app/admin/login';
        return;
      }
      setAdmin(JSON.parse(adminData));
      loadData();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Chargement de la vue order_history
      const { data: ordersData, error: ordersError } = await supabase
        .from('order_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.warn('Erreur vue order_history:', ordersError);
      } else {
        setOrders(ordersData || []);
      }

      // Chargement de la vue driver_history
      const { data: driversHistory, error: driversError } = await supabase
        .from('driver_history')
        .select('*');

      if (driversError) {
        console.warn('Erreur vue driver_history:', driversError);
      } else {
        setDriversData(driversHistory || []);
      }
    } catch (err) {
      console.error('Erreur chargement exports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des commandes
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_phone || '').includes(searchTerm) ||
      (order.delivery_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.restaurant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.order_number || '').includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || order.order_status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all' && order.created_at) {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate =
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === '7days') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 7;
      } else if (dateFilter === 'month') {
        matchesDate =
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Export CSV Commandes
  const exportOrdersToCSV = () => {
    if (filteredOrders.length === 0) {
      alert('Aucune commande à exporter.');
      return;
    }

    const headers = [
      'N° Commande',
      'Date & Heure',
      'Client',
      'Téléphone',
      'Adresse de livraison',
      'Restaurant',
      'Montant Total (FCFA)',
      'Statut Commande',
      'Mode de Paiement',
      'Statut Paiement',
      'Livreur Assigné',
      'Statut Livraison'
    ];

    const rows = filteredOrders.map((o) => [
      `#${o.order_number || ''}`,
      o.created_at ? new Date(o.created_at).toLocaleString('fr-FR') : '',
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.customer_phone || ''}"`,
      `"${(o.delivery_address || '').replace(/"/g, '""')}"`,
      `"${(o.restaurant_name || 'Allôresto Kitchen').replace(/"/g, '""')}"`,
      o.total_xof || 0,
      `"${o.order_status || ''}"`,
      `"${o.payment_method || ''}"`,
      `"${o.payment_status || ''}"`,
      `"${(o.driver_name || 'Non assigné').replace(/"/g, '""')}"`,
      `"${o.delivery_status || 'N/A'}"`
    ]);

    const csvContent =
      '\uFEFF' + // BOM UTF-8 pour Excel
      headers.join(';') +
      '\n' +
      rows.map((row) => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `alloresto_commandes_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export CSV Livreurs
  const exportDriversToCSV = () => {
    if (driversData.length === 0) {
      alert('Aucune donnée de livraison à exporter.');
      return;
    }

    const headers = [
      'Livreur',
      'Téléphone Livreur',
      'N° Commande',
      'Client',
      'Montant Course (FCFA)',
      'Statut Livraison',
      'Accepté à',
      'Récupéré à',
      'Livré à',
      'Terminé'
    ];

    const rows = driversData.map((d) => [
      `"${(d.driver_name || '').replace(/"/g, '""')}"`,
      `"${d.driver_phone || ''}"`,
      `#${d.order_number || ''}`,
      `"${(d.customer_name || '').replace(/"/g, '""')}"`,
      d.total_xof || 0,
      `"${d.delivery_status || ''}"`,
      d.accepted_at ? new Date(d.accepted_at).toLocaleString('fr-FR') : '',
      d.picked_up_at ? new Date(d.picked_up_at).toLocaleString('fr-FR') : '',
      d.delivered_at ? new Date(d.delivered_at).toLocaleString('fr-FR') : '',
      d.is_completed ? 'OUI' : 'NON'
    ]);

    const csvContent =
      '\uFEFF' +
      headers.join(';') +
      '\n' +
      rows.map((row) => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `billo_express_livraisons_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Top Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/app/admin/dashboard"
              className="bg-blue-700/80 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              ← Retour Dashboard
            </a>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Allôresto - Exports & Historique 🇳🇪</h1>
              <p className="text-blue-100 text-xs">Vues Supabase : order_history & driver_history</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/app/admin/restaurants"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              🍽️ Restaurants
            </a>
            <a
              href="/app/admin/subscriptions"
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              💳 Abonnements
            </a>
            <button
              onClick={loadData}
              className="bg-blue-500/60 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              🔄 Actualiser
            </button>
            <button
              onClick={activeTab === 'orders' ? exportOrdersToCSV : exportDriversToCSV}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition flex items-center gap-2"
            >
              <span>📥 Exporter en CSV (Excel)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Historique des Commandes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition ${
              activeTab === 'drivers'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🛵 Historique Livraisons Billo ({driversData.length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Rechercher client, téléphone, quartier, restaurant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="7days">7 derniers jours</option>
                  <option value="month">Ce mois</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending_confirmation">En attente</option>
                  <option value="preparing">En préparation</option>
                  <option value="delivering">En livraison</option>
                  <option value="delivered">Livrées</option>
                </select>

                <button
                  onClick={exportOrdersToCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Exporter {filteredOrders.length} lignes
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Commande</th>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4">Adresse</th>
                      <th className="py-3.5 px-4">Restaurant</th>
                      <th className="py-3.5 px-4 text-right">Montant</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4">Livreur</th>
                      <th className="py-3.5 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          Chargement des données depuis Supabase...
                        </td>
                      </tr>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/70 transition">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">
                            #{o.order_number || o.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{o.customer_name}</div>
                            <div className="text-gray-400 text-[11px]">{o.customer_phone}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate" title={o.delivery_address}>
                            {o.delivery_address}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {o.restaurant_name || 'Allôresto Kitchen'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                            {(o.total_xof || 0).toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                o.order_status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : o.order_status === 'preparing'
                                  ? 'bg-amber-100 text-amber-700'
                                  : o.order_status === 'delivering'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {o.order_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {o.driver_name ? (
                              <span className="font-medium text-purple-700">🛵 {o.driver_name}</span>
                            ) : (
                              <span className="text-gray-400 italic">Non assigné</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                            {o.created_at
                              ? new Date(o.created_at).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          Aucune commande trouvée pour ces filtres.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Drivers */}
        {activeTab === 'drivers' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={exportDriversToCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Exporter historique livreurs ({driversData.length} lignes)
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Livreur</th>
                      <th className="py-3.5 px-4">Téléphone</th>
                      <th className="py-3.5 px-4">Commande</th>
                      <th className="py-3.5 px-4">Client</th>
                      <th className="py-3.5 px-4 text-right">Montant Course</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4">Terminé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {driversData.length > 0 ? (
                      driversData.map((d, index) => (
                        <tr key={index} className="hover:bg-gray-50/70 transition">
                          <td className="py-3 px-4 font-bold text-gray-900">{d.driver_name || 'Livreur'}</td>
                          <td className="py-3 px-4 text-gray-600 font-mono">{d.driver_phone || 'N/A'}</td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">#{d.order_number}</td>
                          <td className="py-3 px-4 text-gray-800">{d.customer_name}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                            {(d.total_xof || 0).toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-700">{d.delivery_status}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                d.is_completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {d.is_completed ? 'Oui' : 'En cours'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          Aucune course livreur enregistrée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
