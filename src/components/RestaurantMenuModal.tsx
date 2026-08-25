import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Clock,
  MapPin,
  Phone,
  Plus,
  Minus,
  Check,
  Flame,
  Sparkles,
  ShoppingBag,
  Calendar,
  Share2,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Restaurant, MenuItem, ServiceMode } from "../types";

interface RestaurantMenuModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: Record<string, string>, qty: number) => void;
  onBookTable: (restaurant: Restaurant) => void;
  serviceMode: ServiceMode;
}

export const RestaurantMenuModal: React.FC<RestaurantMenuModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onAddToCart,
  onBookTable,
  serviceMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItemForConfig, setSelectedItemForConfig] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [itemQty, setItemQty] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  
  // Dietary & Taste Filters within restaurant menu
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterVegeOnly, setFilterVegeOnly] = useState(false);
  const [filterHalalOnly, setFilterHalalOnly] = useState(false);
  const [filterNigerLocalOnly, setFilterNigerLocalOnly] = useState(false);
  const [filterExpressOnly, setFilterExpressOnly] = useState(false);

  if (!restaurant || !isOpen) return null;

  const categories = Array.from(new Set(restaurant.menu.map((m) => m.category)));

  const filteredMenuItems = restaurant.menu.filter((m) => {
    if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
    if (filterSpicyOnly && !m.isSpicy && (m.spiceLevel || 0) === 0) return false;
    if (filterVegeOnly && !m.isVegetarian && !m.isVegan) return false;
    if (filterHalalOnly && !m.isHalal) return false;
    if (filterNigerLocalOnly && !m.isNigerLocal) return false;
    if (filterExpressOnly && !m.isExpress && (m.preparationTime || 20) > 15) return false;
    return true;
  });

  const handleOpenItemConfig = (item: MenuItem) => {
    setSelectedItemForConfig(item);
    setItemQty(1);
    const initialOpts: Record<string, string> = {};
    if (item.options) {
      item.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          initialOpts[opt.name] = opt.choices[0].label;
        }
      });
    }
    setSelectedOptions(initialOpts);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItemForConfig) return;
    onAddToCart(selectedItemForConfig, selectedOptions, itemQty);
    setSelectedItemForConfig(null);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const calculateConfiguredItemTotal = () => {
    if (!selectedItemForConfig) return 0;
    let total = selectedItemForConfig.price;
    if (selectedItemForConfig.options) {
      selectedItemForConfig.options.forEach((opt) => {
        const chosen = selectedOptions[opt.name];
        const match = opt.choices.find((c) => c.label === chosen);
        if (match) total += match.extraPrice;
      });
    }
    return total * itemQty;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Cover Banner */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-950 shrink-0">
            <img
              src={restaurant.bannerImage || restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-950/40" />

            {/* Close & Share Top Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                  isFavorite
                    ? "bg-red-500 text-white border-red-400"
                    : "bg-slate-950/70 text-slate-300 border-slate-700 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Restaurant Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500 text-slate-950">
                  {restaurant.cuisine}
                </span>
                {restaurant.promoBadge && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-600 text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{restaurant.promoBadge}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white">{restaurant.name}</h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 max-w-xl">{restaurant.tagline}</p>

              {/* Info Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-3 pt-2 border-t border-slate-700/60">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{restaurant.rating} ({restaurant.reviewCount} avis)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{restaurant.deliveryTime}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{restaurant.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Notice when item added */}
          {addedNotice && (
            <div className="bg-emerald-900/90 text-emerald-200 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Plat ajouté à votre panier avec succès !</span>
            </div>
          )}

          {/* Categories Navigation Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-orange-500 text-slate-950 shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  Tout le menu
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-slate-950 shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {restaurant.services.includes("booking") && (
                <button
                  onClick={() => {
                    onClose();
                    onBookTable(restaurant);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Réserver une table</span>
                </button>
              )}
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-[11px]">
              <button
                onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  filterSpicyOnly
                    ? "bg-red-950 text-red-300 border-red-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Flame className="w-3 h-3 text-red-400" />
                <span>Épicé</span>
              </button>

              <button
                onClick={() => setFilterVegeOnly(!filterVegeOnly)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  filterVegeOnly
                    ? "bg-green-950 text-green-300 border-green-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🌱 Végétarien</span>
              </button>

              <button
                onClick={() => setFilterHalalOnly(!filterHalalOnly)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  filterHalalOnly
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🥩 Halal</span>
              </button>

              <button
                onClick={() => setFilterNigerLocalOnly(!filterNigerLocalOnly)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  filterNigerLocalOnly
                    ? "bg-amber-950 text-amber-300 border-amber-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🇳🇪 Terroir Niger</span>
              </button>

              <button
                onClick={() => setFilterExpressOnly(!filterExpressOnly)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  filterExpressOnly
                    ? "bg-cyan-950 text-cyan-300 border-cyan-500"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>⚡ Express &lt; 15min</span>
              </button>
            </div>
          </div>

          {/* Menu Items Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenItemConfig(item)}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 transition-all flex gap-3 cursor-pointer group shadow-sm"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {item.isPopular && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Populaire
                          </span>
                        )}
                        {item.isNigerLocal && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🇳🇪 Niger
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                            {item.spiceLevel === 3 ? "🔥🔥 Kan-Kan" : item.spiceLevel === 2 ? "🌶️🌶️ Relevé" : "🌶️ Épicé"}
                          </span>
                        )}
                        {item.isHalal && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            Halal
                          </span>
                        )}
                        {item.isVegetarian && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                            🌱 Végé
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                            🌾 Sans Gluten
                          </span>
                        )}
                        {item.preparationTime && (
                          <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5 text-amber-400" />
                            <span>{item.preparationTime}m</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-orange-400">
                        {item.price.toLocaleString()} FCFA
                      </span>

                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-xl bg-orange-500/10 group-hover:bg-orange-500 text-orange-400 group-hover:text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Close Info */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
            <span>Commande minimale : <strong>{restaurant.minOrder.toLocaleString()} FCFA</strong></span>
            <span>Horaires : <strong>{restaurant.openingHours}</strong></span>
          </div>
        </motion.div>
      </div>

      {/* Item Customization Sub-Modal */}
      {selectedItemForConfig && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-slate-900 border border-orange-500/40 rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">{selectedItemForConfig.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedItemForConfig.description}</p>
              </div>
              <button
                onClick={() => setSelectedItemForConfig(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options selection if available */}
            {selectedItemForConfig.options && selectedItemForConfig.options.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                {selectedItemForConfig.options.map((opt) => (
                  <div key={opt.name} className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      {opt.name} :
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {opt.choices.map((choice) => {
                        const isSelected = selectedOptions[opt.name] === choice.label;
                        return (
                          <button
                            key={choice.label}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((prev) => ({ ...prev, [opt.name]: choice.label }))
                            }
                            className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            <span>{choice.label}</span>
                            {choice.extraPrice > 0 ? (
                              <span className="font-mono text-orange-400">+{choice.extraPrice.toLocaleString()} FCFA</span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Inclus</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Controller */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantité</span>
              <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm text-white px-2">{itemQty}</span>
                <button
                  type="button"
                  onClick={() => setItemQty(itemQty + 1)}
                  className="w-8 h-8 rounded-xl bg-orange-500 text-slate-950 font-bold flex items-center justify-center hover:bg-orange-400 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Confirm Button */}
            <button
              onClick={handleConfirmAddToCart}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-sm flex items-center justify-between px-6 shadow-xl shadow-orange-500/25 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <span>Ajouter à ma commande</span>
              <span>{calculateConfiguredItemTotal().toLocaleString()} FCFA</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
