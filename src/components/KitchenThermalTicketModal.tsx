import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Printer,
  X,
  Check,
  Copy,
  Receipt,
  Download,
  Phone,
  MapPin,
  Clock,
  Bike,
} from "lucide-react";
import { Order } from "../types";

interface KitchenThermalTicketModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenThermalTicketModal: React.FC<KitchenThermalTicketModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [paperWidth, setPaperWidth] = useState<"58mm" | "80mm">("80mm");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textReceipt = `
========================================
    ALLÔRESTO NIAMEY - BON DE CUISINE
========================================
Restaurant : ${order.restaurantName}
Tel Resto  : ${order.restaurantPhone || "+227 96 00 00 00"}
----------------------------------------
COMMANDE   : #${order.id}
DATE/HEURE : ${order.createdAt}
STATUT     : ${order.orderStatus.toUpperCase()}
----------------------------------------
CLIENT     : ${order.customerName}
TÉLÉPHONE  : ${order.customerPhone}
ADRESSE    : ${order.deliveryAddress}
VILLE      : Niamey
----------------------------------------
ARTICLES COMMANDÉS :
${order.items
  .map(
    (it) =>
      `• ${it.quantity}x ${it.menuItem.name} [${it.totalPrice.toLocaleString()} FCFA]${
        it.notes ? `\n  (Note: ${it.notes})` : ""
      }`
  )
  .join("\n")}
----------------------------------------
SOUS-TOTAL : ${order.subtotal.toLocaleString()} FCFA
LIVRAISON  : ${order.deliveryFee.toLocaleString()} FCFA
TOTAL NET  : ${order.total.toLocaleString()} FCFA
----------------------------------------
RÈGLEMENT  : ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === "paid" ? "PAYÉ EN LIGNE ✅" : "ESPÈCES À ENCAISSER 💵"})
${order.cashChangeAmount ? `MONNAIE    : ${order.cashChangeAmount}\n` : ""}
COURSIER   : ${order.courierName || "Billo Express Niamey"}
========================================
`;
    navigator.clipboard.writeText(textReceipt.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Bon de Commande &amp; Ticket Caisse</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                    #{order.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Format thermique optimisé pour imprimantes Bluetooth &amp; USB (ESC/POS)
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

          {/* Controls Bar */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Format rouleau :</span>
              <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaperWidth("58mm")}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    paperWidth === "58mm"
                      ? "bg-orange-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  58 mm (Compact)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperWidth("80mm")}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    paperWidth === "80mm"
                      ? "bg-orange-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  80 mm (Standard)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copié !" : "Copier Texte"}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Bon</span>
              </button>
            </div>
          </div>

          {/* Ticket Body / Preview Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950/60 flex justify-center">
            <div
              id="printable-kitchen-receipt"
              className={`bg-white text-black p-5 font-mono shadow-2xl rounded-lg transition-all ${
                paperWidth === "58mm" ? "w-[280px] text-[11px]" : "w-[360px] text-xs"
              }`}
            >
              {/* Header Slip */}
              <div className="text-center border-b-2 border-dashed border-black pb-3 space-y-1">
                <h2 className="text-base font-black uppercase tracking-wider">ALLÔRESTO NIAMEY</h2>
                <p className="text-[10px] font-bold text-gray-700">★ CUISINE &amp; LIVRAISON EXPRESS ★</p>
                <p className="font-bold text-sm text-gray-900 mt-1">{order.restaurantName}</p>
                <p className="text-[10px] text-gray-600">{order.restaurantPhone || "+227 96 00 00 00"}</p>
              </div>

              {/* Order Meta */}
              <div className="py-2.5 border-b border-dashed border-black space-y-1">
                <div className="flex justify-between items-center text-sm font-black">
                  <span>COMMANDE :</span>
                  <span className="bg-black text-white px-1.5 py-0.5 rounded">#{order.id}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-700">
                  <span>DATE : {order.createdAt}</span>
                  <span className="uppercase font-bold">{order.orderStatus}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="py-2.5 border-b border-dashed border-black space-y-1">
                <p className="font-bold uppercase text-[10px] text-gray-600">DESTINATAIRE :</p>
                <p className="font-black text-xs text-gray-900">{order.customerName}</p>
                <p className="font-bold text-[11px]">📞 {order.customerPhone}</p>
                <p className="text-[11px] font-semibold text-gray-800">
                  📍 {order.deliveryAddress}, Niamey
                </p>
              </div>

              {/* Items Table */}
              <div className="py-3 border-b-2 border-dashed border-black space-y-2">
                <div className="flex justify-between font-black text-[10px] text-gray-600 border-b border-gray-300 pb-1">
                  <span>ARTICLE / PLAT</span>
                  <span>TOTAL FCFA</span>
                </div>

                {order.items.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-start font-bold">
                      <span className="flex-1 pr-2">
                        {it.quantity}x {it.menuItem.name}
                      </span>
                      <span className="whitespace-nowrap">{it.totalPrice.toLocaleString()}</span>
                    </div>
                    {it.notes && (
                      <p className="text-[10px] italic font-semibold text-gray-600 pl-3">
                        👉 Note: {it.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="py-2.5 border-b-2 border-dashed border-black space-y-1 text-right">
                <div className="flex justify-between text-[11px]">
                  <span>Sous-total :</span>
                  <span className="font-bold">{order.subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Frais Livraison :</span>
                  <span className="font-bold">{order.deliveryFee.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-black pt-1.5 mt-1">
                  <span>TOTAL À PAYER :</span>
                  <span>{order.total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="py-2.5 border-b border-dashed border-black space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold">MODE :</span>
                  <span className="font-black uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span>STATUT :</span>
                  <span
                    className={`font-black uppercase px-1.5 py-0.5 rounded text-white ${
                      order.paymentStatus === "paid" ? "bg-black" : "bg-gray-800"
                    }`}
                  >
                    {order.paymentStatus === "paid" ? "RÉGLÉ EN LIGNE" : "ESPÈCES À ENCAISSER"}
                  </span>
                </div>
                {order.cashChangeAmount && (
                  <p className="text-[10px] font-bold text-gray-800 bg-gray-100 p-1 rounded mt-1">
                    ⚠️ {order.cashChangeAmount}
                  </p>
                )}
              </div>

              {/* Delivery Handover Signature */}
              <div className="pt-3 text-center space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-700">
                  <span>Partenaire :</span>
                  <span>{order.courierName || "Billo Express 🏍️"}</span>
                </div>
                <div className="border border-dashed border-gray-400 p-2 text-[10px] text-gray-500 rounded">
                  Signature &amp; Emargement Livreur / Client
                  <div className="h-6"></div>
                </div>
                <p className="text-[9px] text-gray-500">
                  Service client Allôresto Niamey : +227 90 12 34 56
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Prêt pour impression directe avec toute imprimante ticket thermique.
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/30 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Lancer l&apos;impression</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
