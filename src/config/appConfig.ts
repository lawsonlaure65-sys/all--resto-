/**
 * Application Configuration & Environment Variables Resolver
 * Resolves both client-side (import.meta.env) and fallback configuration values
 * for Allôresto Niger.
 */

const getEnv = (key: string, viteKey: string, fallback: string): string => {
  try {
    const meta = (import.meta as any).env || {};
    return meta[viteKey] || meta[key] || fallback;
  } catch {
    return fallback;
  }
};

export const APP_CONFIG = {
  // Supabase Database & Auth
  supabase: {
    url: getEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "https://alloresto-niger-prod.supabase.co"),
    anonKey: getEnv("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY", ""),
  },

  // Official Niger Deposit Accounts & Support
  payments: {
    mynitaNumber: getEnv("MYNITA_DEPOSIT_NUMBER", "VITE_MYNITA_DEPOSIT_NUMBER", "+227 90 40 51 18"),
    amanataNumber: getEnv("AMANATA_DEPOSIT_NUMBER", "VITE_AMANATA_DEPOSIT_NUMBER", "+227 90 40 51 18"),
    alIzzaNumber: getEnv("AL_IZZA_BUSINESS_NUMBER", "VITE_AL_IZZA_BUSINESS_NUMBER", "+227 90 40 51 18"),
    zeynaNumber: getEnv("ZEYNA_DEPOSIT_NUMBER", "VITE_ZEYNA_DEPOSIT_NUMBER", "+227 90 40 51 18"),
    airtelMoneyNumber: getEnv("AIRTEL_MONEY_NIGER_NUMBER", "VITE_AIRTEL_MONEY_NIGER_NUMBER", "+227 96 05 23 10"),
    whatsappSupport: getEnv("ALLORESTO_WHATSAPP_SUPPORT", "VITE_ALLORESTO_WHATSAPP_SUPPORT", "+227 70 03 25 52"),
  },

  // Billo Express Fleet Integration
  billoExpress: {
    apiKey: getEnv("BILLO_EXPRESS_API_KEY", "VITE_BILLO_EXPRESS_API_KEY", "billo_live_niamey_sec_4289"),
    dispatchWebhook: getEnv("BILLO_DISPATCH_WEBHOOK", "VITE_BILLO_DISPATCH_WEBHOOK", "https://api.billoexpress.ne/webhook/alloresto"),
  },
};
