import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Storage keys
const SUPABASE_URL_KEY = "alloresto_supabase_url";
const SUPABASE_ANON_KEY = "alloresto_supabase_anon_key";

export function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // If user pasted the dashboard URL: https://supabase.com/dashboard/project/xyz
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Remove trailing slashes and common mistaken subpaths like /rest/v1, /rest/v1/, /auth/v1, etc.
  url = url.replace(/\/+$/, ""); // remove trailing slashes
  url = url.replace(/\/rest\/v1\/?$/i, "");
  url = url.replace(/\/auth\/v1\/?$/i, "");
  url = url.replace(/\/storage\/v1\/?$/i, "");
  url = url.replace(/\/+$/, "");

  // Ensure protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: "env" | "custom" | "none";
}

export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL ? sanitizeSupabaseUrl(metaEnv.VITE_SUPABASE_URL) : "";
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY ? metaEnv.VITE_SUPABASE_ANON_KEY.trim() : "";

  // Priority to custom configured keys in localStorage if set, otherwise fallback to env
  try {
    const customUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const customKey = localStorage.getItem(SUPABASE_ANON_KEY);
    if (customUrl && customKey && customUrl.startsWith("http")) {
      const sanitized = sanitizeSupabaseUrl(customUrl);
      return {
        url: sanitized,
        anonKey: customKey.trim(),
        isConfigured: true,
        source: "custom",
      };
    }
  } catch (e) {
    // Ignore localStorage access errors
  }

  if (envUrl && envKey && envUrl.startsWith("http")) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: "env",
    };
  }

  return {
    url: "",
    anonKey: "",
    isConfigured: false,
    source: "none",
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (url && anonKey) {
      const cleanUrl = sanitizeSupabaseUrl(url);
      const cleanKey = anonKey.trim();
      localStorage.setItem(SUPABASE_URL_KEY, cleanUrl);
      localStorage.setItem(SUPABASE_ANON_KEY, cleanKey);
      // Re-initialize client
      cachedClient = null;
      return true;
    } else {
      localStorage.removeItem(SUPABASE_URL_KEY);
      localStorage.removeItem(SUPABASE_ANON_KEY);
      cachedClient = null;
      return true;
    }
  } catch (e) {
    console.error("Erreur sauvegarde config Supabase:", e);
    return false;
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error("Erreur initialisation Supabase Client:", err);
    return null;
  }
}

// Test connection
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  tableExists?: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: "Supabase n'est pas configuré. Veuillez renseigner l'URL et la clé anonyme (Anon Key).",
    };
  }

  try {
    const { data, error } = await client.from("dishes").select("id").limit(1);

    if (error) {
      // If error code is 42P01 (relation does not exist)
      if (error.code === "42P01" || error.message.includes("relation") || error.message.includes("does not exist")) {
        return {
          success: true,
          tableExists: false,
          message: "Connexion Supabase réussie ! La table 'dishes' n'existe pas encore. Cliquez sur 'Créer la table & Synchroniser' ou exécutez le script SQL fourni.",
        };
      }
      return {
        success: false,
        message: `Erreur Supabase: ${error.message} (${error.code || "unknown"})`,
      };
    }

    return {
      success: true,
      tableExists: true,
      message: "Connexion Supabase établie avec succès ! La table 'dishes' est prête et accessible.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erreur réseau ou URL invalide: ${err?.message || err}`,
    };
  }
}
