'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
}

export default function ContractAcceptancePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerTitle, setManagerTitle] = useState('Gérant(e)');
  const [phone, setPhone] = useState('+227 ');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPayment, setAcceptPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState<any>(null);

  useEffect(() => {
    async function loadRestos() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data } = await supabase.from('restaurants').select('id, name, slug, phone, email').order('name');
        if (data) setRestaurants(data);
      } catch (err) {
        console.error('Erreur chargement restaurants:', err);
      }
    }
    loadRestos();
  }, []);

  const handleSignContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurantId) {
      alert('Veuillez sélectionner votre restaurant.');
      return;
    }
    if (!acceptTerms || !acceptPayment) {
      alert('Veuillez cocher les cases attestant de la lecture et de l’acceptation des conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const selectedResto = restaurants.find((r) => r.id === selectedRestaurantId);
      const signDate = new Date().toISOString();

      if (supabase) {
        // Enregistrer la signature dans restaurant_contracts
        await supabase.from('restaurant_contracts').upsert({
          restaurant_id: selectedRestaurantId,
          contract_signed: true,
          signed_at: signDate,
          signed_by: `${managerName} (${managerTitle})`,
          signed_ip: 'En ligne (Allôresto Portal Niamey)',
          version: '1.0-Lancement-2026',
        });

        // Activer ou mettre à jour l'onboarding
        await supabase.from('restaurant_onboarding').upsert({
          restaurant_id: selectedRestaurantId,
          status: 'approved',
          contract_signed: true,
          manager_name: managerName,
          manager_phone: phone,
          reviewed_at: signDate,
        });

        // Activer le restaurant s'il était inactif
        await supabase
          .from('restaurants')
          .update({ is_active: true })
          .eq('id', selectedRestaurantId);
      }

      setSignatureInfo({
        restaurantName: selectedResto?.name || 'Restaurant Partenaire',
        managerName,
        managerTitle,
        signedAt: new Date().toLocaleString('fr-FR'),
        ref: `ALLORESTO-SIGN-${Date.now().toString().slice(-6)}`,
      });

      setIsSigned(true);
    } catch (err: any) {
      alert('Erreur lors de la signature : ' + (err?.message || 'Vérifiez la connexion'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
              <h1 className="text-xl font-black tracking-tight text-white">Allôresto Niger 🇳🇪</h1>
              <p className="text-xs text-slate-400">Portail Partenaire - Signature & Affiliation Restaurant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <span>🖨️ Imprimer / PDF</span>
            </button>
            <a
              href="/app/admin/dashboard"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold transition"
            >
              Accès Super-Admin
            </a>
          </div>
        </header>

        {isSigned ? (
          /* Confirmation Ecran de Signature Réussie */
          <div className="bg-slate-800/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-2xl backdrop-blur">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold">
                Contrat validé &amp; enregistré
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Félicitations, votre contrat est signé ! 🎉
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              L’établissement <strong>{signatureInfo?.restaurantName}</strong> est désormais affilié au réseau
              officiel <strong>Allôresto Niamey</strong>. Votre statut est actif et vos identifiants pour l'Espace
              Cuisine vous sont transmis par WhatsApp au <strong>{phone}</strong>.
            </p>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 max-w-md mx-auto text-xs text-left space-y-1.5 font-mono">
              <div className="text-slate-400">Réf. Contrat : <span className="text-amber-400">{signatureInfo?.ref}</span></div>
              <div className="text-slate-400">Signataire : <span className="text-white">{signatureInfo?.managerName} ({signatureInfo?.managerTitle})</span></div>
              <div className="text-slate-400">Date/Heure : <span className="text-white">{signatureInfo?.signedAt}</span></div>
              <div className="text-slate-400">Formule : <span className="text-emerald-400 font-bold">Lancement 6 mois (75 000 FCFA - 0% comm.)</span></div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Télécharger le Certificat de Signature (PDF)
              </button>
              <a
                href="/app/admin/restaurants"
                className="px-6 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition"
              >
                Gérer les Restaurants
              </a>
            </div>
          </div>
        ) : (
          /* Texte Integral du Contrat & Formulaire de Signature */
          <div className="space-y-6">
            {/* Bannière Offre Lancement Niamey */}
            <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/30 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-full">
                  Offre Partenaire Lancement Sahel 2026
                </span>
                <h2 className="text-lg font-bold text-white">
                  Abonnement : 75 000 FCFA/mois &amp; 0% de commission (Mois 1 à 6)
                </h2>
                <p className="text-xs text-slate-300">
                  Flotte Billo Express incluse, marketing digital offert, et tableau de bord de commandes en direct.
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-slate-400">Mois 7+ : 100 000 FCFA / 10%</div>
                <div className="text-emerald-400 font-bold">Livraison payée par le client</div>
              </div>
            </div>

            {/* Document Contractuel Lisible */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 max-h-[480px] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-inner">
              <div className="border-b border-slate-800 pb-4 text-center">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Contrat de Partenariat Commercial &amp; d'Affiliation Restaurant
                </h2>
                <p className="text-xs text-orange-400 mt-1">
                  Plateforme Numérique de Commande &amp; Livraison ALLÔRESTO NIGER (Niamey)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-2">ARTICLE 1 : OBJET DU CONTRAT</h3>
                <p>
                  Le présent contrat a pour objet de définir les conditions dans lesquelles le Restaurant Partenaire
                  est référencé sur l'application Allôresto Niamey et reçoit des commandes de repas et boissons avec
                  prise en charge de la livraison par la flotte officielle Billo Express.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-2">ARTICLE 2 : AVANTAGES POUR LE RESTAURANT</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li><strong>Augmentation des ventes :</strong> Flux de commandes additionnelles le midi et le soir sans charges fixes supplémentaires.</li>
                  <li><strong>Flotte Billo Express dédiée :</strong> Aucun livreur à embaucher, ni de motos à entretenir. Les coursiers Allôresto prennent en charge les colis.</li>
                  <li><strong>Publicité et Référencement :</strong> Visibilité auprès des milliers d'utilisateurs à Niamey (Plateau, Yantala, Harobanda, etc.).</li>
                  <li><strong>Tableau de bord Cuisine :</strong> Réception sonore des commandes, mise à jour des menus et suivi du chiffre d'affaires.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-2">ARTICLE 3 : CONDITIONS FINANCIÈRES &amp; TARIFS</h3>
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div><strong>1. Forfait de Lancement (Mois 1 à 6) :</strong> 75 000 FCFA / mois TTC.</div>
                  <div><strong>2. Commission sur Commandes :</strong> 0% de prélèvement pendant les 6 premiers mois (le restaurant conserve 100% de la valeur des plats).</div>
                  <div><strong>3. Période Post-Lancement (À partir du Mois 7) :</strong> 100 000 FCFA / mois et 10% de commission sur les commandes.</div>
                  <div><strong>4. Frais de Livraison :</strong> Réglés directement par le client final (1 000 à 2 000 FCFA selon le quartier).</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-2">ARTICLE 4 : ENGAGEMENTS DU RESTAURANT</h3>
                <p>
                  Le Restaurant s'engage à préparer les commandes dans un délai moyen de 15 à 25 minutes, à maintenir
                  ses tarifs conformes à ceux pratiqués sur place (parité tarifaire) et à utiliser des emballages
                  hermétiques et propres adaptés au transport moto au Sahel.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-xs tracking-wider mb-2">ARTICLE 5 : MODALITÉS DE RÈGLEMENT</h3>
                <p>
                  L'abonnement mensuel est exigible à chaque début de période par Mobile Money (Airtel Money, Moov Money,
                  Flooz, Amanata) ou virement bancaire. En cas de défaut de paiement non régularisé sous 7 jours, l'accès
                  à la prise de commande est temporairement suspendu.
                </p>
              </div>
            </div>

            {/* Formulaire de Signature Electronique */}
            <form onSubmit={handleSignContract} className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-7 space-y-5">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>✍️ Formulaire de Signature Électronique</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Valeur Juridique OHADA
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sélectionnez le Restaurant *</label>
                  <select
                    value={selectedRestaurantId}
                    onChange={(e) => {
                      setSelectedRestaurantId(e.target.value);
                      const sel = restaurants.find((r) => r.id === e.target.value);
                      if (sel?.phone) setPhone(sel.phone);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- Choisir un restaurant enregistré --</option>
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nom complet du Signataire / Gérant *</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    required
                    placeholder="Ex: Abdoul Razak Mahamane"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Qualité / Titre du Signataire</label>
                  <input
                    type="text"
                    value={managerTitle}
                    onChange={(e) => setManagerTitle(e.target.value)}
                    placeholder="Gérant(e), Propriétaire, Directeur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Numéro Téléphone / WhatsApp Niamey *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+227 90 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Checkboxes d'engagement */}
              <div className="space-y-3 pt-2 text-xs text-slate-300 border-t border-slate-700/60">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-900 border-slate-700"
                  />
                  <span>
                    J'ai lu et j'accepte l'intégralité des clauses du Contrat de Partenariat Allôresto Niger, notamment
                    les normes d'hygiène alimentaire et le respect du délai de préparation (15 à 25 min).
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptPayment}
                    onChange={(e) => setAcceptPayment(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-900 border-slate-700"
                  />
                  <span>
                    Je valide la formule de lancement : <strong>75 000 FCFA / mois</strong> avec <strong>0% de commission</strong> sur
                    les commandes pour les 6 premiers mois.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !acceptTerms || !acceptPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm transition shadow-xl shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Validation et signature en cours...' : '✍️ Signer et Valider le Contrat Partenaire'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
