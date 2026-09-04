'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface AppSettings {
  id?: string;
  company_name: string;
  nif: string;
  rccm?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url?: string;
  default_commission_rate?: number;
  delivery_base_fee?: number;
  currency?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  id: 'main',
  company_name: 'Allôresto Niger SARL',
  nif: 'NIF-89210-NE',
  rccm: 'RCCM-NI-NIA-2026-B-1142',
  address: 'Plateau, Boulevard du 15 Avril, Niamey, Niger',
  phone: '+227 80 82 82 82',
  email: 'contact@alloresto.ne',
  website: 'www.alloresto.ne',
  logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
  default_commission_rate: 0,
  delivery_base_fee: 1000,
  currency: 'FCFA',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // 1. D'abord charger depuis localStorage pour un affichage immédiat
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('alloresto_app_settings');
        if (cached) {
          setSettings(JSON.parse(cached));
        }
      } catch (e) {
        console.warn('Erreur lecture localStorage settings:', e);
      }
    }

    // 2. Tenter de charger depuis Supabase
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Note Supabase app_settings:', error.message);
      } else if (data) {
        setSettings(data);
        setSupabaseConnected(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('alloresto_app_settings', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.warn('Mode local utilisé pour les paramètres:', error);
    }
  };

  const saveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const payload: AppSettings = {
        ...settings,
        id: 'main',
      };

      // Toujours persister dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('alloresto_app_settings', JSON.stringify(payload));
      }

      // Tenter la mise à jour Supabase si configuré
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(
            {
              id: 'main',
              company_name: payload.company_name,
              nif: payload.nif,
              rccm: payload.rccm,
              address: payload.address,
              phone: payload.phone,
              email: payload.email,
              website: payload.website,
              logo_url: payload.logo_url,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

        if (!error) {
          setSupabaseConnected(true);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error: any) {
      console.error('Erreur sauvegarde settings:', error);
      setErrorMessage(error?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Admin Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Paramètres de la Plateforme &amp; Entreprise
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configuration légale Allôresto Niger (NIF, RCCM, Coordonnées &amp; Facturation)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/app/admin/dashboard"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>📊 Dashboard</span>
            </a>
            <a
              href="/app/admin/restaurants"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>🍽️ Restaurants</span>
            </a>
            <a
              href="/app/admin/drivers"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>🛵 Livreurs</span>
            </a>
            <a
              href="/app/admin/orders"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>📦 Commandes</span>
            </a>
            <a
              href="/?role=admin"
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer"
            >
              Retour Super Admin
            </a>
          </div>
        </header>

        {/* Notifications */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span>✅ Paramètres enregistrés avec succès dans la base de données Allôresto !</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <form onSubmit={saveSettings} className="space-y-6">
          {/* Card 1: Identité Légale & Fiscale */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 text-lg">🏢</span>
                <div>
                  <h2 className="text-base font-bold text-white">Identité Légale &amp; Fiscale (Niger)</h2>
                  <p className="text-xs text-slate-400">Mentionné sur les reçus, contrats de partenariat et factures</p>
                </div>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold border ${supabaseConnected ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'}`}>
                {supabaseConnected ? '☁️ Supabase Synchronisé' : '💾 Stockage Local Actif'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Raison sociale / Nom de la société <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  placeholder="Allôresto Niger SARL"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  NIF (Numéro d'Identification Fiscale) <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.nif}
                  onChange={(e) => setSettings({ ...settings, nif: e.target.value })}
                  placeholder="Ex: NIF-89210-NE"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  RCCM (Registre du Commerce et du Crédit Mobilier)
                </label>
                <input
                  type="text"
                  value={settings.rccm || ''}
                  onChange={(e) => setSettings({ ...settings, rccm: e.target.value })}
                  placeholder="Ex: RCCM-NI-NIA-2026-B-1142"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Devise d'exploitation
                </label>
                <input
                  type="text"
                  value={settings.currency || 'FCFA'}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  placeholder="FCFA (XOF)"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Coordonnées & Contact */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 text-lg">📍</span>
              <div>
                <h2 className="text-base font-bold text-white">Coordonnées du Siège &amp; Support</h2>
                <p className="text-xs text-slate-400">Adresses et contacts officiels pour clients et partenaires</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Adresse physique à Niamey <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Ex: Plateau, Boulevard du 15 Avril, Niamey, Niger"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Téléphone Officiel &amp; Ligne Urgente
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+227 80 82 82 82"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Officiel
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="contact@alloresto.ne"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Site Web Officiel
                </label>
                <input
                  type="text"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  placeholder="www.alloresto.ne"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  URL du Logo Officiel
                </label>
                <input
                  type="url"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Paramètres Commerciaux & Livraison */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-lg">💰</span>
              <div>
                <h2 className="text-base font-bold text-white">Paramètres Financiers &amp; Flotte Billo Express</h2>
                <p className="text-xs text-slate-400">Tarification de base pour les restaurants et les courses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tarif de livraison de base (FCFA)
                </label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={settings.delivery_base_fee || 1000}
                  onChange={(e) => setSettings({ ...settings, delivery_base_fee: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Tarif standard intra-quartier Niamey</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Commission par défaut restaurant (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="1"
                  value={settings.default_commission_rate ?? 0}
                  onChange={(e) => setSettings({ ...settings, default_commission_rate: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
                <span className="text-[11px] text-emerald-400 mt-1 block">0% dans la formule abonnement unique 75 000 FCFA</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={loadSettings}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 cursor-pointer"
            >
              🔄 Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                <>
                  <span>💾 Enregistrer les paramètres</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
