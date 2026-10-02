import { getSupabaseClient } from "./supabaseClient";
import { Restaurant } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";

/**
 * Identifiants et constantes officielles et stables pour Khady's Food & Event
 */
export const KHADYS_OFFICIAL_SLUG = "khadys-food-event";
export const KHADYS_FALLBACK_SLUG = "khadys-food";
export const KHADYS_OFFICIAL_NAME = "Khady's Food & Event";
export const KHADYS_STABLE_LOCAL_ID = "resto-khadys-food";

/**
 * Identifiant et signatures stricts d'Allôresto Kitchen à exclure formellement
 * pour toute importation de Khady's Food & Event.
 */
export const ALLORESTO_KITCHEN_UUID = "a8168cb5-fe46-4368-85fa-be1a64d854b5";
export const ALLORESTO_KITCHEN_LOCAL_ID = "resto-alloresto-kitchen";

/**
 * Vérifie si un identifiant ou nom correspond à la cuisine centrale Allôresto Kitchen
 */
export function isAllorestoKitchen(id?: string | null, name?: string | null): boolean {
  if (!id && !name) return false;
  if (id === ALLORESTO_KITCHEN_UUID || id === ALLORESTO_KITCHEN_LOCAL_ID) return true;
  if (name) {
    const norm = name.trim().toLowerCase();
    if (norm.includes("allôresto kitchen") || norm.includes("alloresto kitchen") || norm === "kitchen") {
      return true;
    }
  }
  return false;
}

/**
 * Vérifie si une entité restaurant correspond strictement à Khady's Food & Event
 */
export function isKhadysFoodRestaurant(resto?: {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
}): boolean {
  if (!resto) return false;
  const id = resto.id || "";
  const name = (resto.name || "").trim().toLowerCase();
  const slug = (resto.slug || "").trim().toLowerCase();

  // Exclusion absolue d'Allôresto Kitchen
  if (isAllorestoKitchen(id, name)) return false;

  // Correspondance par slug officiel stable
  if (slug === KHADYS_OFFICIAL_SLUG || slug === KHADYS_FALLBACK_SLUG) return true;

  // Correspondance par ID stable
  if (id === KHADYS_STABLE_LOCAL_ID) return true;

  // Correspondance par nom officiel (apostrophes droites ou courbes)
  if (
    name === "khady's food & event" ||
    name === "khady’s food & event" ||
    name === "khadys food & event" ||
    name === "khady's food" ||
    name === "khady’s food"
  ) {
    return true;
  }

  // Correspondance si contient "khady" sans "kitchen"
  if (name.includes("khady") && !name.includes("kitchen")) {
    return true;
  }

  return false;
}

export interface SupabaseKhadyLookupResult {
  found: boolean;
  id?: string;
  name?: string;
  slug?: string;
  error?: string;
}

/**
 * Recherche stricte et stable du restaurant partenaire officiel Khady's Food & Event dans Supabase.
 * Règle 2 : Utilise l’identifiant réel de « Khady’s Food & Event » dans la base Supabase.
 * Règle 3 : Ne devine pas l’identifiant : cherche le restaurant par son slug ou son nom exact.
 * Règle 4 : Le slug ou l’identifiant doit être stable et propre à Khady’s Food.
 * Règle 8 : Si Khady’s Food & Event n’existe pas dans la liste Supabase, affiche une erreur claire et empêche l’import.
 */
export async function findKhadysRestaurantInSupabase(): Promise<SupabaseKhadyLookupResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      found: false,
      error: "Supabase n'est pas configuré. Impossible d'interroger la base distante.",
    };
  }

  try {
    // 1. Recherche prioritaire par slug exact ("khadys-food-event" ou "khadys-food")
    const { data: slugData, error: slugError } = await client
      .from("restaurants")
      .select("id, name, slug")
      .or(`slug.eq.${KHADYS_OFFICIAL_SLUG},slug.eq.${KHADYS_FALLBACK_SLUG}`)
      .limit(5);

    if (!slugError && slugData && slugData.length > 0) {
      const match = slugData.find((r: any) => isKhadysFoodRestaurant(r));
      if (match) {
        return {
          found: true,
          id: match.id,
          name: match.name || KHADYS_OFFICIAL_NAME,
          slug: match.slug || KHADYS_OFFICIAL_SLUG,
        };
      }
    }

    // 2. Recherche prioritaire par nom exact ou partiel contenant "Khady"
    const { data: nameData, error: nameError } = await client
      .from("restaurants")
      .select("id, name, slug")
      .ilike("name", "%khady%")
      .limit(5);

    if (!nameError && nameData && nameData.length > 0) {
      const match = nameData.find((r: any) => isKhadysFoodRestaurant(r));
      if (match) {
        return {
          found: true,
          id: match.id,
          name: match.name || KHADYS_OFFICIAL_NAME,
          slug: match.slug || KHADYS_OFFICIAL_SLUG,
        };
      }
    }

    // 3. Recherche générale dans tous les restaurants pour exhaustivité
    const { data, error } = await client
      .from("restaurants")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) {
      return {
        found: false,
        error: `Erreur lors de la lecture des restaurants Supabase : ${error.message}`,
      };
    }

    if (!data || data.length === 0) {
      return {
        found: false,
        error: "Aucun restaurant n'a été trouvé dans la base Supabase.",
      };
    }

    // Recherche stricte par fonction de validation
    const match = data.find((r: any) => isKhadysFoodRestaurant(r));

    if (match) {
      return {
        found: true,
        id: match.id,
        name: match.name || KHADYS_OFFICIAL_NAME,
        slug: match.slug || KHADYS_OFFICIAL_SLUG,
      };
    }

    // Le restaurant Khady's Food & Event n'existe pas dans la table restaurants de Supabase
    return {
      found: false,
      error:
        "Le restaurant partenaire officiel « Khady's Food & Event » (slug: khadys-food-event) n'existe pas dans la table 'restaurants' de Supabase (seul « Allôresto Kitchen » est présent). L'importation est bloquée pour éviter d'associer le plat au mauvais restaurant.",
    };
  } catch (err: any) {
    return {
      found: false,
      error: `Exception Supabase : ${err?.message || String(err)}`,
    };
  }
}

/**
 * Résout le restaurant Khady's Food & Event parmi la liste locale ou le match Supabase
 */
export function resolveKhadysRestaurant(
  restaurantsList: Restaurant[] = [],
  supabaseMatch?: SupabaseKhadyLookupResult | null
): Restaurant {
  // 1. Si Supabase a renvoyé un match officiel
  if (supabaseMatch && supabaseMatch.found && supabaseMatch.id) {
    const localMatch = restaurantsList.find((r) => r.id === supabaseMatch.id);
    if (localMatch) {
      return {
        ...localMatch,
        id: supabaseMatch.id,
        name: KHADYS_OFFICIAL_NAME,
        slug: supabaseMatch.slug || KHADYS_OFFICIAL_SLUG,
      };
    }
  }

  // 2. Chercher dans la liste des restaurants chargée
  const matchedInList = restaurantsList.find((r) => isKhadysFoodRestaurant(r));
  if (matchedInList) {
    return {
      ...matchedInList,
      name: KHADYS_OFFICIAL_NAME,
      slug: matchedInList.slug || KHADYS_OFFICIAL_SLUG,
    };
  }

  // 3. Fallback sur les données officielles locales Khady's Food (RESTAURANTS_DATA[0])
  const defaultKhady = RESTAURANTS_DATA.find((r) => r.id === KHADYS_STABLE_LOCAL_ID) || RESTAURANTS_DATA[0];
  return {
    ...defaultKhady,
    id: KHADYS_STABLE_LOCAL_ID,
    name: KHADYS_OFFICIAL_NAME,
    slug: KHADYS_OFFICIAL_SLUG,
  };
}
