'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export type DishCardProps = {
  key?: React.Key;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  badge?: string;
  onAddToCart?: () => void;
  optionsHint?: string;
};

export default function DishCard({
  name,
  description,
  price,
  imageSrc,
  badge,
  onAddToCart,
  optionsHint,
}: DishCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleClickAdd = () => {
    if (onAddToCart) {
      onAddToCart();
    }
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.99 }}
      className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 shadow-lg hover:shadow-xl hover:shadow-orange-500/10 group flex flex-col transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
            <span>{badge}</span>
          </span>
        )}
      </div>

      <div className="p-4 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
            {name}
          </h3>

          <p className="mt-2 min-h-10 text-xs sm:text-sm text-slate-400 line-clamp-2">
            {description}
          </p>

          {optionsHint && (
            <p className="mt-2 text-[11px] font-semibold text-orange-400/90 bg-orange-950/40 border border-orange-900/40 px-2 py-1 rounded-md">
              ⚡ {optionsHint}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-base sm:text-lg font-extrabold text-orange-400">
            {price.toLocaleString('fr-FR')} FCFA
          </span>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClickAdd}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
              justAdded
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-orange-500/20'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Ajouté !</span>
              </>
            ) : (
              <span>Ajouter</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

