import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { DailySpecial } from "../types";

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

const RESTAURANT_ID = "a8168cb5-fe46-4368-85fa-be1a64d854b5";

export function useDailyMenu() {
  const [supabaseMenu, setSupabaseMenu] = useState<DailySpecial | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTodayMenu() {
      // If Supabase is not yet configured with valid credentials, gracefully fallback
      if (!isSupabaseConfigured()) {
        console.log("ℹ️ Supabase non configuré avec des clés réelles, affichage des suggestions locales.");
        if (active) setLoading(false);
        return;
      }

      try {
        // Today in YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        // First attempt: today's published menu for this restaurant
        let { data, error: queryError } = await supabase
          .from("daily_menus")
          .select("*")
          .eq("restaurant_id", RESTAURANT_ID)
          .eq("menu_date", today)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fallback: latest published menu for this restaurant if today hasn't been set yet
        if (!data && !queryError) {
          const latestRes = await supabase
            .from("daily_menus")
            .select("*")
            .eq("restaurant_id", RESTAURANT_ID)
            .eq("status", "published")
            .order("menu_date", { ascending: false })
            .limit(1)
            .maybeSingle();
          data = latestRes.data;
          queryError = latestRes.error;
        }

        if (queryError) {
          console.error("Erreur menu du jour Supabase:", queryError.message);
          if (active) setError(queryError.message);
        } else if (data && active) {
          console.log("Menu du jour reçu :", data);
          const row = data as SupabaseDailyMenuRow;
          const adaptedSpecial: DailySpecial = {
            id: row.id,
            title: row.title,
            restaurantName: "Allôresto Kitchen",
            restaurantId: row.restaurant_id || RESTAURANT_ID,
            description: row.marketing_message || row.description || "Préparé avec soin ce matin à Niamey.",
            price: row.price_xof,
            originalPrice: Math.round(row.price_xof * 1.25),
            image:
              row.image_url ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
            servingsLeft: 14,
            availableUntil: "15h00",
            accompaniedBy: row.description || "Poisson braisé + Alloco doré + Piment doux",
            tags: ["🔥 Plat du Jour", "✨ Chef Recommande", "⚡ Service 11h-15h"],
          };
          setSupabaseMenu(adaptedSpecial);
        } else if (active) {
          console.log("Menu du jour reçu : aucun plat publié trouvé pour aujourd'hui.");
        }
      } catch (err: any) {
        console.warn("useDailyMenu fetch error:", err?.message || err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTodayMenu();

    return () => {
      active = false;
    };
  }, []);

  return { supabaseMenu, loading, error };
}
