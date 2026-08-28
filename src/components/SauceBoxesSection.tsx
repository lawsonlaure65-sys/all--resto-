import React from "react";
import { Package, Flame, Sparkles, Plus, Check, MapPin, ArrowRight } from "lucide-react";
import { SauceBox, MenuItem } from "../types";
import { SAUCE_BOXES_DATA } from "../data/allorestoData";
import { useTranslation } from "../context/TranslationContext";

interface SauceBoxesSectionProps {
  onAddSauceToCart: (sauce: SauceBox) => void;
  onOpenCatering: () => void;
}

export const SauceBoxesSection: React.FC<SauceBoxesSectionProps> = ({
  onAddSauceToCart,
  onOpenCatering,
}) => {
  const { translateSauceBox, currentLanguage } = useTranslation();

  return (
    <section className="py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-black uppercase tracking-wider">
              🥫 {currentLanguage === "ha" ? "Miyar Sahel" : currentLanguage === "zm" ? "Hawari Hanno" : "Terroir & Maison"}
            </span>
            <span className="text-xs text-slate-400 font-medium">Bocaux hermétiques &amp; Traiteur</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {currentLanguage === "ha" ? "Kayan Miyar Allôresto" : currentLanguage === "zm" ? "Allôresto Hawari Batan" : "Les Box Sauces Allôresto"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {currentLanguage === "ha"
              ? "Ku samu daddadan miyar gargajiya na Nijar a gidanku (miyar kuli-kuli, miyar ganye, miyar tumatir mai dadi)."
              : currentLanguage === "zm"
              ? "Niamey hawari kaana nda kuli-kuli hawari cimi dumi go doŋ war se."
              : "Retrouvez les meilleures sauces du Niger chez vous, préparées au feu doux et prêtes à sublimer vos plats (riz blanc, dambou, touwo, grillades)."}
          </p>
        </div>

        <button
          onClick={onOpenCatering}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-orange-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>Commande de Box Sauces en Gros</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sauce Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SAUCE_BOXES_DATA.map((rawSauce) => {
          const sauce = translateSauceBox(rawSauce);
          return (
            <div
              key={sauce.id}
              className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-4 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800">
                  <img
                    src={sauce.image}
                    alt={sauce.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    {sauce.volume}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-orange-950/80 backdrop-blur-md text-[10px] font-black text-orange-400 border border-orange-500/30">
                    {sauce.spiceLevel}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">
                    {sauce.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sauce.description}
                  </p>
                </div>

                {/* Best with */}
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-300">
                  <span className="font-semibold text-slate-400">Idéal avec : </span>
                  <span>{sauce.bestWith.join(", ")}</span>
                </div>
              </div>

              {/* Pricing & Add button */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-white">
                    {sauce.price.toLocaleString()} FCFA
                  </span>
                </div>

                <button
                  onClick={() => onAddSauceToCart(sauce)}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs font-black shadow-md shadow-orange-500/20 transition flex items-center gap-1 cursor-pointer transform active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{currentLanguage === "ha" ? "Zaba" : currentLanguage === "zm" ? "Za" : "Ajouter"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
