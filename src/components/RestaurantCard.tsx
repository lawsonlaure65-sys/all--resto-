import React from "react";
import { motion } from "motion/react";
import { Star, Clock, Bike, Flame, Sparkles, MapPin, CheckCircle, ChevronRight, MessageCircle } from "lucide-react";
import { Restaurant, ServiceMode } from "../types";
import { useTranslation } from "../context/TranslationContext";
import { shareRestaurantOnWhatsApp } from "../utils/whatsappNotifications";

interface RestaurantCardProps {
  restaurant: Restaurant;
  serviceMode: ServiceMode;
  onOpenMenu: (restaurant: Restaurant) => void;
  onBookTable?: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant: rawRestaurant,
  serviceMode,
  onOpenMenu,
  onBookTable,
}) => {
  const { translateRestaurant } = useTranslation();
  const restaurant = translateRestaurant(rawRestaurant);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 transition-all overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-orange-500/10 cursor-pointer"
      onClick={() => onOpenMenu(restaurant)}
    >
      <div>
        {/* Restaurant Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {restaurant.promoBadge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>{restaurant.promoBadge}</span>
              </span>
            )}
            {restaurant.isPromoted && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Coup de cœur</span>
              </span>
            )}
          </div>

          {/* Top Right: WhatsApp Quick Share Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              shareRestaurantOnWhatsApp(restaurant);
            }}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-black shadow-lg backdrop-blur-md border border-emerald-400/40 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer z-10"
            title="Partager ce restaurant sur WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="text-[11px]">Partager</span>
          </button>

          {/* Delivery Time / Rating Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md text-slate-200 border border-slate-800 flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{restaurant.deliveryTime}</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 backdrop-blur-md text-white border border-slate-800 flex items-center gap-1 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-slate-400 text-[10px]">({restaurant.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
              {restaurant.isOpen ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Ouvert
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 shrink-0">
                  Fermé
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
              {restaurant.tagline}
            </p>
          </div>

          {/* Address & Fees */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 truncate max-w-[60%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{restaurant.address}</span>
            </span>

            <span className="font-semibold text-slate-200">
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-400 font-bold">Frais offerts</span>
              ) : (
                `Frais : ${restaurant.deliveryFee.toLocaleString()} FCFA`
              )}
            </span>
          </div>

          {/* Popular Menu Preview */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Plats phares :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.menu.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800"
                >
                  {item.name} <strong className="text-orange-400">{item.price.toLocaleString()} FCFA</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0 flex items-center gap-2">
        {serviceMode === "booking" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookTable?.(restaurant);
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Réserver une table</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMenu(restaurant);
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-600"
          >
            <span>Consulter la carte</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            shareRestaurantOnWhatsApp(restaurant);
          }}
          className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 shadow-sm"
          title="Partager ce restaurant sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
};
