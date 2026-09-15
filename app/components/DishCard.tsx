'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-lg group flex flex-col"
    >
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition">
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
            whileTap={{ scale: 0.94 }}
            onClick={onAddToCart}
            className="rounded-xl bg-orange-500 hover:bg-orange-400 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 transition shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            Ajouter
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
