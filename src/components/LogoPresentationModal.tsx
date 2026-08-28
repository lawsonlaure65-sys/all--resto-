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
  Bike,
  ShieldAlert,
  Smile,
  Flame,
  Award,
  Radio,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { BilloExpressLogo } from "./BilloExpressLogo";

interface LogoPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoPresentationModal: React.FC<LogoPresentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"concept" | "billo" | "screens" | "palette" | "specs">("concept");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBilloSvg, setCopiedBilloSvg] = useState(false);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "teal" | "orange">("dark");

  if (!isOpen) return null;

  const svgFullCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="512" height="512">
  <defs>
    <linearGradient id="alloChefOrange" x1="18" y1="24" x2="110" y2="108" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFA133"/>
      <stop offset="35%" stop-color="#FF6B00"/>
      <stop offset="100%" stop-color="#E63E00"/>
    </linearGradient>
    <linearGradient id="alloTealPhone" x1="30" y1="10" x2="98" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="50%" stop-color="#0F766E"/>
      <stop offset="100%" stop-color="#0A3F3B"/>
    </linearGradient>
    <linearGradient id="alloSilverPlate" x1="20" y1="94" x2="108" y2="106" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
  </defs>

  <!-- Ondes Sonores & Vapeur d'Appétit "Allô" -->
  <g stroke="#FFB74D" stroke-width="2.8" stroke-linecap="round" opacity="0.95">
    <path d="M 44 18 C 50 12 56 10 64 10 C 72 10 78 12 84 18"/>
    <path d="M 52 23 C 56 20 60 19 64 19 C 68 19 72 20 76 23"/>
  </g>
  <!-- Étoile Saveur -->
  <path d="M 98 19 L 100 24 L 105 26 L 100 28 L 98 33 L 96 28 L 91 26 L 96 24 Z" fill="#FBBF24"/>

  <!-- Arceau Casque / Poignée Toque -->
  <path d="M 46 36 C 46 25 82 25 82 36" stroke="url(#alloTealPhone)" stroke-width="6.5" stroke-linecap="round"/>
  <circle cx="64" cy="27" r="6" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
  <rect x="80" y="32" width="7" height="12" rx="3.5" fill="#0F766E"/>
  <path d="M 85 41 C 88 44 87 49 82 52" stroke="#2DD4BF" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="80" cy="52.5" r="2" fill="#2DD4BF"/>

  <!-- Cloche Gourmande -->
  <path d="M 64 34 C 42 34 26 52 22 78 C 21 84 25 88 32 88 L 96 88 C 103 88 107 84 106 78 C 102 52 86 34 64 34 Z" fill="url(#alloChefOrange)"/>
  <path d="M 64 39 C 50 39 37 49 32 64 C 30 68 33 70 36 68 C 40 56 50 46 64 45 C 67 45 68 41 66 39.5 C 65.5 39.2 64.8 39 64 39 Z" fill="#FFFFFF" opacity="0.45"/>

  <!-- Visage Complice & Sourire -->
  <path d="M 42 63 C 45 58 52 58 55 63" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  <ellipse cx="74" cy="61" rx="4.8" ry="6" fill="#1E293B"/>
  <circle cx="72.5" cy="59" r="2" fill="#FFFFFF"/>
  <circle cx="76" cy="63" r="1" fill="#FFFFFF"/>
  <circle cx="37" cy="69" r="3.5" fill="#EF4444" opacity="0.35"/>
  <circle cx="81" cy="69" r="3.5" fill="#EF4444" opacity="0.35"/>
  <path d="M 48 69 C 48 78 70 78 70 69 Z" fill="#1E293B"/>
  <path d="M 55 74 C 55 77 63 77 63 74 Z" fill="#F43F5E"/>

  <!-- Plateau & Propulsion -->
  <path d="M 18 88 C 18 86 22 84 28 84 L 100 84 C 106 84 110 86 110 88 L 108 92 C 108 95 104 97 98 97 L 30 97 C 24 97 20 95 20 92 Z" fill="url(#alloSilverPlate)" stroke="#94A3B8" stroke-width="1"/>
  <rect x="14" y="96" width="100" height="5" rx="2.5" fill="#475569"/>
  <g stroke="#FF6B00" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
    <line x1="8" y1="76" x2="16" y2="76"/>
    <line x1="4" y1="84" x2="13" y2="84"/>
    <line x1="7" y1="92" x2="14" y2="92"/>
  </g>
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
    a.download = "alloresto-nouveau-logo.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const billoSvgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3048" />
      <stop offset="100%" stop-color="#0F1C2E" />
    </linearGradient>
    <linearGradient id="expressOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A2B" />
      <stop offset="100%" stop-color="#EB5915" />
    </linearGradient>
  </defs>
  <g transform="translate(50, 20)">
    <path d="M 440 210 C 460 270 445 340 395 385 C 335 440 240 455 170 420 C 140 405 125 385 135 365 C 145 345 170 355 195 370 C 245 395 320 385 365 345 C 400 310 415 260 395 210 C 385 185 410 160 425 175 C 435 185 438 198 440 210 Z" fill="url(#expressOrange)"/>
    <rect x="345" y="145" width="22" height="40" rx="2" fill="url(#navyGrad)"/>
    <path d="M 300 120 L 415 210 L 395 210 L 300 138 L 205 210 L 185 210 Z" fill="url(#navyGrad)"/>
    <g transform="translate(288, 175)" fill="url(#navyGrad)">
      <rect x="0" y="0" width="10" height="10" rx="1.5"/>
      <rect x="14" y="0" width="10" height="10" rx="1.5"/>
      <rect x="0" y="14" width="10" height="10" rx="1.5"/>
      <rect x="14" y="14" width="10" height="10" rx="1.5"/>
    </g>
    <g stroke="url(#navyGrad)" stroke-linecap="round">
      <line x1="60" y1="318" x2="200" y2="318" stroke-width="6"/>
      <line x1="100" y1="300" x2="190" y2="300" stroke-width="6"/>
      <line x1="75" y1="336" x2="175" y2="336" stroke-width="5"/>
    </g>
    <circle cx="215" cy="335" r="35" stroke="url(#navyGrad)" stroke-width="14" fill="none"/>
    <circle cx="395" cy="335" r="35" stroke="url(#navyGrad)" stroke-width="14" fill="none"/>
    <path d="M 195 305 L 255 305 C 275 270 305 260 345 260 L 365 240 L 380 265 C 385 270 395 295 375 325 L 330 330 L 275 330 C 255 315 220 315 195 305 Z" fill="url(#navyGrad)"/>
    <path d="M 372 250 C 385 250 395 260 390 275 L 375 275 Z" fill="url(#navyGrad)"/>
    <g transform="translate(225, 230)">
      <rect x="0" y="0" width="48" height="48" rx="7" fill="url(#expressOrange)"/>
      <path d="M 24 10 L 36 15 L 36 28 C 36 36 24 40 24 40 C 24 40 12 36 12 28 L 12 15 Z" fill="#FFFFFF"/>
    </g>
  </g>
  <g transform="translate(300, 480)" text-anchor="middle">
    <text font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="58" letter-spacing="-1">
      <tspan fill="#102A43">Bilo </tspan>
      <tspan fill="#EB5915">Express</tspan>
    </text>
    <text y="44" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="24" fill="#334E68" letter-spacing="1.2">
      Livraison à Domicile Rapide
    </text>
  </g>
</svg>`;

  const handleCopyBilloSvg = () => {
    navigator.clipboard.writeText(billoSvgCode);
    setCopiedBilloSvg(true);
    setTimeout(() => setCopiedBilloSvg(false), 2000);
  };

  const handleDownloadBilloSvg = () => {
    const blob = new Blob([billoSvgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billo-express-logo-officiel.svg";
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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-teal-600 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <BrandLogo variant="icon" size="sm" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  Nouvelle Identité Visuelle Allôresto
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Nouveau Logo 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Design moderne, ludique, intelligent et percutant : La Cloche Gourmande Connectée &amp; Souriante
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
            <span>Nouveau Logo Allôresto</span>
          </button>

          <button
            onClick={() => setActiveTab("billo")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "billo"
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-orange-400" />
            <span className="flex items-center gap-1.5">
              <span>Partenaire Bilo Express</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                Corrigé
              </span>
            </span>
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
            <span>Favicon &amp; Rendu 3D</span>
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
            <span>Harmonie des Couleurs</span>
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
            <span>Code Source SVG</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: NOUVEAU LOGO ALLÔRESTO (CONCEPT & SYMBOLOGIE) */}
          {activeTab === "concept" && (
            <div className="space-y-6">
              {/* Main Interactive Stage */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nouvelle Création Visuelle</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      Approuvé Food-Tech
                    </span>
                  </div>

                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    La Cloche Gourmande Connectée
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                    Un logo qui fusionne <strong>gastronomie</strong> (cloche de chef), <strong>technologie &amp; dialogue</strong> (arceau d&apos;écouteur &quot;Allô&quot; et ondes aromatiques), <strong>convivialité</strong> (clin d&apos;œil malicieux &amp; sourire gourmand) et <strong>vitesse de livraison</strong> (lignes de propulsion express).
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={handleCopySvg}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "SVG Copié !" : "Copier le nouveau SVG"}</span>
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
                    className={`w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl transition-colors duration-300 border ${
                      previewBg === "dark"
                        ? "bg-slate-950 border-slate-800"
                        : previewBg === "light"
                        ? "bg-white border-slate-200"
                        : previewBg === "teal"
                        ? "bg-[#0A3F3B] border-teal-500/30"
                        : "bg-[#E63E00] border-orange-400/30"
                    }`}
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28">
                      <BrandLogo variant="icon" size="xl" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-xl font-black tracking-tight flex items-center justify-center">
                        <span
                          className={
                            previewBg === "light"
                              ? "text-slate-950 font-black"
                              : "text-white font-black"
                          }
                        >
                          Allô
                        </span>
                        <span className="text-orange-500 font-black ml-0.5">
                          resto
                        </span>
                        <span className="text-amber-400 font-black ml-0.5">!</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider block ${
                          previewBg === "light" ? "text-slate-500" : "text-slate-300"
                        }`}
                      >
                        Vos envies, bien servies !
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
                        previewBg === "teal" ? "bg-teal-700 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Teal
                    </button>
                    <button
                      onClick={() => setPreviewBg("orange")}
                      className={`px-2 py-1 rounded-lg transition ${
                        previewBg === "orange" ? "bg-orange-600 text-white font-black" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Orange
                    </button>
                  </div>
                </div>
              </div>

              {/* The 4 Core Pillars of this Redesign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Amusant & Attachant */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Smile className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">1. Amusant &amp; Convivial</h5>
                      <span className="text-[10px] text-amber-400 font-bold">Clin d&apos;œil &amp; Pommettes</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Un visage expressif intégré au dôme de la cloche qui donne immédiatement le sourire, humanise le service et crée un lien émotionnel fort avec les gourmets de Niamey.
                  </p>
                </div>

                {/* 2. Intelligent & Double Lecture */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">2. Intelligent &amp; Innovant</h5>
                      <span className="text-[10px] text-teal-400 font-bold">Casque Allô + Ondes Wi-Fi</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    La poignée supérieure forme un arceau d&apos;appel &quot;Allô&quot; avec micro intégré diffusant des ondes aromatiques et technologiques pour symboliser la commande en 1 clic.
                  </p>
                </div>

                {/* 3. Professionnel & Gastronomique */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">3. Professionnel &amp; Gastronomique</h5>
                      <span className="text-[10px] text-orange-400 font-bold">Cloche &amp; Plateau Argenté</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Les codes du service de luxe (cloche sous plateau métallique) assurent la crédibilité auprès des restaurateurs partenaires et garantissent la fraîcheur des plats livrés.
                  </p>
                </div>

                {/* 4. Percutant & Mémorable */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">4. Percutant &amp; Ultra-Rapide</h5>
                      <span className="text-[10px] text-red-400 font-bold">Lignes de Vitesse &amp; Étoile</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Des traits de propulsion latéraux et une étincelle dorée soulignent l&apos;efficacité record des livreurs Billo Express à travers tous les quartiers de Niamey.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: LOGO PARTENAIRE BILO EXPRESS */}
          {activeTab === "billo" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correction Orthographique Validée</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      &quot;Livrason&quot; &rarr; <strong>&quot;Livraison&quot;</strong>
                    </span>
                  </div>

                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Logo Officiel Partenaire Bilo Express
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                    Le sous-titre a été corrigé avec l&apos;orthographe exacte en français :{" "}
                    <strong className="text-orange-400">&quot;Livraison à Domicile Rapide&quot;</strong> (avec le <span className="underline font-bold text-white">i</span>). Le logo vectoriel haute fidélité intègre la toiture de maison avec fenêtre, le coursier express en moto avec lignes de vitesse, le colis orange sécurisé avec bouclier et l&apos;anneau dynamique.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={handleCopyBilloSvg}
                      className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      {copiedBilloSvg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBilloSvg ? "SVG Bilo Copié !" : "Copier le SVG Bilo Express"}</span>
                    </button>

                    <button
                      onClick={handleDownloadBilloSvg}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger (.svg)</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-52 h-52 rounded-3xl p-5 flex flex-col items-center justify-center shadow-2xl bg-slate-950 border border-slate-800">
                    <BilloExpressLogo
                      variant="full"
                      size="xl"
                      theme="dark"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AFFICHAGE FAVICON & RENDU 3D */}
          {activeTab === "screens" && (
            <div className="space-y-6">
              {/* Rendu 3D & Mockup */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                  <img
                    src="/src/assets/images/alloresto_brand_logo_1787950661282.jpg"
                    alt="Rendu 3D Allôresto"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Aperçu 3D Studio de Marque</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    Déclinaisons Multi-Supports
                  </span>
                  <h4 className="text-xl font-black text-white">
                    Parfaite lisibilité du 16px au format 4K
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Le nouveau logo vectoriel SVG a été conçu avec des proportions optiques calibrées : les yeux, le sourire et le casque restent parfaitement identifiables même à l&apos;échelle minuscule d&apos;un favicon d&apos;onglet navigateur (16x16 px).
                  </p>

                  {/* Navigation Tab Simulation */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Aperçu Favicon Onglet Navigateur (16x16)
                    </span>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="w-4 h-4">
                        <BrandLogo variant="icon" size="sm" />
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        Allôresto Niger — Vos envies, bien servies !
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PALETTE DE COULEURS */}
          {activeTab === "palette" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Color 1: Orange Solaire */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-16 rounded-xl bg-gradient-to-r from-[#FFA133] to-[#FF6B00] flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                    #FF6B00
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Orange Sahel Solaire</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Gourmandise, chaleur humaine, appétit et énergie festive.
                    </p>
                  </div>
                </div>

                {/* Color 2: Jaune Safran */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-16 rounded-xl bg-[#FBBF24] flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                    #FBBF24
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Jaune Étoile Safran</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Éclat, excellence des chefs et saveurs authentiques.
                    </p>
                  </div>
                </div>

                {/* Color 3: Teal Connecté */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-16 rounded-xl bg-[#0F766E] flex items-center justify-center text-white font-black text-xs shadow-inner">
                    #0F766E
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Teal Phone &amp; Connectivité</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Technologie, fluidité du dialogue &quot;Allô&quot; et sécurité.
                    </p>
                  </div>
                </div>

                {/* Color 4: Métal Argenté */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="w-full h-16 rounded-xl bg-[#CBD5E1] flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                    #CBD5E1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Argent Plateau Chef</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hygiène irréprochable, service soigné et distinction.
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
          >
            Appliquer &amp; Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

