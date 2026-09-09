import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "alloresto_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialiser le mode depuis localStorage ou "system" par défaut
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    }
    return "system";
  });

  // 2. Détection du thème système OS / Navigateur
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  });

  // 3. Écoute active des changements de thème du système d'exploitation
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = (matches: boolean) => {
      setSystemTheme(matches ? "dark" : "light");
    };

    // État initial
    updateSystemTheme(mediaQuery.matches);

    // Écouteur réactif
    const listener = (event: MediaQueryListEvent) => {
      updateSystemTheme(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(listener);
      }
    };
  }, []);

  // 4. Calcul du thème résolu (effectif)
  const resolvedTheme: ResolvedTheme = themeMode === "system" ? systemTheme : themeMode;

  // 5. Synchronisation avec le DOM (classes html, attributs data et meta theme-color)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.setAttribute("data-theme", resolvedTheme);
    root.setAttribute("data-theme-mode", themeMode);

    // Mise à jour dynamique de la couleur de barre d'adresse mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", resolvedTheme === "dark" ? "#020617" : "#ffffff");
    }
  }, [resolvedTheme, themeMode]);

  // 6. Sauvegarde et modification du mode
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignorer si localStorage indisponible
    }
  };

  // 7. Basculement rapide au clic
  const toggleTheme = () => {
    if (themeMode === "system") {
      // Si en mode système, forcer l'opposé du thème actuellement résolu
      setThemeMode(resolvedTheme === "dark" ? "light" : "dark");
    } else if (themeMode === "dark") {
      setThemeMode("light");
    } else {
      // De light, revenir vers dark (ou système si souhaité)
      setThemeMode("dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        systemTheme,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
