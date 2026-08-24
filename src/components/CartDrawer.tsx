import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Percent,
  Check,
  Bike,
  Utensils,
  HeartHandshake,
} from "lucide-react";
import { CartItem, ServiceMode } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurantName?: string;
  serviceMode: ServiceMode;
  onChangeServiceMode: (mode: ServiceMode) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenCheckout: (promoDiscount: number, appliedCode: string, tip: number, cutlery: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  restaurantName,
  serviceMode,
  onChangeServiceMode,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountRate: number; isFreeDelivery?: boolean } | null>(
    null
  );
  const [promoError, setPromoError] = useState("");
  const [selectedTip, setSelectedTip] = useState<number>(500);
  const [includeCutlery, setIncludeCutlery] = useState<boolean>(true);

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = serviceMode === "takeaway" || (appliedPromo?.isFreeDelivery && subtotal >= 5000) ? 0 : 1000;

  let discount = 0;
  if (appliedPromo?.discountRate) {
    discount = Math.round((subtotal * appliedPromo.discountRate) / 100);
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount + selectedTip);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = promoInput.trim().toUpperCase();

    if (cleaned === "NIAMEY10" || cleaned === "BIENVENUE10") {
      setAppliedPromo({ code: cleaned, discountRate: 10 });
      setPromoInput("");
    } else if (cleaned === "LIVRAISON0") {
      setAppliedPromo({ code: "LIVRAISON0", discountRate: 0, isFreeDelivery: true });
      setPromoInput("");
    } else if (cleaned === "ALLO20") {
      if (subtotal >= 10000) {
        setAppliedPromo({ code: "ALLO20", discountRate: 20 });
        setPromoInput("");
      } else {
        setPromoError("Ce code nécessite un minimum de 10 000 FCFA de commande.");
      }
    } else {
      setPromoError("Code promo invalide. Essayez NIAMEY10 ou LIVRAISON0.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Votre Commande</h3>
                  {restaurantName && (
                    <p className="text-[11px] text-orange-400 font-medium">{restaurantName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-[10px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                  >
                    Vider
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Service Mode Selector */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => onChangeServiceMode("delivery")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  serviceMode === "delivery"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Livraison</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeServiceMode("takeaway")}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  serviceMode === "takeaway"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>À Emporter (0€ frais)</span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center text-slate-600 border border-slate-800">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">Votre panier est vide</h4>
                  <p className="text-xs max-w-xs text-slate-400">
                    Parcourez nos restaurants partenaires et ajoutez de délicieux plats à votre commande.
                  </p>
                </div>
              ) : (
                items.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white">{cartItem.menuItem.name}</h4>

                      {/* Display chosen options */}
                      {Object.entries(cartItem.selectedOptions).length > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5 space-y-0.5">
                          {Object.entries(cartItem.selectedOptions).map(([key, val]) => (
                            <span key={key} className="block text-slate-400">
                              &bull; {key}: <strong className="text-slate-300">{val}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="text-xs font-extrabold text-orange-400 mt-1 block">
                        {cartItem.totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (cartItem.quantity > 1) {
                            onUpdateQuantity(cartItem.id, cartItem.quantity - 1);
                          } else {
                            onRemoveItem(cartItem.id);
                          }
                        }}
                        className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        {cartItem.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>

                      <span className="text-xs font-bold text-white px-1">{cartItem.quantity}</span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-orange-500 text-slate-950 font-bold flex items-center justify-center hover:bg-orange-400 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
                {/* Promo Code Input */}
                <div>
                  {appliedPromo ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Code <strong>{appliedPromo.code}</strong> appliqué !
                      </span>
                      <button
                        onClick={() => setAppliedPromo(null)}
                        className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Retirer
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Code promo (ex: NIAMEY10)"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                      >
                        Appliquer
                      </button>
                    </form>
                  )}
                  {promoError && <p className="text-[10px] text-rose-400 mt-1">{promoError}</p>}
                </div>

                {/* Courier Tip */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3 text-orange-400" />
                      Pourboire livreur :
                    </span>
                    <span className="text-white font-bold">{selectedTip.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 200, 500, 1000, 2000].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTip(t)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedTip === t
                            ? "bg-orange-500/20 border-orange-500 text-orange-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t === 0 ? "Non" : `+${t}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cutlery Option */}
                <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCutlery}
                      onChange={(e) => setIncludeCutlery(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
                    />
                    <span>Inclure couverts &amp; serviettes</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-bold">Gratuit</span>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Sous-total plats</span>
                    <span className="font-semibold">{subtotal.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400">Offerts</span>
                      ) : (
                        `${deliveryFee.toLocaleString()} FCFA`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Remise code promo</span>
                      <span>-{discount.toLocaleString()} FCFA</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                    <span>Total à régler</span>
                    <span className="text-orange-400">{grandTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() =>
                    onOpenCheckout(
                      discount,
                      appliedPromo?.code || "",
                      selectedTip,
                      includeCutlery
                    )
                  }
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-sm flex items-center justify-between px-6 shadow-xl shadow-orange-500/25 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <span>Passer la commande</span>
                  <div className="flex items-center gap-1.5">
                    <span>{grandTotal.toLocaleString()} FCFA</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
