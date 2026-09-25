import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
  Utensils,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface DailyDish {
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
}

export interface AnimatedHeroVisualProps {
  onExploreMenu?: () => void;
  featuredDish?: {
    name: string;
    price?: number;
    image?: string;
    description?: string;
  } | null;
}

const PERMANENT_KEYWORDS = ["attieke", "doukounou"];

const isPermanentName = (name?: string) => {
  const norm = (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return PERMANENT_KEYWORDS.some((kw) => norm.includes(kw));
};

export const AnimatedHeroVisual: React.FC<AnimatedHeroVisualProps> = ({
  onExploreMenu,
  featuredDish,
}) => {
  const [dailyDish, setDailyDish] = useState<DailyDish | null>(() => {
    if (featuredDish && !isPermanentName(featuredDish.name)) {
      return {
        name: featuredDish.name,
        description: featuredDish.description,
        price: featuredDish.price || 4000,
        image_url: featuredDish.image,
      };
    }
    return null;
  });
  const [isLoadingDailyDish, setIsLoadingDailyDish] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    // Si un featuredDish valide et non-permanent est déjà fourni par les props
    if (featuredDish && !isPermanentName(featuredDish.name)) {
      setDailyDish({
        name: featuredDish.name,
        description: featuredDish.description,
        price: featuredDish.price || 4000,
        image_url: featuredDish.image,
      });
      setIsLoadingDailyDish(false);
      return;
    }

    const loadDailyDish = async () => {
      setIsLoadingDailyDish(true);

      const hasConfig =
        typeof isSupabaseConfigured === "function"
          ? isSupabaseConfigured()
          : Boolean(isSupabaseConfigured);

      if (!hasConfig) {
        setIsLoadingDailyDish(false);
        return;
      }

      try {
        const today = new Date().toISOString().slice(0, 10);

        // Récupérer le menu du jour publié pour aujourd'hui
        const { data, error } = await (supabase
          .from("daily_menus") as any)
          .select("*")
          .eq("menu_date", today)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.warn("Erreur chargement plat du jour Supabase :", error);
        }

        if (!cancelled) {
          if (data) {
            const rawName = data.title || data.dish_name || "";
            if (!isPermanentName(rawName)) {
              setDailyDish({
                name: rawName,
                description: data.description,
                price: Number(data.price_xof || data.price_fcfa || data.price || 4000),
                image_url: data.image_url || data.photo_url,
              });
            } else {
              setDailyDish(null);
            }
          } else {
            setDailyDish(null);
          }
          setIsLoadingDailyDish(false);
        }
      } catch (err) {
        console.warn("Exception chargement daily_menus :", err);
        if (!cancelled) {
          setIsLoadingDailyDish(false);
        }
      }
    };

    loadDailyDish();

    return () => {
      cancelled = true;
    };
  }, [featuredDish]);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none pt-4 pb-2">
      {/* Background Warm Glowing Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Premium Showcase Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800 p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Culinary Quality Status Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-orange-400" />
              <span>Cuisine Ouverte &bull; Cuisiné ce matin à Niamey</span>
            </span>
          </div>

          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Fait Maison 100% Frais</span>
          </span>
        </div>

        {/* Center: Featured Gastronomic Visual Showcase */}
        <div className="relative bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800/80 mb-4 overflow-hidden">
          <div className="relative rounded-2xl overflow-hidden h-52 sm:h-56 w-full group">
            <img
              src={
                dailyDish?.image_url ||
                "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=85"
              }
              alt={dailyDish?.name || "Plat du jour à Niamey"}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Soft Dark Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            {/* Top Quality Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1">
                <span>👑</span>
                <span>{dailyDish?.name ? "Plat du jour" : "Saveurs du Sahel"}</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                ⭐ 4.9 (420+ avis)
              </span>
            </div>

            {/* Bottom Dish Overlay Infos */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                  Cuisine fraîche du jour
                </p>

                <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
                  {isLoadingDailyDish
                    ? "Chargement du plat du jour..."
                    : dailyDish?.name || "Plat du jour bientôt disponible"}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {dailyDish?.description ||
                    "Découvrez les spécialités fraîches et authentiques de Khady's Food."}
                </p>
              </div>

              <div className="text-right shrink-0 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-orange-500/30">
                <span className="block text-[10px] text-slate-400 font-medium">
                  Portion
                </span>

                <span className="text-sm sm:text-base font-black text-amber-400">
                  {dailyDish
                    ? `${dailyDish.price.toLocaleString()} FCFA`
                    : "Bientôt disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Key Trust Pillars */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300">
            <div className="flex flex-col items-center">
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> 25-40 min
              </span>
              <span className="text-[10px] text-slate-400">Chaud à table</span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-800/80">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Hygiène A+
              </span>
              <span className="text-[10px] text-slate-400">Emballage Scellé</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Niamey
              </span>
              <span className="text-[10px] text-slate-400">Tous quartiers</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card: Fast Order Action */}
        <div className="relative rounded-2xl bg-gradient-to-r from-orange-500/15 via-slate-800/70 to-amber-500/15 border border-orange-500/30 p-3.5 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">Khady&apos;s Food &amp; Event</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Partenaire Officiel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grande Mosquée &bull; Quartier Koubia &bull; Plateau
              </p>
            </div>
          </div>

          {onExploreMenu && (
            <button
              onClick={onExploreMenu}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-orange-500/30 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Voir le Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
