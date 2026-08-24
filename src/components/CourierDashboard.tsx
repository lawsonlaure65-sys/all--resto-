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
} from "lucide-react";
import { Order, OrderStatus } from "../types";

interface CourierDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const CourierDashboard: React.FC<CourierDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "wallet">("available");
  const [acceptedOrderId, setAcceptedOrderId] = useState<string | null>(null);

  // Available deliveries mock pool in Niamey
  const availableDeliveries = [
    {
      id: "LIV-401",
      restaurantName: "Le Khadafi Palace & Grillades",
      pickupAddress: "Esplanade Grande Mosquée Khadafi, Niamey",
      deliveryAddress: "Quartier Plateau, Ministère de l'Intérieur (1.8 km)",
      payout: 1500,
      estimatedTime: "15 min",
      itemsCount: 3,
    },
    {
      id: "LIV-402",
      restaurantName: "Tandoori & Saveurs du Sahel",
      pickupAddress: "Boulevard Mali Béro, Niamey",
      deliveryAddress: "Quartier Koira Kano, Villa 45 (2.4 km)",
      payout: 2000,
      estimatedTime: "20 min",
      itemsCount: 2,
    },
  ];

  const activeDeliveries = orders.filter((o) => o.orderStatus === "delivering");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile & Online Toggle */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Espace Livreur Niamey</h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isOnline
                    ? "bg-cyan-950 text-cyan-400 border-cyan-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {isOnline ? "En Ligne & Prêt à livrer" : "Hors Ligne"}
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
          <p className="text-2xl font-black text-white">37 500 FCFA</p>
          <span className="text-[10px] text-emerald-400 font-bold">+ 7 000 FCFA de pourboires</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Courses Réalisées</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">11</p>
          <span className="text-[10px] text-slate-400">Temps moyen : 19 min</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Temps de Connexion</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">4h 15m</p>
          <span className="text-[10px] text-slate-400">Objectif 6h</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Taux d&apos;Acceptation</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">98%</p>
          <span className="text-[10px] text-emerald-400 font-bold">Bonus Sahel Actif (+5%)</span>
        </div>
      </div>

      {acceptedOrderId && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-200 font-semibold">
              Mission <strong>#{acceptedOrderId}</strong> acceptée ! Itinéraire GPS démarré vers le restaurant.
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

      {/* Available Missions Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Courses disponibles à proximité de Niamey
          </h3>
          <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Radar GPS Actif (Rayon 5km)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold font-mono text-cyan-400">
                    #{delivery.id}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {delivery.restaurantName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">
                    +{delivery.payout.toLocaleString()} FCFA
                  </span>
                  <span className="text-[10px] text-slate-400 block">{delivery.estimatedTime}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="truncate">Retrait : {delivery.pickupAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="truncate">Dépose : {delivery.deliveryAddress}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setAcceptedOrderId(delivery.id);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Accepter la livraison (+{delivery.payout.toLocaleString()} FCFA)</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
