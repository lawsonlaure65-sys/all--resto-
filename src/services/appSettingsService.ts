import { useEffect, useState } from "react";

export interface AppSettings {
  id?: string;
  company_name: string;
  companyName?: string;
  nif: string;
  rccm?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url?: string;
  logoUrl?: string;
  default_commission_rate?: number;
  delivery_base_fee?: number;
  currency?: string;
}

/**
 * Identité légale, fiscale et coordonnées officielles du siège (Niamey, Niger)
 * Conforme aux déclarations NIF-10024/P-NE et RCCM-NE-NIA-2019-B-898
 */
export const OFFICIAL_DEFAULT_APP_SETTINGS: AppSettings = {
  id: "main",
  company_name: "Allôresto Niger SARL",
  companyName: "Allôresto Niger SARL",
  nif: "NIF-10024/P-NE",
  rccm: "RCCM-NE-NIA-2019-B-898",
  currency: "FCFA",
  address: "Poudrière II, Niamey, Niger",
  phone: "+227 96052310",
  email: "lawson.laure65@gmail.com",
  website: "https://alloresto-niamey.vercel.app",
  logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  default_commission_rate: 0,
  delivery_base_fee: 1000,
};

export const SETTINGS_STORAGE_KEY = "alloresto_app_settings";

/**
 * Récupère les paramètres de l'application stockés localement avec repli prioritaire
 * sur l'identité légale et fiscale officielle du Niger.
 */
export function getStoredAppSettings(): AppSettings {
  if (typeof window === "undefined") {
    return OFFICIAL_DEFAULT_APP_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Remplacer automatiquement les anciens placeholders génériques par les données officielles réelles
      const isPlaceholderNif = !parsed.nif || parsed.nif.includes("89210") || parsed.nif.includes("48921");
      const isPlaceholderRccm = !parsed.rccm || parsed.rccm.includes("1140") || parsed.rccm.includes("1142");
      const isPlaceholderAddress = !parsed.address || parsed.address.includes("Boulevard du 15") || parsed.address.includes("Plateau");
      const isPlaceholderPhone = !parsed.phone || parsed.phone.includes("80 82 82") || parsed.phone.includes("808282");
      const isPlaceholderEmail = !parsed.email || parsed.email.includes("contact@alloresto.ne");
      const isPlaceholderWeb = !parsed.website || parsed.website.includes("www.alloresto.ne");

      const company = parsed.companyName || parsed.company_name || OFFICIAL_DEFAULT_APP_SETTINGS.company_name;
      const nif = isPlaceholderNif ? OFFICIAL_DEFAULT_APP_SETTINGS.nif : (parsed.nif || OFFICIAL_DEFAULT_APP_SETTINGS.nif);
      const rccm = isPlaceholderRccm ? OFFICIAL_DEFAULT_APP_SETTINGS.rccm : (parsed.rccm || OFFICIAL_DEFAULT_APP_SETTINGS.rccm);
      const address = isPlaceholderAddress ? OFFICIAL_DEFAULT_APP_SETTINGS.address : (parsed.address || OFFICIAL_DEFAULT_APP_SETTINGS.address);
      const phone = isPlaceholderPhone ? OFFICIAL_DEFAULT_APP_SETTINGS.phone : (parsed.phone || OFFICIAL_DEFAULT_APP_SETTINGS.phone);
      const email = isPlaceholderEmail ? OFFICIAL_DEFAULT_APP_SETTINGS.email : (parsed.email || OFFICIAL_DEFAULT_APP_SETTINGS.email);
      const website = isPlaceholderWeb ? OFFICIAL_DEFAULT_APP_SETTINGS.website : (parsed.website || OFFICIAL_DEFAULT_APP_SETTINGS.website);

      return {
        ...OFFICIAL_DEFAULT_APP_SETTINGS,
        ...parsed,
        company_name: company,
        companyName: company,
        nif,
        rccm,
        address,
        phone,
        email,
        website,
        currency: parsed.currency || OFFICIAL_DEFAULT_APP_SETTINGS.currency,
      };
    }
  } catch (e) {
    console.warn("Erreur lecture settings locaux :", e);
  }
  return OFFICIAL_DEFAULT_APP_SETTINGS;
}

/**
 * Sauvegarde les paramètres dans le localStorage et émet un événement de synchronisation
 */
export function saveStoredAppSettings(settings: AppSettings): void {
  if (typeof window !== "undefined") {
    try {
      const company = settings.companyName || settings.company_name || OFFICIAL_DEFAULT_APP_SETTINGS.company_name;
      const normalized: AppSettings = {
        ...settings,
        company_name: company,
        companyName: company,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new CustomEvent("alloresto_settings_updated", { detail: normalized }));
    } catch (e) {
      console.warn("Erreur sauvegarde settings locaux :", e);
    }
  }
}

/**
 * Hook React réactif pour s'abonner aux changements des paramètres légaux & fiscaux
 */
export function useAppSettings(): AppSettings {
  const [settings, setSettings] = useState<AppSettings>(() => getStoredAppSettings());

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setSettings(e.detail);
      } else {
        setSettings(getStoredAppSettings());
      }
    };

    window.addEventListener("alloresto_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    setSettings(getStoredAppSettings());

    return () => {
      window.removeEventListener("alloresto_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return settings;
}
