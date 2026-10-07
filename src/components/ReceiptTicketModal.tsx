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
import { useAppSettings } from "../services/appSettingsService";

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
  const settings = useAppSettings();

  if (!order) return null;

  const currencyUnit = settings.currency || "FCFA";

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemsList = order.items
      .map((it) => {
        const optionsList = Array.isArray(it.selectedOptions)
          ? it.selectedOptions.map((o: any) => o.choice || o.label || String(o))
          : it.selectedOptions && typeof it.selectedOptions === "object"
          ? Object.entries(it.selectedOptions).map(([k, v]) => `${k}: ${v}`)
          : [];
        const optText = optionsList.length > 0 ? ` [${optionsList.join(", ")}]` : "";
        const noteText = it.notes ? ` (Note: ${it.notes})` : "";
        return `• ${it.quantity}x ${it.menuItem.name}${optText}${noteText} [PU: ${(it.unitPrice || it.menuItem.price || 0).toLocaleString()} ${currencyUnit}] = ${it.totalPrice.toLocaleString()} ${currencyUnit}`;
      })
      .join("\n");

    const serviceModeLabel =
      order.serviceType === "delivery"
        ? "🛵 Livraison à domicile"
        : order.serviceType === "takeaway"
        ? "🥡 À emporter"
        : "🍽️ Sur place";

    const message = encodeURIComponent(
      `🧾 *TICKET DE CAISSE OFFICIEL ALLÔRESTO #${order.id}*\n` +
        `🏢 *${settings.company_name}*\n` +
        `📍 *Siège Social :* ${settings.address}\n` +
        `📋 *NIF :* ${settings.nif} | *RCCM :* ${settings.rccm}\n` +
        `📞 *Tél / Support :* ${settings.phone} | ✉️ *Email :* ${settings.email}\n` +
        `🌐 *Site Web :* ${settings.website}\n` +
        `_Livraison express assurée par Billo Express Niamey_\n\n` +
        `📅 *Date :* ${order.createdAt || formattedDate}\n` +
        `🛎️ *Service :* ${serviceModeLabel}\n` +
        `🏪 *Restaurant :* ${order.restaurantName} (Tél: ${order.restaurantPhone || "+227 96 05 23 10"})\n` +
        `👤 *Client :* ${order.customerName} (${order.customerPhone})\n` +
        `📍 *Lieu :* ${order.deliveryAddress}\n` +
        (order.scheduledTime ? `⏰ *Créneau souhaité :* ${order.scheduledTime}\n` : "") +
        `\n🍽️ *Détail des plats & options :*\n${itemsList}\n\n` +
        `💵 *Sous-total :* ${order.subtotal.toLocaleString()} ${currencyUnit}\n` +
        `🛵 *Frais de livraison :* ${order.deliveryFee.toLocaleString()} ${currencyUnit}\n` +
        (order.discount > 0
          ? `🎁 *Remise${order.promoCode ? ` (${order.promoCode})` : ""} :* -${order.discount.toLocaleString()} ${currencyUnit}\n`
          : "") +
        (order.tip > 0
          ? `🪙 *Pourboire livreur :* +${order.tip.toLocaleString()} ${currencyUnit}\n`
          : "") +
        `💰 *TOTAL RÉGLÉ :* ${order.total.toLocaleString()} ${currencyUnit}\n` +
        `💳 *Moyen :* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === "paid" ? "PAYÉ EN LIGNE" : "ESPÈCES À LA LIVRAISON"})\n` +
        (order.paymentReference ? `🔢 *Réf. Transaction :* ${order.paymentReference}\n` : "") +
        (order.cashChangeAmount ? `⚠️ *Monnaie :* ${order.cashChangeAmount}\n` : "") +
        `\n🛵 *Coursier :* ${order.courierName || "Billo Express"} (${order.courierPhone || "+227 92 08 08 22"})\n` +
        `🕌 *Note Jumu'ah :* Pause le vendredi de 11h à 15h pour la prière.\n` +
        `✅ Merci d'avoir choisi ${settings.company_name} !`
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
              {/* Receipt Header - Identité Légale & Fiscale Officielle (Niger) */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-center mb-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                    ALLÔ<span className="text-[#F36C21]">RESTO</span>
                  </span>
                </div>
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-wider font-sans">
                  {settings.company_name || "Allôresto Niger SARL"}
                </h4>
                <p className="text-[10px] font-semibold text-slate-700">
                  Plateforme de Commande &amp; Livraison en Ligne
                </p>
                <div className="text-[9px] text-slate-600 space-y-0.5 pt-0.5">
                  <p className="font-medium text-slate-800">
                    📍 {settings.address || "Poudrière II, Niamey, Niger"}
                  </p>
                  <p className="font-mono font-bold text-slate-900">
                    NIF : {settings.nif || "NIF-10024/P-NE"} &bull; RCCM : {settings.rccm || "RCCM-NE-NIA-2019-B-898"}
                  </p>
                  <p className="text-[8.5px] text-slate-600">
                    📞 Tél : <span className="font-bold text-slate-900">{settings.phone || "+227 96052310"}</span> &bull; ✉️ {settings.email || "lawson.laure65@gmail.com"}
                  </p>
                  {settings.website && (
                    <p className="text-[8.5px] text-orange-600 font-bold">
                      🌐 {settings.website}
                    </p>
                  )}
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest pt-0.5 font-sans">
                    RÉPUBLIQUE DU NIGER 🇳🇪 &bull; Agrément HAPDP &bull; Billo Express
                  </p>
                </div>
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
                  <span className="text-slate-500">SERVICE :</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {order.serviceType === "delivery"
                      ? "🛵 Livraison à domicile"
                      : order.serviceType === "takeaway"
                      ? "🥡 À emporter"
                      : "🍽️ Sur place"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">RESTO :</span>
                  <span className="font-bold text-slate-900 truncate max-w-[190px]">
                    {order.restaurantName}
                  </span>
                </div>
                {order.restaurantPhone && (
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">TÉL RESTO :</span>
                    <span className="text-slate-800 font-mono">{order.restaurantPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">CLIENT :</span>
                  <span className="font-bold text-slate-900 truncate max-w-[190px]">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">TÉLÉPHONE :</span>
                  <span className="text-slate-900 font-mono font-bold">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between items-start pt-0.5">
                  <span className="text-slate-500 shrink-0">ADRESSE :</span>
                  <span className="text-right text-slate-800 font-medium text-[10px] max-w-[190px]">
                    {order.deliveryAddress}
                  </span>
                </div>
                {order.scheduledTime && (
                  <div className="flex justify-between text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1">
                    <span>CRÉNEAU SOUHAITÉ :</span>
                    <span>{order.scheduledTime}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2 pb-3 border-b border-dashed border-slate-300 text-[11px]">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 pb-1 border-b border-slate-200">
                  <span>DÉSIGNATION &amp; OPTIONS</span>
                  <span>TOTAL</span>
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
                    <div key={idx} className="space-y-0.5 pb-1 border-b border-slate-100 last:border-none">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span className="truncate max-w-[210px]">
                          {it.quantity}x {it.menuItem.name}
                        </span>
                        <span className="font-mono shrink-0">
                          {it.totalPrice.toLocaleString()} {currencyUnit}
                        </span>
                      </div>

                      <div className="text-[9.5px] text-slate-500 flex justify-between pl-2">
                        <span>P.U. : {unitPrice.toLocaleString()} {currencyUnit}</span>
                        {it.quantity > 1 && <span>x{it.quantity}</span>}
                      </div>

                      {optionsList.length > 0 && (
                        <div className="pl-3 text-[10px] text-slate-600 space-y-0.5">
                          {optionsList.map((opt, oIdx) => (
                            <div key={oIdx} className="flex justify-between items-baseline">
                              <span className="font-medium text-slate-700">
                                ↳ {opt.name && opt.name !== "Option" ? `${opt.name}: ` : ""}{opt.choice}
                              </span>
                              {opt.extraPrice > 0 && (
                                <span className="font-mono text-[9px] text-slate-500">
                                  +{opt.extraPrice * it.quantity} {currencyUnit}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {it.notes && (
                        <div className="pl-3 text-[9.5px] italic text-amber-900 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/60 font-medium">
                          👉 Note cuisine : {it.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation & Total */}
              <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-600">
                  <span>SOUS-TOTAL PLATS :</span>
                  <span className="font-mono">{order.subtotal.toLocaleString()} {currencyUnit}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>LIVRAISON BILLO EXPRESS :</span>
                  </span>
                  <span className="font-mono">{order.deliveryFee.toLocaleString()} {currencyUnit}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>REMISE PROMO {order.promoCode ? `(${order.promoCode})` : ""} :</span>
                    <span className="font-mono">-{order.discount.toLocaleString()} {currencyUnit}</span>
                  </div>
                )}

                {order.tip && order.tip > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>POURBOIRE LIVREUR :</span>
                    <span className="font-mono">+{order.tip.toLocaleString()} {currencyUnit}</span>
                  </div>
                ) : null}

                {/* Grand Total Box */}
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-black text-xs text-slate-900">NET À PAYER :</span>
                    <span className="font-black text-base text-slate-900 font-mono">
                      {order.total.toLocaleString()} {currencyUnit}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 text-right mt-0.5">
                    TVA &amp; Taxes républicaines incluses
                  </p>
                </div>
              </div>

              {/* Payment & Courier Info */}
              <div className="space-y-1 text-[10px] text-slate-600 pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span>RÈGLEMENT :</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {order.paymentMethod} &bull; {order.paymentStatus === "paid" ? "REÇU DÉPÔT VALIDÉ" : "ESPÈCES À LA LIVRAISON"}
                  </span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between text-amber-800 font-mono">
                    <span>RÉF. DÉPÔT :</span>
                    <span className="font-bold">{order.paymentReference}</span>
                  </div>
                )}
                {order.cashChangeAmount && (
                  <div className="flex justify-between text-amber-900 font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                    <span>MONNAIE DEMANDÉE :</span>
                    <span>{order.cashChangeAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>COURSIER ASSIGNÉ :</span>
                  <span className="font-bold text-slate-900">
                    {order.courierName || "Billo Express Niamey"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TÉL COURSIER :</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {order.courierPhone || "+227 92 08 08 22"}
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

                <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                  *** MERCI DE VOTRE CONFIANCE ! ***
                </p>

                <div className="p-2.5 w-full rounded-xl bg-slate-50 border border-slate-200 text-[9px] text-slate-600 space-y-1 text-left">
                  <div className="flex justify-between items-center text-[8.5px] font-mono font-bold text-slate-800">
                    <span>NIF : {settings.nif}</span>
                    <span>RCCM : {settings.rccm}</span>
                  </div>
                  <p className="text-[8.5px] text-slate-700">
                    🏢 <strong>{settings.company_name}</strong> &bull; Siège : {settings.address}
                  </p>
                  <p className="text-[8.5px] font-medium text-slate-800">
                    📞 Support Client &amp; Urgence : <strong className="text-slate-900">{settings.phone}</strong>
                  </p>
                  <div className="flex flex-wrap justify-between gap-1 text-[8px] text-slate-500 pt-0.5 border-t border-slate-200">
                    <span>✉️ {settings.email}</span>
                    {settings.website && <span className="font-medium text-orange-600">🌐 {settings.website}</span>}
                  </div>
                </div>
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
