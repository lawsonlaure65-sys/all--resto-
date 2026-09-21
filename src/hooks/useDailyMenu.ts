import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { DailySpecial } from "../types";
import { fetchKhadysProgrammedDailyMenu, KHADYS_FALLBACK_MENU } from "../services/khadysSyncService";

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

const KHADYS_RESTAURANT_ID = "resto-khadys-food";

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
            const localSpecial: DailySpecial = {
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
            };
            if (active) setSupabaseMenu(localSpecial);
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

        // Tentative 1 : Plat publié du jour pour Khady's Food ou restaurant principal
        let { data, error: queryError } = await supabase
          .from("daily_menus")
          .select("*")
          .eq("menu_date", today)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Tentative 2 : Dernier plat publié disponible
        if (!data && !queryError) {
          const latestRes = await supabase
            .from("daily_menus")
            .select("*")
            .eq("status", "published")
            .order("menu_date", { ascending: false })
            .limit(1)
            .maybeSingle();
          data = latestRes.data;
          queryError = latestRes.error;
        }

        if (queryError) {
          console.warn("Info menu du jour Supabase (repli automatique local):", queryError.message);
        }

        if (data && active) {
          const row = data as SupabaseDailyMenuRow & { photo_url?: string | null };
          const adaptedSpecial: DailySpecial = {
            id: row.id,
            title: row.title,
            restaurantName: "Khady's Food & Event",
            restaurantId: row.restaurant_id || KHADYS_RESTAURANT_ID,
            description:
              row.marketing_message ||
              row.description ||
              "Préparé avec soin ce matin chez Khady's Food & Event à Niamey.",
            price: row.price_xof,
            originalPrice: Math.round(row.price_xof * 1.25),
            image:
              row.image_url ||
              row.photo_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
            servingsLeft: 20,
            availableUntil: "15h00",
            accompaniedBy: row.description || "Pastels croustillants + Plat chaud + Jus local 33cl",
            tags: ["👑 Khady's Food", "🔥 Plat du Jour Officiel", "✨ Chef Recommande", "⚡ Service 11h-15h"],
          };
          setSupabaseMenu(adaptedSpecial);
        } else if (!data) {
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
