import React from "react";
import { motion } from "framer-motion";
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
  Store,
} from "lucide-react";
import { CuisineFilter, MealMoment } from "../types";
import { CUISINES_DATA } from "../data/allorestoData";
import { LiveOrderMarquee } from "./LiveOrderMarquee";
import { AnimatedHeroVisual } from "./AnimatedHeroVisual";

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
  onOpenLogoModal?: () => void;
  onOpenRestaurants?: () => void;
  onOpenDishesCatalog?: () => void;
  onOpenDishesCatalogWithMoment?: (moment: "all" | MealMoment) => void;
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
  onOpenLogoModal,
  onOpenRestaurants,
  onOpenDishesCatalog,
  onOpenDishesCatalogWithMoment,
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
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-2 pb-12 border-b border-slate-800 overflow-hidden">
      {/* Continuous Live Order Ticker Marquee */}
      <div className="mb-4">
        <LiveOrderMarquee />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-orange-600/15 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Content: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines, search, CTA, Moments */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              whileHover={{ scale: 1.02 }}
              onClick={onOpenLogoModal}
              className={`inline-flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 shadow-sm transition max-w-full text-center ${
                onOpenLogoModal ? "cursor-pointer" : ""
              }`}
              title="Restaurant Fondateur • Allôresto Niamey"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-amber-400 shrink-0 animate-pulse" />
              <span>👑 Restaurant Fondateur • Ouvert jusqu’à 22 h • Khady&apos;s Food &amp; Event</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
            >
              Vos plats préférés,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-red-500">
                livrés à Niamey.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
              className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Commandez chez <strong>Khady&apos;s Food &amp; Event</strong>, notre restaurant fondateur, et auprès de nos restaurants partenaires à Niamey. Attiéké caviar, sauces Gboma, Doukounou et grillades livrés chez vous ou au bureau !
            </motion.p>

            {/* Interactive Search Bar */}
            <div className="pt-2 max-w-2xl mx-auto lg:mx-0">
              <div className="p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-lg flex items-center gap-2 focus-within:border-orange-500 transition-colors">
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5 text-orange-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher à Niamey (Attiéké caviar, Gboma, Doukounou, Choukouya)..."
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
            </div>

            {/* Quick Direct Actions: Voir le menu, WhatsApp, Restaurants */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2"
            >
              {onOpenDishesCatalog && (
                <motion.button
                  id="hero-menu-cta-btn"
                  onClick={onOpenDishesCatalog}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.12 }}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Voir le menu</span>
                </motion.button>
              )}

              <motion.a
                href="https://wa.me/22774441621"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.12 }}
                className="px-5 py-2.5 rounded-xl border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs sm:text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <span>💬 Commander par WhatsApp</span>
              </motion.a>

              {onOpenRestaurants && (
                <motion.button
                  id="hero-restaurants-cta-btn"
                  onClick={onOpenRestaurants}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.12 }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-orange-400" />
                  <span>Voir les restaurants</span>
                </motion.button>
              )}
            </motion.div>

            {/* Moments de la Journée Quick Pills */}
            <div className="pt-2 max-w-2xl mx-auto lg:mx-0">
              <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Moments :</span>
                </span>

                <button
                  onClick={() => {
                    if (onOpenDishesCatalogWithMoment) {
                      onOpenDishesCatalogWithMoment("petit_dejeuner");
                    } else if (onOpenDishesCatalog) {
                      onOpenDishesCatalog();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>🌅</span>
                  <span>Petit Déjeuner</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenDishesCatalogWithMoment) {
                      onOpenDishesCatalogWithMoment("dejeuner");
                    } else if (onOpenDishesCatalog) {
                      onOpenDishesCatalog();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-orange-950/50 hover:bg-orange-900/60 border border-orange-500/40 text-orange-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>☀️</span>
                  <span>Déjeuner</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenDishesCatalogWithMoment) {
                      onOpenDishesCatalogWithMoment("diner");
                    } else if (onOpenDishesCatalog) {
                      onOpenDishesCatalog();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>🌙</span>
                  <span>Dîner</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenDishesCatalogWithMoment) {
                      onOpenDishesCatalogWithMoment("menu_du_jour");
                    } else if (onOpenDishesCatalog) {
                      onOpenDishesCatalog();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>⭐</span>
                  <span>Plat du Jour</span>
                </button>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-400" />
                Livraison en <strong>25 à 45 mn</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Airtel, Moov ou <strong>Espèces</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-400" />
                <strong>-10%</strong> code <strong>NIAMEY10</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Animated Courier in Motion & Hot Food Showcase */}
          <div className="lg:col-span-5">
            <AnimatedHeroVisual onExploreMenu={onOpenDishesCatalog} />
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Catégories &amp; Spécialités
            </span>

            {/* Quick Filter Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {onOpenDishesCatalog && (
                <button
                  onClick={onOpenDishesCatalog}
                  className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>🍲 Carte des Plats</span>
                </button>
              )}

              <button
                onClick={onTogglePromo}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer ${
                  filterPromoOnly
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                🔥 Offres
              </button>
              <button
                onClick={onToggleFastDelivery}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer ${
                  filterFastDelivery
                    ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Express (&le; 50 min)
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
