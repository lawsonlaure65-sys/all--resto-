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
  Download,
  Upload,
  HardDrive,
  CheckCircle,
} from "lucide-react";
import { RESTAURANTS_DATA, SAUCE_BOXES_DATA, BLOG_POSTS_DATA, ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { MenuItem, SauceBox, CateringQuoteRequest, Order, DishCategory, Restaurant } from "../types";
import { DishManagementModal, CATEGORIES_CONFIG } from "./DishManagementModal";
import {
  loadStoredRestaurants,
  addOrUpdateDishInStorage,
  deleteDishFromStorage,
  exportAllDataBackup,
  importDataBackup,
  resetStoredData,
} from "../services/dishStorageService";

interface AdminDashboardProps {
  onOpenTechPack?: () => void;
  onUpdateRestaurants?: (restaurants: Restaurant[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenTechPack,
  onUpdateRestaurants,
}) => {
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

  // State: Dishes & Menu (Initialized from LocalStorage persistence)
  const [dishesList, setDishesList] = useState<MenuItem[]>(() => {
    const stored = loadStoredRestaurants();
    return stored.flatMap((r) => r.menu);
  });
  const [showDishModal, setShowDishModal] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const backupFileInputRef = React.useRef<HTMLInputElement>(null);

  // Dishes Filter & Search State
  const [dishSearchQuery, setDishSearchQuery] = useState<string>("");
  const [dishCategoryFilter, setDishCategoryFilter] = useState<string>("all");
  const [dishFilterSpicy, setDishFilterSpicy] = useState<boolean>(false);
  const [dishFilterVege, setDishFilterVege] = useState<boolean>(false);
  const [dishFilterHalal, setDishFilterHalal] = useState<boolean>(false);
  const [dishFilterNigerLocal, setDishFilterNigerLocal] = useState<boolean>(false);
  const [dishFilterExpress, setDishFilterExpress] = useState<boolean>(false);

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

  // Dish management modal actions
  const handleOpenAddDish = () => {
    setEditingDish(null);
    setShowDishModal(true);
  };

  const handleOpenEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setShowDishModal(true);
  };

  const handleSaveDishFromModal = (savedDish: MenuItem) => {
    // 1. Update in permanent localStorage
    const updatedRestaurants = addOrUpdateDishInStorage(savedDish);

    // 2. Update local admin list
    setDishesList(updatedRestaurants.flatMap((r) => r.menu));

    // 3. Notify parent app state
    if (onUpdateRestaurants) {
      onUpdateRestaurants(updatedRestaurants);
    }

    setBackupMessage(`Plat "${savedDish.name}" sauvegardé avec succès dans la base permanente !`);
    setTimeout(() => setBackupMessage(null), 4000);

    setShowDishModal(false);
    setEditingDish(null);
  };

  const handleDeleteDish = (dishId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer définitivement ce plat du menu Allôresto ?")) {
      const updatedRestaurants = deleteDishFromStorage(dishId);
      setDishesList(updatedRestaurants.flatMap((r) => r.menu));
      if (onUpdateRestaurants) {
        onUpdateRestaurants(updatedRestaurants);
      }
      setBackupMessage("Plat retiré et base de données synchronisée.");
      setTimeout(() => setBackupMessage(null), 3000);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    exportAllDataBackup();
    setBackupMessage("Fichier de sauvegarde exporté avec succès (sauvegarde locale sécurisée).");
    setTimeout(() => setBackupMessage(null), 4000);
  };

  // Import JSON Backup File
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataBackup(content);
        if (success) {
          const fresh = loadStoredRestaurants();
          setDishesList(fresh.flatMap((r) => r.menu));
          if (onUpdateRestaurants) {
            onUpdateRestaurants(fresh);
          }
          setBackupMessage("Sauvegarde restaurée avec succès ! Les plats sont à jour.");
        } else {
          setBackupMessage("Erreur : Le fichier de sauvegarde est invalide.");
        }
        setTimeout(() => setBackupMessage(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetData = () => {
    if (window.confirm("Voulez-vous réinitialiser les plats aux valeurs par défaut de Niamey ? Vos modifications locales seront remplacées.")) {
      const reset = resetStoredData();
      setDishesList(reset.flatMap((r) => r.menu));
      if (onUpdateRestaurants) {
        onUpdateRestaurants(reset);
      }
      setBackupMessage("Données réinitialisées aux valeurs initiales d'origine.");
      setTimeout(() => setBackupMessage(null), 4000);
    }
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
        <div className="space-y-5">
          {/* Persistence & Backup Status Banner */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">Sauvegarde Permanente Automatique</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active (LocalStorage)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tous les plats, photos compressées et prix ajoutés sont automatiquement conservés même après rechargement.
                </p>
              </div>
            </div>

            {/* Backup Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="file"
                ref={backupFileInputRef}
                onChange={handleImportBackupFile}
                accept=".json"
                className="hidden"
              />

              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Télécharger une copie JSON de tous les plats et cartes"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exporter Sauvegarde</span>
              </button>

              <button
                type="button"
                onClick={() => backupFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Restaurer un fichier de sauvegarde JSON"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Restaurer</span>
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="Rétablir les 65+ plats d'origine de Niamey"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Défaut</span>
              </button>
            </div>
          </div>

          {/* Backup message banner feedback */}
          {backupMessage && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{backupMessage}</span>
            </div>
          )}

          {/* Header & Main Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-wider">
                  Menu &bull; Cuisine &bull; Photothèque
                </span>
                <span className="text-xs text-slate-400">{dishesList.length} plats enregistrés</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">Gestion Complète des Plats &amp; Cartes</h3>
              <p className="text-xs text-slate-400">
                Ajoutez des photos directement de votre galerie, configurez les catégories (Africain, Européen, Boisson...) et filtres experts (Épicé, Végé, Halal, Niger).
              </p>
            </div>

            <button
              onClick={handleOpenAddDish}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Plat (+ Photo Galerie)</span>
            </button>
          </div>

          {/* Search, Categories & Filter Bar */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom de plat, ingrédient ou description..."
                value={dishSearchQuery}
                onChange={(e) => setDishSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setDishCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  dishCategoryFilter === "all"
                    ? "bg-orange-500 text-slate-950 font-black"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                🍽️ Tous les Plats ({dishesList.length})
              </button>

              {CATEGORIES_CONFIG.map((cat) => {
                const isSelected = dishCategoryFilter === cat.id;
                const count = dishesList.filter(
                  (d) => d.dishCategory === cat.id || d.category.toLowerCase().includes(cat.label.toLowerCase())
                ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setDishCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-orange-500 text-slate-950 font-black"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filtres :</span>

              <button
                onClick={() => setDishFilterNigerLocal(!dishFilterNigerLocal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  dishFilterNigerLocal
                    ? "bg-amber-950 text-amber-300 border-amber-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🇳🇪 Terroir Niger</span>
              </button>

              <button
                onClick={() => setDishFilterSpicy(!dishFilterSpicy)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  dishFilterSpicy
                    ? "bg-red-950 text-red-300 border-red-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Épicé</span>
              </button>

              <button
                onClick={() => setDishFilterHalal(!dishFilterHalal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  dishFilterHalal
                    ? "bg-emerald-950 text-emerald-300 border-emerald-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🥩 100% Halal</span>
              </button>

              <button
                onClick={() => setDishFilterVege(!dishFilterVege)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  dishFilterVege
                    ? "bg-green-950 text-green-300 border-green-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>🌱 Végétarien</span>
              </button>

              <button
                onClick={() => setDishFilterExpress(!dishFilterExpress)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  dishFilterExpress
                    ? "bg-cyan-950 text-cyan-300 border-cyan-500"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <span>⚡ Express &lt; 15 min</span>
              </button>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishesList
              .filter((dish) => {
                if (dishSearchQuery.trim()) {
                  const q = dishSearchQuery.toLowerCase();
                  if (!dish.name.toLowerCase().includes(q) && !dish.description.toLowerCase().includes(q)) {
                    return false;
                  }
                }
                if (dishCategoryFilter !== "all") {
                  if (dish.dishCategory) {
                    if (dish.dishCategory !== dishCategoryFilter) return false;
                  } else {
                    const catConfig = CATEGORIES_CONFIG.find((c) => c.id === dishCategoryFilter);
                    if (catConfig && !dish.category.toLowerCase().includes(catConfig.label.toLowerCase())) {
                      return false;
                    }
                  }
                }
                if (dishFilterNigerLocal && !dish.isNigerLocal) return false;
                if (dishFilterSpicy && !dish.isSpicy && (dish.spiceLevel || 0) === 0) return false;
                if (dishFilterHalal && !dish.isHalal) return false;
                if (dishFilterVege && !dish.isVegetarian && !dish.isVegan) return false;
                if (dishFilterExpress && !dish.isExpress && (dish.preparationTime || 20) > 15) return false;
                return true;
              })
              .map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-md"
                >
                  <div className="flex gap-3.5">
                    {/* Dish Photo Thumbnail with quick replace prompt */}
                    <div
                      onClick={() => handleOpenEditDish(dish)}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 cursor-pointer group"
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Edit2 className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>

                    {/* Dish Main Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                          {dish.category}
                        </span>

                        {dish.isDailySpecial && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-black">
                            ⭐ Plat du Jour
                          </span>
                        )}

                        {dish.isNigerLocal && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                            🇳🇪 Terroir
                          </span>
                        )}

                        {dish.isSpicy && (
                          <span className="px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 text-[9px] font-bold border border-red-500/30">
                            {dish.spiceLevel === 3 ? "🔥🔥 Kan-Kan" : dish.spiceLevel === 2 ? "🌶️🌶️ Relevé" : "🌶️ Épicé"}
                          </span>
                        )}

                        {dish.isHalal && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                            Halal
                          </span>
                        )}
                        {dish.isVegetarian && (
                          <span className="px-1.5 py-0.5 rounded bg-green-950/80 text-green-300 text-[9px] font-bold border border-green-500/30">
                            🌱 Végé
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-white">{dish.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-extrabold text-orange-400 font-mono text-sm">
                          {dish.price.toLocaleString()} FCFA
                        </span>
                        {dish.preparationTime && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{dish.preparationTime} min</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleDishStock(dish.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition border ${
                          dish.isAvailable
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                            : "bg-rose-950/80 text-rose-300 border-rose-500/40"
                        }`}
                      >
                        {dish.isAvailable ? "✓ En Stock" : "✕ Rupture"}
                      </button>

                      <button
                        onClick={() => handleToggleDailySpecial(dish.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition border ${
                          dish.isDailySpecial
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {dish.isDailySpecial ? "⭐ Plat du Jour" : "Mettre du Jour"}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditDish(dish)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-orange-400 border border-slate-800 transition cursor-pointer"
                        title="Modifier photo, détails ou filtres"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                        title="Supprimer ce plat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

      {/* Dish Add/Edit Modal */}
      {showDishModal && (
        <DishManagementModal
          isOpen={showDishModal}
          onClose={() => {
            setShowDishModal(false);
            setEditingDish(null);
          }}
          onSaveDish={handleSaveDishFromModal}
          initialDish={editingDish}
        />
      )}
    </div>
  );
};
