import React, { useState, useEffect, useMemo } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Copy,
  Check,
  PhoneCall,
  Download,
  Maximize2,
  X,
  Building2,
  Store,
  Sparkles,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { APP_CONFIG } from "../config/appConfig";

export interface PaymentQRCodeProps {
  restaurantId?: string;
  restaurantName: string;
  restaurantPhone?: string;
  amount: number;
  initialProvider?: string;
  orderReference?: string;
  customerPhone?: string;
  compact?: boolean;
  onProviderChange?: (providerId: string) => void;
}

export interface ProviderConfig {
  id: string;
  name: string;
  shortName: string;
  ussdPrefix: string;
  defaultNumber: string;
  brandColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  logoEmoji: string;
  instructions: string;
}

export const QR_PROVIDERS: ProviderConfig[] = [
  {
    id: "airtel_money",
    name: "Airtel Money Niger",
    shortName: "Airtel Money",
    ussdPrefix: "*155*",
    defaultNumber: APP_CONFIG.payments.airtelMoneyNumber || "+227 96 05 23 10",
    brandColor: "from-red-600 to-rose-700",
    badgeBg: "bg-red-500/15",
    badgeBorder: "border-red-500/30",
    badgeText: "text-red-400",
    logoEmoji: "🔴",
    instructions: "Composez *155# ou scannez ce code depuis votre application Airtel Money Niger.",
  },
  {
    id: "moov_money",
    name: "Moov Flooz Niger",
    shortName: "Moov Flooz",
    ussdPrefix: "*156*",
    defaultNumber: APP_CONFIG.payments.moovMoneyNumber || "+227 90 40 51 18",
    brandColor: "from-blue-600 to-indigo-700",
    badgeBg: "bg-blue-500/15",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    logoEmoji: "🔵",
    instructions: "Composez *156# ou scannez ce code depuis votre application Moov Africa Flooz.",
  },
  {
    id: "al_izza_business",
    name: "All-Iza Business",
    shortName: "All-Iza",
    ussdPrefix: "*133*",
    defaultNumber: APP_CONFIG.payments.alIzzaNumber || "+227 90 40 51 18",
    brandColor: "from-emerald-600 to-teal-700",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-400",
    logoEmoji: "🟢",
    instructions: "Effectuez votre paiement ou dépôt All-Iza Cash / Business vers ce compte marchand.",
  },
  {
    id: "mynita",
    name: "Mynita Dépôt",
    shortName: "Mynita",
    ussdPrefix: "*144*",
    defaultNumber: APP_CONFIG.payments.mynitaNumber || "+227 90 40 51 18",
    brandColor: "from-orange-600 to-amber-700",
    badgeBg: "bg-orange-500/15",
    badgeBorder: "border-orange-500/30",
    badgeText: "text-orange-400",
    logoEmoji: "🟠",
    instructions: "Dépôt direct ou transfert Mynita validé après envoi du reçu.",
  },
  {
    id: "amanata",
    name: "Amanata Dépôt",
    shortName: "Amanata",
    ussdPrefix: "*150*",
    defaultNumber: APP_CONFIG.payments.amanataNumber || "+227 90 40 51 18",
    brandColor: "from-cyan-600 to-blue-700",
    badgeBg: "bg-cyan-500/15",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-400",
    logoEmoji: "🩵",
    instructions: "Transfert sécurisé via les agences ou l'application Amanata Niger.",
  },
  {
    id: "zeyna",
    name: "Zeyna Dépôt",
    shortName: "Zeyna",
    ussdPrefix: "*155*",
    defaultNumber: APP_CONFIG.payments.zeynaNumber || "+227 90 40 51 18",
    brandColor: "from-purple-600 to-violet-700",
    badgeBg: "bg-purple-500/15",
    badgeBorder: "border-purple-500/30",
    badgeText: "text-purple-400",
    logoEmoji: "🟣",
    instructions: "Dépôt direct Zeyna avec validation par code SMS de confirmation.",
  },
];

export const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({
  restaurantId = "alloresto-resto",
  restaurantName,
  restaurantPhone = "+227 90 88 77 66",
  amount,
  initialProvider = "airtel_money",
  orderReference,
  customerPhone = "",
  compact = false,
  onProviderChange,
}) => {
  // Provider Selection State
  const [activeProviderId, setActiveProviderId] = useState<string>(() => {
    if (initialProvider === "mobile_money") return "airtel_money";
    return initialProvider || "airtel_money";
  });

  // Account Target: Direct Restaurant account vs Central Allôresto HQ account
  const [accountTarget, setAccountTarget] = useState<"restaurant" | "hq">("hq");

  // QR Code Image Data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedUssd, setCopiedUssd] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Sync initialProvider prop changes
  useEffect(() => {
    if (initialProvider) {
      const mapped = initialProvider === "mobile_money" ? "airtel_money" : initialProvider;
      if (QR_PROVIDERS.some((p) => p.id === mapped)) {
        setActiveProviderId(mapped);
      }
    }
  }, [initialProvider]);

  // Current Provider Object
  const provider = useMemo(() => {
    return QR_PROVIDERS.find((p) => p.id === activeProviderId) || QR_PROVIDERS[0];
  }, [activeProviderId]);

  // Dynamic Reference if none provided
  const orderRef = useMemo(() => {
    if (orderReference) return orderReference;
    const cleanResto = restaurantName.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "RES");
    return `CMD-${cleanResto}-${Math.floor(1000 + Math.random() * 9000)}`;
  }, [orderReference, restaurantName]);

  // Determine active recipient phone number
  const recipientPhone = useMemo(() => {
    if (accountTarget === "restaurant" && restaurantPhone) {
      return restaurantPhone;
    }
    return provider.defaultNumber;
  }, [accountTarget, restaurantPhone, provider.defaultNumber]);

  // Clean numeric phone (e.g. "96052310")
  const rawPhoneNumber = useMemo(() => {
    const digits = recipientPhone.replace(/[^0-9]/g, "");
    // If starts with 227 and length is 11, strip 227 for USSD short transfer syntax
    if (digits.startsWith("227") && digits.length === 11) {
      return digits.slice(3);
    }
    return digits;
  }, [recipientPhone]);

  // Format Direct USSD String for Airtel / Moov
  const ussdString = useMemo(() => {
    if (provider.id === "airtel_money") {
      // Airtel Money Niger transfer syntax: *155*1*1*NUMERO*MONTANT#
      return `*155*1*1*${rawPhoneNumber}*${amount}#`;
    }
    if (provider.id === "moov_money") {
      // Moov Flooz Niger transfer syntax: *156*1*1*NUMERO*MONTANT#
      return `*156*1*1*${rawPhoneNumber}*${amount}#`;
    }
    return `${provider.ussdPrefix}${rawPhoneNumber}*${amount}#`;
  }, [provider, rawPhoneNumber, amount]);

  // Structured QR Payload readable by cameras & mobile apps
  const qrPayload = useMemo(() => {
    const beneficiaryName =
      accountTarget === "restaurant"
        ? `${restaurantName}`
        : `Allôresto Niger (${restaurantName})`;

    return [
      `ALLORESTO-PAYMENT-NIGER`,
      `OPERATEUR=${provider.name}`,
      `DESTINATAIRE=${beneficiaryName}`,
      `TELEPHONE=${recipientPhone}`,
      `MONTANT=${amount} XOF`,
      `COMMANDE=${orderRef}`,
      `RESTAURANT=${restaurantName}`,
      `USSD=${ussdString}`,
    ].join("\n");
  }, [provider.name, accountTarget, restaurantName, recipientPhone, amount, orderRef, ussdString]);

  // Generate QR Code on any dependency change
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      qrPayload,
      {
        width: 360,
        margin: 1.5,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      },
      (err, url) => {
        if (!err && url && isMounted) {
          setQrDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [qrPayload]);

  const handleProviderSelect = (provId: string) => {
    setActiveProviderId(provId);
    if (onProviderChange) {
      onProviderChange(provId);
    }
  };

  const handleCopyUssd = () => {
    navigator.clipboard.writeText(ussdString);
    setCopiedUssd(true);
    setTimeout(() => setCopiedUssd(false), 2200);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(recipientPhone);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const safeRestoName = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20);
    a.download = `qrcode-alloresto-${safeRestoName}-${provider.id}-${amount}fcfa.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-3 sm:p-4 text-slate-100 shadow-xl space-y-3.5">
      {/* Header with Provider Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-base shrink-0 border border-orange-500/30">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Paiement Instantané par QR Code
              </h4>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Niger 🇳🇪
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scannez pour préremplir votre transfert ou lancez le code USSD direct
            </p>
          </div>
        </div>

        {/* Restaurant Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
          <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-bold text-white truncate max-w-[170px]" title={restaurantName}>
            {restaurantName}
          </span>
        </div>
      </div>

      {/* Operator Pills / Selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            1. Choisissez votre opérateur Mobile Money :
          </span>
          <span className="text-[10px] text-amber-400/90 font-mono font-semibold">
            {QR_PROVIDERS.length} Réseaux au Niger
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {QR_PROVIDERS.map((p) => {
            const isSelected = p.id === activeProviderId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderSelect(p.id)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "bg-slate-800 border-white/60 text-white shadow-md ring-1 ring-white/30"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span className="text-base leading-none">{p.logoEmoji}</span>
                <span className="text-[10px] font-bold truncate max-w-full block leading-tight">
                  {p.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Target Selector: HQ Allôresto vs Direct Restaurant */}
      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400 font-medium pl-1 hidden sm:inline">
          Bénéficiaire du dépôt :
        </span>
        <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setAccountTarget("hq")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              accountTarget === "hq"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span>Siège Allôresto (Recommandé)</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountTarget("restaurant")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              accountTarget === "restaurant"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <Store className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[130px]">Direct {restaurantName}</span>
          </button>
        </div>
      </div>

      {/* Main QR Code & Details Card */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-3 sm:p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Optical White QR Card */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/60 relative group">
            {/* Operator Corner Tag */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white border border-slate-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <span>{provider.logoEmoji}</span>
              <span>{provider.shortName}</span>
            </div>

            {/* Target QR Code Image */}
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code ${provider.name} pour ${restaurantName}`}
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg transition-transform group-hover:scale-102"
              />
            ) : (
              <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-xs font-mono">
                Génération...
              </div>
            )}

            {/* Corner Scan Brackets Decoration */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-orange-500 rounded-tl pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-orange-500 rounded-tr pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-orange-500 rounded-bl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-orange-500 rounded-br pointer-events-none" />
          </div>

          {/* Quick Lightbox / Zoom Action */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="mt-2 text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Agrandir le QR Code plein écran</span>
          </button>
        </div>

        {/* Transfer Metadata & Actions */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Amount Callout */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Montant exact à transférer
              </span>
              <span className="text-lg font-black text-orange-400 font-mono">
                {amount.toLocaleString()} FCFA
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Référence commande
              </span>
              <span className="text-xs font-black text-slate-200 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {orderRef}
              </span>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="text-xs space-y-1.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Bénéficiaire :</span>
              <span className="font-bold text-white text-[11px]">
                {accountTarget === "hq" ? "Allôresto Siège Central" : restaurantName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Numéro de transfert :</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-amber-400 text-xs">
                  {recipientPhone}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copier le numéro"
                >
                  {copiedNumber ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick USSD Bar */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                Code USSD direct pré-rempli :
              </span>
              <span className="font-mono text-xs font-black text-emerald-400 truncate block">
                {ussdString}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopyUssd}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                title="Copier le code USSD complet"
              >
                {copiedUssd ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier USSD</span>
                  </>
                )}
              </button>

              {/* Direct Tel Call Link */}
              <a
                href={`tel:${encodeURIComponent(ussdString)}`}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow transition cursor-pointer"
                title="Lancer le code USSD sur smartphone"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Composer</span>
              </a>
            </div>
          </div>

          {/* Download and Share Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Télécharger le QR Code (PNG)</span>
            </button>

            <span className="text-[10px] text-slate-500 font-medium">
              💡 Validation automatique dès réception
            </span>
          </div>
        </div>
      </div>

      {/* 3 Step Guidance Box */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Comment régler en 3 secondes :</span>
        </div>
        <ol className="list-decimal list-inside space-y-0.5 pl-1 leading-relaxed">
          <li>
            Ouvrez l&apos;application <strong>{provider.shortName}</strong> ou votre appareil photo.
          </li>
          <li>
            Scannez le code QR ci-dessus ou cliquez sur <strong>« Composer »</strong> pour lancer le code USSD.
          </li>
          <li>
            Confirmez le transfert avec votre code secret PIN et transmettez le reçu pour validation cuisine !
          </li>
        </ol>
      </div>

      {/* Fullscreen Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
                Scan plein écran haute visibilité
              </span>
              <h3 className="text-base font-black text-white">{restaurantName}</h3>
              <p className="text-xs text-slate-400">
                Opérateur : <strong className="text-white">{provider.name}</strong> &bull;{" "}
                <strong className="text-emerald-400">{amount.toLocaleString()} FCFA</strong>
              </p>
            </div>

            {/* High Resolution QR Box */}
            <div className="p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              <img
                src={qrDataUrl}
                alt="QR Code Agrandissement"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
            </div>

            <div className="text-xs font-mono font-bold text-amber-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              USSD : {ussdString}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyUssd}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                {copiedUssd ? "✓ Code USSD Copié" : "Copier Code USSD"}
              </button>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
