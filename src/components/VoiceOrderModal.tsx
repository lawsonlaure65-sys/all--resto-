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
} from "lucide-react";
import { MenuItem, CartItem } from "../types";
import { playSoundCartAdd, playSoundSuccessChime } from "../utils/audioNotifications";

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
}

const VOICE_SAMPLE_PROMPTS = [
  "Je voudrais 2 choukouya d'agneau et un jus de bissap",
  "Un dambou royal au moringa et une bouteille d'eau",
  "Deux assiettes de capitaine braisé du fleuve avec alloco",
  "Un burger gourmet double cheddar et des frites",
  "Le menu du jour complet avec boisson fraîche",
  "Pintade braisée au Kan-Kan bien pimentée et 2 jus de gingembre",
];

// Helper to convert french number words to integers
function parseQuantityFromText(text: string): number {
  const normalized = text.toLowerCase();
  if (normalized.includes("un ") || normalized.includes("une ") || normalized.startsWith("un") || normalized.startsWith("une")) return 1;
  if (normalized.includes("deux ") || normalized.includes("2 ") || normalized.includes("2x")) return 2;
  if (normalized.includes("trois ") || normalized.includes("3 ") || normalized.includes("3x")) return 3;
  if (normalized.includes("quatre ") || normalized.includes("4 ") || normalized.includes("4x")) return 4;
  if (normalized.includes("cinq ") || normalized.includes("5 ") || normalized.includes("5x")) return 5;
  if (normalized.includes("six ") || normalized.includes("6 ")) return 6;
  if (normalized.includes("dix ") || normalized.includes("10 ")) return 10;

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
}) => {
  const effectiveDishes = availableDishes || allDishes || [];
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [detectedItems, setDetectedItems] = useState<RecognizedItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [manualInput, setManualInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasAddedSuccess, setHasAddedSuccess] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "fr-FR";

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
            parseTranscriptAndMatchDishes(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setErrorMessage("Accès au microphone refusé. Vous pouvez aussi taper ou cliquer sur un exemple.");
          } else if (event.error === "no-speech") {
            // benign
          } else {
            setErrorMessage(`Écoute interrompue (${event.error}). Cliquez sur le micro pour réessayer.`);
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

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Auto-start listening when opened
  useEffect(() => {
    if (isOpen) {
      setTranscript("");
      setDetectedItems([]);
      setErrorMessage(null);
      setHasAddedSuccess(false);
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

  // Smart Parser: matches spoken French sentences against the catalog of 65+ dishes
  const parseTranscriptAndMatchDishes = (text: string) => {
    setIsProcessing(true);
    const cleanedTranscript = cleanString(text);
    const matched: RecognizedItem[] = [];

    // Split speech into clauses / segments (separated by "et", "avec", "puis", virgules)
    const clauses = cleanedTranscript
      .split(/\bet\b|\bavec\b|\bplus\b|\bpuis\b|,|\./)
      .map((c) => c.trim())
      .filter((c) => c.length > 2);

    // If clauses are too generic, match full transcript against dishes
    const itemsToScan = clauses.length > 0 ? clauses : [cleanedTranscript];

    effectiveDishes.forEach((dish) => {
      const cleanDishName = cleanString(dish.name);
      const cleanDishDesc = cleanString(dish.description);

      // Key keywords of this dish
      const dishKeywords = cleanDishName.split(" ").filter((w) => w.length > 3);

      itemsToScan.forEach((clause) => {
        let isMatch = false;
        let qty = 1;

        // Direct full or substring match
        if (cleanDishName.includes(clause) || clause.includes(cleanDishName)) {
          isMatch = true;
          qty = parseQuantityFromText(clause);
        } else {
          // Check keyword overlap
          const matchCount = dishKeywords.filter((k) => clause.includes(k)).length;
          if (dishKeywords.length > 0 && matchCount >= Math.min(2, dishKeywords.length)) {
            isMatch = true;
            qty = parseQuantityFromText(clause);
          } else if (dishKeywords.length === 1 && matchCount === 1 && clause.length < 20) {
            isMatch = true;
            qty = parseQuantityFromText(clause);
          }
        }

        // Special common Sahelian aliases
        if (!isMatch) {
          if (clause.includes("choukouya") && cleanDishName.includes("choukouya")) isMatch = true;
          else if (clause.includes("dambou") && cleanDishName.includes("dambou")) isMatch = true;
          else if (clause.includes("capitaine") && cleanDishName.includes("capitaine")) isMatch = true;
          else if (clause.includes("pintade") && cleanDishName.includes("pintade")) isMatch = true;
          else if (clause.includes("bissap") && cleanDishName.includes("bissap")) isMatch = true;
          else if (clause.includes("gingembre") && cleanDishName.includes("gingembre")) isMatch = true;
          else if (clause.includes("degue") && cleanDishName.includes("degue")) isMatch = true;
          else if (clause.includes("menu du jour") && (cleanDishName.includes("menu du jour") || dish.isMenuDuJour)) isMatch = true;
          else if (clause.includes("burger") && cleanDishName.includes("burger")) isMatch = true;
          else if (clause.includes("pizza") && cleanDishName.includes("pizza")) isMatch = true;
          else if (clause.includes("alloco") && cleanDishName.includes("alloco")) isMatch = true;

          if (isMatch) {
            qty = parseQuantityFromText(clause);
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
    }
    setIsProcessing(false);
  };

  const handleApplySamplePrompt = (prompt: string) => {
    setTranscript(prompt);
    setManualInput(prompt);
    parseTranscriptAndMatchDishes(prompt);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setTranscript(manualInput);
    parseTranscriptAndMatchDishes(manualInput);
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

    playSoundSuccessChime();
    setHasAddedSuccess(true);

    setTimeout(() => {
      onClose();
      if (onOpenCart) onOpenCart();
    }, 900);
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
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Commande Vocale Allôresto</h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase">
                  IA Reconnaissance
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Dictez votre commande en français naturel à Niamey &bull; Détection instantanée
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

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Main Visualizer / Microphone Center */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 relative overflow-hidden">
            {/* Animated Audio Wave Rings */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-orange-500/10 animate-ping opacity-75" />
                <div className="w-32 h-32 rounded-full bg-orange-500/20 animate-pulse" />
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
                  {isListening ? "🎙️ En écoute... Parlez maintenant !" : "Cliquez sur le micro pour parler"}
                </span>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Exemple : &quot;Je veux 2 choukouya d&apos;agneau, un dambou et deux jus de bissap bien frais&quot;
                </p>
              </div>
            </div>

            {/* Live Transcript Display */}
            {transcript && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-1 relative z-10 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                    Texte Reconnu :
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

          {/* Quick Examples Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ou cliquez sur un exemple prêt à l&apos;emploi :</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {VOICE_SAMPLE_PROMPTS.map((prompt, idx) => (
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
                placeholder="Ou écrivez votre commande ici (ex: 2 dambou, 1 bissap)..."
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
                  Plats Détectés ({detectedItems.length})
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
                  Activez le micro ci-dessus et dictez vos envies en toute simplicité.
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
                    <span>Ajouté au Panier !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                    <span>Ajouter au Panier ({totalDetectedFCFA.toLocaleString()} FCFA)</span>
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
