import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ChefHat,
  Plus,
  Utensils,
  Flame,
  ArrowRight,
} from "lucide-react";
import { MenuItem, Restaurant } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";

interface AlloChefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: Record<string, string>, qty: number) => void;
  onSelectRestaurant: (resto: Restaurant) => void;
}

interface Message {
  role: "assistant" | "user";
  text: string;
  suggestedDishes?: MenuItem[];
}

export const AlloChefModal: React.FC<AlloChefModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onSelectRestaurant,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Bonjour ! Je suis **AllôChef**, votre guide culinaire digital à Niamey 🇳🇪. Que souhaitez-vous déguster aujourd'hui ? Dites-moi votre budget en FCFA, vos envies gourmandes (Grillades du Sahel, Dambou, Riz au gras, Chawarma, Burgers) ou votre quartier pour une livraison ultra-rapide !",
      suggestedDishes: [
        RESTAURANTS_DATA[0].menu[0], // Demi-Mouton ou Poulet Grillé Sahel
        RESTAURANTS_DATA[0].menu[1], // Dambou Royal
        RESTAURANTS_DATA[1].menu[0], // Chawarma Mixte
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "J'ai 5 000 FCFA de budget pour ce midi au bureau",
    "Un repas copieux pour 4 collègues au Plateau",
    "Le meilleur poulet braisé ou tchintchinga de Niamey",
    "Une option rapide avec livraison près de la Grande Mosquée",
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: promptToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/allochef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          context: "Allôresto restaurant recommendation",
        }),
      });

      const data = await response.json();

      // Find matching dishes from menu
      const foundDishes: MenuItem[] = [];
      const lower = (data.reply || promptToSend).toLowerCase();
      RESTAURANTS_DATA.forEach((resto) => {
        resto.menu.forEach((item) => {
          if (
            lower.includes(item.name.toLowerCase()) ||
            lower.includes(item.category.toLowerCase()) ||
            (lower.includes("braisé") && item.name.includes("Braisé")) ||
            (lower.includes("burger") && item.name.includes("Burger")) ||
            (lower.includes("ramen") && item.name.includes("Ramen")) ||
            (lower.includes("pizza") && item.name.includes("Pizza")) ||
            (lower.includes("poké") && item.name.includes("Poké"))
          ) {
            if (!foundDishes.some((d) => d.id === item.id) && foundDishes.length < 3) {
              foundDishes.push(item);
            }
          }
        });
      });

      // Default to signature dishes if none matched directly
      if (foundDishes.length === 0) {
        foundDishes.push(RESTAURANTS_DATA[0].menu[0], RESTAURANTS_DATA[2].menu[0]);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Voici d'excellentes suggestions préparées par nos chefs partenaires !",
          suggestedDishes: foundDishes,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Je vous recommande de tester le Poulet Braisé Royal chez *Saveurs d'Afrique* ou le Burger Truffe & Morbier chez *L'Atelier du Burger* !",
          suggestedDishes: [RESTAURANTS_DATA[0].menu[0], RESTAURANTS_DATA[1].menu[0]],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black">AllôChef IA</h3>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full uppercase">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-orange-100 opacity-90">
                Conseiller Culinaire &amp; Sommelier Digital
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

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Suggested Dishes Cards inside chat */}
                {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-orange-400 block tracking-wider">
                      Plats recommandés directement disponibles :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.suggestedDishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <h5 className="font-bold text-white text-[11px] truncate">{dish.name}</h5>
                            <span className="text-orange-400 font-extrabold text-[11px]">
                              {dish.price.toLocaleString()} FCFA
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              onAddToCart(dish, {}, 1);
                              onClose();
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Panier</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-orange-400 animate-pulse">
              <Bot className="w-5 h-5" />
              <span>AllôChef consulte les cartes des chefs partenaires...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex gap-2 overflow-x-auto shrink-0">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
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
              placeholder="Demandez un conseil à AllôChef (ex: envie de sucré, repas rapide 12€...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
