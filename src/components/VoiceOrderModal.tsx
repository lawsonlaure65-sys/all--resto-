import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  AlertCircle,
  Volume2,
  Flame,
  ArrowRight,
  RefreshCw,
  Search,
  Radio,
  Zap,
  Globe,
  Languages,
} from "lucide-react";
import { MenuItem, CartItem, AppLanguage } from "../types";
import { playSoundCartAdd, playSoundSuccessChime } from "../utils/audioNotifications";
import { SUPPORTED_LANGUAGES, t } from "../utils/translations";

interface RecognizedItem {
  dish: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
  notes?: string;
}

interface VoiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  allDishes?: MenuItem[];
  availableDishes?: MenuItem[];
  onAddToCart: (item: MenuItem, selectedOptionsOrQty?: Record<string, string> | number, quantity?: number) => void;
  onOpenCart?: () => void;
  onOpenCheckout?: () => void;
  onDirectCheckout?: (items: RecognizedItem[]) => void;
  currentLanguage?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

const VOICE_PROMPTS_BY_LANG: Record<AppLanguage, string[]> = {
  fr: [
    "Je voudrais 2 choukouya d'agneau et un jus de bissap",
    "Un dambou royal au moringa et une bouteille d'eau",
    "Deux assiettes de capitaine braisé du fleuve avec alloco",
    "Un burger gourmet double cheddar et des frites",
    "Le menu du jour complet avec boisson fraîche",
    "Pintade braisée au Kan-Kan bien pimentée et 2 jus de gingembre",
  ],
  en: [
    "I'd like 2 grilled lamb choukouya and one cold bissap juice",
    "One royal moringa dambou and a bottle of mineral water",
    "Two plates of grilled Niger river captain fish with plantains",
    "One gourmet double cheeseburger and crispy fries",
    "The complete daily special meal with a fresh drink",
    "Spicy grilled guinea fowl with Kan-Kan spice and 2 ginger juices",
  ],
  ha: [
    "Ina son gasasshen naman rago (Choukouya) guda biyu da ruwan bissap",
    "Dambou royal na zogale daya da ruwan sha mai sanyi",
    "Kifin kogin Kwara (Capitaine) gasasshe guda biyu da dankali",
    "Gasasshiyar kaza da yajin Kan-Kan da lemo guda biyu",
    "Abincin rana na yau (Menu du jour) da abin sha",
    "Dêguê na nono da zuma da gasasshen nama",
  ],
  zm: [
    "Ay ba ham tonte (Choukouya) hinka nda bissap afo",
    "Dambou royal kopto afo nda isa hari kaano",
    "Isa hari ham (Capitaine) tonte hinka nda aloco",
    "Gorba tonte nda yaji Kan-Kan nda hari kaana hinka",
    "Zaari ŋwaari hanno (Menu du jour) nda hari kaano",
    "Degue kosam nda yuuma nda ham tonte",
  ],
};

// Helper to convert number words across 4 languages to integers
function parseMultilingualQuantity(text: string, lang: AppLanguage): number {
  const normalized = text.toLowerCase().trim();

  // French
  if (normalized.includes("un ") || normalized.includes("une ") || normalized.startsWith("un ") || normalized.startsWith("une ")) return 1;
  if (normalized.includes("deux ") || normalized.includes("2 ") || normalized.includes("2x")) return 2;
  if (normalized.includes("trois ") || normalized.includes("3 ") || normalized.includes("3x")) return 3;
  if (normalized.includes("quatre ") || normalized.includes("4 ") || normalized.includes("4x")) return 4;
  if (normalized.includes("cinq ") || normalized.includes("5 ") || normalized.includes("5x")) return 5;
  if (normalized.includes("six ") || normalized.includes("6 ")) return 6;
  if (normalized.includes("dix ") || normalized.includes("10 ")) return 10;

  // English
  if (normalized.includes("one ") || normalized.startsWith("one ") || normalized.includes("a ") || normalized.startsWith("a ")) return 1;
  if (normalized.includes("two ") || normalized.startsWith("two ")) return 2;
  if (normalized.includes("three ") || normalized.startsWith("three ")) return 3;
  if (normalized.includes("four ") || normalized.startsWith("four ")) return 4;
  if (normalized.includes("five ") || normalized.startsWith("five ")) return 5;
  if (normalized.includes("six ") || normalized.startsWith("six ")) return 6;
  if (normalized.includes("ten ") || normalized.startsWith("ten ")) return 10;

  // Hausa: daya, biyu, uku, hudu, biyar, shida, goma
  if (normalized.includes("daya") || normalized.includes("guda daya")) return 1;
  if (normalized.includes("biyu") || normalized.includes("guda biyu")) return 2;
  if (normalized.includes("uku") || normalized.includes("guda uku")) return 3;
  if (normalized.includes("hudu") || normalized.includes("guda hudu")) return 4;
  if (normalized.includes("biyar") || normalized.includes("guda biyar")) return 5;
  if (normalized.includes("shida") || normalized.includes("goma")) return 6;

  // Zarma: afo / fa, hinka, hinza, taaci, guu, iddu, iwey
  if (normalized.includes("afo") || normalized.includes(" fa ") || normalized.endsWith(" fa")) return 1;
  if (normalized.includes("hinka") || normalized.includes("inka")) return 2;
  if (normalized.includes("hinza") || normalized.includes("inza")) return 3;
  if (normalized.includes("taaci") || normalized.includes("taci")) return 4;
  if (normalized.includes("guu") || normalized.includes("gu")) return 5;
  if (normalized.includes("iddu") || normalized.includes("iwey")) return 6;

  const match = text.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 20) return num;
  }
  return 1;
}

// Normalize text for fuzzy matching
function cleanString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

export const VoiceOrderModal: React.FC<VoiceOrderModalProps> = ({
  isOpen,
  onClose,
  allDishes,
  availableDishes,
  onAddToCart,
  onOpenCart,
  onOpenCheckout,
  onDirectCheckout,
  currentLanguage = "fr",
  onLanguageChange,
}) => {
  const effectiveDishes = availableDishes || allDishes || [];
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(currentLanguage);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [detectedItems, setDetectedItems] = useState<RecognizedItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [manualInput, setManualInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasAddedSuccess, setHasAddedSuccess] = useState<boolean>(false);
  const [audioFeedbackText, setAudioFeedbackText] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Sync selected lang
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Determine speech recognition language code
  const getRecognitionLangCode = (lang: AppLanguage): string => {
    switch (lang) {
      case "en":
        return "en-US";
      case "ha":
        // Some browsers support ha-NG / ha-NE, fallback to fr-FR if not recognized
        return "ha-NG";
      case "zm":
        // Zarma uses Nigerien French acoustic base
        return "fr-FR";
      case "fr":
      default:
        return "fr-FR";
    }
  };

  // Initialize Speech Recognition
  const initRecognition = (lang: AppLanguage) => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            // ignore
          }
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getRecognitionLangCode(lang);

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTranscript(currentTranscript);
            parseTranscriptAndMatchDishes(currentTranscript, lang);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setErrorMessage("Accès microphone non autorisé. Vous pouvez taper ou cliquer sur un exemple.");
          } else if (event.error === "language-not-supported") {
            // Fallback to fr-FR for acoustic processing with local dictionaries
            try {
              recognition.lang = "fr-FR";
              recognition.start();
            } catch (err) {
              setErrorMessage("Mode vocal prêt en mode acoustique Sahel.");
            }
          } else if (event.error === "no-speech") {
            // benign
          } else {
            setErrorMessage(`Écoute en pause (${event.error}). Cliquez sur le micro pour relancer.`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  };

  // Switch voice language
  const handleSelectLanguage = (lang: AppLanguage) => {
    setSelectedLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
    initRecognition(lang);
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 200);
      } catch (e) {
        // ignore
      }
    }
  };

  useEffect(() => {
    initRecognition(selectedLang);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedLang]);

  // Auto-start listening when modal opens
  useEffect(() => {
    if (isOpen) {
      setTranscript("");
      setDetectedItems([]);
      setErrorMessage(null);
      setHasAddedSuccess(false);
      setAudioFeedbackText(null);
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setErrorMessage(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition already started or error:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Multilingual Speech Synthesis voice feedback
  const speakVoiceConfirmation = (text: string, lang: AppLanguage) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (lang === "en") utterance.lang = "en-US";
        else utterance.lang = "fr-FR";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // ignore
      }
    }
  };

  // Smart Multilingual Parser (French / English / Hausa / Zarma)
  const parseTranscriptAndMatchDishes = (text: string, lang: AppLanguage) => {
    setIsProcessing(true);
    const cleanedTranscript = cleanString(text);
    const matched: RecognizedItem[] = [];

    // Split speech into clauses / segments (separated by multilingual connectors: et, da, nda, and, with, plus, puis)
    const clauses = cleanedTranscript
      .split(/\bet\b|\band\b|\bda\b|\bnda\b|\bavec\b|\bwith\b|\bplus\b|\bpuis\b|,|\./)
      .map((c) => c.trim())
      .filter((c) => c.length > 1);

    const itemsToScan = clauses.length > 0 ? clauses : [cleanedTranscript];

    effectiveDishes.forEach((dish) => {
      const cleanDishName = cleanString(dish.name);
      const cleanDishDesc = cleanString(dish.description || "");

      // Key keywords of this dish
      const dishKeywords = cleanDishName.split(" ").filter((w) => w.length > 3);

      itemsToScan.forEach((clause) => {
        let isMatch = false;
        let qty = 1;

        // 1. Direct name match
        if (cleanDishName.includes(clause) || clause.includes(cleanDishName)) {
          isMatch = true;
          qty = parseMultilingualQuantity(clause, lang);
        } else {
          // Check keyword overlap
          const matchCount = dishKeywords.filter((k) => clause.includes(k)).length;
          if (dishKeywords.length > 0 && matchCount >= Math.min(2, dishKeywords.length)) {
            isMatch = true;
            qty = parseMultilingualQuantity(clause, lang);
          } else if (dishKeywords.length === 1 && matchCount === 1 && clause.length < 20) {
            isMatch = true;
            qty = parseMultilingualQuantity(clause, lang);
          }
        }

        // 2. Multilingual Keyword Mapping (Hausa / Zarma / English / French)
        if (!isMatch) {
          // --- Choukouya / Grillades de Mouton ---
          if (
            (clause.includes("choukouya") ||
              clause.includes("gasasshen nama") ||
              clause.includes("naman rago") ||
              clause.includes("ham tonte") ||
              clause.includes("grilled lamb") ||
              clause.includes("roast mutton") ||
              clause.includes("mouton")) &&
            (cleanDishName.includes("choukouya") || cleanDishName.includes("mouton") || cleanDishName.includes("agneau"))
          ) {
            isMatch = true;
          }
          // --- Poulet Braisé / Kaza / Ham Tonte ---
          else if (
            (clause.includes("kaza") ||
              clause.includes("poulet") ||
              clause.includes("grilled chicken") ||
              clause.includes("chicken")) &&
            cleanDishName.includes("poulet")
          ) {
            isMatch = true;
          }
          // --- Dambou Royal / Moringa / Kopto / Zogale ---
          else if (
            (clause.includes("dambou") ||
              clause.includes("zogale") ||
              clause.includes("kopto") ||
              clause.includes("moringa") ||
              clause.includes("couscous")) &&
            cleanDishName.includes("dambou")
          ) {
            isMatch = true;
          }
          // --- Capitaine Braisé / Kifi / Isa Hari Ham / Fish ---
          else if (
            (clause.includes("capitaine") ||
              clause.includes("kifin kwara") ||
              clause.includes("kifi") ||
              clause.includes("isa hari ham") ||
              clause.includes("hano") ||
              clause.includes("river fish") ||
              clause.includes("captain fish")) &&
            (cleanDishName.includes("capitaine") || cleanDishName.includes("poisson") || cleanDishName.includes("carpe"))
          ) {
            isMatch = true;
          }
          // --- Pintade Braisée / Gorba ---
          else if (
            (clause.includes("pintade") ||
              clause.includes("gorba") ||
              clause.includes("guinea fowl")) &&
            cleanDishName.includes("pintade")
          ) {
            isMatch = true;
          }
          // --- Bissap / Sobodo / Hibiscus ---
          else if (
            (clause.includes("bissap") ||
              clause.includes("sobodo") ||
              clause.includes("hibiscus") ||
              clause.includes("hari kaana")) &&
            cleanDishName.includes("bissap")
          ) {
            isMatch = true;
          }
          // --- Gingembre / Ginger ---
          else if (
            (clause.includes("gingembre") || clause.includes("ginger") || clause.includes("citta")) &&
            cleanDishName.includes("gingembre")
          ) {
            isMatch = true;
          }
          // --- Dêguê / Couscous de Mil / Kosam ---
          else if (
            (clause.includes("degue") || clause.includes("degue") || clause.includes("kosam") || clause.includes("nono")) &&
            cleanDishName.includes("degue")
          ) {
            isMatch = true;
          }
          // --- Menu du Jour / Zaari ŋwaari / Abincin Rana ---
          else if (
            (clause.includes("menu du jour") ||
              clause.includes("daily special") ||
              clause.includes("abincin rana") ||
              clause.includes("zaari ŋwaari")) &&
            (cleanDishName.includes("menu du jour") || dish.isMenuDuJour)
          ) {
            isMatch = true;
          }
          // --- Burger & Frites ---
          else if (
            (clause.includes("burger") || clause.includes("cheeseburger")) &&
            cleanDishName.includes("burger")
          ) {
            isMatch = true;
          }
          // --- Alloco / Plantain ---
          else if (
            (clause.includes("alloco") ||
              clause.includes("plantain") ||
              clause.includes("kolikoli") ||
              clause.includes("doya")) &&
            cleanDishName.includes("alloco")
          ) {
            isMatch = true;
          }
          // --- Riz au gras / Thieb / Shinkafa / Mo ---
          else if (
            (clause.includes("riz au gras") ||
              clause.includes("thieb") ||
              clause.includes("shinkafa") ||
              clause.includes("jollof") ||
              clause.includes("mo cina")) &&
            (cleanDishName.includes("riz") || cleanDishName.includes("thieb"))
          ) {
            isMatch = true;
          }
          // --- Eau Minérale / Ruwa / Hari ---
          else if (
            (clause.includes("eau") ||
              clause.includes("water") ||
              clause.includes("ruwa") ||
              clause.includes("ruwan sha") ||
              clause.includes("hari")) &&
            cleanDishName.includes("eau")
          ) {
            isMatch = true;
          }

          if (isMatch) {
            qty = parseMultilingualQuantity(clause, lang);
          }
        }

        if (isMatch) {
          const alreadyAdded = matched.some((m) => m.dish.id === dish.id);
          if (!alreadyAdded) {
            matched.push({
              dish,
              quantity: Math.max(1, qty),
              selectedOptions: {},
            });
          }
        }
      });
    });

    if (matched.length > 0) {
      setDetectedItems(matched);
      playSoundCartAdd();
    }
    setIsProcessing(false);
  };

  const handleApplySamplePrompt = (prompt: string) => {
    setTranscript(prompt);
    setManualInput(prompt);
    parseTranscriptAndMatchDishes(prompt, selectedLang);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    parseTranscriptAndMatchDishes(manualInput, selectedLang);
  };

  const handleUpdateItemQuantity = (index: number, delta: number) => {
    setDetectedItems((prev) =>
      prev
        .map((it, idx) => {
          if (idx === index) {
            const nextQ = it.quantity + delta;
            return nextQ > 0 ? { ...it, quantity: nextQ } : null;
          }
          return it;
        })
        .filter(Boolean) as RecognizedItem[]
    );
  };

  const handleRemoveItem = (index: number) => {
    setDetectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add all detected items to the cart
  const handleAddAllToCart = () => {
    if (detectedItems.length === 0) return;

    detectedItems.forEach((it) => {
      onAddToCart(it.dish, it.selectedOptions, it.quantity);
    });

    // Voice response feedback
    const feedbackPhrases: Record<AppLanguage, string> = {
      fr: `${detectedItems.length} plats ajoutés au panier avec succès !`,
      en: `${detectedItems.length} items added to your cart!`,
      ha: `An saka abinci ${detectedItems.length} a kwandon saya !`,
      zm: `Ŋwaari ${detectedItems.length} daŋ bata ra hanno !`,
    };
    speakVoiceConfirmation(feedbackPhrases[selectedLang], selectedLang);

    playSoundSuccessChime();
    setHasAddedSuccess(true);

    setTimeout(() => {
      onClose();
      if (onOpenCart) onOpenCart();
    }, 850);
  };

  // Direct checkout
  const handleDirectOrder = () => {
    if (detectedItems.length === 0) return;

    if (onDirectCheckout) {
      onDirectCheckout(detectedItems);
    } else {
      detectedItems.forEach((it) => {
        onAddToCart(it.dish, it.selectedOptions, it.quantity);
      });
      if (onOpenCheckout) onOpenCheckout();
    }

    playSoundSuccessChime();
    onClose();
  };

  const totalDetectedFCFA = detectedItems.reduce(
    (sum, it) => sum + it.dish.price * it.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-950/80 via-slate-900 to-amber-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {t(selectedLang, "voice_modal_title")}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase">
                  4 Langues IA
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {t(selectedLang, "voice_modal_subtitle")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multilingual Selector Bar */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>Langue vocale :</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLang === lang.code
                    ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black scale-105"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Main Visualizer / Microphone Center */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 relative overflow-hidden">
            {/* Animated Audio Wave Rings */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 rounded-full bg-orange-500/10 animate-ping opacity-75" />
                <div className="w-36 h-36 rounded-full bg-orange-500/20 animate-pulse" />
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                  isListening
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white ring-8 ring-orange-500/30 scale-105"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                }`}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce" />
                ) : (
                  <MicOff className="w-8 h-8 text-slate-400" />
                )}
              </button>

              <div className="mt-3 space-y-1">
                <span
                  className={`text-sm font-bold block ${
                    isListening ? "text-orange-400 animate-pulse" : "text-slate-300"
                  }`}
                >
                  {isListening
                    ? t(selectedLang, "voice_listening")
                    : t(selectedLang, "voice_click_to_speak")}
                </span>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  {selectedLang === "ha"
                    ? "Misali : 'Ina son gasasshen nama (Choukouya) guda biyu da ruwan bissap'"
                    : selectedLang === "zm"
                    ? "Misali : 'Ay ba ham tonte (Choukouya) hinka nda bissap afo'"
                    : selectedLang === "en"
                    ? "Example: 'I'd like 2 grilled lamb and one cold bissap juice'"
                    : "Exemple : 'Je veux 2 choukouya d'agneau et un jus de bissap bien frais'"}
                </p>
              </div>
            </div>

            {/* Live Transcript Display */}
            {transcript && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-1 relative z-10 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                    Texte Reconnu ({selectedLang.toUpperCase()}) :
                  </span>
                  <button
                    onClick={() => {
                      setTranscript("");
                      setDetectedItems([]);
                    }}
                    className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    Effacer
                  </button>
                </div>
                <p className="text-sm font-medium text-white italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  &quot;{transcript}&quot;
                </p>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Multilingual Examples Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t(selectedLang, "voice_example_prompt")}</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {VOICE_PROMPTS_BY_LANG[selectedLang]?.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplySamplePrompt(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-orange-300 text-xs transition text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>🗣️</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  selectedLang === "ha"
                    ? "Ko ka rubuta a nan (misali: Choukouya 2, Bissap 1)..."
                    : selectedLang === "zm"
                    ? "Wala hantum ne (misali: Ham tonte 2, Bissap 1)..."
                    : selectedLang === "en"
                    ? "Or type your order here (e.g., 2 grilled lamb, 1 bissap)..."
                    : "Ou écrivez votre commande ici (ex: 2 choukouya, 1 bissap)..."
                }
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Analyser
            </button>
          </form>

          {/* DETECTED DISHES LIST */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  {t(selectedLang, "voice_detected_items")} ({detectedItems.length})
                </span>
                {detectedItems.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Prêt pour le Panier
                  </span>
                )}
              </div>

              {detectedItems.length > 0 && (
                <span className="text-xs font-bold text-orange-400 font-mono">
                  Total : {totalDetectedFCFA.toLocaleString()} FCFA
                </span>
              )}
            </div>

            {detectedItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-slate-500 space-y-1">
                <ShoppingBag className="w-8 h-8 mx-auto opacity-40 mb-1" />
                <span className="text-xs font-semibold text-slate-400 block">
                  Aucun plat détecté pour l&apos;instant
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Activez le micro ci-dessus et dictez vos envies en Français, Anglais, Haoussa ou Zarma.
                </span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 group hover:border-orange-500/30 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.dish.image}
                        alt={item.dish.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{item.dish.name}</h4>
                          {item.dish.isSpicy && <Flame className="w-3 h-3 text-orange-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {item.dish.price.toLocaleString()} FCFA &bull;{" "}
                          <span className="text-emerald-400 font-bold">
                            {(item.dish.price * item.quantity).toLocaleString()} FCFA
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-white px-1.5 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            Fermer
          </button>

          {detectedItems.length > 0 && (
            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={hasAddedSuccess}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {hasAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{t(selectedLang, "voice_speak_feedback")}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>
                      {t(selectedLang, "voice_add_all_to_cart")} ({totalDetectedFCFA.toLocaleString()} FCFA)
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDirectOrder}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Commander Direct</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
