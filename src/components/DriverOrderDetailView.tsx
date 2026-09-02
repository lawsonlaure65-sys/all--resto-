import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  DollarSign,
  Package,
  Store,
  CheckCircle2,
  Bike,
  ShieldCheck,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";
import { Order, DriverProfile } from "../types";
import { playCourierHandoverSound } from "../services/kitchenAudioService";
import { updateDriverMissionStatus } from "../services/supabaseDriverService";

interface DriverOrderDetailViewProps {
  order: Order;
  driver: DriverProfile;
  onBack: () => void;
  onStatusUpdate: (orderId: string, newStatus: any) => void;
}

export const DriverOrderDetailView: React.FC<DriverOrderDetailViewProps> = ({
  order,
  driver,
  onBack,
  onStatusUpdate,
}) => {
  const [updating, setUpdating] = useState(false);

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

  const handleAction = async (newStatus: "delivering" | "delivered") => {
    setUpdating(true);
    playCourierHandoverSound();
    try {
      await updateDriverMissionStatus(
        order.id,
        driver.id,
        newStatus === "delivering" ? "picked_up" : "delivered"
      );
      onStatusUpdate(order.id, newStatus);
    } catch (e) {
      console.warn("Failed mission status update:", e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux courses</span>
        </button>

        <div className="text-right">
          <h2 className="text-sm font-black text-white">Détail Mission Course</h2>
          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
            #{order.id} &bull; {order.orderStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Gain Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              Gain Net Coursier :
            </span>
            <p className="text-2xl font-black text-white">+{payout.toLocaleString()} FCFA</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Total Commande :</span>
            <p className="text-base font-black text-orange-400">{order.total.toLocaleString()} FCFA</p>
            <span className="text-[10px] font-bold text-slate-300">
              {isCash ? "💵 Espèces à encaisser" : "✅ Payé en ligne"}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Client Destinataire</span>
                <p className="text-sm font-bold text-white">{order.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${order.customerPhone}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
              <a
                href={getWhatsAppCustomerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-1 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">{order.deliveryAddress}</strong>
                <p className="text-slate-400 text-[11px]">Niamey, Niger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Restaurant Pickup */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-orange-400 tracking-wider">
                  📍 1. Retrait au restaurant
                </h4>
                <p className="text-sm font-bold text-white">{order.restaurantName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {order.restaurantPhone && (
                <a
                  href={`tel:${order.restaurantPhone}`}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Resto</span>
                </a>
              )}
              <a
                href={getGoogleMapsRestaurantUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1 transition border border-cyan-500/30"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>🗺️ GPS Restaurant</span>
              </a>
            </div>
          </div>

          {/* Items To Pick Up */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Package className="w-3 h-3 text-cyan-400" />
              <span>📦 Articles à vérifier et récupérer :</span>
            </p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-200 py-0.5">
                <span>
                  &bull; <strong>{item.quantity}x</strong> {item.menuItem.name}
                </span>
                <span className="font-mono text-slate-400 font-bold">
                  {item.totalPrice.toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Customer Delivery */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  🏠 2. Livraison au client
                </h4>
                <p className="text-sm font-bold text-white">{order.customerName}</p>
              </div>
            </div>

            <a
              href={getGoogleMapsCustomerUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-1 transition border border-cyan-500/30"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>🗺️ GPS Client</span>
            </a>
          </div>

          {order.cashChangeAmount && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>⚠️ Prévoir monnaie client : {order.cashChangeAmount}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          {order.orderStatus === "received" || order.orderStatus === "preparing" || order.orderStatus === "ready" ? (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleAction("delivering")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Bike className="w-5 h-5" />
              <span>{updating ? "Mise à jour..." : "✅ Accepter & Prendre la course"}</span>
            </button>
          ) : order.orderStatus === "delivering" ? (
            <button
              type="button"
              disabled={updating}
              onClick={() => handleAction("delivered")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{updating ? "Validation..." : "✓ Livré & Encaissé (Terminer)"}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-1">
              <p className="text-emerald-400 font-black text-sm flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Course terminée avec succès !</span>
              </p>
              <p className="text-slate-400 text-xs">Commission de livraison créditée sur votre solde.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
