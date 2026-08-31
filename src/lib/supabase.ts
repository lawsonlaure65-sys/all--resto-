import { createClient } from "@supabase/supabase-js";

// Read public credentials from Vite environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Safe client instance initialization
// Note: In client-side Vite apps, ONLY the public Anon Key is used, NEVER service_role.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder")
  );
}
