import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, FileImage } from "lucide-react";
import { resolveDishImageUrl, KHADYS_OFFICIAL_SUYA_IMAGE } from "../utils/dishImageResolver";

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
  const [imageError, setImageError] = useState(false);

  const resolvedImage =
    resolveDishImageUrl(imageSrc) ||
    (name.toLowerCase().includes("brochette") ? KHADYS_OFFICIAL_SUYA_IMAGE : "");

  const handleClickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="dish-card-item overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 shadow-sm group flex flex-col justify-between transition-colors"
    >
      <div>
        <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-950 flex items-center justify-center">
          {resolvedImage && !imageError ? (
            <>
              <img
                src={resolvedImage}
                alt={name}
                className="dish-photo h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {/* Gradient shadow for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-400 space-y-1 text-center">
              <FileImage className="w-10 h-10 text-amber-500/50" />
              <span className="text-xs font-bold text-amber-300">Image du plat indisponible</span>
            </div>
          )}

          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-black text-slate-950 shadow-md flex items-center gap-1.5">
              <span>{badge}</span>
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
            {name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {optionsHint && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-lg">
              <span>⚡ {optionsHint}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5 pt-0 mt-2">
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
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
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.12 }}
            onClick={handleClickAdd}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-black transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-orange-500 hover:bg-orange-400 text-slate-950"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
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
