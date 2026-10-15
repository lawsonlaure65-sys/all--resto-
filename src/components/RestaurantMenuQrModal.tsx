import React, { useState, useEffect, useMemo, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  X,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Store,
  Wifi,
  Smartphone,
  Layers,
  Palette,
  FileText,
  Eye,
  Info,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Restaurant } from "../types";

export interface RestaurantMenuQrModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
  onTestOrder?: (tableNumber?: string) => void;
}

export type QrPrintFormat = "tent" | "sticker" | "poster" | "batch";

export const RestaurantMenuQrModal: React.FC<RestaurantMenuQrModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onTestOrder,
}) => {
  // Configuration options
  const [tableNumber, setTableNumber] = useState<string>("Table 1");
  const [customTableInput, setCustomTableInput] = useState<string>("");
  const [isCustomTable, setIsCustomTable] = useState<boolean>(false);
  const [orderMode, setOrderMode] = useState<"dine_in" | "takeaway" | "delivery">("dine_in");
  const [qrColor, setQrColor] = useState<string>("#0f172a");
  const [wifiSsid, setWifiSsid] = useState<string>(`WiFi_${restaurant.name.replace(/[^a-zA-Z0-9]/g, "")}`);
  const [wifiPassword, setWifiPassword] = useState<string>("Sahel2026");
  const [includeWifi, setIncludeWifi] = useState<boolean>(true);
  const [customWelcome, setCustomWelcome] = useState<string>(
    "Scannez ce QR Code avec votre appareil photo pour voir la carte et commander immédiatement !"
  );
  const [activeFormat, setActiveFormat] = useState<QrPrintFormat>("tent");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [batchCount, setBatchCount] = useState<number>(6);
  const [batchQrUrls, setBatchQrUrls] = useState<Record<string, string>>({});

  // Active table computed value
  const activeTable = useMemo(() => {
    if (orderMode !== "dine_in") return "";
    return isCustomTable ? customTableInput || "Table 1" : tableNumber;
  }, [orderMode, isCustomTable, customTableInput, tableNumber]);

  // Construct the targeted Scan & Order URL
  const targetOrderUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://alloresto.ne";
    const params = new URLSearchParams();
    params.set("scan", "resto");
    params.set("resto", restaurant.id);
    if (orderMode === "dine_in" && activeTable) {
      params.set("table", activeTable);
      params.set("mode", "dine_in");
    } else if (orderMode === "takeaway") {
      params.set("mode", "takeaway");
    } else {
      params.set("mode", "delivery");
    }
    return `${origin}/?${params.toString()}`;
  }, [restaurant.id, orderMode, activeTable]);

  // Generate primary QR Code
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      targetOrderUrl,
      {
        width: 600,
        margin: 2,
        color: {
          dark: qrColor,
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
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
  }, [targetOrderUrl, qrColor]);

  // Generate batch QR codes for multi-table print sheet
  useEffect(() => {
    let isMounted = true;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://alloresto.ne";
    const tables = Array.from({ length: batchCount }, (_, i) => `Table ${i + 1}`);

    const generateBatch = async () => {
      const results: Record<string, string> = {};
      for (const t of tables) {
        const u = `${origin}/?scan=resto&resto=${restaurant.id}&table=${encodeURIComponent(t)}&mode=dine_in`;
        try {
          const dataUrl = await QRCode.toDataURL(u, {
            width: 400,
            margin: 1.5,
            color: { dark: qrColor, light: "#ffffff" },
            errorCorrectionLevel: "M",
          });
          results[t] = dataUrl;
        } catch (e) {
          console.warn("Erreur génération QR batch:", e);
        }
      }
      if (isMounted) {
        setBatchQrUrls(results);
      }
    };

    if (activeFormat === "batch") {
      generateBatch();
    }

    return () => {
      isMounted = false;
    };
  }, [batchCount, restaurant.id, qrColor, activeFormat]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetOrderUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    const safeName = restaurant.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const safeTable = (activeTable || "menu").toLowerCase().replace(/[^a-z0-9]/g, "-");
    a.download = `qrcode-menu-${safeName}-${safeTable}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const quickTables = ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6", "VIP 1", "Terrasse 1"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/20 shrink-0">
              <QrCode className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Générateur de QR Code Menu &amp; Tables
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/30 hidden sm:inline-block">
                  Commande en Salle 🇳🇪
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {restaurant.name} &bull; Vos clients scannent et commandent immédiatement dès leur arrivée.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer shrink-0"
              title="Lancer l'impression"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer Chevalet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Gabarit d&apos;export :</span>
            </span>
            {[
              { id: "tent", label: "Chevalet de Table (10×15 cm)", icon: FileText },
              { id: "sticker", label: "Sticker Autocollant (8×8 cm)", icon: Layers },
              { id: "poster", label: "Affiche Comptoir (A4)", icon: FileText },
              { id: "batch", label: "Planche Multi-Tables (1-12)", icon: Sparkles },
            ].map((fmt, idx) => (
              <button
                key={`fmt-${fmt.id}-${idx}`}
                type="button"
                onClick={() => setActiveFormat(fmt.id as QrPrintFormat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeFormat === fmt.id
                    ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                <span>{fmt.label}</span>
              </button>
            ))}
          </div>

          {onTestOrder && (
            <button
              onClick={() => onTestOrder(activeTable)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Tester le rendu client de la commande"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tester la Commande Client ↗</span>
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Configuration Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Mode de commande */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
                <span>1. Mode de Commande Associé au QR Code</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "dine_in", label: "Sur Place", sub: "À Table", emoji: "🍽️" },
                  { id: "takeaway", label: "À Emporter", sub: "Comptoir", emoji: "🥡" },
                  { id: "delivery", label: "Livraison", sub: "À Domicile", emoji: "🛵" },
                ].map((m, idx) => (
                  <button
                    key={`mode-${m.id}-${idx}`}
                    type="button"
                    onClick={() => setOrderMode(m.id as any)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      orderMode === m.id
                        ? "bg-orange-500/20 border-orange-500 text-white font-black shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-base block mb-0.5">{m.emoji}</span>
                    <span className="text-xs block font-bold text-white">{m.label}</span>
                    <span className="text-[10px] text-slate-400 block">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Numéro de Table (Si Sur Place) */}
            {orderMode === "dine_in" && activeFormat !== "batch" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                    2. Numéro ou Zone de Table
                  </label>
                  <span className="text-[11px] font-mono font-bold text-orange-400">
                    Actif : {activeTable || "Non spécifié"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {quickTables.map((t, idx) => (
                    <button
                      key={`tbl-${t}-${idx}`}
                      type="button"
                      onClick={() => {
                        setTableNumber(t);
                        setIsCustomTable(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        !isCustomTable && tableNumber === t
                          ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustomTable(true)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isCustomTable
                        ? "bg-orange-500 text-slate-950 font-black"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Autre...
                  </button>
                </div>

                {isCustomTable && (
                  <input
                    type="text"
                    value={customTableInput}
                    onChange={(e) => setCustomTableInput(e.target.value)}
                    placeholder="Ex: Table 14, Salon VIP, Paillote 3..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                )}
              </div>
            )}

            {/* Batch count if Batch format */}
            {activeFormat === "batch" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
                  Nombre de Tables à Générer en Lot
                </label>
                <div className="flex items-center gap-2">
                  {[4, 6, 8, 10, 12].map((cnt, idx) => (
                    <button
                      key={`batch-cnt-${cnt}-${idx}`}
                      type="button"
                      onClick={() => setBatchCount(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        batchCount === cnt
                          ? "bg-orange-500 text-slate-950 border-orange-400 font-black"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {cnt} Tables
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Génère automatiquement les QR codes uniques pour les Tables 1 à {batchCount} sur une seule planche d&apos;impression.
                </p>
              </div>
            )}

            {/* 3. Informations Pratiques (WiFi & Message) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Wi-Fi Client &amp; Message d&apos;Accueil</span>
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWifi}
                    onChange={(e) => setIncludeWifi(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Afficher Wi-Fi</span>
                </label>
              </div>

              {includeWifi && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Nom du réseau (SSID) :</span>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Mot de passe :</span>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Message d&apos;accueil affiché :</span>
                <input
                  type="text"
                  value={customWelcome}
                  onChange={(e) => setCustomWelcome(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* 4. Personnalisation Visuelle */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>4. Couleur du QR Code</span>
              </label>

              <div className="flex items-center gap-2">
                {[
                  { name: "Noir Classique", color: "#0f172a" },
                  { name: "Orange Allôresto", color: "#ea580c" },
                  { name: "Émeraude Sahel", color: "#059669" },
                  { name: "Indigo Nuit", color: "#4338ca" },
                ].map((c, idx) => (
                  <button
                    key={`color-${c.color}-${idx}`}
                    type="button"
                    onClick={() => setQrColor(c.color)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      qrColor === c.color
                        ? "bg-slate-800 border-white text-white font-black shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target URL Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lien Direct Généré :
              </span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all select-all flex items-center justify-between gap-2">
                <span className="truncate">{targetOrderUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold shrink-0 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? "Copié" : "Copier"}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700 shadow-sm"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Télécharger PNG HD</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-orange-500/20"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Chevalet</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Live Print Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-start bg-slate-950/60 p-4 sm:p-6 rounded-3xl border border-slate-800 overflow-y-auto">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-400" />
                <span>Aperçu Réel Avant Impression :</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Conforme Papier / Tablette
              </span>
            </div>

            {/* ========================================================================= */}
            {/* FORMAT 1: TABLE TENT / CHEVALET (10 x 15 cm)                              */}
            {/* ========================================================================= */}
            {activeFormat === "tent" && (
              <div
                id="printable-qr-export"
                className="w-full max-w-sm rounded-3xl bg-white text-slate-950 p-6 sm:p-8 shadow-2xl border-4 border-orange-500/30 flex flex-col items-center text-center space-y-4 my-auto relative overflow-hidden"
              >
                {/* Decorative Sahel Border Notch */}
                <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mb-1" />

                {/* Restaurant Brand Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Store className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-orange-600">
                      Allôresto Niamey &bull; Table Directe
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                    {restaurant.name}
                  </h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {restaurant.quartier ? `${restaurant.quartier}, Niamey 🇳🇪` : "Niamey 🇳🇪"}
                  </p>
                </div>

                {/* Big Table Number Badge */}
                {activeTable && (
                  <div className="px-5 py-2 rounded-2xl bg-slate-950 text-white font-black text-sm tracking-wider uppercase shadow-md flex items-center gap-2 border border-slate-800">
                    <span>🍽️</span>
                    <span>{activeTable}</span>
                  </div>
                )}

                {/* High Contrast QR Code */}
                <div className="p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-md inline-block relative group">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code Menu ${restaurant.name}`}
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-100 rounded-xl">
                      <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
                    </div>
                  )}
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Scannez &bull; Commandez &bull; Dégustez
                  </div>
                </div>

                {/* 3 Steps Guide */}
                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left space-y-1.5">
                  <div className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>Ouvrez l&apos;appareil photo de votre smartphone</span>
                  </div>
                  <div className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>Choisissez vos plats sans attendre le serveur</span>
                  </div>
                  <div className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span>Réglez à table en Espèces ou Mobile Money</span>
                  </div>
                </div>

                {/* Optional WiFi Banner */}
                {includeWifi && (
                  <div className="w-full flex items-center justify-between text-[11px] bg-cyan-50 border border-cyan-200 text-cyan-900 rounded-xl px-3 py-2 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-cyan-700" />
                      <span className="font-bold">{wifiSsid}</span>
                    </div>
                    <div>
                      <span>Pass: </span>
                      <strong className="text-cyan-950 font-black">{wifiPassword}</strong>
                    </div>
                  </div>
                )}

                {/* Footer Payment & Guarantee */}
                <div className="pt-2 border-t border-slate-200 w-full flex items-center justify-between text-[10px] text-slate-500 font-bold">
                  <span>Paiements : Espèces • Airtel • Moov • Al Izza</span>
                  <span className="text-orange-600 font-black">Allôresto.ne</span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* FORMAT 2: STICKER AUTOCCOLLANT (8 x 8 cm)                                 */}
            {/* ========================================================================= */}
            {activeFormat === "sticker" && (
              <div
                id="printable-qr-export"
                className="w-72 h-72 rounded-3xl bg-white text-slate-950 p-4 shadow-2xl border-4 border-slate-900 flex flex-col items-center justify-between text-center my-auto relative"
              >
                <div className="w-full flex items-center justify-between text-[10px] font-black uppercase text-orange-600 border-b border-slate-200 pb-1">
                  <span>{restaurant.name}</span>
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[9px]">
                    {activeTable || "Menu"}
                  </span>
                </div>

                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR Code Sticker" className="w-36 h-36 object-contain my-auto" />
                )}

                <div className="w-full bg-orange-500 text-slate-950 font-black text-[10px] py-1.5 rounded-xl uppercase tracking-wider">
                  📱 Scannez pour commander à table
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* FORMAT 3: AFFICHE A4 COMPTOIR                                            */}
            {/* ========================================================================= */}
            {activeFormat === "poster" && (
              <div
                id="printable-qr-export"
                className="w-full max-w-md rounded-3xl bg-white text-slate-950 p-8 shadow-2xl border border-slate-300 flex flex-col items-center text-center space-y-5 my-auto"
              >
                <div className="w-12 h-1.5 rounded-full bg-orange-500" />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-orange-600 block mb-1">
                    Menu Digital &amp; Commande Directe
                  </span>
                  <h1 className="text-2xl font-black text-slate-950">{restaurant.name}</h1>
                  <p className="text-xs text-slate-600 mt-1">{customWelcome}</p>
                </div>

                <div className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-inner">
                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="QR Poster" className="w-64 h-64 object-contain" />
                  )}
                </div>

                {includeWifi && (
                  <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-mono font-bold w-full flex items-center justify-around">
                    <span>📶 WiFi : {wifiSsid}</span>
                    <span>🔑 Clé : {wifiPassword}</span>
                  </div>
                )}

                <div className="text-xs text-slate-500 font-medium">
                  Service ultra-rapide Allôresto &bull; Pas besoin de télécharger d&apos;application &bull; Fonctionne directement avec votre caméra
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* FORMAT 4: PLANCHE MULTI-TABLES (Batch Export)                             */}
            {/* ========================================================================= */}
            {activeFormat === "batch" && (
              <div
                id="printable-qr-export"
                className="w-full rounded-2xl bg-white text-slate-950 p-6 shadow-xl border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-950 uppercase">
                      Planche Multi-Tables : {restaurant.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Découpez chaque bloc pour l&apos;installer directement sur les tables 1 à {batchCount}.
                    </p>
                  </div>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    {batchCount} Chevalets
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: batchCount }, (_, i) => {
                    const t = `Table ${i + 1}`;
                    const url = batchQrUrls[t];
                    return (
                      <div
                        key={`batch-item-${t}-${i}`}
                        className="p-3 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center text-center space-y-1.5 bg-slate-50"
                      >
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-white font-black text-[11px] uppercase">
                          {t}
                        </span>
                        {url ? (
                          <img src={url} alt={t} className="w-24 h-24 object-contain bg-white p-1 rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-24 h-24 bg-slate-200 rounded-lg animate-pulse" />
                        )}
                        <span className="text-[9px] font-black text-orange-600 uppercase truncate max-w-full">
                          {restaurant.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
