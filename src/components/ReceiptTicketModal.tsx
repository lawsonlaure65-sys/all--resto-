import React, { useRef } from "react";
import { motion } from "motion/react";
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Bike,
  Building,
  QrCode,
  Sparkles,
} from "lucide-react";
import { Order } from "../types";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { BrandLogo } from "./BrandLogo";

interface ReceiptTicketModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder?: (order: Order) => void;
}

export const ReceiptTicketModal: React.FC<ReceiptTicketModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemsList = order.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.menuItem.name} : ${(it.totalPrice).toLocaleString()} FCFA`
      )
      .join("\n");

    const message = encodeURIComponent(
      `🧾 *TICKET DE CAISSE ALLÔRESTO #${order.id}*\n` +
        `_Livraison assurée par Bilo Express Niamey_\n\n` +
        `📅 *Date :* ${order.createdAt}\n` +
        `🏪 *Restaurant :* ${order.restaurantName}\n` +
        `👤 *Client :* ${order.customerName} (${order.customerPhone})\n` +
        `📍 *Lieu de livraison :* ${order.deliveryAddress}\n\n` +
        `🍽️ *Détail des plats :*\n${itemsList}\n\n` +
        `💵 *Sous-total :* ${order.subtotal.toLocaleString()} FCFA\n` +
        `🛵 *Frais de livraison :* ${order.deliveryFee.toLocaleString()} FCFA\n` +
        (order.discount > 0
          ? `🎁 *Remise :* -${order.discount.toLocaleString()} FCFA\n`
          : "") +
        `💰 *TOTAL RÉGLÉ :* ${order.total.toLocaleString()} FCFA\n` +
        `💳 *Moyen :* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === "paid" ? "PAYÉ" : "À RÉGLER"})\n\n` +
        `🛵 *Coursier :* ${order.courierName || "Bilo Express"} (${order.courierPhone || "+227 92 08 08 22"})\n` +
        `🕌 *Note Jumu'ah :* Pause le vendredi de 11h à 15h pour la prière.\n` +
        `✅ Merci d'avoir choisi Allôresto & Bilo Express !`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] print:max-w-none print:w-full print:border-none print:shadow-none print:bg-white"
      >
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              🧾
            </span>
            <div>
              <h3 className="text-sm font-black text-white">Ticket de Caisse Certifié</h3>
              <p className="text-[10px] text-slate-400">Format Thermique &bull; N° {order.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Imprimer le ticket"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ticket Scroll Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-950/60 print:bg-white print:p-0">
          {/* Thermal Receipt Paper Card */}
          <div
            ref={receiptRef}
            className="w-full max-w-sm mx-auto bg-white text-slate-900 font-mono rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative print:shadow-none print:border-none"
          >
            {/* Top Zigzag / Perforation Decor */}
            <div className="h-2.5 bg-slate-100 flex items-center justify-between px-2 overflow-hidden opacity-80">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-slate-900 rotate-45 shrink-0" />
              ))}
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs leading-relaxed">
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-center mb-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                    ALLÔ<span className="text-[#F36C21]">RESTO</span>
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest font-sans">
                  Plateforme Gourmande de Niamey
                </p>
                <p className="text-[10px] text-slate-500">
                  RÉPUBLIQUE DU NIGER 🇳🇪 &bull; NIAMEY
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  NIF : 48921/R - RCCM : NI-NIM-2026-B-1140
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  Agrément HAPDP &bull; Partenaire Bilo Express
                </p>
              </div>

              {/* Order Metadata */}
              <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">TICKET N° :</span>
                  <span className="font-bold text-slate-900">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DATE :</span>
                  <span className="text-slate-800">{order.createdAt || formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RESTO :</span>
                  <span className="font-bold text-slate-900 truncate max-w-[190px]">
                    {order.restaurantName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CLIENT :</span>
                  <span className="font-bold text-slate-900 truncate max-w-[190px]">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TÉLÉPHONE :</span>
                  <span className="text-slate-900">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between items-start pt-1">
                  <span className="text-slate-500 shrink-0">ADRESSE :</span>
                  <span className="text-right text-slate-800 font-medium text-[10px] max-w-[190px]">
                    {order.deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 pb-3 border-b border-dashed border-slate-300 text-[11px]">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 pb-1 border-b border-slate-200">
                  <span>DÉSIGNATION</span>
                  <span>TOTAL</span>
                </div>

                {order.items.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span className="truncate max-w-[210px]">
                        {it.quantity}x {it.menuItem.name}
                      </span>
                      <span className="font-mono shrink-0">
                        {it.totalPrice.toLocaleString()} F
                      </span>
                    </div>

                    {it.selectedOptions && it.selectedOptions.length > 0 && (
                      <div className="pl-3 text-[10px] text-slate-500 space-y-0.5">
                        {it.selectedOptions.map((opt, oIdx) => (
                          <div key={oIdx} className="flex justify-between">
                            <span>&bull; {opt.choice}</span>
                            {opt.extraPrice > 0 && (
                              <span>+{opt.extraPrice * it.quantity} F</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Calculation & Total */}
              <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-600">
                  <span>SOUS-TOTAL PLATS :</span>
                  <span className="font-mono">{order.subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>LIVRAISON BILO EXPRESS :</span>
                  </span>
                  <span className="font-mono">{order.deliveryFee.toLocaleString()} FCFA</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>REMISE PROMO :</span>
                    <span className="font-mono">-{order.discount.toLocaleString()} FCFA</span>
                  </div>
                )}

                {order.tip && order.tip > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>POURBOIRE LIVREUR :</span>
                    <span className="font-mono">{order.tip.toLocaleString()} FCFA</span>
                  </div>
                ) : null}

                {/* Grand Total Box */}
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-black text-xs text-slate-900">NET À PAYER :</span>
                    <span className="font-black text-base text-slate-900 font-mono">
                      {order.total.toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 text-right mt-0.5">
                    TVA / Taxes incluses
                  </p>
                </div>
              </div>

              {/* Payment & Courier Info */}
              <div className="space-y-1 text-[10px] text-slate-600 pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>RÈGLEMENT :</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {order.paymentMethod} &bull; {order.paymentStatus === "paid" ? "RÉGLÉ (VALIDÉ)" : "ESPÈCES À LA LIVRAISON"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>COURSIER ASSIGNÉ :</span>
                  <span className="font-bold text-slate-900">
                    {order.courierName || "Bilo Express Niamey"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DÉLAI ESTIMÉ :</span>
                  <span className="font-bold text-orange-600">
                    {order.estimatedDeliveryTime || "45 à 60 mn"}
                  </span>
                </div>
              </div>

              {/* Official Friday / Jumu'ah Notice */}
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[9px] text-amber-900 space-y-0.5">
                <p className="font-bold flex items-center gap-1">
                  <span>🕌 NOTE JUMU&apos;AH (VENDREDI) :</span>
                </p>
                <p>
                  Les livraisons s&apos;interrompent le vendredi à 11h00 pour la prière et reprennent dès 15h00.
                </p>
              </div>

              {/* QR Code & Barcode Simulation */}
              <div className="pt-2 flex flex-col items-center justify-center space-y-2 text-center">
                {/* Barcode Graphic */}
                <div className="h-8 w-48 flex items-center justify-center gap-0.5 overflow-hidden">
                  {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2, 1].map((w, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 h-full"
                      style={{ width: `${w * 2}px` }}
                    />
                  ))}
                </div>
                <p className="text-[9px] font-mono tracking-widest text-slate-500">
                  *{order.id}-NE-2026*
                </p>

                <p className="text-[10px] font-bold text-slate-800">
                  *** MERCI DE VOTRE CONFIANCE ! ***
                </p>
                <p className="text-[9px] text-slate-500">
                  Service Client WhatsApp : +227 70 03 25 52 &bull; Appel : +227 96 05 23 10
                </p>
              </div>
            </div>

            {/* Bottom Zigzag / Perforation Decor */}
            <div className="h-2.5 bg-slate-100 flex items-center justify-between px-2 overflow-hidden opacity-80">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-slate-900 rotate-45 shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons (Footer) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le Ticket (Thermique / PDF)</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager sur WhatsApp</span>
          </button>

          {onTrackOrder && (
            <button
              onClick={() => {
                onClose();
                onTrackOrder(order);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Bike className="w-4 h-4" />
              <span>Suivre</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
