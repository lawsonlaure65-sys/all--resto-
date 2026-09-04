'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface RestaurantContractPageProps {
  onClose?: () => void;
  onOpenPlans?: () => void;
  onGoToDashboard?: () => void;
}

export default function RestaurantContractPage({
  onClose,
  onOpenPlans,
  onGoToDashboard,
}: RestaurantContractPageProps = {}) {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [restaurantsList, setRestaurantsList] = useState<any[]>([]);
  const [selectedRestoId, setSelectedRestoId] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [managerPhone, setManagerPhone] = useState<string>('+227 ');
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | 'vip'>('premium');
  const [accepted, setAccepted] = useState(false);
  const [acceptedLaunchTerms, setAcceptedLaunchTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedRecord, setSignedRecord] = useState<any>(null);

  const plans = [
    {
      id: 'standard',
      name: 'Standard (Starter)',
      tag: 'Petits maquis & Fast-foods',
      price: 50000,
      commission: 15,
      description: 'Idéal pour démarrer sans risque avec un budget maîtrisé.',
      features: [
        'Visibilité complète sur l’app Allôresto',
        'Dashboard Cuisine & alertes commandes',
        'Flotte de livraison Billo Express incluse',
        'Frais de livraison payés par le client final',
        'Commission : 15% par commande livrée',
      ],
      color: 'border-slate-700 bg-slate-900/60',
      activeColor: 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500',
      badge: 'Starter',
      badgeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
    {
      id: 'premium',
      name: 'Premium (Populaire)',
      tag: 'Restaurants établis (Plateau, Yantala)',
      price: 75000,
      commission: 10,
      popular: true,
      description: 'Le choix équilibré recommandé pour 65% des restaurants de Niamey.',
      features: [
        'Tout ce qui est inclus dans le Standard',
        '⭐ Mise en avant dans les catégories & filtres',
        '⭐ Bannières promotionnelles & notifications push',
        '⭐ Support opérationnel prioritaire 7j/7',
        'Commission réduite : 10% par commande livrée',
      ],
      color: 'border-amber-500/50 bg-amber-500/5',
      activeColor: 'border-amber-500 bg-amber-500/15 ring-2 ring-amber-500',
      badge: 'Recommandé 65%',
      badgeClass: 'bg-amber-500 text-slate-950 font-black',
    },
    {
      id: 'vip',
      name: 'VIP / Traiteur',
      tag: 'Grands restaurants, Hôtels & Traiteurs',
      price: 150000,
      commission: 0,
      description: 'Pour gros volumes de vente : rentabilité maximale à 0% de prélèvement !',
      features: [
        'Tout ce qui est inclus dans le Premium',
        '🌟 ZÉRO COMMISSION (0%) : Vous gardez 100% de vos ventes',
        '🌟 Badge officiel "Restaurant Partenaire Certifié VIP"',
        '🌟 Shooting photo pro de votre carte offert',
        '🌟 Responsable de compte dédié Allôresto',
      ],
      color: 'border-purple-500/40 bg-purple-500/5',
      activeColor: 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-500',
      badge: '0% Commission',
      badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan) || plans[1];

  useEffect(() => {
    // 1. Tenter de charger le restaurant connecté via localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alloresto_restaurant_session') || localStorage.getItem('restaurant');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRestaurant(parsed);
          if (parsed.restaurantId || parsed.id) {
            setSelectedRestoId(parsed.restaurantId || parsed.id);
          }
          if (parsed.restaurantName || parsed.name) {
            setManagerName(parsed.managerName || parsed.restaurantName || parsed.name);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 2. Charger les restaurants depuis Supabase pour permettre la sélection directe
    loadRestaurantsAndCheckStatus();
  }, []);

  const loadRestaurantsAndCheckStatus = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: restos } = await supabase.from('restaurants').select('id, name, slug, phone, email').order('name');
      if (restos && restos.length > 0) {
        setRestaurantsList(restos);
      }

      // Vérifier si un contrat a déjà été signé pour ce restaurant
      const currentRestoId = selectedRestoId || (restaurant?.restaurantId || restaurant?.id);
      if (currentRestoId) {
        const { data: contractData } = await supabase
          .from('restaurant_contracts')
          .select('*')
          .eq('restaurant_id', currentRestoId)
          .single();

        if (contractData?.contract_signed) {
          setSigned(true);
          setSignedRecord(contractData);
        }
      }
    } catch (error) {
      console.error('Erreur vérification contrat:', error);
    }
  };

  const handleSelectRestaurant = (restoId: string) => {
    setSelectedRestoId(restoId);
    const chosen = restaurantsList.find((r) => r.id === restoId);
    if (chosen) {
      setRestaurant(chosen);
      if (chosen.phone) setManagerPhone(chosen.phone);
    }
  };

  const handleAccept = async () => {
    if (!selectedRestoId && !restaurant?.id && !restaurant?.restaurantId) {
      alert('Veuillez sélectionner votre restaurant dans la liste.');
      return;
    }
    if (!accepted || !acceptedLaunchTerms) {
      alert('Veuillez cocher les cases attestant de la lecture et de l’accord sur les conditions financières (75 000 FCFA/mois, 0% commission).');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const targetId = selectedRestoId || restaurant?.id || restaurant?.restaurantId;
      const chosenResto = restaurantsList.find((r) => r.id === targetId) || restaurant;
      const nowIso = new Date().toISOString();
      const signName = managerName || chosenResto?.name || 'Gérant Partenaire';

      if (supabase) {
        // 1. Enregistrer la signature du contrat avec la formule choisie
        const { error: contractErr } = await supabase.from('restaurant_contracts').upsert({
          restaurant_id: targetId,
          contract_signed: true,
          signed_at: nowIso,
          signed_by: `${signName} (Formule ${currentPlan.name})`,
          signed_ip: 'Niamey - Espace Cuisine Web',
          version: `2.0-${currentPlan.id.toUpperCase()}-2026`,
        });

        if (contractErr) {
          console.warn('Note contract insert:', contractErr.message);
        }

        // 2. Créer l'abonnement initial selon la formule choisie
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await supabase.from('restaurant_subscriptions').insert({
          restaurant_id: targetId,
          amount_xof: currentPlan.price,
          plan_type: selectedPlan,
          commission_rate: currentPlan.commission,
          start_date: nowIso.split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_date: nowIso.split('T')[0],
          payment_method: 'mobile_money',
          auto_renew: true,
        });

        // 3. Activer le restaurant sur Allôresto
        await supabase.from('restaurants').update({ is_active: true }).eq('id', targetId);
      }

      setSignedRecord({
        restaurant_id: targetId,
        signed_by: signName,
        plan: currentPlan,
        signed_at: nowIso,
        ref: `ALLORESTO-${currentPlan.id.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      });

      setSigned(true);
      alert(`✅ Contrat accepté avec succès ! Votre restaurant est activé sur Allôresto Niamey avec la formule ${currentPlan.name} (${currentPlan.price.toLocaleString('fr-FR')} FCFA/mois).`);
    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de l'acceptation du contrat : " + (error?.message || 'Vérifiez la connexion Supabase'));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-6 font-sans text-slate-100">
        <div className="bg-slate-900 border border-emerald-500/40 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-black shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              Partenariat Officiel Validé
            </span>
            <h1 className="text-2xl font-black text-white mt-2">
              Contrat Signé avec Succès ! 🎉
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Votre établissement est officiellement activé sur <strong>Allôresto Niamey</strong> avec la logistique <strong>Billo Express</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-2 text-slate-300">
            <div><span className="text-slate-500">Signataire :</span> <strong className="text-white">{signedRecord?.signed_by || managerName || 'Gérant'}</strong></div>
            <div><span className="text-slate-500">Formule souscrite :</span> <strong className="text-amber-400">{signedRecord?.plan?.name || currentPlan.name}</strong></div>
            <div><span className="text-slate-500">Tarif Mensuel :</span> <span className="text-white font-bold">{signedRecord?.plan?.price?.toLocaleString('fr-FR') || currentPlan.price.toLocaleString('fr-FR')} FCFA / mois</span></div>
            <div><span className="text-slate-500">Commission Commandes :</span> <span className="text-emerald-400 font-bold">{signedRecord?.plan?.commission ?? currentPlan.commission}%</span></div>
            <div><span className="text-slate-500">Statut :</span> <strong className="text-emerald-400">Actif &amp; Prêt à recevoir des commandes</strong></div>
            <div><span className="text-slate-500">Référence Certificat :</span> <span className="text-slate-400">{signedRecord?.ref || 'ALLORESTO-NIAMEY-2026'}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              🍳 Accéder au Dashboard Cuisine
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🖨️ Imprimer / PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-orange-500/20">
              A
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Allôresto Niamey 🇳🇪</h1>
              <p className="text-xs text-slate-400">Contrat d'Affiliation &amp; d'Adhésion Restaurant Partenaire</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenPlans ? (
              <button
                type="button"
                onClick={onOpenPlans}
                className="px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>💳 Comparer les 2 Options</span>
              </button>
            ) : (
              <a
                href="/app/restaurant/plans"
                className="px-3.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>💳 Comparer les 2 Options</span>
              </a>
            )}
            <a
              href="/api/contract/pdf"
              download="contrat-alloresto-restaurant.txt"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <span>📄 Télécharger Texte</span>
            </a>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <span>🖨️ Imprimer PDF</span>
            </button>
            <button
              onClick={handleGoToDashboard}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Retour Cuisine
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

        {/* Note d'introduction partenariale */}
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Lettre d'Invitation Partenaire
            </span>
            <span className="text-xs text-slate-400">À l'attention de la Direction du Restaurant</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Développez vos ventes de 30% à 50% avec Allôresto &amp; Billo Express à Niamey
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Allôresto est la plateforme leader de commande et livraison de repas à Niamey. En nous rejoignant, vous bénéficiez immédiatement d'une vitrine digitale auprès des ministères, banques, ambassades et familles, d'une flotte de coursiers sans frais fixes de personnel, et d'un encaissement garanti.
          </p>
        </div>

        {/* Corps du Contrat */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center border-b border-slate-800 pb-5">
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
              CONTRAT DE PARTENARIAT COMMERCIAL
            </h2>
            <p className="text-xs text-orange-400 mt-1">
              Régime Spécial de Lancement Sahel 2026 &bull; Niamey, République du Niger
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-96 overflow-y-auto pr-2 scrollbar-thin">
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">ARTICLE 1 : OBJET DU CONTRAT</h3>
              <p className="text-slate-300">
                Le présent contrat a pour objet de définir les conditions dans lesquelles le Restaurant sera visible, référencé et pourra recevoir des commandes en ligne via la plateforme <strong>Allôresto</strong> à Niamey, avec acheminement pris en charge par le service officiel <strong>Billo Express</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">ARTICLE 2 : AVANTAGES POUR LE RESTAURANT</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 mt-2">
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Visibilité accrue :</strong> Présence sur l'application utilisée par des milliers de clients à Niamey.</li>
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Hausse du Chiffre d'Affaires :</strong> Ventes additionnelles le midi et le soir sans charges de salle supplémentaires.</li>
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Livraison Billo Express incluse :</strong> Aucune moto à acheter ni coursiers salariés à rémunérer.</li>
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Publicité et Marketing offerts :</strong> Campagnes sur les réseaux sociaux et notifications push.</li>
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Dashboard Cuisine en Direct :</strong> Alertes sonores, gestion des stocks et suivi des ventes.</li>
                <li className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">✅ <strong>Paiements Sécurisés :</strong> Règlements par Mobile Money (Airtel, Moov, Flooz) et espèces.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">ARTICLE 3 : ENGAGEMENTS DU RESTAURANT</h3>
              <p className="text-slate-300">
                Le Restaurant s'engage à préparer les commandes dans un délai moyen de <strong>15 à 25 minutes</strong>, à respecter scrupuleusement les normes d'hygiène et de conservation alimentaire, à pratiquer une stricte parité des prix (mêmes tarifs que sur place) et à emballer les plats dans des barquettes étanches adaptées à la livraison moto.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  ARTICLE 4 : CHOIX DE LA FORMULE TARIFAIRE (3 NIVEAUX)
                </h3>
                <span className="text-[11px] text-amber-400 font-medium">
                  👉 Cliquez sur la formule de votre choix
                </span>
              </div>

              {/* Grille des 3 Formules Interactives */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id as any)}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected ? p.activeColor : `${p.color} hover:border-slate-600`
                      }`}
                    >
                      {p.popular && (
                        <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                          ⭐ Le plus choisi (65%)
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeClass}`}>
                            {p.badge}
                          </span>
                          <input
                            type="radio"
                            name="selected_plan"
                            checked={isSelected}
                            onChange={() => setSelectedPlan(p.id as any)}
                            className="text-orange-500 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-white">{p.name}</h4>
                          <p className="text-[10px] text-slate-400">{p.tag}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-lg font-black font-mono text-white">
                            {p.price.toLocaleString('fr-FR')}{' '}
                            <span className="text-xs font-normal text-slate-400">FCFA/mois</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                            Commission : {p.commission}% {p.commission === 0 && '🎉 ZÉRO COMM.'}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-snug pt-1">
                          {p.description}
                        </p>

                        <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                          {p.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 shrink-0 font-bold">•</span>
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3 pt-2">
                        <div
                          className={`w-full py-1.5 rounded-xl text-center text-xs font-bold transition ${
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

              {/* Remarque Frais de Livraison */}
              <div className="mt-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-300 flex items-center justify-between">
                <div>
                  <strong>🛵 Frais de Livraison Billo Express :</strong> 1 000 FCFA (Plateau/Centre) à 2 000 FCFA (Périphérie).
                  <span className="text-slate-400 block sm:inline sm:ml-1">
                    Intégralement payés par le client final à chaque commande.
                  </span>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-xs whitespace-nowrap ml-2">
                  0 FCFA pour le restaurant
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">ARTICLE 5 : DURÉE &amp; NON-PAIEMENT</h3>
              <p className="text-slate-300">
                Le contrat est conclu pour une durée initiale de 6 mois, renouvelable tacitement chaque mois. En cas de non-paiement de l'abonnement mensuel à l'échéance : suspension automatique de la visibilité sur l'application jusqu'au règlement régularisé.
              </p>
            </div>
          </div>

          {/* Formulaire de sélection du restaurant et signature */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>✍️ Identification du Signataire &amp; Validation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Établissement / Restaurant Partenaire *</label>
                {restaurantsList.length > 0 ? (
                  <select
                    value={selectedRestoId}
                    onChange={(e) => handleSelectRestaurant(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Sélectionnez votre restaurant --</option>
                    {restaurantsList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.slug})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={restaurant?.name || ''}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Nom complet du Gérant ou Propriétaire *</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Ex: Ibrahim Moussa (Directeur)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Numéro Téléphone / WhatsApp Niamey *</label>
                <input
                  type="tel"
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                  placeholder="+227 90 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Checkboxes d'acceptation */}
            <div className="space-y-3 pt-2 text-xs text-slate-300 border-t border-slate-800">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-950 border-slate-700"
                />
                <span>
                  <strong>J'ai lu et j'accepte les conditions du contrat de partenariat Allôresto Niger.</strong> Je m'engage à maintenir la qualité des repas et le délai de préparation annoncé (15-25 min).
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedLaunchTerms}
                  onChange={(e) => setAcceptedLaunchTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-950 border-slate-700"
                />
                <span>
                  <strong>Je valide mon choix pour la Formule {currentPlan.name} :</strong> Abonnement mensuel de <strong>{currentPlan.price.toLocaleString('fr-FR')} FCFA</strong> avec <strong>{currentPlan.commission}% de commission</strong> sur mes commandes Allôresto.
                </span>
              </label>
            </div>

            {/* Bouton d'action */}
            <button
              onClick={handleAccept}
              disabled={loading || !accepted || !acceptedLaunchTerms}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading
                ? 'Activation et signature en cours...'
                : `✅ Signer et Activer mon Restaurant (${currentPlan.name} - ${currentPlan.price.toLocaleString('fr-FR')} FCFA)`}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              En cliquant sur "Accepter", vous certifiez avoir le pouvoir d'engager cet établissement. Votre compte sera activé instantanément pour recevoir des commandes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
