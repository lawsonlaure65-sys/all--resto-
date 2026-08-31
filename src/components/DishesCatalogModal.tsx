import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  Flame,
  Leaf,
  ShieldCheck,
  Wheat,
  Zap,
  Sparkles,
  Plus,
  Filter,
  Check,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  Store,
  Coffee,
  Sun,
  Moon,
  UtensilsCrossed,
  Layers,
  ChefHat,
} from "lucide-react";
import { MenuItem, DishCategory, MealMoment, Restaurant } from "../types";
import { CATEGORIES_CONFIG } from "./DishManagementModal";
import { useTranslation } from "../context/TranslationContext";

export const MEAL_MOMENTS_CONFIG: {
  id: "all" | MealMoment;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  badgeBg: string;
}[] = [
  {
    id: "all",
    label: "Tous les Plats",
    sublabel: "Carte complète",
    icon: "🍽️",
    color: "from-orange-500 to-amber-500",
    badgeBg: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    id: "petit_dejeuner",
    label: "Petit Déjeuner",
    sublabel: "06h30 – 11h00",
    icon: "🌅",
    color: "from-amber-500 to-yellow-500",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "dejeuner",
    label: "Déjeuner",
    sublabel: "11h30 – 15h30",
    icon: "☀️",
    color: "from-orange-500 to-red-500",
    badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    id: "diner",
    label: "Dîner",
    sublabel: "18h30 – 23h30",
    icon: "🌙",
    color: "from-indigo-500 to-purple-500",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  },
  {
    id: "menu_du_jour",
    label: "Menu & Plat du Jour",
    sublabel: "Formules & Chef",
    icon: "⭐",
    color: "from-amber-400 to-emerald-400",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
];

interface DishesCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: MenuItem[];
  restaurants?: Restaurant[];
  initialMealMoment?: "all" | MealMoment;
  onAddToCart: (item: MenuItem, options: Record<string, string>, qty: number) => void;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onOpenRestaurantMenu?: (restaurantId: string) => void;
}

export const DishesCatalogModal: React.FC<DishesCatalogModalProps> = ({
  isOpen,
  onClose,
  dishes: rawDishes,
  restaurants = [],
  initialMealMoment = "all",
  onAddToCart,
  onSelectRestaurant,
  onOpenRestaurantMenu,
}) => {
  const { currentLanguage, translateDishes, translateCategory, activeLanguageInfo } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoment, setSelectedMoment] = useState<"all" | MealMoment>(initialMealMoment);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Translate all dishes based on current language
  const dishes = useMemo(() => {
    return translateDishes(rawDishes);
  }, [rawDishes, translateDishes]);

  // Dietary & Taste Filter Toggles
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<number | "all">("all");
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterHalal, setFilterHalal] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [filterNigerLocal, setFilterNigerLocal] = useState(false);
  const [filterExpress, setFilterExpress] = useState(false);
  const [filterChefSpecial, setFilterChefSpecial] = useState(false);
  const [filterMenuDuJourOnly, setFilterMenuDuJourOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  // Added notification feedback
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Sync initialMealMoment if it changes when opening
  React.useEffect(() => {
    if (initialMealMoment) {
      setSelectedMoment(initialMealMoment);
    }
  }, [initialMealMoment]);

  // Filtered dishes memoization
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchDesc = dish.description.toLowerCase().includes(q);
        const matchCat = (dish.category || "").toLowerCase().includes(q);
        const matchFormula = (dish.menuDuJourIncludes || "").toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchFormula) return false;
      }

      // 2. Meal Moment filter
      if (selectedMoment !== "all") {
        if (selectedMoment === "menu_du_jour") {
          const isMenuOrPlat =
            dish.isMenuDuJour ||
            dish.isDailySpecial ||
            dish.dishCategory === "menu_du_jour" ||
            dish.category.toLowerCase().includes("jour") ||
            dish.category.toLowerCase().includes("formule");
          if (!isMenuOrPlat) return false;
        } else {
          const matchDishCategory =
            selectedMoment === "petit_dejeuner" &&
            (dish.dishCategory === "petit_dejeuner" ||
              dish.category.toLowerCase().includes("petit") ||
              dish.category.toLowerCase().includes("matin") ||
              dish.category.toLowerCase().includes("bouillie") ||
              dish.category.toLowerCase().includes("omelette"));

          const hasExplicitMoment =
            dish.mealMoments && dish.mealMoments.includes(selectedMoment);

          if (!matchDishCategory && !hasExplicitMoment) {
            // Soft fallback matching for demo dishes
            if (selectedMoment === "petit_dejeuner") {
              const nameLower = dish.name.toLowerCase();
              if (
                !nameLower.includes("petit") &&
                !nameLower.includes("bouillie") &&
                !nameLower.includes("omelette") &&
                !nameLower.includes("café") &&
                !nameLower.includes("croissant")
              ) {
                return false;
              }
            } else if (selectedMoment === "dejeuner") {
              const nameLower = dish.name.toLowerCase();
              // Exclude purely breakfast items unless explicit
              if (dish.dishCategory === "petit_dejeuner" && !hasExplicitMoment) {
                return false;
              }
            } else if (selectedMoment === "diner") {
              if (dish.dishCategory === "petit_dejeuner" && !hasExplicitMoment) {
                return false;
              }
            }
          }
        }
      }

      // 3. Category filter
      if (selectedCategory !== "all") {
        if (dish.dishCategory) {
          if (dish.dishCategory !== selectedCategory) return false;
        } else {
          // fallback string match
          const catConfig = CATEGORIES_CONFIG.find((c) => c.id === selectedCategory);
          if (catConfig && !dish.category.toLowerCase().includes(catConfig.label.toLowerCase())) {
            return false;
          }
        }
      }

      // 4. Menu du Jour toggle
      if (filterMenuDuJourOnly && !dish.isMenuDuJour && !dish.isDailySpecial && dish.dishCategory !== "menu_du_jour") {
        return false;
      }

      // 5. Price limit
      if (dish.price > maxPrice) return false;

      // 6. Dietary Filters
      if (filterVegetarian && !dish.isVegetarian && !dish.isVegan) return false;
      if (filterVegan && !dish.isVegan) return false;
      if (filterHalal && !dish.isHalal) return false;
      if (filterGlutenFree && !dish.isGlutenFree) return false;
      if (filterNigerLocal && !dish.isNigerLocal) return false;
      if (filterExpress && !dish.isExpress && (dish.preparationTime || 20) > 15) return false;
      if (filterChefSpecial && !dish.isChefSpecial && !dish.isPopular) return false;

      // 7. Spice Filter
      if (filterSpicy && !dish.isSpicy && (dish.spiceLevel || 0) === 0) return false;
      if (selectedSpiceLevel !== "all") {
        if ((dish.spiceLevel || 0) !== selectedSpiceLevel) return false;
      }

      return true;
    });
  }, [
    dishes,
    searchQuery,
    selectedMoment,
    selectedCategory,
    filterMenuDuJourOnly,
    maxPrice,
    filterVegetarian,
    filterVegan,
    filterHalal,
    filterGlutenFree,
    filterNigerLocal,
    filterExpress,
    filterChefSpecial,
    filterSpicy,
    selectedSpiceLevel,
  ]);

  const handleQuickAdd = (dish: MenuItem) => {
    onAddToCart(dish, {}, 1);
    setAddedItemNotice(`"${dish.name}" ajouté avec succès au panier ! 🛍️`);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedMoment("all");
    setSelectedCategory("all");
    setFilterMenuDuJourOnly(false);
    setFilterSpicy(false);
    setSelectedSpiceLevel("all");
    setFilterVegetarian(false);
    setFilterVegan(false);
    setFilterHalal(false);
    setFilterGlutenFree(false);
    setFilterNigerLocal(false);
    setFilterExpress(false);
    setFilterChefSpecial(false);
    setMaxPrice(20000);
  };

  const activeFiltersCount =
    (selectedMoment !== "all" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (filterMenuDuJourOnly ? 1 : 0) +
    (filterSpicy ? 1 : 0) +
    (filterVegetarian ? 1 : 0) +
    (filterVegan ? 1 : 0) +
    (filterHalal ? 1 : 0) +
    (filterGlutenFree ? 1 : 0) +
    (filterNigerLocal ? 1 : 0) +
    (filterExpress ? 1 : 0) +
    (filterChefSpecial ? 1 : 0) +
    (maxPrice < 20000 ? 1 : 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-6xl h-full sm:h-[92vh] max-h-screen sm:max-h-[92vh] bg-slate-900 border-0 sm:border border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                Explorez par Plats 🇳🇪
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 truncate">Niamey &bull; Billo 🏍️</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white mt-0.5 truncate">
              Grande Carte &amp; Plats de Niamey
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-[11px] font-semibold cursor-pointer transition"
              >
                Réinitialiser ({activeFiltersCount})
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Fermer la carte"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Quick Add Alert Banner */}
        {addedItemNotice && (
          <div className="bg-emerald-900/90 text-emerald-200 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in duration-200 shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{addedItemNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: MOMENTS DE SERVICE (Scrollable / Compact) */}
        {/* ======================================================== */}
        <div className="px-3 sm:px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-5">
            {MEAL_MOMENTS_CONFIG.map((moment) => {
              const isSelected = selectedMoment === moment.id;
              return (
                <button
                  key={moment.id}
                  onClick={() => setSelectedMoment(moment.id)}
                  className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all text-left flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 sm:shrink ${
                    isSelected
                      ? "bg-slate-800/95 border-orange-500 shadow-md shadow-orange-500/10 text-white"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="text-base sm:text-xl shrink-0">{moment.icon}</span>
                  <div className="min-w-0 pr-1">
                    <span className={`text-[11px] sm:text-xs font-black block whitespace-nowrap sm:truncate ${isSelected ? "text-orange-400" : "text-slate-200"}`}>
                      {moment.label}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 block whitespace-nowrap sm:truncate font-mono">
                      {moment.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-2.5 sm:p-4 bg-slate-950 border-b border-slate-800 space-y-2 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un plat (Choukouya, Dambou, Capitaine braisé, Omelette, Dégué...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0 ${
                selectedCategory === "all"
                  ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black"
                  : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <span>🍽️ Toutes les Catégories</span>
              <span className="text-[10px] opacity-80">({dishes.length})</span>
            </button>

            {CATEGORIES_CONFIG.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = dishes.filter(
                (d) => d.dishCategory === cat.id || d.category.toLowerCase().includes(cat.label.toLowerCase())
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black"
                      : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Dietary & Taste Filter Chips (Horizontal Scrollable) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-0.5">
              <SlidersHorizontal className="w-3 h-3 text-orange-400" />
              <span>Filtres :</span>
            </span>

            {/* Menu du Jour Only */}
            <button
              onClick={() => setFilterMenuDuJourOnly(!filterMenuDuJourOnly)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterMenuDuJourOnly
                  ? "bg-amber-950 text-amber-300 border-amber-500 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>⭐ Formule Menu du Jour</span>
            </button>

            {/* Terroir Niger */}
            <button
              onClick={() => setFilterNigerLocal(!filterNigerLocal)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterNigerLocal
                  ? "bg-amber-950 text-amber-300 border-amber-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <span>🇳🇪 Terroir Niger</span>
            </button>

            {/* Spicy & Spice levels dropdown / chips */}
            <button
              onClick={() => {
                setFilterSpicy(!filterSpicy);
                if (filterSpicy) setSelectedSpiceLevel("all");
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterSpicy
                  ? "bg-red-950 text-red-300 border-red-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Flame className="w-2.5 h-2.5 text-red-400" />
              <span>Épicé / Kan-Kan</span>
            </button>

            {/* Halal */}
            <button
              onClick={() => setFilterHalal(!filterHalal)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterHalal
                  ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              <span>100% Halal</span>
            </button>

            {/* Végétarien */}
            <button
              onClick={() => setFilterVegetarian(!filterVegetarian)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterVegetarian
                  ? "bg-green-950 text-green-300 border-green-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Leaf className="w-2.5 h-2.5 text-green-400" />
              <span>Végétarien</span>
            </button>

            {/* Végan */}
            <button
              onClick={() => setFilterVegan(!filterVegan)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterVegan
                  ? "bg-green-950 text-green-300 border-green-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Leaf className="w-2.5 h-2.5 text-green-400" />
              <span>Végan</span>
            </button>

            {/* Sans Gluten */}
            <button
              onClick={() => setFilterGlutenFree(!filterGlutenFree)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterGlutenFree
                  ? "bg-yellow-950 text-yellow-300 border-yellow-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Wheat className="w-2.5 h-2.5 text-yellow-400" />
              <span>Sans Gluten</span>
            </button>

            {/* Express < 15 min */}
            <button
              onClick={() => setFilterExpress(!filterExpress)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterExpress
                  ? "bg-cyan-950 text-cyan-300 border-cyan-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              <span>Express &lt; 15 min</span>
            </button>

            {/* Chef Special */}
            <button
              onClick={() => setFilterChefSpecial(!filterChefSpecial)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer border flex items-center gap-1 shrink-0 ${
                filterChefSpecial
                  ? "bg-purple-950 text-purple-300 border-purple-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
              <span>Choix du Chef</span>
            </button>
          </div>
        </div>

        {/* Dishes Grid (Scrollable Body with min-h-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-4 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              <strong>{filteredDishes.length}</strong> plat(s) trouvé(s)
            </span>
            <span className="text-[11px]">
              Livraison garantie avec <strong>Billo Express Niamey 🏍️</strong>
            </span>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="p-10 sm:p-16 text-center bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Aucun plat ne correspond à vos critères</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Essayez d&apos;ajuster vos filtres (Moments de la journée, régimes diététiques ou catégories).
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pb-4">
              {filteredDishes.map((dish) => {
                // Find restaurant name if available
                const matchedResto = restaurants.find((r) =>
                  r.menu.some((m) => m.id === dish.id)
                );

                return (
                  <div
                    key={dish.id}
                    className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800/90 hover:border-orange-500/40 transition-all flex flex-col justify-between group shadow-lg space-y-2.5 sm:space-y-3"
                  >
                    <div className="space-y-2">
                      {/* Dish Image Banner */}
                      <div className="relative h-40 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback image if broken
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-slate-900/90 text-white backdrop-blur-md border border-slate-700">
                            {dish.category}
                          </span>

                          <div className="flex items-center gap-1">
                            {dish.isMenuDuJour && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-amber-500 text-slate-950 shadow-md">
                                ⭐ Menu du Jour
                              </span>
                            )}
                            {dish.isDailySpecial && !dish.isMenuDuJour && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-orange-500 text-slate-950">
                                ⭐ Plat du Jour
                              </span>
                            )}
                            {dish.isNigerLocal && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/50 backdrop-blur-md">
                                🇳🇪 Niger
                              </span>
                            )}
                            {dish.isHalal && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md">
                                Halal
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Info on Image */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                          <span className="font-mono font-black text-orange-400 text-xs sm:text-sm bg-slate-950/90 px-2 py-0.5 rounded-lg border border-orange-500/30">
                            {dish.price.toLocaleString()} FCFA
                          </span>

                          <span className="flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded-lg text-slate-300 text-[9px] sm:text-[10px]">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{dish.preparationTime || 15} min</span>
                          </span>
                        </div>
                      </div>

                      {/* Dish Content */}
                      <div>
                        {/* Meal moments and dietary tags */}
                        <div className="flex flex-wrap items-center gap-1 mb-1.5">
                          {/* Meal moments badges */}
                          {(dish.dishCategory === "petit_dejeuner" ||
                            (dish.mealMoments && dish.mealMoments.includes("petit_dejeuner"))) && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <span>🌅 Petit Déj</span>
                            </span>
                          )}

                          {dish.mealMoments && dish.mealMoments.includes("dejeuner") && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-950 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                              <span>☀️ Déjeuner</span>
                            </span>
                          )}

                          {dish.mealMoments && dish.mealMoments.includes("diner") && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                              <span>🌙 Dîner</span>
                            </span>
                          )}

                          {/* Dietary Badges */}
                          {dish.isSpicy && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-red-400" />
                              <span>
                                {dish.spiceLevel === 3
                                  ? "Volcan Sahélien"
                                  : dish.spiceLevel === 2
                                  ? "Piquant"
                                  : "Épicé"}
                              </span>
                            </span>
                          )}
                          {dish.isVegetarian && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-green-950 text-green-300 border border-green-500/40 flex items-center gap-0.5">
                              <Leaf className="w-2.5 h-2.5 text-green-400" />
                              <span>Végé</span>
                            </span>
                          )}
                          {dish.isVegan && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-green-950 text-green-300 border border-green-500/40">
                              🌿 Végan
                            </span>
                          )}
                          {dish.isGlutenFree && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-yellow-950 text-yellow-300 border border-yellow-500/40">
                              🌾 Sans Gluten
                            </span>
                          )}
                          {dish.isExpress && (
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                              ⚡ Express
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                          {dish.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {dish.description}
                        </p>

                        {/* If Menu du Jour formula inclusions */}
                        {dish.menuDuJourIncludes && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[9px] sm:text-[10px] text-amber-200 flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Formule Complète :</strong> {dish.menuDuJourIncludes}
                            </span>
                          </div>
                        )}

                        {/* Restaurant Source if found */}
                        {matchedResto && (
                          <div className="mt-1.5 text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-1">
                            <Store className="w-3 h-3 text-orange-400" />
                            <span className="truncate">{matchedResto.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Buttons */}
                    <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                      <button
                        onClick={() => handleQuickAdd(dish)}
                        className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter au Panier</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-xs text-slate-400 px-4 sm:px-6 shrink-0">
          <span className="truncate pr-2">Paiement : <strong>Mynita, Amanata, Al-Izza, Flooz</strong></span>
          <span className="text-orange-400 font-semibold shrink-0">Allôresto Niamey 🇳🇪</span>
        </div>
      </motion.div>
    </div>
    </AnimatePresence>
  );
};
