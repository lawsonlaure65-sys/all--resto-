import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Sparkles,
  ExternalLink,
  Clock,
  Store,
  QrCode,
} from "lucide-react";

export interface DishToShare {
  id: string;
  name: string;
  restaurantName?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  district?: string;
  category?: string;
  preparationTime?: number;
}

interface DishShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishToShare | null;
}

export const DishShareModal: React.FC<DishShareModalProps> = ({
  isOpen,
  onClose,
  dish,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  if (!isOpen || !dish) return null;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://alloresto.ne";
  const shareUrl = `${currentOrigin}/menu?dish=${encodeURIComponent(dish.id)}`;

  const shareText =
    `🍲 *Découverte Gourmande sur Allôresto Niamey !* 😋🍽️\n\n` +
    `🍛 *${dish.name}*\n` +
    `💰 *Prix :* ${dish.price.toLocaleString()} FCFA\n` +
    (dish.restaurantName ? `🏪 *Restaurant :* ${dish.restaurantName}${dish.district ? ` (${dish.district})` : ""}\n` : "") +
    (dish.preparationTime ? `⏱️ *Préparation :* ~${dish.preparationTime} min\n` : "") +
    (dish.description ? `📝 *Description :* ${dish.description}\n` : "") +
    `🏍️ *Livraison express* garantie par Billo Express à Niamey (1 000 FCFA)\n\n` +
    `👉 *Commande vite ton plat ici :*\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setShareFeedback("Lien du plat copié dans le presse-papiers !");
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur copie lien", err);
    }
  };

  const handleCopyFullText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      setCopied(true);
      setShareFeedback("Message complet copié ! Prêt à coller.");
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur copie texte", err);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${dish.name} — Allôresto Niamey`,
          text: `Découvre "${dish.name}" sur Allôresto Niamey ! Livraison express en 30 min.`,
          url: shareUrl,
        });
        setShareFeedback("Partagé avec succès !");
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.warn("Erreur partage natif:", e);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const tweetText = `Envie de savourer "${dish.name}" (${dish.price.toLocaleString()} FCFA) à Niamey ? Commandez sur Allôresto ! 🍲🇳🇪`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Regarde ce plat : ${dish.name} sur Allôresto Niamey !`)}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <AnimatePresence>
      <div
        id="dish-share-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="dish-share-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-orange-500/20">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Partager ce Plat
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                    Niamey 🇳🇪
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Faites découvrir vos plats préférés à vos proches et collègues
                </p>
              </div>
            </div>
            <button
              id="close-dish-share-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Dish Card Preview */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3.5 items-center">
              {dish.imageUrl ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-200">
                    {dish.category || "Plat"}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl shrink-0">
                  🍲
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="font-bold text-white text-sm line-clamp-1">
                  {dish.name}
                </h4>
                {dish.restaurantName && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <Store className="w-3 h-3 text-orange-400 shrink-0" />
                    <span className="truncate">{dish.restaurantName}</span>
                    {dish.district && (
                      <span className="text-slate-500">({dish.district})</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-black text-orange-400 text-xs sm:text-sm font-mono">
                    {dish.price.toLocaleString()} FCFA
                  </span>
                  {dish.preparationTime && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md">
                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                      <span>~{dish.preparationTime} min</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main WhatsApp Share Button */}
            <motion.button
              id="share-whatsapp-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Partager sur WhatsApp</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/30">
                1 Clic Direct
              </span>
            </motion.button>

            {/* Social Grid */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Autres réseaux sociaux &amp; plateformes :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Native Share (Device) */}
                <motion.button
                  id="share-native-btn"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNativeShare}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Ouvrir le menu de partage de votre appareil"
                >
                  <Share2 className="w-4 h-4 text-orange-400" />
                  <span>Appareil / Autre</span>
                </motion.button>

                {/* Facebook */}
                <motion.button
                  id="share-facebook-btn"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFacebookShare}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook</span>
                </motion.button>

                {/* X / Twitter */}
                <motion.button
                  id="share-twitter-btn"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTwitterShare}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Twitter className="w-4 h-4 text-sky-400" />
                  <span>X / Twitter</span>
                </motion.button>

                {/* Telegram */}
                <motion.button
                  id="share-telegram-btn"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTelegramShare}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Telegram</span>
                </motion.button>
              </div>
            </div>

            {/* Quick Link Copy Field */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">
                Lien direct vers la fiche de ce plat :
              </span>
              <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl">
                <input
                  id="share-link-input"
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent px-2.5 text-xs text-slate-300 font-mono focus:outline-none truncate"
                />
                <motion.button
                  id="copy-share-link-btn"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    copied
                      ? "bg-emerald-500 text-slate-950 font-black"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copié !" : "Copier"}</span>
                </motion.button>
              </div>
            </div>

            {/* Pre-written WhatsApp Message Preview with Copy Text Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">
                  Message pré-formaté pour WhatsApp &amp; SMS :
                </span>
                <button
                  onClick={handleCopyFullText}
                  className="text-orange-400 hover:text-orange-300 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copier le texte</span>
                </button>
              </div>
              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-[11px] text-slate-300 font-sans leading-relaxed whitespace-pre-wrap select-all">
                {shareText}
              </div>
            </div>

            {/* Share Feedback Toast */}
            {shareFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>{shareFeedback}</span>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Allôresto Niamey • Livraison 1 000 FCFA</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Billo Express 🏍️</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
