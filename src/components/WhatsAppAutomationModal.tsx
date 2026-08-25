import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Bike,
  ShoppingBag,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface WhatsAppAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAutomationModal: React.FC<WhatsAppAutomationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    "order_client" | "billo_dispatch" | "cart_recovery" | "group_invite" | "status_update"
  >("order_client");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenWhatsApp = (text: string, phone: string = ALLORESTO_BRAND_INFO.whatsappOrders) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, "_blank");
  };

  const templates = {
    order_client: {
      title: "🧾 Confirmation de Commande Client",
      target: "Envoyé au client après validation",
      phone: "+227 70 03 25 52",
      text: `✅ *COMMANDE CONFIRMÉE — ALLÔRESTO NIAMEY* 🍽️\n\nBonjour M./Mme,\nVotre commande *#CMD-2026-8801* a bien été reçue et transmise en cuisine chez *Khady's Food* !\n\n📦 *Articles :*\n- 1x Choukouya de Mouton Royal au Kan-Kan (4 500 F)\n- 2x Jus de Bissap frais Menthe 50cl (2 000 F)\n\n📍 *Adresse de livraison :* Ministère des Finances, Plateau, 3ème étage\n💵 *Total :* 7 500 FCFA (Frais Billo Express 1 000 F inclus)\n💳 *Paiement :* Mynita / Cash à la livraison\n🏍️ *Livreur :* Moussa (Billo Express Niamey) • +227 92 08 08 22\n\n👉 *Suivez votre livreur en temps réel sur notre app :* https://alloresto.ne`,
    },
    billo_dispatch: {
      title: "🏍️ Fiche de Dispatch Livreur Billo Express",
      target: "Envoyé directement au coursier Billo Express assigné",
      phone: "+227 92 08 08 22",
      text: `🚀 *NOUVELLE COURSE ALLÔRESTO & BILLO EXPRESS* 🏍️\n\n📋 *ID Commande :* #CMD-2026-8801\n🏪 *Restaurant Retrait :* Khady's Food (Avenue de l'Islam, près Grande Mosquée)\n\n👤 *Client :* Amadou Seyni\n📞 *Téléphone Client :* +227 90 12 34 56\n📍 *Lieu de Livraison :* Plateau, Rue des Ministères, Immeuble Principal (Bureau 304)\n\n💵 *Montant à encaisser :* 7 500 FCFA (si paiement cash)\n⏱️ *Délai garanti :* 20 minutes chrono`,
    },
    cart_recovery: {
      title: "🛒 Relance Panier Abandonné (+ Code Promo)",
      target: "Pour réengager un visiteur n'ayant pas finalisé",
      phone: "+227 70 03 25 52",
      text: `👋 *Bonjour ! Vous avez faim à Niamey ?*\n\nNous avons remarqué que vous avez laissé des délices dans votre panier Allôresto (Choukouya de Mouton & Capitaine Braisé) !\n\n🎁 Pour vous régaler ce midi, voici un code promo exclusif de *-500 FCFA* : \`SAVOUR500\`\n\n👉 *Finalisez votre commande en 1 clic :* https://alloresto.ne\n🏍️ *Livraison express Billo Express chez vous ou au bureau !*`,
    },
    group_invite: {
      title: "👥 Invitation Commande Groupée (Plateau / Ministères)",
      target: "À partager dans le groupe WhatsApp du bureau",
      phone: "",
      text: `🍽️ *COMMANDE GROUPÉE DÉJEUNER DU BUREAU !*\n\nRejoignez la commande collective Allôresto initiée par *Amadou Seyni* chez *Khady's Food* pour le déjeuner d'aujourd'hui.\n\n🔑 *Code Session :* \`PLATEAU-MINISTERE-404\`\n⏱️ *Heure limite d'ajout :* 11h45\n🛵 *Livraison groupée à 12h30* au bureau !\n\n👉 *Ajoutez vos plats ici en 1 clic :* https://alloresto.ne`,
    },
    status_update: {
      title: "🛵 Alerte Livreur en Route",
      target: "Notification quand le livreur quitte le restaurant",
      phone: "+227 70 03 25 52",
      text: `🏍️ *VOTRE LIVREUR EST EN ROUTE !*\n\nVotre repas chaud vient de quitter les cuisines ! Le livreur *Moussa (Billo Express)* arrive à votre adresse dans environ *10 à 15 minutes*.\n\n📞 Numéro direct du livreur : *+227 92 08 08 22*\n👉 Préparez votre règlement ou confirmez votre paiement Mynita. Bon appétit avec Allôresto !`,
    },
  };

  const currentTpl = templates[selectedTemplate];

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
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3 h-3 fill-current" />
                <span>Automatisation WhatsApp Niamey</span>
              </span>
              <span className="text-xs text-slate-400">Canal Direct +227 70 03 25 52</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Centre d&apos;Automatisation &amp; Dispatch WhatsApp
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Envoyez instantanément les confirmations de commande, fiches livreur Billo Express et relances de paniers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selectors */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {(
            [
              { key: "order_client", label: "Confirmation Client", icon: ShoppingBag },
              { key: "billo_dispatch", label: "Dispatch Livreur Billo", icon: Bike },
              { key: "cart_recovery", label: "Relance Panier", icon: Sparkles },
              { key: "group_invite", label: "Partage Groupe Bureau", icon: Users },
              { key: "status_update", label: "Livreur en Route", icon: CheckCircle2 },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = selectedTemplate === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSelectedTemplate(item.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Template Details */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
              <div>
                <h3 className="text-base font-black text-white">{currentTpl.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentTpl.target}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs font-bold">
                  WhatsApp Niger (+227)
                </span>
              </div>
            </div>

            {/* Message Preview in WhatsApp Style Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {currentTpl.text}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopy(currentTpl.text, selectedTemplate)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === selectedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Texte Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le Modèle</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenWhatsApp(currentTpl.text, currentTpl.phone)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25 ml-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Ouvrir &amp; Envoyer sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Direct WhatsApp Support Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Ligne Directe Commandes WhatsApp Allôresto</h4>
                <p className="text-slate-400 text-[11px]">
                  Assistance commandes, devis traiteur &amp; suivi : <strong>+227 70 03 25 52</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                window.open("https://api.whatsapp.com/send?phone=22770032552&text=Bonjour%20Allôresto,%20je%20souhaite%20commander%20!", "_blank")
              }
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Discuter en Direct</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
