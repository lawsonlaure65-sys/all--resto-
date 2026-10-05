import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { DailySpecial } from "../types";
import { fetchKhadysProgrammedDailyMenu, KHADYS_FALLBACK_MENU } from "../services/khadysSyncService";
import {
  resolveDishImageUrl,
  KHADYS_OFFICIAL_SUYA_IMAGE,
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
} from "../utils/dishImageResolver";
import {
  findKhadysRestaurantInSupabase,
  isAllorestoKitchen,
  KHADYS_OFFICIAL_NAME,
  KHADYS_STABLE_LOCAL_ID,
} from "../services/khadysPartnerResolver";

export interface SupabaseDailyMenuRow {
  id: string;
  restaurant_id: string | null;
  menu_date: string;
  title: string;
  description: string | null;
  price_xof: number;
  image_url: string | null;
  marketing_message: string | null;
  call_to_action: string | null;
  status: "draft" | "scheduled" | "published" | "archived";
  is_ai_suggested?: boolean;
}

const KHADYS_RESTAURANT_ID = "99e2e632-4efd-4a44-8754-b806b50babfe";

export function useDailyMenu() {
  const [supabaseMenu, setSupabaseMenu] = useState<DailySpecial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTodayMenu() {
      // 1. D'abord, vérifier s'il existe un menu du jour actif enregistré localement pour Khady's Food
      try {
        const localActivePlanStr = localStorage.getItem("alloresto_active_daily_special");
        if (localActivePlanStr) {
          const plan = JSON.parse(localActivePlanStr);
          if (plan && plan.dishName) {
            // Si le cache local contient l'ancien Tiep obsolète, on le purge immédiatement
            if (plan.dishName.toLowerCase().includes("tiep")) {
              localStorage.removeItem("alloresto_active_daily_special");
            } else {
              const dishPrice = plan.priceFcfa || 3500;
              const localSpecial: DailySpecial = {
                id: plan.id || "local-khadys-daily",
                title: plan.dishName,
                restaurantName: plan.restaurantName || "Khady's Food & Event",
                restaurantId: plan.restaurantId || KHADYS_RESTAURANT_ID,
                description:
                  plan.description ||
                  `${plan.mainCourse || plan.dishName}. Accompagné de : ${plan.starter || "Pâte de maïs ou pâte noire"}${plan.drinkOrDessert ? ` • ${plan.drinkOrDessert}` : ""}`,
                price: dishPrice,
                originalPrice: Math.round(dishPrice * 1.2),
                image: resolveDishImageUrl(plan) || KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
                servingsLeft: plan.availablePortions || 25,
                availableUntil: "15h00",
                accompaniedBy: plan.accompaniedBy || `${plan.starter || "Pâte de maïs"} + ${plan.drinkOrDessert || "Piment vert maison"}`,
                tags: ["👑 Khady's Food", "🔥 Plat du Jour", `🍲 ${dishPrice.toLocaleString()} FCFA`, "⚡ Service 11h-15h"],
              };
              if (active) setSupabaseMenu(localSpecial);
            }
          }
        }
      } catch (err) {
        console.warn("Lecture du menu du jour local :", err);
      }

      // 2. Si Supabase est configuré, interroger la table daily_menus pour Khady's Food
      if (!isSupabaseConfigured()) {
        const localActivePlanStr = localStorage.getItem("alloresto_active_daily_special");
        if (!localActivePlanStr) {
          try {
            const khadysData = await fetchKhadysProgrammedDailyMenu();
            if (khadysData && khadysData.mainDish && active) {
              const main = khadysData.mainDish;
              setSupabaseMenu({
                id: "khadys-programmed-daily",
                title: main.dishName,
                restaurantName: "Khady's Food & Event",
                restaurantId: KHADYS_RESTAURANT_ID,
                description: `${main.description}. Accompagnements : ${main.accompaniments}`,
                price: main.priceFcfa,
                originalPrice: main.originalPrice,
                image: main.imageUrl,
                servingsLeft: main.availablePortions,
                availableUntil: "15h00",
                accompaniedBy: main.accompaniments,
                tags: ["👑 Khady's Food", "🔥 Plat Programmé Khady's", "✨ Trio Gourmand", "⚡ Service 11h-15h"],
              });
            }
          } catch (e) {
            console.warn("Erreur auto-sync Khady's Food:", e);
          }
        }
        if (active) setLoading(false);
        return;
      }

      try {
        // Date du jour YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        // Règle 2, 3, 4, 5 : Chercher l'identifiant réel de Khady's Food & Event dans Supabase
        const khadyLookup = await findKhadysRestaurantInSupabase();
        const targetRestaurantId = khadyLookup.found && khadyLookup.id ? khadyLookup.id : null;

        let candidateRow: (SupabaseDailyMenuRow & { photo_url?: string | null }) | null = null;
        let queryError: any = null;

        // Si Khady's Food a été trouvé dans Supabase, chercher son plat du jour
        if (targetRestaurantId) {
          const res = await supabase
            .from("daily_menus")
            .select("*")
            .eq("restaurant_id", targetRestaurantId)
            .eq("menu_date", today)
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          candidateRow = res.data;
          queryError = res.error;

          // Si pas de plat aujourd'hui, chercher le dernier plat publié de Khady's Food
          if (!candidateRow && !queryError) {
            const latestRes = await supabase
              .from("daily_menus")
              .select("*")
              .eq("restaurant_id", targetRestaurantId)
              .eq("status", "published")
              .order("menu_date", { ascending: false })
              .limit(1)
              .maybeSingle();
            candidateRow = latestRes.data;
            queryError = latestRes.error;
          }
        }

        // Règle 5, 7, 10 : Ne JAMAIS prendre le plat ou l'image d'Allôresto Kitchen
        const isFromKitchen =
          candidateRow && isAllorestoKitchen(candidateRow.restaurant_id);

        const isObsoleteOrStale =
          !candidateRow ||
          isFromKitchen ||
          (candidateRow.title && candidateRow.title.toLowerCase().includes("tiep")) ||
          (candidateRow.menu_date &&
            Math.abs(new Date(today).getTime() - new Date(candidateRow.menu_date).getTime()) > 2 * 86400000);

        if (isObsoleteOrStale) {
          const liveData = await fetchKhadysProgrammedDailyMenu();
          if (liveData?.mainDish && active) {
            const main = liveData.mainDish;
            setSupabaseMenu({
              id: "khadys-live-programmed",
              title: main.dishName,
              restaurantName: KHADYS_OFFICIAL_NAME,
              restaurantId: targetRestaurantId || KHADYS_STABLE_LOCAL_ID,
              description: `${main.description}. Accompagnements : ${main.accompaniments}`,
              price: main.priceFcfa,
              originalPrice: main.originalPrice,
              image: resolveDishImageUrl(main) || KHADYS_OFFICIAL_SUYA_IMAGE,
              servingsLeft: main.availablePortions,
              availableUntil: "15h00",
              accompaniedBy: main.accompaniments,
              tags: ["👑 Khady's Food", "🔥 Plat du Jour Khady's", "✨ Sélection Officielle", "⚡ Service 11h-15h"],
            });
            if (active) setLoading(false);
            return;
          }
        }

        if (queryError) {
          console.warn("Info menu du jour Supabase (repli automatique local):", queryError.message);
        }

        if (candidateRow && active) {
          const row = candidateRow;
          const dishPrice = row.price_xof || 3500;
          const adaptedSpecial: DailySpecial = {
            id: row.id,
            title: row.title,
            restaurantName: KHADYS_OFFICIAL_NAME,
            restaurantId: targetRestaurantId || KHADYS_STABLE_LOCAL_ID,
            description:
              row.marketing_message ||
              row.description ||
              "Préparé avec soin ce matin chez Khady's Food & Event à Niamey.",
            price: dishPrice,
            originalPrice: Math.round(dishPrice * 1.2),
            image: resolveDishImageUrl(row) || KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
            servingsLeft: 25,
            availableUntil: "15h00",
            accompaniedBy: row.description || "Pâte de maïs ou pâte noire d'igname, poisson/bœuf et piment vert maison",
            tags: ["👑 Khady's Food", "🔥 Plat du Jour Officiel", `🍲 ${dishPrice.toLocaleString()} FCFA`, "⚡ Service 11h-15h"],
          };
          setSupabaseMenu(adaptedSpecial);
        } else if (!candidateRow) {
          // Repli gracieux : vérifier le stockage local ou le menu programmé Khady's Food
          const localActivePlanStr = localStorage.getItem("alloresto_active_daily_special");
          if (!localActivePlanStr) {
            try {
              const khadysData = await fetchKhadysProgrammedDailyMenu();
              if (khadysData && khadysData.mainDish && active) {
                const main = khadysData.mainDish;
                setSupabaseMenu({
                  id: "khadys-programmed-daily",
                  title: main.dishName,
                  restaurantName: "Khady's Food & Event",
                  restaurantId: KHADYS_RESTAURANT_ID,
                  description: `${main.description}. Accompagnements : ${main.accompaniments}`,
                  price: main.priceFcfa,
                  originalPrice: main.originalPrice,
                  image: main.imageUrl,
                  servingsLeft: main.availablePortions,
                  availableUntil: "15h00",
                  accompaniedBy: main.accompaniments,
                  tags: ["👑 Khady's Food", "🔥 Plat Programmé Khady's", "✨ Trio Gourmand", "⚡ Service 11h-15h"],
                });
              }
            } catch (e) {
              console.warn("Erreur repli Khady's Food:", e);
            }
          }
        }
      } catch (err: any) {
        console.warn("useDailyMenu fetch error:", err?.message || err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTodayMenu();

    const handleMenuUpdate = (e: any) => {
      const plan = e?.detail;
      if (plan && plan.dishName) {
        setSupabaseMenu({
          id: plan.id || "local-khadys-daily",
          title: plan.dishName,
          restaurantName: plan.restaurantName || "Khady's Food & Event",
          restaurantId: plan.restaurantId || KHADYS_RESTAURANT_ID,
          description:
            plan.description ||
            `${plan.mainCourse}. Accompagné de : ${plan.starter}${plan.drinkOrDessert ? ` • ${plan.drinkOrDessert}` : ""}`,
          price: plan.priceFcfa || 3000,
          originalPrice: Math.round((plan.priceFcfa || 3000) * 1.25),
          image:
            plan.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
          servingsLeft: plan.availablePortions || 25,
          availableUntil: "15h00",
          accompaniedBy: `${plan.starter} + ${plan.drinkOrDessert || "Jus de Bissap offert"}`,
          tags: ["👑 Khady's Food", "🔥 Plat du Jour", "✨ Chef Recommande", "⚡ Service 11h-15h"],
        });
      } else {
        loadTodayMenu();
      }
    };

    window.addEventListener("alloresto_daily_special_updated", handleMenuUpdate);
    window.addEventListener("storage", loadTodayMenu);

    return () => {
      active = false;
      window.removeEventListener("alloresto_daily_special_updated", handleMenuUpdate);
      window.removeEventListener("storage", loadTodayMenu);
    };
  }, []);

  return { supabaseMenu, loading, error };
}
