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
  FileText,
  ExternalLink,
  Map as MapIcon,
  Compass,
  AlertCircle,
} from "lucide-react";
import { Order, OrderStatus } from "../types";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { getJumuahStatus } from "../utils/jumuahSchedule";

interface LiveOrderTrackerProps {
  order: Order | null;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string, nextStatus: OrderStatus) => void;
  onViewReceipt?: (order: Order) => void;
  simulatedFridayPause?: boolean;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  order,
  onClose,
  onAdvanceStatus,
  onViewReceipt,
  simulatedFridayPause = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [mapMode, setMapMode] = useState<"interactive" | "satellite">("interactive");
  const [simulatedDistanceKm, setSimulatedDistanceKm] = useState(3.4);
  const [simulatedEtaMinutes, setSimulatedEtaMinutes] = useState(48);

  const jumuahStatus = getJumuahStatus(simulatedFridayPause);

  if (!order) return null;

  const steps = [
    { key: "received", label: "Commande Reçue", desc: "Transmise en cuisine", icon: CheckCircle2 },
    { key: "preparing", label: "En Préparation", desc: "Mijotage & Cuisson soignée", icon: ChefHat },
    { key: "delivering", label: "Livreur en Route", desc: "Bilo Express en circulation", icon: Bike },
    { key: "delivered", label: "Livré !", desc: "Bon appétit à Niamey !", icon: Star },
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

  // Google Maps URL with origin & destination coordinates in Niamey
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    order.restaurantName + ", Niamey, Niger"
  )}&destination=${encodeURIComponent(
    order.deliveryAddress + ", Niamey, Niger"
  )}&travelmode=driving`;

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
                ⚡ Suivi GPS en direct &bull; Niamey
              </span>
              <span className="font-mono text-xs opacity-90">N° {order.id}</span>
            </div>
            <h3 className="text-lg font-black mt-1">{order.restaurantName}</h3>
          </div>

          <div className="flex items-center gap-2">
            {onViewReceipt && (
              <button
                onClick={() => onViewReceipt(order)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Voir le ticket de caisse"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ticket de Caisse</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-xs font-bold transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Live Status Tracker Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Jumu'ah Friday Alert if active */}
          {jumuahStatus.isPauseActive && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
              <span className="text-xl">🕌</span>
              <div>
                <h4 className="font-black text-amber-300">
                  Pause Prière du Jumu&apos;ah en cours (11h00 - 15h00)
                </h4>
                <p className="mt-0.5 text-amber-200/90 text-[11px] leading-relaxed">
                  Conformément aux règles Allôresto à Niamey, nos coursiers et chefs sont à la grande prière du vendredi. Votre commande sera livrée dès la reprise à <strong>15h00</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Estimated Time Card (45 to 60 mn realistic delivery) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400 font-medium">Délai estimé de livraison</p>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Cuisson + Trajet
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {order.orderStatus === "delivered"
                    ? "Commande livrée avec succès !"
                    : order.estimatedDeliveryTime || "45 à 60 mn"}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Livraison soignée et sécurisée par Bilo Express 🏍️
                </p>
              </div>
            </div>

            {/* Step advance & Google Maps button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {order.orderStatus !== "delivered" && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-orange-400 border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5 transition"
                  title="Simuler l'avancement de la commande"
                >
                  <span>Étape suivante</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
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

            {/* Interactive GPS & Google Maps Niamey Tracker Canvas */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex flex-col">
              {/* Map Header Toolbar */}
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-black text-slate-200">Radar Moto GPS Niamey</span>
                  <span className="text-[10px] text-slate-400">&bull; Axe Mali Béro / Pont Kennedy</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <MapIcon className="w-3 h-3 text-blue-400" />
                    <span>Ouvrir Google Maps 🗺️</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Map Stage */}
              <div className="relative h-52 sm:h-60 bg-[#0b1324] overflow-hidden flex items-center justify-center">
                {/* Stylized Niamey Street Grid Background */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* Simulated River Niger Curve */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-20,180 Q150,140 300,170 T650,130"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                  <text x="40" y="195" fill="#38bdf8" fontSize="10" fontWeight="bold">
                    Fleuve Niger 🌊
                  </text>
                  <text x="320" y="150" fill="#38bdf8" fontSize="9" fontWeight="bold">
                    Pont Kennedy
                  </text>
                </svg>

                {/* Niamey Key Landmark Badges */}
                <div className="absolute top-3 left-4 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400 flex items-center gap-1 pointer-events-none">
                  <span>🕌 Grande Mosquée Kadhafi</span>
                </div>
                <div className="absolute bottom-3 left-6 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400 flex items-center gap-1 pointer-events-none">
                  <span>🏛️ Quartier Plateau / Ministères</span>
                </div>
                <div className="absolute top-4 right-6 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[9px] text-slate-400 flex items-center gap-1 pointer-events-none">
                  <span>📍 {order.deliveryAddress.slice(0, 22)}...</span>
                </div>

                {/* Animated GPS Road line with pulsing dash */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 70 120 C 180 80, 280 160, 420 110"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Restaurant Pin */}
                <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-black border-2 border-slate-900">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-orange-400 mt-1 bg-slate-950/90 px-2 py-0.5 rounded-full border border-orange-500/30">
                    {order.restaurantName}
                  </span>
                </div>

                {/* Courier Pin (Moving animated along steps) */}
                <motion.div
                  animate={{
                    x:
                      currentStepIdx === 0
                        ? -110
                        : currentStepIdx === 1
                        ? -40
                        : currentStepIdx === 2
                        ? 40
                        : 120,
                    y: currentStepIdx === 1 ? -12 : currentStepIdx === 2 ? 10 : 0,
                  }}
                  transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                  className="absolute flex flex-col items-center z-20"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-orange-500/40 border-2 border-white animate-bounce">
                      <Bike className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  </div>

                  <div className="mt-1.5 flex flex-col items-center">
                    <span className="text-[10px] font-black text-white bg-orange-600 px-2.5 py-0.5 rounded-full border border-orange-400 shadow-md">
                      {order.courierName || "Bilo Express Moto"}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-slate-950/90 px-1.5 py-0.2 rounded mt-0.5">
                      {currentStepIdx === 2 ? "En circulation 🏍️" : currentStepIdx === 3 ? "Arrivé à destination" : "En attente colis"}
                    </span>
                  </div>
                </motion.div>

                {/* Client Destination Pin */}
                <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-black border-2 border-slate-900">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 mt-1 bg-slate-950/90 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Votre Adresse
                  </span>
                </div>
              </div>

              {/* Bottom Live Feed */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-orange-400" />
                  <span>Trajet : <strong>{order.restaurantName}</strong> ➔ <strong>{order.deliveryAddress}</strong></span>
                </span>
                <span className="text-orange-400 font-bold hidden sm:inline">
                  Sac isotherme hermétique scellé
                </span>
              </div>
            </div>
          </div>

          {/* Courier Contact Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                <BilloExpressLogo variant="icon" size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white">
                    {order.courierName || "Ibrahim Oumarou"}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-black">
                    Bilo Express Niamey
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Moto sécurisée &bull; Note 4.95/5 &bull; Ponctualité garantie
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={`tel:${order.courierPhone || "22792080822"}`}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler le Livreur</span>
              </a>

              <a
                href={`https://wa.me/${(order.courierPhone || "22770032552").replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Bonjour, je suis le client de la commande Allôresto #${order.id}. Pouvez-vous me confirmer votre arrivée ?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Ticket de Caisse Button */}
          {onViewReceipt && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🧾</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Ticket de caisse &amp; Reçu fiscal</h4>
                  <p className="text-[10px] text-slate-400">Imprimez ou téléchargez le reçu officiel de cette commande</p>
                </div>
              </div>
              <button
                onClick={() => onViewReceipt(order)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold border border-slate-700 cursor-pointer flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Voir le Ticket</span>
              </button>
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
              <h4 className="text-sm font-bold text-white">Comment s&apos;est passée votre commande Allôresto ?</h4>
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
