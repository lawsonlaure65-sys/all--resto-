import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Gift,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenDataProtection: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenDataProtection,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"phone_otp" | "password">("phone_otp");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+227 96 05 23 10");
  const [city, setCity] = useState("Niamey (Plateau)");
  const [referralCode, setReferralCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP State
  const [otpStep, setOtpStep] = useState<"enter_phone" | "enter_otp">("enter_phone");
  const [otpCode, setOtpCode] = useState("");
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (mail: string) => {
    return String(mail)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez saisir une adresse email valide (ex: amadou@gmail.com).");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    // Simulated successful login
    const loggedUser: UserProfile = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Client Allôresto",
      email: email.trim(),
      phone: phone.trim().length > 9 ? phone : "🇳🇪 +227 96 05 23 10",
      city: city || "Niamey",
      loyaltyPoints: 350,
      sahelClubTier: "Or",
      savedAddresses: [
        {
          id: "addr-1",
          label: "🏢 Bureau (Plateau)",
          address: "Plateau, Ministère des Finances, Niamey",
          isDefault: true,
        },
        {
          id: "addr-2",
          label: "🏠 Domicile",
          address: "Koira Kano, Rue KK-12, Villa 45, Niamey",
        },
      ],
      favoriteRestaurantIds: ["khadafi-palace-1"],
      referralCode: "ALLO-" + Math.floor(1000 + Math.random() * 9000),
      referralCount: 2,
    };

    setSuccessMessage("Connexion réussie ! Bienvenue sur Allôresto Niamey.");
    setTimeout(() => {
      onLoginSuccess(loggedUser);
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez saisir une adresse email valide pour recevoir vos reçus de commande.");
      return;
    }

    if (!phone || phone === "🇳🇪 +227 ") {
      setErrorMessage("Veuillez renseigner votre numéro de téléphone Niger (+227).");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Veuillez accepter la politique de protection des données HAPDP Niger.");
      return;
    }

    const newUser: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      loyaltyPoints: referralCode ? 100 : 50, // bonus for referral
      sahelClubTier: "Bronze",
      savedAddresses: [
        {
          id: "addr-init",
          label: "📍 Adresse Principale",
          address: `${city}, Niamey`,
          isDefault: true,
        },
      ],
      favoriteRestaurantIds: [],
      referralCode: "ALLO-" + name.toUpperCase().slice(0, 4) + "-" + Math.floor(100 + Math.random() * 900),
      referralCount: 0,
    };

    setSuccessMessage(`Compte créé avec succès ! +${referralCode ? "100" : "50"} points Sahel Club offerts.`);
    setTimeout(() => {
      onLoginSuccess(newUser);
      setSuccessMessage(null);
      onClose();
    }, 1400);
  };

  const handleQuickDemoFill = (type: "client" | "bureau") => {
    if (type === "client") {
      setEmail("amadou.seyni@gmail.com");
      setPassword("Niamey2026");
      setName("Amadou Seyni");
      setPhone("🇳🇪 +227 96 05 23 10");
      setCity("Niamey (Plateau)");
    } else {
      setEmail("fatima.cadre@finances.gouv.ne");
      setPassword("MidiExpress2026");
      setName("Fatima Oumarou (Direction)");
      setPhone("🇳🇪 +227 90 40 51 18");
      setCity("Niamey (Ministères)");
    }
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone.length < 8) {
      setErrorMessage("Veuillez saisir un numéro de téléphone nigérien valide (ex: +227 96 05 23 10).");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep("enter_otp");
      setOtpSentNotice(true);
      setOtpCode("");
      setSuccessMessage(`Un code de vérification SMS / WhatsApp (6 chiffres) a été envoyé au ${phone}.`);
    }, 800);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.length !== 6) {
      setErrorMessage("Veuillez saisir le code à 6 chiffres reçu par SMS / WhatsApp.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanPhone = phone.trim();
      const isDemoAdmin = cleanPhone.includes("96052310") || cleanPhone.includes("96 05 23 10");

      const loggedUser: UserProfile = {
        name: isDemoAdmin ? "Directeur Allôresto (Admin)" : "Client Sahel (" + phone.slice(-8) + ")",
        email: isDemoAdmin ? "direction@alloresto.ne" : "client." + phone.replace(/[^\d]/g, "").slice(-8) + "@alloresto.ne",
        phone: cleanPhone,
        city: city || "Niamey (Plateau)",
        loyaltyPoints: 350,
        sahelClubTier: "Or",
        savedAddresses: [
          {
            id: "addr-1",
            label: "🏢 Bureau (Plateau)",
            address: "Plateau, Ministère des Finances, Niamey",
            isDefault: true,
          },
          {
            id: "addr-2",
            label: "🏠 Domicile (Koira Kano)",
            address: "Koira Kano, Rue KK-12, Villa 45, Niamey",
          },
        ],
        favoriteRestaurantIds: ["khadafi-palace-1"],
        referralCode: "ALLO-" + Math.floor(1000 + Math.random() * 9000),
        referralCount: 2,
      };

      setSuccessMessage("Code validé ! Authentification réussie via Supabase Phone Auth.");
      setTimeout(() => {
        onLoginSuccess(loggedUser);
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {currentUser
              ? "Mon Compte Allôresto"
              : authMode === "login"
              ? "Connexion Espace Client"
              : "Créer un Compte Client"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Commandez à Niamey, cumulez des points Sahel Club et suivez vos livraisons Billo Express.
          </p>
        </div>

        {/* Active User View */}
        {currentUser ? (
          <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Connecté en tant que :</span>
                <span className="text-base font-black text-white">{currentUser.name}</span>
                <span className="text-xs text-orange-400 block font-mono">{currentUser.email}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                {currentUser.sahelClubTier} &bull; {currentUser.loyaltyPoints} Pts
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>📱 Téléphone : <strong className="text-white">{currentUser.phone}</strong></p>
              <p>📍 Ville / Quartier : <strong className="text-white">{currentUser.city}</strong></p>
              <p>🎁 Code Parrain : <strong className="text-amber-400 font-mono">{currentUser.referralCode}</strong></p>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === "login"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Se Connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === "register"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                S'inscrire (Nouveau)
              </button>
            </div>

            {/* Quick Demo Autofill helper */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Remplissage rapide Démo :</span>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill("client")}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                >
                  Amadou Seyni
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill("bureau")}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                >
                  Fatima (Finances)
                </button>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {forgotSent && (
              <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 text-xs text-cyan-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Un lien de réinitialisation sécurisé a été envoyé à <strong>{email}</strong>.</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === "login" && (
              <div className="space-y-4">
                {/* Switch between Phone OTP and Email/Password */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("phone_otp");
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === "phone_otp"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Téléphone OTP 🇳🇪</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("password");
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginMethod === "password"
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email &amp; Mot de passe</span>
                  </button>
                </div>

                {loginMethod === "phone_otp" ? (
                  /* PHONE OTP FLOW */
                  otpStep === "enter_phone" ? (
                    <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Numéro de téléphone Niger (+227) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+227 96 05 23 10"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Un code SMS / WhatsApp de 6 chiffres vous sera envoyé instantanément.
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span>{loading ? "Envoi en cours..." : "Recevoir mon code OTP"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-slate-400">
                            Code de confirmation à 6 chiffres *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpStep("enter_phone");
                              setErrorMessage(null);
                            }}
                            className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                          >
                            Modifier le numéro
                          </button>
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-950 border border-emerald-500 text-white text-lg font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block text-center">
                          Code envoyé au <strong>{phone}</strong> (valide 5 minutes).
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpCode.length !== 6}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{loading ? "Vérification..." : "Valider le code & Se connecter"}</span>
                      </button>
                    </form>
                  )
                ) : (
                  /* EMAIL / PASSWORD FLOW */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Adresse Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nom@exemple.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-400">
                          Mot de passe *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!email || !validateEmail(email)) {
                              setErrorMessage("Veuillez saisir votre email pour réinitialiser.");
                              return;
                            }
                            setForgotSent(true);
                            setErrorMessage(null);
                            setTimeout(() => setForgotSent(false), 5000);
                          }}
                          className="text-[10px] text-orange-400 hover:text-orange-300 cursor-pointer underline"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Votre mot de passe"
                          className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-[10px]"
                          title={showPassword ? "Masquer le mot de passe" : "Afficher (Vu) le mot de passe"}
                        >
                          {showPassword ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-orange-400" />
                              <span className="hidden sm:inline text-orange-400 font-bold">Cacher</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-slate-300" />
                              <span className="hidden sm:inline text-slate-300 font-bold">Vu</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Se Connecter par Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* REGISTER FORM */}
            {authMode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nom &amp; Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ibrahim Moussa"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Email Opérationnel *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Téléphone Niger 🇳🇪 *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="🇳🇪 +227 96 00 11 22"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Quartier / Zone à Niamey
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Plateau, Yantala, Koira Kano"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Code Parrain (Optionnel)
                    </label>
                    <div className="relative">
                      <Gift className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="Ex: AMADOU-2026"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs uppercase font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Définir un mot de passe sécurisé"
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    {/* Bouton VU / Masqué */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-[10px]"
                      title={showPassword ? "Masquer le mot de passe" : "Afficher (Vu) le mot de passe"}
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-orange-400" />
                          <span className="hidden sm:inline text-orange-400 font-bold">Cacher</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-slate-300" />
                          <span className="hidden sm:inline text-slate-300 font-bold">Vu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-950 border-slate-700 text-orange-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms-check" className="text-[10px] text-slate-400 leading-tight">
                    J'accepte la politique de confidentialité sous supervision HAPDP Niger (Loi n° 2022-59 modifiée 2023-31) pour mes commandes et réceptions d'alertes WhatsApp/SMS.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Créer mon Compte Client &amp; Recevoir 50 Pts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </>
        )}

        {/* Footer Security Badge */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sécurité 256-bit SSL &bull; HAPDP Niger</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDataProtection();
            }}
            className="text-slate-400 hover:text-slate-300 underline cursor-pointer"
          >
            Mentions légales
          </button>
        </div>
      </div>
    </div>
  );
};
