import { AppLanguage, MenuItem, Restaurant, DailySpecial, SauceBox } from "../types";

export interface TranslatedDishData {
  id: string;
  name: string;
  description: string;
  category?: string;
  source?: "gemini" | "dictionary" | "cached";
}

// Pre-compiled, authentic Sahelian culinary translations for Niger (Haoussa & Zarma)
// Ensures 100% instant availability even before the Gemini API network roundtrip finishes
export const PRECOMPILED_SAHELIAN_DISHES: Record<string, Record<"ha" | "zm" | "en", { name: string; description: string; category?: string }>> = {
  "kf-pd-1": {
    ha: {
      name: "Karin Kumallo na Khady's na Sahel",
      description: "Kwano mai dadi tare da albasa Galmi mai dadi da tattasai, fankasau Massa na gero mai dumi tare da zuma na daji, biredi da kofin Kafe Touba mai kamshi.",
      category: "🌅 Karin Kumallo",
    },
    zm: {
      name: "Khady's Susubay Ŋwaari Hanno",
      description: "Kwano kaano nda Galmi albasa nda tonkoli, Massa kaana daŋ yaare nda yu, burodu nda Kafe Touba kaano mai kamshi.",
      category: "🌅 Susubay Ŋwaari",
    },
    en: {
      name: "Khady's Full Sahelian Breakfast",
      description: "Soft farm egg omelet with sweet Galmi onions and peppers, warm golden millet Massa fritters with Sahel honey, crusty baguette and spiced Touba coffee.",
      category: "🌅 Breakfast",
    },
  },
  "kf-pd-2": {
    ha: {
      name: "Kunun Arawak na Gero da Nono mai Taushi",
      description: "Daddadan kunun gargajiya na geron Nijar da aka dafa da kayan kamshi da kirfa, tare da nono mai kauri da sukari.",
      category: "🌅 Karin Kumallo",
    },
    zm: {
      name: "Arawak Hawari nda Waccey Kaano",
      description: "Niamey arawak hawari kaano nda hayni hawari, kande nda waccey yaari ciinayaŋ nda sukur kaana.",
      category: "🌅 Susubay Ŋwaari",
    },
    en: {
      name: "Traditional Arawak Millet Porridge & Fresh Curd Milk",
      description: "Authentic Nigerien pearl millet porridge infused with cinnamon and sweet spices, served with rich local curd milk and raw cane sugar.",
      category: "🌅 Breakfast",
    },
  },
  "kf-pd-3": {
    ha: {
      name: "Massa na Gero da Zuma na Dajin Nijar (Guda 6)",
      description: "Fankasau na garin gero da shinkafa da aka soya a kaskon gargajiya, an zuba zuma mai dadi.",
      category: "🌅 Karin Kumallo",
    },
    zm: {
      name: "Massa Kaana nda Yu Hanno (Guda 6)",
      description: "Hayni nda mo Massa kaano kaŋ i tooni teeso ra, noondi nda yu hanno cimi dumi.",
      category: "🌅 Susubay Ŋwaari",
    },
    en: {
      name: "Golden Millet Massa Fritters with Pure Sahel Honey (6 pcs)",
      description: "Lightly fermented millet and rice pan-fried cakes, served piping hot and drizzled with wild forest honey.",
      category: "🌅 Breakfast",
    },
  },
  "kf-dej-1": {
    ha: {
      name: "Dambou Royal na Shinkafa da Kaza na Gida",
      description: "Shahararren abincin gargajiya na Nijar da shinkafa da ganyen zogale sabo, kaza da aka gasa sosai, mai mai kamshi da barkono Galmi.",
      category: "☀️ Abincin Rana",
    },
    zm: {
      name: "Dambou Royal Hanno nda Gorzo Ham",
      description: "Niamey dambou cimi dumi nda kopto hari sabo, gorzo ham tonte kaano, ji hanno nda tonkol.",
      category: "☀️ Zaari Ŋwaari",
    },
    en: {
      name: "Royal Dambou with Farm Chicken",
      description: "The pride of Niger: steamed rice & moringa Sahel couscous with tender roasted farm chicken, infused spicy oil and sweet Galmi relish.",
      category: "☀️ Lunch Specials",
    },
  },
  "kf-dej-2": {
    ha: {
      name: "Choukouya na Naman Rago mai Taushi da Kan-Kan",
      description: "Naman ragon Sahel da aka gasa a gawayi da yaji Kan-Kan na musamman, albasa Galmi da tumatir.",
      category: "☀️ Abincin Rana",
    },
    zm: {
      name: "Choukouya Feeji Ham Tonte nda Kan-Kan",
      description: "Sahel feeji ham tonte nda Kan-Kan hawari, Galmi albasa ciina nda tumatir.",
      category: "☀️ Zaari Ŋwaari",
    },
    en: {
      name: "Tender Sahelian Lamb Choukouya & Kan-Kan Spice",
      description: "Charcoal grilled tender mutton seasoned with authentic Kan-Kan dry rub, served with sweet sliced Galmi onions and spicy Sahel dip.",
      category: "☀️ Lunch Specials",
    },
  },
  "kf-dej-3": {
    ha: {
      name: "Kifin Capitaine daga Kogin Kwara da Alloco",
      description: "Kifin Capitaine sabo daga kogin Kwara da aka gasa a gawayi, tare da alloco mai dadi da miyar tumatir mai yaji.",
      category: "☀️ Abincin Rana",
    },
    zm: {
      name: "Capitaine Isa Hari Ham Tonte nda Alloco",
      description: "Isa hari ham tonte kaano, alloco kaana nda hawari pimenté cimi dumi.",
      category: "☀️ Zaari Ŋwaari",
    },
    en: {
      name: "Niger River Grilled Capitaine Fish & Fried Plantains",
      description: "Fresh Capitaine fish from the Niger river braised on charcoal embers, served with golden plantains and house spicy tomato salsa.",
      category: "☀️ Lunch Specials",
    },
  },
  "kf-din-1": {
    ha: {
      name: "Tchintchinga na Naman Sa mai Dadi (Tsire 5)",
      description: "Tsiren naman sa da aka gasa da kuli-kuli da yaji Kan-Kan na birnin Yamai, albasa da barkono.",
      category: "🌙 Abincin Dare",
    },
    zm: {
      name: "Tchintchinga Haw Ham Tonte (Tsire 5)",
      description: "Haw ham tonte kaano nda Kan-Kan nda kuli-kuli hawari, albasa nda tonkol.",
      category: "🌙 Cini Ŋwaari",
    },
    en: {
      name: "Tchintchinga Sahelian Beef Skewers (5 pcs)",
      description: "Authentic Nigerien beef skewers crusted in kuli-kuli peanut spice and Kan-Kan, flame grilled to tender perfection.",
      category: "🌙 Dinner",
    },
  },
  "kf-din-2": {
    ha: {
      name: "Shinkafa da Miyar Tumatir da Kifin Capitaine",
      description: "Daddadar shinkafar Sahel da aka dafa da miyar tumatir da kifi sabo da kayan lambu na kogin Niger.",
      category: "🌙 Abincin Dare",
    },
    zm: {
      name: "Mo Kaano nda Isa Hari Ham",
      description: "Mo kaano teeyante nda tumatir hawari, Isa hari ham nda albasa.",
      category: "🌙 Cini Ŋwaari",
    },
    en: {
      name: "Sahelian Jollof Rice & Capitaine Fish",
      description: "Fragrant seasoned red rice simmered in savory broth with golden Capitaine fish steaks and garden vegetables.",
      category: "🌙 Dinner",
    },
  },
};

// Storage key for client-side translation persistence
const TRANSLATION_CACHE_KEY = "alloresto_gemini_translations_v2";

class TranslationService {
  private cache: Map<string, TranslatedDishData> = new Map();
  private pendingRequests: Map<string, Promise<TranslatedDishData | null>> = new Map();
  private listeners: Set<() => void> = new Set();
  public isTranslating: boolean = false;
  public lastSource: "gemini" | "dictionary" | "cached" = "dictionary";

  constructor() {
    this.loadCacheFromStorage();
  }

  private getCacheKey(idOrText: string, targetLang: AppLanguage): string {
    return `${targetLang}_${idOrText.trim().toLowerCase()}`;
  }

  private loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem(TRANSLATION_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          Object.entries(parsed).forEach(([key, val]) => {
            this.cache.set(key, val as TranslatedDishData);
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load translation cache from localStorage:", e);
    }
  }

  private saveCacheToStorage() {
    try {
      const obj: Record<string, TranslatedDishData> = {};
      this.cache.forEach((val, key) => {
        obj[key] = val;
      });
      localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn("Failed to save translation cache to localStorage:", e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error("Error in translation listener:", err);
      }
    });
  }

  /**
   * Translates a single MenuItem synchronously using cache or precompiled dictionary,
   * while asynchronously querying the Gemini API if missing.
   */
  public translateDish(dish: MenuItem, targetLang: AppLanguage): MenuItem {
    if (targetLang === "fr") {
      return dish;
    }

    const cacheKey = this.getCacheKey(dish.id, targetLang);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return {
        ...dish,
        name: cached.name || dish.name,
        description: cached.description || dish.description,
        category: cached.category || dish.category,
      };
    }

    // Check precompiled dictionary
    if (PRECOMPILED_SAHELIAN_DISHES[dish.id] && PRECOMPILED_SAHELIAN_DISHES[dish.id][targetLang as "ha" | "zm" | "en"]) {
      const dictMatch = PRECOMPILED_SAHELIAN_DISHES[dish.id][targetLang as "ha" | "zm" | "en"];
      const translatedData: TranslatedDishData = {
        id: dish.id,
        name: dictMatch.name,
        description: dictMatch.description,
        category: dictMatch.category || dish.category,
        source: "dictionary",
      };
      this.cache.set(cacheKey, translatedData);
      return {
        ...dish,
        name: dictMatch.name,
        description: dictMatch.description,
        category: dictMatch.category || dish.category,
      };
    }

    // Queue for dynamic Gemini translation in background
    this.queueGeminiTranslation([dish], targetLang);

    // Return instant local fallback while Gemini responds
    const localFallback = this.generateLocalFallback(dish, targetLang);
    return localFallback;
  }

  /**
   * Translates a list of MenuItems synchronously with instant fallback & triggers batch Gemini API call
   */
  public translateDishes(dishes: MenuItem[], targetLang: AppLanguage): MenuItem[] {
    if (targetLang === "fr") return dishes;

    const uncachedDishes: MenuItem[] = [];
    const result = dishes.map((dish) => {
      const cacheKey = this.getCacheKey(dish.id, targetLang);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return {
          ...dish,
          name: cached.name,
          description: cached.description,
          category: cached.category || dish.category,
        };
      }

      if (PRECOMPILED_SAHELIAN_DISHES[dish.id] && PRECOMPILED_SAHELIAN_DISHES[dish.id][targetLang as "ha" | "zm" | "en"]) {
        const dictMatch = PRECOMPILED_SAHELIAN_DISHES[dish.id][targetLang as "ha" | "zm" | "en"];
        this.cache.set(cacheKey, {
          id: dish.id,
          name: dictMatch.name,
          description: dictMatch.description,
          category: dictMatch.category || dish.category,
          source: "dictionary",
        });
        return {
          ...dish,
          name: dictMatch.name,
          description: dictMatch.description,
          category: dictMatch.category || dish.category,
        };
      }

      uncachedDishes.push(dish);
      return this.generateLocalFallback(dish, targetLang);
    });

    if (uncachedDishes.length > 0) {
      this.queueGeminiTranslation(uncachedDishes, targetLang);
    }

    return result;
  }

  /**
   * Translates an entire restaurant object (tagline, cuisine, and menu)
   */
  public translateRestaurant(restaurant: Restaurant, targetLang: AppLanguage): Restaurant {
    if (targetLang === "fr") return restaurant;

    let translatedTagline = restaurant.tagline;
    let translatedCuisine = restaurant.cuisine;

    if (targetLang === "ha") {
      if (restaurant.tagline.includes("vitrine")) {
        translatedTagline = "Babban gidan abincin Niamey: Karin kumallo na safe, Choukouya na Kan-Kan, Dambou royal da abincin dare";
      } else {
        translatedTagline = `Babban gidan abinci a Yamai: ${restaurant.tagline}`;
      }
      translatedCuisine = restaurant.cuisine.replace("Gastronomie Sahélienne", "Kayan Abincin Sahel").replace("Braisés", "Gasasshen Nama");
    } else if (targetLang === "zm") {
      if (restaurant.tagline.includes("vitrine")) {
        translatedTagline = "Niamey ŋwaari teedo cimi dumi: Susubay ŋwaari, Choukouya nda Kan-Kan, Dambou hanno nda cini ŋwaari";
      } else {
        translatedTagline = `Niamey ŋwaari do: ${restaurant.tagline}`;
      }
      translatedCuisine = restaurant.cuisine.replace("Gastronomie Sahélienne", "Sahel Ŋwaari").replace("Braisés", "Ham Tonte");
    } else if (targetLang === "en") {
      translatedTagline = `Authentic Niamey Dining: ${restaurant.tagline}`;
      translatedCuisine = restaurant.cuisine.replace("Gastronomie Sahélienne", "Sahelian Gastronomy").replace("Braisés", "Charcoal Grills");
    }

    return {
      ...restaurant,
      tagline: translatedTagline,
      cuisine: translatedCuisine,
      menu: this.translateDishes(restaurant.menu, targetLang),
    };
  }

  /**
   * Translates a DailySpecial item
   */
  public translateDailySpecial(special: DailySpecial, targetLang: AppLanguage): DailySpecial {
    if (targetLang === "fr") return special;

    const cacheKey = this.getCacheKey(`special_${special.id}`, targetLang);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return {
        ...special,
        title: cached.name,
        description: cached.description,
      };
    }

    let translatedTitle = special.title;
    let translatedDesc = special.description;
    let accompanied = special.accompaniedBy;

    if (targetLang === "ha") {
      translatedTitle = `⭐ ${special.title} (Abincin Yau)`;
      translatedDesc = `Abincin yau na musamman da aka shirya tare da kwarewar kicin Allôresto. ${special.description}`;
      accompanied = `Tare da: ${special.accompaniedBy}`;
    } else if (targetLang === "zm") {
      translatedTitle = `⭐ ${special.title} (Hunkuna Ŋwaari)`;
      translatedDesc = `Hunkuna ŋwaari kaano kaŋ Allôresto kicin te nda baani. ${special.description}`;
      accompanied = `Kande nda: ${special.accompaniedBy}`;
    } else if (targetLang === "en") {
      translatedTitle = `⭐ ${special.title} (Today's Special)`;
      translatedDesc = `Today's chef specialty prepared fresh in Niamey: ${special.description}`;
      accompanied = `Served with: ${special.accompaniedBy}`;
    }

    return {
      ...special,
      title: translatedTitle,
      description: translatedDesc,
      accompaniedBy: accompanied,
    };
  }

  /**
   * Translates a SauceBox item
   */
  public translateSauceBox(box: SauceBox, targetLang: AppLanguage): SauceBox {
    if (targetLang === "fr") return box;

    let translatedName = box.name;
    let translatedDesc = box.description;

    if (targetLang === "ha") {
      translatedName = `🏺 ${box.name} (Miyar Sahel)`;
      translatedDesc = `Miya mai kamshi da aka hada da kayan yaji na gargajiya: ${box.description}`;
    } else if (targetLang === "zm") {
      translatedName = `🏺 ${box.name} (Hawari Hanno)`;
      translatedDesc = `Hawari kaano nda yaji hanno kaŋ ga kande dadi: ${box.description}`;
    } else if (targetLang === "en") {
      translatedName = `🏺 ${box.name} (Sahel Gourmet Sauce)`;
      translatedDesc = `Artisanal Sahel sauce made with authentic spices: ${box.description}`;
    }

    return {
      ...box,
      name: translatedName,
      description: translatedDesc,
    };
  }

  /**
   * Translates category labels
   */
  public translateCategoryName(categoryName: string, targetLang: AppLanguage): string {
    if (targetLang === "fr") return categoryName;

    const lower = categoryName.toLowerCase();
    if (targetLang === "ha") {
      if (lower.includes("petit") || lower.includes("déjeuner")) return "🌅 Karin Kumallo na Safe";
      if (lower.includes("déjeuner") || lower.includes("midi")) return "☀️ Abincin Rana";
      if (lower.includes("dîner")) return "🌙 Abincin Dare";
      if (lower.includes("menu") || lower.includes("plat du jour")) return "⭐ Abincin Yau na Musamman";
      if (lower.includes("choukouya") || lower.includes("grillade")) return "🔥 Choukouya & Gasasshen Nama";
      if (lower.includes("dambou") || lower.includes("africain") || lower.includes("terroir")) return "🍲 Dambou & Abincin Gargajiya";
      if (lower.includes("burger") || lower.includes("fast")) return "🍔 Burger & Abinci mai Sauri";
      if (lower.includes("boisson") || lower.includes("jus")) return "🍹 Abubuwan Sha & Bissap";
      if (lower.includes("dessert")) return "🍨 Kayan Zaki";
      return `${categoryName} (Haoussa)`;
    } else if (targetLang === "zm") {
      if (lower.includes("petit") || lower.includes("déjeuner")) return "🌅 Susubay Ŋwaari";
      if (lower.includes("déjeuner") || lower.includes("midi")) return "☀️ Zaari Ŋwaari";
      if (lower.includes("dîner")) return "🌙 Cini Ŋwaari";
      if (lower.includes("menu") || lower.includes("plat du jour")) return "⭐ Hunkuna Ŋwaari Hanno";
      if (lower.includes("choukouya") || lower.includes("grillade")) return "🔥 Choukouya & Ham Tonte";
      if (lower.includes("dambou") || lower.includes("africain") || lower.includes("terroir")) return "🍲 Dambou & Niamey Ŋwaari";
      if (lower.includes("burger") || lower.includes("fast")) return "🍔 Burger & Ŋwaari Sannu";
      if (lower.includes("boisson") || lower.includes("jus")) return "🍹 Hari Kaana & Bissap";
      if (lower.includes("dessert")) return "🍨 Ŋwaari Kaana";
      return `${categoryName} (Zarma)`;
    } else if (targetLang === "en") {
      if (lower.includes("petit")) return "🌅 Breakfast";
      if (lower.includes("déjeuner") || lower.includes("midi")) return "☀️ Lunch Specials";
      if (lower.includes("dîner")) return "🌙 Dinner";
      if (lower.includes("menu")) return "⭐ Daily Special Menu";
      if (lower.includes("choukouya") || lower.includes("grillade")) return "🔥 BBQ & Choukouya";
      if (lower.includes("dambou") || lower.includes("africain")) return "🍲 Dambou & Traditional Dishes";
      if (lower.includes("burger")) return "🍔 Burgers & Street Food";
      if (lower.includes("boisson") || lower.includes("jus")) return "🍹 Juices & Cold Drinks";
      if (lower.includes("dessert")) return "🍨 Desserts & Pastries";
    }

    return categoryName;
  }

  /**
   * Translates arbitrary text via Gemini API endpoint
   */
  public async translateCustomText(text: string, targetLang: AppLanguage): Promise<string> {
    if (!text || targetLang === "fr") return text;

    const cacheKey = this.getCacheKey(text, targetLang);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached.name;

    try {
      const res = await fetch("/api/translate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      if (data && data.translation) {
        this.cache.set(cacheKey, { id: "text", name: data.translation, description: data.translation, source: "gemini" });
        this.saveCacheToStorage();
        return data.translation;
      }
    } catch (err) {
      console.warn("Translation API call failed for text, returning fallback:", err);
    }

    return text;
  }

  /**
   * Batch sends dishes to Gemini /api/translate in background and updates cache
   */
  private async queueGeminiTranslation(dishes: MenuItem[], targetLang: AppLanguage) {
    if (dishes.length === 0 || targetLang === "fr") return;

    // Avoid duplicate requests
    const itemsToFetch = dishes.filter((d) => {
      const key = this.getCacheKey(d.id, targetLang);
      return !this.pendingRequests.has(key) && !this.cache.has(key);
    });

    if (itemsToFetch.length === 0) return;

    this.isTranslating = true;
    this.notify();

    try {
      const payload = itemsToFetch.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        category: d.category || "",
      }));

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload, targetLang }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          this.lastSource = data.source === "gemini" ? "gemini" : "dictionary";
          data.items.forEach((item: { id: string; name: string; description: string; category?: string }) => {
            const key = this.getCacheKey(item.id, targetLang);
            this.cache.set(key, {
              id: item.id,
              name: item.name,
              description: item.description,
              category: item.category,
              source: this.lastSource,
            });
          });
          this.saveCacheToStorage();
          this.notify();
        }
      }
    } catch (err) {
      console.warn("Background Gemini translation request failed:", err);
    } finally {
      this.isTranslating = false;
      this.notify();
    }
  }

  private generateLocalFallback(dish: MenuItem, targetLang: AppLanguage): MenuItem {
    const nameLower = (dish.name || "").toLowerCase();
    const descLower = (dish.description || "").toLowerCase();

    let name = dish.name;
    let description = dish.description;
    let category = dish.category;

    if (targetLang === "ha") {
      if (nameLower.includes("choukouya") || nameLower.includes("mouton") || nameLower.includes("grillade")) {
        name = `🥩 ${dish.name} (Gasasshen Naman Rago)`;
        description = `Daddadan naman rago na Sahel da aka gasa a gawayi da yaji Kan-Kan. ${dish.description}`;
      } else if (nameLower.includes("dambou")) {
        name = `🍚 ${dish.name} (Dambou na Gargajiya)`;
        description = `Abincin gargajiya na Nijar da shinkafa da ganyen zogale sabo da kaji mai dadi. ${dish.description}`;
      } else if (nameLower.includes("capitaine") || nameLower.includes("poisson")) {
        name = `🐟 ${dish.name} (Kifin Kogin Kwara)`;
        description = `Kifi sabo daga kogin Kwara (Niger) da aka gasa da alloco da miya. ${dish.description}`;
      } else if (nameLower.includes("massa") || nameLower.includes("bouillie") || nameLower.includes("petit déjeuner")) {
        name = `🌅 ${dish.name} (Karin Kumallo)`;
        description = `Karin kumallo na safe mai dumi da dadi na birnin Yamai. ${dish.description}`;
      } else if (nameLower.includes("burger") || nameLower.includes("pizza") || nameLower.includes("chawarma")) {
        name = `🍔 ${dish.name} (Abinci mai Sauri)`;
        description = `An shirya da naman Sahel sabo da cuku mai dadi. ${dish.description}`;
      } else if (nameLower.includes("bissap") || nameLower.includes("jus") || nameLower.includes("boisson")) {
        name = `🍹 ${dish.name} (Ruwan Lemo mai Sanyi)`;
        description = `Abin sha na gargajiya mai sanyi da dadi. ${dish.description}`;
      }
    } else if (targetLang === "zm") {
      if (nameLower.includes("choukouya") || nameLower.includes("mouton") || nameLower.includes("grillade")) {
        name = `🥩 ${dish.name} (Ham Tonte Kaano)`;
        description = `Feeji ham tonte hanno kaano nda Kan-Kan hawari nda albasa. ${dish.description}`;
      } else if (nameLower.includes("dambou")) {
        name = `🍚 ${dish.name} (Dambou Hanno)`;
        description = `Niamey dambou cimi dumi nda kopto hari sabo nda gorzo ham. ${dish.description}`;
      } else if (nameLower.includes("capitaine") || nameLower.includes("poisson")) {
        name = `🐟 ${dish.name} (Isa Hari Ham)`;
        description = `Isa hari ham tonte kaano nda alloco wala attieke kaana. ${dish.description}`;
      } else if (nameLower.includes("massa") || nameLower.includes("bouillie") || nameLower.includes("petit déjeuner")) {
        name = `🌅 ${dish.name} (Susubay Ŋwaari)`;
        description = `Susubay ŋwaari kaano nda arawak nda yu kaana. ${dish.description}`;
      } else if (nameLower.includes("burger") || nameLower.includes("pizza") || nameLower.includes("chawarma")) {
        name = `🍔 ${dish.name} (Ŋwaari Sannu)`;
        description = `Sahel ham kaano nda fromage nda fritte hanno. ${dish.description}`;
      } else if (nameLower.includes("bissap") || nameLower.includes("jus") || nameLower.includes("boisson")) {
        name = `🍹 ${dish.name} (Hari Kaana nda Bissap)`;
        description = `Niamey hari kaano yaabey se kande nda bissap sabo. ${dish.description}`;
      }
    } else if (targetLang === "en") {
      name = dish.name
        .replace(/Petit Déjeuner/gi, "Breakfast")
        .replace(/Déjeuner/gi, "Lunch")
        .replace(/Dîner/gi, "Dinner")
        .replace(/Grillades/gi, "Grilled BBQ")
        .replace(/Poisson/gi, "Fresh Fish");
      description = `Authentic Niamey specialty: ${dish.description}`;
    }

    category = this.translateCategoryName(dish.category || "", targetLang);

    return {
      ...dish,
      name,
      description,
      category,
    };
  }
}

export const translationService = new TranslationService();
