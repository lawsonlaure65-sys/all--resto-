import React, { useState, useEffect } from "react";
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
  Copy,
  Check,
  Building2,
  Send,
  HelpCircle,
  AlertTriangle,
  Compass,
  Search,
} from "lucide-react";
import { CartItem, PaymentMethod, ServiceMode, Order, AppLanguage } from "../types";
import { LOCAL_PAYMENT_METHODS } from "../data/allorestoData";
import {
  NIAMEY_DISTRICTS_DATA,
  calculateNiameyDeliveryFee,
  NiameyDistrict,
  isNiameyNightTime,
} from "../data/niameyDistrictsData";
import { getJumuahStatus } from "../utils/jumuahSchedule";
import { generateWhatsAppOrderConfirmation } from "../utils/whatsappNotifications";

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
  onOpenDistrictsDirectory?: () => void;
  initialDistrictName?: string;
  simulatedFridayPause?: boolean;
  currentLanguage?: AppLanguage;
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
  onOpenDistrictsDirectory,
  initialDistrictName,
  simulatedFridayPause = false,
  currentLanguage = "fr",
}) => {
  const jumuahStatus = getJumuahStatus(simulatedFridayPause);

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("plateau");
  const [deliveryZone, setDeliveryZone] = useState<"centre" | "peripherie" | "mosquee_pickup">("centre");
  const [customerName, setCustomerName] = useState("Amadou Seyni");
  const [customerPhone, setCustomerPhone] = useState("🇳🇪 +227 90 12 34 56");
  const [deliveryAddress, setDeliveryAddress] = useState("Quartier Plateau, Ministère des Finances, Niamey");
  const [deliveryNotes, setDeliveryNotes] = useState("Bureau 204, 2ème étage aile Ouest");
  const [scheduledOption, setScheduledOption] = useState<string>(
    jumuahStatus.isPauseActive ? "custom" : "asap"
  );
  const [customScheduledTime, setCustomScheduledTime] = useState<string>(
    jumuahStatus.isPauseActive ? "15:00" : "12:30"
  );
  const [cashChangeAmount, setCashChangeAmount] = useState<number | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [receiptProofAttached, setReceiptProofAttached] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<string>("Airtel Money");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("🇳🇪 +227 96 00 11 22");
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial district if passed
  useEffect(() => {
    if (initialDistrictName) {
      const match = NIAMEY_DISTRICTS_DATA.find(
        (d) => d.name.toLowerCase() === initialDistrictName.toLowerCase()
      );
      if (match) {
        setSelectedDistrictId(match.id);
        if (match.zone === "relais_gratuit") {
          setDeliveryZone("mosquee_pickup");
        } else if (match.zone === "centre") {
          setDeliveryZone("centre");
        } else {
          setDeliveryZone("peripherie");
        }
      }
    }
  }, [initialDistrictName]);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  // Card Mock Data
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvc, setCardCvc] = useState("742");

  if (!isOpen) return null;

  // Determine if night rate applies (>= 21h00)
  const currentHour = new Date().getHours();
  const isNightRate = currentHour >= 21 || (scheduledOption === "custom" && (customScheduledTime === "21:00" || customScheduledTime === "21:30"));

  // Find active district from dataset
  const activeDistrict = NIAMEY_DISTRICTS_DATA.find((d) => d.id === selectedDistrictId);

  // Calculate delivery fee according to official table
  const calculatedDeliveryFee =
    serviceMode === "takeaway" || deliveryZone === "mosquee_pickup"
      ? 0
      : deliveryZone === "centre"
      ? isNightRate ? 1500 : 1000
      : isNightRate ? 2000 : 1500;

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const d = NIAMEY_DISTRICTS_DATA.find((item) => item.id === districtId);
    if (d) {
      if (d.zone === "relais_gratuit") {
        setDeliveryZone("mosquee_pickup");
        setDeliveryAddress("Point de retrait : Grande Mosquée Kadhafi (Avenue de l'Islam)");
      } else {
        setDeliveryZone(d.zone);
        setDeliveryAddress(`Quartier ${d.name}, Niamey`);
      }
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = calculatedDeliveryFee;
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
        deliveryAddress:
          serviceMode === "takeaway" || deliveryZone === "mosquee_pickup"
            ? "Point de retrait : Grande Mosquée Mouhamar Kadhafi (Avenue de l'Islam)"
            : deliveryAddress,
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
        paymentStatus: paymentMethod === "cash" ? "pending" : (receiptProofAttached ? "paid" : "pending"),
        orderStatus: "received",
        estimatedDeliveryTime:
          scheduledOption === "asap"
            ? serviceMode === "takeaway" || deliveryZone === "mosquee_pickup"
              ? "20-30 min"
              : "45-60 min"
            : `Prévue pour ${finalScheduledTime}`,
        scheduledTime: finalScheduledTime,
        deliveryPartner: "Billo Express 🏍️",
        cashChangeAmount: paymentMethod === "cash" ? cashChangeAmount : undefined,
        paymentReference: paymentReference ? paymentReference.trim() : undefined,
        receiptProofAttached,
        courierName: serviceMode === "delivery" && deliveryZone !== "mosquee_pickup" ? "Ibrahim Oumarou (Billo Express)" : undefined,
        courierPhone: serviceMode === "delivery" && deliveryZone !== "mosquee_pickup" ? "+227 92 08 08 22" : undefined,
      };

      if (notifyWhatsApp) {
        const message = generateWhatsAppOrderConfirmation(newOrder, currentLanguage);
        const waText = encodeURIComponent(message);
        window.open(`https://wa.me/22770032552?text=${waText}`, "_blank");
      }

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
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Moment de livraison souhaité</span>
              </h4>
              <span className="text-[10px] text-amber-400 font-bold">
                🕌 Règle Vendredi : Pause 11h-15h
              </span>
            </div>

            {jumuahStatus.isPauseActive && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <span className="text-base">🕌</span>
                <div>
                  <p className="font-bold text-amber-300">
                    Pause Prière du Jumu&apos;ah en cours (11h00 - 15h00)
                  </p>
                  <p className="text-[11px] text-amber-200/90 mt-0.5">
                    Les livraisons immédiates sont suspendues pour respecter la grande prière du vendredi. Vous pouvez programmer votre commande pour une livraison dès <strong>15h00</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                disabled={jumuahStatus.isPauseActive}
                onClick={() => setScheduledOption("asap")}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  jumuahStatus.isPauseActive
                    ? "opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500"
                    : scheduledOption === "asap"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold cursor-pointer"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                }`}
              >
                <span className="block font-bold">
                  {jumuahStatus.isPauseActive ? "⏸️ Pause Jumu'ah" : "⚡ Dès que possible"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {jumuahStatus.isPauseActive ? "Reprise à 15h00" : "Livraison en 45 à 60 mn"}
                </span>
              </button>

              <button
                type="button"
                disabled={jumuahStatus.isPauseActive}
                onClick={() => setScheduledOption("12:30")}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  jumuahStatus.isPauseActive
                    ? "opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500"
                    : scheduledOption === "12:30"
                    ? "bg-orange-500/20 border-orange-500 text-white font-bold cursor-pointer"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                }`}
              >
                <span className="block font-bold">🍱 Midi au Bureau (12h30)</span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {jumuahStatus.isPauseActive ? "Fermé le Vendredi midi" : "Idéal fonctionnaires & salariés"}
                </span>
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
                <span className="block font-bold">🕒 Choisir l&apos;heure</span>
                <span className="text-[10px] text-slate-400">
                  {jumuahStatus.isPauseActive ? "Créneaux dès 15h00" : "Précommande programmée"}
                </span>
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
                  {jumuahStatus.isPauseActive || jumuahStatus.isFriday ? (
                    <>
                      <option value="15:00">15h00 (Reprise après Jumu'ah)</option>
                      <option value="15:30">15h30</option>
                      <option value="16:00">16h00</option>
                      <option value="16:30">16h30</option>
                      <option value="17:00">17h00</option>
                      <option value="18:00">18h00</option>
                      <option value="19:00">19h00 (Dîner)</option>
                      <option value="19:30">19h30 (Dîner)</option>
                      <option value="20:00">20h00 (Dîner)</option>
                      <option value="20:30">20h30 (Dîner)</option>
                      <option value="21:00">21h00</option>
                    </>
                  ) : (
                    <>
                      <option value="11:45">11h45</option>
                      <option value="12:00">12h00</option>
                      <option value="12:15">12h15</option>
                      <option value="12:30">12h30</option>
                      <option value="12:45">12h45</option>
                      <option value="13:00">13h00</option>
                      <option value="13:30">13h30</option>
                      <option value="15:00">15h00</option>
                      <option value="19:30">19h30 (Dîner)</option>
                      <option value="20:00">20h00 (Dîner)</option>
                      <option value="20:30">20h30 (Dîner)</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

            {/* 2. Zone de Livraison & Calculateur Automatique de Quartier */}
            {serviceMode === "delivery" && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-orange-400" />
                    <span>Quartier &amp; Calculateur de Frais Niamey</span>
                  </span>
                  {isNightRate && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                      🌙 Tarif de nuit (&ge; 21h00)
                    </span>
                  )}
                </div>

                {/* District Selector Dropdown + Direct Directory Trigger */}
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <select
                        value={selectedDistrictId}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <optgroup label="📍 Centre-ville (1 000 F / 1 500 F nuit)">
                          {NIAMEY_DISTRICTS_DATA.filter((d) => d.zone === "centre").map((d) => (
                            <option key={d.id} value={d.id}>
                              📍 {d.name} ({d.commune})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🗺️ Périphérie & Rive Droite (1 500 F / 2 000 F nuit)">
                          {NIAMEY_DISTRICTS_DATA.filter((d) => d.zone === "peripherie").map((d) => (
                            <option key={d.id} value={d.id}>
                              🗺️ {d.name} ({d.commune})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🕌 Point de Retrait Offert (0 FCFA)">
                          {NIAMEY_DISTRICTS_DATA.filter((d) => d.zone === "relais_gratuit").map((d) => (
                            <option key={d.id} value={d.id}>
                              🕌 {d.name} (0 FCFA)
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {onOpenDistrictsDirectory && (
                      <button
                        type="button"
                        onClick={onOpenDistrictsDirectory}
                        className="px-3 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-400 text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Ouvrir le répertoire complet des quartiers"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Répertoire 50+</span>
                      </button>
                    )}
                  </div>

                  {/* Active District Info Pill */}
                  {activeDistrict && (
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-[11px]">{activeDistrict.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-slate-800 text-slate-300">
                            {activeDistrict.commune}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Délai estimé : <strong>{activeDistrict.estimatedDeliveryTime}</strong> &bull; Flotte <strong>Billo Express</strong>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-orange-400 block">
                          {calculatedDeliveryFee === 0 ? "0 FCFA" : `${calculatedDeliveryFee.toLocaleString()} FCFA`}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {isNightRate ? "Tarif Nuit (≥21h)" : "Tarif Jour (<21h)"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Landmark quick suggestions */}
                  {activeDistrict?.landmarks && activeDistrict.landmarks.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 block">
                        Repères à proximité (cliquez pour ajouter aux précisions) :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {activeDistrict.landmarks.map((lm, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setDeliveryNotes((prev) => (prev ? `${prev}, Près de ${lm}` : `Près de ${lm}`));
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] border border-slate-800 hover:border-orange-500/40 transition cursor-pointer"
                          >
                            + {lm}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Quick Zone Tabs for manual override */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryZone("centre");
                      const firstCentre = NIAMEY_DISTRICTS_DATA.find((d) => d.zone === "centre");
                      if (firstCentre) setSelectedDistrictId(firstCentre.id);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition cursor-pointer ${
                      deliveryZone === "centre"
                        ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">📍 Centre-ville</span>
                    <span className="text-[10px] text-slate-400">Plateau, Yantala, Terminus...</span>
                    <span className="text-orange-400 font-extrabold text-[11px] block mt-0.5">
                      {isNightRate ? "1 500 FCFA" : "1 000 FCFA"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryZone("peripherie");
                      const firstPeripherie = NIAMEY_DISTRICTS_DATA.find((d) => d.zone === "peripherie");
                      if (firstPeripherie) setSelectedDistrictId(firstPeripherie.id);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition cursor-pointer ${
                      deliveryZone === "peripherie"
                        ? "bg-orange-500/20 border-orange-500 text-white font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">🗺️ Périphérie</span>
                    <span className="text-[10px] text-slate-400">Koira Kano, Harobanda, Goudel...</span>
                    <span className="text-orange-400 font-extrabold text-[11px] block mt-0.5">
                      {isNightRate ? "2 000 FCFA" : "1 500 FCFA"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryZone("mosquee_pickup");
                      setSelectedDistrictId("grande-mosquee-kadhafi");
                      setDeliveryAddress("Point de retrait : Grande Mosquée Kadhafi (Avenue de l'Islam)");
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition cursor-pointer ${
                      deliveryZone === "mosquee_pickup"
                        ? "bg-emerald-500/20 border-emerald-500 text-white font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">🕌 Retrait Gratuit</span>
                    <span className="text-[10px] text-slate-400">Grande Mosquée Kadhafi</span>
                    <span className="text-emerald-400 font-extrabold text-[11px] block mt-0.5">
                      0 FCFA (Offert)
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Coordonnées & Livraison */}
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
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mode de Règlement Sécurisé au Niger</span>
              </h4>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                6 Modes Disponibles
              </span>
            </div>

            {/* 6 Payment Cards in Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LOCAL_PAYMENT_METHODS.map((method, idx) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/15 ring-1 ring-orange-500/50"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white">{method.name}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                      )}
                    </div>
                    {method.depositNumber && (
                      <span className="text-[11px] text-orange-400/90 font-mono font-bold truncate">
                        {method.depositNumber}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {method.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Validation Notice for Mobile Agency Deposits */}
            {["mynita", "amanata", "al_izza_business", "zeyna", "mobile_money"].includes(paymentMethod) && (
              <div className="p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-500 flex items-start gap-3.5 text-xs text-amber-200 shadow-xl shadow-amber-950/40">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <span className="font-black text-amber-300 text-sm block tracking-wide">
                    ⚠️ RÈGLE IMPORTANTE DE VALIDATION :
                  </span>
                  <p className="text-xs leading-relaxed text-amber-100 font-medium">
                    Ce n&apos;est <strong>qu&apos;après paiement par dépôt et envoi du reçu ou capture du reçu</strong> que la commande sera confirmée et passée en cuisine.
                  </p>
                  <p className="text-[11px] text-amber-300/90">
                    💡 <em>Effectuez votre dépôt vers le numéro indiqué ci-dessous, puis transmettez le reçu par WhatsApp ou joignez-le directement.</em>
                  </p>
                </div>
              </div>
            )}

            {/* Detail Box: 1. En espèces à la livraison */}
            {paymentMethod === "cash" && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p>
                    Total à régler en <strong>espèces</strong> au livreur Billo Express à la livraison : <strong>{grandTotal.toLocaleString()} FCFA</strong>.
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

            {/* Detail Box: 2. Mynita */}
            {paymentMethod === "mynita" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-orange-950/20 border border-orange-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black">
                        Dépôt Mynita
                      </span>
                      <span className="text-xs font-bold text-white">Allôresto Compte Mynita</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Effectuez un dépôt direct ou transfert Mynita du montant exact : <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Numéro officiel de dépôt Mynita :</span>
                    <span className="text-sm font-black text-orange-400 font-mono">+227 90 40 51 18</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("+227 90 40 51 18")}
                    className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedNumber === "+227 90 40 51 18" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Référence de transaction Mynita ou nom de l'expéditeur :
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: MYN-884210 ou Nom de l'expéditeur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Detail Box: 3. Amanata */}
            {paymentMethod === "amanata" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-950/20 border border-cyan-500/40 space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black">
                      Dépôt Amanata
                    </span>
                    <span className="text-xs font-bold text-white">Allôresto Compte Amanata</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Envoyez votre dépôt / transfert Amanata d'un montant de <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Numéro officiel de dépôt Amanata :</span>
                    <span className="text-sm font-black text-cyan-400 font-mono">+227 90 40 51 18</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("+227 90 40 51 18")}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedNumber === "+227 90 40 51 18" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Code de retrait / Référence SMS Amanata :
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: AMA-902143 ou Numéro téléphone expéditeur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Detail Box: 4. All-Iza Business */}
            {paymentMethod === "al_izza_business" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/20 border border-emerald-500/40 space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                      All-Iza Business
                    </span>
                    <span className="text-xs font-bold text-white">Compte Marchand All-Iza</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Réglez par dépôt ou virement All-Iza Business : <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Numéro de dépôt All-Iza Business :</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">+227 90 40 51 18</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("+227 90 40 51 18")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedNumber === "+227 90 40 51 18" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Référence de validation All-Iza Business :
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: IZZ-BUS-1102"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Detail Box: 5. Zeyna */}
            {paymentMethod === "zeyna" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950/20 border border-purple-500/40 space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black">
                      Dépôt Zeyna
                    </span>
                    <span className="text-xs font-bold text-white">Allôresto Compte Zeyna</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Effectuez votre dépôt direct Zeyna du montant de <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Numéro officiel de dépôt Zeyna :</span>
                    <span className="text-sm font-black text-purple-400 font-mono">+227 90 40 51 18</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("+227 90 40 51 18")}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedNumber === "+227 90 40 51 18" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Code SMS / Référence Zeyna :
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: ZEY-44210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Detail Box: 6. Airtel Money Niger */}
            {paymentMethod === "mobile_money" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-red-950/20 border border-red-500/40 space-y-3 animate-in fade-in">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black">
                      Airtel Money Niger
                    </span>
                    <span className="text-xs font-bold text-white">Allôresto Compte Airtel Money</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Effectuez votre transfert ou dépôt Airtel Money Niger : <strong>{grandTotal.toLocaleString()} FCFA</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Numéro officiel Airtel Money Niger :</span>
                    <span className="text-sm font-black text-red-400 font-mono">+227 96 05 23 10</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber("+227 96 05 23 10")}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold border border-red-500/30 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedNumber === "+227 96 05 23 10" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Référence SMS de transaction ou votre numéro Airtel :
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Ex: AIR-88319 ou +227 96 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Simulated Receipt Capture Attachment Option */}
            {["mynita", "amanata", "al_izza_business", "zeyna", "mobile_money"].includes(paymentMethod) && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">📸</span>
                  <div>
                    <span className="font-bold text-white block">Capture d'écran du reçu de dépôt</span>
                    <span className="text-[10px] text-slate-400">
                      {receiptProofAttached ? "✅ Reçu prêt à être transmis avec la commande" : "Joindre pour validation immédiate en cuisine"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setReceiptProofAttached(!receiptProofAttached)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition ${
                      receiptProofAttached
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {receiptProofAttached ? "✓ Reçu joint" : "Ajouter capture"}
                  </button>
                  <a
                    href="https://wa.me/22770032552?text=Bonjour%20Allôresto,%20je%20vous%20transmets%20la%20capture%20de%20mon%20dépôt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
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

