import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageSquare,
  Sparkles,
  MapPin,
  Phone,
  User,
  Clock,
  Bike,
  Coins,
} from "lucide-react";
import { CartItem, PaymentMethod, ServiceMode, Order } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  serviceMode: ServiceMode;
  city: string;
  discount: number;
  promoCode?: string;
  tip: number;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  restaurantId,
  restaurantName,
  restaurantPhone,
  serviceMode,
  city,
  discount,
  promoCode,
  tip,
  onOrderPlaced,
}) => {
  const [customerName, setCustomerName] = useState("Amadou Seyni");
  const [customerPhone, setCustomerPhone] = useState("+227 90 12 34 56");
  const [deliveryAddress, setDeliveryAddress] = useState("Quartier Plateau, Ministère des Finances, Niamey");
  const [deliveryNotes, setDeliveryNotes] = useState("Bureau 204, 2ème étage aile Ouest");
  const [scheduledOption, setScheduledOption] = useState<string>("asap");
  const [customScheduledTime, setCustomScheduledTime] = useState<string>("12:30");
  const [cashChangeAmount, setCashChangeAmount] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<string>("Airtel Money");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("+227 96 00 11 22");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card Mock Data
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvc, setCardCvc] = useState("742");

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = serviceMode === "takeaway" ? 0 : 1000;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount + tip);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalScheduledTime =
      scheduledOption === "asap"
        ? undefined
        : scheduledOption === "12:30"
        ? "12:30 (Midi au bureau)"
        : customScheduledTime;

    setTimeout(() => {
      const newOrder: Order = {
        id: "CMD-" + Math.floor(1000 + Math.random() * 9000),
        createdAt: "À l'instant",
        customerName: customerName || "Client Allôresto Niamey",
        customerPhone: customerPhone || "+227 90 00 00 00",
        deliveryAddress: serviceMode === "takeaway" ? "À emporter en restaurant" : deliveryAddress,
        city: city || "Niamey",
        serviceType: serviceMode,
        restaurantId,
        restaurantName,
        restaurantPhone,
        items,
        subtotal,
        deliveryFee,
        discount,
        promoCode,
        tip,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
        orderStatus: "received",
        estimatedDeliveryTime:
          scheduledOption === "asap"
            ? serviceMode === "takeaway"
              ? "15-20 min"
              : "20-30 min"
            : `Prévue pour ${finalScheduledTime}`,
        scheduledTime: finalScheduledTime,
        deliveryPartner: "Billo Express 🏍️",
        cashChangeAmount: paymentMethod === "cash" ? cashChangeAmount : undefined,
        courierName: serviceMode === "delivery" ? "Ibrahim Oumarou (Billo Express)" : undefined,
        courierPhone: serviceMode === "delivery" ? "+227 97 88 77 66" : undefined,
      };

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              <h3 className="text-base font-extrabold text-white">Finaliser ma Commande</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                <Bike className="w-3 h-3" />
                Billo Express
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {restaurantName} &bull; Total à régler :{" "}
              <strong className="text-orange-400">{grandTotal.toLocaleString()} FCFA</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 1. Horaire & Créneau de Livraison */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-orange-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Moment de livraison souhaité</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScheduledOption("asap")}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  scheduledOption === "asap"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="block font-bold">⚡ Dès que possible</span>
                <span className="text-[10px] text-slate-400">Livraison express en 20-30 min</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduledOption("12:30")}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  scheduledOption === "12:30"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="block font-bold">🍱 Midi au Bureau (12h30)</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Idéal fonctionnaires &amp; salariés</span>
              </button>

              <button
                type="button"
                onClick={() => setScheduledOption("custom")}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  scheduledOption === "custom"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span className="block font-bold">🕒 Choisir l'heure</span>
                <span className="text-[10px] text-slate-400">Précommande programmée</span>
              </button>
            </div>

            {scheduledOption === "custom" && (
              <div className="pt-2 flex items-center gap-3">
                <label className="text-xs text-slate-400 font-semibold">Heure exacte souhaitée :</label>
                <select
                  value={customScheduledTime}
                  onChange={(e) => setCustomScheduledTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value="11:45">11h45</option>
                  <option value="12:00">12h00</option>
                  <option value="12:15">12h15</option>
                  <option value="12:30">12h30</option>
                  <option value="12:45">12h45</option>
                  <option value="13:00">13h00</option>
                  <option value="13:30">13h30</option>
                  <option value="19:30">19h30 (Dîner)</option>
                  <option value="20:00">20h00 (Dîner)</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Coordonnées & Livraison */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" />
              <span>Vos Coordonnées &amp; Adresse à Niamey</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nom &amp; Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Amadou Seyni"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Téléphone Niger (Livreur / WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+227 90 12 34 56"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {serviceMode === "delivery" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Adresse / Quartier / Ministère ({city}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ex: Plateau, Ministère des Finances / Koira Kano / Yantala..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Précision (Numéro de bureau, repère, villa, barrière)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Ex: Direction Générale, Bureau 102 / Près de la Grande Mosquée Khadafi"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* 3. Moyen de Paiement */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mode de Règlement Sécurisé au Niger</span>
            </h4>

            {/* Payment Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className={`p-3 rounded-2xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "mobile_money"
                    ? "bg-cyan-500/20 border-cyan-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span>Airtel / Moov Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`p-3 rounded-2xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span>Espèces à la livraison</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-2xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span>Carte Visa / Mastercard</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("apple_pay")}
                className={`p-3 rounded-2xl border text-center text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === "apple_pay"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Al Izza / Nita</span>
              </button>
            </div>

            {/* Sub-inputs depending on payment method */}
            {paymentMethod === "mobile_money" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex gap-2">
                  {["Airtel Money Niger", "Moov Flooz Niger", "Wave"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      onClick={() => setMobileMoneyProvider(provider)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mobileMoneyProvider === provider
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Numéro {mobileMoneyProvider} pour débit ou confirmation push :
                  </label>
                  <input
                    type="tel"
                    value={mobileMoneyNumber}
                    onChange={(e) => setMobileMoneyNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Paiement sécurisé 256-bit SSL</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Numéro de carte bancaire"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p>
                    Total à régler en espèces à la réception : <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Besoin de monnaie pour le livreur Billo Express ?</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setCashChangeAmount(undefined)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        cashChangeAmount === undefined
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      J'ai l'appoint
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashChangeAmount(5000)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        cashChangeAmount === 5000
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      Billet 5 000 F
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashChangeAmount(10000)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        cashChangeAmount === 10000
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      Billet 10 000 F
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashChangeAmount(20000)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        cashChangeAmount === 20000
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      Billet 20 000 F
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "apple_pay" && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <p>
                  Règlement par transfert Al Izza Express ou Nita : code de retrait transmis par SMS lors de la confirmation.
                </p>
              </div>
            )}
          </div>

          {/* 4. WhatsApp Notification Checkbox */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Recevoir le suivi de livraison en direct par <strong>WhatsApp</strong>
              </span>
            </label>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Instantané
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-400 hover:to-red-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-orange-500/30 cursor-pointer transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Validation de votre commande Allôresto en cours...</span>
            ) : (
              <>
                <span>Confirmer et Commander ({grandTotal.toLocaleString()} FCFA)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

