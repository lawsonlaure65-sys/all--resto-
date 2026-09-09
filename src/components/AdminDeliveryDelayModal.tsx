import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Send,
  Copy,
  Check,
  Phone,
  AlertTriangle,
  Gift,
  ChefHat,
  Bike,
  Sparkles,
  MessageSquare,
  Globe,
} from "lucide-react";
import {
  generateDeliveryDelayMessage,
  sendDeliveryDelayWhatsApp,
  DelayAutomationConfig,
  loadDelayAutomationConfig,
} from "../utils/whatsappNotifications";
import { AppLanguage } from "../types";

export interface DelayModalOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  restaurant_name: string;
  driver_name?: string;
  delivery_address: string;
  district: string;
  created_at: string;
  delay_minutes?: number;
  delay_reason?: string;
  delay_notified_at?: string;
  delay_notified_count?: number;
}

interface AdminDeliveryDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DelayModalOrder | null;
  onNotificationSent?: (orderId: string, delayMinutes: number, reason: string) => void;
}

const COMMON_REASONS = [
  "Forte affluence en cuisine & préparation soignée au feu doux",
  "Ralentissement important de la circulation (Avenue de l'Islam / Grand Marché)",
  "Vent de sable & conditions météo réduisant la vitesse des coursiers",
  "Relais coursier Billo Express en cours d'acheminement",
  "Vérification qualité & maintien en caisson isotherme",
];

const COMMON_COMPENSATIONS = [
  "Bénéficiez de -500 FCFA avec le code promo RETARD500 sur votre prochaine commande !",
  "Une boisson fraîche artisanale offerte au prochain repas avec le code CADEAU227 !",
  "Frais de livraison Billo Express 100% offerts sur votre prochain panier !",
  "Aucun code promo (excuses cordiales uniquement)",
];

export const AdminDeliveryDelayModal: React.FC<AdminDeliveryDelayModalProps> = ({
  isOpen,
  onClose,
  order,
  onNotificationSent,
}) => {
  const [config, setConfig] = useState<DelayAutomationConfig>(loadDelayAutomationConfig());
  const [delayMinutes, setDelayMinutes] = useState<number>(15);
  const [selectedReason, setSelectedReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>("");
  const [selectedCompensation, setSelectedCompensation] = useState<string>(COMMON_COMPENSATIONS[0]);
  const [customCompensation, setCustomCompensation] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>("fr");
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const currentConfig = loadDelayAutomationConfig();
      setConfig(currentConfig);
      setDelayMinutes(currentConfig.defaultAdditionalMinutes || 15);
      setSelectedReason(currentConfig.defaultReason || COMMON_REASONS[0]);
      setSelectedLanguage(currentConfig.defaultLanguage || "fr");
      setCopied(false);
      setSentSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const activeReason = customReason.trim() ? customReason : selectedReason;
  const activeCompensation =
    selectedCompensation === COMMON_COMPENSATIONS[3]
      ? ""
      : customCompensation.trim()
      ? customCompensation
      : selectedCompensation;

  const previewMessage = generateDeliveryDelayMessage({
    orderId: order.id,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    restaurantName: order.restaurant_name,
    courierName: order.driver_name || "Billo Express Niamey",
    courierPhone: "+227 92 08 08 22",
    deliveryAddress: `${order.delivery_address} (${order.district})`,
    delayMinutes: delayMinutes,
    reason: activeReason,
    compensation: activeCompensation,
    lang: selectedLanguage,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    sendDeliveryDelayWhatsApp({
      orderId: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      restaurantName: order.restaurant_name,
      courierName: order.driver_name || "Billo Express Niamey",
      courierPhone: "+227 92 08 08 22",
      deliveryAddress: `${order.delivery_address} (${order.district})`,
      delayMinutes: delayMinutes,
      reason: activeReason,
      compensation: activeCompensation,
      lang: selectedLanguage,
    });

    setSentSuccess(true);
    if (onNotificationSent) {
      onNotificationSent(order.id, delayMinutes, activeReason);
    }
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Calculate elapsed time in minutes
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Notification WhatsApp — Retard de Livraison
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  {order.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Avertissez le client instantanément sur WhatsApp avec transparence et geste commercial.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Order Summary Strip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Client & Contact</span>
              <div className="font-bold text-white text-sm">{order.customer_name}</div>
              <div className="text-emerald-400 font-mono flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{order.customer_phone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Restaurant & Quartier</span>
              <div className="font-bold text-slate-200">{order.restaurant_name}</div>
              <div className="text-slate-400 truncate">{order.district} • {order.delivery_address}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Temps Écoulé & Livreur</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                  ⏳ {elapsedMinutes} min écoulées
                </span>
                {order.delay_notified_count ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    Déjà notifié ({order.delay_notified_count}x)
                  </span>
                ) : null}
              </div>
              <div className="text-slate-400 text-[11px]">
                🏍️ {order.driver_name || "Livreur Billo Express assigné"}
              </div>
            </div>
          </div>

          {/* Form Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Form Controls */}
            <div className="space-y-4">
              {/* 1. Additional Delay Minutes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>⏱️ Délai additionnel à annoncer</span>
                  <span className="text-amber-400 font-black text-sm">+{delayMinutes} minutes</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[10, 15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDelayMinutes(mins)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                        delayMinutes === mins
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                          : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                      }`}
                    >
                      +{mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Reason for delay */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-orange-400" />
                  <span>Motif du ralentissement</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    setCustomReason("");
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 mb-2"
                >
                  {COMMON_REASONS.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Ou précisez un motif personnalisé..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 3. Commercial gesture / Compensation */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Geste commercial & Excuses</span>
                </label>
                <select
                  value={selectedCompensation}
                  onChange={(e) => {
                    setSelectedCompensation(e.target.value);
                    setCustomCompensation("");
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 mb-2"
                >
                  {COMMON_COMPENSATIONS.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {selectedCompensation !== COMMON_COMPENSATIONS[3] && (
                  <input
                    type="text"
                    placeholder="Personnaliser le code promo ou le cadeau..."
                    value={customCompensation}
                    onChange={(e) => setCustomCompensation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>

              {/* 4. Language Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Langue du message WhatsApp</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { code: "fr", label: "Français", flag: "🇫🇷" },
                    { code: "ha", label: "Hausa", flag: "🇳🇪" },
                    { code: "zm", label: "Zarma", flag: "🇳🇪" },
                    { code: "en", label: "English", flag: "🇬🇧" },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSelectedLanguage(l.code as AppLanguage)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                        selectedLanguage === l.code
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm"
                          : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: WhatsApp Live Chat Preview */}
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Aperçu en direct (WhatsApp)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copié !" : "Copier le texte"}</span>
                  </button>
                </div>

                {/* Simulated WhatsApp Chat Bubble */}
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#202c33] text-[12px] font-sans text-slate-200 leading-relaxed shadow-inner max-h-[300px] overflow-y-auto whitespace-pre-wrap selection:bg-emerald-600">
                  <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none shadow-md space-y-2 border border-[#006e59]">
                    {previewMessage}
                    <div className="text-[10px] text-emerald-200 text-right flex items-center justify-end gap-1 font-mono pt-1">
                      <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span>✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status note */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  L&apos;envoi ouvrira l&apos;application WhatsApp ou WhatsApp Web avec le message prérempli pour <strong>{order.customer_name}</strong> ({order.customer_phone}).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Fermer sans envoyer
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Copier le Texte"}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={sentSuccess}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                sentSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
              }`}
            >
              {sentSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Envoyé avec succès !</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>📲 Envoyer sur WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
