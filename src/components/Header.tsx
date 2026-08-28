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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner for Partnership & Service Mode */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 px-4 py-1.5 text-xs text-white flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-extrabold uppercase tracking-wider text-[10px] bg-black/30 px-2 py-0.5 rounded-full">
            🔥 {ALLORESTO_BRAND_INFO.tagline}
          </span>
          <span className="text-[11px] font-medium hidden sm:inline">
            Point de retrait : <strong>{ALLORESTO_BRAND_INFO.pickupLocation}</strong> &bull; Partenaire : <strong>Billo Express</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 hover:bg-black/40 border border-white/25 text-white text-[11px] font-extrabold transition-colors cursor-pointer shadow-sm"
                title="Changer de langue / Select language (Français, English, Haoussa, Zarma)"
              >
                <span>{currentLangObj.flag}</span>
                <span className="font-bold">{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
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
              className="text-[11px] font-bold text-white hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full border border-white/20 transition-colors"
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

          {/* Marketing AI quick trigger */}
          {onOpenMarketingAI && (
            <button
              onClick={onOpenMarketingAI}
              className="text-[11px] font-extrabold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer bg-amber-950/60 hover:bg-amber-900/80 px-2 py-0.5 rounded-full border border-amber-400/40 transition-colors"
              title="Pilote Automatique Commercial & Campagnes Virales WhatsApp"
            >
              <TrendingUp className="w-3 h-3 text-amber-300" />
              <span>IA Marketing</span>
            </button>
          )}

          {/* WhatsApp Automation quick trigger */}
          {onOpenWhatsAppAutomation && (
            <button
              onClick={onOpenWhatsAppAutomation}
              className="text-[11px] font-extrabold text-emerald-200 hover:text-white flex items-center gap-1 cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-400/40 transition-colors"
              title="Centre d'Automatisation & Dispatch WhatsApp"
            >
              <MessageSquare className="w-3 h-3 text-emerald-300" />
              <span className="hidden md:inline">WhatsApp Auto</span>
            </button>
          )}

          {/* Dynamic FAQ trigger */}
          {onOpenFaq && (
            <button
              onClick={onOpenFaq}
              className="text-[11px] font-bold text-white hover:text-amber-200 flex items-center gap-1 cursor-pointer"
              title="Foire Aux Questions dynamique & aide"
            >
              <HelpCircle className="w-3 h-3 text-amber-300" />
              <span className="hidden md:inline">FAQ</span>
            </button>
          )}

          {onOpenDistrictsDirectory && (
            <button
              onClick={onOpenDistrictsDirectory}
              className="text-[11px] font-bold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full border border-amber-300/30 transition-colors hidden xl:flex"
            >
              <Compass className="w-3 h-3 text-amber-300" />
              <span>Frais Quartiers</span>
            </button>
          )}

          <button
            onClick={onOpenContact}
            className="text-[11px] font-bold text-white hover:text-orange-100 flex items-center gap-1 cursor-pointer"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span className="hidden md:inline">+227 96 05 23 10</span>
            <span className="md:hidden">Contact</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Location */}
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenLogoModal}
            className="flex items-center gap-2 group cursor-pointer shrink-0"
            title="Cliquez pour découvrir le concept et la géométrie du logo Allôresto"
          >
            <BrandLogo variant="full" size="md" showTagline={false} />
          </div>

          {/* City / Location Selector */}
          <div className="relative hidden sm:block">
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

        {/* Center: Explicit Navigation Buttons (Accueil, Menu, Commandes, Boxs, Événements) */}
        {currentRole === "client" && (
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
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
                onClick={onOpenMenu}
                className="px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 border border-orange-500/30 transition flex items-center gap-1 cursor-pointer"
                title="Consulter la carte complète de plus de 65 plats"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>{t(currentLanguage, "menu_catalog")}</span>
              </button>
            )}

            {/* 3. Commandes / Historique */}
            {onOpenOrdersHistory && (
              <button
                onClick={onOpenOrdersHistory}
                className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
                title="Traiteur, mariages & réunions ministérielles"
              >
                <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t(currentLanguage, "events")}</span>
              </button>
            )}

            {/* 6. Groupe Bureau */}
            <button
              onClick={onOpenGroupOrder}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>{t(currentLanguage, "group_order")}</span>
            </button>
          </div>
        )}

        {/* Right Actions: AI Chef, Account, Role Switcher, Cart */}
        <div className="flex items-center gap-2">
          {/* User Account / Sahel Club */}
          {currentRole === "client" && (
            <div className="flex items-center gap-1.5">
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold transition cursor-pointer"
                  title="Connexion ou Profil"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
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

          {/* Voice Order Trigger */}
          {onOpenVoiceOrder && (
            <button
              id="voice-order-nav-btn"
              onClick={onOpenVoiceOrder}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-105"
              title="Dicter ma commande vocale"
            >
              <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">{t(currentLanguage, "voice_order")}</span>
            </button>
          )}

          {/* AllôChef AI Assistant */}
          <button
            id="allochef-nav-btn"
            onClick={onOpenChefAI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-500/50 hover:border-orange-400 text-orange-400 text-xs font-bold shadow-lg shadow-orange-500/10 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{t(currentLanguage, "chef_ai")}</span>
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${currentRoleInfo.color}`}
            >
              <CurrentRoleIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
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
              </div>
            )}
          </div>

          {/* Cart Button (Panier Dynamique) */}
          {currentRole === "client" && (
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotal > 0 ? `${cartTotal.toLocaleString()} F` : "Panier"}
              </span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-orange-400 text-[11px] font-black flex items-center justify-center border border-orange-400/50">
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
