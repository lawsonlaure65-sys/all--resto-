'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface RestaurantPlansPageProps {
  onClose?: () => void;
  onOpenContract?: () => void;
  onGoToDashboard?: () => void;
}

export default function RestaurantPlansPage({
  onClose,
  onOpenContract,
  onGoToDashboard,
}: RestaurantPlansPageProps = {}) {
  const [selectedOption, setSelectedOption] = useState<'simple' | 'tiers'>('tiers');
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | 'vip' | 'simple'>('premium');
  const [restaurantsList, setRestaurantsList] = useState<any[]>([]);
  const [selectedRestoId, setSelectedRestoId] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [managerPhone, setManagerPhone] = useState<string>('+227 ');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [activationSummary, setActivationSummary] = useState<any>(null);

  // Option 1 : Tarif unique
  const simplePlan = {
    name: 'Abonnement Unique Lancement',
    price: 75000,
    commission: 0,
    features: [
      'Visibilité complète sur l’app Allôresto',
      'Dashboard Cuisine & alertes commandes en direct',
      'Flotte de livraison Billo Express incluse',
      'Publicité et marketing offerts',
      '0% de commission sur vos ventes (Mois 1 à 6)',
      'Frais de livraison payés par le client (1 000 - 2 000 FCFA)',
      'Support client dédié 7j/7',
    ],
  };

  // Option 2 : 3 formules
  const tierPlans = [
    {
      id: 'standard',
      name: 'Standard (Starter)',
      price: 50000,
      commission: 15,
      description: 'Fast-foods, sandwicheries, petits maquis',
      features: [
        'Visibilité complète sur Allôresto',
        'Dashboard de gestion Cuisine',
        'Service de livraison Billo Express inclus',
        'Frais de livraison payés par le client',
        'Commission : 15% par commande livrée',
      ],
      tag: 'Moins cher qu’un livreur mi-temps',
      color: 'border-slate-700 bg-slate-900/70',
      activeColor: 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500',
      badge: 'Starter',
      badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      id: 'premium',
      name: 'Premium (Populaire)',
      price: 75000,
      commission: 10,
      description: 'Restaurants établis (Plateau, Yantala, Koira Kano)',
      features: [
        'Tout ce qui est inclus dans le Standard',
        '⭐ Mise en avant sur la page d’accueil',
        '⭐ Notifications promotionnelles push aux clients',
        '⭐ Support opérationnel prioritaire 7j/7',
        'Commission réduite : 10% par commande livrée',
      ],
      popular: true,
      tag: 'Le choix équilibré recommandé',
      color: 'border-amber-500/50 bg-amber-500/10',
      activeColor: 'border-amber-500 bg-amber-500/20 ring-2 ring-amber-500',
      badge: '⭐ Recommandé 60%',
      badgeClass: 'bg-amber-500 text-slate-950 font-black',
    },
    {
      id: 'vip',
      name: 'VIP / Traiteur',
      price: 150000,
      commission: 0,
      description: 'Grands restaurants, hôtels, traiteurs',
      features: [
        'Tout ce qui est inclus dans le Premium',
        '🌟 ZÉRO COMMISSION (0%) : Gardez 100% de vos ventes',
        '🌟 Badge "Restaurant Partenaire Certifié VIP"',
        '🌟 Shooting photo pro de votre carte offert',
        '🌟 Responsable de compte dédié 24/7',
      ],
      tag: 'Rentabilité maximale sur gros volumes',
      color: 'border-purple-500/50 bg-purple-500/10',
      activeColor: 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500',
      badge: '0% Commission',
      badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
  ];

  useEffect(() => {
    // Tenter de charger le restaurant stocké
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alloresto_restaurant_session') || localStorage.getItem('restaurant');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id || parsed.restaurantId) {
            setSelectedRestoId(parsed.id || parsed.restaurantId);
          }
          if (parsed.name || parsed.restaurantName) {
            setManagerName(parsed.name || parsed.restaurantName);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function loadRestos() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data } = await supabase.from('restaurants').select('id, name, slug, phone, email').order('name');
        if (data && data.length > 0) {
          setRestaurantsList(data);
        }
      } catch (err) {
        console.error('Erreur chargement restaurants:', err);
      }
    }
    loadRestos();
  }, []);

  const handleSelectOption = (opt: 'simple' | 'tiers') => {
    setSelectedOption(opt);
    if (opt === 'simple') {
      setSelectedPlan('simple');
    } else {
      setSelectedPlan('premium');
    }
  };

  const handleAccept = async () => {
    if (!selectedRestoId) {
      alert('Veuillez sélectionner votre restaurant dans la liste déroulante.');
      return;
    }
    if (!accepted) {
      alert('Veuillez cocher la case pour accepter le contrat et valider l’abonnement.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const chosenResto = restaurantsList.find((r) => r.id === selectedRestoId);

      let planPrice = 0;
      let planCommission = 0;
      let planType = '';
      let planDisplayName = '';

      if (selectedOption === 'simple') {
        planPrice = simplePlan.price;
        planCommission = simplePlan.commission;
        planType = 'simple';
        planDisplayName = 'Abonnement Unique (75 000 FCFA / 0% comm.)';
      } else {
        const plan = tierPlans.find((p) => p.id === selectedPlan) || tierPlans[1];
        planPrice = plan.price;
        planCommission = plan.commission;
        planType = plan.id;
        planDisplayName = `${plan.name} (${plan.price.toLocaleString('fr-FR')} FCFA / ${plan.commission}% comm.)`;
      }

      const nowIso = new Date().toISOString();
      const signName = managerName || chosenResto?.name || 'Gérant Partenaire';

      if (supabase) {
        // 1. Enregistrer / Mettre à jour le contrat dans restaurant_contracts
        await supabase.from('restaurant_contracts').upsert({
          restaurant_id: selectedRestoId,
          contract_signed: true,
          signed_at: nowIso,
          signed_by: `${signName} (${planDisplayName})`,
          signed_ip: 'Niamey - Espace Cuisine Web',
          version: `2.0-${planType.toUpperCase()}-2026`,
        });

        // 2. Créer la souscription active dans restaurant_subscriptions
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await supabase.from('restaurant_subscriptions').insert({
          restaurant_id: selectedRestoId,
          amount_xof: planPrice,
          commission_rate: planCommission,
          plan_type: planType,
          start_date: nowIso.split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_date: nowIso.split('T')[0],
          payment_method: 'mobile_money',
          auto_renew: true,
        });

        // 3. Activer le restaurant sur la plateforme Allôresto
        await supabase.from('restaurants').update({ is_active: true }).eq('id', selectedRestoId);
      }

      setActivationSummary({
        restaurantName: chosenResto?.name || 'Votre Établissement',
        managerName: signName,
        planDisplayName,
        price: planPrice,
        commission: planCommission,
        signedAt: new Date().toLocaleString('fr-FR'),
        ref: `ALLORESTO-${planType.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      });

      setIsActivated(true);
      alert('✅ Contrat accepté avec succès ! Votre restaurant est maintenant activé sur Allôresto Niamey.');
    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de l'acceptation du contrat : " + (error?.message || 'Vérifiez la connexion'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (onGoToDashboard) {
      onGoToDashboard();
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/?role=restaurant';
    }
  };

  if (isActivated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 font-sans text-slate-100">
        <div className="bg-slate-900 border border-emerald-500/40 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-black shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              Félicitations &bull; Restaurant Activé
            </span>
            <h1 className="text-2xl font-black text-white mt-2">
              Votre Contrat est Validé ! 🎉
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              L'établissement <strong>{activationSummary?.restaurantName}</strong> est désormais référencé et peut recevoir des commandes en direct à Niamey avec <strong>Billo Express</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-2 text-slate-300">
            <div><span className="text-slate-500">Réf. Contrat :</span> <strong className="text-amber-400">{activationSummary?.ref}</strong></div>
            <div><span className="text-slate-500">Signataire :</span> <strong className="text-white">{activationSummary?.managerName}</strong></div>
            <div><span className="text-slate-500">Formule :</span> <strong className="text-emerald-400">{activationSummary?.planDisplayName}</strong></div>
            <div><span className="text-slate-500">Tarif Fixe :</span> <span className="text-white font-bold">{activationSummary?.price?.toLocaleString('fr-FR')} FCFA / mois</span></div>
            <div><span className="text-slate-500">Commission :</span> <span className="text-emerald-400 font-bold">{activationSummary?.commission}%</span></div>
            <div><span className="text-slate-500">Date/Heure :</span> <span className="text-slate-300">{activationSummary?.signedAt}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black py-3.5 rounded-xl text-xs transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              🍳 Accéder au Dashboard Cuisine
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition cursor-pointer"
            >
              🖨️ Imprimer / PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-orange-500/20">
              A
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Allôresto Niamey 🇳🇪</h1>
              <p className="text-xs text-slate-400">Portail Partenaire - Sélection de la Formule Commerciale</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenContract ? (
              <button
                type="button"
                onClick={onOpenContract}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <span>📜 Lire le Contrat Complet</span>
              </button>
            ) : (
              <a
                href="/app/restaurant/contract"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              >
                <span>📜 Lire le Contrat Complet</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Espace Cuisine
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
                title="Fermer cette page"
              >
                ✕ Fermer
              </button>
            )}
          </div>
        </header>

        {/* Titre & Sous-titre */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Adhésion Réseau Allôresto &amp; Billo Express
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Choisissez votre formule de partenariat
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Deux approches stratégiques et transparentes pour s'adapter à la taille de votre restaurant à Niamey.
          </p>
        </div>

        {/* Boutons Sélecteurs d'Option (Option 1 vs Option 2) */}
        <div className="flex justify-center">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-1.5 inline-flex shadow-inner">
            <button
              onClick={() => handleSelectOption('simple')}
              className={`px-5 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedOption === 'simple'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Option 1 : Tarif Unique (75 000 F / 0%)
            </button>
            <button
              onClick={() => handleSelectOption('tiers')}
              className={`px-5 sm:px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedOption === 'tiers'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Option 2 : 3 Formules (50k / 75k / 150k)
            </button>
          </div>
        </div>

        {/* OPTION 1 : TARIF UNIQUE */}
        {selectedOption === 'simple' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-orange-500/20 via-slate-900 to-amber-500/20 border-2 border-orange-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-3 right-4 bg-orange-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Offre Lancement Sahel
              </div>

              <div className="text-center space-y-2 mb-6">
                <h3 className="text-xl font-black text-white">{simplePlan.name}</h3>
                <p className="text-xs text-slate-300">Simple, transparent, sans commission cachée</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center mb-6">
                <div className="text-4xl sm:text-5xl font-black font-mono text-white">
                  {simplePlan.price.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-normal text-slate-400">FCFA / mois</span>
                </div>
                <div className="mt-3 inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs px-3 py-1 rounded-lg font-mono">
                  🎉 {simplePlan.commission}% de commission sur les commandes
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  (Mois 1 à 6 : Vous gardez 100% du montant de vos plats)
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                {simplePlan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 mb-4 text-center">
                🛵 <strong>Frais de livraison :</strong> 1 000 à 2 000 FCFA payés directement par le client. 0 FCFA facturé au restaurant.
              </div>
            </div>
          </div>
        )}

        {/* OPTION 2 : 3 FORMULES */}
        {selectedOption === 'tiers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tierPlans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`relative rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected ? plan.activeColor : `${plan.color} hover:border-slate-600`
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-lg">
                        ⭐ LE PLUS POPULAIRE (60%)
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${plan.badgeClass}`}>
                          {plan.badge}
                        </span>
                        <input
                          type="radio"
                          name="plans_radio"
                          checked={isSelected}
                          onChange={() => setSelectedPlan(plan.id as any)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-white">{plan.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{plan.description}</p>
                      </div>

                      <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
                        <div className="text-2xl font-black font-mono text-white">
                          {plan.price.toLocaleString('fr-FR')}{' '}
                          <span className="text-xs font-normal text-slate-400">FCFA/mois</span>
                        </div>
                        <div className="text-xs font-bold font-mono mt-1 text-emerald-400">
                          Commission : {plan.commission}% {plan.commission === 0 && '🎉 ZÉRO COMMISSION'}
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                          {plan.tag}
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/60">
                      <div
                        className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition ${
                          isSelected
                            ? 'bg-orange-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ Formule Sélectionnée' : 'Choisir cette formule'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tableau comparatif rapide */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-bold">Critère</th>
                    <th className="pb-2 font-bold">Standard (Starter)</th>
                    <th className="pb-2 font-bold text-amber-400">Premium (Recommandé)</th>
                    <th className="pb-2 font-bold text-purple-400">VIP / Traiteur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 text-slate-400 font-sans">Abonnement Mensuel</td>
                    <td className="py-2">50 000 FCFA</td>
                    <td className="py-2 text-amber-400 font-bold">75 000 FCFA</td>
                    <td className="py-2 text-purple-400 font-bold">150 000 FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-sans">Commission Commandes</td>
                    <td className="py-2">15 %</td>
                    <td className="py-2 text-emerald-400 font-bold">10 %</td>
                    <td className="py-2 text-emerald-400 font-bold">0 % (Zéro comm.)</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-sans">Mise en Avant Accueil</td>
                    <td className="py-2 text-slate-500">Standard</td>
                    <td className="py-2 text-emerald-400">⭐ Oui (Bannières)</td>
                    <td className="py-2 text-purple-400">🌟 Maximale + Badge VIP</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400 font-sans">Volume Idéal Estimé</td>
                    <td className="py-2 text-slate-400">&lt; 300 000 F/mois</td>
                    <td className="py-2 text-amber-400">300 000 - 1 000 000 F</td>
                    <td className="py-2 text-purple-400">&gt; 1 000 000 F/mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bloc d'Identification et Validation Finale */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>✍️ Établissement Partenaire &amp; Validation Finale</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Sélectionnez le Restaurant à activer *</label>
              <select
                value={selectedRestoId}
                onChange={(e) => {
                  setSelectedRestoId(e.target.value);
                  const sel = restaurantsList.find((r) => r.id === e.target.value);
                  if (sel?.phone) setManagerPhone(sel.phone);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choisir votre restaurant enregistré --</option>
                {restaurantsList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Nom du Gérant / Signataire *</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Ex: Mahamane Sani"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Téléphone / WhatsApp *</label>
              <input
                type="tel"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                placeholder="+227 90 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Checkbox d'engagement */}
          <div className="pt-3 border-t border-slate-800">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-300">
                <strong>✅ J'ai lu et j'accepte les conditions du contrat de partenariat Allôresto Niger.</strong>
                <br />
                Je m'engage à régler l'abonnement mensuel choisi à chaque début de période et je comprends qu'en cas de non-paiement, la visibilité sur l'application sera temporairement suspendue.
              </span>
            </label>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={handleAccept}
            disabled={loading || !accepted}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50 transition cursor-pointer"
          >
            {loading
              ? 'Validation et activation en cours...'
              : `✅ Activer mon restaurant (${
                  selectedOption === 'simple'
                    ? `${simplePlan.price.toLocaleString('fr-FR')} FCFA/mois (0% comm.)`
                    : `${(tierPlans.find((p) => p.id === selectedPlan) || tierPlans[1]).price.toLocaleString('fr-FR')} FCFA/mois`
                })`}
          </button>
        </div>
      </div>
    </div>
  );
}
