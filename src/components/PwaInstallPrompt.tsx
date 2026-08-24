import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, Check, Sparkles } from "lucide-react";

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Also show friendly banner after 4 seconds on mobile if not yet installed
    const timer = setTimeout(() => {
      if (!installed) {
        setIsVisible(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, [installed]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for Android Chrome / iOS Safari
      alert(
        "Pour installer Allôresto Niger sur votre smartphone :\n1. Touchez les 3 points du navigateur (ou le bouton Partager sur Safari)\n2. Sélectionnez 'Ajouter à l'écran d'accueil'\n3. Profitez de l'application rapide !"
      );
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 border border-orange-500/40 backdrop-blur-md rounded-2xl p-4 text-white shadow-2xl shadow-black/80 flex items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-500/30">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black text-white">Installer l'Application Allôresto</h4>
            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 text-[9px] font-bold rounded border border-emerald-500/30">
              PWA Android
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Accès ultra-rapide à vos déjeuners à Niamey &bull; 0 téléchargement Play Store
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Installer</span>
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
