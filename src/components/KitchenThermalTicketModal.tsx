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
import { useAppSettings } from "../services/appSettingsService";

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
  const settings = useAppSettings();
  const [paperWidth, setPaperWidth] = useState<"58mm" | "80mm">("80mm");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const currencyUnit = settings.currency || "FCFA";

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const serviceLabel =
      order.serviceType === "delivery"
        ? "LIVRAISON À DOMICILE"
        : order.serviceType === "takeaway"
        ? "À EMPORTER"
        : "SUR PLACE";

    const textReceipt = `
========================================
     ${settings.company_name.toUpperCase()}
  NIF : ${settings.nif} | RCCM : ${settings.rccm || "N/A"}
  ${settings.address}
  Tél HQ : ${settings.phone}
========================================
RESTAURANT : ${order.restaurantName}
TÉL RESTO  : ${order.restaurantPhone || "+227 96 05 23 10"}
----------------------------------------
COMMANDE   : #${order.id}
DATE/HEURE : ${order.createdAt}
SERVICE    : ${serviceLabel}
${order.scheduledTime ? `CRÉNEAU    : ${order.scheduledTime}\n` : ""}STATUT     : ${order.orderStatus.toUpperCase()}
----------------------------------------
CLIENT     : ${order.customerName}
TÉLÉPHONE  : ${order.customerPhone}
ADRESSE    : ${order.deliveryAddress}
VILLE      : Niamey, Niger
----------------------------------------
ARTICLES COMMANDÉS :
${order.items
  .map((it) => {
    const optionsList = Array.isArray(it.selectedOptions)
      ? it.selectedOptions.map((o: any) => o.choice || o.label || String(o))
      : it.selectedOptions && typeof it.selectedOptions === "object"
      ? Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${v}`)
      : [];
    const optStr = optionsList.length > 0 ? `\n  ↳ Options: ${optionsList.join(", ")}` : "";
    const noteStr = it.notes ? `\n  👉 Note: ${it.notes}` : "";
    const unitPrice = it.unitPrice || it.menuItem.price || 0;
    return `• ${it.quantity}x ${it.menuItem.name} [PU: ${unitPrice.toLocaleString()} ${currencyUnit}] = ${it.totalPrice.toLocaleString()} ${currencyUnit}${optStr}${noteStr}`;
  })
  .join("\n")}
----------------------------------------
SOUS-TOTAL : ${order.subtotal.toLocaleString()} ${currencyUnit}
LIVRAISON  : ${order.deliveryFee.toLocaleString()} ${currencyUnit}
${order.discount > 0 ? `REMISE     : -${order.discount.toLocaleString()} ${currencyUnit} ${order.promoCode ? `(${order.promoCode})` : ""}\n` : ""}${order.tip > 0 ? `POURBOIRE  : +${order.tip.toLocaleString()} ${currencyUnit}\n` : ""}TOTAL NET  : ${order.total.toLocaleString()} ${currencyUnit}
----------------------------------------
RÈGLEMENT  : ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === "paid" ? "PAYÉ EN LIGNE ✅" : "ESPÈCES À ENCAISSER 💵"})
${order.paymentReference ? `RÉF DÉPÔT  : ${order.paymentReference}\n` : ""}${order.cashChangeAmount ? `MONNAIE    : ${order.cashChangeAmount}\n` : ""}COURSIER   : ${order.courierName || "Billo Express Niamey"} (${order.courierPhone || "+227 92 08 08 22"})
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
                <h2 className="text-base font-black uppercase tracking-wider">{settings.company_name}</h2>
                <p className="text-[10px] font-bold text-gray-700">★ PLATEFORME DE COMMANDE &amp; LIVRAISON ★</p>
                <div className="text-[9px] text-gray-700 font-mono space-y-0.5">
                  <p>NIF : {settings.nif} | RCCM : {settings.rccm || "N/A"}</p>
                  <p>📍 {settings.address}</p>
                </div>
                <div className="pt-1.5 border-t border-dashed border-gray-400 mt-1">
                  <p className="font-black text-sm text-gray-900 uppercase">{order.restaurantName}</p>
                  <p className="text-[10px] text-gray-700">📞 Tél Resto : {order.restaurantPhone || "+227 96 05 23 10"}</p>
                </div>
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
                <div className="flex justify-between text-[10px] font-bold text-gray-900">
                  <span>SERVICE :</span>
                  <span>
                    {order.serviceType === "delivery"
                      ? "🛵 LIVRAISON À DOMICILE"
                      : order.serviceType === "takeaway"
                      ? "🥡 À EMPORTER"
                      : "🍽️ SUR PLACE"}
                  </span>
                </div>
                {order.scheduledTime && (
                  <div className="flex justify-between text-[10px] font-bold text-gray-900 bg-gray-100 p-1 rounded">
                    <span>CRÉNEAU :</span>
                    <span>{order.scheduledTime}</span>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="py-2.5 border-b border-dashed border-black space-y-1">
                <p className="font-bold uppercase text-[10px] text-gray-600">DESTINATAIRE CLIENT :</p>
                <p className="font-black text-xs text-gray-900">{order.customerName}</p>
                <p className="font-bold text-[11px]">📞 {order.customerPhone}</p>
                <p className="text-[11px] font-semibold text-gray-800">
                  📍 {order.deliveryAddress}, Niamey
                </p>
              </div>

              {/* Items Table */}
              <div className="py-3 border-b-2 border-dashed border-black space-y-2">
                <div className="flex justify-between font-black text-[10px] text-gray-600 border-b border-gray-300 pb-1">
                  <span>ARTICLE, OPTIONS &amp; NOTES</span>
                  <span>TOTAL {currencyUnit}</span>
                </div>

                {order.items.map((it, idx) => {
                  const optionsList = Array.isArray(it.selectedOptions)
                    ? it.selectedOptions.map((o: any) => ({
                        name: o.name || "Option",
                        choice: o.choice || o.label || String(o),
                        extraPrice: Number(o.extraPrice || 0),
                      }))
                    : it.selectedOptions && typeof it.selectedOptions === "object"
                    ? Object.entries(it.selectedOptions).map(([key, val]) => ({
                        name: key,
                        choice: String(val),
                        extraPrice: 0,
                      }))
                    : [];

                  const unitPrice = it.unitPrice || it.menuItem.price || 0;

                  return (
                    <div key={idx} className="space-y-0.5 border-b border-gray-200 pb-1.5 last:border-none">
                      <div className="flex justify-between items-start font-bold">
                        <span className="flex-1 pr-2">
                          {it.quantity}x {it.menuItem.name}
                        </span>
                        <span className="whitespace-nowrap font-mono">{it.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-[9.5px] text-gray-600 pl-2">
                        P.U. : {unitPrice.toLocaleString()} {currencyUnit} {it.quantity > 1 ? `(x${it.quantity})` : ""}
                      </div>
                      {optionsList.length > 0 && (
                        <div className="pl-3 text-[10px] text-gray-700 space-y-0.5">
                          {optionsList.map((opt, oIdx) => (
                            <div key={oIdx} className="flex justify-between">
                              <span>↳ {opt.name && opt.name !== "Option" ? `${opt.name}: ` : ""}{opt.choice}</span>
                              {opt.extraPrice > 0 && <span>+{opt.extraPrice * it.quantity}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      {it.notes && (
                        <p className="text-[10px] italic font-semibold text-gray-800 bg-gray-100 p-1 rounded pl-2">
                          👉 Note cuisine : {it.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Financial Totals */}
              <div className="py-2.5 border-b-2 border-dashed border-black space-y-1 text-right">
                <div className="flex justify-between text-[11px]">
                  <span>Sous-total plats :</span>
                  <span className="font-bold">{order.subtotal.toLocaleString()} {currencyUnit}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Livraison (Billo Express) :</span>
                  <span className="font-bold">{order.deliveryFee.toLocaleString()} {currencyUnit}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Remise {order.promoCode ? `(${order.promoCode})` : ""} :</span>
                    <span>-{order.discount.toLocaleString()} {currencyUnit}</span>
                  </div>
                )}
                {order.tip && order.tip > 0 ? (
                  <div className="flex justify-between text-[11px]">
                    <span>Pourboire livreur :</span>
                    <span>+{order.tip.toLocaleString()} {currencyUnit}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-sm font-black border-t-2 border-black pt-1.5 mt-1">
                  <span>TOTAL NET TTC :</span>
                  <span>{order.total.toLocaleString()} {currencyUnit}</span>
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
                {order.paymentReference && (
                  <div className="flex justify-between text-[10px] font-mono">
                    <span>RÉF. DÉPÔT :</span>
                    <span className="font-bold">{order.paymentReference}</span>
                  </div>
                )}
                {order.cashChangeAmount && (
                  <p className="text-[10px] font-bold text-gray-800 bg-gray-100 p-1 rounded mt-1">
                    ⚠️ {order.cashChangeAmount}
                  </p>
                )}
              </div>

              {/* Delivery Handover Signature */}
              <div className="pt-3 text-center space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-700">
                  <span>Coursier :</span>
                  <span>{order.courierName || "Billo Express 🏍️"}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-700">
                  <span>Tél Coursier :</span>
                  <span className="font-mono">{order.courierPhone || "+227 92 08 08 22"}</span>
                </div>
                <div className="border border-dashed border-gray-400 p-2 text-[10px] text-gray-500 rounded">
                  Signature &amp; Emargement Livreur / Client
                  <div className="h-6"></div>
                </div>
                <div className="text-[8.5px] text-gray-600 space-y-0.5 pt-1">
                  <p>NIF : {settings.nif} &bull; RCCM : {settings.rccm}</p>
                  <p>Support Allôresto Niamey : {settings.phone} &bull; {settings.email}</p>
                </div>
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
