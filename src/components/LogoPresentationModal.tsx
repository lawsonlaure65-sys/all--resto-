import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Check,
  Copy,
  Download,
  Eye,
  Layers,
  Phone,
  Utensils,
  Zap,
  Sun,
  Moon,
  Smartphone,
  ShieldCheck,
  Palette,
  Compass,
  Monitor,
  CheckCircle2,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface LogoPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoPresentationModal: React.FC<LogoPresentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"concept" | "screens" | "palette" | "specs">("concept");
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "teal" | "orange">("dark");

  if (!isOpen) return null;

  const svgFullCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="512" height="512">
  <defs>
    <linearGradient id="alloTealGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#145F78"/>
      <stop offset="50%" stop-color="#0F4C64"/>
      <stop offset="100%" stop-color="#0A3748"/>
    </linearGradient>
    <linearGradient id="alloOrangeGrad" x1="60" y1="10" x2="100" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF7E26"/>
      <stop offset="100%" stop-color="#F15A1A"/>
    </linearGradient>
  </defs>
  <!-- 3 Digital / Delivery Pixels (Orange Sahel) -->
  <rect x="79" y="15" width="16" height="16" rx="3.5" fill="url(#alloOrangeGrad)"/>
  <rect x="67" y="24" width="15" height="15" rx="3.5" fill="url(#alloOrangeGrad)"/>
  <rect x="81" y="31" width="17" height="17" rx="3.5" fill="url(#alloOrangeGrad)"/>

  <!-- Main Allôresto Pin & Speech Bubble (Teal) -->
  <path d="M 50 20 C 32 20 20 34 20 54 C 20 66 26 76 33 82 L 33 97 L 46 87 C 48 87 50 87 52 87 C 69 87 83 73 83 55 C 83 48 80 42 76 37 L 64 37 L 64 20 Z" fill="url(#alloTealGrad)"/>

  <!-- Negative Space 3-Prong Fork (Pure White) -->
  <rect x="37" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF"/>
  <rect x="47.5" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF"/>
  <rect x="58" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF"/>
  <path d="M 37 46 C 37 62 65 62 65 46 Z" fill="#FFFFFF"/>
  <path d="M 47.5 56 L 54.5 56 L 54.5 90 L 47.5 90 Z" fill="#FFFFFF"/>
</svg>`;

  const handleCopySvg = () => {
    navigator.clipboard.writeText(svgFullCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([svgFullCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alloresto-logo-officiel.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Title and Close button */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F4C64] to-[#F36C21] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BrandLogo variant="icon" size="sm" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  Identité Visuelle &amp; Favicon Allôresto
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Logo Officiel
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Évolution de la marque, remplacement de &quot;DigitRestau&quot; par &quot;Allôresto&quot; et intégration favicon pour tous les écrans
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-3 border-b border-slate-800 overflow-x-auto scrollbar-none bg-slate-950/40">
          <button
            onClick={() => setActiveTab("concept")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "concept"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Concept &amp; Symbologie</span>
          </button>

          <button
            onClick={() => setActiveTab("screens")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "screens"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>2. Affichage Favicon &amp; Écrans</span>
          </button>

          <button
            onClick={() => setActiveTab("palette")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "palette"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3. Palette de Couleurs</span>
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "specs"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4. Export Vectoriel &amp; Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CONCEPT & SYMBOLOGIE */}
          {activeTab === "concept" && (
            <div className="space-y-6">
              {/* Main Interactive Stage */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    Refonte Réussie &bull; Allôresto Niger
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Le Symbole Intelligent Allôresto
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                    Remplacement complet de <em>&quot;DigitRestau&quot;</em> par l&apos;identité <strong>Allôresto</strong>, combinant le dialogue (&quot;Allô&quot;), la gastronomie (&quot;resto&quot;) et les pixels de livraison express.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={handleCopySvg}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "SVG Copié !" : "Copier le code SVG"}</span>
                    </button>

                    <button
                      onClick={handleDownloadSvg}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger (.svg)</span>
                    </button>
                  </div>
                </div>

                {/* Live Reworked Logo Display with Background Toggles */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`w-44 h-44 sm:w-52 sm:h-52 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl transition-colors duration-300 border ${
                      previewBg === "dark"
                        ? "bg-slate-950 border-slate-800"
                        : previewBg === "light"
                        ? "bg-white border-slate-200"
                        : previewBg === "teal"
                        ? "bg-[#0F4C64] border-cyan-400/30"
                        : "bg-[#F36C21] border-orange-400/30"
                    }`}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24">
                      <BrandLogo variant="icon" size="xl" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-lg font-black tracking-tight flex items-center justify-center">
                        <span
                          className={
                            previewBg === "light"
                              ? "text-[#0F4C64]"
                              : previewBg === "teal" || previewBg === "orange"
                              ? "text-white"
                              : "text-white"
                          }
                        >
                          Allô
                        </span>
                        <span
                          className={
                            previewBg === "orange"
                              ? "text-slate-950 font-black ml-0.5"
                              : "text-[#F36C21] font-black ml-0.5"
                          }
                        >
                          resto
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider block ${
                          previewBg === "light" ? "text-slate-500" : "text-slate-300"
                        }`}
                      >
                        Niamey &bull; Niger
                      </span>
                    </div>
                  </div>

                  {/* Bg switchers */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold">
                    <button
                      onClick={() => setPreviewBg("dark")}
                      className={`px-2 py-1 rounded-lg transition ${
                        previewBg === "dark" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Sombre
                    </button>
                    <button
                      onClick={() => setPreviewBg("light")}
                      className={`px-2 py-1 rounded-lg transition ${
                        previewBg === "light" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Clair
                    </button>
                    <button
                      onClick={() => setPreviewBg("teal")}
                      className={`px-2 py-1 rounded-lg transition ${
                        previewBg === "teal" ? "bg-[#0F4C64] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Teal
                    </button>
                    <button
                      onClick={() => setPreviewBg("orange")}
                      className={`px-2 py-1 rounded-lg transition ${
                        previewBg === "orange" ? "bg-[#F36C21] text-slate-950 font-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Orange
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown of the 4 Key Visual Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0F4C64]/30 text-cyan-400 flex items-center justify-center text-xs font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">1. La Bulle / Pin &quot;Allô&quot;</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Représente la communication directe, la commande par téléphone ou WhatsApp, et la géolocalisation précise des restaurants et clients à Niamey.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">2. La Fourchette en Espace Négatif</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Découpée en blanc pur au centre de la bulle, elle symbolise les saveurs culinaires, la restauration de qualité et la gourmandise du terroir sahélien.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F36C21]/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">3. Les 3 Cubes Pixels &quot;Sahel Orange&quot;</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trois carrés dynamiques en ascension : la technologie digitale, la vitesse de livraison Billo Express et l&apos;union Clients + Restaurants + Livreurs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white">4. Typographie &quot;Allôresto&quot;</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Remplacement officiel de <strong>DigitRestau</strong> par <strong>Allôresto</strong> avec &quot;Allô&quot; en bleu profond et &quot;resto&quot; en orange chaud safrané.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AFFICHAGE FAVICON & ÉCRANS */}
          {activeTab === "screens" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-950 border border-cyan-500/20 space-y-1">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>Favicon &amp; Intégration sur tous les écrans</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Le logo est désormais configuré comme favicon officiel (SVG vectoriel haute fidélité) dans <code className="text-orange-400 font-mono">/favicon.svg</code>, <code className="text-orange-400 font-mono">/manifest.json</code> et les balises <code className="text-orange-400 font-mono">&lt;link rel=&quot;icon&quot;&gt;</code>.
                </p>
              </div>

              {/* Simulation de l'onglet navigateur */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Aperçu dans l&apos;onglet du navigateur (Favicon 16x16 / 32x32)
                </span>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 max-w-sm">
                    {/* Favicon icon */}
                    <div className="w-4 h-4 shrink-0">
                      <BrandLogo variant="icon" size="sm" />
                    </div>
                    <span className="text-xs font-bold text-white truncate">
                      Allôresto Niger — Livraison de Repas à Niamey
                    </span>
                    <X className="w-3 h-3 text-slate-500 shrink-0 ml-auto" />
                  </div>
                </div>
              </div>

              {/* Simulation Écran Smartphone & PWA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-orange-400" />
                      <span>Icône d&apos;Écran d&apos;Accueil Mobile (PWA)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Installable
                    </span>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    {/* App icon */}
                    <div className="w-16 h-16 rounded-2xl bg-[#0F4C64] p-2 flex items-center justify-center shadow-xl border border-cyan-400/20 shrink-0">
                      <BrandLogo variant="icon" size="lg" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">Allôresto</h5>
                      <p className="text-xs text-slate-400">Niamey Delivery</p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                        <span>★★★★★</span>
                        <span className="text-slate-400">(4.9/5)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Compatibilité Écrans &amp; Rétina</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      Vectoriel SVG
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>Écrans Rétina &amp; 4K</span>
                      <strong className="text-emerald-400">100% Net (Scalable)</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>Navigateurs (Chrome, Safari, Firefox)</span>
                      <strong className="text-emerald-400">Support SVG &amp; PNG</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>PWA Android &amp; iOS</span>
                      <strong className="text-emerald-400">Automatique</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PALETTE DE COULEURS */}
          {activeTab === "palette" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Color 1: Bleu Canard / Teal */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-20 rounded-xl bg-[#0F4C64] flex items-center justify-center text-white font-black text-xs shadow-inner">
                    #0F4C64
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Bleu Canard Profond</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Confiance, professionnalisme, dialogue (&quot;Allô&quot;), contraste optimal.
                    </p>
                  </div>
                </div>

                {/* Color 2: Orange Sahel */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-20 rounded-xl bg-[#F36C21] flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                    #F36C21
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Orange Sahel &amp; Safran</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Énergie, appétit, rapidité des livreurs Billo Express et chaleur du Niger.
                    </p>
                  </div>
                </div>

                {/* Color 3: Blanc Pur */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-20 rounded-xl bg-white flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                    #FFFFFF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Blanc Pur (Espace Négatif)</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Clarté, hygiène alimentaire, pureté et lisibilité instantanée à toute taille.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS & CODE */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Code Source SVG Officiel Allôresto
                </span>
                <button
                  onClick={handleCopySvg}
                  className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copié !" : "Copier le code SVG"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-60">
                {svgFullCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Charte graphique officielle &bull; Allôresto Niger (Niamey)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
