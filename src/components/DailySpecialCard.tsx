import React from "react";
import { Sparkles, Clock, Flame, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Share2, Calendar, MessageCircle, Edit3, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { DailySpecial } from "../types";
import { useTranslation } from "../context/TranslationContext";
import { shareDailySpecialOnWhatsApp } from "../utils/whatsappNotifications";

interface DailySpecialCardProps {
  special: DailySpecial;
  onOrderSpecial?: (special: DailySpecial) => void;
  onAddToCart?: (special: DailySpecial) => void;
  onShareSpecial?: (special: DailySpecial) => void;
  onEditSpecial?: (special: DailySpecial) => void;
  isAdmin?: boolean;
}

export const DailySpecialCard: React.FC<DailySpecialCardProps> = ({
  special: rawSpecial,
  onOrderSpecial,
  onAddToCart,
  onShareSpecial,
  onEditSpecial,
  isAdmin = false,
}) => {
  const { translateDailySpecial, currentLanguage } = useTranslation();
  const special = translateDailySpecial(rawSpecial);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(rawSpecial);
    else if (onOrderSpecial) onOrderSpecial(rawSpecial);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-3xl bg-slate-900 border border-orange-500/30 p-5 sm:p-7 shadow-lg transition-colors hover:border-orange-500/60"
    >
      {/* Golden Pre-Order Rule Ribbon */}
      <div className="mb-4 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Clock className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            ⏰ <strong>Règle d'or :</strong> Précommandez la veille au soir <strong>avant 21h00</strong> pour garantir votre portion de demain midi !
          </span>
        </div>
        {(onEditSpecial || onShareSpecial) && (
          <div className="flex items-center gap-2 flex-wrap">
            {onEditSpecial && (
              <button
                type="button"
                onClick={() => onEditSpecial(rawSpecial)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-black text-[11px] flex items-center gap-1.5 transition shadow cursor-pointer active:scale-95"
                title="Modifier le plat du jour & choisir une photo (Google Photos / Galerie)"
              >
                <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                <span>Modifier Plat / Photo</span>
              </button>
            )}
            {onShareSpecial && (
              <button
                type="button"
                onClick={() => onShareSpecial(rawSpecial)}
                className="px-3 py-1 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-[11px] flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Affiche &amp; Réseaux IA</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Image & Badge */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-orange-500/30 shadow-md">
            <img
              src={special.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"}
              alt={special.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Live Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-slate-950 text-xs font-black shadow-md">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentLanguage === "ha" ? "ABINCIN YAU" : currentLanguage === "zm" ? "HUNKUNA ŊWAARI" : currentLanguage === "en" ? "TODAY'S SPECIAL" : "PLAT DU JOUR"}</span>
            </div>

            {/* Quick Photo & Edit button on image */}
            {onEditSpecial && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditSpecial(rawSpecial);
                }}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-slate-950/85 hover:bg-orange-500 text-amber-300 hover:text-slate-950 backdrop-blur-md border border-amber-500/40 hover:border-orange-400 shadow-lg transition cursor-pointer flex items-center gap-1.5 text-[11px] font-black group/btn active:scale-95"
                title="Sélectionner une photo depuis Google Photos / Galerie"
              >
                <Camera className="w-3.5 h-3.5 text-orange-400 group-hover/btn:text-slate-950" />
                <span>Photo / Éditer</span>
              </button>
            )}

            {/* Servings left */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentLanguage === "ha" ? `Har zuwa ${special.availableUntil}` : currentLanguage === "zm" ? `Hala ${special.availableUntil}` : `Dispo jusqu'à ${special.availableUntil}`}</span>
              </span>
              <span className="font-semibold text-emerald-400">
                {special.servingsLeft} {currentLanguage === "ha" ? "sun rage" : currentLanguage === "zm" ? "cindi" : "portions restantes"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info & Action */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/40 flex items-center gap-1">
                <span>👑</span>
                <span>{special.restaurantName || "Khady's Food & Event"}</span>
              </span>
              {special.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800/90 text-amber-300 text-[11px] font-bold border border-amber-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {special.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {special.description}
            </p>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{currentLanguage === "ha" ? "Tare da :" : currentLanguage === "zm" ? "Kande nda :" : "Inclus :"}</strong> {special.accompaniedBy}
              </span>
            </div>

            {/* Trio Gourmand Khady's Food Badge si applicable */}
            {(special.restaurantName?.toLowerCase().includes("khady") || special.restaurantId === "resto-khadys-food") && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300/90 flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span>🍲</span>
                  <span><strong>Trio Gourmand Khady&apos;s :</strong> Plat du Jour + Le Fameux Doukounou + L&apos;Incontournable Attiéké</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  khadysfood.vercel.app
                </span>
              </div>
            )}
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-orange-400">
                  {special.price.toLocaleString()} FCFA
                </span>
                <span className="text-sm font-semibold text-slate-500 line-through">
                  {special.originalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>Livraison Billo Express ou Retrait Grande Mosquée</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => shareDailySpecialOnWhatsApp(rawSpecial)}
                className="px-4 py-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Partager directement le plat du jour sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              {onShareSpecial && (
                <button
                  type="button"
                  onClick={() => onShareSpecial(rawSpecial)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="Générer l'affiche visuelle pour WhatsApp & Réseaux"
                >
                  <Share2 className="w-4 h-4 text-orange-400" />
                  <span>Affiche IA</span>
                </button>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.12 }}
                onClick={handleOrder}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 fill-slate-950" />
                <span>{currentLanguage === "ha" ? "Yi Odar Abincin Yau" : currentLanguage === "zm" ? "Hunkuna Ŋwaari Za" : currentLanguage === "en" ? "Order Today's Special" : "Ajouter au panier"}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
