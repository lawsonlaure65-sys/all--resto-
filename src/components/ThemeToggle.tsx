import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";

interface ThemeToggleProps {
  variant?: "header-bar" | "header-nav" | "segmented" | "menu-item";
  className?: string;
  onThemeChanged?: (mode: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "header-bar",
  className = "",
  onThemeChanged,
}) => {
  const { themeMode, resolvedTheme, systemTheme, setThemeMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelectMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    setIsDropdownOpen(false);
    if (onThemeChanged) onThemeChanged(mode);
  };

  // 1. Variant: Segmented Control (Idéal pour modal préférences / compte)
  if (variant === "segmented") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <span>Thème d&apos;affichage</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
            Actuel : {resolvedTheme === "dark" ? "Sombre 🌙" : "Clair ☀️"}
            {themeMode === "system" && " (Auto)"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          {/* Option 1: Système / Auto */}
          <button
            type="button"
            onClick={() => handleSelectMode("system")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              themeMode === "system"
                ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
            title={`Suit le réglage de votre appareil (${systemTheme === "dark" ? "sombre détecté" : "clair détecté"})`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Système</span>
          </button>

          {/* Option 2: Clair */}
          <button
            type="button"
            onClick={() => handleSelectMode("light")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              themeMode === "light"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Clair</span>
          </button>

          {/* Option 3: Sombre */}
          <button
            type="button"
            onClick={() => handleSelectMode("dark")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              themeMode === "dark"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Sombre</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400">
          {themeMode === "system"
            ? `Détection automatique active : l'interface suit votre système (${systemTheme === "dark" ? "mode sombre" : "mode clair"}).`
            : themeMode === "light"
            ? "Thème clair forcé : fond lumineux et contrasté pour le jour."
            : "Thème sombre forcé : confort visuel nocturne optimisé."}
        </p>
      </div>
    );
  }

  // 2. Variant: Header Nav Button (Bouton carré dans la barre de navigation principale)
  if (variant === "header-nav") {
    return (
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          id="theme-nav-btn"
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-8 h-8 min-[400px]:w-8.5 min-[400px]:h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 transition active:scale-95 shadow-sm cursor-pointer relative ${
            resolvedTheme === "dark"
              ? "bg-[#181a2e] hover:bg-[#20233e] border-indigo-500/40 text-indigo-300"
              : "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900"
          } ${className}`}
          title={`Thème actuel : ${themeMode === "system" ? `Auto (${resolvedTheme})` : themeMode}. Cliquer pour changer.`}
          aria-label="Changer le thème d'affichage"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
          ) : (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          )}

          {/* Pastille indiquant le mode automatique */}
          {themeMode === "system" && (
            <span
              className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-emerald-500 text-[8px] font-black text-slate-950 border border-slate-900 shadow"
              title="Mode automatique actif"
            >
              A
            </span>
          )}
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-100">
            <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
              <span>Thème d&apos;affichage</span>
              <span className="text-orange-400 text-[9px] font-bold">
                {resolvedTheme === "dark" ? "Sombre" : "Clair"}
              </span>
            </div>

            {/* Option Système */}
            <button
              type="button"
              onClick={() => handleSelectMode("system")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer ${
                themeMode === "system"
                  ? "bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-orange-400" />
                <div>
                  <p className="font-bold leading-tight">Système (Auto)</p>
                  <p className="text-[10px] text-slate-400">
                    Suit l&apos;OS ({systemTheme === "dark" ? "Sombre" : "Clair"})
                  </p>
                </div>
              </div>
              {themeMode === "system" && <Check className="w-3.5 h-3.5 text-orange-400" />}
            </button>

            {/* Option Clair */}
            <button
              type="button"
              onClick={() => handleSelectMode("light")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer mt-0.5 ${
                themeMode === "light"
                  ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="font-bold leading-tight">Mode Clair</p>
                  <p className="text-[10px] text-slate-400">Lumineux &amp; épuré</p>
                </div>
              </div>
              {themeMode === "light" && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Option Sombre */}
            <button
              type="button"
              onClick={() => handleSelectMode("dark")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer mt-0.5 ${
                themeMode === "dark"
                  ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <div>
                  <p className="font-bold leading-tight">Mode Sombre</p>
                  <p className="text-[10px] text-slate-400">Élégant &amp; reposant</p>
                </div>
              </div>
              {themeMode === "dark" && <Check className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. Variant: Header Bar (Bouton dans le bandeau supérieur coloré)
  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        id="theme-topbar-btn"
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer shadow-sm ${
          themeMode === "system"
            ? "bg-black/50 hover:bg-black/70 border border-white/30"
            : resolvedTheme === "dark"
            ? "bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200"
            : "bg-amber-700/90 hover:bg-amber-600 border border-amber-400/50 text-amber-100"
        } ${className}`}
        title={`Thème actuel : ${themeMode === "system" ? `Automatique (${resolvedTheme})` : themeMode}. Cliquer pour ajuster.`}
        aria-label="Modifier le thème d'affichage"
      >
        {themeMode === "system" ? (
          <Laptop className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
        ) : resolvedTheme === "dark" ? (
          <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-300" />
        ) : (
          <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
        )}

        <span className="hidden min-[480px]:inline">
          {themeMode === "system"
            ? `Auto (${resolvedTheme === "dark" ? "Sombre" : "Clair"})`
            : themeMode === "dark"
            ? "Sombre"
            : "Clair"}
        </span>
        <span className="min-[480px]:hidden">
          {resolvedTheme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>

      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-1.5 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-slate-100">
          <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span>Thème d&apos;affichage</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="text-[9px] text-orange-400 hover:underline font-bold"
              title="Basculer rapidement entre Clair et Sombre"
            >
              Basculer ⚡
            </button>
          </div>

          {/* Option Système */}
          <button
            type="button"
            onClick={() => handleSelectMode("system")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer ${
              themeMode === "system"
                ? "bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-orange-400" />
              <div>
                <p className="font-bold leading-tight">Système (Auto)</p>
                <p className="text-[10px] text-slate-400">
                  Suit l&apos;OS ({systemTheme === "dark" ? "Sombre détecté" : "Clair détecté"})
                </p>
              </div>
            </div>
            {themeMode === "system" && <Check className="w-3.5 h-3.5 text-orange-400" />}
          </button>

          {/* Option Clair */}
          <button
            type="button"
            onClick={() => handleSelectMode("light")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer mt-0.5 ${
              themeMode === "light"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <p className="font-bold leading-tight">Mode Clair</p>
                <p className="text-[10px] text-slate-400">Fond lumineux et aéré</p>
              </div>
            </div>
            {themeMode === "light" && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Option Sombre */}
          <button
            type="button"
            onClick={() => handleSelectMode("dark")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer mt-0.5 ${
              themeMode === "dark"
                ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <p className="font-bold leading-tight">Mode Sombre</p>
                <p className="text-[10px] text-slate-400">Contraste nocturne doux</p>
              </div>
            </div>
            {themeMode === "dark" && <Check className="w-3.5 h-3.5 text-indigo-400" />}
          </button>
        </div>
      )}
    </div>
  );
};
