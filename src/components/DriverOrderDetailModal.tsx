import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  DollarSign,
  Receipt,
  Store,
  CheckCircle2,
  Bike,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Order, DriverProfile } from "../types";
import { playCourierHandoverSound } from "../services/kitchenAudioService";

interface DriverOrderDetailModalProps {
  order: Order | null;
  driver: DriverProfile;
  isOpen: boolean;
  onClose: () => void;
  onPickup: (orderId: string) => void;
  onDeliver: (order: Order) => void;
}

export const DriverOrderDetailModal: React.FC<DriverOrderDetailModalProps> = ({
  order,
  driver,
  isOpen,
  onClose,
  onPickup,
  onDeliver,
}) => {
  if (!isOpen || !order) return null;

  const payout = order.deliveryFee || 1500;
  const isCash = order.paymentMethod === "cash";

  const getGoogleMapsRestaurantUrl = () => {
    const query = encodeURIComponent(`${order.restaurantName}, Niamey, Niger`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getGoogleMapsCustomerUrl = () => {
    const query = encodeURIComponent(`${order.deliveryAddress}, Niamey, Niger`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getWhatsAppCustomerUrl = () => {
    const msg = `Bonjour ${order.customerName} ! 🏍️
Je suis ${driver.fullName}, votre coursier Billo Express Niamey.
Je m'occupe de votre commande #${order.id} (${order.restaurantName}).
Je suis en route vers : ${order.deliveryAddress}.`;
    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Détail Mission Course #{order.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                    {order.orderStatus.toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Coursier en charge : <strong className="text-white">{driver.fullName}</strong> ({driver.motoPlate})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-950/60">
            {/* Gain & Financial Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                  Gain Coursier Garanti :
                </span>
                <p className="text-2xl font-black text-white">+{payout.toLocaleString()} FCFA</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Commande :</span>
                <span className="text-base font-black text-orange-400">{order.total.toLocaleString()} FCFA</span>
                <span className="text-[10px] text-slate-400 block">
                  {isCash ? "💵 Espèces à encaisser" : "✅ Payé en ligne"}
                </span>
              </div>
            </div>

            {/* Step 1: Restaurant Pickup */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-orange-400 tracking-wider">
                      Étape 1 : Retrait au Restaurant
                    </h4>
                    <p className="text-sm font-bold text-white">{order.restaurantName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {order.restaurantPhone && (
                    <a
                      href={`tel:${order.restaurantPhone}`}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Appeler</span>
                    </a>
                  )}
                  <a
                    href={getGoogleMapsRestaurantUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS Resto</span>
                  </a>
                </div>
              </div>

              {/* Items List */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                <p className="text-[11px] font-bold text-slate-400">Plats à vérifier et récupérer :</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-200">
                    <span>
                      • <strong>{item.quantity}x</strong> {item.menuItem.name}
                    </span>
                    <span className="font-mono text-slate-400">{item.totalPrice.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Customer Delivery */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Étape 2 : Livraison au Client
                    </h4>
                    <p className="text-sm font-bold text-white">{order.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>
                  <a
                    href={getWhatsAppCustomerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={getGoogleMapsCustomerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>GPS Client</span>
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Adresse de livraison :
                    </span>
                    <strong className="text-white text-sm">{order.deliveryAddress}</strong>
                    <p className="text-slate-400 text-[11px]">Niamey, Niger</p>
                  </div>
                </div>

                {order.cashChangeAmount && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Rappel Monnaie : {order.cashChangeAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Fermer
            </button>

            <div className="flex items-center gap-2">
              {order.orderStatus === "ready" || order.orderStatus === "received" || order.orderStatus === "preparing" ? (
                <button
                  type="button"
                  onClick={() => {
                    playCourierHandoverSound();
                    onPickup(order.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Bike className="w-4 h-4" />
                  <span>Prendre la Course</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onDeliver(order)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmer Livré &amp; Encaissé</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
