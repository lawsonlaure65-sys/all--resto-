import React, { useState } from "react";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  Check,
  Flame,
  Sparkles,
  ShoppingBag,
  Calendar,
  Heart,
  MessageCircle,
  Globe,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  UtensilsCrossed,
  RotateCcw,
} from "lucide-react";
import { Restaurant, MenuItem, ServiceMode } from "../types";
import { useTranslation } from "../context/TranslationContext";
import { shareRestaurantOnWhatsApp, shareDishOnWhatsApp } from "../utils/whatsappNotifications";

interface RestaurantMenuModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: Record<string, string>, qty: number) => void;
  onBookTable: (restaurant: Restaurant) => void;
  serviceMode: ServiceMode;
}

export const RestaurantMenuModal: React.FC<RestaurantMenuModalProps> = ({
  restaurant: rawRestaurant,
  isOpen,
  onClose,
  onAddToCart,
  onBookTable,
}) => {
  const { currentLanguage, translateRestaurant, activeLanguageInfo } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItemForConfig, setSelectedItemForConfig] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [itemQty, setItemQty] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);
  const [failedDishImages, setFailedDishImages] = useState<Record<string, boolean>>({});

  // Dietary & Taste Filters
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterVegeOnly, setFilterVegeOnly] = useState(false);
  const [filterHalalOnly, setFilterHalalOnly] = useState(false);
  const [filterNigerLocalOnly, setFilterNigerLocalOnly] = useState(false);
  const [filterExpressOnly, setFilterExpressOnly] = useState(false);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setFilterSpicyOnly(false);
    setFilterVegeOnly(false);
    setFilterHalalOnly(false);
    setFilterNigerLocalOnly(false);
    setFilterExpressOnly(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategory("all");
      setSelectedItemForConfig(null);
      setFilterSpicyOnly(false);
      setFilterVegeOnly(false);
      setFilterHalalOnly(false);
      setFilterNigerLocalOnly(false);
      setFilterExpressOnly(false);
      setBannerImgError(false);
      setFailedDishImages({});
    }
  }, [isOpen, rawRestaurant?.id]);

  if (!rawRestaurant || !isOpen) return null;

  const restaurant = translateRestaurant(rawRestaurant) || rawRestaurant;
  const rawMenuList = restaurant?.menu || rawRestaurant?.menu || [];
  const menuList = rawMenuList.filter((m) => m && m.isAvailable !== false);
  const normalizeCat = (cat?: string) => (cat || "Plats Africains").replace(/⭐/g, "").trim() || "Plats Africains";
  const categories = Array.from(new Set(menuList.map((m) => normalizeCat(m.category))));

  const hasActiveFilter =
    selectedCategory !== "all" ||
    filterSpicyOnly ||
    filterVegeOnly ||
    filterHalalOnly ||
    filterNigerLocalOnly ||
    filterExpressOnly;

  const filteredMenuItems = menuList.filter((m) => {
    if (selectedCategory !== "all" && normalizeCat(m.category) !== selectedCategory) return false;
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

  const bannerSrc = restaurant.bannerImage || restaurant.image;
  const isKhadys =
    restaurant.id === "resto-khadys-food" ||
    restaurant.id === "99e2e632-4efd-4a44-8754-b806b50babfe" ||
    restaurant.name.toLowerCase().includes("khady");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 18 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[90vh]"
        >
          {/* Top Sticky Action Bar — always visible, zero overlap with cover */}
          <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 bg-slate-950 border-b border-slate-800">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                  {restaurant.name}
                </h2>
                {currentLanguage !== "fr" && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-orange-300 font-semibold">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>{activeLanguageInfo.flag}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate tabular-nums">
                <span className="text-amber-400 font-semibold">★ {restaurant.rating}</span>
                <span aria-hidden="true">·</span>
                <span>{restaurant.deliveryTime}</span>
                <span aria-hidden="true" className="hidden sm:inline">·</span>
                <span className="hidden sm:inline truncate">{menuList.length} plats</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => shareRestaurantOnWhatsApp(restaurant)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-400/40 cursor-pointer transition-colors whitespace-nowrap"
                title="Partager ce restaurant sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Ajouter aux favoris"
                className={`min-w-[38px] min-h-[38px] p-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorite
                    ? "bg-red-500 text-white border-red-400"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le menu"
                className="min-w-[38px] min-h-[38px] p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notice when item added */}
          {addedNotice && (
            <div className="shrink-0 bg-emerald-900/95 text-emerald-100 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 border-b border-emerald-700">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Plat ajouté à votre panier avec succès !</span>
            </div>
          )}

          {/* Unified Scrollable Body — Hero, Partner Info, Filters & Full Dish List */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {/* Restaurant Hero Cover (natural flex flow, never clips or collides) */}
            <div className="relative min-h-[148px] sm:min-h-[188px] w-full bg-slate-950 flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
              {bannerSrc && !bannerImgError ? (
                <img
                  src={bannerSrc}
                  alt={restaurant.name}
                  onError={() => setBannerImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-orange-950/40 to-slate-950 flex items-center justify-center">
                  <UtensilsCrossed className="w-12 h-12 text-orange-500/25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/25" />

              <div className="relative z-10 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-orange-400">{restaurant.cuisine}</span>
                  {restaurant.promoBadge && (
                    <>
                      <span className="text-slate-500" aria-hidden="true">·</span>
                      <span className="text-red-300 inline-flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-red-400" />
                        <span>{restaurant.promoBadge}</span>
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white leading-snug">
                  {restaurant.name}
                </h3>

                {restaurant.tagline && (
                  <p className="text-xs sm:text-sm text-slate-200 max-w-2xl line-clamp-2 leading-relaxed">
                    {restaurant.tagline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 pt-1.5 border-t border-slate-700/60 tabular-nums">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{restaurant.rating} ({restaurant.reviewCount} avis)</span>
                  </span>
                  <span className="text-slate-500" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{restaurant.deliveryTime}</span>
                  </span>
                  <span className="text-slate-500" aria-hidden="true">·</span>
                  <span className="inline-flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{restaurant.address}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Official Partner Direct Links Strip (scrolls smoothly with page) */}
            {(restaurant.isPartnerCertified || restaurant.websiteUrl || restaurant.onlineCatalogUrl) && (
              <div className="bg-slate-950/80 border-y border-amber-600/30 px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-white">{restaurant.name}</span>
                      <span className="text-amber-400 font-semibold">· Partenaire Officiel Allôresto</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Livraison rapide Billo Express ici ou accès direct :
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {isKhadys ? (
                    <>
                      <a
                        href="https://khadysfood.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition whitespace-nowrap"
                        title="Accéder au site officiel et vitrine de Khady's Food & Event"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Site Khady’s Food ↗</span>
                      </a>
                      <a
                        href="https://wa.me/c/22774441621"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          track("whatsapp_click", {
                            source: "alloresto",
                            restaurant_name: restaurant.name || "Khady's Food & Event",
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs transition border border-emerald-500/40 whitespace-nowrap"
                        title="Consulter le catalogue WhatsApp de Khady's Food & Event"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Catalogue</span>
                      </a>
                      <a
                        href="https://wa.me/22774441621"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          track("whatsapp_click", {
                            source: "alloresto",
                            restaurant_name: restaurant.name || "Khady's Food & Event",
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition border border-emerald-400/40 whitespace-nowrap"
                        title="Commander ou discuter sur WhatsApp avec Khady's Food & Event"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </>
                  ) : (
                    <>
                      {restaurant.websiteUrl && (
                        <a
                          href={restaurant.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition whitespace-nowrap"
                          title={`Accéder au site web et à l'application officielle de ${restaurant.name}`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Site Web</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      )}

                      {restaurant.onlineCatalogUrl && (
                        <a
                          href={restaurant.onlineCatalogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition border border-emerald-400/40 whitespace-nowrap"
                          title={`Consulter le catalogue en ligne WhatsApp de ${restaurant.name}`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Catalogue WhatsApp</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Slim Sticky Category Navigation Bar (~48px max so dishes always dominate viewport) */}
            <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-2 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      selectedCategory === "all"
                        ? "bg-orange-500 text-slate-950 shadow-sm"
                        : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                    }`}
                  >
                    {currentLanguage === "ha"
                      ? "Dukkan Abinci"
                      : currentLanguage === "zm"
                        ? "Ŋwaarey Kulu"
                        : currentLanguage === "en"
                          ? "All Items"
                          : "Tout le menu"}
                  </button>
                  {categories.map((cat, cIdx) => (
                    <button
                      type="button"
                      key={`cat-${cat}-${cIdx}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? "bg-orange-500 text-slate-950 shadow-sm"
                          : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {restaurant.services?.includes("booking") && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBookTable(restaurant);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {currentLanguage === "ha"
                        ? "Ajiye Tebur"
                        : currentLanguage === "zm"
                          ? "Teebur Za"
                          : currentLanguage === "en"
                            ? "Book Table"
                            : "Réserver une table"}
                    </span>
                    <span className="sm:hidden">Table</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Dietary Filters (scrollable horizontally, non-sticky so menu stays visible) */}
            <div className="px-4 pt-3 pb-1 sm:px-6 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                type="button"
                onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  filterSpicyOnly
                    ? "bg-red-950 text-red-200 border-red-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <Flame className="w-3 h-3 text-red-400" />
                <span>{currentLanguage === "ha" ? "Yaji" : currentLanguage === "zm" ? "Tonkol" : "Épicé"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterVegeOnly(!filterVegeOnly)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  filterVegeOnly
                    ? "bg-green-950 text-green-200 border-green-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>🌱 {currentLanguage === "ha" ? "Kayan Gona" : currentLanguage === "zm" ? "Kobto" : "Végétarien"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterHalalOnly(!filterHalalOnly)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  filterHalalOnly
                    ? "bg-emerald-950 text-emerald-200 border-emerald-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>🥩 Halal</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterNigerLocalOnly(!filterNigerLocalOnly)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  filterNigerLocalOnly
                    ? "bg-amber-950 text-amber-200 border-amber-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>🇳🇪 {currentLanguage === "ha" ? "Abincin Nijar" : currentLanguage === "zm" ? "Niamey Ŋwaari" : "Terroir Niger"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterExpressOnly(!filterExpressOnly)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  filterExpressOnly
                    ? "bg-cyan-950 text-cyan-200 border-cyan-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                <span>⚡ Express &lt; 15m</span>
              </button>
            </div>

            {/* Menu Section Header + Cards */}
            <div className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 tabular-nums">
                  {filteredMenuItems.length} {filteredMenuItems.length > 1 ? "plats disponibles" : "plat disponible"}
                </span>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Réinitialiser les filtres</span>
                  </button>
                )}
              </div>

              {filteredMenuItems.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center space-y-3">
                  <p className="text-sm font-bold text-white">
                    Aucun plat ne correspond aux filtres sélectionnés.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Afficher tout le menu
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filteredMenuItems.map((item, idx) => {
                    const imageKey = `${item.id}-${idx}`;
                    const showFallbackImg = !item.image || failedDishImages[imageKey];
                    const metaTags: string[] = [];
                    if (item.isPopular) metaTags.push("Populaire");
                    if (item.isNigerLocal) metaTags.push("Terroir Niger");
                    if (item.isHalal) metaTags.push("Halal");
                    if (item.isVegetarian) metaTags.push("Végétarien");
                    if (item.isGlutenFree) metaTags.push("Sans gluten");
                    if (item.isSpicy) {
                      metaTags.push(
                        item.spiceLevel === 3 ? "Kan-Kan" : item.spiceLevel === 2 ? "Relevé" : "Épicé"
                      );
                    }
                    if (item.preparationTime) metaTags.push(`${item.preparationTime} min`);

                    return (
                      <div
                        key={imageKey}
                        onClick={() => handleOpenItemConfig(item)}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 transition-colors flex gap-3 cursor-pointer group shadow-sm"
                      >
                        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                          <div>
                            {metaTags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-slate-400 mb-1 tabular-nums">
                                {metaTags.slice(0, 4).map((tag, tIdx) => (
                                  <React.Fragment key={tag}>
                                    {tIdx > 0 && <span aria-hidden="true">·</span>}
                                    <span className={tag === "Populaire" ? "text-orange-400 font-semibold" : ""}>
                                      {tag}
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}

                            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-1 flex items-center justify-between gap-2">
                            <span className="text-sm font-black text-orange-400 tabular-nums whitespace-nowrap">
                              {item.price.toLocaleString()} FCFA
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareDishOnWhatsApp(item, restaurant.name);
                                }}
                                className="min-w-[36px] min-h-[36px] p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                                title="Partager ce plat sur WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-orange-500/15 group-hover:bg-orange-500 text-orange-400 group-hover:text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  {currentLanguage === "ha"
                                    ? "Zaba"
                                    : currentLanguage === "zm"
                                      ? "Za"
                                      : currentLanguage === "en"
                                        ? "Add"
                                        : "Ajouter"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 self-center">
                          {!showFallbackImg ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={() =>
                                setFailedDishImages((prev) => ({ ...prev, [imageKey]: true }))
                              }
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-2 text-center">
                              <UtensilsCrossed className="w-6 h-6 text-orange-400/60" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Info inside scroll flow so mobile screen stays dedicated to the menu */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 tabular-nums">
              <span>
                Commande minimale :{" "}
                <strong className="text-slate-200">{(restaurant.minOrder ?? 0).toLocaleString()} FCFA</strong>
              </span>
              <span>
                Horaires : <strong className="text-slate-200">{restaurant.openingHours}</strong>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Item Customization Sub-Modal */}
      {selectedItemForConfig && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-slate-900 border border-orange-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-5 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">{selectedItemForConfig.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedItemForConfig.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForConfig(null)}
                aria-label="Fermer les options"
                className="min-w-[36px] min-h-[36px] p-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options selection if available */}
            {selectedItemForConfig.options && selectedItemForConfig.options.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                {selectedItemForConfig.options.map((opt, oIdx) => (
                  <div key={`opt-${opt.name}-${oIdx}`} className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      {opt.name} :
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {opt.choices.map((choice, cIdx) => {
                        const isSelected = selectedOptions[opt.name] === choice.label;
                        return (
                          <button
                            key={`choice-${opt.name}-${choice.label}-${cIdx}`}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((prev) => ({ ...prev, [opt.name]: choice.label }))
                            }
                            className={`p-3 rounded-xl text-xs flex items-center justify-between border transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                                : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                            }`}
                          >
                            <span>{choice.label}</span>
                            {choice.extraPrice > 0 ? (
                              <span className="font-mono tabular-nums text-orange-400">
                                +{choice.extraPrice.toLocaleString()} FCFA
                              </span>
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
                  className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-black text-white text-sm tabular-nums">{itemQty}</span>
                <button
                  type="button"
                  onClick={() => setItemQty(itemQty + 1)}
                  className="w-10 h-10 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center hover:bg-orange-400 font-black cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions: Add to cart & WhatsApp Share */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmAddToCart}
                className="flex-1 min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-orange-500/20 cursor-pointer tabular-nums"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {currentLanguage === "ha"
                    ? "Sanya a Kwando"
                    : currentLanguage === "zm"
                      ? "Daŋ Bata Ra"
                      : currentLanguage === "en"
                        ? "Add to Cart"
                        : "Ajouter au Panier"}{" "}
                  &bull; {calculateConfiguredItemTotal().toLocaleString()} FCFA
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedItemForConfig) {
                    shareDishOnWhatsApp(selectedItemForConfig, restaurant.name);
                  }
                }}
                className="min-h-[48px] p-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 shadow-sm"
                title="Partager ce plat sur WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
