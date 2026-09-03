'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

export default function RestaurantContractPage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [restaurantsList, setRestaurantsList] = useState<any[]>([]);
  const [selectedRestoId, setSelectedRestoId] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [managerPhone, setManagerPhone] = useState<string>('+227 ');
  const [accepted, setAccepted] = useState(false);
  const [acceptedLaunchTerms, setAcceptedLaunchTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedRecord, setSignedRecord] = useState<any>(null);

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
        // 1. Enregistrer la signature du contrat
        const { error: contractErr } = await supabase.from('restaurant_contracts').upsert({
          restaurant_id: targetId,
          contract_signed: true,
          signed_at: nowIso,
          signed_by: `${signName} (Signé en ligne)`,
          signed_ip: 'Niamey - Espace Cuisine Web',
          version: '1.0-Lancement-Niamey-2026',
        });

        if (contractErr) {
          console.warn('Note contract insert:', contractErr.message);
        }

        // 2. Créer l'abonnement initial (75 000 FCFA - Mois 1 à 6)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await supabase.from('restaurant_subscriptions').insert({
          restaurant_id: targetId,
          amount_xof: 75000,
          start_date: nowIso.split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          payment_date: nowIso.split('T')[0],
          plan_type: 'launch_offer_6m',
          payment_method: 'mobile_money',
          auto_renew: true,
        });

        // 3. Activer le restaurant sur Allôresto
        await supabase.from('restaurants').update({ is_active: true }).eq('id', targetId);
      }

      setSignedRecord({
        restaurant_id: targetId,
        signed_by: signName,
        signed_at: nowIso,
        ref: `ALLORESTO-NIAMEY-${Date.now().toString().slice(-6)}`,
      });

      setSigned(true);
      alert('✅ Contrat accepté avec succès ! Votre restaurant est activé sur Allôresto Niamey avec la formule de lancement à 75 000 FCFA.');
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
              Votre établissement est officiellement référencé sur <strong>Allôresto Niamey</strong> avec la logistique <strong>Billo Express</strong>.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left font-mono text-xs space-y-1.5 text-slate-300">
            <div><span className="text-slate-500">Signataire :</span> <strong className="text-white">{signedRecord?.signed_by || managerName || 'Gérant'}</strong></div>
            <div><span className="text-slate-500">Formule :</span> <strong className="text-amber-400">Offre Lancement Sahel (75 000 FCFA/mois - 0% comm.)</strong></div>
            <div><span className="text-slate-500">Statut :</span> <strong className="text-emerald-400">Actif &amp; Prêt à recevoir des commandes</strong></div>
            <div><span className="text-slate-500">Date :</span> <span className="text-slate-300">{new Date(signedRecord?.signed_at || Date.now()).toLocaleDateString('fr-FR')}</span></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToDashboard}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              🍳 Accéder à l'Espace Cuisine
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
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <span>🖨️ Télécharger PDF</span>
            </button>
            <button
              onClick={handleGoToDashboard}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Retour Cuisine
            </button>
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
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-1">ARTICLE 4 : CONDITIONS FINANCIÈRES (OPTION RECOMMANDÉE)</h3>
              <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">📌 Offre de Lancement (Mois 1 à 6) :</span>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">0% DE COMMISSION</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">Abonnement Mensuel Fixe :</div>
                    <div className="text-white font-bold font-mono text-sm">75 000 FCFA / mois</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">(Au lieu de 100 000 FCFA)</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">Commission sur les Ventes :</div>
                    <div className="text-emerald-400 font-bold font-mono text-sm">0 % (Zéro Prélèvement)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Vous gardez 100% du prix des plats</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300">📌 Tarifs à partir du Mois 7 :</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Abonnement à <strong>100 000 FCFA / mois</strong> avec <strong>10% de commission</strong> sur les commandes.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <strong>🛵 Frais de Livraison :</strong> 1 000 FCFA (Centre/Plateau) à 2 000 FCFA (Périphérie) intégralement payés par le client. Aucun coût de coursier pour le restaurant.
                </div>
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
                  <strong>Je souscris à l'Offre de Lancement :</strong> Abonnement mensuel de <strong>75 000 FCFA</strong> avec <strong>0% de commission</strong> sur mes commandes pendant les 6 premiers mois.
                </span>
              </label>
            </div>

            {/* Bouton d'action */}
            <button
              onClick={handleAccept}
              disabled={loading || !accepted || !acceptedLaunchTerms}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Activation et signature en cours...' : '✅ Accepter, Signer et Activer mon Restaurant'}
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
