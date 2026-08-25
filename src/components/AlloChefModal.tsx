import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ChefHat,
  Plus,
  Flame,
  ArrowRight,
  RotateCcw,
  MapPin,
  Coins,
  Store,
  Clock,
  Check,
  CheckCircle2,
  Info,
} from "lucide-react";
import { MenuItem, Restaurant } from "../types";
import { RESTAURANTS_DATA, DAILY_SPECIALS_DATA } from "../data/allorestoData";

interface AlloChefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: Record<string, string>, qty: number) => void;
  onSelectRestaurant: (resto: Restaurant) => void;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestedDishes?: Array<{
    item: MenuItem;
    restaurantName: string;
    restaurantId: string;
    district: string;
  }>;
  timestamp: string;
}

export const AlloChefModal: React.FC<AlloChefModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onSelectRestaurant,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Plateau");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  // Initial greeting with rich default suggestions
  const initialMessages: Message[] = [
    {
      id: "msg-welcome",
      role: "assistant",
      text: "Salam & Bonjour ! Je suis **AllôChef**, votre guide gastronomique et sommelier digital d'**Allôresto Niamey 🇳🇪**.\n\nQuel festin vous ferait plaisir aujourd'hui ? Dites-moi vos envies, votre budget en FCFA ou votre quartier (Plateau, Koira Kano, Grande Mosquée, Yantala, Goudel) pour une recommandation personnalisée !",
      timestamp: "À l'instant",
      suggestedDishes: [
        {
          item: RESTAURANTS_DATA[0].menu[0], // Demi-Mouton & Choukouya
          restaurantName: RESTAURANTS_DATA[0].name,
          restaurantId: RESTAURANTS_DATA[0].id,
          district: "Grande Mosquée Khadafi",
        },
        {
          item: RESTAURANTS_DATA[1].menu[0], // Dambou Royal
          restaurantName: RESTAURANTS_DATA[1].name,
          restaurantId: RESTAURANTS_DATA[1].id,
          district: "Plateau / Centre",
        },
        {
          item: RESTAURANTS_DATA[2].menu[0], // Capitaine Braisé
          restaurantName: RESTAURANTS_DATA[2].name,
          restaurantId: RESTAURANTS_DATA[2].id,
          district: "Corniche / Fleuve",
        },
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: "🥩 Choukouya & Grillades Sahel", prompt: "Je veux les meilleures grillades ou tchintchinga de Niamey pour ce soir !" },
    { label: "🍚 Dambou Royal & Terroir", prompt: "Un plat traditionnel nigérien comme le Dambou avec feuilles de moringa et poulet" },
    { label: "💼 Formule Midi Bureau (< 4 000 F)", prompt: "J'ai un budget de 4 000 FCFA pour un déjeuner rapide et copieux au bureau à Niamey" },
    { label: "🐟 Capitaine Braisé du Fleuve", prompt: "Je cherche du poisson frais, un bon capitaine braisé avec alloco et attiéké" },
    { label: "🍔 Burger & Street-Food", prompt: "Envie d'un délicieux burger gourmet ou chawarma mixte XXL" },
    { label: "👨‍👩‍👧‍👦 Menu Réunion & Groupe", prompt: "Quel menu complet recommandes-tu pour une réunion de 5 personnes au Plateau ?" },
  ];

  const districts = [
    "Plateau",
    "Grande Mosquée Khadafi",
    "Koira Kano",
    "Yantala",
    "Goudel",
    "Harobanda",
  ];

  const budgetOptions = [
    { label: "Tout budget", value: "all" },
    { label: "< 3 500 FCFA", value: "eco" },
    { label: "3 500 - 7 000 FCFA", value: "medium" },
    { label: "10 000+ FCFA (Groupe)", value: "premium" },
  ];

  // Helper to extract dishes matching text or context
  const findMatchingDishes = (text: string) => {
    const found: Array<{
      item: MenuItem;
      restaurantName: string;
      restaurantId: string;
      district: string;
    }> = [];

    const lower = text.toLowerCase();

    RESTAURANTS_DATA.forEach((resto) => {
      resto.menu.forEach((item) => {
        const itemNameLower = item.name.toLowerCase();
        const itemCatLower = item.category.toLowerCase();
        const itemDescLower = (item.description || "").toLowerCase();

        const match =
          lower.includes(itemNameLower) ||
          lower.includes(itemCatLower) ||
          (lower.includes("choukouya") && (itemNameLower.includes("mouton") || itemNameLower.includes("choukouya") || itemNameLower.includes("grillade"))) ||
          (lower.includes("grillade") && (itemNameLower.includes("poulet") || itemNameLower.includes("grillade") || itemNameLower.includes("mouton"))) ||
          (lower.includes("dambou") && itemNameLower.includes("dambou")) ||
          (lower.includes("capitaine") && itemNameLower.includes("capitaine")) ||
          (lower.includes("poisson") && (itemNameLower.includes("poisson") || itemNameLower.includes("capitaine"))) ||
          (lower.includes("chawarma") && itemNameLower.includes("chawarma")) ||
          (lower.includes("burger") && itemNameLower.includes("burger")) ||
          (lower.includes("midi") && (item.price <= 4500 || itemNameLower.includes("menu"))) ||
          (lower.includes("bureau") && item.price <= 5000);

        if (match && !found.some((f) => f.item.id === item.id) && found.length < 3) {
          found.push({
            item,
            restaurantName: resto.name,
            restaurantId: resto.id,
            district: resto.address || resto.city || "Niamey",
          });
        }
      });
    });

    // Default fallback dishes if none found
    if (found.length === 0) {
      found.push(
        {
          item: RESTAURANTS_DATA[0].menu[0],
          restaurantName: RESTAURANTS_DATA[0].name,
          restaurantId: RESTAURANTS_DATA[0].id,
          district: "Grande Mosquée",
        },
        {
          item: RESTAURANTS_DATA[1].menu[0],
          restaurantName: RESTAURANTS_DATA[1].name,
          restaurantId: RESTAURANTS_DATA[1].id,
          district: "Plateau",
        }
      );
    }

    return found;
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || inputMessage).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      role: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/allochef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          context: "Allôresto Niamey culinary concierge",
          district: selectedDistrict,
          budget: selectedBudget === "eco" ? 3000 : selectedBudget === "medium" ? 5500 : 15000,
        }),
      });

      const data = await response.json();
      const rawReply = data.reply || "";
      const suggested = findMatchingDishes(rawReply + " " + promptToSend);

      setMessages((prev) => [
        ...prev,
        {
          id: "msg-ai-" + Date.now(),
          role: "assistant",
          text: rawReply || "Voici nos suggestions exclusives de nos maîtres rôtisseurs et chefs partenaires à Niamey !",
          suggestedDishes: suggested,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.warn("API Error in AllôChef, using resilient local generator:", error);
      const suggested = findMatchingDishes(promptToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg-ai-" + Date.now(),
          role: "assistant",
          text: `Je vous recommande chaudement le **Demi-Mouton & Grillades du Sahel** chez *Le Khadafi Palace & Grillades* (Grande Mosquée) ou notre **Dambou Royal au Poulet** chez *Saveurs du Niger* (Plateau). Livraison express en 20-25 min assurée par Billo Express !`,
          suggestedDishes: suggested,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  const handleQuickAddDish = (dish: MenuItem) => {
    onAddToCart(dish, {}, 1);
    setAddedItemToast(`« ${dish.name} » ajouté à votre panier !`);
    setTimeout(() => setAddedItemToast(null), 3000);
  };

  const handleOpenRestaurant = (restaurantId: string) => {
    const target = RESTAURANTS_DATA.find((r) => r.id === restaurantId);
    if (target) {
      onSelectRestaurant(target);
      onClose();
    }
  };

  // Render markdown bold text
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={lineIdx > 0 ? "mt-2" : ""}>
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="text-white font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[820px]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <ChefHat className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">AllôChef IA</h3>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase shadow-sm">
                  Gemini 3.7 &bull; Niamey 🇳🇪
                </span>
              </div>
              <p className="text-xs text-orange-100 opacity-95 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Conseiller Culinaire, Sommelier &amp; Formules Sahel</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              title="Réinitialiser la conversation"
              className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-semibold">Effacer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preferences / Fast Context Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold shrink-0">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Quartier :</span>
            </div>
            <div className="flex gap-1">
              {districts.slice(0, 4).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                    selectedDistrict === d
                      ? "bg-orange-500 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-[11px] font-medium rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toast Alert for Added Dish */}
        <AnimatePresence>
          {addedItemToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md shrink-0"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{addedItemToast}</span>
              </div>
              <button
                onClick={() => setAddedItemToast(null)}
                className="text-[11px] underline font-black cursor-pointer hover:opacity-80"
              >
                Fermer
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-900/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200"
                }`}
              >
                <div className="space-y-1">{renderFormattedText(msg.text)}</div>

                {/* Suggested Dishes Cards inside chat */}
                {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>Plats recommandés disponibles :</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Livraison Billo Express</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.suggestedDishes.map(({ item, restaurantName, restaurantId, district }) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-2 shadow-sm"
                        >
                          <div className="flex gap-2.5 items-start">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-white text-xs truncate">{item.name}</h5>
                              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                <Store className="w-3 h-3 text-orange-400 shrink-0" />
                                <span>{restaurantName} ({district})</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-orange-400 font-extrabold text-xs">
                                  {item.price.toLocaleString()} FCFA
                                </span>
                                {item.preparationTime && (
                                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {item.preparationTime} min
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/60">
                            <button
                              onClick={() => handleOpenRestaurant(restaurantId)}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition"
                            >
                              <Store className="w-3 h-3 text-slate-400" />
                              <span>Voir Menu</span>
                            </button>
                            <button
                              onClick={() => handleQuickAddDish(item)}
                              className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer transition shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Ajouter</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-[9px] text-slate-500 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-orange-400 animate-pulse bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 w-fit">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>AllôChef consulte les cartes des chefs partenaires à Niamey...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Posez votre question à AllôChef (ex: envie de choukouya 5000 F au Plateau)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition shadow-md shadow-orange-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demander</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

