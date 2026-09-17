import { createClient, SupabaseClient, PostgrestError } from "@supabase/supabase-js";

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
    };
  };
}

// Variables d'environnement standardisées pour Vite
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "";

/**
 * Singleton Supabase sécurisé et typé.
 * RÈGLE D'OR : N'utilise STRICTEMENT que la clé anonyme (anon / publishable).
 * La clé secrète `service_role` ne doit JAMAIS être importée côté client.
 */
class SupabaseService {
  private static instance: SupabaseClient<Database> | null = null;

  public static getClient(): SupabaseClient<Database> {
    if (!SupabaseService.instance) {
      const isValid = Boolean(
        supabaseUrl &&
        supabaseAnonKey &&
        supabaseUrl.startsWith("http") &&
        !supabaseUrl.includes("placeholder")
      );

      if (isValid) {
        SupabaseService.instance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
      } else {
        // Fallback transparent sans crash si les variables ne sont pas encore renseignées dans Vercel
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
      }
    }
    return SupabaseService.instance;
  }
}

export const supabase = SupabaseService.getClient();

/**
 * Type utilitaire pour les retours de requêtes avec gestion d'erreur normalisée
 */
export type SupabaseResult<T> = {
  data: T | null;
  error: PostgrestError | Error | null;
};

/**
 * Helper de vérification de la disponibilité de la connexion Supabase
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder")
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
