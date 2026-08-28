import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Utensils,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { Order, KitchenWhatsAppMessage } from "../types";
import {
  generateOrderConfirmationMessage,
  generateCookingProgressMessage,
  generateKitchenSpecialNoteMessage,
  generateOrderReadyMessage,
  generateClientToKitchenMessage,
  openWhatsAppDirect,
} from "../utils/whatsappNotifications";
import { playSoundOrderConfirmed, playSoundStatusUpdate } from "../utils/audioNotifications";

interface KitchenWhatsAppHubProps {
  order: Order;
  mode?: "kitchen" | "client";
  onAddMessageLog?: (orderId: string, message: KitchenWhatsAppMessage) => void;
}

export const KitchenWhatsAppHub: React.FC<KitchenWhatsAppHubProps> = ({
  order,
  mode = "kitchen",
  onAddMessageLog,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("");
  const [selectedQuickPreset, setSelectedQuickPreset] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [liveMessages, setLiveMessages] = useState<KitchenWhatsAppMessage[]>(
    order.whatsappChatLogs || [
      {
        id: "msg-init-1",
        sender: "system",
        text: `Canal WhatsApp Allôresto initialisé pour la commande #${order.id} (${order.restaurantName}).`,
        timestamp: order.createdAt || "Aujourd'hui",
        type: "confirmation",
      },
    ]
  );

  const handleSendMessage = (textToSend: string, sender: "kitchen" | "client", type: KitchenWhatsAppMessage["type"] = "custom_note") => {
    if (!textToSend.trim()) return;

    const newMsg: KitchenWhatsAppMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      type,
    };

    setLiveMessages((prev) => [...prev, newMsg]);
    if (onAddMessageLog) {
      onAddMessageLog(order.id, newMsg);
    }

    if (sender === "kitchen") {
      playSoundOrderConfirmed();
      // Ouvre WhatsApp vers le téléphone du client
      openWhatsAppDirect(order.customerPhone || "22770032552", textToSend);
    } else {
      playSoundStatusUpdate();
      // Client envoie vers le WhatsApp du restaurant ou service client
      openWhatsAppDirect(order.restaurantPhone || "22770032552", textToSend);
    }

    setCustomText("");
    setSelectedQuickPreset(null);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Presets pour la Cuisine
  const kitchenPresets = [
    {
      id: "confirm_cooking",
      label: "🛎️ Lancement Cuisson",
      type: "confirmation" as const,
      getText: () => generateOrderConfirmationMessage(order, 25),
    },
    {
      id: "eta_plus_10",
      label: "⏱️ Cuisson +10 min (Braiser à point)",
      type: "eta_update" as const,
      getText: () =>
        generateCookingProgressMessage(
          order,
          10,
          "Le chef braise la viande au Kan-Kan pour un croustillant parfait."
        ),
    },
    {
      id: "spice_ok",
      label: "🌶️ Piment & Sauces Confirmés",
      type: "custom_note" as const,
      getText: () =>
        generateKitchenSpecialNoteMessage(
          order,
          "Le dosage de piment et les sauces choisies sont bien respectés par le chef !"
        ),
    },
    {
      id: "thermal_packed",
      label: "📦 Emballé en Boîte Thermique",
      type: "ready" as const,
      getText: () =>
        generateKitchenSpecialNoteMessage(
          order,
          "Votre commande est prête, maintenue au chaud dans un sac isotherme hermétique scellé."
        ),
    },
    {
      id: "ready_courier",
      label: "🏍️ Remis au Livreur Billo",
      type: "ready" as const,
      getText: () => generateOrderReadyMessage(order),
    },
  ];

  // Presets pour le Client
  const clientPresets = [
    {
      id: "client_no_spice",
      label: "🌶️ Sans piment fort svp",
      getText: () =>
        generateClientToKitchenMessage(
          order,
          "spice",
          "Merci de ne pas mettre de piment fort ou de le servir à part dans une petite boîte."
        ),
    },
    {
      id: "client_extra_sauce",
      label: "🥫 Supplément de sauce Kan-Kan",
      getText: () =>
        generateClientToKitchenMessage(
          order,
          "sauce",
          "Pourriez-vous ajouter un petit supplément de sauce d'accompagnement ?"
        ),
    },
    {
      id: "client_cutlery",
      label: "🥢 Couverts & Serviettes",
      getText: () =>
        generateClientToKitchenMessage(
          order,
          "cutlery",
          "Merci de prévoir des couverts jetables et serviettes supplémentaires pour le bureau."
        ),
    },
    {
      id: "client_desk_instruction",
      label: "🏢 Précision Étage / Bureau",
      getText: () =>
        generateClientToKitchenMessage(
          order,
          "address_note",
          `Je suis au bureau / à l'adresse : ${order.deliveryAddress}. Merci d'appeler dès que le livreur arrive devant le portail.`
        ),
    },
  ];

  const activePresets = mode === "kitchen" ? kitchenPresets : clientPresets;

  return (
    <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/30 overflow-hidden shadow-lg transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between gap-3 text-left hover:bg-slate-900 transition cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {mode === "kitchen" ? "Canal WhatsApp Cuisine ➔ Client" : "Échanger avec la Cuisine par WhatsApp"}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider">
                Dynamique &amp; Auto
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {mode === "kitchen"
                ? `Client : ${order.customerName} (${order.customerPhone})`
                : `Restaurant : ${order.restaurantName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 font-mono font-bold hidden sm:inline">
            {liveMessages.length} message(s)
          </span>
          <div className="p-1 rounded-lg bg-slate-800 text-slate-300">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-800/80 bg-slate-900/60">
          {/* Quick Dynamic Action Buttons */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {mode === "kitchen"
                ? "⚡ Actions Rapides Automatisées (1-Clic WhatsApp)"
                : "⚡ Demandes Spéciales Directes vers la Cuisine :"}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    const text = preset.getText();
                    setSelectedQuickPreset(preset.id);
                    setCustomText(text);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition flex items-center justify-between gap-2 cursor-pointer ${
                    selectedQuickPreset === preset.id
                      ? "bg-emerald-950 border-emerald-500 text-emerald-200"
                      : "bg-slate-950/80 hover:bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                  <Send className="w-3 h-3 text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Message Composer & Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-400" />
                <span>Message Prêt à Expédier via WhatsApp Niger (+227) :</span>
              </label>
              {customText && (
                <button
                  type="button"
                  onClick={() => handleCopyMessage(customText)}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copié !" : "Copier le texte"}</span>
                </button>
              )}
            </div>

            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={
                mode === "kitchen"
                  ? "Saisissez ou choisissez un message ci-dessus pour notifier immédiatement le client..."
                  : "Indiquez une précision pour le chef (sauce, piment, couverts, heure)..."
              }
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>Destinataire : {mode === "kitchen" ? (order.customerPhone || "+227 70 03 25 52") : (order.restaurantPhone || "+227 70 03 25 52")}</span>
              </span>

              <button
                type="button"
                disabled={!customText.trim()}
                onClick={() =>
                  handleSendMessage(
                    customText,
                    mode === "kitchen" ? "kitchen" : "client",
                    "custom_note"
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Live Exchange History simulation */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Historique des notifications &amp; échanges :
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {liveMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs space-y-1 ${
                    msg.sender === "kitchen"
                      ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 ml-4"
                      : msg.sender === "client"
                      ? "bg-orange-950/60 border border-orange-500/30 text-orange-200 mr-4"
                      : "bg-slate-950 border border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80">
                    <span className="font-bold">
                      {msg.sender === "kitchen" ? "👨‍🍳 Cuisine (Restaurant)" : msg.sender === "client" ? "👤 Client" : "⚙️ Système"}
                    </span>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-[11px] whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
