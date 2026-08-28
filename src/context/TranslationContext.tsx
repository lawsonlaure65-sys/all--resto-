import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { AppLanguage, MenuItem, Restaurant, DailySpecial, SauceBox } from "../types";
import { translationService } from "../services/translationService";
import { TRANSLATIONS, t as staticT, SUPPORTED_LANGUAGES, LanguageOption } from "../utils/translations";

interface TranslationContextType {
  currentLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  translateDish: (dish: MenuItem) => MenuItem;
  translateDishes: (dishes: MenuItem[]) => MenuItem[];
  translateRestaurant: (restaurant: Restaurant) => Restaurant;
  translateDailySpecial: (special: DailySpecial) => DailySpecial;
  translateSauceBox: (box: SauceBox) => SauceBox;
  translateCategory: (cat: string) => string;
  isTranslating: boolean;
  activeLanguageInfo: LanguageOption;
  forceRetranslate: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}> = ({ children, initialLanguage = "fr", onLanguageChange }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem("alloresto_user_lang");
    if (saved && (saved === "fr" || saved === "en" || saved === "ha" || saved === "zm")) {
      return saved as AppLanguage;
    }
    return initialLanguage;
  });

  const [version, setVersion] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const unsubscribe = translationService.subscribe(() => {
      setVersion((v) => v + 1);
      setIsTranslating(translationService.isTranslating);
    });
    return unsubscribe;
  }, []);

  const setLanguage = useCallback((newLang: AppLanguage) => {
    setCurrentLanguageState(newLang);
    try {
      localStorage.setItem("alloresto_user_lang", newLang);
    } catch (e) {
      console.warn("Could not persist language to localStorage:", e);
    }
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    // Force UI refresh
    setVersion((v) => v + 1);
  }, [onLanguageChange]);

  const activeLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  }, [currentLanguage]);

  const t = useCallback((key: string) => {
    return staticT(currentLanguage, key);
  }, [currentLanguage]);

  const translateDish = useCallback((dish: MenuItem): MenuItem => {
    // version dependency ensures re-render when cache updates from Gemini
    if (!dish) return dish;
    return translationService.translateDish(dish, currentLanguage);
  }, [currentLanguage, version]);

  const translateDishes = useCallback((dishes: MenuItem[]): MenuItem[] => {
    if (!dishes) return [];
    return translationService.translateDishes(dishes, currentLanguage);
  }, [currentLanguage, version]);

  const translateRestaurant = useCallback((restaurant: Restaurant): Restaurant => {
    if (!restaurant) return restaurant;
    return translationService.translateRestaurant(restaurant, currentLanguage);
  }, [currentLanguage, version]);

  const translateDailySpecial = useCallback((special: DailySpecial): DailySpecial => {
    if (!special) return special;
    return translationService.translateDailySpecial(special, currentLanguage);
  }, [currentLanguage, version]);

  const translateSauceBox = useCallback((box: SauceBox): SauceBox => {
    if (!box) return box;
    return translationService.translateSauceBox(box, currentLanguage);
  }, [currentLanguage, version]);

  const translateCategory = useCallback((cat: string): string => {
    return translationService.translateCategoryName(cat, currentLanguage);
  }, [currentLanguage, version]);

  const forceRetranslate = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const value = useMemo(() => ({
    currentLanguage,
    setLanguage,
    t,
    translateDish,
    translateDishes,
    translateRestaurant,
    translateDailySpecial,
    translateSauceBox,
    translateCategory,
    isTranslating,
    activeLanguageInfo,
    forceRetranslate,
  }), [
    currentLanguage,
    setLanguage,
    t,
    translateDish,
    translateDishes,
    translateRestaurant,
    translateDailySpecial,
    translateSauceBox,
    translateCategory,
    isTranslating,
    activeLanguageInfo,
    forceRetranslate,
  ]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      currentLanguage: "fr" as AppLanguage,
      setLanguage: () => {},
      t: (key: string) => staticT("fr", key),
      translateDish: (d: MenuItem) => d,
      translateDishes: (d: MenuItem[]) => d,
      translateRestaurant: (r: Restaurant) => r,
      translateDailySpecial: (s: DailySpecial) => s,
      translateSauceBox: (b: SauceBox) => b,
      translateCategory: (c: string) => c,
      isTranslating: false,
      activeLanguageInfo: SUPPORTED_LANGUAGES[0],
      forceRetranslate: () => {},
    };
  }
  return context;
}
