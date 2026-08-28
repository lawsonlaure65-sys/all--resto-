import React, { useState, useEffect } from "react";
import {
  Database,
  X,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  UploadCloud,
  DownloadCloud,
  Sparkles,
  ShieldCheck,
  Key,
  Globe,
  Terminal,
  HelpCircle,
} from "lucide-react";
import {
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  testSupabaseConnection,
  sanitizeSupabaseUrl,
} from "../services/supabaseClient";
import {
  SUPABASE_SQL_SCHEMA,
  syncAllLocalDataToSupabase,
  fetchRestaurantsFromSupabase,
} from "../services/supabaseDishService";
import { Restaurant } from "../types";
import { loadStoredRestaurants, saveStoredRestaurants } from "../services/dishStorageService";

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onRestaurantsUpdated: (updated: Restaurant[]) => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onRestaurantsUpdated,
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseKey, setSupabaseKey] = useState<string>("");
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableExists?: boolean;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"config" | "sql" | "guide">("config");

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setSupabaseUrl(config.url ? sanitizeSupabaseUrl(config.url) : "");
      setSupabaseKey(config.anonKey || "");
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const cleanUrl = sanitizeSupabaseUrl(supabaseUrl);
    const cleanKey = supabaseKey.trim();
    setSupabaseUrl(cleanUrl);
    setSupabaseKey(cleanKey);

    // Save sanitized to test
    saveCustomSupabaseConfig(cleanUrl, cleanKey);

    const result = await testSupabaseConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveConfig = async () => {
    const cleanUrl = sanitizeSupabaseUrl(supabaseUrl);
    const cleanKey = supabaseKey.trim();
    setSupabaseUrl(cleanUrl);
    setSupabaseKey(cleanKey);

    saveCustomSupabaseConfig(cleanUrl, cleanKey);
    await handleTestConnection();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncLocalToSupabase = async () => {
    setIsSyncing(true);
    try {
      const currentRestos = loadStoredRestaurants();
      const res = await syncAllLocalDataToSupabase(currentRestos);
      if (res.success) {
        setTestResult({
          success: true,
          tableExists: true,
          message: `Synchronisation réussie ! ${res.count} plats et restaurants ont été envoyés sur Supabase.`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Erreur de synchronisation : ${res.error}`,
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Erreur inattendue : ${e?.message || e}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFetchFromSupabase = async () => {
    setIsFetching(true);
    try {
      const res = await fetchRestaurantsFromSupabase();
      if (res.success && res.data && res.data.length > 0) {
        saveStoredRestaurants(res.data);
        onRestaurantsUpdated(res.data);
        const total = res.data.reduce((sum, r) => sum + r.menu.length, 0);
        setTestResult({
          success: true,
          tableExists: true,
          message: `Succès ! ${total} plats importés depuis Supabase. Les données de l'application sont à jour.`,
        });
      } else if (res.success && (!res.data || res.data.length === 0)) {
        setTestResult({
          success: true,
          tableExists: true,
          message: "La base Supabase est connectée mais ne contient aucun plat pour l'instant. Cliquez sur 'Envoyer tous les plats vers Supabase'.",
        });
      } else {
        setTestResult({
          success: false,
          message: `Erreur lors de l'import : ${res.error}`,
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Erreur inattendue : ${e?.message || e}`,
      });
    } finally {
      setIsFetching(false);
    }
  };

  const config = getSupabaseConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Connexion Base de Données Supabase</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  PostgreSQL Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sauvegarde permanente et synchronisation cloud de tous les plats, menus et prix Allôresto Niamey 🇳🇪
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveSubTab("config")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === "config"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. Clés &amp; Connexion</span>
          </button>

          <button
            onClick={() => setActiveSubTab("sql")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === "sql"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. Script SQL (Tables)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("guide")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === "guide"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Guide 2 min</span>
          </button>
        </div>

        {/* SUBTAB 1: CONFIGURATION & CREDENTIALS */}
        {activeSubTab === "config" && (
          <div className="space-y-5">
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
              config.isConfigured
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                : "bg-amber-950/40 border-amber-500/40 text-amber-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                <div>
                  <span className="text-xs font-black block">
                    {config.isConfigured ? "Supabase est configuré !" : "Supabase en attente de configuration"}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {config.isConfigured
                      ? `Connecté via ${config.source === "env" ? "variables d'environnement" : "paramètres personnalisés"}`
                      : "Entrez votre URL de projet Supabase et votre clé Anon ci-dessous."}
                  </span>
                </div>
              </div>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
              >
                <span>Dashboard Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Project URL Supabase (VITE_SUPABASE_URL) *</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Format: https://[ID].supabase.co</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSupabaseUrl(val);
                    }}
                    onBlur={() => {
                      if (supabaseUrl) {
                        setSupabaseUrl(sanitizeSupabaseUrl(supabaseUrl));
                      }
                    }}
                    placeholder="https://gimneagwmfymiykelkxx.supabase.co"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                {supabaseUrl.includes("/rest/v1") && (
                  <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>Astuce : Ne mettez pas &quot;/rest/v1/&quot; à la fin. L&apos;URL doit s&apos;arrêter à &quot;.supabase.co&quot; (correction automatique appliquée au clic sur Tester).</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Anon Public API Key (VITE_SUPABASE_ANON_KEY) *</span>
                  <span className="text-[10px] text-slate-500 font-mono">Clé publique &apos;anon&apos; (JWT)</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value.trim())}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isTesting || !supabaseUrl || !supabaseKey}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 transition"
                >
                  {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isTesting ? "Test en cours..." : "Sauvegarder & Tester la Connexion"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !supabaseUrl || !supabaseKey}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                  <span>Tester seulement</span>
                </button>
              </div>
            </div>

            {/* Test Results Banner */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border text-xs font-bold flex items-start gap-3 animate-in fade-in ${
                  testResult.success
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                    : "bg-rose-950/80 border-rose-500 text-rose-200"
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p>{testResult.message}</p>
                  {testResult.tableExists === false && (
                    <button
                      onClick={() => setActiveSubTab("sql")}
                      className="mt-2 px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg font-black text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Ouvrir le Script SQL pour créer les tables</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Cloud Sync Actions */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Synchronisation des Données en 1 Clic</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Transférez vos plats actuels vers Supabase ou rechargez la base existante.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {restaurants.reduce((sum, r) => sum + r.menu.length, 0)} plats locaux prêts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSyncLocalToSupabase}
                  disabled={isSyncing || !supabaseUrl || !supabaseKey}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 text-left transition flex items-center gap-3 cursor-pointer disabled:opacity-50 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <UploadCloud className={`w-5 h-5 ${isSyncing ? "animate-bounce" : ""}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isSyncing ? "Envoi en cours..." : "1. Envoyer les Plats Locaux vers Supabase"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sauvegarde tous les 65+ plats actuels dans votre PostgreSQL
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleFetchFromSupabase}
                  disabled={isFetching || !supabaseUrl || !supabaseKey}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500/50 text-left transition flex items-center gap-3 cursor-pointer disabled:opacity-50 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <DownloadCloud className={`w-5 h-5 ${isFetching ? "animate-bounce" : ""}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isFetching ? "Chargement..." : "2. Recharger depuis Supabase"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Met à jour l&apos;application avec les données du cloud
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SQL SCHEMA */}
        {activeSubTab === "sql" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-white">Script SQL à exécuter dans Supabase</h4>
                <p className="text-[11px] text-slate-400">
                  Crée automatiquement les tables `restaurants` et `dishes` avec les politiques de sécurité (RLS) publiques.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySql}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-md shadow-emerald-500/20 shrink-0"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? "Copié !" : "Copier le Script SQL"}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-300 max-h-[350px] overflow-y-auto leading-relaxed">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>
        )}

        {/* SUBTAB 3: QUICK 2-MIN GUIDE */}
        {activeSubTab === "guide" && (
          <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-black text-white mb-2">Guide d&apos;installation Supabase en 3 étapes :</h4>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <span className="font-bold text-white block">Créer un projet gratuit sur Supabase</span>
                  <p className="text-slate-400 mt-0.5">
                    Allez sur <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">supabase.com</a>, connectez-vous et cliquez sur <strong>&quot;New project&quot;</strong> (nommez-le par exemple <em>alloresto-niamey</em>).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="font-bold text-white block">Exécuter le Script SQL</span>
                  <p className="text-slate-400 mt-0.5">
                    Dans le menu de gauche de Supabase, cliquez sur <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, collez le script de l&apos;onglet <em>&quot;2. Script SQL&quot;</em> ci-dessus, et cliquez sur <strong>Run</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="font-bold text-white block">Copier vos Clés API et Synchroniser</span>
                  <p className="text-slate-400 mt-0.5">
                    Dans Supabase &gt; <strong>Project Settings</strong> &gt; <strong>API</strong>, copiez <em>Project URL</em> et <em>anon public key</em>, collez-les dans l&apos;onglet <em>&quot;1. Clés &amp; Connexion&quot;</em> et cliquez sur <strong>&quot;Sauvegarder &amp; Tester&quot;</strong> puis <strong>&quot;Envoyer les Plats Locaux&quot;</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
