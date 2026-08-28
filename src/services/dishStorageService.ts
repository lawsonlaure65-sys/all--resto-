import { Restaurant, MenuItem } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";
import {
  saveDishToSupabase,
  deleteDishFromSupabase,
  fetchRestaurantsFromSupabase,
} from "./supabaseDishService";
import { getSupabaseConfig } from "./supabaseClient";

const STORAGE_KEY_RESTAURANTS = "alloresto_restaurants_v2";
const STORAGE_KEY_CUSTOM_DISHES = "alloresto_custom_dishes_v2";
const STORAGE_KEY_LAST_BACKUP = "alloresto_last_backup_timestamp";

// Helper for image compression to keep localStorage light & fast
export async function compressImageBase64(
  file: File,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Load restaurants from LocalStorage or initialize with default RESTAURANTS_DATA
export function loadStoredRestaurants(): Restaurant[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RESTAURANTS);
    if (!stored) {
      // First time: save default
      saveStoredRestaurants(RESTAURANTS_DATA);
      return RESTAURANTS_DATA;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Error loading restaurants from localStorage, falling back to defaults:", err);
  }
  return RESTAURANTS_DATA;
}

// Synchronize from Supabase in background
export async function syncFromSupabaseIfAvailable(
  onLoaded?: (restaurants: Restaurant[]) => void
): Promise<Restaurant[] | null> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  try {
    const res = await fetchRestaurantsFromSupabase();
    if (res.success && res.data && res.data.length > 0) {
      saveStoredRestaurants(res.data);
      if (onLoaded) onLoaded(res.data);
      return res.data;
    }
  } catch (e) {
    console.warn("Supabase load fallback:", e);
  }
  return null;
}

// Save entire restaurants list to LocalStorage
export function saveStoredRestaurants(restaurants: Restaurant[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(restaurants));
    localStorage.setItem(STORAGE_KEY_LAST_BACKUP, new Date().toISOString());
    return true;
  } catch (err) {
    console.error("Error saving restaurants to localStorage:", err);
    return false;
  }
}

// Add or update a dish (supports either (restaurants, dish, targetRestaurantId) or (dish, targetRestaurantId))
export function addOrUpdateDishInStorage(
  restaurantsOrDish: Restaurant[] | MenuItem,
  dishOrTargetId?: MenuItem | string,
  targetRestaurantId?: string
): Restaurant[] {
  let restaurants: Restaurant[];
  let dish: MenuItem;
  let targetId: string | undefined;

  if (Array.isArray(restaurantsOrDish)) {
    restaurants = restaurantsOrDish;
    dish = dishOrTargetId as MenuItem;
    targetId = targetRestaurantId;
  } else {
    restaurants = loadStoredRestaurants();
    dish = restaurantsOrDish as MenuItem;
    targetId = typeof dishOrTargetId === "string" ? dishOrTargetId : undefined;
  }

  const defaultRestoId = targetId || restaurants[0]?.id || "resto-khadys-food";

  // Cloud sync to Supabase (non-blocking)
  try {
    saveDishToSupabase(dish, defaultRestoId).catch((e) => {
      console.warn("Supabase background save:", e);
    });
  } catch (e) {
    // Non-blocking
  }

  // Check if dish already exists in any restaurant
  let updated = false;
  const updatedRestaurants = restaurants.map((resto) => {
    const existingIndex = resto.menu.findIndex((d) => d.id === dish.id);
    if (existingIndex >= 0) {
      updated = true;
      const newMenu = [...resto.menu];
      newMenu[existingIndex] = dish;
      return { ...resto, menu: newMenu };
    }
    return resto;
  });

  if (updated) {
    saveStoredRestaurants(updatedRestaurants);
    return updatedRestaurants;
  }

  // Otherwise add to target restaurant
  const finalRestaurants = restaurants.map((resto) => {
    if (resto.id === defaultRestoId) {
      return {
        ...resto,
        menu: [dish, ...resto.menu],
      };
    }
    return resto;
  });

  saveStoredRestaurants(finalRestaurants);
  return finalRestaurants;
}

// Delete a dish from storage (supports either (restaurants, dishId) or (dishId))
export function deleteDishFromStorage(
  restaurantsOrDishId: Restaurant[] | string,
  dishIdOrNothing?: string
): Restaurant[] {
  let restaurants: Restaurant[];
  let dishId: string;

  if (Array.isArray(restaurantsOrDishId)) {
    restaurants = restaurantsOrDishId;
    dishId = dishIdOrNothing!;
  } else {
    restaurants = loadStoredRestaurants();
    dishId = restaurantsOrDishId as string;
  }

  // Cloud delete from Supabase (non-blocking)
  try {
    deleteDishFromSupabase(dishId).catch((e) => {
      console.warn("Supabase background delete:", e);
    });
  } catch (e) {
    // Non-blocking
  }

  const updatedRestaurants = restaurants.map((resto) => ({
    ...resto,
    menu: resto.menu.filter((d) => d.id !== dishId),
  }));

  saveStoredRestaurants(updatedRestaurants);
  return updatedRestaurants;
}


// Export backup JSON (supports with or without arguments)
export function exportAllDataBackup(restaurantsParam?: Restaurant[]): void {
  const restaurants = restaurantsParam || loadStoredRestaurants();
  const backupData = {
    appName: "Allôresto Niger",
    version: "2.0",
    exportDate: new Date().toISOString(),
    totalRestaurants: restaurants.length,
    totalDishes: restaurants.reduce((sum, r) => sum + r.menu.length, 0),
    restaurants,
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute(
    "download",
    `alloresto_backup_plats_niamey_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import backup JSON
export function importDataBackup(jsonString: string): { success: boolean; data?: Restaurant[]; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let restaurantsToLoad: Restaurant[] = [];

    if (Array.isArray(parsed)) {
      restaurantsToLoad = parsed;
    } else if (parsed && Array.isArray(parsed.restaurants)) {
      restaurantsToLoad = parsed.restaurants;
    } else {
      return { success: false, message: "Format de fichier JSON non reconnu." };
    }

    if (restaurantsToLoad.length === 0) {
      return { success: false, message: "Le fichier ne contient aucun restaurant ou plat valide." };
    }

    saveStoredRestaurants(restaurantsToLoad);
    return {
      success: true,
      data: restaurantsToLoad,
      message: `Restauration réussie ! ${restaurantsToLoad.length} restaurants et leurs plats sont restaurés.`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Erreur lors de la lecture du fichier : ${(err as Error).message}`,
    };
  }
}

// Get storage metrics
export function getStorageStats(restaurants: Restaurant[]) {
  const totalDishes = restaurants.reduce((sum, r) => sum + r.menu.length, 0);
  const rawSize = (localStorage.getItem(STORAGE_KEY_RESTAURANTS) || "").length;
  const sizeKb = (rawSize / 1024).toFixed(1);
  const lastBackup = localStorage.getItem(STORAGE_KEY_LAST_BACKUP) || new Date().toISOString();

  return {
    totalRestaurants: restaurants.length,
    totalDishes,
    sizeKb,
    lastBackup,
  };
}

// Reset to factory defaults
export function resetToFactoryDefaultRestaurants(): Restaurant[] {
  localStorage.removeItem(STORAGE_KEY_RESTAURANTS);
  saveStoredRestaurants(RESTAURANTS_DATA);
  return RESTAURANTS_DATA;
}

export const resetStoredData = resetToFactoryDefaultRestaurants;
