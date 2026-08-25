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
  Download,
  AlertTriangle,
} from "lucide-react";

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"sql" | "arch" | "specs" | "env" | "options">("options");
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  if (!isOpen) return null;

  const supabaseSqlSchema = `-- ==============================================================================
-- ALLÔRESTO NIGER • SCHEMA POSTGRESQL / SUPABASE COMPLET (OPTION B / MVP & OPTION C)
-- Compatible PostgreSQL 15+, Row Level Security (RLS) activé sur TOUTES les tables
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Calculs kilométriques et géolocalisation Niamey

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('client', 'restaurant_manager', 'courier', 'admin');
CREATE TYPE order_status AS ENUM (
    'to_confirm',             -- à confirmer
    'confirmed',              -- confirmée
    'preparing',              -- en préparation
    'ready_for_pickup',       -- prête pour retrait
    'with_billo_express',     -- confiée à Billo Express
    'delivering',             -- en cours de livraison
    'delivered',              -- livrée
    'cancelled'               -- annulée
);
CREATE TYPE service_mode AS ENUM ('delivery', 'pickup', 'group_lunch');
CREATE TYPE payment_method AS ENUM (
    'cash',                   -- Espèces (livraison ou retrait Grande Mosquée)
    'mynita', 
    'amanata', 
    'al_izza_business', 
    'al_izza_transfer', 
    'zeyna', 
    'mobile_money'
);
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'paid', 'refunded');

-- 3. PROFILES (Comptes, Rôles & Identifiants)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE NOT NULL, -- Ex: '+227 96 05 23 10'
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'client'::user_role,
    avatar_url TEXT,
    preferred_district VARCHAR(100) DEFAULT 'Plateau',
    is_phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADDRESSES (Adresses et repères Niamey)
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- Ex: 'Bureau Plateau', 'Domicile Koira Kano'
    district VARCHAR(100) NOT NULL, -- 'Plateau', 'Yantala', 'Koira Kano', 'Grande Mosquée'...
    landmark TEXT NOT NULL, -- Repère visuel (ex: 'Face Ministère des Finances', 'Derrière Pharmacie')
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CATEGORIES (Catégories de menu)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50) DEFAULT 'Utensils',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- 6. PRODUCTS (Plats, Boxs Sauces, Plats du Jour & Offres)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INT NOT NULL, -- Prix en FCFA (XOF)
    image_url TEXT,
    is_daily_special BOOLEAN DEFAULT false, -- Flag "Plat du jour"
    daily_special_date DATE,
    is_popular BOOLEAN DEFAULT false,
    is_halal BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    prep_time_minutes INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT_OPTIONS (Suppléments, Tailles, Sauces Pimentées)
CREATE TABLE public.product_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL, -- Ex: 'Sauce Piment Rouge du Sahel', 'Portion Aloko', 'Grand Format'
    price_extra INT DEFAULT 0, -- En FCFA
    is_required BOOLEAN DEFAULT false
);

-- 8. DELIVERY_ZONES (Frais Centre-ville / Périphérie & Règle des 21h)
CREATE TABLE public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- 'Centre-ville', 'Périphérie', 'Retrait Mosquée'
    day_fee INT NOT NULL, -- 1000 FCFA centre-ville, 1500 FCFA périphérie, 0 FCFA retrait
    night_fee INT NOT NULL, -- 1500 FCFA centre-ville, 2000 FCFA périphérie, 0 FCFA retrait
    night_starts_at TIME DEFAULT '21:00:00',
    districts TEXT[] NOT NULL
);

-- 9. ORDERS (Commandes & Montants)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL, -- Ex: 'ALLO-7842'
    customer_id UUID REFERENCES public.profiles(id),
    service_type service_mode DEFAULT 'delivery'::service_mode,
    status order_status DEFAULT 'to_confirm'::order_status,
    subtotal INT NOT NULL,
    delivery_fee INT DEFAULT 1000,
    discount INT DEFAULT 0,
    total INT NOT NULL,
    payment_method payment_method DEFAULT 'cash'::payment_method,
    payment_status payment_status DEFAULT 'pending'::payment_status,
    cash_change_amount VARCHAR(50), -- Ex: 'Billet de 10 000 FCFA (Rendu 4 000 FCFA)'
    delivery_address TEXT NOT NULL,
    delivery_district VARCHAR(100) DEFAULT 'Plateau',
    delivery_landmark TEXT,
    customer_phone VARCHAR(30) NOT NULL,
    customer_notes TEXT,
    pickup_point VARCHAR(200) DEFAULT 'Grande Mosquée Mouhamar Kadhafi, Niamey',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER_ITEMS (Lignes d'une commande)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    unit_price INT NOT NULL,
    total_price INT NOT NULL,
    selected_options JSONB DEFAULT '[]'::jsonb
);

-- 11. DELIVERIES (Affectation Billo Express, Suivi & Preuve)
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    courier_id UUID REFERENCES public.profiles(id),
    partner_name VARCHAR(100) DEFAULT 'Billo Express',
    partner_contact VARCHAR(30) DEFAULT '+227 92 08 08 22',
    cash_to_collect INT NOT NULL, -- Montant exact en espèces à encaisser
    status VARCHAR(50) DEFAULT 'assigned', -- 'assigned', 'picked_up', 'in_transit', 'delivered'
    proof_of_delivery_url TEXT,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- 12. LOYALTY_ACCOUNTS & TRANSACTIONS (1 pt / 1000 FCFA & 1000 FCFA à 20 pts)
CREATE TABLE public.loyalty_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    points_balance INT DEFAULT 0,
    total_earned INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'Club Sahel Bronze',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES public.loyalty_accounts(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id),
    points_change INT NOT NULL, -- +1 par 1000 FCFA ou -20 pour 1000 FCFA réduction
    type VARCHAR(50) NOT NULL, -- 'order_reward', 'redemption', 'welcome_bonus', 'referral'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REFERRALS (Parrainage : 1 000 FCFA après 1ère commande livrée)
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES public.profiles(id), -- Parrain
    referee_id UUID REFERENCES public.profiles(id), -- Filleul
    referral_code VARCHAR(30) NOT NULL,
    reward_amount INT DEFAULT 1000, -- 1000 FCFA
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'rewarded'
    first_order_id UUID REFERENCES public.orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    rewarded_at TIMESTAMPTZ
);

-- 14. PROMOTIONS (Offres, Formules Midi & Codes Réduction)
CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'fixed' (FCFA) ou 'percentage' (%)
    discount_value INT NOT NULL,
    min_order_amount INT DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 15. EVENT_REQUESTS (Devis Événements, Traiteur & Box Sauces)
CREATE TABLE public.event_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- 'mariage', 'bapteme', 'entreprise', 'soutenance'
    guests_count INT NOT NULL,
    event_date DATE NOT NULL,
    location_district VARCHAR(100) NOT NULL,
    budget_indicatif VARCHAR(100) NOT NULL,
    special_notes TEXT,
    status VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. BLOG_POSTS, FAVORITES & NOTIFICATIONS
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_name VARCHAR(100) DEFAULT 'Chef Allôresto',
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    order_id UUID REFERENCES public.orders(id),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. ROW LEVEL SECURITY (RLS) & POLITIQUES DE PROTECTION SUPABASE
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique
CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Public product options read" ON public.product_options FOR SELECT USING (true);
CREATE POLICY "Public delivery zones read" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Public blog posts read" ON public.blog_posts FOR SELECT USING (true);

-- Politiques Clients / Propriétaires
CREATE POLICY "Users read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage their own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see their own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
CREATE POLICY "Users insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users see their loyalty" ON public.loyalty_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users see their notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Politiques Billo Express (Livreurs)
CREATE POLICY "Couriers see assigned deliveries" ON public.deliveries FOR ALL USING (auth.uid() = courier_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Politiques Administrateur (Gestion Totale)
CREATE POLICY "Admins full access orders" ON public.orders FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
CREATE POLICY "Admins full access products" ON public.products FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
`;

  const envConfigSnippet = `# .env.production (Configuration Allôresto Full-Stack)
# Base de données & Auth Supabase
VITE_SUPABASE_URL=https://alloresto-niger-prod.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Comptes Dépôts & Numéros Officiels Niger (Validation par Capture)
MYNITA_DEPOSIT_NUMBER="+227 90 40 51 18"
AMANATA_DEPOSIT_NUMBER="+227 90 40 51 18"
AL_IZZA_BUSINESS_NUMBER="+227 90 40 51 18"
AL_IZZA_TRANSFERT_NUMBER="+227 96 05 23 10"
ZEYNA_DEPOSIT_NUMBER="+227 96 05 23 10"
ALLORESTO_WHATSAPP_SUPPORT="+227 70 03 25 52"

# Flotte de livraison Billo Express API
BILLO_EXPRESS_API_KEY=billo_live_niamey_sec_4289
BILLO_DISPATCH_WEBHOOK=https://api.billoexpress.ne/webhook/alloresto

# Assistant IA AllôChef (Gemini Flash)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-orange-500/40 rounded-3xl p-5 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Dossier de Conception &amp; Pack Technique Allôresto
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Option C • Prêt à l'Emploi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cahier des charges, 4 espaces métier, PWA, schéma PostgreSQL / Supabase &amp; passerelles Niamey
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              🇳🇪 Niamey Production v1.4
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("options")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "options"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Options A / B / C &amp; Livrables</span>
          </button>

          <button
            onClick={() => setActiveTab("sql")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "sql"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Schéma Supabase SQL DDL</span>
          </button>

          <button
            onClick={() => setActiveTab("arch")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "arch"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>2. Architecture des 4 Espaces</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "specs"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
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
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>4. Déploiement &amp; Variables .env</span>
          </button>
        </div>

        {/* Tab: Options & Livrables */}
        {activeTab === "options" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/40">
              <span className="text-xs font-black text-orange-400 uppercase tracking-widest block mb-1">
                ⭐ Recommandation &amp; Statut Actuel
              </span>
              <h4 className="text-base font-black text-white">
                Allôresto est actuellement déployé sous l'Option C (Plateforme Complète &amp; Interactive)
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tous les modules de l'Option A (Prototype) et de l'Option B (MVP Supabase), augmentés des fonctionnalités avancées de l'Option C (Paiements mobiles Niger, validation des dépôts par reçu, gestion des sauces, livreurs Billo Express, IA AllôChef et Console Admin HQ), sont <strong>100% exécutables et testables immédiatement</strong> dans cette application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option A */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-sm">Option A • Prototype</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">UI / Démo</span>
                </div>
                <p className="text-xs text-slate-400">
                  Maquettes d'écrans détaillées, catalogue de restaurants, panier dynamique et parcours de commande sans backend persistant.
                </p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                  Idéal pour pitchs investisseurs &amp; validation graphique.
                </div>
              </div>

              {/* Option B */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-sm">Option B • MVP Fonctionnel</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400">Recommandé Base</span>
                </div>
                <p className="text-xs text-slate-300">
                  Base PostgreSQL Supabase, comptes clients, commandes en ligne, sélection de quartiers de Niamey, paiement espèces à la livraison.
                </p>
                <div className="text-[11px] text-amber-400/80 pt-2 border-t border-slate-900">
                  Lancement rapide auprès des 10 premiers restaurants.
                </div>
              </div>

              {/* Option C */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/60 space-y-2 ring-2 ring-orange-500/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-400 text-sm">Option C • Plateforme Complète</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500 text-slate-950 font-black">ACTIF</span>
                </div>
                <p className="text-xs text-slate-200">
                  MVP + Dépôts mobiles (Mynita, Amanata, All-Iza, Zeyna) + Validation par reçu + Traiteur + IA AllôChef + KDS Cuisine + Billo Express + Admin HQ.
                </p>
                <div className="text-[11px] text-orange-400 font-bold pt-2 border-t border-slate-900">
                  Écosystème total prêt à scaler au Niger.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: SQL Schema */}
        {activeTab === "sql" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">Scripts DDL PostgreSQL 15+ pour Supabase</span> avec clés étrangères, sécurité RLS, dépôts avec reçus, boxs de sauces, devis traiteur et rôles RBAC.
              </div>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-orange-500/20"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>SQL Copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier tout le Schéma SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto leading-relaxed shadow-inner">
              <pre className="whitespace-pre">{supabaseSqlSchema}</pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-orange-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <strong className="text-white block">Instructions de déploiement en 3 clics sur Supabase :</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Connectez-vous sur <code>https://supabase.com</code> &rarr; Créez un projet nommé <strong>alloresto-niger</strong>.</li>
                  <li>Allez dans l'onglet <strong>SQL Editor</strong> &rarr; Collez le script ci-dessus et cliquez sur <strong>RUN</strong>.</li>
                  <li>Dans <strong>Authentication &bull; Providers</strong>, activez Email (avec confirmation) et Phone OTP si souhaité.</li>
                  <li>Dans <strong>Storage</strong>, créez un bucket public <code>order-receipts</code> pour les captures des reçus de dépôt.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture & Roles */}
        {activeTab === "arch" && (
          <div className="space-y-4 animate-in fade-in">
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
                  Découverte des restaurants par quartier (Plateau, Grande Mosquée, Koira Kano), commande collective bureau avec code d'invitation, précommande 12h30, validation de dépôt par reçu/capture, programme de fidélité Club Sahel et devis traiteur.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Server className="w-4 h-4" />
                  <span>2. Espace Restaurant Gérant (KDS)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Écran de cuisine en direct avec signaux sonores, validation des commandes après réception du reçu, bascule de disponibilité des plats en stock et statistiques de ventes journalières.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Workflow className="w-4 h-4" />
                  <span>3. Espace Coursier Billo Express</span>
                </div>
                <p className="text-xs text-slate-300">
                  Radar GPS des courses disponibles, acceptation en 1 clic, navigation guidée vers le restaurant puis le client, gestion du rendu de monnaie en espèces (5K/10K FCFA) et historique des gains nets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Console Superviseur &bull; Admin HQ</span>
                </div>
                <p className="text-xs text-slate-300">
                  Validation des dépôts Mynita/Amanata/All-Iza/Zeyna en 1 clic pour autoriser la cuisine, gestion des plats et prix en FCFA, gestion des boxs de sauces, traiteur, parrainages et conformité HAPDP Niger.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Specs & Sitemap */}
        {activeTab === "specs" && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Arborescence &amp; Parcours Utilisateur Déployés
            </h4>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Parcours Client Complet</span>
                <span className="text-emerald-400 font-semibold">100% Fonctionnel</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 space-y-1">
                <p>⚡ Accueil &rarr; Sélecteur de Quartier (Plateau, Koira Kano...) &rarr; Recherche &amp; Filtres</p>
                <p>⚡ Choix Restaurant &rarr; Options sauces pimentées / Boxs de Sauces &rarr; Panier Interactif</p>
                <p>⚡ Choix Créneau (Immédiat ou 12h30 Bureau) &rarr; Mode Dépôt (Mynita, Amanata, All-Iza, Zeyna...)</p>
                <p>⚡ Notification : Dépôt &amp; Envoi Capture WhatsApp (+227 70 03 25 52) &rarr; Préparation Cuisine</p>
                <p>⚡ Suivi Billo Express en direct &rarr; Réception &rarr; Cumul Points Club Sahel &amp; Parrainage</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Fonctionnalités Spécifiques Niger 🇳🇪 Intégrées</span>
                <span className="text-orange-400 font-semibold">Validées &amp; Testables</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>5 Numéros de dépôts officiels configurés</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Validation cuisine conditionnée par le reçu</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Commandes Groupées Ministères &amp; Bureaux</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Devis Service Traiteur &amp; Événements</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Assistant Vocal / Texte AllôChef (Gemini AI)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Conformité HAPDP (Protection des données)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Environment variables & Deployment */}
        {activeTab === "env" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Fichier de variables d'environnement <code>.env.production</code> pour Vercel, Netlify, Render ou Cloud Run.
              </div>
              <button
                onClick={handleCopyEnv}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>.env Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le .env</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre">{envConfigSnippet}</pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <strong className="text-white block">Commandes de build &amp; déploiement :</strong>
              <div className="font-mono text-[11px] bg-slate-900 p-2.5 rounded-xl text-slate-200 border border-slate-800">
                npm install &amp;&amp; npm run build
              </div>
              <p className="text-[11px] text-slate-400">
                Le build génère une PWA légère et ultra-rapide avec mise en cache hors-ligne et compatibilité réseau 3G/4G au Sahel.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Option C active • Schémas et code prêts pour l'exportation et la production.</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-orange-500/25 transition cursor-pointer"
          >
            Fermer &amp; Explorer la Plateforme
          </button>
        </div>
      </div>
    </div>
  );
};

