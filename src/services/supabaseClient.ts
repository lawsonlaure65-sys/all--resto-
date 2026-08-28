import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Storage keys
const SUPABASE_URL_KEY = "alloresto_supabase_url";
const SUPABASE_ANON_KEY = "alloresto_supabase_anon_key";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: "env" | "custom" | "none";
}

export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && typeof envUrl === "string" && envUrl.startsWith("http")) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: "env",
    };
  }

  try {
    const customUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const customKey = localStorage.getItem(SUPABASE_ANON_KEY);
    if (customUrl && customKey && customUrl.startsWith("http")) {
      return {
        url: customUrl,
        anonKey: customKey,
        isConfigured: true,
        source: "custom",
      };
    }
  } catch (e) {
    // Ignore localStorage access errors
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
      localStorage.setItem(SUPABASE_URL_KEY, url.trim());
      localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
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
