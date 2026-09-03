'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

interface Subscription {
  id: string;
  restaurant_id: string;
  plan_type: string;
  amount_xof: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  payment_method?: string;
  payment_date?: string;
  auto_renew?: boolean;
  restaurants?: {
    name: string;
    slug: string;
  } | null;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [planType, setPlanType] = useState('monthly');
  const [amount, setAmount] = useState(75000);
  const [months, setMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

      // Charger restaurants
      const { data: restoData, error: restoError } = await supabase
        .from('restaurants')
        .select('id, name, slug')
        .order('name');

      if (!restoError && restoData) {
        setRestaurants(restoData);
      }

      // Charger abonnements
      const { data: subData, error: subError } = await supabase
        .from('restaurant_subscriptions')
        .select(`
          *,
          restaurants (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (!subError && subData) {
        setSubscriptions(subData as any);
      }
    } catch (error) {
      console.error('Erreur chargement abonnements:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async () => {
    if (!selectedRestaurant) {
      alert('Veuillez sélectionner un restaurant partenaire.');
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + Number(months));

      const { error } = await supabase.from('restaurant_subscriptions').insert({
        restaurant_id: selectedRestaurant,
        plan_type: planType,
        amount_xof: amount,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        payment_method: paymentMethod,
        payment_date: startDate.toISOString().split('T')[0],
        auto_renew: true,
      });

      if (error) throw error;

      alert('Abonnement enregistré avec succès pour ce restaurant !');
      setShowModal(false);
      setSelectedRestaurant('');
      loadData();
    } catch (error: any) {
      alert("Erreur lors de la création de l'abonnement : " + (error?.message || 'Erreur base de données'));
    }
  };

  const renewSubscription = async (subId: string) => {
    setActionLoading(subId);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { error } = await supabase
        .from('restaurant_subscriptions')
        .update({
          status: 'active',
          end_date: endDate.toISOString().split('T')[0],
          payment_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', subId);

      if (error) throw error;

      alert('Abonnement prolongé de 1 mois avec succès !');
      loadData();
    } catch (error: any) {
      alert('Erreur lors du renouvellement : ' + (error?.message || 'Inconnue'));
    } finally {
      setActionLoading(null);
    }
  };

  const expireSubscription = async (subId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir marquer cet abonnement comme expiré ?')) return;

    setActionLoading(subId);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('restaurant_subscriptions')
        .update({ status: 'expired' })
        .eq('id', subId);

      if (error) throw error;

      alert('Abonnement marqué comme expiré.');
      loadData();
    } catch (error: any) {
      alert("Erreur lors de l'expiration : " + (error?.message || 'Inconnue'));
    } finally {
      setActionLoading(null);
    }
  };

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const expiredSubs = subscriptions.filter((s) => s.status === 'expired');
  const totalMonthlyMRR = activeSubs.reduce((sum, s) => sum + (s.amount_xof || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
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
              <h1 className="text-xl font-bold tracking-tight">💳 Abonnements & Facturation Partenaires</h1>
              <p className="text-blue-100 text-xs">Gestion des forfaits mensuels et accès cuisines Niamey</p>
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
              href="/app/admin/restaurants"
              className="bg-blue-500/60 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              🍽️ Restaurants
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <span>+ Nouvel Abonnement</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Abonnements Actifs</span>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">En règle</span>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">{activeSubs.length}</p>
            <p className="text-gray-500 text-xs mt-1">Établissements opérationnels en direct</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Revenus Forfaits (MRR)</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Mensuel</span>
            </div>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">{totalMonthlyMRR.toLocaleString()} FCFA</p>
            <p className="text-gray-500 text-xs mt-1">Hors commissions de commandes (15%)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Relances & Expirés</span>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">À renouveler</span>
            </div>
            <p className="text-3xl font-extrabold text-rose-600 mt-2">{expiredSubs.length}</p>
            <p className="text-gray-500 text-xs mt-1">Accès bloqué par le trigger SQL</p>
          </div>
        </div>

        {/* Pricing Guide Card */}
        <div className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>💡 Formules de Partenariat &amp; Contrat Officiel Allôresto Niamey</span>
            </h2>
            <a
              href="/app/admin/contracts"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 transition"
            >
              📜 Ouvrir la page de signature électronique →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 rounded-xl border-2 border-amber-400 relative">
              <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Recommandé Lancement
              </span>
              <div className="font-bold text-amber-900 text-sm">Offre Lancement (Mois 1-6)</div>
              <div className="text-amber-700 font-mono font-black text-base mt-0.5">75 000 FCFA / mois</div>
              <p className="text-gray-700 mt-1"><strong>0% de commission</strong> sur les commandes. Le restaurant garde 100% de ses recettes !</p>
            </div>
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
              <div className="font-bold text-blue-900 text-sm">Régime Croissance (Mois 7+)</div>
              <div className="text-blue-600 font-mono font-bold mt-0.5">100 000 FCFA / mois</div>
              <p className="text-gray-600 mt-1"><strong>10% de commission</strong> avec visibilité continue et logistique Billo Express incluse.</p>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <div className="font-bold text-emerald-900 text-sm">Formule Tout-Inclus / VIP</div>
              <div className="text-emerald-600 font-mono font-bold mt-0.5">150 000 FCFA / mois</div>
              <p className="text-gray-600 mt-1"><strong>0% de commission permanente</strong>, support dédié 7j/7, mise en avant en tête d'application.</p>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Registre des Abonnements Partenaires</h3>
              <p className="text-gray-500 text-xs">Historique des forfaits payés et échéances</p>
            </div>
            <button
              onClick={loadData}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              🔄 Recharger
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Formule</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                  <th className="py-3 px-4">Moyen Paiement</th>
                  <th className="py-3 px-4">Période d'accès</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Chargement des abonnements depuis Supabase...
                    </td>
                  </tr>
                ) : subscriptions.length > 0 ? (
                  subscriptions.map((sub) => {
                    const restoName = sub.restaurants?.name || 'Restaurant Partenaire';
                    const restoSlug = sub.restaurants?.slug || '';
                    const isExp = sub.status === 'expired' || (sub.end_date && new Date(sub.end_date) < new Date());

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{restoName}</div>
                          {restoSlug && <div className="text-gray-400 font-mono text-[11px]">{restoSlug}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded text-[11px]">
                            {sub.plan_type || 'Mensuel'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          {(sub.amount_xof || 0).toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4 text-gray-600 capitalize">
                          {sub.payment_method === 'mobile_money'
                            ? '📱 Mobile Money'
                            : sub.payment_method === 'cash'
                            ? '💵 Espèces'
                            : '🏦 Virement'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <div>Du: {sub.start_date ? new Date(sub.start_date).toLocaleDateString('fr-FR') : 'N/A'}</div>
                          <div className="font-semibold text-gray-900">
                            Au: {sub.end_date ? new Date(sub.end_date).toLocaleDateString('fr-FR') : 'N/A'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              !isExp && sub.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {!isExp && sub.status === 'active' ? '✅ En Règle' : '❌ Expiré'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center space-x-2">
                          {!isExp && sub.status === 'active' ? (
                            <button
                              onClick={() => expireSubscription(sub.id)}
                              disabled={actionLoading === sub.id}
                              className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded text-xs font-semibold transition"
                            >
                              {actionLoading === sub.id ? '...' : 'Bloquer'}
                            </button>
                          ) : (
                            <button
                              onClick={() => renewSubscription(sub.id)}
                              disabled={actionLoading === sub.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-semibold transition shadow-sm"
                            >
                              {actionLoading === sub.id ? '...' : 'Renouveler +1M'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      Aucun abonnement enregistré pour le moment. Cliquez sur "+ Nouvel Abonnement".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Ajout Abonnement */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">Activer un abonnement restaurant</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Restaurant Partenaire *</label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">-- Choisir un restaurant --</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Formule / Plan</label>
                <select
                  value={planType}
                  onChange={(e) => {
                    setPlanType(e.target.value);
                    if (e.target.value === 'standard') setAmount(50000);
                    if (e.target.value === 'premium') setAmount(75000);
                    if (e.target.value === 'vip') setAmount(150000);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Mensuel Classique (personnalisé)</option>
                  <option value="standard">Standard (50 000 FCFA / mois - 15%)</option>
                  <option value="premium">Premium (75 000 FCFA / mois - 10%)</option>
                  <option value="vip">VIP Traiteur (150 000 FCFA / mois - 0%)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Montant Encaissé (FCFA)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Durée (Mois)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Moyen de règlement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
                >
                  <option value="mobile_money">📱 Mobile Money (Airtel / Moov / Amanata)</option>
                  <option value="cash">💵 Espèces en main propre</option>
                  <option value="bank_transfer">🏦 Virement Bancaire</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={createSubscription}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition shadow"
              >
                Confirmer l'Abonnement
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
