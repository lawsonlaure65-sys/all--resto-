import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  resolveDishImageUrl,
  KHADYS_OFFICIAL_SUYA_IMAGE,
  KHADYS_OFFICIAL_SPAGHETTI_MERGUEZ_IMAGE,
} from "../utils/dishImageResolver";
import {
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_IMAGE,
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
  KHADYS_OFFICIAL_TODAY_DISH_NAME,
  KHADYS_OFFICIAL_TODAY_PRICE,
  KHADYS_OFFICIAL_TODAY_DESC,
  KHADYS_OFFICIAL_TODAY_ACCOMP,
} from "../data/khadysPlatDuJourImage";
import {
  findKhadysRestaurantInSupabase,
  KHADYS_OFFICIAL_NAME,
  KHADYS_STABLE_LOCAL_ID,
} from "./khadysPartnerResolver";

export interface KhadysDishItem {
  id: string;
  type: string;
  dishName: string;
  badgeLabel: string;
  badgeColor: string;
  tagline: string;
  description: string;
  accompaniments: string;
  price: number;
  promoPrice?: number;
  dishImage: string;
  remainingStock: number;
}

export interface KhadysDailyMenuResponse {
  success: boolean;
  source: string;
  restaurantName: string;
  restaurantId: string;
  title: string;
  tagline: string;
  mainDish: {
    dishName: string;
    priceFcfa: number;
    originalPrice: number;
    imageUrl: string;
    description: string;
    accompaniments: string;
    availablePortions: number;
    badgeLabel: string;
    type: string;
  };
  trio: KhadysDishItem[];
  lastSyncAt: string;
}

export const KHADYS_FALLBACK_MENU: KhadysDailyMenuResponse = {
  success: true,
  source: "https://khadysfood.vercel.app",
  restaurantName: "Khady's Food & Event",
  restaurantId: "resto-khadys-food",
  title: "Menu du Jour — Sauce crin-crin (fakou frais/Ademe)",
  tagline: "Le Plat du Jour officiel programmé chez Khady's Food & Event",
  mainDish: {
    dishName: KHADYS_OFFICIAL_TODAY_DISH_NAME,
    priceFcfa: KHADYS_OFFICIAL_TODAY_PRICE,
    originalPrice: 4000,
    imageUrl: KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
    description: KHADYS_OFFICIAL_TODAY_DESC,
    accompaniments: KHADYS_OFFICIAL_TODAY_ACCOMP,
    availablePortions: 25,
    badgeLabel: "🍲 Plat Cuisiné du Jour",
    type: "PLAT_DU_JOUR",
  },
  trio: [
    {
      id: "dish-sauce-crincrin",
      type: "PLAT_DU_JOUR",
      dishName: KHADYS_OFFICIAL_TODAY_DISH_NAME,
      badgeLabel: "🍲 Plat Cuisiné du Jour",
      badgeColor: "bg-brand-orange text-white",
      tagline: "Spécialité maison mijotée ce vendredi par Cheffe Khady",
      description: KHADYS_OFFICIAL_TODAY_DESC,
      accompaniments: KHADYS_OFFICIAL_TODAY_ACCOMP,
      price: 4000,
      promoPrice: KHADYS_OFFICIAL_TODAY_PRICE,
      dishImage: KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
      remainingStock: 25,
    },
    {
      id: "dish-doukounou",
      type: "DOUKOUNOU",
      dishName: "Le Fameux Doukounou de Khady",
      badgeLabel: "🌽 Incontournable Doukounou",
      badgeColor: "bg-amber-600 text-white",
      tagline: "Spécialité maison au programme chaque jour d'office",
      description:
        "Le célèbre gâteau de maïs vapeur traditionnel au Sahel, cuit à point, tendre et moelleux, servi chaud avec sa sauce mijotée de la maison, piment vert doux et poisson frit ou poulet braisé.",
      accompaniments: "Sauce tomate mijotée + Piment vert de la Cheffe + Poisson frit",
      price: 3000,
      promoPrice: 2700,
      dishImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000",
      remainingStock: 30,
    },
    {
      id: "dish-attieke",
      type: "ATTIEKE",
      dishName: "L'Incontournable Attiéké Royal",
      badgeLabel: "🐟 Incontournable Attiéké",
      badgeColor: "bg-emerald-600 text-white",
      tagline: "Spécialité maison au programme chaque jour d'office",
      description:
        "La semoule de manioc attiéké fraîche et aérée de Cheffe Khady, servie avec darne de poisson capitaine braisée ou poulet croustillant, oignons doux marinés, tomates et piment vert maison.",
      accompaniments: "Poisson capitaine braisé au feu de bois + Alloco doré + Oignons marinés",
      price: 4500,
      promoPrice: 4000,
      dishImage: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000",
      remainingStock: 30,
    },
  ],
  lastSyncAt: new Date().toISOString(),
};

const PERMANENT_DISHES = [
  "attieke caviar",
  "attieke",
  "doukounou caviar",
];

const OBSOLETE_DISHES = [
  "tiep rouge",
  "tiep",
  "thieboudienne",
];

export const isPermanentDishName = (name?: string) => {
  const normalized = (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return PERMANENT_DISHES.some((dish) => normalized.includes(dish));
};

export const isObsoleteDishName = (name?: string) => {
  const normalized = (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return OBSOLETE_DISHES.some((dish) => normalized.includes(dish));
};

/**
 * Purge uniquement le cache et les clés de synchronisation du plat du jour Khady's Food.
 * Préserve intégralement le panier client, les commandes et les préférences.
 */
export function purgeKhadysDailyMenuCache(): { purgedKeys: string[]; preservedKeys: string[] } {
  const keysToPurge = [
    "alloresto_active_daily_special",
    "alloresto_khadys_trio",
    "khadys_daily_menu",
    "khadys_programmed_menu",
    "khadys_sync_cache",
    "alloresto_khadys_cache",
    "alloresto_daily_special_cache",
    "alloresto_cached_dish_images",
    "alloresto_daily_special_image",
    "alloresto_daily_menu_image",
  ];

  const purgedKeys: string[] = [];
  try {
    for (const key of keysToPurge) {
      if (typeof window !== "undefined" && window.localStorage && localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        purgedKeys.push(key);
      }
    }
  } catch (e) {
    console.warn("Erreur purge cache Khady's Food:", e);
  }

  return {
    purgedKeys,
    preservedKeys: ["alloresto_cart", "alloresto_orders", "alloresto_user_lang", "alloresto_theme"],
  };
}

/**
 * Récupère le plat / trio du jour programmé chez Khady's Food
 */
export async function fetchKhadysProgrammedDailyMenu(): Promise<KhadysDailyMenuResponse> {
  // 1. Tenter la route backend locale Allôresto
  try {
    const res = await fetch("/api/khadys-food/daily-menu");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.mainDish) {
        if (!isPermanentDishName(data.mainDish.dishName) && !isObsoleteDishName(data.mainDish.dishName)) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn("Échec récupération via API locale, tentative base Khady live:", err);
  }

  // 2. Interrogation directe de la base de données live de Khady's Food (https://veygphkhehdnxefnnlwo.supabase.co)
  try {
    const khadyUrl = "https://veygphkhehdnxefnnlwo.supabase.co";
    const khadyKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZleWdwaGtoZWhkbnhlZm5ubHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTE0MjgsImV4cCI6MjEwMTA4NzQyOH0.FsSg9wjrvVZ1zNHZH_D7qVxPd3EC1h1yM1mDMvxfAqw";

    // 2.a Interroger en priorité la catégorie 'Plat du Jour' sur la base officielle
    let items: any[] = [];
    try {
      const r = await fetch(
        `${khadyUrl}/rest/v1/menu_items?category=eq.Plat%20du%20Jour&select=*`,
        {
          headers: { apikey: khadyKey, Authorization: `Bearer ${khadyKey}` },
        }
      );
      if (r.ok) {
        items = await r.json();
      }
    } catch (_) {}

    // 2.b Si non trouvé, interroger par l'ID officiel du plat du jour
    if (!items || items.length === 0) {
      try {
        const r2 = await fetch(
          `${khadyUrl}/rest/v1/menu_items?id=eq.item-1790412092632&select=*`,
          {
            headers: { apikey: khadyKey, Authorization: `Bearer ${khadyKey}` },
          }
        );
        if (r2.ok) {
          items = await r2.json();
        }
      } catch (_) {}
    }

    if (items && items.length > 0 && items[0]) {
      const item = items[0];
      const dishTitle = item.name ? item.name.trim() : KHADYS_OFFICIAL_TODAY_DISH_NAME;
      const dishPrice = Number(item.price || KHADYS_OFFICIAL_TODAY_PRICE);
      const dishDesc = item.description || KHADYS_OFFICIAL_TODAY_DESC;
      const dishImg = item.image || KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE;
      const dishAccomp =
        item.accompaniments ||
        (dishTitle.toLowerCase().includes("crin")
          ? "Pâte blanche de maïs ou pâte noire d'igname (cossette)"
          : KHADYS_OFFICIAL_TODAY_ACCOMP);

      return {
        ...KHADYS_FALLBACK_MENU,
        title: `Menu du Jour — ${dishTitle}`,
        mainDish: {
          dishName: dishTitle,
          priceFcfa: dishPrice,
          originalPrice: Math.round(dishPrice * 1.15),
          imageUrl: dishImg,
          description: dishDesc,
          accompaniments: dishAccomp,
          availablePortions: 25,
          badgeLabel: "🍲 Plat Cuisiné du Jour",
          type: "PLAT_DU_JOUR",
        },
        trio: [
          {
            id: `dish-${item.id || "plat-du-jour"}`,
            type: "PLAT_DU_JOUR",
            dishName: dishTitle,
            badgeLabel: "🍲 Plat Cuisiné du Jour",
            badgeColor: "bg-brand-orange text-white",
            tagline: "Spécialité maison au programme officiel ce vendredi chez Cheffe Khady",
            description: dishDesc,
            accompaniments: dishAccomp,
            price: Math.round(dishPrice * 1.15),
            promoPrice: dishPrice,
            dishImage: dishImg,
            remainingStock: 25,
          },
          KHADYS_FALLBACK_MENU.trio[1],
          KHADYS_FALLBACK_MENU.trio[2],
        ],
      };
    }
  } catch (directErr) {
    console.warn("Échec requête directe Supabase Khady:", directErr);
  }

  return KHADYS_FALLBACK_MENU;
}

/**
 * Applique le plat du jour programmé de Khady's Food dans l'application Allôresto Niamey
 */
export async function applyKhadysProgrammedMenuToApp(
  data: KhadysDailyMenuResponse = KHADYS_FALLBACK_MENU
): Promise<{ success: boolean; plan: any }> {
  if (!data?.mainDish || isPermanentDishName(data.mainDish.dishName) || isObsoleteDishName(data.mainDish.dishName)) {
    console.warn("Plat du jour rejeté : plat permanent, obsolète ou inexistant.");
    return { success: false, plan: null };
  }
  const main = data.mainDish;
  const todayStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const plan = {
    id: `khadys-live-${Date.now()}`,
    targetDate: new Date().toISOString().split("T")[0],
    targetDateLabel: todayStr,
    restaurantId: "resto-khadys-food",
    restaurantName: "Khady's Food & Event",
    dishName: main.dishName,
    priceFcfa: main.priceFcfa,
    starter: main.accompaniments || "Alloco doré croustillant + Piment vert de la Cheffe",
    mainCourse: main.description,
    drinkOrDessert: "Jus de Bissap frais 33cl 100% naturel offert",
    availablePortions: main.availablePortions,
    chefNote: `Spécialité programmée d'office chez Khady's Food & Event. Préparée au feu doux ce matin à Niamey.`,
    imageUrl: resolveDishImageUrl(main) || KHADYS_OFFICIAL_SUYA_IMAGE,
    marketingMessage: `Le Plat du Jour de chez Khady's Food (${main.dishName}) est prêt à être livré à votre bureau ou à domicile par Billo Express !`,
    syncedFromKhadysFood: true,
    trio: data.trio,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem("alloresto_active_daily_special", JSON.stringify(plan));
    localStorage.setItem("alloresto_khadys_trio", JSON.stringify(data.trio));
    window.dispatchEvent(new CustomEvent("alloresto_daily_special_updated", { detail: plan }));
  } catch (storageErr) {
    console.warn("Erreur localStorage sync:", storageErr);
  }

  // Si Supabase est configuré, synchroniser également dans la table daily_menus
  if (isSupabaseConfigured()) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const lookup = await findKhadysRestaurantInSupabase();
      const realRestoId = lookup.found && lookup.id ? lookup.id : KHADYS_STABLE_LOCAL_ID;

      await (supabase.from("daily_menus") as any).upsert({
        restaurant_id: realRestoId,
        menu_date: today,
        title: main.dishName,
        description: `${main.description}. Accompagnements : ${main.accompaniments}`,
        price_xof: main.priceFcfa,
        image_url: main.imageUrl,
        photo_url: main.imageUrl,
        marketing_message: plan.marketingMessage,
        status: "published",
        is_ai_suggested: false,
        published_at: new Date().toISOString(),
      });
    } catch (sbErr) {
      console.warn("Supabase upsert warning:", sbErr);
    }
  }

  return { success: true, plan };
}
