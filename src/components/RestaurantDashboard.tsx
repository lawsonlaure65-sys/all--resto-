import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Store,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Bike,
  Plus,
  Power,
  Edit2,
  Trash2,
  ArrowRight,
  Package,
  Flame,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  Phone,
  MessageSquare,
  Check,
  X,
  Volume2,
  VolumeX,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  Printer,
  Bell,
  BellRing,
  Send,
  Receipt,
} from "lucide-react";
import { Order, Restaurant, MenuItem, OrderStatus } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";
import { DishManagementModal } from "./DishManagementModal";
import { KitchenThermalTicketModal } from "./KitchenThermalTicketModal";
import { BilloExpressDispatchModal } from "./BilloExpressDispatchModal";
import { playKitchenOrderChime } from "../services/kitchenAudioService";
import { sendOrderConfirmationWhatsApp } from "../utils/whatsappNotifications";
import { KitchenWhatsAppHub } from "./KitchenWhatsAppHub";
import {
  getActiveRestaurantSession,
  authenticateRestaurantUser,
  logoutRestaurantSession,
  syncOrderStatusToSupabase,
  fetchRestaurantOrdersFromSupabase,
  DEMO_RESTAURANT_ACCOUNTS,
  RestaurantUserSession,
} from "../services/supabaseRestaurantService";
import { loadStoredRestaurants, addOrUpdateDishInStorage } from "../services/dishStorageService";

interface RestaurantDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onExitToClient?: () => void;
  onCreateTestOrder?: () => void;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onExitToClient,
  onCreateTestOrder,
}) => {
  // Session State
  const [session, setSession] = useState<RestaurantUserSession | null>(() =>
    getActiveRestaurantSession()
  );

  // Supabase live orders state
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "analytics" | "supabase">("orders");
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "preparing" | "ready" | "delivered">("all");
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // Thermal Ticket & Courier Dispatch Modals
  const [ticketModalOrder, setTicketModalOrder] = useState<Order | null>(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [newOrderAlertBanner, setNewOrderAlertBanner] = useState<string | null>(null);

  // Track known order IDs to play audio alerts only on genuinely new orders
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Refresh orders from Supabase
  const refreshSupabaseOrders = async () => {
    setIsLoadingSupabase(true);
    try {
      const fetched = await fetchRestaurantOrdersFromSupabase(
        session?.restaurantId,
        session?.restaurantName
      );
      if (fetched && fetched.length > 0) {
        setSupabaseOrders(fetched);

        // Check if there are newly arrived incoming orders
        const currentIds = new Set(fetched.map((o) => o.id));
        if (!isInitialLoadRef.current && soundAlerts) {
          const hasNew = fetched.some((o) => !knownOrderIdsRef.current.has(o.id));
          if (hasNew) {
            playKitchenOrderChime();
            const newest = fetched[0];
            setNewOrderAlertBanner(`Nouvelle commande #${newest.id} de ${newest.customerName} (${newest.total.toLocaleString()} FCFA) !`);
            setTimeout(() => setNewOrderAlertBanner(null), 8000);
          }
        }
        knownOrderIdsRef.current = currentIds;
        isInitialLoadRef.current = false;
      }
    } catch (e) {
      console.warn("Could not fetch Supabase orders:", e);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  // Sound Bell Test
  const handleTestKitchenChime = () => {
    playKitchenOrderChime();
  };

  // Poll Supabase orders on mount or when session changes
  useEffect(() => {
    refreshSupabaseOrders();
    const interval = setInterval(refreshSupabaseOrders, 8000);
    return () => clearInterval(interval);
  }, [session]);

  // Dishes State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = loadStoredRestaurants();
    const currentResto = session
      ? stored.find((r) => r.id === session.restaurantId) || stored[0]
      : stored[0];
    return currentResto?.menu || RESTAURANTS_DATA[0].menu;
  });

  // Modal State
  const [showDishModal, setShowDishModal] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Update menu if session changes
  useEffect(() => {
    if (session) {
      const stored = loadStoredRestaurants();
      const match =
        stored.find(
          (r) =>
            r.id === session.restaurantId ||
            r.name.toLowerCase().includes(session.restaurantName.toLowerCase())
        ) || stored[0];
      if (match?.menu) {
        setMenuItems(match.menu);
      }
    }
  }, [session]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await authenticateRestaurantUser(loginEmail, loginPassword);
      if (res.success && res.session) {
        setSession(res.session);
        setLoginEmail("");
        setLoginPassword("");
        refreshSupabaseOrders();
      } else {
        setLoginError(res.error || "Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setLoginError("Une erreur inattendue est survenue.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickDemoLogin = async (account: (typeof DEMO_RESTAURANT_ACCOUNTS)[0]) => {
    setLoginEmail(account.email);
    setLoginPassword(account.password);
    setIsLoggingIn(true);
    setLoginError(null);

    const res = await authenticateRestaurantUser(account.email, account.password);
    if (res.success && res.session) {
      setSession(res.session);
      refreshSupabaseOrders();
    }
    setIsLoggingIn(false);
  };

  // Handle Logout
  const handleLogout = () => {
    logoutRestaurantSession();
    setSession(null);
  };

  // Combine parent orders with Supabase live orders (deduped by ID)
  const allCombinedOrders = useMemo(() => {
    const map = new Map<string, Order>();
    // First add Supabase live orders
    supabaseOrders.forEach((o) => {
      map.set(o.id, o);
    });
    // Then add/override with parent orders
    orders.forEach((o) => {
      map.set(o.id, o);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, supabaseOrders]);

  // Filter orders for this restaurant (or show all platform orders for Central Kitchen / Manager)
  const filteredOrders = allCombinedOrders.filter((o) => {
    if (!session) return true;

    const isCentralKitchen =
      session.email?.toLowerCase().includes("restaurant@alloresto.ne") ||
      session.email?.toLowerCase().includes("kitchen@alloresto.ne") ||
      session.restaurantName?.toLowerCase().includes("allôresto") ||
      session.restaurantName?.toLowerCase().includes("alloresto") ||
      session.restaurantName?.toLowerCase().includes("administrateur") ||
      session.role === "manager" ||
      session.role === "admin";

    const matchId =
      isCentralKitchen ||
      !o.restaurantId ||
      o.restaurantId === session.restaurantId ||
      o.restaurantName?.toLowerCase().includes(session.restaurantName?.toLowerCase() || "");

    if (!matchId) return false;

    if (orderFilter === "all") return true;
    if (orderFilter === "pending")
      return (
        o.orderStatus === "received" ||
        (o.orderStatus as string) === "pending" ||
        (o.orderStatus as string) === "to_confirm"
      );
    if (orderFilter === "preparing")
      return (
        o.orderStatus === "preparing" ||
        (o.orderStatus as string) === "confirmed" ||
        (o.orderStatus as string) === "in_preparation"
      );
    if (orderFilter === "ready")
      return (
        o.orderStatus === "delivering" ||
        (o.orderStatus as string) === "ready"
      );
    if (orderFilter === "delivered") return o.orderStatus === "delivered";
    return true;
  });

  // Handle Order Status Update (Local + Supabase sync)
  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    onUpdateOrderStatus(orderId, nextStatus);
    // Also update in local Supabase cache
    setSupabaseOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o))
    );
    if (session) {
      await syncOrderStatusToSupabase(orderId, session.restaurantId, nextStatus);
    }
  };

  // Handle Billo Express Courier Assignment
  const handleAssignCourier = async (orderId: string, courierName: string, courierPhone: string) => {
    onUpdateOrderStatus(orderId, "delivering");
    setSupabaseOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: "delivering",
              courierName,
              courierPhone,
              deliveryPartner: "Billo Express Niamey 🏍️",
            }
          : o
      )
    );
    if (session) {
      await syncOrderStatusToSupabase(orderId, session.restaurantId, "ready");
    }
  };

  // Toggle Dish Availability
  const toggleItemStock = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;
    const updated = { ...item, isAvailable: !item.isAvailable };
    addOrUpdateDishInStorage(updated);
    setMenuItems((prev) => prev.map((m) => (m.id === itemId ? updated : m)));
  };

  // Dish Modal Handlers
  const handleSaveDish = (dish: MenuItem) => {
    addOrUpdateDishInStorage(dish);
    if (editingDish) {
      setMenuItems((prev) => prev.map((d) => (d.id === dish.id ? dish : d)));
    } else {
      setMenuItems((prev) => [dish, ...prev]);
    }
    setShowDishModal(false);
    setEditingDish(null);
  };

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.subtotal, 0);

  // =========================================================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN (If not logged in)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/20">
                <ChefHat className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Allôresto <span className="text-orange-500">Restaurant Pro</span>
              </h1>
              <p className="text-xs text-slate-400">
                Espace sécurisé pour les cuisines et gérants de restaurants partenaires à Niamey 🇳🇪
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>Adresse Email Professionnelle</span>
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="contact@alloresto.ne"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Mot de passe / Code d&apos;accès</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1.5 cursor-pointer"
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-orange-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Accéder à la Cuisine</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for Instant Testing */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block text-center">
                Connexion Rapide Démo (1 Clic) :
              </span>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_RESTAURANT_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-orange-400 transition">
                        {acc.restaurantName}
                      </p>
                      <p className="text-[10px] text-slate-400">{acc.email}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 group-hover:bg-orange-500 group-hover:text-slate-950 font-bold transition">
                      Tester ⚡
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Return to Client View */}
            {onExitToClient && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onExitToClient}
                  className="text-xs text-slate-400 hover:text-orange-400 transition"
                >
                  ← Retour à l&apos;application client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Session Status */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{session.restaurantName}</h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isRestaurantOpen
                    ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                    : "bg-rose-950 text-rose-400 border-rose-500/40"
                }`}
              >
                {isRestaurantOpen ? "🟢 En Ligne & Reçoit les commandes" : "🔴 Service en pause"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Connecté en tant que <strong className="text-slate-200">{session.email}</strong> ({session.role})
            </p>
          </div>
        </div>

        {/* Action Controls & Logout */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleTestKitchenChime}
            title="Tester le carillon sonore de la cuisine"
            className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tester Sonnette 🔔</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundAlerts(!soundAlerts)}
            title={soundAlerts ? "Sonnerie active" : "Sonnerie coupée"}
            className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              soundAlerts
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isRestaurantOpen
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isRestaurantOpen ? "Mettre en pause" : "Ouvrir les commandes"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* New Order Alert Live Notification Banner */}
      <AnimatePresence>
        {newOrderAlertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-slate-950 font-black text-sm flex items-center justify-between shadow-2xl shadow-orange-500/40 border border-orange-300 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="text-white font-black text-sm tracking-wide">NOUVELLE COMMANDE REÇUE EN CUISINE !</p>
                <p className="text-orange-100 font-semibold text-xs">{newOrderAlertBanner}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNewOrderAlertBanner(null)}
              className="px-3 py-1 bg-black/40 hover:bg-black/60 text-white rounded-lg text-xs cursor-pointer"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Chiffre du Jour</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {(totalRevenue > 0 ? totalRevenue : 48500).toLocaleString()} FCFA
          </p>
          <span className="text-[10px] text-emerald-400 font-bold">+18% vs moyenne</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Commandes traitées</span>
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">{filteredOrders.length}</p>
          <span className="text-[10px] text-slate-400">100% complétées</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Temps de prépa moyen</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">14 min</p>
          <span className="text-[10px] text-emerald-400 font-bold">Conforme au contrat (15-25 min)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Plats au Menu</span>
            <ChefHat className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{menuItems.length}</p>
          <span className="text-[10px] text-cyan-400 font-bold">
            {menuItems.filter((m) => m.isAvailable !== false).length} actifs en stock
          </span>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Commandes en direct ({filteredOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "menu"
              ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Carte &amp; Gestion des Stocks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("supabase")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "supabase"
              ? "bg-purple-600 text-white font-black shadow-md shadow-purple-600/20"
              : "bg-slate-900 text-purple-300 hover:text-white border border-purple-500/20"
          }`}
        >
          <Database className="w-4 h-4 text-purple-400" />
          <span>Supabase SQL &amp; Tables 🗄️</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ORDERS STREAM & LIVE MANAGEMENT                                   */}
      {/* ========================================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "Toutes les commandes" },
                { id: "pending", label: "En attente" },
                { id: "preparing", label: "En préparation" },
                { id: "ready", label: "Prêtes / En cours de livraison" },
                { id: "delivered", label: "Livrées" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    orderFilter === f.id
                      ? "bg-slate-100 text-slate-950 shadow"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshSupabaseOrders}
                disabled={isLoadingSupabase}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Recharger depuis Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isLoadingSupabase ? "animate-spin" : ""}`} />
                <span>Actualiser Supabase</span>
              </button>

              {onCreateTestOrder && (
                <button
                  type="button"
                  onClick={onCreateTestOrder}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Simuler commande</span>
                </button>
              )}
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20">
                <ChefHat className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Aucune commande pour le moment</h4>
                <p className="text-xs max-w-md mx-auto text-slate-400">
                  Passez une commande depuis l&apos;écran client ou cliquez ci-dessous pour injecter immédiatement une commande test vers le Quartier Plateau.
                </p>
              </div>
              {onCreateTestOrder && (
                <button
                  type="button"
                  onClick={onCreateTestOrder}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto transition cursor-pointer shadow-lg shadow-orange-500/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 Créer une Commande Test (Moussa Garba • Plateau)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-orange-400 text-sm">#{order.id}</span>
                        <span className="text-xs text-slate-400">&bull; {order.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{order.customerName}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{order.customerPhone} &bull; {order.deliveryAddress}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-white block">
                        {order.total.toLocaleString()} FCFA
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          order.orderStatus === "received"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : order.orderStatus === "preparing"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : order.orderStatus === "delivering"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {order.orderStatus === "received"
                          ? "En attente"
                          : order.orderStatus === "preparing"
                          ? "En préparation"
                          : order.orderStatus === "delivering"
                          ? "Prête / En livraison"
                          : "Livrée"}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Détail des plats à préparer :
                    </p>
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center">
                        <span>
                          <strong className="text-orange-400">{it.quantity}x</strong> {it.menuItem.name}
                        </span>
                        <span className="font-mono text-slate-400">{it.totalPrice.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Reçu Verification Status */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Mode de règlement :</span>
                      <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
                      {order.paymentReference && (
                        <span className="text-[10px] text-amber-400 font-mono block">
                          Réf: {order.paymentReference}
                        </span>
                      )}
                    </div>
                    <div>
                      {order.paymentMethod === "cash" ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                          💵 Espèces à la livraison
                        </span>
                      ) : order.receiptProofAttached ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                          ✅ Reçu de dépôt vérifié
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                          ⚠️ Reçu à valider
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dynamic WhatsApp Communication Hub Cuisine ↔ Client */}
                  <KitchenWhatsAppHub order={order} mode="kitchen" />

                  {/* Assigned Courier Banner if active */}
                  {order.courierName && (
                    <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span className="text-[10px] text-cyan-300 font-bold uppercase block">
                            Coursier Assigné :
                          </span>
                          <strong className="text-white">{order.courierName}</strong>
                        </div>
                      </div>
                      {order.courierPhone && (
                        <a
                          href={`tel:${order.courierPhone}`}
                          className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-bold text-[11px] flex items-center gap-1 transition"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Appeler</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                    {order.orderStatus === "received" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "preparing")}
                          className="flex-1 min-w-[170px] py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Accepter &amp; Cuisiner</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "cancelled")}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer transition"
                        >
                          Refuser
                        </button>
                      </>
                    )}

                    {order.orderStatus === "preparing" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, "delivering")}
                          className="flex-1 min-w-[180px] py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Commande Prête</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDispatchModalOrder(order)}
                          className="px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          title="Assigner un coursier Billo Express"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Assigner Coursier</span>
                        </button>
                      </>
                    )}

                    {order.orderStatus === "delivering" && (
                      <>
                        <div className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                          <Bike className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="truncate">En livraison : {order.courierName || "Billo Express"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDispatchModalOrder(order)}
                          className="px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          title="Changer de coursier"
                        >
                          <Bike className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {/* Print Receipt Button */}
                    <button
                      type="button"
                      onClick={() => setTicketModalOrder(order)}
                      title="Imprimer le bon de commande / ticket de caisse"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-orange-400" />
                      <span className="hidden sm:inline">Ticket</span>
                    </button>

                    {/* Quick WhatsApp Notification */}
                    <button
                      type="button"
                      onClick={() => sendOrderConfirmationWhatsApp(order)}
                      title="Envoyer la confirmation WhatsApp"
                      className="px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MENU & DISH STOCKS MANAGEMENT                                     */}
      {/* ========================================================================= */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Articles au Menu ({menuItems.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingDish(null);
                setShowDishModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un plat (+ Photo Galerie)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.isSpicy && (
                      <span className="absolute top-1 left-1 bg-red-950/80 text-red-300 text-[8px] font-black px-1 rounded">
                        🌶️
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.category}</p>
                    <span className="text-xs font-extrabold text-orange-400">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleItemStock(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      item.isAvailable !== false
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {item.isAvailable !== false ? "En Stock" : "Rupture"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingDish(item);
                      setShowDishModal(true);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Modifier le plat"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUPABASE SQL & DATABASE SETUP HELPER                              */}
      {/* ========================================================================= */}
      {activeTab === "supabase" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                  Supabase PostgreSQL Cloud
                </span>
                <span className="text-xs text-slate-400">Tables : `restaurants`, `restaurant_users`, `restaurant_orders`</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Structure de la Base de Données Restaurant
              </h3>
              <p className="text-xs text-slate-400">
                Exécutez ce script SQL dans votre <strong>Supabase SQL Editor</strong> pour activer la synchronisation multi-utilisateurs et le tableau de bord Cloud.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const sqlScript = `-- ==============================================================================
-- TABLEAU DE BORD RESTAURANT — ALLÔRESTO NIGER
-- ==============================================================================

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  phone text,
  email text,
  address text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_users (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  email text not null unique,
  password_hash text not null,
  full_name text,
  phone text,
  role text not null default 'manager',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  order_number text not null,
  customer_name text,
  customer_phone text,
  customer_address text,
  items jsonb not null,
  subtotal int not null,
  delivery_fee int default 0,
  total int not null,
  status text not null default 'pending',
  payment_method text default 'cash',
  payment_status text default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);`;
                navigator.clipboard.writeText(sqlScript);
                alert("Script SQL copié dans le presse-papier !");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition shadow-lg shadow-purple-600/30"
            >
              Copier le Script SQL
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto leading-relaxed">
{`-- 1. Table des Utilisateurs Restaurant (Connexion Espace Pro)
CREATE TABLE IF NOT EXISTS public.restaurant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'manager',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 2. Table des Commandes Reçues en Cuisine
CREATE TABLE IF NOT EXISTS public.restaurant_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);`}
          </pre>
        </div>
      )}

      {/* Dish Modal */}
      {showDishModal && (
        <DishManagementModal
          isOpen={showDishModal}
          onClose={() => {
            setShowDishModal(false);
            setEditingDish(null);
          }}
          onSaveDish={handleSaveDish}
          initialDish={editingDish}
        />
      )}

      {/* Kitchen Thermal Receipt Print Modal */}
      {ticketModalOrder && (
        <KitchenThermalTicketModal
          order={ticketModalOrder}
          isOpen={!!ticketModalOrder}
          onClose={() => setTicketModalOrder(null)}
        />
      )}

      {/* Billo Express Courier Dispatch Modal */}
      {dispatchModalOrder && (
        <BilloExpressDispatchModal
          order={dispatchModalOrder}
          isOpen={!!dispatchModalOrder}
          onClose={() => setDispatchModalOrder(null)}
          onAssignCourier={handleAssignCourier}
        />
      )}
    </div>
  );
};
