import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Share2,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { BilloExpressLogo } from "./BilloExpressLogo";

interface LiveOrderTrackerProps {
  order: Order | null;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string, nextStatus: OrderStatus) => void;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  order,
  onClose,
  onAdvanceStatus,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(45);

  if (!order) return null;

  const steps = [
    { key: "received", label: "Commande Reçue", desc: "Transmise en cuisine", icon: CheckCircle2 },
    { key: "preparing", label: "En Préparation", desc: "Le chef s'active aux fourneaux", icon: ChefHat },
    { key: "delivering", label: "Livreur en Route", desc: "En livraison vers votre adresse", icon: Bike },
    { key: "delivered", label: "Livré !", desc: "Bon appétit !", icon: Star },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "received":
        return 0;
      case "preparing":
        return 1;
      case "delivering":
        return 2;
      case "delivered":
        return 3;
    }
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  const handleNextStep = () => {
    if (!onAdvanceStatus) return;
    if (order.orderStatus === "received") onAdvanceStatus(order.id, "preparing");
    else if (order.orderStatus === "preparing") onAdvanceStatus(order.id, "delivering");
    else if (order.orderStatus === "delivering") onAdvanceStatus(order.id, "delivered");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-black/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Suivi en direct
              </span>
              <span className="font-mono text-xs opacity-90">N° {order.id}</span>
            </div>
            <h3 className="text-lg font-black mt-1">{order.restaurantName}</h3>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-xs font-bold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

        {/* Live Status Tracker Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Estimated Time Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Temps d&apos;arrivée estimé</p>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {order.orderStatus === "delivered" ? "Commande livrée !" : order.estimatedDeliveryTime}
                </h4>
              </div>
            </div>

            {/* Quick action simulation step button */}
            {order.orderStatus !== "delivered" && (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-orange-400 border border-slate-700 cursor-pointer flex items-center gap-1"
                title="Simuler l'avancement de la commande"
              >
                <span>Avancer l&apos;état</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Stepper Progression Bar */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="text-center space-y-2">
                    <div
                      className={`w-10 h-10 mx-auto rounded-2xl flex items-center justify-center transition-all ${
                        isPassed
                          ? "bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                          : "bg-slate-950 text-slate-600 border border-slate-800"
                      } ${isCurrent ? "ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900 scale-110" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5
                        className={`text-[11px] font-bold ${
                          isPassed ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {step.label}
                      </h5>
                      <p className="text-[9px] text-slate-400 hidden sm:block">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated Live Route Map View */}
            <div className="relative h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Stylized Dark Grid Map */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Road line */}
              <div className="absolute w-3/4 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full" />

              {/* Restaurant Pin */}
              <div className="absolute left-8 sm:left-12 flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 mt-1">Restaurant</span>
              </div>

              {/* Courier Pin (Moving) */}
              <motion.div
                animate={{
                  x: currentStepIdx === 0 ? -120 : currentStepIdx === 1 ? -40 : currentStepIdx === 2 ? 40 : 120,
                }}
                transition={{ duration: 1, type: "spring" }}
                className="absolute flex flex-col items-center z-10"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-cyan-500/30 border-2 border-slate-900 animate-bounce">
                  <Bike className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-cyan-400 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {order.courierName || "Livreur"}
                </span>
              </motion.div>

              {/* Client Destination Pin */}
              <div className="absolute right-8 sm:right-12 flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 mt-1">Votre adresse</span>
              </div>
            </div>
          </div>

          {/* Courier Contact Card */}
          {order.courierName && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                  <BilloExpressLogo variant="icon" size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{order.courierName}</h4>
                    <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-bold">
                      Bilo Express
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Livraison à Domicile Rapide &bull; Note 4.9/5
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={`tel:${order.courierPhone || "22790405118"}`}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler le Livreur</span>
                </a>
              </div>
            </div>
          )}

          {/* Order Details List */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Détail de la commande ({order.items.length} articles)
            </h4>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-xs text-slate-300">
                <span>
                  {it.quantity}x {it.menuItem.name}
                </span>
                <span className="font-semibold text-slate-200">{it.totalPrice.toLocaleString()} FCFA</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-black text-white">
              <span>Total payé</span>
              <span className="text-orange-400">{order.total.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Rating Section once delivered */}
          {order.orderStatus === "delivered" && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-center space-y-3">
              <h4 className="text-sm font-bold text-white">Comment s&apos;est passée votre commande ?</h4>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1.5 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFeedbackSent(true)}
                disabled={feedbackSent}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 cursor-pointer disabled:opacity-50"
              >
                {feedbackSent ? "Merci pour votre avis !" : "Envoyer ma note"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
