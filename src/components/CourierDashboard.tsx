import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bike,
  Navigation,
  MapPin,
  DollarSign,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Power,
  Package,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  ChefHat,
  Sparkles,
  Search,
  UserCheck,
  Radio,
  ChevronRight,
  AlertTriangle,
  Receipt,
  LogOut,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { Order, OrderStatus, DriverProfile } from "../types";
import { BILLO_COURIERS } from "./BilloExpressDispatchModal";
import { playCourierHandoverSound, playKitchenOrderChime } from "../services/kitchenAudioService";
import { fetchRestaurantOrdersFromSupabase } from "../services/supabaseRestaurantService";
import { DriverOrderDetailModal } from "./DriverOrderDetailModal";
import { DriverOrderDetailView } from "./DriverOrderDetailView";

interface CourierDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateTestOrder?: () => void;
  onExitToClient?: () => void;
}

export const CourierDashboard: React.FC<CourierDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onCreateTestOrder,
  onExitToClient,
}) => {
  // Active Courier Profile (defaults to Oumarou Diallo)
  const [selectedCourierId, setSelectedCourierId] = useState<string>(BILLO_COURIERS[0].id);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "history">("available");
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>("all");
  
  // Modals & UI States
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);
  const [paymentCollectModalOrder, setPaymentCollectModalOrder] = useState<Order | null>(null);
  const [acceptedToast, setAcceptedToast] = useState<string | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(false);
  const [supabaseOrders, setSupabaseOrders] = useState<Order[]>([]);

  const activeCourier = BILLO_COURIERS.find((c) => c.id === selectedCourierId) || BILLO_COURIERS[0];
  const lastKnownCountRef = useRef<number>(0);

  // Poll orders from Supabase periodically
  const fetchLiveOrders = async () => {
    setIsLoadingSupabase(true);
    try {
      const supa = await fetchRestaurantOrdersFromSupabase(undefined, "Allôresto Kitchen");
      if (supa && supa.length > 0) {
        setSupabaseOrders(supa);
      }
    } catch (e) {
      console.warn("Supabase fetch in courier dashboard:", e);
    } finally {
      setIsLoadingSupabase(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 12000);
    return () => clearInterval(interval);
  }, []);

  // Merge local state orders with fetched Supabase orders (deduplicated by ID)
  const allOrdersMap = new Map<string, Order>();
  orders.forEach((o) => allOrdersMap.set(o.id, o));
  supabaseOrders.forEach((o) => {
    if (!allOrdersMap.has(o.id)) {
      allOrdersMap.set(o.id, o);
    }
  });
  const mergedOrders = Array.from(allOrdersMap.values());

  // Filter orders by statuses
  const readyOrders = mergedOrders.filter(
    (o) =>
      o.orderStatus === "received" ||
      o.orderStatus === "preparing" ||
      o.orderStatus === "ready"
  );

  const activeDeliveries = mergedOrders.filter((o) => o.orderStatus === "delivering");
  const deliveredOrders = mergedOrders.filter((o) => o.orderStatus === "delivered");

  // Play audio sound if new orders appear
  useEffect(() => {
    if (soundAlerts && isOnline) {
      if (readyOrders.length > lastKnownCountRef.current && lastKnownCountRef.current > 0) {
        playKitchenOrderChime();
      }
    }
    lastKnownCountRef.current = readyOrders.length;
  }, [readyOrders.length, soundAlerts, isOnline]);

  // Handle Taking an Order
  const handleTakeOrder = (order: Order) => {
    playCourierHandoverSound();
    onUpdateOrderStatus(order.id, "delivering");
    setAcceptedToast(`Course #${order.id} acceptée ! Mission assignée à ${activeCourier.name}.`);
    setActiveTab("active");
    setTimeout(() => setAcceptedToast(null), 5000);
  };

  // Handle Completing & Collecting payment
  const handleConfirmDelivered = (order: Order) => {
    playCourierHandoverSound();
    onUpdateOrderStatus(order.id, "delivered");
    setPaymentCollectModalOrder(null);
    setAcceptedToast(`Livraison #${order.id} terminée avec succès ! Commission créditée.`);
    setTimeout(() => setAcceptedToast(null), 5000);
  };

  // Build GPS Google Maps link
  const getGoogleMapsUrl = (address: string) => {
    const query = encodeURIComponent(`${address}, Niamey, Niger`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  // Build Customer WhatsApp message
  const getCustomerWhatsAppUrl = (order: Order) => {
    const msg = `Bonjour ${order.customerName} ! 🏍️
Je suis ${activeCourier.name}, votre livreur Billo Express Niamey.
J'ai pris en charge votre commande Allôresto #${order.id} (${order.restaurantName}).
Je suis en route vers votre adresse : ${order.deliveryAddress}.
À tout de suite !`;
    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  // Calculations
  const completedCount = 8 + deliveredOrders.length;
  const baseEarnings = 24500 + deliveredOrders.reduce((sum, o) => sum + (o.deliveryFee || 1500), 0);
  const totalCashToRemit = deliveredOrders
    .filter((o) => o.paymentMethod === "cash")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Profile Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
            <BilloExpressLogo variant="badge" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Espace Coursier Billo Express</span>
              </h2>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  isOnline
                    ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {isOnline ? "🟢 En Service (Disponible)" : "🔴 En Pause (Hors Ligne)"}
              </span>
            </div>

            {/* Courier Profile Selection Selector */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-semibold">Livreur connecté :</span>
              <select
                aria-label="Sélectionner le profil du coursier Billo Express"
                value={selectedCourierId}
                onChange={(e) => {
                  setSelectedCourierId(e.target.value);
                  playCourierHandoverSound();
                }}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-bold text-xs cursor-pointer focus:outline-none focus:border-cyan-400"
              >
                {BILLO_COURIERS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} &bull; {c.vehicle} ({c.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Refresh Supabase */}
          <button
            type="button"
            onClick={fetchLiveOrders}
            disabled={isLoadingSupabase}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Actualiser les commandes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? "animate-spin text-cyan-400" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          {/* Sound Alert Toggle */}
          <button
            type="button"
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
              soundAlerts
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title={soundAlerts ? "Sonnette d'alerte active" : "Sonnette coupée"}
          >
            {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Online/Offline Toggle */}
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer shadow-md ${
              isOnline
                ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-emerald-400"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? "En Ligne" : "Hors Ligne"}</span>
          </button>

          {/* Return to Client */}
          {onExitToClient && (
            <button
              type="button"
              onClick={onExitToClient}
              className="px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Espace Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Accepted Toast Notification */}
      <AnimatePresence>
        {acceptedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{acceptedToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setAcceptedToast(null)}
              className="text-cyan-400 hover:underline"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Financial Metrics & KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Gains Coursier (Aujourd&apos;hui)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{baseEarnings.toLocaleString()} FCFA</p>
          <span className="text-[10px] text-emerald-400 font-bold">100% conservé &bull; Virement Airtel/Moov</span>
        </div>

        {/* Deliveries Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Courses Livrées</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{completedCount} courses</p>
          <span className="text-[10px] text-slate-400">Temps moyen : 18 min à Niamey</span>
        </div>

        {/* Active & Ready */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>En Cours &bull; Disponibles</span>
            <Bike className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            <span className="text-orange-400">{activeDeliveries.length} en route</span> /{" "}
            <span className="text-cyan-400">{readyOrders.length} à prendre</span>
          </p>
          <span className="text-[10px] text-cyan-400 font-bold">Zone : {activeCourier.zone}</span>
        </div>

        {/* Cash to Remit */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Espèces Encaissées (À Reverser)</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalCashToRemit.toLocaleString()} FCFA</p>
          <span className="text-[10px] text-amber-400 font-bold">Caisse Billo Express Niamey</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "available"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Courses disponibles ({readyOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "active"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Mes livraisons en cours ({activeDeliveries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Historique ({deliveredOrders.length})</span>
          </button>
        </div>

        {/* Quick Test Creator Button */}
        {onCreateTestOrder && (
          <button
            type="button"
            onClick={onCreateTestOrder}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Simuler Nouvelle Course</span>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COURSES DISPONIBLES                              */}
      {/* ======================================================== */}
      {activeTab === "available" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Courses prêtes ou en préparation à Niamey</span>
            </h3>

            <span className="text-xs text-cyan-400 font-semibold">
              Rayon actif : Secteur {activeCourier.zone} &amp; Agglomération
            </span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Bike className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200">Aucune course en attente pour le moment</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Dès qu&apos;une commande est validée ou cuisinée par un restaurant de Niamey, elle s&apos;affichera ici avec notification sonore.
                </p>
              </div>
              {onCreateTestOrder && (
                <button
                  type="button"
                  onClick={onCreateTestOrder}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Bike className="w-4 h-4" />
                  <span>Générer une course test à récupérer</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readyOrders.map((order) => {
                const payout = order.deliveryFee || 1500;
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Header Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                              #{order.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {order.orderStatus === "ready"
                                ? "🟢 Prête en cuisine"
                                : "👨‍🍳 En préparation"}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-white mt-1">
                            {order.restaurantName}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Départ : {order.restaurantPhone || "+227 96 00 00 00"}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-400 block">
                            +{payout.toLocaleString()} FCFA
                          </span>
                          <span className="text-[10px] text-slate-400">Gain net livraison</span>
                        </div>
                      </div>

                      {/* Route Details */}
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                              Destination Client :
                            </span>
                            <strong className="text-white">{order.deliveryAddress || "Niamey Plateau"}</strong>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              {order.customerName} ({order.customerPhone})
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-300">
                          <span>🍲 <strong>{order.items.length} plat(s) :</strong> {order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(", ")}</span>
                        </div>
                      </div>

                      {/* Payment Indicator */}
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-400">Règlement :</span>
                        <strong className={order.paymentMethod === "cash" ? "text-amber-400" : "text-emerald-400"}>
                          {order.paymentMethod === "cash"
                            ? `💵 Espèces à encaisser (${order.total.toLocaleString()} FCFA)`
                            : `✅ Payé en ligne (${order.paymentMethod.toUpperCase()})`}
                        </strong>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetail(order)}
                        className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition border border-slate-700"
                        title="Voir la fiche détaillée de la mission"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Détails</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTakeOrder(order)}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 transition-transform active:scale-98"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Prendre la course (+{payout.toLocaleString()} FCFA)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MES LIVRAISONS EN COURS                          */}
      {/* ======================================================== */}
      {activeTab === "active" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Missions en cours de livraison sur Niamey
          </h3>

          {activeDeliveries.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Aucune livraison en cours actuellement</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Consultez l&apos;onglet &quot;Courses disponibles&quot; pour accepter une nouvelle commande.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-orange-500/50 space-y-4 shadow-2xl relative overflow-hidden"
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/40">
                        #{order.id} &bull; EN LIVRAISON ACTIVE
                      </span>
                      <h4 className="text-base font-black text-white mt-1">
                        {order.restaurantName}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-orange-400 block">
                        {order.total.toLocaleString()} FCFA
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {order.paymentMethod === "cash" ? "💵 À encaisser" : "✅ Déjà payé"}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Route Briefing */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase block">Destinataire :</span>
                        <strong className="text-white text-sm">{order.customerName}</strong>
                      </div>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-slate-300 pt-1">
                      <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">{order.deliveryAddress}</strong>
                        <p className="text-[11px] text-slate-400">Niamey, Niger</p>
                      </div>
                    </div>

                    {order.cashChangeAmount && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
                        ⚠️ Note Monnaie Client : {order.cashChangeAmount}
                      </div>
                    )}
                  </div>

                    {/* Operational Action Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* View Detail Page */}
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetail(order)}
                        className="py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-cyan-500/30 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Fiche Mission</span>
                      </button>

                      {/* GPS Route Link */}
                      <a
                        href={getGoogleMapsUrl(order.deliveryAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>GPS Niamey</span>
                      </a>

                      {/* WhatsApp Client */}
                      <a
                        href={getCustomerWhatsAppUrl(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  {/* Main Deliver Action */}
                  <button
                    type="button"
                    onClick={() => setPaymentCollectModalOrder(order)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-transform active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Confirmer Livraison &amp; Encaissement</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: HISTORIQUE DES COURSES LIVRÉES                    */}
      {/* ======================================================== */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Historique des courses clôturées aujourd&apos;hui
          </h3>

          {deliveredOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Aucune course terminée lors de cette session</p>
              <p className="text-xs text-slate-500">
                Vos livraisons terminées s&apos;archiveront automatiquement ici avec le détail des encaissements.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        Commande #{order.id} &bull; {order.restaurantName}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Client : {order.customerName} &bull; {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <span className="text-emerald-400 font-black text-sm">
                      +{order.deliveryFee || 1500} FCFA
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Encaissé : {order.total.toLocaleString()} FCFA ({order.paymentMethod.toUpperCase()})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment & Handover Confirmation Modal */}
      <AnimatePresence>
        {paymentCollectModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Validation de Fin de Course</h3>
                  <p className="text-xs text-slate-400">Commande #{paymentCollectModalOrder.id}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Client :</span>
                  <strong className="text-white">{paymentCollectModalOrder.customerName}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Mode :</span>
                  <strong className="uppercase text-orange-400">{paymentCollectModalOrder.paymentMethod}</strong>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-slate-800 pt-2 text-white">
                  <span>Montant Total :</span>
                  <span className="text-emerald-400">{paymentCollectModalOrder.total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {paymentCollectModalOrder.paymentMethod === "cash" ? (
                  <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    💵 <strong>Rappel :</strong> Assurez-vous d&apos;avoir encaissé la somme de{" "}
                    <strong>{paymentCollectModalOrder.total.toLocaleString()} FCFA</strong> en espèces et remis la monnaie exacte.
                  </p>
                ) : (
                  <p className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    ✅ <strong>Paiement en ligne :</strong> Cette commande a déjà été réglée en ligne. Vous n&apos;avez rien à encaisser.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentCollectModalOrder(null)}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDelivered(paymentCollectModalOrder)}
                  className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-emerald-500/25 transition"
                >
                  Confirmer Livré ✓
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Driver Order Detail Modal */}
      <DriverOrderDetailModal
        isOpen={!!selectedOrderDetail}
        order={selectedOrderDetail}
        driver={{
          id: activeCourier.id,
          fullName: activeCourier.name,
          phone: activeCourier.phone,
          motoPlate: activeCourier.plate,
          vehicle: activeCourier.vehicle,
          status: activeCourier.status === "available" ? "available" : "busy",
          currentZone: activeCourier.zone,
          avatar: activeCourier.avatar,
          rating: activeCourier.rating,
          completedDeliveries: activeCourier.completedDeliveries,
        }}
        onClose={() => setSelectedOrderDetail(null)}
        onPickup={(orderId) => {
          onUpdateOrderStatus(orderId, "delivering");
          setSelectedOrderDetail(null);
          setActiveTab("active");
          setAcceptedToast(`Course #${orderId} acceptée !`);
          setTimeout(() => setAcceptedToast(null), 5000);
        }}
        onDeliver={(ord) => {
          setSelectedOrderDetail(null);
          setPaymentCollectModalOrder(ord);
        }}
      />
    </div>
  );
};
