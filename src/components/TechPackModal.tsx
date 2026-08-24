import React, { useState } from "react";
import {
  Database,
  Code2,
  FileCode,
  Copy,
  Check,
  Server,
  Layers,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  ExternalLink,
  X,
  BookOpen,
  Cpu,
  Workflow,
  Share2,
} from "lucide-react";

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"sql" | "arch" | "specs" | "env">("sql");
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const supabaseSqlSchema = `-- ==============================================================================
-- ALLÔRESTO NIGER (SUPABASE / POSTGRESQL PRODUCTION SCHEMA)
-- Compatible PostgreSQL 15+, Row Level Security (RLS) activé par défaut
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Pour géolocalisation des livreurs & calcul de distance

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('client', 'restaurant_manager', 'courier', 'admin');
CREATE TYPE order_status AS ENUM ('received', 'accepted', 'preparing', 'ready_for_pickup', 'delivering', 'delivered', 'cancelled');
CREATE TYPE service_mode AS ENUM ('delivery', 'takeaway', 'booking');
CREATE TYPE payment_method AS ENUM ('cash', 'airtel_money', 'moov_flooz', 'al_izza', 'card');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');

-- 3. PROFILES & USERS
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'client'::user_role,
    avatar_url TEXT,
    sahel_points INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESTAURANTS
CREATE TABLE public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id UUID REFERENCES public.profiles(id),
    name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255),
    cuisine_type VARCHAR(100) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    delivery_time_min INT DEFAULT 25,
    delivery_time_max INT DEFAULT 40,
    min_order INT DEFAULT 2000, -- En FCFA
    delivery_fee INT DEFAULT 1000, -- En FCFA
    city VARCHAR(100) DEFAULT 'Niamey',
    district VARCHAR(100) NOT NULL, -- Ex: 'Plateau', 'Koira Kano'
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone VARCHAR(30) NOT NULL,
    image_url TEXT,
    banner_url TEXT,
    is_open BOOLEAN DEFAULT true,
    opening_hours VARCHAR(100) DEFAULT '09:00 - 23:00',
    is_promoted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENU ITEMS & CATEGORIES
CREATE TABLE public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INT NOT NULL, -- Prix en FCFA
    image_url TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT true,
    is_spicy BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    prep_time_minutes INT DEFAULT 15,
    options_json JSONB DEFAULT '[]'::jsonb, -- Suppléments, sauces, cuisson
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS & TRANSACTIONS
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL, -- Ex: 'ALLO-7842'
    customer_id UUID REFERENCES public.profiles(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    courier_id UUID REFERENCES public.profiles(id),
    service_type service_mode DEFAULT 'delivery'::service_mode,
    order_status order_status DEFAULT 'received'::order_status,
    subtotal INT NOT NULL,
    delivery_fee INT DEFAULT 1000,
    discount INT DEFAULT 0,
    tip INT DEFAULT 0,
    total INT NOT NULL,
    payment_method payment_method DEFAULT 'cash'::payment_method,
    payment_status payment_status DEFAULT 'pending'::payment_status,
    delivery_address TEXT NOT NULL,
    delivery_district VARCHAR(100) DEFAULT 'Plateau',
    scheduled_time VARCHAR(50), -- Ex: '12:30 (Midi au Bureau)'
    delivery_partner VARCHAR(100) DEFAULT 'Billo Express 🏍️',
    cash_change_amount VARCHAR(50), -- Ex: 'Billet de 10 000 FCFA'
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id),
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price INT NOT NULL,
    total_price INT NOT NULL,
    selected_options JSONB DEFAULT '{}'::jsonb,
    participant_name VARCHAR(100) -- Pour les commandes de groupe
);

-- 8. GROUP ORDERS (COMMANDES GROUPÉES BUREAUX / MINISTÈRES)
CREATE TABLE public.group_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(20) UNIQUE NOT NULL, -- Ex: 'PLATEAU-DEJ-402'
    title VARCHAR(255) NOT NULL,
    creator_id UUID REFERENCES public.profiles(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    cutoff_time TIME NOT NULL, -- Ex: '11:45:00'
    scheduled_time TIME NOT NULL, -- Ex: '12:30:00'
    delivery_address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Lecture publique des restaurants et menus
CREATE POLICY "Public restaurants read" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Public menu items read" ON public.menu_items FOR SELECT USING (true);

-- Clients accèdent à leurs propres commandes
CREATE POLICY "Clients see their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IN (
        SELECT id FROM public.profiles WHERE role = 'admin'
    ));

-- Gérants de restaurants voient les commandes de leur établissement
CREATE POLICY "Restaurants see their orders" ON public.orders
    FOR ALL USING (auth.uid() IN (
        SELECT manager_id FROM public.restaurants WHERE id = public.orders.restaurant_id
    ));
`;

  const envConfigSnippet = `# .env.local (Configuration Supabase & API Allôresto)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Passerelles Paiement & SMS Niger
AIRTEL_MONEY_NIGER_MERCHANT_ID=ALLORESTO_NE_01
MOOV_FLOOZ_PARTNER_KEY=FLOOZ_NIAMEY_PROD_99
BILLO_EXPRESS_API_KEY=billo_live_niamey_sec_4289
WHATSAPP_INFOBIP_API_KEY=wa_live_sahel_alert_91

# Gemini AI Recommandations & AllôChef
GEMINI_API_KEY=AIzaSy...
`;

  const handleCopySql = () => {
    navigator.clipboard?.writeText?.(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyEnv = () => {
    navigator.clipboard?.writeText?.(envConfigSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-orange-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Pack Technique Allôresto &bull; Option C
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Plateforme Complète Production
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Schéma PostgreSQL / Supabase, architecture full-stack, intégrations Billo Express &amp; Mobile Money
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              v1.4-Production-Niamey
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("sql")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "sql"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Schéma Supabase SQL (Prêt à exécuter)</span>
          </button>

          <button
            onClick={() => setActiveTab("arch")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "arch"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>2. Architecture &amp; Rôles Métier</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "specs"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Cahier des Charges &amp; Arborescence</span>
          </button>

          <button
            onClick={() => setActiveTab("env")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "env"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>4. Variables &amp; Déploiement</span>
          </button>
        </div>

        {/* Tab 1: SQL Schema */}
        {activeTab === "sql" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">Scripts DDL PostgreSQL 15+ pour Supabase</span> avec tables relationnelles, clés étrangères, sécurité RLS et types énumérés.
              </div>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">SQL Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier tout le SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto leading-relaxed shadow-inner">
              <pre className="whitespace-pre">{supabaseSqlSchema}</pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <strong className="text-white block">Comment déployer sur Supabase :</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Ouvrez votre projet sur <code>supabase.com</code> &rarr; Cliquez sur <strong>SQL Editor</strong>.</li>
                  <li>Collez ce script complet et cliquez sur <strong>RUN</strong>.</li>
                  <li>Activez le module <strong>Authentication &bull; Phone Provider</strong> pour l'envoi de SMS OTP au Niger (+227).</li>
                  <li>Créez le bucket de stockage public <code>restaurant-menus</code> pour les photos des plats.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture & Roles */}
        {activeTab === "arch" && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Architecture Système &amp; Matrice des 4 Espaces
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/30 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>1. Application Client PWA</span>
                </div>
                <p className="text-xs text-slate-300">
                  Découverte des restaurants par quartier (Plateau, Grande Mosquée, Koira Kano), commande collective bureau avec code d'invitation, précommande programmée pour 12h30, programme de fidélité Sahel Club et suivi en direct.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Server className="w-4 h-4" />
                  <span>2. Espace Restaurant Gérant (KDS)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Écran de cuisine en temps réel avec signaux sonores, acceptation/refus des commandes, mise à jour instantanée de la disponibilité des plats, gestion des stocks et statistiques de ventes journalières.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Workflow className="w-4 h-4" />
                  <span>3. Espace Coursier Billo Express</span>
                </div>
                <p className="text-xs text-slate-300">
                  Radar GPS des courses disponibles, acceptation en 1 clic, navigation guidée vers le restaurant puis le client, gestion de la monnaie en espèces et historique des gains nets quotidiens.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Console Superviseur &bull; Admin HQ</span>
                </div>
                <p className="text-xs text-slate-300">
                  Vue globale du GMV (Volume d'affaires), prélèvement automatique des commissions plateforme (10%), validation des agréments restaurants et audit de conformité HAPDP.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Specs & Sitemap */}
        {activeTab === "specs" && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Arborescence &amp; Parcours Utilisateur Déployés
            </h4>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Parcours Client</span>
                <span className="text-emerald-400 font-semibold">100% Fonctionnel</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 space-y-1">
                <p>⚡ Accueil &rarr; Filtres Quartier &amp; Cuisine &rarr; Fiche Restaurant &amp; Menu</p>
                <p>⚡ Sélection Plats + Options sauces/accompagnements &rarr; Panier Interactif</p>
                <p>⚡ Choix Créneau (Immédiat ou 12h30 Bureau) &rarr; Paiement Espèces/Airtel/Flooz &rarr; Confirmation Live</p>
                <p>⚡ Suivi Billo Express &rarr; Notification WhatsApp &rarr; Réception &amp; Re-Order 1 clic</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Fonctionnalités Clés Niamey Intégrées</span>
                <span className="text-orange-400 font-semibold">Spécial Niger 🇳🇪</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Module Commande Collective Ministères</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Gestion Monnaie Billet 5K/10K/20K FCFA</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Assistant Vocal/Texte AllôChef (Gemini AI)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Conformité HAPDP Loi 2022-59 / 2023-31</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Environment variables & Deployment */}
        {activeTab === "env" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Fichier de configuration <code>.env.example</code> pour Vercel, Netlify ou Docker.
              </div>
              <button
                onClick={handleCopyEnv}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier .env</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre">{envConfigSnippet}</pre>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tous les modules A, B et C sont prêts et intégrés à l'application interactive.</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/25 transition cursor-pointer"
          >
            Fermer &amp; Continuer l'exploration
          </button>
        </div>
      </div>
    </div>
  );
};
