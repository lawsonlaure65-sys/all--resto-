import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShoppingBag,
  Bike,
  CreditCard,
  Store,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCatalog?: () => void;
  onOpenPlans?: () => void;
  onOpenContract?: () => void;
  onOpenGroupOrder?: () => void;
  onOpenContact?: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onOpenCatalog,
  onOpenPlans,
  onOpenContract,
  onOpenGroupOrder,
  onOpenContact,
}) => {
  const [activeTab, setActiveTab] = useState<"client" | "restaurant" | "delivery" | "payment" | "group">("client");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* En-tête */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-orange-500/20">
              ?
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-wider">
                  Guide d&apos;utilisation officiel
                </span>
                <span className="text-xs text-slate-400">Niamey 🇳🇪</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Comment ça marche ?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
            title="Fermer le guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de navigation des onglets */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: "client", label: "🍲 1. Commander un Repas", icon: ShoppingBag },
            { id: "restaurant", label: "💳 2. Formules & Contrat Restaurant", icon: Store },
            { id: "delivery", label: "🛵 3. Livraison Billo Express", icon: Bike },
            { id: "payment", label: "💰 4. Modes de Paiement", icon: CreditCard },
            { id: "group", label: "👥 5. Déjeuner Bureau en Groupe", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenu dynamique selon l'onglet */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ONGLET 1 : COMMENT COMMANDER */}
          {activeTab === "client" && (
            <div className="space-y-6">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 text-xs text-orange-200">
                💡 <strong>Astuce :</strong> Vous pouvez commander directement depuis votre smartphone sans créer de compte compliqué, et régler en espèces ou Mobile Money à la réception !
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-slate-950 font-black text-sm flex items-center justify-center">1</span>
                  <h4 className="font-bold text-white text-sm">Choisissez vos plats</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Parcourez nos 65+ délices nigériens (Choukouya, Capitaine braisé, Dambou, Box Sauces) ou tapez le nom du plat.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">2</span>
                  <h4 className="font-bold text-white text-sm">Ajoutez au panier</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Personnalisez les accompagnements (Aloco, Riz parfumé, Frites) et la cuisson selon votre goût.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center">3</span>
                  <h4 className="font-bold text-white text-sm">Indiquez votre adresse</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Plateau, Yantala, Koira Kano, Recasement ou Harobanda. Frais clairs de 1 000 à 2 000 FCFA.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">4</span>
                  <h4 className="font-bold text-white text-sm">Livré bien chaud</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Suivez le coursier Billo Express en direct sur votre écran et régalez-vous !
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {onOpenCatalog && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCatalog();
                    }}
                    className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    <span>🍲 Découvrir la Carte &amp; Commander</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onOpenContact && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenContact();
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 cursor-pointer"
                  >
                    Besoin d&apos;aide ? Contacter le support (+227 96 05 23 10)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ONGLET 2 : FORMULES & CONTRAT RESTAURANT */}
          {activeTab === "restaurant" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">
                  Comment devenir Restaurant Partenaire sur Allôresto ?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Rejoignez la plateforme leader à Niamey et profitez de la flotte de livreurs Billo Express sans recruter ni acheter de motos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1 */}
                <div className="bg-slate-950 border border-orange-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-full">
                      Option 1 : Tarif Unique
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-xs">0% Commission</span>
                  </div>
                  <h4 className="text-lg font-black text-white">75 000 FCFA / mois</h4>
                  <p className="text-xs text-slate-400">
                    Idéal pour les restaurants qui veulent la simplicité absolue : vous gardez 100% du prix de vos plats pendant les 6 premiers mois.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Flotte Billo Express incluse (0 F à votre charge)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dashboard Cuisine en direct &amp; alertes sonores</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Marketing et visibilité offerts</li>
                  </ul>
                </div>

                {/* Option 2 */}
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                      Option 2 : Grille à 3 Formules
                    </span>
                    <span className="font-mono text-amber-400 font-bold text-xs">Sur-mesure</span>
                  </div>
                  <h4 className="text-lg font-black text-white">50k &bull; 75k &bull; 150k FCFA</h4>
                  <p className="text-xs text-slate-400">
                    Trois forfaits adaptés à la taille et au chiffre d&apos;affaires de votre établissement à Niamey :
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                    <li className="flex items-center gap-2"><strong>Standard :</strong> 50 000 FCFA/mois + 15% (petits budgets)</li>
                    <li className="flex items-center gap-2"><strong>Premium :</strong> 75 000 FCFA/mois + 10% (mise en avant accueil)</li>
                    <li className="flex items-center gap-2"><strong>VIP / Traiteur :</strong> 150 000 FCFA/mois + 0% comm. (gros volumes)</li>
                  </ul>
                </div>
              </div>

              {/* Boutons d'accès directs aux Formules et au Contrat */}
              <div className="p-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Prêt à activer votre restaurant ?</h4>
                  <p className="text-xs text-slate-300">Consultez la grille interactive et signez votre contrat numérique sécurisé.</p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {onOpenPlans && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPlans();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                    >
                      💳 Voir Formules &amp; Tarifs
                    </button>
                  )}
                  {onOpenContract && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenContract();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
                    >
                      📜 Lire le Contrat
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 3 : LIVRAISON BILLO EXPRESS */}
          {activeTab === "delivery" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">
                  Comment fonctionne la flotte motorisée Billo Express ?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Billo Express est le partenaire logistique exclusif d&apos;Allôresto à Niamey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>Délais Réalistes</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">45 à 60 minutes</h4>
                  <p className="text-xs text-slate-400">
                    Inclut le temps de cuisson soignée en cuisine et le trajet sécurisé à travers la circulation de Niamey.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>Tarification Zone</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">1 000 à 2 000 FCFA</h4>
                  <p className="text-xs text-slate-400">
                    1 000 F pour le Centre (Plateau, Yantala, Koira Kano) &bull; 1 500 F à 2 000 F pour la périphérie (Harobanda, Aéroport). Retrait gratuit Kadhafi.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Boîtes Isothermes</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">Chaîne du chaud</h4>
                  <p className="text-xs text-slate-400">
                    Caissons étanches garantissant un repas bien chaud, sans déversement de sauce ni poussière sahélienne.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-amber-400">🕌 Vendredi &bull; Prière du Jumu&apos;ah :</span>
                <p className="text-slate-300">
                  Par respect religieux pour la Grande Prière du vendredi, les livraisons s&apos;arrêtent à 11h00 et reprennent à 15h00. Vous pouvez planifier votre commande à l&apos;avance.
                </p>
              </div>
            </div>
          )}

          {/* ONGLET 4 : MODES DE PAIEMENT */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">
                  Quels sont les moyens de paiement acceptés à Niamey ?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Nous acceptons 6 solutions sécurisées et reconnues au Niger :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Espèces au livreur", desc: "Payez en mains propres à l'arrivée du motard Billo Express", badge: "Le plus populaire" },
                  { name: "Airtel Money Niger", desc: "Transfert sécurisé vers le numéro Allôresto : +227 96 05 23 10", badge: "Direct Mobile" },
                  { name: "Moov Money / Flooz", desc: "Paiement instantané via votre compte Moov Niger", badge: "Mobile Money" },
                  { name: "Mynita & Amanata", desc: "Dépôts et transferts agréés auprès des agences locales", badge: "Transfert Sahel" },
                  { name: "All-Iza & Zeyna", desc: "Solutions de paiement rapide pour professionnels et particuliers", badge: "Fintech Niger" },
                  { name: "Paiement Entreprise", desc: "Facturation mensuelle pour ministères, ambassades et sociétés", badge: "B2B Pro" },
                ].map((pay, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {pay.badge}
                    </span>
                    <h4 className="text-sm font-black text-white pt-1">{pay.name}</h4>
                    <p className="text-[11px] text-slate-400">{pay.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET 5 : DÉJEUNER BUREAU EN GROUPE */}
          {activeTab === "group" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">
                  Comment fonctionne la Commande Groupée pour les Bureaux &amp; Ministères ?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Finis les ordres désorganisés et les multiples frais de livraison au Plateau et dans les administrations !
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-orange-400 text-xs">Étape 1</span>
                  <h4 className="text-white font-bold text-sm">Créez le groupe</h4>
                  <p className="text-xs text-slate-400">
                    L&apos;organisateur lance la session et reçoit un lien WhatsApp à partager avec ses collègues de bureau.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 text-xs">Étape 2</span>
                  <h4 className="text-white font-bold text-sm">Chacun choisit son plat</h4>
                  <p className="text-xs text-slate-400">
                    Chaque collaborateur sélectionne son plat et sa boisson depuis son propre smartphone sans se déplacer.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 text-xs">Étape 3</span>
                  <h4 className="text-white font-bold text-sm">1 seule livraison globale</h4>
                  <p className="text-xs text-slate-400">
                    Le livreur apporte tous les repas ensemble, avec les barquettes nominatives étiquetées par personne !
                  </p>
                </div>
              </div>

              {onOpenGroupOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenGroupOrder();
                  }}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg"
                >
                  👥 Lancer une Commande Groupée Bureau
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pied de modal avec coordonnées */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Support client en direct à Niamey : <strong>+227 96 05 23 10</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPlans && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPlans();
                }}
                className="text-orange-400 hover:underline font-bold"
              >
                Formules Restaurant
              </button>
            )}
            <span>&bull;</span>
            {onOpenContract && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContract();
                }}
                className="text-slate-300 hover:underline font-bold"
              >
                Contrat Partenaire
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
