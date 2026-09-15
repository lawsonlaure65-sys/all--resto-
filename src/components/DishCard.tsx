import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Plus, Flame, Clock } from "lucide-react";
import confetti from "canvas-confetti";

export interface DishCardProps {
  key?: React.Key;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  badge?: string;
  onAddToCart?: () => void;
  optionsHint?: string;
}

export const DishCard: React.FC<DishCardProps> = ({
  name,
  description,
  price,
  imageSrc,
  badge,
  onAddToCart,
  optionsHint,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleClickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger confetti burst on click!
    try {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 28,
        spread: 55,
        origin: { x, y },
        colors: ["#f97316", "#fbbf24", "#10b981", "#ef4444"],
        disableForReducedMotion: false,
      });
    } catch {
      // Fallback safe
    }

    if (onAddToCart) {
      onAddToCart();
    }

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.985 }}
      className="dish-card-item overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 group flex flex-col transition-all duration-300"
    >
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={name}
          className="dish-photo h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[11px] font-black text-slate-950 shadow-lg flex items-center gap-1.5 animate-soft-float">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            <span>{badge}</span>
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
            {name}
          </h3>

          <p className="mt-2 min-h-10 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {optionsHint && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-lg">
              <span>⚡ {optionsHint}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Prix unitaire
            </span>
            <span className="text-base sm:text-lg font-black text-orange-400">
              {price.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClickAdd}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
              justAdded
                ? "bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400"
                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/25"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3] animate-bounce" />
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Ajouter</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default DishCard;
