import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bike,
  X,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Navigation,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Order } from "../types";
import { playCourierHandoverSound } from "../services/kitchenAudioService";
import { supabase } from "../lib/supabase";

export interface CourierDriver {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  zone: string;
  vehicle: string;
  plate: string;
  rating: number;
  completedDeliveries: number;
  status: "available" | "busy";
  avatar: string;
}

export const BILLO_CENTRAL_DISPATCH: CourierDriver = {
  id: "billo-central",
  name: "Centrale Billo Express (Dispatch)",
  phone: "+227 92 08 08 22",
  whatsapp: "22792080822",
  zone: "Centrale Tous Secteurs Niamey",
  vehicle: "Flotte Motorisée Express",
  plate: "Billo HQ",
  rating: 5.0,
  completedDeliveries: 1540,
  status: "available",
  avatar: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=200&q=80",
};

export const BILLO_COURIERS: CourierDriver[] = [BILLO_CENTRAL_DISPATCH];

interface BilloExpressDispatchModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignCourier: (orderId: string, courierName: string, courierPhone: string) => void;
}

export const BilloExpressDispatchModal: React.FC<BilloExpressDispatchModalProps> = ({
  order,
  isOpen,
  onClose,
  onAssignCourier,
}) => {
  const [couriersList, setCouriersList] = useState<CourierDriver[]>([BILLO_CENTRAL_DISPATCH]);
  const [selectedCourier, setSelectedCourier] = useState<CourierDriver>(BILLO_CENTRAL_DISPATCH);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRealDrivers() {
      setIsLoadingDrivers(true);
      try {
        const { data, error } = await (supabase.from("profiles") as any)
          .select("id, full_name, phone, role, is_active")
          .in("role", ["driver", "courier", "delivery_manager"])
          .eq("is_active", true);

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: CourierDriver[] = data.map((p: any) => ({
            id: p.id,
            name: p.full_name || (p.role === "delivery_manager" ? "Responsable Billo Express" : "Livreur Billo"),
            phone: p.phone || "+227 92 08 08 22",
            whatsapp: (p.phone || "22792080822").replace(/[^0-9]/g, ""),
            zone: p.role === "delivery_manager" ? "Centrale Flotte Niamey" : "Niamey Secteurs",
            vehicle: p.role === "delivery_manager" ? "Supervision Flotte" : "Moto de livraison",
            plate: "Billo Express",
            rating: 5.0,
            completedDeliveries: 0,
            status: "available",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
          }));
          setCouriersList([BILLO_CENTRAL_DISPATCH, ...mapped]);
        }
      } catch (e) {
        console.warn("[BilloExpressDispatchModal] Error loading drivers:", e);
      } finally {
        if (isMounted) setIsLoadingDrivers(false);
      }
    }
    if (isOpen) {
      loadRealDrivers();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  // Build the WhatsApp dispatch text for the courier
  const generateCourierWhatsAppUrl = (courier: CourierDriver) => {
    const itemsSummary = order.items
      .map((it) => `${it.quantity}x ${it.menuItem.name}`)
      .join(", ");

    const paymentText =
      order.paymentMethod === "cash"
        ? `⚠️ *À ENCAISSER EN ESPÈCES : ${order.total.toLocaleString()} FCFA* ${
            order.cashChangeAmount ? `(${order.cashChangeAmount})` : ""
          }`
        : `✅ *DÉJÀ RÉGLÉ EN LIGNE (${order.paymentMethod.toUpperCase()})* - Ne rien encaisser`;

    const message = `🏍️ *MISSION BILLO EXPRESS NIAMEY - ALLÔRESTO*
━━━━━━━━━━━━━━━━━━━━
📦 *Commande :* #${order.id}
🏠 *Restaurant (Départ) :* ${order.restaurantName} (Tél: ${order.restaurantPhone || "+227 96 00 00 00"})
📍 *Client (Arrivée) :* ${order.customerName}
📞 *Tél Client :* ${order.customerPhone}
🗺️ *Adresse Niamey :* ${order.deliveryAddress}
━━━━━━━━━━━━━━━━━━━━
🍲 *Plats à livrer :*
${itemsSummary}
━━━━━━━━━━━━━━━━━━━━
💰 *Règlement :* ${paymentText}
⏱️ *Délai estimé :* 15-25 min
━━━━━━━━━━━━━━━━━━━━
Merci de confirmer la prise en charge dès réception !`;

    return `https://api.whatsapp.com/send?phone=${courier.whatsapp}&text=${encodeURIComponent(
      message
    )}`;
  };

  const handleConfirmDispatch = (courier: CourierDriver) => {
    playCourierHandoverSound();
    onAssignCourier(order.id, `${courier.name} (${courier.vehicle})`, courier.phone);
    setIsDispatched(true);

    // Open WhatsApp in new tab for direct dispatch
    const url = generateCourierWhatsAppUrl(courier);
    window.open(url, "_blank");

    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Assigner Coursier Billo Express</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-mono">
                    #{order.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Réseau de coursiers motorisés géolocalisés à Niamey
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

          {/* Destination Briefing */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">
                Destination : <strong className="text-white">{order.deliveryAddress}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Client :</span>
              <strong className="text-white">{order.customerName}</strong>
              <span className="text-slate-400">({order.customerPhone})</span>
            </div>
          </div>

          {/* Couriers List */}
          <div className="p-4 sm:p-6 space-y-3 bg-slate-950/60 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Disponibilité Flotte Billo Express :
              </p>
              {isLoadingDrivers && (
                <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synchronisation...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {couriersList.map((courier, cIdx) => {
                const isSelected = selectedCourier.id === courier.id;
                return (
                  <div
                    key={`courier-${courier.id}-${cIdx}`}
                    onClick={() => setSelectedCourier(courier)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={courier.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                        alt={courier.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white truncate">{courier.name}</h4>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Dispo
                          </span>
                        </div>
                        <p className="text-xs text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3" />
                          <span className="truncate">{courier.zone}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {courier.vehicle} &bull; {courier.plate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        ⭐ {courier.rating} ({courier.completedDeliveries} courses)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${courier.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                          title="Appeler"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDispatch(courier);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Confirmation Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300">
                Sélectionné : <strong className="text-white">{selectedCourier.name}</strong> (
                {selectedCourier.zone})
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleConfirmDispatch(selectedCourier)}
              disabled={isDispatched}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isDispatched ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mission Transmise !</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirmer &amp; Envoyer Mission WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
