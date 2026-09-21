import { createClient, SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { getSupabaseConfig, sanitizeSupabaseUrl } from "../services/supabaseClient";

/**
 * Schéma TypeScript strict pour la base de données Supabase Allôresto
 */
export interface Database {
  public: {
    Tables: {
      daily_menus: {
        Row: {
          id: string;
          restaurant_id: string | null;
          menu_date: string;
          title: string;
          description: string | null;
          price_xof: number;
          image_url: string | null;
          photo_url?: string | null;
          marketing_message: string | null;
          call_to_action: string | null;
          status: "draft" | "scheduled" | "published" | "archived";
          is_ai_suggested?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          restaurant_id?: string | null;
          menu_date: string;
          title: string;
          description?: string | null;
          price_xof: number;
          image_url?: string | null;
          photo_url?: string | null;
          marketing_message?: string | null;
          call_to_action?: string | null;
          status?: "draft" | "scheduled" | "published" | "archived";
          is_ai_suggested?: boolean;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["daily_menus"]["Insert"]>;
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          cuisine: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          quartier: string | null;
          is_active: boolean;
          created_at?: string;
        };
        Insert: Partial<Database["public"]["Tables"]["restaurants"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          amount_xof: number;
          payment_method: string;
          payment_status: "pending" | "completed" | "failed" | "refunded";
          transaction_id: string;
          phone_number: string;
          provider_response?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          amount_xof: number;
          payment_method: string;
          payment_status?: "pending" | "completed" | "failed" | "refunded";
          transaction_id: string;
          phone_number: string;
          provider_response?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
    };
  };
}

/**
 * Singleton Supabase sécurisé et typé.
 * RÈGLE D'OR : N'utilise STRICTEMENT que la clé anonyme (anon / publishable).
 * La clé secrète `service_role` ne doit JAMAIS être importée côté client.
 * Nettoie et valide l'URL de façon stricte pour éviter l'erreur "Invalid path specified in request URL".
 */
class SupabaseService {
  private static instance: SupabaseClient<Database> | null = null;
  private static activeUrl: string = "";
  private static activeKey: string = "";

  public static getClient(): SupabaseClient<Database> {
    const config = getSupabaseConfig();
    const cleanUrl = config.isConfigured ? sanitizeSupabaseUrl(config.url) : "";
    const cleanKey = config.isConfigured ? config.anonKey.trim() : "";

    const isCurrentlyValid = Boolean(
      cleanUrl &&
      cleanKey &&
      cleanUrl.startsWith("http") &&
      !cleanUrl.includes("placeholder")
    );

    // Si la configuration a changé ou que l'instance n'existe pas encore
    if (
      !SupabaseService.instance ||
      SupabaseService.activeUrl !== (isCurrentlyValid ? cleanUrl : "") ||
      SupabaseService.activeKey !== (isCurrentlyValid ? cleanKey : "")
    ) {
      if (isCurrentlyValid) {
        SupabaseService.instance = createClient<Database>(cleanUrl, cleanKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
        SupabaseService.activeUrl = cleanUrl;
        SupabaseService.activeKey = cleanKey;
      } else {
        // Fallback transparent sans crash si les variables ne sont pas encore renseignées
        SupabaseService.instance = createClient<Database>(
          "https://placeholder.supabase.co",
          "placeholder-anon-key",
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
            },
          }
        );
        SupabaseService.activeUrl = "";
        SupabaseService.activeKey = "";
      }
    }
    return SupabaseService.instance;
  }
}

// Proxy dynamique garantissant que tout appel à supabase utilise la configuration active et nettoyée
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = SupabaseService.getClient();
    const val = (client as any)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

/**
 * Type utilitaire pour les retours de requêtes avec gestion d'erreur normalisée
 */
export type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};

/**
 * Helper de vérification de la disponibilité de la connexion Supabase.
 * Vérifie la présence d'une URL et d'une clé réelles et correctement formatées.
 */
export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) return false;
  const cleanUrl = sanitizeSupabaseUrl(config.url);
  return Boolean(
    cleanUrl &&
    cleanUrl.startsWith("http") &&
    !cleanUrl.includes("placeholder") &&
    config.anonKey.trim().length > 10
  );
}

/**
 * Exécuteur sécurisé de requêtes avec gestion d'erreurs typées
 */
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<SupabaseResult<T>> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
