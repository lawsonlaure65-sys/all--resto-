import React, { useState, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Clock,
  Sparkles,
  MapPin,
  UtensilsCrossed,
  ChefHat,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  MessageCircle,
  HelpCircle,
  Coins,
  CreditCard,
  QrCode,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Restaurant, MenuItem, CartItem, PaymentMethod, Order } from "../types";
import { playSoundCartAdd, playSoundOrderConfirmed } from "../utils/audioNotifications";

export interface RestaurantQrLandingModalProps {
  restaurant: Restaurant;
  initialTable?: string;
  initialMode?: "dine_in" | "takeaway" | "delivery";
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
  onViewReceipt?: (order: Order) => void;
}

export const RestaurantQrLandingModal: React.FC<RestaurantQrLandingModalProps> = ({
  restaurant,
  initialTable = "Table 1",
  initialMode = "dine_in",
  isOpen,
  onClose,
  onOrderPlaced,
  onViewReceipt,
}) => {
  // Current Table & Mode
  const [currentTable, setCurrentTable] = useState<string>(initialTable);
  const [isEditingTable, setIsEditingTable] = useState<boolean>(false);
  const [selectedServiceMode, setSelectedServiceMode] = useState<"dine_in" | "takeaway">(
    initialMode === "takeaway" ? "takeaway" : "dine_in"
  );

  // Search & Category
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // In-Modal Table Cart State
  const [tableCart, setTableCart] = useState<CartItem[]>([]);
  const [configuringItem, setConfiguringItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [configQty, setConfigQty] = useState<number>(1);
  const [configNotes, setConfigNotes] = useState<string>("");

  // Step: "browse" | "checkout" | "confirmed"
  const [currentStep, setCurrentStep] = useState<"browse" | "checkout" | "confirmed">("browse");

  // Checkout inputs
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [kitchenNotes, setKitchenNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    restaurant.menu.forEach((d) => {
      if (d.category) set.add(d.category);
    });
    return ["all", ...Array.from(set)];
  }, [restaurant.menu]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return restaurant.menu.filter((dish) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q);
      const matchCat = selectedCategory === "all" || dish.category === selectedCategory;
      return matchQuery && matchCat;
    });
  }, [restaurant.menu, searchQuery, selectedCategory]);

  // Cart totals
  const subtotal = useMemo(() => {
    return tableCart.reduce((sum, it) => sum + it.totalPrice, 0);
  }, [tableCart]);

  const totalItemsCount = useMemo(() => {
    return tableCart.reduce((sum, it) => sum + it.quantity, 0);
  }, [tableCart]);

  if (!isOpen) return null;

  // Add Item to table cart directly
  const handleDirectAdd = (dish: MenuItem) => {
    if (dish.options && dish.options.length > 0) {
      // Open configuration popover
      const defaultOpts: Record<string, string> = {};
      dish.options.forEach((opt) => {
        if (opt.choices.length > 0) defaultOpts[opt.name] = opt.choices[0].label;
      });
      setSelectedOptions(defaultOpts);
      setConfigQty(1);
      setConfigNotes("");
      setConfiguringItem(dish);
    } else {
      playSoundCartAdd();
      setTableCart((prev) => {
        const existingIdx = prev.findIndex((ci) => ci.menuItem.id === dish.id);
        if (existingIdx >= 0) {
          const next = [...prev];
          const newQty = next[existingIdx].quantity + 1;
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: newQty,
            totalPrice: newQty * dish.price,
          };
          return next;
        }
        return [
          ...prev,
          {
            id: `item-${dish.id}-${Date.now()}`,
            menuItem: dish,
            quantity: 1,
            selectedOptions: {},
            unitPrice: dish.price,
            totalPrice: dish.price,
          },
        ];
      });
    }
  };

  // Confirm configured item addition
  const handleConfirmConfigItem = () => {
    if (!configuringItem) return;
    playSoundCartAdd();

    let extra = 0;
    if (configuringItem.options) {
      configuringItem.options.forEach((opt) => {
        const choice = selectedOptions[opt.name];
        const match = opt.choices.find((c) => c.label === choice);
        if (match) extra += match.extraPrice;
      });
    }
    const unitPrice = configuringItem.price + extra;

    const cartKey = `${configuringItem.id}-${Object.values(selectedOptions).join("-")}-${configNotes}`;

    setTableCart((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === cartKey);
      if (existingIdx >= 0) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + configQty;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: cartKey,
          menuItem: configuringItem,
          quantity: configQty,
          selectedOptions,
          unitPrice,
          totalPrice: unitPrice * configQty,
          notes: configNotes,
        },
      ];
    });

    setConfiguringItem(null);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setTableCart((prev) => {
      return prev
        .map((it) => {
          if (it.id === itemId) {
            const newQ = it.quantity + delta;
            if (newQ <= 0) return null;
            return {
              ...it,
              quantity: newQ,
              totalPrice: newQ * it.unitPrice,
            };
          }
          return it;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Place Order on Table
  const handlePlaceTableOrder = () => {
    if (tableCart.length === 0) return;
    setIsSubmitting(true);

    const orderId = `TBL-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const newOrder: Order = {
      id: orderId,
      createdAt: nowStr,
      customerName: customerName.trim() || `Client ${currentTable}`,
      customerPhone: customerPhone.trim() || "+227 90 00 00 00",
      deliveryAddress:
        selectedServiceMode === "dine_in"
          ? `${restaurant.name} • ${currentTable}`
          : `À emporter au comptoir • ${restaurant.name}`,
      city: restaurant.city || "Niamey",
      serviceType: selectedServiceMode === "dine_in" ? "dine_in" : "takeaway",
      tableNumber: selectedServiceMode === "dine_in" ? currentTable : undefined,
      isQrOrder: true,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantPhone: restaurant.phone,
      items: tableCart,
      subtotal,
      deliveryFee: 0,
      discount: 0,
      tip: 0,
      total: subtotal,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      orderStatus: "received",
      estimatedDeliveryTime: "15-20 min",
      kitchenNotes: kitchenNotes ? [kitchenNotes] : undefined,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setLastPlacedOrder(newOrder);
      setCurrentStep("confirmed");
      playSoundOrderConfirmed();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
      onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Banner & Restaurant Header */}
        <div className="relative p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-xl shrink-0 overflow-hidden">
                {restaurant.image ? (
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                ) : (
                  <span>🍽️</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">{restaurant.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Table Connectée</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{restaurant.quartier || "Niamey"}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-semibold">🟢 Cuisine ouverte</span>
                  <span>&bull;</span>
                  <span className="text-slate-300 font-medium">⚡ Prêt en 15-20 min</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table & Service Indicator Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-xl bg-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20">
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Scanné :</span>
                {isEditingTable ? (
                  <input
                    type="text"
                    value={currentTable}
                    onChange={(e) => setCurrentTable(e.target.value)}
                    onBlur={() => setIsEditingTable(false)}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditingTable(false)}
                    autoFocus
                    className="w-20 px-1 py-0.5 bg-white text-slate-950 rounded text-xs font-bold"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingTable(true)}
                    className="underline hover:text-slate-900 cursor-pointer"
                    title="Cliquez pour modifier le numéro de table"
                  >
                    {currentTable} ✎
                  </button>
                )}
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedServiceMode("dine_in")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedServiceMode === "dine_in"
                      ? "bg-slate-800 text-white font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🍽️ Sur Place
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedServiceMode("takeaway")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedServiceMode === "takeaway"
                      ? "bg-slate-800 text-white font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🥡 À Emporter
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              💡 Vos plats sont envoyés <strong className="text-orange-400">directement en cuisine</strong>
            </div>
          </div>
        </div>

        {/* STEP 1: BROWSE DISHES & DIRECT ORDER */}
        {currentStep === "browse" && (
          <>
            {/* Search and Category Filter */}
            <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 space-y-2 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un plat, une boisson, une grillade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {categories.map((cat, idx) => (
                  <button
                    key={`cat-pill-${cat}-${idx}`}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-slate-950 font-black shadow-sm"
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "🍽️ Toute la carte" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
              {filteredDishes.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">Aucun plat ne correspond à votre recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDishes.map((dish, idx) => {
                    const existingInCart = tableCart.find((ci) => ci.menuItem.id === dish.id);
                    return (
                      <div
                        key={`dish-card-${dish.id}-${idx}`}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
                      >
                        {dish.image && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 pr-1">
                          <h4 className="text-xs font-black text-white truncate">{dish.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {dish.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-black text-orange-400 font-mono">
                              {dish.price.toLocaleString()} FCFA
                            </span>
                            {dish.isSpicy && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" />
                                <span>Piment</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {existingInCart ? (
                            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(existingInCart.id, -1)}
                                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-orange-400 px-1 font-mono">
                                {existingInCart.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(existingInCart.id, 1)}
                                className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-black flex items-center justify-center cursor-pointer text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDirectAdd(dish)}
                              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition flex items-center gap-1 shadow-md shadow-orange-500/20 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Ajouter</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Floating Bar when Items are in Cart */}
            {tableCart.length > 0 && (
              <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{currentTable}</span>
                    <span className="text-[10px] text-slate-400">&bull; {totalItemsCount} article(s)</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-orange-400 font-mono">
                    Total : {subtotal.toLocaleString()} FCFA
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep("checkout")}
                  className="px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition cursor-pointer"
                >
                  <span>Commander à {currentTable}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: TABLE CHECKOUT & CONFIRMATION */}
        {currentStep === "checkout" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-black text-white">Validation de votre Commande</h4>
                <p className="text-xs text-slate-400">
                  {selectedServiceMode === "dine_in"
                    ? `Envoi direct en cuisine pour la : ${currentTable}`
                    : "À emporter au comptoir"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep("browse")}
                className="text-xs text-orange-400 font-bold hover:underline cursor-pointer"
              >
                + Ajouter d&apos;autres plats
              </button>
            </div>

            {/* Items Summary */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Plats sélectionnés pour la table :
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {tableCart.map((it, idx) => (
                  <div
                    key={`cart-recap-${it.id}-${idx}`}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">
                        {it.quantity}x {it.menuItem.name}
                      </span>
                      {it.notes && <p className="text-[10px] text-orange-400 italic">Note : {it.notes}</p>}
                    </div>
                    <span className="font-mono text-orange-400 font-bold">
                      {it.totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Votre Prénom ou Nom (optionnel) :
                </label>
                <input
                  type="text"
                  placeholder="Ex: Moussa, Mariama..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Numéro WhatsApp (pour le reçu) :
                </label>
                <input
                  type="tel"
                  placeholder="+227 90 00 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            {/* Kitchen Prep Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Instructions particulières pour le Chef :
              </label>
              <input
                type="text"
                placeholder="Ex: Servir les boissons fraîches en premier, sauce pimentée à part..."
                value={kitchenNotes}
                onChange={(e) => setKitchenNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Payment at table choice */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Mode de Paiement Préféré à Table :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "cash", label: "Espèces à Table", icon: "💵" },
                  { id: "mobile_money", label: "Airtel Money", icon: "🔴" },
                  { id: "moov_money", label: "Moov Flooz", icon: "🔵" },
                  { id: "al_izza_transfer", label: "Al Izza Transfert", icon: "🟡" },
                ].map((pm, idx) => (
                  <button
                    key={`pay-${pm.id}-${idx}`}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? "bg-orange-500/20 border-orange-500 text-white font-black"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-base block mb-0.5">{pm.icon}</span>
                    <span className="text-[11px] font-bold block">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Recap & Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total net à régler</span>
                <span className="text-lg font-black text-orange-400 font-mono">
                  {subtotal.toLocaleString()} FCFA
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep("browse")}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Retour
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceTableOrder}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>{isSubmitting ? "Envoi en cours..." : "Transmettre à la Cuisine 🛎️"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED SUCCESS SCREEN */}
        {currentStep === "confirmed" && lastPlacedOrder && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-wider border border-orange-500/30">
                Commande Reçue en Cuisine !
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                Merci ! Vos plats sont en préparation.
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                La commande <strong className="text-white font-mono">#{lastPlacedOrder.id}</strong> a été transmise
                instantanément aux chefs de <strong className="text-white">{restaurant.name}</strong> pour la{" "}
                <strong className="text-orange-400">{currentTable}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left w-full max-w-md space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Lieu :</span>
                <strong className="text-white">{currentTable} &bull; {restaurant.name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Délai estimé :</span>
                <strong className="text-emerald-400 font-mono">15 à 20 minutes</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Règlement :</span>
                <strong className="text-white">{lastPlacedOrder.total.toLocaleString()} FCFA ({lastPlacedOrder.paymentMethod})</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {onViewReceipt && (
                <button
                  type="button"
                  onClick={() => onViewReceipt(lastPlacedOrder)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <Receipt className="w-4 h-4 text-orange-400" />
                  <span>Voir le Ticket de Caisse</span>
                </button>
              )}

              <a
                href={`https://wa.me/${(restaurant.phone || "22770032552").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Bonjour ${restaurant.name}, je suis à la ${currentTable} pour la commande #${lastPlacedOrder.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Appeler le Serveur (WhatsApp)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setTableCart([]);
                  setCurrentStep("browse");
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-500 text-slate-950 text-xs font-black hover:bg-orange-400 transition cursor-pointer"
              >
                <span>+ Commander un autre plat</span>
              </button>
            </div>
          </div>
        )}

        {/* Dish Configuration Popover if dish has options */}
        {configuringItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white">{configuringItem.name}</h4>
                <button
                  onClick={() => setConfiguringItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options */}
              {configuringItem.options?.map((opt, oIdx) => (
                <div key={`opt-grp-${opt.name}-${oIdx}`} className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    {opt.name} :
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {opt.choices.map((c, cIdx) => (
                      <button
                        key={`opt-choice-${c.label}-${cIdx}`}
                        type="button"
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: c.label }))}
                        className={`p-2 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between cursor-pointer ${
                          selectedOptions[opt.name] === c.label
                            ? "bg-orange-500/20 border-orange-500 text-orange-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{c.label}</span>
                        {c.extraPrice > 0 && (
                          <span className="font-mono text-orange-400 text-[10px]">+{c.extraPrice} F</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Précision de cuisson / allergie :
                </label>
                <input
                  type="text"
                  placeholder="Ex: sans piment, bien cuit..."
                  value={configNotes}
                  onChange={(e) => setConfigNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Qty and Add */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setConfigQty(Math.max(1, configQty - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer text-xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-orange-400 px-2 font-mono">{configQty}</span>
                  <button
                    type="button"
                    onClick={() => setConfigQty(configQty + 1)}
                    className="w-7 h-7 rounded-lg bg-orange-500 text-slate-950 font-black flex items-center justify-center cursor-pointer text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmConfigItem}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter à la table</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
