import React, { useState } from "react";
import {
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  Sparkles,
  User,
  Store,
  Bike,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Check,
  Users,
  Award,
  Database,
  ChefHat,
  BookOpen,
  Phone,
  Compass,
  Layers,
  HelpCircle,
  Clock,
  Volume2,
  VolumeX,
  Package,
  Calendar,
  MessageSquare,
  TrendingUp,
  Mic,
  Info,
  CreditCard,
  FileText,
} from "lucide-react";
import { UserRole, ServiceMode, CityOption, UserProfile, AppLanguage } from "../types";
import { CITIES_DATA, ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { BrandLogo } from "./BrandLogo";
import { SUPPORTED_LANGUAGES, t } from "../utils/translations";

interface HeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  serviceMode: ServiceMode;
  onChangeServiceMode: (mode: ServiceMode) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenChefAI: () => void;
  onOpenVoiceOrder?: () => void;
  onOpenPartnerModal: () => void;
  onOpenGroupOrder: () => void;
  onOpenAccount: () => void;
  onOpenAuth?: () => void;
  currentUser?: UserProfile | null;
  onOpenTechPack: () => void;
  onOpenCatering?: () => void;
  onOpenBlog?: () => void;
  onOpenContact?: () => void;
  onOpenDistrictsDirectory?: () => void;
  onOpenLogoModal?: () => void;
  onOpenMenu?: () => void;
  onOpenOrdersHistory?: () => void;
  onOpenSauceBoxes?: () => void;
  onOpenMarketingAI?: () => void;
  onOpenWhatsAppAutomation?: () => void;
  onOpenFaq?: () => void;
  onOpenHowItWorks?: () => void;
  onOpenPlans?: () => void;
  onOpenContract?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  currentLanguage?: AppLanguage;
  onChangeLanguage?: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  selectedCity,
  onSelectCity,
  serviceMode,
  onChangeServiceMode,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenChefAI,
  onOpenVoiceOrder,
  onOpenPartnerModal,
  onOpenGroupOrder,
  onOpenAccount,
  onOpenAuth,
  currentUser,
  onOpenTechPack,
  onOpenCatering,
  onOpenBlog,
  onOpenContact,
  onOpenDistrictsDirectory,
  onOpenLogoModal,
  onOpenMenu,
  onOpenOrdersHistory,
  onOpenSauceBoxes,
  onOpenMarketingAI,
  onOpenWhatsAppAutomation,
  onOpenFaq,
  onOpenHowItWorks,
  onOpenPlans,
  onOpenContract,
  soundEnabled = true,
  onToggleSound,
  currentLanguage = "fr",
  onChangeLanguage,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          onSelectCity("Niamey (Position Actuelle)");
          setCityDropdownOpen(false);
        },
        () => {
          setIsLocating(false);
          setCityDropdownOpen(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      setCityDropdownOpen(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "client":
        return { label: "Espace Client", icon: User, color: "text-orange-400 bg-orange-950/60 border-orange-500/30" };
      case "restaurant":
        return { label: "Espace Restaurant", icon: Store, color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30" };
      case "courier":
        return { label: "Espace Livreur", icon: Bike, color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30" };
      case "admin":
        return { label: "Espace Admin", icon: ShieldCheck, color: "text-purple-400 bg-purple-950/60 border-purple-500/30" };
    }
  };

  const currentRoleInfo = getRoleLabel(currentRole);
  const CurrentRoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl w-full max-w-full">
      {/* 1. Top Banner for Brand Tagline & Language / Sound */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 px-3 sm:px-4 py-1 sm:py-1.5 text-xs text-white flex items-center justify-between w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] bg-black/30 px-2 py-0.5 rounded-full shrink-0">
            🔥 {ALLORESTO_BRAND_INFO.tagline}
          </span>
          <span className="text-[11px] font-medium hidden md:inline truncate">
            Point de retrait : <strong>{ALLORESTO_BRAND_INFO.pickupLocation}</strong> &bull; Partenaire : <strong>Billo Express</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/30 hover:bg-black/40 border border-white/25 text-white text-[10px] sm:text-[11px] font-extrabold transition-colors cursor-pointer shadow-sm"
              title="Changer de langue / Select language (Français, English, Haoussa, Zarma)"
            >
              <span>{currentLangObj.flag}</span>
              <span className="font-bold hidden sm:inline">{currentLangObj.label}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Langues Disponibles 🇳🇪
                </div>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      if (onChangeLanguage) onChangeLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      currentLanguage === l.code
                        ? "bg-orange-500/20 text-orange-400 font-black border border-orange-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <div>
                        <p className="font-bold leading-tight">{l.label}</p>
                        <p className="text-[10px] text-slate-400">{l.native}</p>
                      </div>
                    </div>
                    {currentLanguage === l.code && <Check className="w-3.5 h-3.5 text-orange-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Notification Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="text-[11px] font-bold text-white hover:text-amber-200 hidden sm:flex items-center gap-1 cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full border border-white/20 transition-colors"
              title={soundEnabled ? "Notifications sonores activées (Cliquer pour couper)" : "Notifications sonores coupées (Cliquer pour activer)"}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-amber-300" />
                  <span className="hidden sm:inline">Sons ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Sons OFF</span>
                </>
              )}
            </button>
          )}

          {/* Contact Direct */}
          <button
            onClick={onOpenContact}
            className="text-[11px] font-bold text-white hover:text-orange-100 hidden sm:flex items-center gap-1 cursor-pointer"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span className="hidden md:inline">+227 96 05 23 10</span>
            <span className="md:hidden">Contact</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive Spaces Bar (Espace Client, Restaurant, Livreur, Admin & Liens Rapides) */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-2.5 sm:px-6 py-1.5 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
          {/* Les 4 Espaces de l'Application */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Espace Client */}
            <button
              onClick={() => onChangeRole("client")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentRole === "client"
                  ? "bg-orange-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Espace Client</span>
            </button>

            {/* Espace Restaurant */}
            <button
              onClick={() => onChangeRole("restaurant")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentRole === "restaurant"
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Espace Restaurant</span>
            </button>

            {/* Espace Livreur */}
            <button
              onClick={() => onChangeRole("courier")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentRole === "courier"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Espace Livreur</span>
            </button>

            {/* Espace Admin */}
            <button
              onClick={() => onChangeRole("admin")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentRole === "admin"
                  ? "bg-purple-500 text-slate-950 shadow-sm"
                  : "bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Admin</span>
            </button>
          </div>

          {/* Liens Utiles : Comment ça marche, Formules, FAQ, Contact */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
            {onOpenHowItWorks && (
              <button
                onClick={onOpenHowItWorks}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-slate-800/60 transition cursor-pointer"
                title="Guide : Comment ça marche"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Comment ça marche</span>
              </button>
            )}

            {onOpenPlans && (
              <button
                onClick={onOpenPlans}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-orange-300 hover:text-orange-200 hover:bg-slate-800/60 transition cursor-pointer"
                title="Formules d'adhésion & tarifs restaurants"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Formules &amp; Tarifs</span>
              </button>
            )}

            {onOpenFaq && (
              <button
                onClick={onOpenFaq}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                title="Foire Aux Questions"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FAQ</span>
              </button>
            )}

            {onOpenDistrictsDirectory && (
              <button
                onClick={onOpenDistrictsDirectory}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                title="Frais des Quartiers de Niamey"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Frais Quartiers</span>
              </button>
            )}

            <button
              onClick={onOpenContact}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-300 hover:text-emerald-200 hover:bg-slate-800/60 transition cursor-pointer"
              title="Service Client & Support"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 w-full max-w-full overflow-hidden">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div
            onClick={onOpenLogoModal}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            title="Cliquez pour découvrir le concept et la géométrie du logo Allôresto"
          >
            <BrandLogo variant="full" size="sm" showTagline={false} className="sm:hidden" />
            <BrandLogo variant="full" size="md" showTagline={false} className="hidden sm:inline-flex" />
          </div>

          {/* City / Location Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[140px] truncate">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-slate-800 mb-1 space-y-1.5">
                  <button
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Localisation..." : "Me géolocaliser"}</span>
                  </button>

                  {onOpenDistrictsDirectory && (
                    <button
                      onClick={() => {
                        setCityDropdownOpen(false);
                        onOpenDistrictsDirectory();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Répertoire &amp; Frais des Quartiers</span>
                    </button>
                  )}
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase tracking-wider">
                    Villes &amp; Quartiers Phares :
                  </span>
                  {CITIES_DATA.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        onSelectCity(city.name);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        selectedCity === city.name
                          ? "bg-orange-500 text-slate-950 font-bold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span>{city.name} ({city.country})</span>
                      {selectedCity === city.name && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Explicit Navigation Buttons (Accueil, Menu, Commandes, Boxs, Événements) - desktop only */}
        {currentRole === "client" && (
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shrink-0">
            {/* 1. Accueil */}
            <button
              onClick={() => onChangeRole("client")}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {t(currentLanguage, "home")}
            </button>

            {/* 2. Menu / Grande Carte 65+ plats */}
            {onOpenMenu && (
              <button
                id="header-menu-catalog-btn"
                onClick={onOpenMenu}
                className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Consulter le menu et la carte complète de plus de 65 plats"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span className="font-extrabold">{t(currentLanguage, "menu_catalog")}</span>
              </button>
            )}

            {/* 3. Commandes / Historique */}
            {onOpenOrdersHistory && (
              <button
                onClick={onOpenOrdersHistory}
                className="hidden xl:flex px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition items-center gap-1 cursor-pointer"
                title="Historique des commandes et reçus"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t(currentLanguage, "orders")}</span>
              </button>
            )}

            {/* 4. Boxs Repas & Sauces */}
            {onOpenSauceBoxes && (
              <button
                onClick={onOpenSauceBoxes}
                className="hidden 2xl:flex px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition items-center gap-1 cursor-pointer"
                title="Boxs repas & sauces sahéliennes"
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>{t(currentLanguage, "boxes")}</span>
              </button>
            )}

            {/* 5. Événements / Traiteur */}
            {onOpenCatering && (
              <button
                onClick={onOpenCatering}
                className="hidden 2xl:flex px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition items-center gap-1 cursor-pointer"
                title="Traiteur, mariages & réunions ministérielles"
              >
                <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t(currentLanguage, "events")}</span>
              </button>
            )}

            {/* 6. Groupe Bureau */}
            <button
              onClick={onOpenGroupOrder}
              className="hidden xl:flex px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>{t(currentLanguage, "group_order")}</span>
            </button>
          </div>
        )}

        {/* Right Actions: AI Chef, Account, Role Switcher, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Account / Sahel Club */}
          {currentRole === "client" && (
            <div className="hidden sm:flex items-center gap-1.5">
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold transition cursor-pointer"
                  title="Connexion ou Profil"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {currentUser ? currentUser.name.split(" ")[0] : "Compte"}
                  </span>
                </button>
              )}

              <button
                onClick={onOpenAccount}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
                title="Club Sahel & Points de fidélité"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Fidélité</span>
              </button>
            </div>
          )}

          {/* Voice Order Trigger - hidden on mobile since floating mic exists */}
          {onOpenVoiceOrder && (
            <button
              id="voice-order-nav-btn"
              onClick={onOpenVoiceOrder}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105"
              title="Dicter ma commande vocale"
            >
              <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{t(currentLanguage, "voice_order")}</span>
            </button>
          )}

          {/* AllôChef AI Assistant */}
          <button
            id="allochef-nav-btn"
            onClick={onOpenChefAI}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-500/50 hover:border-orange-400 text-orange-400 text-xs font-bold shadow-lg shadow-orange-500/10 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{t(currentLanguage, "chef_ai")}</span>
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${currentRoleInfo.color}`}
            >
              <CurrentRoleIcon className="w-3.5 h-3.5" />
              <span>{currentRoleInfo.label}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 mb-1">
                  Changer d&apos;Espace Démo
                </div>
                {(["client", "restaurant", "courier", "admin"] as UserRole[]).map((r) => {
                  const info = getRoleLabel(r);
                  const Icon = info.icon;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        currentRole === r
                          ? "bg-slate-800 text-white font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-orange-400" />
                        {info.label}
                      </span>
                      {currentRole === r && <Check className="w-3.5 h-3.5 text-orange-400" />}
                    </button>
                  );
                })}

                <div className="pt-1.5 mt-1.5 border-t border-slate-800 space-y-1">
                  {onOpenHowItWorks && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenHowItWorks();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-amber-300 hover:bg-slate-800/80 transition cursor-pointer font-bold"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Comment ça marche</span>
                    </button>
                  )}

                  {onOpenPlans && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenPlans();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-orange-300 hover:bg-slate-800/80 transition cursor-pointer font-bold"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Formules &amp; Tarifs</span>
                    </button>
                  )}

                  {onOpenContract && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenContract();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Contrat Partenaire</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Button (Panier Dynamique) */}
          {currentRole === "client" && (
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotal > 0 ? `${cartTotal.toLocaleString()} F` : "Panier"}
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-orange-400 text-[10px] sm:text-[11px] font-black flex items-center justify-center border border-orange-400/50">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
