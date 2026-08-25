import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Store,
  Bike,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  Database,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Gift,
  Award,
  Layers,
  Flame,
  Phone,
  Clock,
  ArrowRight,
  Send,
  Check,
  RefreshCw,
  Package,
  MapPin,
  FileCheck,
} from "lucide-react";
import { RESTAURANTS_DATA, SAUCE_BOXES_DATA, BLOG_POSTS_DATA, ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { MenuItem, SauceBox, CateringQuoteRequest, Order } from "../types";

interface AdminDashboardProps {
  onOpenTechPack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenTechPack }) => {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("admin@alloresto.ne");
  const [adminPassword, setAdminPassword] = useState<string>("Niamey2026!");
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Section Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    "overview" | "menu_dishes" | "sauce_boxes" | "customers_loyalty" | "couriers_delivery" | "events_catering" | "pages_content" | "deposits_validation"
  >("overview");

  // State: Dishes & Menu
  const [dishesList, setDishesList] = useState<MenuItem[]>(
    RESTAURANTS_DATA.flatMap((r) => r.menu)
  );
  const [newDishName, setNewDishName] = useState("");
  const [newDishPrice, setNewDishPrice] = useState(3500);
  const [newDishCategory, setNewDishCategory] = useState("Grillades");
  const [newDishDesc, setNewDishDesc] = useState("Spécialité nigérienne fraîche préparée à la commande.");
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  // State: Sauce Boxes
  const [sauceBoxes, setSauceBoxes] = useState<SauceBox[]>(SAUCE_BOXES_DATA);

  // State: Clients & Sahel Club
  const [clientsList, setClientsList] = useState([
    {
      id: "CLI-101",
      name: "Amadou Seyni",
      email: "amadou.seyni@gmail.com",
      phone: "🇳🇪 +227 96 05 23 10",
      city: "Plateau (Ministère Finances)",
      points: 1450,
      tier: "Or",
      ordersCount: 14,
      totalSpent: 84500,
      referralCode: "AMADOU-SAHEL",
      referredCount: 4,
    },
    {
      id: "CLI-102",
      name: "Mariama Oumarou",
      email: "mariama.cadre@telecom.ne",
      phone: "🇳🇪 +227 90 40 51 18",
      city: "Koira Kano",
      points: 820,
      tier: "Argent",
      ordersCount: 8,
      totalSpent: 49000,
      referralCode: "MARIAMA-227",
      referredCount: 2,
    },
    {
      id: "CLI-103",
      name: "Ibrahim Abdoulaye",
      email: "ibrahim.abdou@bceao.int",
      phone: "🇳🇪 +227 96 12 34 56",
      city: "Terminus / Recasement",
      points: 2300,
      tier: "VIP Sahélien",
      ordersCount: 22,
      totalSpent: 162000,
      referralCode: "IBRAHIM-VIP",
      referredCount: 7,
    },
    {
      id: "CLI-104",
      name: "Aïchatou Garba",
      email: "aicha.garba@anp.ne",
      phone: "🇳🇪 +227 91 88 77 66",
      city: "Yantala",
      points: 310,
      tier: "Bronze",
      ordersCount: 3,
      totalSpent: 19500,
      referralCode: "AICHA-YANTALA",
      referredCount: 1,
    },
  ]);

  // State: Couriers & Delivery Fleet
  const [couriersList, setCouriersList] = useState([
    { id: "BIL-01", name: "Salifou Bello", phone: "🇳🇪 +227 92 08 08 22", bikeModel: "KTM 150cc", status: "available", completedDeliveries: 142, rating: 4.9 },
    { id: "BIL-02", name: "Harouna Moussa", phone: "🇳🇪 +227 96 33 22 11", bikeModel: "Bajaj Boxer", status: "busy", completedDeliveries: 98, rating: 4.8 },
    { id: "BIL-03", name: "Ousmane Diallo", phone: "🇳🇪 +227 90 77 88 99", bikeModel: "Yamaha Crux", status: "available", completedDeliveries: 210, rating: 5.0 },
    { id: "BIL-04", name: "Souleymane K.", phone: "🇳🇪 +227 97 44 55 66", bikeModel: "Haojue 125", status: "offline", completedDeliveries: 74, rating: 4.7 },
  ]);

  // State: Deposits & Receipts verification queue
  const [depositOrders, setDepositOrders] = useState([
    {
      id: "ORD-9421",
      customerName: "Moussa Dan Koulou",
      customerPhone: "🇳🇪 +227 96 05 23 10",
      amount: 6500,
      paymentMethod: "Mynita",
      depositNumber: "+227 90 40 51 18",
      refCode: "MYN-99812",
      hasReceiptProof: true,
      status: "pending_verification",
      time: "Il y a 4 min",
    },
    {
      id: "ORD-9422",
      customerName: "Fatima Ousmane",
      customerPhone: "🇳🇪 +227 90 40 51 18",
      amount: 12000,
      paymentMethod: "Amanata",
      depositNumber: "+227 90 40 51 18",
      refCode: "AMA-4410",
      hasReceiptProof: true,
      status: "pending_verification",
      time: "Il y a 9 min",
    },
    {
      id: "ORD-9423",
      customerName: "Boubacar Hassane",
      customerPhone: "🇳🇪 +227 96 11 22 33",
      amount: 4500,
      paymentMethod: "Zeyna",
      depositNumber: "+227 96 05 23 10",
      refCode: "ZEY-7721",
      hasReceiptProof: false,
      status: "awaiting_receipt",
      time: "Il y a 15 min",
    },
  ]);

  // State: Catering & Events requests
  const [cateringQuotes, setCateringQuotes] = useState<CateringQuoteRequest[]>([
    {
      id: "EVT-801",
      clientName: "Ministère de la Fonction Publique",
      clientPhone: "🇳🇪 +227 96 05 23 10",
      clientEmail: "direction.rh@fonctionpublique.ne",
      eventType: "entreprise",
      guestCount: 65,
      eventDate: "2026-09-12",
      budgetFCFA: 350000,
      location: "Plateau, Salle de Conférence A",
      culinaryPreferences: "Buffet déjeunatoire sahélien, grillades mixtes, brochettes bœuf, dambou et jus naturels de bissap/gingembre.",
      status: "pending",
      createdAt: "2026-08-24 09:30",
    },
    {
      id: "EVT-802",
      clientName: "Famille Garba & Ousmane",
      clientPhone: "🇳🇪 +227 90 40 51 18",
      clientEmail: "garba.famille@gmail.com",
      eventType: "mariage",
      guestCount: 150,
      eventDate: "2026-09-28",
      budgetFCFA: 850000,
      location: "Koira Kano, Espace Réception Kadhafi",
      culinaryPreferences: "Repas complet mariage : Moutons entiers rôtis au feu de bois, sauces traditionnelles Kan-Kan, riz parfumé et plateaux fruits frais.",
      status: "quoted",
      createdAt: "2026-08-23 16:20",
    },
  ]);

  // State: Partner restaurant approvals
  const [partnerRequests, setPartnerRequests] = useState([
    {
      id: "REQ-901",
      name: "Le Dôme & Saveurs du Fleuve",
      owner: "Moussa Garba",
      city: "Niamey (Goudel)",
      cuisine: "Capitaine grillé & Riz Local",
      phone: "+227 96 55 44 33",
      status: "pending",
    },
    {
      id: "REQ-902",
      name: "Kebab & Chawarma de la Mosquée",
      owner: "Mariama Souley",
      city: "Niamey (Grande Mosquée)",
      cuisine: "Chawarmas & Grillades",
      phone: "+227 90 12 34 56",
      status: "pending",
    },
  ]);

  // Admin Login Action
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (adminEmail.trim().toLowerCase() === "admin@alloresto.ne" || adminEmail.includes("@")) {
      if (adminPassword.length >= 4) {
        setIsAdminAuthenticated(true);
      } else {
        setAuthError("Le mot de passe doit comporter au moins 4 caractères.");
      }
    } else {
      setAuthError("Adresse email administrateur invalide.");
    }
  };

  // Quick toggle dish stock
  const handleToggleDishStock = (dishId: string) => {
    setDishesList((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  // Quick toggle Daily Special
  const handleToggleDailySpecial = (dishId: string) => {
    setDishesList((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isDailySpecial: !d.isDailySpecial } : d))
    );
  };

  // Validate deposit receipt
  const handleValidateDeposit = (id: string) => {
    setDepositOrders((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "verified" } : d))
    );
  };

  // Add new dish to menu
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName) return;

    const newDish: MenuItem = {
      id: "dish-" + Date.now(),
      name: newDishName,
      description: newDishDesc,
      price: newDishPrice,
      category: newDishCategory,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      preparationTime: 25,
      isSpicy: false,
      isAvailable: true,
    };

    setDishesList([newDish, ...dishesList]);
    setNewDishName("");
    setShowAddDishModal(false);
  };

  // Update Catering Status
  const handleUpdateCateringStatus = (id: string, status: "pending" | "quoted" | "confirmed") => {
    setCateringQuotes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  // ==========================================
  // VIEW 1: ADMIN LOGIN SCREEN (IF NOT AUTH)
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Espace Direction &amp; Admin HQ</h3>
            <p className="text-xs text-slate-400">
              Plateforme de supervision globale Allôresto Niamey 🇳🇪
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">
                Identifiants Administrateur Démo
              </span>
              <span className="font-mono text-white text-[11px]">admin@alloresto.ne / Niamey2026!</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAdminEmail("admin@alloresto.ne");
                setAdminPassword("Niamey2026!");
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold cursor-pointer transition"
            >
              Préremplir
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Email Administrateur *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@alloresto.ne"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Mot de passe Direction *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showAdminPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Mot de passe sécurisé"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {/* Bouton VU pour le mot de passe */}
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-[10px]"
                  title={showAdminPassword ? "Masquer" : "Afficher (Vu)"}
                >
                  {showAdminPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-purple-400 font-bold hidden sm:inline">Cacher</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-slate-300 font-bold hidden sm:inline">Vu</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Accéder au Panneau d&apos;Administration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
            Protégé par clé d&apos;autorisation 256-bit SSL &bull; Conformité HAPDP Niger
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Supervision Allôresto Niger 🇳🇪</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                Direction HQ (Connecté)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestion centralisée : Menus, Boxs Sauces, Clients, Fidélité, Livreurs, Événements &amp; Reçus
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTechPack && (
            <button
              onClick={onOpenTechPack}
              className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Schéma Supabase SQL</span>
            </button>
          )}

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: "overview", label: "Vue Générale & GMV", icon: TrendingUp },
          { id: "deposits_validation", label: "Validation Dépôts & Reçus", icon: FileCheck, badge: depositOrders.filter(d => d.status === "pending_verification").length },
          { id: "menu_dishes", label: "Plats & Menus", icon: Utensils, count: dishesList.length },
          { id: "sauce_boxes", label: "Boxs Sauces", icon: Flame, count: sauceBoxes.length },
          { id: "customers_loyalty", label: "Clients & Parrainage", icon: Users, count: clientsList.length },
          { id: "couriers_delivery", label: "Livreurs & Logistique", icon: Bike, count: couriersList.length },
          { id: "events_catering", label: "Événements & Traiteur", icon: Calendar, badge: cateringQuotes.filter(c => c.status === "pending").length },
          { id: "pages_content", label: "Pages & Bannières", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & GMV */}
      {/* ======================================================== */}
      {activeAdminTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Volume d&apos;affaires (GMV)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">22 850 000 FCFA</p>
              <span className="text-[10px] text-emerald-400 font-bold">+24.5% ce mois à Niamey</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Commissions Nettes (10%)</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">2 285 000 FCFA</p>
              <span className="text-[10px] text-purple-400 font-bold">Revenu mensuel plateforme</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Commandes du Jour</span>
                <Utensils className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-black text-white">142</p>
              <span className="text-[10px] text-orange-400 font-bold">Panier moyen : 6 200 FCFA</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Flotte Billo Express</span>
                <Bike className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">85 Coursiers</p>
              <span className="text-[10px] text-cyan-400">Temps moyen course : 22 min</span>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Répartition des Règlements par Moyen de Paiement
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Mynita (+227 90 40 51 18)", share: "34%", vol: "7 769 000 FCFA", color: "border-orange-500/40 text-orange-400" },
                { name: "Amanata (+227 90 40 51 18)", share: "22%", vol: "5 027 000 FCFA", color: "border-cyan-500/40 text-cyan-400" },
                { name: "All-Iza Business & Transfer", share: "18%", vol: "4 113 000 FCFA", color: "border-emerald-500/40 text-emerald-400" },
                { name: "Zeyna (+227 96 05 23 10)", share: "12%", vol: "2 742 000 FCFA", color: "border-purple-500/40 text-purple-400" },
              ].map((p, idx) => (
                <div key={idx} className={`p-4 rounded-2xl bg-slate-950 border ${p.color} space-y-1`}>
                  <span className="text-[10px] font-bold text-slate-400 block">{p.name}</span>
                  <p className="text-lg font-black text-white">{p.vol}</p>
                  <span className="text-xs font-semibold">{p.share} des flux</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DEPOSITS & RECEIPTS VALIDATION */}
      {/* ======================================================== */}
      {activeAdminTab === "deposits_validation" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>Contrôle &amp; Validation des Dépôts / Reçus Clients</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Règle plateforme : La commande est confirmée en cuisine après contrôle du reçu ou de la référence de dépôt.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold">
              {depositOrders.filter((d) => d.status === "pending_verification").length} Reçus à vérifier
            </span>
          </div>

          <div className="space-y-3">
            {depositOrders.map((dep) => (
              <div
                key={dep.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{dep.customerName}</span>
                    <span className="text-xs font-mono text-orange-400 font-bold">#{dep.id}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                      {dep.time}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                    <span>📱 {dep.customerPhone}</span>
                    <span>&bull;</span>
                    <span className="text-amber-400 font-bold">Mode : {dep.paymentMethod} ({dep.depositNumber})</span>
                    <span>&bull;</span>
                    <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
                      Réf : {dep.refCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 block">
                      {dep.amount.toLocaleString()} FCFA
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {dep.hasReceiptProof ? "📷 Capture reçu fournie" : "⏳ En attente de capture"}
                    </span>
                  </div>

                  {dep.status === "pending_verification" ? (
                    <button
                      onClick={() => handleValidateDeposit(dep.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valider &amp; Lancer Cuisine</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Dépôt Vérifié</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DISHES & MENU MANAGEMENT */}
      {/* ======================================================== */}
      {activeAdminTab === "menu_dishes" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="text-base font-black text-white">Gestion du Menu &amp; Plats</h3>
              <p className="text-xs text-slate-400">
                Gérez la disponibilité des plats, définissez le Plat du Jour et modifiez les tarifs en FCFA.
              </p>
            </div>
            <button
              onClick={() => setShowAddDishModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Plat au Menu</span>
            </button>
          </div>

          {/* Add Dish Modal simulation */}
          {showAddDishModal && (
            <form onSubmit={handleAddDish} className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Nouveau Plat au Menu
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nom du plat (ex: Demi-Poulet Braisé & Aloco)"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <input
                  type="number"
                  required
                  placeholder="Prix en FCFA"
                  value={newDishPrice}
                  onChange={(e) => setNewDishPrice(Number(e.target.value))}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
                <select
                  value={newDishCategory}
                  onChange={(e) => setNewDishCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="Grillades">Grillades du Sahel</option>
                  <option value="Traditionnel">Traditionnel Nigérien</option>
                  <option value="Burgers">Burgers &amp; Fast-Food</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Boissons">Boissons &amp; Jus Frais</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Description du plat et accompagnements"
                value={newDishDesc}
                onChange={(e) => setNewDishDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Enregistrer le plat
              </button>
            </form>
          )}

          {/* Dishes Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dishesList.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{dish.name}</span>
                    {dish.isDailySpecial && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                        ⭐ Plat du Jour
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{dish.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-bold text-orange-400 font-mono">
                      {dish.price.toLocaleString()} FCFA
                    </span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-[10px] text-slate-400">{dish.category}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 items-end">
                  <button
                    onClick={() => handleToggleDishStock(dish.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                      dish.isAvailable
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-950 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {dish.isAvailable ? "En Stock" : "Rupture Stock"}
                  </button>
                  <button
                    onClick={() => handleToggleDailySpecial(dish.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                      dish.isDailySpecial
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {dish.isDailySpecial ? "Retirer Plat du Jour" : "Mettre en Plat du Jour"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SAUCE BOXES MANAGEMENT */}
      {/* ======================================================== */}
      {activeAdminTab === "sauce_boxes" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Boxs Sauces Artisanales du Sahel</span>
              </h3>
              <p className="text-xs text-slate-400">
                Gérez les bocaux de sauces maison, les prix et les niveaux de piquant.
              </p>
            </div>
            <span className="text-xs text-orange-400 font-bold bg-orange-950/60 px-3 py-1 rounded-xl border border-orange-500/30">
              {sauceBoxes.length} Variétés Actives
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sauceBoxes.map((sauce) => (
              <div key={sauce.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white">{sauce.name}</h4>
                  <span className="text-xs font-bold text-orange-400 font-mono">
                    {sauce.price.toLocaleString()} FCFA
                  </span>
                </div>
                <p className="text-xs text-slate-400">{sauce.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    {sauce.volume}
                  </span>
                  <span className="text-amber-400 font-bold">{sauce.spiceLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: CLIENTS, LOYALTY & REFERRALS */}
      {/* ======================================================== */}
      {activeAdminTab === "customers_loyalty" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Base Clients, Sahel Club &amp; Parrainage</span>
              </h3>
              <p className="text-xs text-slate-400">
                Suivi des points fidélité, codes de parrainage attribués et historique des dépenses.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/40">
              {clientsList.length} Profils Actifs Niamey
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Quartier</th>
                  <th className="p-3">Sahel Club</th>
                  <th className="p-3">Code Parrain</th>
                  <th className="p-3">Commandes</th>
                  <th className="p-3 text-right">Total Dépensé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {clientsList.map((cli) => (
                  <tr key={cli.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-bold text-white">{cli.name}</td>
                    <td className="p-3 text-slate-400">
                      <div>{cli.email}</div>
                      <div className="font-mono text-orange-400 text-[11px]">{cli.phone}</div>
                    </td>
                    <td className="p-3">{cli.city}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
                        {cli.tier} ({cli.points} pts)
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-purple-300">
                      {cli.referralCode}
                      <span className="text-[9px] text-slate-500 block">({cli.referredCount} filleuls)</span>
                    </td>
                    <td className="p-3">{cli.ordersCount} commandes</td>
                    <td className="p-3 text-right font-black text-emerald-400 font-mono">
                      {cli.totalSpent.toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: COURIERS & LOGISTICS (BILLO EXPRESS) */}
      {/* ======================================================== */}
      {activeAdminTab === "couriers_delivery" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bike className="w-5 h-5 text-cyan-400" />
                <span>Flotte de Livraison Billo Express</span>
              </h3>
              <p className="text-xs text-slate-400">
                Suivi des coursiers moto à Niamey, attributions de courses et temps de trajet.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-xl font-bold">
                Partenaire Officiel : +227 92 08 08 22
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {couriersList.map((courier) => (
              <div key={courier.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white">{courier.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      courier.status === "available"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                        : courier.status === "busy"
                        ? "bg-orange-950 text-orange-400 border border-orange-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {courier.status === "available" ? "Disponible" : courier.status === "busy" ? "En course" : "Hors ligne"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{courier.phone}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-300">
                  <span>🏍️ {courier.bikeModel}</span>
                  <span className="font-bold text-amber-400">⭐ {courier.rating} ({courier.completedDeliveries} courses)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: CATERING & EVENTS */}
      {/* ======================================================== */}
      {activeAdminTab === "events_catering" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Demandes de Devis Traiteur &amp; Événements</span>
              </h3>
              <p className="text-xs text-slate-400">
                Mariages, pauses déjeuners ministères, baptêmes et banquets sur mesure.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-500/30">
              {cateringQuotes.length} Demandes
            </span>
          </div>

          <div className="space-y-3">
            {cateringQuotes.map((quote) => (
              <div key={quote.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-black text-white">{quote.clientName}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>📱 {quote.clientPhone}</span>
                      <span>&bull;</span>
                      <span>📅 Date : {quote.eventDate} ({quote.guestCount} personnes)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      Budget : {quote.budgetFCFA.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  <strong>Menu souhaité :</strong> {quote.culinaryPreferences}
                </p>
                <p className="text-xs text-slate-400">
                  📍 <strong>Lieu :</strong> {quote.location}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500">Demande reçue le {quote.createdAt}</span>
                  <div className="flex items-center gap-2">
                    {quote.status === "pending" && (
                      <button
                        onClick={() => handleUpdateCateringStatus(quote.id, "quoted")}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs cursor-pointer"
                      >
                        Envoyer Devis Chiffré
                      </button>
                    )}
                    {quote.status === "quoted" && (
                      <button
                        onClick={() => handleUpdateCateringStatus(quote.id, "confirmed")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Confirmer la Prestation
                      </button>
                    )}
                    {quote.status === "confirmed" && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                        Prestation Confirmée
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: PAGES & CONTENT MANAGEMENT */}
      {/* ======================================================== */}
      {activeAdminTab === "pages_content" && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-black text-white">Gestion des Contenus &amp; Bannières</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bannière Flash Midi au Bureau</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Offre -15% avec le code <strong>BUREAU15</strong> active pour les livraisons ministères de 11h30 à 13h30.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Coordonnées Officielles de Retrait</span>
                  <span className="text-xs text-orange-400 font-mono font-bold">+227 96 05 23 10</span>
                </div>
                <p className="text-xs text-slate-400">
                  Adresse : {ALLORESTO_BRAND_INFO.pickupLocation} &bull; Horaires : {ALLORESTO_BRAND_INFO.openingHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
