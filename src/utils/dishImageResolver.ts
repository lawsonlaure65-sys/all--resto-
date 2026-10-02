/**
 * Utilitaire de résolution et de validation d'image de plat
 * Respecte les exigences strictes d'Allôresto et de Khady's Food
 */

import {
  KHADYS_OFFICIAL_SPAGHETTI_MERGUEZ_IMAGE,
  KHADYS_OFFICIAL_SPAGHETTI_SAUTE_IMAGE,
} from "../data/khadysSpaghettiImage";
import {
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_IMAGE,
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
} from "../data/khadysPlatDuJourImage";

export {
  KHADYS_OFFICIAL_SPAGHETTI_MERGUEZ_IMAGE,
  KHADYS_OFFICIAL_SPAGHETTI_SAUTE_IMAGE,
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_IMAGE,
  KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE,
};

export const OBSOLETE_TIEP_IMAGE_SIGNATURES = [
  "photo-1627308595229-7830a5c91f9f",
  "preset-tiep-merou",
];

export const KHADYS_OFFICIAL_SUYA_IMAGE =
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80";

/**
 * Extrait l'URL d'image d'un plat depuis n'importe quelle propriété :
 * - image_url
 * - image
 * - photo_url
 * - photo
 * - imageUrl
 * - dishImage
 */
export function resolveDishImageUrl(source: any): string {
  if (!source) return "";

  // Détection prioritaire par nom du plat : Sauce crin-crin / Fakou / Ademe (Plat officiel du jour Khady's Food)
  const dishName =
    typeof source === "object"
      ? (source.dishName || source.name || source.title || "").toLowerCase()
      : "";

  if (
    dishName.includes("crin") ||
    dishName.includes("fakou") ||
    dishName.includes("ademe") ||
    dishName.includes("1790412092632")
  ) {
    return KHADYS_OFFICIAL_SAUCE_CRINCRIN_FILE;
  }

  if (dishName.includes("spaghetti") || dishName.includes("merguez")) {
    if (dishName.includes("sauté") || dishName.includes("saute")) {
      return KHADYS_OFFICIAL_SPAGHETTI_SAUTE_IMAGE;
    }
    return KHADYS_OFFICIAL_SPAGHETTI_MERGUEZ_IMAGE;
  }

  let rawUrl = "";
  if (typeof source === "string") {
    rawUrl = source;
  } else if (typeof source === "object") {
    rawUrl =
      source.image_url ||
      source.imageUrl ||
      source.image ||
      source.photo_url ||
      source.photo ||
      source.dishImage ||
      "";
  }

  if (typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // 1. Rejeter strictement l'ancienne image du Tiep
  const isObsoleteTiep = OBSOLETE_TIEP_IMAGE_SIGNATURES.some((sig) => trimmed.includes(sig));
  if (isObsoleteTiep) {
    return "";
  }

  // 2. Détection par URL de spaghetti / merguez
  if (trimmed.includes("merguez") || trimmed.includes("spaghetti")) {
    return KHADYS_OFFICIAL_SPAGHETTI_MERGUEZ_IMAGE;
  }

  // 3. Réécrire systématiquement tout ancien asset local vers la vraie photo officielle publiée sur Khady's Food
  if (trimmed.includes("khadys_suya_brochettes") || trimmed.includes("suya_brochettes")) {
    return KHADYS_OFFICIAL_SUYA_IMAGE;
  }

  // 4. Préserver les images base64 (data:image/...) et assets locaux
  if (trimmed.startsWith("data:") || trimmed.startsWith("/images/") || trimmed.startsWith("/assets/")) {
    return trimmed;
  }

  // 3. Convertir toute URL relative distante avec le domaine officiel de Khady's Food
  if (trimmed.startsWith("/")) {
    return `https://khadysfood.vercel.app${trimmed}`;
  }

  // 4. URL absolue (https:// ou http://)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Valide si une URL d'image est chargeable dans le navigateur
 */
export function verifyImageLoadable(url: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || typeof url !== "string") {
      resolve(false);
      return;
    }
    const img = new Image();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };

    img.src = url;
  });
}
