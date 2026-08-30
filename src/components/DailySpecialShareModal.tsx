import React, { useState, useRef } from "react";
import {
  X,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  Calendar,
  Clock,
  Flame,
  Sun,
  Moon,
  ExternalLink,
  Phone,
  MapPin,
  CheckCircle2,
  Send,
  Camera,
  Layers
} from "lucide-react";
import { DailySpecial } from "../types";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface DailySpecialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  special: DailySpecial | null;
}

export const DailySpecialShareModal: React.FC<DailySpecialShareModalProps> = ({
  isOpen,
  onClose,
  special,
}) => {
  const [activeSlot, setActiveSlot] = useState<"evening_20h" | "morning_08h">("evening_20h");
  const [copiedText, setCopiedText] = useState(false);
  const [flyerStyle, setFlyerStyle] = useState<"standard" | "gold" | "night">("standard");
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !special) return null;

  // AI Message for Evening at 20h (Pre-order before 21h)
  const eveningMessage = `🌙 *MENU DU JOUR DE DEMAIN — PRÉCOMMANDES OUVERTES JUSQU'À 21H !* 🔥🍲

Demain midi à Niamey, le Chef d'Allôresto vous prépare une merveille sahélienne :
✨ *${special.title}*
💰 *Tarif spécial :* ${special.price.toLocaleString()} FCFA *(au lieu de ${special.originalPrice.toLocaleString()} FCFA)*
🥗 *Inclus :* ${special.accompaniedBy}
📌 *Description :* ${special.description}

⚠️ *RÈGLE D'OR DU CHEF :*
Précommandez *ce soir avant 21h00 au plus tard* pour garantir votre portion fraîche et chaude livrée à votre bureau ou domicile dès midi !

🛵 *Livraison express Billo Express* dans tous les quartiers de Niamey
🛵 *Point de retrait gratuit :* Grande Mosquée Kadhafi
📲 *Commandez en ligne :* https://alloresto-niamey.vercel.app
📞 *WhatsApp Direct :* ${ALLORESTO_BRAND_INFO.whatsappOrders}

Suivez nos actualités culinaires :
🔵 Facebook : ${ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}
📸 Instagram : ${ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}
🎵 TikTok : ${ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}

#Allôresto #Niamey #PlatDuJour #Precommande21h #SahelFood #LivraisonNiamey`;

  // AI Message for Morning at 08h (Morning reminder & limited portions)
  const morningMessage = `☀️ *BONJOUR NIAMEY — LE PLAT DU JOUR EST AUX FOURNEAUX !* 🍲🔥

C'est parti pour votre déjeuner de ce midi ! 
✨ *${special.title}*
💰 *Prix Découverte :* ${special.price.toLocaleString()} FCFA
🥗 *Accompagnement offert :* ${special.accompaniedBy}

⚡ *Portions limitées :* Plus que ${special.servingsLeft} barquettes disponibles pour le service de ce midi !
🛵 *Livraison assurée par Billo Express* entre 11h30 et 14h00 (Plateau, Yantala, Koira Kano, Rive Droite).

👉 *Réservez votre barquette avant rupture :* https://alloresto-niamey.vercel.app
📞 *Ligne Express WhatsApp :* ${ALLORESTO_BRAND_INFO.whatsappOrders}

Rejoignez notre communauté gourmande :
🔵 Facebook : ${ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}
📸 Instagram : ${ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}
🎵 TikTok : ${ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}

#Allôresto #NiameyGourmand #PlatDuJour08h #BilloExpress #CuisineDuNiger`;

  const activeMessage = activeSlot === "evening_20h" ? eveningMessage : morningMessage;

  const handleCopyText = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const textEncoded = encodeURIComponent(activeMessage);
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, "_blank");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent("https://alloresto-niamey.vercel.app");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(activeMessage)}`, "_blank");
  };

  const handleDownloadFlyer = () => {
    // Generate text/canvas image or prompt notification
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1350);
    gradient.addColorStop(0, "#0F172A");
    gradient.addColorStop(0.5, "#1E1B4B");
    gradient.addColorStop(1, "#0A0A0A");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1350);

    // Decorative Borders
    ctx.strokeStyle = "#F97316";
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1020, 1290);

    // Header Branding
    ctx.fillStyle = "#F97316";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⭐ ALLÔRESTO NIAMEY ⭐", 540, 110);

    ctx.fillStyle = "#FBBF24";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("LE GOÛT AUTHENTIQUE DU SAHEL • LIVRAISON EXPRESS", 540, 155);

    // Badge Slot (20h ou 08h)
    ctx.fillStyle = activeSlot === "evening_20h" ? "#EA580C" : "#059669";
    ctx.beginPath();
    ctx.roundRect(140, 185, 800, 60, 30);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px sans-serif";
    const slotText = activeSlot === "evening_20h" 
      ? "🌙 PUBLICATION VEILLE 20H — PRÉCOMMANDES AVANT 21H" 
      : "☀️ PUBLICATION DU MATIN 08H — DERNIÈRES PORTIONS DU JOUR";
    ctx.fillText(slotText, 540, 225);

    // Dish Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 46px sans-serif";
    ctx.fillText(special.title.substring(0, 38), 540, 340);

    // Pricing Box
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.roundRect(240, 380, 600, 100, 24);
    ctx.fill();
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#F97316";
    ctx.font = "bold 52px sans-serif";
    ctx.fillText(`${special.price.toLocaleString()} FCFA`, 450, 448);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`au lieu de ${special.originalPrice.toLocaleString()} FCFA`, 650, 448);

    // Details & Inclusions
    ctx.fillStyle = "#E2E8F0";
    ctx.font = "normal 30px sans-serif";
    ctx.fillText(`✨ Inclus : ${special.accompaniedBy}`, 540, 530);

    // Key Rule Alert
    ctx.fillStyle = "#FEF3C7";
    ctx.beginPath();
    ctx.roundRect(100, 580, 880, 160, 20);
    ctx.fill();

    ctx.fillStyle = "#9A3412";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("⏰ RÈGLE DE PRÉCOMMANDE :", 540, 635);
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("Commandez la veille au soir avant 21h00 au plus tard", 540, 680);
    ctx.fillText("pour garantir votre barquette chaude dès 12h00 !", 540, 715);

    // Social Media Footnotes
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(`Facebook: ${ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}  •  Instagram: ${ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}`, 540, 1160);
    ctx.fillText(`TikTok: ${ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}  •  WhatsApp: ${ALLORESTO_BRAND_INFO.whatsappOrders}`, 540, 1205);

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("🌐 https://alloresto-niamey.vercel.app", 540, 1260);

    // Trigger download
    const link = document.createElement("a");
    link.download = `Affiche_Allôresto_PlatDuJour_${activeSlot}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-orange-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                  IA Marketing Réseaux Sociaux
                </span>
                <span className="text-[10px] bg-black/40 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  Diffusion Automatique
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                Partage Réseaux Sociaux &amp; Affiche Flyer IA
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Slot Switcher (Veille 20h vs Matin 08h) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveSlot("evening_20h")}
            className={`p-3 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
              activeSlot === "evening_20h"
                ? "bg-orange-500/20 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                <span>1. La Veille à 20h00</span>
                <span className="text-[10px] bg-orange-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                  Précommande avant 21h
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Lancement du menu de demain. Incite les clients et bureaux à précommander avant 21h.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveSlot("morning_08h")}
            className={`p-3 rounded-2xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
              activeSlot === "morning_08h"
                ? "bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                <span>2. Le Jour J à 08h00 du Matin</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                  Dernières portions
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Rappel matinal aux travailleurs et fonctionnaires pour les dernières barquettes du midi.
              </p>
            </div>
          </button>
        </div>

        {/* Content Body: Left Visual Flyer Preview + Right AI Copywriter & Direct Share */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Left Column: Visual Flyer Poster Card */}
          <div className="lg:col-span-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-orange-400" />
                <span>Affiche Visuelle Officielle (Flyer)</span>
              </span>
              <button
                type="button"
                onClick={handleDownloadFlyer}
                className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger l'image HD</span>
              </button>
            </div>

            {/* Poster Canvas Preview */}
            <div
              ref={posterRef}
              className="relative rounded-2xl overflow-hidden border-2 border-orange-500/60 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-4 text-white shadow-2xl flex-1 flex flex-col justify-between"
            >
              {/* Top Flyer Header */}
              <div className="flex items-center justify-between border-b border-orange-500/30 pb-2.5">
                <div>
                  <span className="text-xs font-black tracking-tight text-white block">
                    Allô<span className="text-orange-500">resto</span>! <span className="text-[10px] text-amber-400 font-bold">NIAMEY</span>
                  </span>
                  <span className="text-[9px] text-slate-400">Le goût authentique du Sahel</span>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    activeSlot === "evening_20h" ? "bg-orange-500 text-slate-950" : "bg-emerald-500 text-slate-950"
                  }`}>
                    {activeSlot === "evening_20h" ? "🌙 VEILLE 20H" : "☀️ MATIN 08H"}
                  </span>
                </div>
              </div>

              {/* Photo & Badge */}
              <div className="relative my-3 rounded-xl overflow-hidden aspect-[16/10] border border-orange-500/40 shadow-inner">
                <img
                  src={special.image}
                  alt={special.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-black bg-orange-500 text-slate-950 px-2 py-0.5 rounded-md shadow">
                    PLAT DU JOUR
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-amber-300 font-bold bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span>{special.price.toLocaleString()} FCFA</span>
                  <span className="text-[10px] text-slate-300 line-through">{special.originalPrice.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Dish Info */}
              <div className="space-y-1.5">
                <h4 className="font-black text-sm text-white leading-tight">
                  {special.title}
                </h4>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  ✨ Inclus : {special.accompaniedBy}
                </p>
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300 font-semibold space-y-0.5">
                  <div className="flex items-center gap-1 text-orange-400 font-bold">
                    <Clock className="w-3 h-3" />
                    <span>RÈGLE DU CHEF :</span>
                  </div>
                  <p>Précommandez la veille avant 21h00 au plus tard pour garantir votre déjeuner !</p>
                </div>
              </div>

              {/* Footer flyer handles */}
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between flex-wrap gap-1">
                <span>Facebook: <strong>{ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}</strong></span>
                <span>Instagram: <strong>{ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}</strong></span>
                <span>TikTok: <strong>{ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadFlyer}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Télécharger l'Affiche Image (PNG)</span>
            </button>
          </div>

          {/* Right Column: AI Message & 1-Click Publishing */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            
            {/* Header of AI text */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Texte Rédigé par l'IA Stratégie Marketing</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Texte copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le texte</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Prêt à coller sur vos statuts WhatsApp, pages Facebook, stories Instagram et descriptions TikTok :
              </p>
            </div>

            {/* Generated AI Text Box */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3.5 sm:p-4 text-xs font-mono text-slate-300 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
              {activeMessage}
            </div>

            {/* Direct 1-Click Social Sharing Action Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Publier &amp; Diffuser en 1 Clic :
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {/* Facebook */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyText}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-blue-600/20 text-center"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Instagram */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyText}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-pink-600/20 text-center"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* TikTok */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyText}
                  className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-600/20 text-center"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Strategy Note */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Recommandation Marketing :</strong> Postez l'affiche la veille à <strong>20h00</strong> avec le texte de précommande pour sécuriser 70% de vos ventes avant le coucher, puis republiez à <strong>08h00</strong> pour écouler le solde !
              </span>
            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Contacts officiels Allôresto intégrés : WhatsApp {ALLORESTO_BRAND_INFO.whatsappOrders}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
