'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  commission_rate?: number;
  created_at?: string;
}

interface RestaurantOnboarding {
  id: string;
  restaurant_id: string;
  status: 'pending' | 'approved' | 'rejected';
  contract_signed: boolean;
  contract_url: string | null;
  manager_name: string | null;
  manager_phone: string | null;
  manager_email: string | null;
  notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [onboardings, setOnboardings] = useState<RestaurantOnboarding[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'onboarding'>('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusActionLoading, setStatusActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // 1. Charger les restaurants
      const { data: restos, error: restoError } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (restoError) console.warn('Erreur chargement restaurants:', restoError);
      setRestaurants(restos || []);

      // 2. Charger les onboardings s'il existe la table
      const { data: onbData, error: onbError } = await supabase
        .from('restaurant_onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (!onbError && onbData) {
        setOnboardings(onbData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (restaurantId: string, currentStatus: boolean) => {
    setStatusActionLoading(restaurantId);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('restaurants')
        .update({ is_active: !currentStatus })
        .eq('id', restaurantId);

      if (error) throw error;
      
      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurantId ? { ...r, is_active: !currentStatus } : r))
      );
    } catch (error: any) {
      alert('Erreur lors de la mise à jour: ' + (error?.message || 'Inconnue'));
    } finally {
      setStatusActionLoading(null);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      (r.name || '').toLowerCase().includes(term) ||
      (r.slug || '').toLowerCase().includes(term) ||
      (r.address || '').toLowerCase().includes(term) ||
      (r.phone || '').includes(term)
    );
  });

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
              <h1 className="text-xl font-bold tracking-tight">🍽️ Gestion & Activation des Restaurants</h1>
              <p className="text-blue-100 text-xs">Validation administrative, contrats & statut d'activité Niamey</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/app/admin/contracts"
              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              📜 Signer Contrat
            </a>
            <a
              href="/app/admin/subscriptions"
              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              💳 Abonnements
            </a>
            <a
              href="/app/admin/exports"
              className="bg-blue-500/60 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              📥 Exports CSV
            </a>
            <button
              onClick={loadData}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Onboarding Workflow Summary Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>🛡️ Workflow de Sécurisation Partenaires Allôresto Niamey</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-bold text-blue-800 block mb-0.5">1. Contrat Signé</span>
              <p className="text-gray-600">Vérification de l'agrément et commission négociée (ex: 15%).</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-bold text-blue-800 block mb-0.5">2. Validation Admin</span>
              <p className="text-gray-600">Activation du restaurant ci-dessous pour l'afficher aux clients.</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-bold text-blue-800 block mb-0.5">3. Remise Identifiants</span>
              <p className="text-gray-600">Génération du code gérant et accès à la cuisine en direct.</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <span className="font-bold text-blue-800 block mb-0.5">4. Test & Déploiement</span>
              <p className="text-gray-600">Configuration des plats et test d'un premier ticket de commande.</p>
            </div>
          </div>
        </div>

        {/* Tab & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                activeTab === 'restaurants'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🍽️ Tous les Restaurants ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition ${
                activeTab === 'onboarding'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              📝 Demandes d'adhésion ({onboardings.length})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Rechercher nom, slug, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Tab 1: Restaurants List */}
        {activeTab === 'restaurants' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Établissement</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Adresse</th>
                    <th className="py-3.5 px-4 text-center">Statut Public</th>
                    <th className="py-3.5 px-4 text-center">Action Activation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Chargement des restaurants depuis Supabase...
                      </td>
                    </tr>
                  ) : filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((resto) => (
                      <tr key={resto.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900 text-sm">{resto.name}</div>
                          <div className="text-gray-400 font-mono text-[11px]">slug: {resto.slug}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-700">
                            {resto.phone ? <div className="font-mono">📞 {resto.phone}</div> : null}
                            {resto.email ? <div className="text-gray-500 text-[11px]">✉️ {resto.email}</div> : null}
                            {!resto.phone && !resto.email && <span className="text-gray-400 italic">Non renseigné</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 max-w-[220px]">
                          {resto.address || <span className="text-gray-400 italic">Non renseignée</span>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              resto.is_active
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {resto.is_active ? '✅ En ligne (Actif)' : '⏸️ Suspendu / Inactif'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleActive(resto.id, resto.is_active)}
                            disabled={statusActionLoading === resto.id}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                              resto.is_active
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            } ${statusActionLoading === resto.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {statusActionLoading === resto.id
                              ? 'En cours...'
                              : resto.is_active
                              ? 'Désactiver'
                              : 'Activer Restaurant'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Aucun restaurant ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Onboarding */}
        {activeTab === 'onboarding' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Dossiers d'adhésion partenaires</h3>
                <p className="text-gray-500 text-xs">Suivi des signatures de contrat et pièces justificatives</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Gérant / Contact</th>
                    <th className="py-3 px-4">Téléphone</th>
                    <th className="py-3 px-4 text-center">Contrat Signé</th>
                    <th className="py-3 px-4">Date de soumission</th>
                    <th className="py-3 px-4">Statut Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {onboardings.length > 0 ? (
                    onboardings.map((onb) => (
                      <tr key={onb.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 px-4 font-semibold text-gray-900">{onb.manager_name || 'Candidat'}</td>
                        <td className="py-3 px-4 font-mono text-gray-700">{onb.manager_phone || onb.manager_email}</td>
                        <td className="py-3 px-4 text-center">
                          {onb.contract_signed ? (
                            <span className="text-green-600 font-bold">Oui (Signé)</span>
                          ) : (
                            <span className="text-amber-600 font-medium">En attente</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {onb.created_at ? new Date(onb.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              onb.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : onb.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {onb.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Aucun dossier d'adhésion en attente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
