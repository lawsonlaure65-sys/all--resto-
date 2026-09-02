import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Bike,
  Phone,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  MapPin,
  Lock,
  Sparkles,
  AlertCircle,
  Clock,
  Radio,
} from "lucide-react";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { DriverProfile } from "../types";
import { verifyDriverLogin, DEFAULT_DRIVERS } from "../services/supabaseDriverService";
import { playCourierHandoverSound } from "../services/kitchenAudioService";

interface DriverLoginScreenProps {
  onLoginSuccess: (driver: DriverProfile) => void;
  onExitToClient: () => void;
}

export const DriverLoginScreen: React.FC<DriverLoginScreenProps> = ({
  onLoginSuccess,
  onExitToClient,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("+227 99 00 00 00");
  const [pinCode, setPinCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMsg("Veuillez saisir votre numéro de téléphone de livreur.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const driver = await verifyDriverLogin(phoneNumber);
      if (driver) {
        playCourierHandoverSound();
        onLoginSuccess(driver);
      } else {
        // Fallback: create a session for this phone number
        const tempDriver: DriverProfile = {
          id: `driver-${Date.now()}`,
          fullName: "Livreur Billo Express",
          phone: phoneNumber,
          motoPlate: "RN-2024-X",
          vehicle: "Moto 125cc",
          status: "available",
          currentZone: "Niamey Plateau & Ville",
          rating: 5.0,
          completedDeliveries: 12,
        };
        playCourierHandoverSound();
        onLoginSuccess(tempDriver);
      }
    } catch (err) {
      setErrorMsg("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (driver: DriverProfile) => {
    playCourierHandoverSound();
    onLoginSuccess(driver);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-orange-500"></div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
            <BilloExpressLogo variant="full" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Espace Livreur &bull; Billo Express Niamey
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Plateforme opérationnelle de prise en charge et livraison des commandes Allôresto au Niger.
            </p>
          </div>
        </div>

        {/* Quick Driver Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connexion Rapide Coursier (1-Clic) :</span>
            </label>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              ● En service
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEFAULT_DRIVERS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleQuickLogin(d)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20 text-left transition-all flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={d.avatar}
                  alt={d.fullName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-cyan-400 transition"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {d.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{d.motoPlate} &bull; {d.phone}</p>
                  <p className="text-[10px] text-cyan-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{d.currentZone}</span>
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-bold uppercase">
            ou connexion par numéro
          </span>
        </div>

        {/* Manual Phone Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Numéro de téléphone Niamey :
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+227 99 00 00 00"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Code PIN / Mot de passe :
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="•••• (Optionnel pour test)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            {isLoading ? (
              <span>Vérification...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Se Connecter comme Livreur</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={onExitToClient}
            className="hover:text-white transition cursor-pointer"
          >
            ← Retour à l&apos;application cliente
          </button>

          <span className="text-[11px] text-cyan-400 font-semibold">
            Test : +227 99 00 00 00 (Issoufou Moussa)
          </span>
        </div>
      </motion.div>
    </div>
  );
};
