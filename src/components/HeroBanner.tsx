import React from "react";
import { motion } from "motion/react";
import {
  Search,
  Flame,
  Clock,
  ShieldCheck,
  Sparkles,
  Utensils,
  Pizza,
  Fish,
  Salad,
  Sandwich,
  IceCream,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { CuisineFilter } from "../types";
import { CUISINES_DATA } from "../data/allorestoData";

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCuisine: string;
  onSelectCuisine: (c: string) => void;
  filterPromoOnly: boolean;
  onTogglePromo: () => void;
  filterFastDelivery: boolean;
  onToggleFastDelivery: () => void;
  onOpenChefAI: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCuisine,
  onSelectCuisine,
  filterPromoOnly,
  onTogglePromo,
  filterFastDelivery,
  onToggleFastDelivery,
  onOpenChefAI,
}) => {
  const getCuisineIcon = (icon: string) => {
    switch (icon) {
      case "Flame":
        return <Flame className="w-4 h-4" />;
      case "Sandwich":
        return <Sandwich className="w-4 h-4" />;
      case "Pizza":
        return <Pizza className="w-4 h-4" />;
      case "Fish":
        return <Fish className="w-4 h-4" />;
      case "Salad":
        return <Salad className="w-4 h-4" />;
      case "IceCream":
        return <IceCream className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-8 pb-12 border-b border-slate-800 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-orange-600/15 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Content */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Niamey, Niger 🇳🇪 &bull; Grande Mosquée Mouhamar Khadafi</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Allôresto Niamey,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-red-500">
              vos repas livrés en un éclair.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto"
          >
            Pour les particuliers, familles de Niamey, fonctionnaires des ministères et équipes de bureaux. Choukouya royal, Capitaine braisé du Fleuve, burgers et formules midi livrés chez vous ou sur votre lieu de travail !
          </motion.p>

          {/* Interactive Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-2 max-w-2xl mx-auto"
          >
            <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl flex items-center gap-2 focus-within:border-orange-500 transition-all">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-orange-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher à Niamey (Choukouya, Capitaine braisé, Kilichi, Burger, Formule Midi Bureau)..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none py-2"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer"
                >
                  Effacer
                </button>
              )}
              <button
                onClick={onOpenChefAI}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xs font-bold shrink-0 shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Conseil IA</span>
              </button>
            </div>
          </motion.div>

          {/* Trust Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              Livraison rapide en <strong>20-25 min</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Airtel Money, Moov Money (Flooz) ou <strong>Espèces</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-400" />
              <strong>-10%</strong> avec le code <strong>NIAMEY10</strong>
            </span>
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Catégories &amp; Spécialités
            </span>

            {/* Quick Filter Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePromo}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  filterPromoOnly
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🔥 Offres &amp; Promos
              </button>
              <button
                onClick={onToggleFastDelivery}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  filterFastDelivery
                    ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Moins de 30 min
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CUISINES_DATA.map((cuisine) => {
              const isSelected = selectedCuisine === cuisine.id;
              return (
                <button
                  key={cuisine.id}
                  onClick={() => onSelectCuisine(cuisine.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500/70 shadow-lg shadow-orange-500/25 scale-102"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className={isSelected ? "text-white" : "text-orange-400"}>
                    {getCuisineIcon(cuisine.icon)}
                  </span>
                  <span>{cuisine.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
