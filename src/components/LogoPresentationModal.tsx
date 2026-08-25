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
  const [activeTab, setActiveTab] = useState<"concept" | "mockup" | "palette" | "specs">("concept");
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "orange">("dark");

  if (!isOpen) return null;

  const handleCopySvg = () => {
    const svgString = `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="allorestoGradient" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF7A00"/>
      <stop offset="50%" stop-color="#FF5500"/>
      <stop offset="100%" stop-color="#E02E1B"/>
    </linearGradient>
    <linearGradient id="goldAccent" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="100%" stop-color="#FFAE00"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="108" height="108" rx="32" fill="url(#allorestoGradient)"/>
  <circle cx="60" cy="27" r="5" fill="#FFFFFF"/>
  <path d="M60 32 V 37" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M26 62 C26 43 41 37 60 37 C79 37 94 43 94 62" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M48 24 C52 20 54 20 58 24" stroke="url(#goldAccent)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M62 24 C66 20 68 20 72 24" stroke="url(#goldAccent)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M20 68 C20 68 32 88 60 88 C88 88 100 68 100 68" stroke="url(#goldAccent)" stroke-width="6" stroke-linecap="round"/>
  <path d="M16 68 H104" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="88" cy="42" r="3.5" fill="#FFE066"/>
</svg>`;

    navigator.clipboard.writeText(svgString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="512" height="512">
  <defs>
    <linearGradient id="allorestoGradient" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FF7A00"/>
      <stop offset="50%" stop-color="#FF5500"/>
      <stop offset="100%" stop-color="#E02E1B"/>
    </linearGradient>
    <linearGradient id="goldAccent" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="100%" stop-color="#FFAE00"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="108" height="108" rx="32" fill="url(#allorestoGradient)"/>
  <circle cx="60" cy="27" r="5" fill="#FFFFFF"/>
  <path d="M60 32 V 37" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M26 62 C26 43 41 37 60 37 C79 37 94 43 94 62" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <path d="M48 24 C52 20 54 20 58 24" stroke="url(#goldAccent)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M62 24 C66 20 68 20 72 24" stroke="url(#goldAccent)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M20 68 C20 68 32 88 60 88 C88 88 100 68 100 68" stroke="url(#goldAccent)" stroke-width="6" stroke-linecap="round"/>
  <path d="M16 68 H104" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="88" cy="42" r="3.5" fill="#FFE066"/>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alloresto-logo-intelligent.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black/25 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Identité Visuelle &amp; Logo Intelligent</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                  Allôresto Niger
                </span>
              </div>
              <p className="text-xs text-orange-100 opacity-90">
                La fusion subtile de l'appel instantané (« Allô ») et de la haute gastronomie (« Resto »)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("concept")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "concept"
                ? "bg-orange-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Concept &amp; Symbolisme</span>
          </button>
          <button
            onClick={() => setActiveTab("mockup")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "mockup"
                ? "bg-orange-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Rendu 3D &amp; Mockup</span>
          </button>
          <button
            onClick={() => setActiveTab("palette")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "palette"
                ? "bg-orange-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Palette &amp; Couleurs</span>
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "specs"
                ? "bg-orange-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Export &amp; Code SVG</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: CONCEPT & SYMBOLISM */}
          {activeTab === "concept" && (
            <div className="space-y-6">
              {/* Interactive Preview Canvas */}
              <div
                className={`p-8 rounded-3xl border transition-colors flex flex-col items-center justify-center relative overflow-hidden ${
                  previewBg === "dark"
                    ? "bg-slate-950 border-slate-800"
                    : previewBg === "light"
                    ? "bg-slate-100 border-slate-300"
                    : "bg-gradient-to-br from-orange-600 to-amber-700 border-orange-500"
                }`}
              >
                {/* Background Selector */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setPreviewBg("dark")}
                    className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                      previewBg === "dark" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                    }`}
                    title="Fond Sombre"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewBg("light")}
                    className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                      previewBg === "light" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                    }`}
                    title="Fond Clair"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewBg("orange")}
                    className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                      previewBg === "orange" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                    }`}
                    title="Fond Orange"
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-6 scale-125 sm:scale-150 transform transition-transform">
                  <BrandLogo variant="full" size="xl" showTagline={false} />
                </div>
              </div>

              {/* Symbolism Breakdown (The 4 Intelligent Pillars) */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Analyse des 4 Symboles Clés Intégrés dans l'Icône :</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Pillar 1 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                      <div className="w-7 h-7 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>1. L'Arche « Allô » (Écouteur &amp; Sourire)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      La courbure inférieure dorée évoque le combiné téléphonique traditionnel et le <strong>sourire de satisfaction</strong> du client dès le premier appel ou la commande passée.
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <span>2. La Cloche Gourmande (« Resto »)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Le dôme supérieur stylise la cloche de service des grands restaurants, gage de <strong>plats chauds, frais et protégés</strong> pendant la livraison.
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <div className="w-7 h-7 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span>3. L'Éclair / Fourchette Centrale</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Au cœur du dôme, la silhouette d'une fourchette minimaliste forme une étincelle de saveur et rappelle la <strong>rapidité express de Billo Express</strong> à Niamey.
                    </p>
                  </div>

                  {/* Pillar 4 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs">
                      <div className="w-7 h-7 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                      </div>
                      <span>4. Le Soleil &amp; Point GPS de Niamey</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      La pastille dorée supérieure symbolise à la fois le <strong>soleil chaleureux du Sahel</strong> et la pastille de notification / géolocalisation en temps réel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOCKUP & HIGH RES ASSET */}
          {activeTab === "mockup" && (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col items-center">
                <img
                  src="/src/assets/images/alloresto_modern_logo_1787668961360.jpg"
                  alt="Allôresto Modern Logo Render"
                  className="w-full max-h-[380px] object-contain rounded-2xl p-2"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 w-full bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Rendu Branding Haute Résolution</span>
                    <span className="text-slate-400 text-[11px]">Format App Icon &bull; Veste Livreur &bull; Packaging</span>
                  </div>
                  <button
                    onClick={handleDownloadSvg}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger Logo</span>
                  </button>
                </div>
              </div>

              {/* Context Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-white block">📱 Application Mobile</span>
                  <p className="text-[11px] text-slate-400">Favicon, Splash screen PWA &amp; icône Android / iOS</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-white block">🏍️ Flotte Billo Express</span>
                  <p className="text-[11px] text-slate-400">Caissons isothermes, casques &amp; gilets haute visibilité</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-white block">🥡 Packaging Éco-responsable</span>
                  <p className="text-[11px] text-slate-400">Sacs kraft, rubans adhésifs inviolables et tickets de caisse</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLOR PALETTE */}
          {activeTab === "palette" && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-400" />
                <span>Charte Chromatique Harmonieuse :</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Color 1 */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="h-20 bg-[#FF7A00]" />
                  <div className="p-3">
                    <span className="text-xs font-bold text-white block">Orange Solaire</span>
                    <span className="text-[11px] font-mono text-orange-400">#FF7A00</span>
                    <p className="text-[10px] text-slate-400 mt-1">Énergie, appétit et dynamisme</p>
                  </div>
                </div>

                {/* Color 2 */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="h-20 bg-[#FFAE00]" />
                  <div className="p-3">
                    <span className="text-xs font-bold text-white block">Ambre Doré</span>
                    <span className="text-[11px] font-mono text-amber-400">#FFAE00</span>
                    <p className="text-[10px] text-slate-400 mt-1">Chaleur du Sahel et convivialité</p>
                  </div>
                </div>

                {/* Color 3 */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="h-20 bg-[#E02E1B]" />
                  <div className="p-3">
                    <span className="text-xs font-bold text-white block">Rouge Piment</span>
                    <span className="text-[11px] font-mono text-red-400">#E02E1B</span>
                    <p className="text-[10px] text-slate-400 mt-1">Saveurs authentiques et passion</p>
                  </div>
                </div>

                {/* Color 4 */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="h-20 bg-[#0F172A]" />
                  <div className="p-3">
                    <span className="text-xs font-bold text-white block">Noir Ardoise</span>
                    <span className="text-[11px] font-mono text-slate-400">#0F172A</span>
                    <p className="text-[10px] text-slate-400 mt-1">Élégance moderne et contraste</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT & SVG SPECS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                    <span>Code Source SVG Vectoriel Optimisé</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySvg}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copié !" : "Copier SVG"}</span>
                    </button>
                    <button
                      onClick={handleDownloadSvg}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger .SVG</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl font-mono text-[11px] text-slate-400 overflow-x-auto max-h-48">
                  <code>{`<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="allorestoGradient" x1="10" y1="10" x2="110" y2="110">
      <stop offset="0%" stop-color="#FF7A00" />
      <stop offset="100%" stop-color="#E02E1B" />
    </linearGradient>
  </defs>
  <!-- Squircle squircle base with cloche + handset arc + fork -->
  <rect x="6" y="6" width="108" height="108" rx="32" fill="url(#allorestoGradient)" />
  ...
</svg>`}</code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Logo officiel actif et intégré sur l'ensemble de la plateforme Allôresto.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold transition cursor-pointer"
          >
            Fermer l'aperçu
          </button>
        </div>
      </motion.div>
    </div>
  );
};
