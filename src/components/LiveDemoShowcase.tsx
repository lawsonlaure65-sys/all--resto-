import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Bell,
  Wifi,
  WifiOff,
  Download,
  ShoppingBag,
  Sparkles,
  Layers,
  Briefcase,
  Bot,
  Plus,
  ArrowRight,
  CreditCard,
  Send,
  Calendar,
  X,
  Search,
  Activity,
  UserCheck,
  Globe,
} from "lucide-react";

type DeviceType = "mobile" | "tablet" | "desktop";
type DemoTab = "pwa" | "showcase" | "saas" | "ecommerce" | "business_ai";

export const LiveDemoShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>("pwa");
  const [device, setDevice] = useState<DeviceType>("mobile");

  // PWA Demo States
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [pwaActiveNav, setPwaActiveNav] = useState<"home" | "stats" | "notif" | "profile">("home");

  // SaaS Demo States
  const [userRole, setUserRole] = useState<"admin" | "manager" | "member">("admin");
  const [saasPeriod, setSaasPeriod] = useState<"7d" | "30d" | "1y">("30d");

  // E-commerce Demo States
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [productCategory, setProductCategory] = useState<string>("Tous");

  // Business CRM & AI Demo States
  const [crmLeads, setCrmLeads] = useState([
    { id: 1, name: "Marc Delattre", company: "AeroTech", value: "4 800 €", stage: "Nouveau" },
    { id: 2, name: "Claire Vasseur", company: "Luxe & Co", value: "12 500 €", stage: "Qualifié" },
    { id: 3, name: "Thomas Morel", company: "BioHealth SaaS", value: "8 200 €", stage: "Devis" },
  ]);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState<string | null>(null);

  // E-commerce sample products
  const products = [
    { id: 1, name: "Casque Audio Hi-Fi Sans Fil", category: "Audio", price: 249, rating: "4.9", badge: "Populaire" },
    { id: 2, name: "Montre Connectée Sport PWA", category: "Tech", price: 189, rating: "4.8", badge: "Nouveau" },
    { id: 3, name: "Clavier Mécanique Ergonomique", category: "Design", price: 145, rating: "5.0", badge: "Pro" },
    { id: 4, name: "Lampe de Bureau Minimaliste", category: "Design", price: 79, rating: "4.7", badge: "" },
  ];

  const addToCart = (product: { id: number; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
      setCartOpen(false);
    }, 2800);
  };

  const triggerNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  const runAiAnalysis = () => {
    setAiAnalyzing(true);
    setAiSummaryResult(null);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiSummaryResult(
        "Synthèse IA : Opportunité qualifiée à fort potentiel. Décideur identifié (Marc D., CTO). Recommandation : Proposer l'architecture PWA avec module de paiement Stripe et devis 4 800 € sous 24h."
      );
    }, 1200);
  };

  const advanceLead = (leadId: number) => {
    setCrmLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const stages = ["Nouveau", "Qualifié", "Devis", "Gagné"];
          const currentIndex = stages.indexOf(lead.stage);
          const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
          return { ...lead, stage: nextStage };
        }
        return lead;
      })
    );
  };

  return (
    <section id="demos" className="py-20 bg-slate-900/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Laboratoire Interactif &amp; Simulateur PWA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Testez nos prototypes interactifs en direct
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Basculez entre les formats (Mobile PWA, Tablette, Desktop) pour découvrir la fluidité, la réactivité et les fonctions avancées que nous concevons pour vos projets.
          </p>
        </div>

        {/* Prototype Archetype Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <button
            id="demo-tab-pwa"
            onClick={() => {
              setActiveTab("pwa");
              setDevice("mobile");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "pwa"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. PWA Mobile App</span>
          </button>

          <button
            id="demo-tab-showcase"
            onClick={() => setActiveTab("showcase")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "showcase"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2. Site Vitrine Conversion</span>
          </button>

          <button
            id="demo-tab-saas"
            onClick={() => setActiveTab("saas")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "saas"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Plateforme SaaS &amp; Auth</span>
          </button>

          <button
            id="demo-tab-ecommerce"
            onClick={() => setActiveTab("ecommerce")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "ecommerce"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>4. E-Commerce Rapide</span>
          </button>

          <button
            id="demo-tab-business"
            onClick={() => setActiveTab("business_ai")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "business_ai"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>5. Outil Métier &amp; IA</span>
          </button>
        </div>

        {/* Emulator Wrapper Container */}
        <div className="bg-slate-950 rounded-2xl p-4 sm:p-8 border border-slate-800 shadow-2xl">
          {/* Emulator Top Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  {activeTab === "pwa" && "pwa://pulse-app.local (Mobile Web)"}
                  {activeTab === "showcase" && "https://prestige-agency.fr"}
                  {activeTab === "saas" && "https://app.metricpulse.io/dashboard"}
                  {activeTab === "ecommerce" && "https://aura-store.com"}
                  {activeTab === "business_ai" && "https://crm.worksuite.internal"}
                </span>
              </div>
            </div>

            {/* Device Frame Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                id="device-mobile-btn"
                onClick={() => setDevice("mobile")}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  device === "mobile" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
                title="Format Smartphone PWA"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile (PWA)</span>
              </button>

              <button
                id="device-tablet-btn"
                onClick={() => setDevice("tablet")}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  device === "tablet" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
                title="Format Tablette"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablette</span>
              </button>

              <button
                id="device-desktop-btn"
                onClick={() => setDevice("desktop")}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  device === "desktop" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
                title="Format Grand Écran"
              >
                <Laptop className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>
          </div>

          {/* Device Frame Display Area */}
          <div className="flex justify-center items-start min-h-[560px]">
            <div
              className={`transition-all duration-300 ease-out ${
                device === "mobile"
                  ? "w-full max-w-[390px] rounded-[42px] border-[10px] border-slate-800 shadow-2xl p-2 bg-slate-900"
                  : device === "tablet"
                  ? "w-full max-w-[680px] rounded-[32px] border-[8px] border-slate-800 shadow-2xl p-3 bg-slate-900"
                  : "w-full max-w-5xl rounded-2xl border border-slate-800 shadow-2xl bg-slate-900 p-2"
              }`}
            >
              {/* Inner Screen Canvas */}
              <div className="bg-slate-950 rounded-[28px] overflow-hidden min-h-[500px] flex flex-col text-slate-100 relative">
                
                {/* 1. DEMO: PWA MOBILE APP */}
                {activeTab === "pwa" && (
                  <div className="flex-1 flex flex-col justify-between h-full bg-slate-950 p-4">
                    {/* Simulated Mobile Status Bar */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800/80">
                      <span className="font-semibold">09:41</span>
                      <div className="flex items-center gap-2">
                        {isOffline ? (
                          <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <WifiOff className="w-3.5 h-3.5" /> Hors-ligne
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Wifi className="w-3.5 h-3.5" /> 5G Connecté
                          </span>
                        )}
                        <span className="w-4 h-2 rounded-sm border border-slate-400 relative">
                          <span className="absolute left-0 top-0 bottom-0 bg-emerald-400 w-3/4 rounded-2xs" />
                        </span>
                      </div>
                    </div>

                    {/* Notification Toast Alert */}
                    <AnimatePresence>
                      {notificationSent && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="mt-2 p-3 rounded-xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs flex items-center gap-2 shadow-lg"
                        >
                          <Bell className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
                          <div>
                            <p className="font-bold">Notification Push PWA</p>
                            <p className="text-[11px] text-cyan-300/90">Votre session coaching et vos objectifs du jour sont synchronisés !</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* PWA Install Banner */}
                    {!pwaInstalled ? (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-500/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                            PWA
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Installer Pulse App</p>
                            <p className="text-[10px] text-slate-300">Ajouter à l&apos;écran d&apos;accueil 1-clic</p>
                          </div>
                        </div>
                        <button
                          id="pwa-install-btn"
                          onClick={() => {
                            setPwaInstalled(true);
                            confetti({ particleCount: 40, spread: 50 });
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Installer
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Application installée en mode natif (Standalone)</span>
                      </div>
                    )}

                    {/* Main PWA Content */}
                    <div className="my-4 space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Bonjour Thomas,</p>
                          <h3 className="text-base font-bold text-white">Vos performances PWA</h3>
                        </div>
                        <button
                          id="pwa-test-notif-btn"
                          onClick={triggerNotification}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                          title="Tester une notification push"
                        >
                          <Bell className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Push</span>
                        </button>
                      </div>

                      {/* Interactive Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Vitesse chargement</p>
                          <p className="text-lg font-black text-cyan-400 mt-1">0.42 s</p>
                          <p className="text-[10px] text-emerald-400">⚡ Instantané (Cache)</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Taille PWA</p>
                          <p className="text-lg font-black text-blue-400 mt-1">1.8 Mo</p>
                          <p className="text-[10px] text-slate-300">vs 85 Mo app native</p>
                        </div>
                      </div>

                      {/* Offline Mode Switcher */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">Simuler mode hors-ligne</p>
                          <p className="text-[10px] text-slate-400">Teste la persistance locale IndexedDB</p>
                        </div>
                        <button
                          id="pwa-offline-toggle"
                          onClick={() => setIsOffline(!isOffline)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            isOffline ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {isOffline ? "Hors-Ligne Actif" : "En Ligne"}
                        </button>
                      </div>
                    </div>

                    {/* PWA Bottom Navigation Bar */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-xs">
                      <button
                        onClick={() => setPwaActiveNav("home")}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg cursor-pointer ${
                          pwaActiveNav === "home" ? "text-cyan-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px]">Accueil</span>
                      </button>
                      <button
                        onClick={() => setPwaActiveNav("stats")}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg cursor-pointer ${
                          pwaActiveNav === "stats" ? "text-cyan-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                        <span className="text-[10px]">Modules</span>
                      </button>
                      <button
                        onClick={() => setPwaActiveNav("profile")}
                        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg cursor-pointer ${
                          pwaActiveNav === "profile" ? "text-cyan-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                        <span className="text-[10px]">Profil</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. DEMO: SITE VITRINE HAUT DE GAMME */}
                {activeTab === "showcase" && (
                  <div className="p-4 sm:p-6 space-y-5 flex-1">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="font-extrabold tracking-wider text-sm text-cyan-400">PRESTIGE ARCHITECTURE</span>
                      <button className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold">
                        Prendre RDV
                      </button>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Cabinet &amp; Immobilier</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        L&apos;excellence architecturale, valorisée en ligne.
                      </h3>
                      <p className="text-xs text-slate-300">
                        Design d&apos;auteur, conversion de prospects qualifiés et score SEO 100 garanti.
                      </p>
                    </div>
                    {/* Interactive Showcase Portfolio Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group hover:border-cyan-500/50 transition-colors">
                        <div className="h-20 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400 font-semibold mb-2">
                          Villa Azur 450m²
                        </div>
                        <p className="text-xs font-bold text-white">Résidence Privée</p>
                        <p className="text-[10px] text-cyan-400">Voir le projet &rarr;</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group hover:border-cyan-500/50 transition-colors">
                        <div className="h-20 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400 font-semibold mb-2">
                          Siège Social Paris 8e
                        </div>
                        <p className="text-xs font-bold text-white">Espace Tertiaire</p>
                        <p className="text-[10px] text-cyan-400">Voir le projet &rarr;</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DEMO: SAAS DASHBOARD & ROLE SWITCHER */}
                {activeTab === "saas" && (
                  <div className="p-4 sm:p-6 space-y-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white">MetricPulse SaaS Analytics</h3>
                        <p className="text-[11px] text-slate-400">Multi-tenant &amp; Gestion des droits RBAC</p>
                      </div>
                      {/* Role Switcher */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 px-1.5">Rôle :</span>
                        {(["admin", "manager", "member"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setUserRole(r)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase cursor-pointer ${
                              userRole === r ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SaaS KPI Cards */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-slate-400">Revenu MRR</p>
                        <p className="text-base font-bold text-white">18 450 €</p>
                        <span className="text-[9px] text-emerald-400 font-semibold">+14.2%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-slate-400">Utilisateurs</p>
                        <p className="text-base font-bold text-white">2 480</p>
                        <span className="text-[9px] text-emerald-400 font-semibold">+82 cette sem.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <p className="text-[10px] text-slate-400">Churn</p>
                        <p className="text-base font-bold text-white">0.7 %</p>
                        <span className="text-[9px] text-cyan-400 font-semibold">Optimal</span>
                      </div>
                    </div>

                    {/* Role-Specific Action Controls */}
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                      <p className="text-xs font-semibold text-white mb-2">Permissions actives pour ({userRole.toUpperCase()}) :</p>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                          Lecture analytique
                        </span>
                        {(userRole === "admin" || userRole === "manager") && (
                          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300">
                            Inviter des collaborateurs
                          </span>
                        )}
                        {userRole === "admin" && (
                          <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                            Configuration Stripe &amp; Webhooks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. DEMO: E-COMMERCE RAPIDE & STRIPE CHECKOUT */}
                {activeTab === "ecommerce" && (
                  <div className="p-4 space-y-4 flex-1 relative">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white">Aura Store E-Commerce</h3>
                        <p className="text-[10px] text-slate-400">Tunnel optimisé, paiement instantané</p>
                      </div>
                      <button
                        id="ecommerce-cart-toggle"
                        onClick={() => setCartOpen(true)}
                        className="relative p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {cart.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                            {cart.reduce((a, b) => a + b.qty, 0)}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {products.map((p) => (
                        <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-cyan-400 uppercase">{p.category}</span>
                            <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                            <p className="text-sm font-black text-cyan-300 mt-1">{p.price} €</p>
                          </div>
                          <button
                            onClick={() => addToCart(p)}
                            className="mt-2 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Ajouter
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Cart Drawer Flyout */}
                    <AnimatePresence>
                      {cartOpen && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute inset-0 bg-slate-950/95 p-4 rounded-2xl flex flex-col justify-between z-20 border border-slate-800"
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                                Mon Panier ({cart.reduce((a, b) => a + b.qty, 0)} articles)
                              </h4>
                              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="my-3 space-y-2 max-h-48 overflow-y-auto">
                              {cart.length === 0 ? (
                                <p className="text-xs text-slate-400 py-4 text-center">Votre panier est vide.</p>
                              ) : (
                                cart.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                                    <span>{item.name} (x{item.qty})</span>
                                    <span className="font-bold text-cyan-400">{item.price * item.qty} €</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-white mb-3">
                              <span>Total TTC :</span>
                              <span className="text-cyan-400">
                                {cart.reduce((a, b) => a + b.price * b.qty, 0)} €
                              </span>
                            </div>

                            {checkoutSuccess ? (
                              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs text-center font-bold">
                                ✓ Paiement Stripe réussi ! Commande validée.
                              </div>
                            ) : (
                              <button
                                disabled={cart.length === 0}
                                onClick={handleCheckout}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                <CreditCard className="w-4 h-4" />
                                Payer en 1-clic (Apple Pay / Stripe)
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 5. DEMO: OUTIL MÉTIER & IA (CRM + SYNTHÈSE) */}
                {activeTab === "business_ai" && (
                  <div className="p-4 space-y-4 flex-1">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h3 className="text-sm font-bold text-white">CRM &amp; Automatisation IA</h3>
                        <p className="text-[10px] text-slate-400">Pipeline de vente &amp; analyse automatique</p>
                      </div>
                      <button
                        onClick={runAiAnalysis}
                        disabled={aiAnalyzing}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-500/25 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: aiAnalyzing ? '1s' : '0s' }} />
                        <span>{aiAnalyzing ? "Analyse..." : "Synthèse IA"}</span>
                      </button>
                    </div>

                    {/* AI Result Box */}
                    {aiSummaryResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/40 text-[11px] text-slate-200 leading-relaxed"
                      >
                        <p className="font-bold text-rose-400 mb-1 flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" /> Analyse IA Gemini 3.7
                        </p>
                        {aiSummaryResult}
                      </motion.div>
                    )}

                    {/* Kanban Pipeline Items */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prospects en cours (Cliquez pour faire avancer le statut) :</p>
                      {crmLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => advanceLead(lead.id)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{lead.name}</p>
                            <p className="text-[10px] text-slate-400">{lead.company} &bull; {lead.value}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.stage === "Gagné"
                              ? "bg-emerald-950 border border-emerald-500/40 text-emerald-300"
                              : lead.stage === "Devis"
                              ? "bg-blue-950 border border-blue-500/40 text-blue-300"
                              : "bg-slate-800 text-slate-300"
                          }`}>
                            {lead.stage} &rarr;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
