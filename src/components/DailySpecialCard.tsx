import React from "react";
import { Sparkles, Clock, Flame, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Share2, Calendar } from "lucide-react";
import { DailySpecial } from "../types";
import { useTranslation } from "../context/TranslationContext";

interface DailySpecialCardProps {
  special: DailySpecial;
  onOrderSpecial?: (special: DailySpecial) => void;
  onAddToCart?: (special: DailySpecial) => void;
  onShareSpecial?: (special: DailySpecial) => void;
}

export const DailySpecialCard: React.FC<DailySpecialCardProps> = ({
  special: rawSpecial,
  onOrderSpecial,
  onAddToCart,
  onShareSpecial,
}) => {
  const { translateDailySpecial, currentLanguage } = useTranslation();
  const special = translateDailySpecial(rawSpecial);

  const handleOrder = () => {
    if (onAddToCart) onAddToCart(rawSpecial);
    else if (onOrderSpecial) onOrderSpecial(rawSpecial);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 border-2 border-orange-500/40 p-5 sm:p-7 shadow-2xl transition-all hover:border-orange-500/70">
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Golden Pre-Order Rule Ribbon */}
      <div className="mb-4 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Clock className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            ⏰ <strong>Règle d'or :</strong> Précommandez la veille au soir <strong>avant 21h00</strong> pour garantir votre portion de demain midi !
          </span>
        </div>
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

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Image & Badge */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-orange-500/30 shadow-xl">
            <img
              src={special.image}
              alt={special.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Live Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-slate-950 text-xs font-black shadow-lg">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{currentLanguage === "ha" ? "ABINCIN YAU" : currentLanguage === "zm" ? "HUNKUNA ŊWAARI" : currentLanguage === "en" ? "TODAY'S SPECIAL" : "PLAT DU JOUR"}</span>
            </div>

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
              {onShareSpecial && (
                <button
                  type="button"
                  onClick={() => onShareSpecial(rawSpecial)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  title="Partager l'affiche sur les réseaux sociaux (Veille 20h / Matin 08h)"
                >
                  <Share2 className="w-4 h-4 text-orange-400" />
                  <span>Partager l'Affiche</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOrder}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 fill-slate-950" />
                <span>{currentLanguage === "ha" ? "Yi Odar Abincin Yau" : currentLanguage === "zm" ? "Hunkuna Ŋwaari Za" : currentLanguage === "en" ? "Order Today's Special" : "Commander / Précommander"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
