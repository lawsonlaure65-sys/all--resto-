import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Phone,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PAYMENT_PROVIDERS, processPayment, PaymentRecord } from "../services/paymentService";
import { PaymentQRCode } from "./PaymentQRCode";
import { QrCode } from "lucide-react";

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  customerPhone?: string;
  restaurantName?: string;
  restaurantPhone?: string;
  restaurantId?: string;
  onPaymentSuccess: (payment: PaymentRecord) => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  amount,
  customerPhone = "",
  restaurantName = "Restaurant Allôresto",
  restaurantPhone = "+227 90 88 77 66",
  restaurantId = "alloresto-resto",
  onPaymentSuccess,
}) => {
  const [activeMethodTab, setActiveMethodTab] = useState<"push" | "qrcode">("push");
  const [selectedProvider, setSelectedProvider] = useState<string>("airtel_money");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    customerPhone.replace(/[^0-9+]/g, "") || "+227 96 12 34 56"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [paymentSuccessData, setPaymentSuccessData] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedProvider) {
      setError("Veuillez sélectionner un moyen de paiement.");
      return;
    }

    if (!phoneNumber || phoneNumber.replace(/\s+/g, "").length < 8) {
      setError("Veuillez entrer un numéro de téléphone valide (ex: +227 96 XX XX XX).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await processPayment({
        orderId,
        amount,
        paymentMethod: selectedProvider,
        phoneNumber,
      });

      if (result.success && result.payment) {
        setPaymentSuccessData(result.payment);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          onPaymentSuccess(result.payment!);
        }, 1800);
      } else {
        setError(result.error || "Erreur lors de la confirmation du paiement.");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const selectedProviderObj = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              💳
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Paiement Mobile Money</h2>
              <p className="text-xs text-orange-100 font-medium">
                Paiement instantané sécurisé au Niger 🇳🇪
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Succès */}
          {paymentSuccessData ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">✅ Paiement Réussi !</h3>
              <p className="text-xs text-emerald-200">
                Votre transaction de{" "}
                <strong className="text-white text-sm">
                  {amount.toLocaleString()} FCFA
                </strong>{" "}
                a été validée avec succès.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-300">
                Réf: {paymentSuccessData.transaction_id}
              </div>
              <p className="text-[11px] text-slate-400">
                Votre commande passe en cuisine immédiatement 🍳
              </p>
            </motion.div>
          ) : (
            <>
              {/* Résumé de la commande */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    COMMANDE {orderId || "#CMD-DIRECT"}
                  </span>
                  <span className="text-xs text-slate-300">{restaurantName}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-orange-400">
                    {amount.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Mode Switcher: Push Mobile Money vs Scanner QR Code */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveMethodTab("push")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeMethodTab === "push"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <span>Push Mobile Money</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMethodTab("qrcode")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeMethodTab === "qrcode"
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-300" />
                  <span>Scanner QR Code</span>
                </button>
              </div>

              {activeMethodTab === "qrcode" ? (
                <div className="space-y-4">
                  <PaymentQRCode
                    restaurantId={restaurantId}
                    restaurantName={restaurantName}
                    restaurantPhone={restaurantPhone}
                    amount={amount}
                    initialProvider={selectedProvider}
                    orderReference={orderId}
                    customerPhone={phoneNumber}
                    onProviderChange={(p) => setSelectedProvider(p)}
                  />

                  {/* Bouton de confirmation après scan QR Code */}
                  <button
                    type="button"
                    onClick={() => {
                      const mockPayment: PaymentRecord = {
                        id: `pay-${Date.now().toString().slice(-8)}`,
                        transaction_id: `TXN-QR-${Date.now().toString().slice(-6)}`,
                        order_id: orderId || `CMD-${Date.now().toString().slice(-6)}`,
                        amount_xof: amount,
                        payment_method: selectedProvider,
                        phone_number: phoneNumber || "+227 96 05 23 10",
                        payment_status: "completed",
                        created_at: new Date().toISOString(),
                      };
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                      setPaymentSuccessData(mockPayment);
                      setTimeout(() => {
                        onPaymentSuccess(mockPayment);
                      }, 1800);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>J'ai effectué le paiement par QR Code / USSD</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paiement 100% sécurisé et instantané conforme BCEAO</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Sélection du Provider (8 Opérateurs) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-orange-400" />
                      <span>Choisissez votre moyen de paiement (8 opérateurs) :</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      {PAYMENT_PROVIDERS.map((provider) => {
                        const isSelected = selectedProvider === provider.id;
                        return (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => {
                              setSelectedProvider(provider.id);
                              setError("");
                            }}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-500 ring-2 ring-orange-500/40 text-white shadow-lg"
                                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center text-lg shrink-0 shadow-md`}
                            >
                              {provider.logo}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">{provider.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{provider.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Champ Téléphone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>Numéro de compte Mobile Money Niger :</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+227 96 XX XX XX"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-orange-500 transition shadow-inner"
                      />
                      {selectedProviderObj?.ussdCode && (
                        <span className="absolute right-3 top-3 text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {selectedProviderObj.ussdCode}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Numéro associé à votre compte {selectedProviderObj?.name || "Mobile Money"}.
                      {selectedProviderObj?.accountNumber && (
                        <>
                          {" "}
                          Compte marchand Allôresto :{" "}
                          <strong className="text-orange-400 font-mono">
                            {selectedProviderObj.accountNumber}
                          </strong>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Erreur */}
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Bouton de paiement */}
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading || !selectedProvider || !phoneNumber}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Payer {amount.toLocaleString()} FCFA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Paiement 100% sécurisé et instantané conforme BCEAO</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
