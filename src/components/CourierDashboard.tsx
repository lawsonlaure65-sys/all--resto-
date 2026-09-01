import React, { useState } from "react";
import { motion } from "motion/react";
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
} from "lucide-react";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { Order, OrderStatus } from "../types";

interface CourierDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateTestOrder?: () => void;
}

export const CourierDashboard: React.FC<CourierDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onCreateTestOrder,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "history">("available");
  const [acceptedOrderId, setAcceptedOrderId] = useState<string | null>(null);

  // Real orders ready for pickup or incoming
  const readyOrders = orders.filter(
    (o) =>
      o.orderStatus === "received" ||
      o.orderStatus === "preparing" ||
      o.orderStatus === "ready" ||
      o.orderStatus === "confirmed"
  );

  // Real orders currently being delivered
  const activeDeliveries = orders.filter((o) => o.orderStatus === "delivering");

  // Delivered orders history
  const deliveredOrders = orders.filter((o) => o.orderStatus === "delivered");

  // Handle courier picking up / taking charge of an order
  const handleTakeOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, "delivering");
    setAcceptedOrderId(orderId);
    setActiveTab("active");
  };

  // Handle courier marking order as delivered & collected
  const handleCompleteDelivery = (orderId: string) => {
    onUpdateOrderStatus(orderId, "delivered");
    setAcceptedOrderId(null);
  };

  // Calculate earnings
  const completedCount = 11 + deliveredOrders.length;
  const baseEarnings = 37500 + deliveredOrders.reduce((sum, o) => sum + (o.deliveryFee || 1500), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile & Online Toggle */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
            <BilloExpressLogo variant="badge" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Espace Coursier Billo Express</h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isOnline
                    ? "bg-cyan-950 text-cyan-400 border-cyan-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {isOnline ? "🟢 En Ligne & Prêt à livrer" : "🔴 Hors Ligne"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ibrahim Oumarou &bull; Moto Kasea Express &bull; Note 4.96/5 (1 240 courses à Niamey)
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
            isOnline
              ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-300 border-slate-700"
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? "En Service" : "Passer En Ligne"}</span>
        </button>
      </div>

      {/* Daily Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Gains Aujourd&apos;hui</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{baseEarnings.toLocaleString()} FCFA</p>
          <span className="text-[10px] text-emerald-400 font-bold">+ 7 000 FCFA de pourboires</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Courses Réalisées</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{completedCount}</p>
          <span className="text-[10px] text-slate-400">Temps moyen : 18 min</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>En Cours / Disponibles</span>
            <Bike className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {activeDeliveries.length} en cours / {readyOrders.length} dispo
          </p>
          <span className="text-[10px] text-cyan-400 font-bold">Quartier Plateau & Niamey</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Taux d&apos;Acceptation</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">99%</p>
          <span className="text-[10px] text-emerald-400 font-bold">Bonus Sahel Actif (+5%)</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
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
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "active"
              ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Livraisons en cours ({activeDeliveries.length})</span>
        </button>

        <button
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

      {acceptedOrderId && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-200 font-semibold">
              Mission <strong>#{acceptedOrderId}</strong> prise en charge ! Itinéraire GPS démarré vers le client.
            </span>
          </div>
          <button
            onClick={() => setAcceptedOrderId(null)}
            className="text-xs text-cyan-400 underline font-bold cursor-pointer"
          >
            Masquer
          </button>
        </div>
      )}

      {/* Tab: Courses Disponibles */}
      {activeTab === "available" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Commandes &amp; Livraisons disponibles à Niamey
            </h3>
            <div className="flex items-center gap-2">
              {onCreateTestOrder && (
                <button
                  type="button"
                  onClick={onCreateTestOrder}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <span>+ Simuler course Plateau</span>
                </button>
              )}
              <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Radar GPS Actif (Rayon 5km)
              </span>
            </div>
          </div>

          {readyOrders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                <Bike className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200">Aucune commande en attente de coursier</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Dès qu&apos;une commande est passée ou prête en cuisine, elle apparaîtra ici instantanément.
                </p>
              </div>
              {onCreateTestOrder && (
                <button
                  type="button"
                  onClick={onCreateTestOrder}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Bike className="w-4 h-4" />
                  <span>🚀 Créer une Course Test (Plateau • +1 500 FCFA)</span>
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
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold font-mono text-cyan-400">
                          #{order.id}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {order.restaurantName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400">
                          +{payout.toLocaleString()} FCFA
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold block">
                          Statut :{" "}
                          {order.orderStatus === "ready"
                            ? "🟢 Prête en cuisine"
                            : order.orderStatus === "preparing"
                            ? "👨‍🍳 En préparation"
                            : "🟡 Nouvelle commande"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                        <span className="truncate">Client : {order.customerName} ({order.customerPhone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">Livraison : {order.deliveryAddress || "Quartier Plateau, Niamey"}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl">
                        📦 <strong>Contenu :</strong>{" "}
                        {order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(", ")}
                      </div>
                    </div>

                    <button
                      onClick={() => handleTakeOrder(order.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Prendre en charge la livraison (+{payout.toLocaleString()} FCFA)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Courses en Cours */}
      {activeTab === "active" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Livraisons en cours de route sur Niamey
          </h3>

          {activeDeliveries.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Aucune livraison en cours</p>
              <p className="text-xs text-slate-500">
                Acceptez une commande disponible pour démarrer la livraison.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-orange-500/40 space-y-4 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-orange-400 bg-orange-950 px-2 py-0.5 rounded-full">
                        #{order.id} &bull; EN LIVRAISON
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {order.restaurantName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-orange-400">
                        {order.total.toLocaleString()} FCFA à encaisser
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Mode : {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>👤 <strong>Client :</strong> {order.customerName}</span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Appeler</span>
                      </a>
                    </div>
                    <div className="text-slate-300">
                      📍 <strong>Adresse :</strong> {order.deliveryAddress || "Quartier Plateau, Niamey"}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      🍲 <strong>Plats :</strong>{" "}
                      {order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(", ")}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=Bonjour%20${encodeURIComponent(order.customerName)},%20je%20suis%20Ibrahim%20votre%20livreur%20Billo%20Express.%20Je%20suis%20en%20route%20avec%20votre%20commande%20All%C3%B4resto%20!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Client</span>
                    </a>

                    <button
                      onClick={() => handleCompleteDelivery(order.id)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Livré &amp; Encaissé</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Historique */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Historique des courses complétées aujourd&apos;hui
          </h3>

          {deliveredOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Aucune course terminée dans cette session</p>
              <p className="text-xs text-slate-500">
                Vos courses livrées avec succès s&apos;archiveront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-white">Commande #{order.id} &bull; {order.restaurantName}</p>
                      <p className="text-slate-400 text-[11px]">{order.customerName} - {order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-400">+{order.deliveryFee || 1500} FCFA</p>
                    <span className="text-[10px] text-slate-500 uppercase">Livré avec succès</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

