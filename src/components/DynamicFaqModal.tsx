import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bike,
  CreditCard,
  UtensilsCrossed,
  Users,
  Gift,
  Phone,
  ExternalLink,
  MessageCircle,
  Store,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface FaqItem {
  id: string;
  category: "delivery" | "payment" | "menu" | "group" | "catering" | "general";
  question: string;
  answer: string;
  actionLabel?: string;
  actionType?: "catalog" | "contact" | "catering" | "group" | "whatsapp";
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "delivery",
    question: "Quels sont les délais et tarifs de livraison à Niamey ?",
    answer:
      "Grâce à notre partenaire logistique exclusif Billo Express, les livraisons s'effectuent de façon réaliste et sécurisée entre 45 et 60 minutes, incluant le temps de cuisson soignée en cuisine, les embouteillages aux heures de pointe et l'état des voies de la capitale. Les tarifs sont de 1 000 FCFA pour le centre-ville (Plateau, Yantala, Koira Kano, Issa Béri, Gamkalley, etc.) et 1 500 FCFA pour la périphérie (Harobanda Rive Droite, Francophonie, Aéroport, Cité Députés). Le retrait sur place à la Grande Mosquée Kadhafi est 100% gratuit.",
    actionLabel: "Voir la Carte des Quartiers",
    actionType: "catalog",
  },
  {
    id: "faq-2",
    category: "payment",
    question: "Quels moyens de paiement sont acceptés sur Allôresto ?",
    answer:
      "Nous acceptons tous les moyens de paiement les plus populaires du Niger : Mynita (+227 90 40 51 18), Amanata (+227 90 40 51 18), Al-Izza, Flooz Moov Money, Zeyna, ainsi que le paiement en espèces (Cash) directement auprès du livreur Billo Express à la réception de votre repas.",
  },
  {
    id: "faq-3",
    category: "menu",
    question: "Quelle est la différence entre un Plat du Jour et un Menu du Jour ?",
    answer:
      "Le Plat du Jour est un plat chaud cuisiné le matin même selon les arrivages du marché. Le Menu du Jour (ou Formule Déjeuner) est une offre complète et avantageuse comprenant le plat principal + un accompagnement (riz ou alloco) + une boisson locale fraîche (Bissap ou Gingembre) à prix préférentiel pour le midi.",
    actionLabel: "Découvrir les Menus du Jour",
    actionType: "catalog",
  },
  {
    id: "faq-4",
    category: "group",
    question: "Comment fonctionne la commande groupée pour les bureaux et ministères ?",
    answer:
      "Un initiateur crée une session de commande de groupe et partage le code ou le lien WhatsApp avec ses collègues. Chacun ajoute son plat préféré depuis son propre téléphone. Toutes les barquettes sont étiquetées au nom de chaque personne et livrées ensemble en 1 seule course Billo Express à l'accueil de votre ministère ou entreprise.",
    actionLabel: "Créer une Commande de Groupe",
    actionType: "group",
  },
  {
    id: "faq-5",
    category: "menu",
    question: "Tous les plats sont-ils certifiés Halal ?",
    answer:
      "Oui, 100% des viandes (mouton, bœuf, pintade fermière, poulet du pays) et poissons utilisés par nos restaurants partenaires comme Khady's Food sont certifiés Halal et rigoureusement sélectionnés auprès des éleveurs et pêcheurs locaux du Niger.",
  },
  {
    id: "faq-6",
    category: "catering",
    question: "Proposez-vous un service traiteur pour événements et mariages ?",
    answer:
      "Absolument ! Allôresto Événements assure la restauration de vos baptêmes, mariages, séminaires ministériels et pauses-café de 20 à 500+ convives. Nous livrons des buffets chauds, des méchouis complets et des boxs individuelles premium sur mesure.",
    actionLabel: "Demander un Devis Traiteur",
    actionType: "catering",
  },
  {
    id: "faq-7",
    category: "general",
    question: "Quels sont les horaires d'ouverture et de service ?",
    answer:
      "Allôresto est ouvert 7 jours sur 7, de 08h00 à 22h00 sans interruption. Les petits déjeuners sont servis dès 08h00, les formules midi de 11h30 à 15h30, et les dîners / grillades nocturnes jusqu'à 22h00.",
  },
  {
    id: "faq-8",
    category: "delivery",
    question: "Comment puis-je contacter le service client en cas de question ?",
    answer:
      "Notre équipe est joignable directement par appel téléphonique au +227 96 05 23 10 et par WhatsApp 7j/7 au +227 70 03 25 52. Nous répondons en moins de 3 minutes !",
    actionLabel: "Écrire sur WhatsApp",
    actionType: "whatsapp",
  },
];

interface DynamicFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCatalog?: () => void;
  onOpenGroupOrder?: () => void;
  onOpenCatering?: () => void;
  onOpenContact?: () => void;
}

export const DynamicFaqModal: React.FC<DynamicFaqModalProps> = ({
  isOpen,
  onClose,
  onOpenCatalog,
  onOpenGroupOrder,
  onOpenCatering,
  onOpenContact,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  if (!isOpen) return null;

  const categories = [
    { key: "all", label: "Toutes les Questions" },
    { key: "delivery", label: "🛵 Livraison & Billo Express" },
    { key: "payment", label: "💳 Paiements & Mynita" },
    { key: "menu", label: "🍽️ Carte & Menus du Jour" },
    { key: "group", label: "💼 Commandes Bureaux" },
    { key: "catering", label: "🎉 Traiteur & Boxs" },
    { key: "general", label: "ℹ️ Horaires & Contact" },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAction = (actionType?: string) => {
    onClose();
    if (actionType === "catalog" && onOpenCatalog) onOpenCatalog();
    else if (actionType === "group" && onOpenGroupOrder) onOpenGroupOrder();
    else if (actionType === "catering" && onOpenCatering) onOpenCatering();
    else if (actionType === "contact" && onOpenContact) onOpenContact();
    else if (actionType === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?phone=22770032552&text=Bonjour%20Allôresto,%20j'ai%20une%20question%20!`, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>Centre d&apos;Aide &amp; FAQ Dynamique</span>
              </span>
              <span className="text-xs text-slate-400">Niamey, Niger</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Foire Aux Questions Allôresto
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trouvez immédiatement les réponses à vos questions sur les livraisons, paiements et menus.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 shrink-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une question (ex: Billo Express, Mynita, Horaires, Halal, Traiteur...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordions List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">Aucun résultat trouvé pour votre recherche</h3>
              <p className="text-xs text-slate-400">
                Contactez directement notre assistance sur WhatsApp au +227 70 03 25 52 pour une réponse en direct.
              </p>
              <button
                onClick={() => handleAction("whatsapp")}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Poser ma question sur WhatsApp</span>
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-900/60 transition cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {item.question}
                    </span>
                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-orange-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-900 leading-relaxed space-y-3"
                      >
                        <p>{item.answer}</p>

                        {item.actionLabel && (
                          <div className="pt-2">
                            <button
                              onClick={() => handleAction(item.actionType)}
                              className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <span>{item.actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Contact bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 shrink-0 text-xs">
          <span className="text-slate-400">
            Une question non répertoriée ? Notre équipe vous répond 7j/7.
          </span>
          <div className="flex items-center gap-3">
            <a
              href="tel:+22796052310"
              className="font-bold text-white hover:text-orange-400 flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+227 96 05 23 10</span>
            </a>
            <button
              onClick={() => handleAction("whatsapp")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp +227 70 03 25 52</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
