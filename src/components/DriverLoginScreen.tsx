import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Bike,
  Phone,
  ShieldCheck,
  UserCheck,
  Lock,
  AlertCircle,
  Mail,
  Loader2,
} from "lucide-react";
import { BilloExpressLogo } from "./BilloExpressLogo";
import { DriverProfile } from "../types";
import { supabase } from "../lib/supabase";
import { playCourierHandoverSound } from "../services/kitchenAudioService";

interface DriverLoginScreenProps {
  onLoginSuccess: (driver: DriverProfile) => void;
  onExitToClient: () => void;
}

export const DriverLoginScreen: React.FC<DriverLoginScreenProps> = ({
  onLoginSuccess,
  onExitToClient,
}) => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDriverLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginIdentifier.trim();
    if (!identifier) {
      setErrorMsg("Veuillez saisir votre identifiant (email ou téléphone).");
      return;
    }
    if (!password) {
      setErrorMsg("Veuillez saisir votre mot de passe.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Tenter la connexion officielle Supabase Auth
      const isEmail = identifier.includes("@");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword(
        isEmail
          ? { email: identifier.toLowerCase(), password }
          : { phone: identifier.replace(/[^\d+]/g, ""), password }
      );

      if (!authError && authData.user) {
        // Vérifier le rôle dans public.profiles
        const { data: profile, error: profileErr } = await (supabase.from("profiles") as any)
          .select("role, is_active, full_name, phone")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profileErr) {
          setErrorMsg("Impossible de vérifier vos autorisations. Réessayez.");
          return;
        }

        if (profile?.is_active === false) {
          setErrorMsg("Compte désactivé. Veuillez contacter la Direction Allôresto.");
          return;
        }

        const role = profile?.role;
        if (role === "driver") {
          const driver: DriverProfile = {
            id: authData.user.id,
            fullName: profile.full_name || "Coursier Billo Express",
            phone: profile.phone || authData.user.phone || identifier,
            motoPlate: "Billo Express 227",
            vehicle: "Moto de livraison",
            status: "available",
            currentZone: "Niamey & Agglomération",
            rating: 5.0,
            completedDeliveries: 0,
          };
          playCourierHandoverSound();
          onLoginSuccess(driver);
          return;
        } else if (role === "admin") {
          // La Direction a un accès complet de supervision
          const adminDriver: DriverProfile = {
            id: authData.user.id,
            fullName: profile?.full_name ? `${profile.full_name} (Direction HQ)` : "Direction Allôresto HQ",
            phone: authData.user.email || identifier,
            motoPlate: "Direction HQ",
            vehicle: "Supervision Flotte",
            status: "available",
            currentZone: "Tous secteurs Niamey",
            rating: 5.0,
            completedDeliveries: 0,
          };
          playCourierHandoverSound();
          onLoginSuccess(adminDriver);
          return;
        } else {
          // Client ou rôle non autorisé : REFUS STRICT
          setErrorMsg(
            "Accès refusé : ce compte possède le rôle 'Client'. L'espace coursier Billo Express est strictement réservé aux livreurs agréés et à la Direction."
          );
          await supabase.auth.signOut();
          return;
        }
      }

      setErrorMsg(
        authError?.message === "Invalid login credentials"
          ? "Identifiant ou mot de passe incorrect."
          : authError?.message || "Identifiants de coursier invalides."
      );
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur lors de la tentative de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner inline-block">
            <BilloExpressLogo variant="full" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Espace Livreur &bull; Billo Express Niamey
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Portail opérationnel sécurisé de prise en charge et livraison des commandes Allôresto.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-[11px] leading-snug">
            Accès protégé par Supabase Auth. Réservé aux coursiers partenaires agréés et à la Direction Allôresto.
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleDriverLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email ou Téléphone Coursier *</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isLoading}
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="coursier@alloresto.ne ou +227 9X XX XX XX"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mot de passe confidentiel *</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification des droits livreur...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Se Connecter à l&apos;Espace Coursier</span>
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
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RLS Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
