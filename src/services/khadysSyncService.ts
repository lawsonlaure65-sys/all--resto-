import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { resolveDishImageUrl, KHADYS_OFFICIAL_SUYA_IMAGE } from "../utils/dishImageResolver";

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
  title: "Menu du Jour — Brochettes de Filet de Bœuf (Suya)",
  tagline: "Le Plat du Jour officiel programmé chez Khady's Food",
  mainDish: {
    dishName: "Brochettes de Filet de Bœuf (Suya)",
    priceFcfa: 4000,
    originalPrice: 4500,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80",
    description:
      "Tendres tranches de filet de bœuf marinées à l'huile d'arachide et aux épices Kankankan (piment rouge, gingembre, arachide torréfiée), grillées au feu de bois.",
    accompaniments: "Alloco doré croustillant, piment vert maison et oignons doux marinés",
    availablePortions: 25,
    badgeLabel: "🍢 Plat Cuisiné du Jour",
    type: "PLAT_DU_JOUR",
  },
  trio: [
    {
      id: "dish-plat-du-jour",
      type: "PLAT_DU_JOUR",
      dishName: "Brochettes de Filet de Bœuf (Suya)",
      badgeLabel: "🍢 Plat Cuisiné du Jour",
      badgeColor: "bg-brand-orange text-white",
      tagline: "Tendres tranches grillées au feu de bois aux épices Kankankan",
      description:
        "Tendres tranches de filet de bœuf marinées à l'huile d'arachide et aux épices Kankankan (piment rouge, gingembre, arachide torréfiée), grillées au feu de bois.",
      accompaniments: "Alloco doré croustillant, piment vert maison et oignons doux marinés",
      price: 4500,
      promoPrice: 4000,
      dishImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80",
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
  try {
    const res = await fetch("/api/khadys-food/daily-menu");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.mainDish) {
        // Bloquer tout retour accidentel d'un ancien Tiep ou d'une spécialité permanente
        if (isPermanentDishName(data.mainDish.dishName) || isObsoleteDishName(data.mainDish.dishName)) {
          console.warn("Plat reçu obsolète ou permanent, repli sur le plat actif officiel :", data.mainDish.dishName);
          return KHADYS_FALLBACK_MENU;
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Échec récupération live Khady's Food, utilisation fallback officiel:", err);
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
      await (supabase.from("daily_menus") as any).upsert({
        restaurant_id: "resto-khadys-food",
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
