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
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl w-full">
      {/* 1. Top Banner for Language, Sound, IA Marketing, WhatsApp, Comment ça marche, FAQ & Contact */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-slate-950 border-b border-slate-800/80 px-2 sm:px-4 py-1 text-xs text-white flex items-center justify-between w-full max-w-full overflow-x-auto scrollbar-none gap-1.5 sm:gap-2">
        {/* Left: Language, Sound, IA Marketing, WhatsApp, Comment ça marche, FAQ */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Language Switcher Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-800/90 hover:bg-red-700 border border-red-600/60 text-white text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
              title="Changer de langue (Français, English, Haoussa, Zarma)"
            >
              <span>{currentLangObj.flag}</span>
              <span className="font-bold">{currentLangObj.label}</span>
              <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
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
              </>
            )}
          </div>

          {/* Sound Notification Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white transition-colors cursor-pointer shrink-0"
              title={soundEnabled ? "Notifications sonores activées (Cliquer pour couper)" : "Notifications sonores coupées (Cliquer pour activer)"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              ) : (
                <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              )}
            </button>
          )}

          {/* Theme Mode Toggle (System Auto / Light / Dark) */}
          <ThemeToggle variant="header-bar" />

          {/* IA Marketing trigger */}
          {onOpenMarketingAI && (
            <button
              onClick={onOpenMarketingAI}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#26130b] hover:bg-[#341b10] border border-amber-600/60 text-amber-200 text-[10px] sm:text-[11px] font-extrabold transition-colors cursor-pointer shadow-sm shrink-0"
              title="Pilote Automatique Commercial & Campagnes Virales WhatsApp"
            >
              <TrendingUp className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap">IA Marketing</span>
            </button>
          )}

          {/* WhatsApp Automation trigger */}
          {onOpenWhatsAppAutomation && (
            <button
              onClick={onOpenWhatsAppAutomation}
              className="p-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-400 transition-colors cursor-pointer shrink-0"
              title="Centre d'Automatisation & Dispatch WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          {/* Comment ça marche */}
          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#23170e] hover:bg-[#322115] border border-amber-500/60 text-amber-200 text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer shadow-sm shrink-0"
              title="Guide : Comment ça marche"
            >
              <Info className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">Comment ça marche</span>
            </button>
          )}

          {/* Dynamic FAQ trigger */}
          {onOpenFaq && (
            <button
              onClick={onOpenFaq}
              className="p-1 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-amber-300 transition-colors cursor-pointer shrink-0"
              title="Foire Aux Questions dynamique & aide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>

        {/* Right: Contact Direct */}
        <div className="flex items-center gap-2 shrink-0 pl-1">
          <button
            onClick={onOpenContact}
            className="flex items-center gap-1 text-[11px] font-bold text-white hover:text-orange-200 cursor-pointer transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Contact</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-1.5 sm:px-4 lg:px-8 py-2 flex items-center justify-between gap-1 sm:gap-2 md:gap-3 w-full max-w-full">
        {/* Left: Brand Logo + Menu Catalog */}
        <div className="flex items-center gap-1 sm:gap-2 shrink min-w-0">
          <div
            onClick={onOpenLogoModal}
            className="flex items-center group cursor-pointer shrink-0"
            title="Logo Officiel Allôresto Niamey 2026"
          >
            <BrandLogo variant="full" size="sm" showTagline={false} />
          </div>

          {/* Menu (65+ Plats) Catalog Button */}
          {onOpenMenu && (
            <button
              id="header-menu-catalog-btn"
              onClick={onOpenMenu}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#25150d] hover:bg-[#341d12] border border-amber-600/70 text-amber-300 cursor-pointer shrink-0 transition active:scale-95 shadow-sm"
              title="Consulter le menu et la carte complète (65+ plats)"
            >
              <UtensilsCrossed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[9.5px] sm:text-[11px] font-black text-amber-300">Menu</div>
                <div className="text-[8px] sm:text-[9.5px] text-amber-400/90 font-bold whitespace-nowrap">(65+ Plats)</div>
              </div>
            </button>
          )}

          {/* City / Location Selector (hidden on mobile) */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[140px] truncate">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCityDropdownOpen(false)}
                />
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
              </>
            )}
          </div>
        </div>

        {/* Center: Explicit Navigation Buttons (desktop only) */}
        {currentRole === "client" && (
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shrink-0">
            {/* 1. Accueil */}
            <button
              onClick={() => onChangeRole("client")}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {t(currentLanguage, "home")}
            </button>

            {/* 2. Commandes / Historique */}
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

            {/* 3. Boxs Repas & Sauces */}
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

            {/* 4. Événements / Traiteur */}
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

            {/* 5. Groupe Bureau */}
            <button
              onClick={onOpenGroupOrder}
              className="hidden xl:flex px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>{t(currentLanguage, "group_order")}</span>
            </button>
          </div>
        )}

        {/* Right Actions: 5 Square Action Buttons matching user screenshots exactly */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          {/* Button 1: User Account */}
          <button
            id="account-nav-btn"
            onClick={currentUser ? onOpenAccount : onOpenAuth}
            className="w-8 h-8 min-[400px]:w-8.5 min-[400px]:h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-[#1c1412] hover:bg-[#28201a] border border-amber-900/40 text-amber-200/90 flex items-center justify-center shrink-0 transition active:scale-95 shadow-sm cursor-pointer"
            title={currentUser ? `Connecté : ${currentUser.name}` : "Connexion / Profil"}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200/90" />
          </button>

          {/* Button 2: Voice Order */}
          {onOpenVoiceOrder && (
            <button
              id="voice-order-nav-btn"
              onClick={onOpenVoiceOrder}
              className="w-8 h-8 min-[400px]:w-8.5 min-[400px]:h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-[#231215] hover:bg-[#30161b] border border-rose-900/50 text-rose-400 flex items-center justify-center shrink-0 transition active:scale-95 shadow-sm cursor-pointer"
              title="Dicter ma commande vocale"
            >
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 animate-pulse" />
            </button>
          )}

          {/* Button 3: AllôChef AI Assistant */}
          <button
            id="allochef-nav-btn"
            onClick={onOpenChefAI}
            className="w-8 h-8 min-[400px]:w-8.5 min-[400px]:h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-[#271d0e] hover:bg-[#382a14] border border-amber-600/50 text-amber-400 flex items-center justify-center shrink-0 transition active:scale-95 shadow-sm cursor-pointer"
            title="AllôChef IA — Assistant culinaire intelligent"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
          </button>

          {/* Button 3.5: Theme Toggle (System Auto / Light / Dark) */}
          <ThemeToggle variant="header-nav" />

          {/* Button 4: Role Switcher Menu (Espace Client, Restaurant, Livreur, Admin) */}
          <div className="relative shrink-0">
            <button
              id="role-switcher-nav-btn"
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`h-8 min-[400px]:h-8.5 sm:h-9 md:h-10 px-2 sm:px-2.5 md:px-3 rounded-xl sm:rounded-2xl border flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 transition active:scale-95 shadow-sm cursor-pointer ${
                currentRole === "client"
                  ? "bg-[#20150e] hover:bg-[#2d1e13] border-orange-500/50 text-orange-300"
                  : currentRole === "restaurant"
                  ? "bg-[#0f231a] hover:bg-[#153124] border-emerald-500/50 text-emerald-300"
                  : currentRole === "courier"
                  ? "bg-[#0d222b] hover:bg-[#13303d] border-cyan-500/50 text-cyan-300"
                  : "bg-[#1e1329] hover:bg-[#2a1b3a] border-purple-500/50 text-purple-300"
              }`}
              title="Changer d'espace : Client, Restaurant, Livreur, Admin"
            >
              <CurrentRoleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline text-[10px] md:text-xs font-bold tracking-tight whitespace-nowrap">
                {currentRoleInfo.label.replace("Espace ", "")}
              </span>
              <ChevronDown className={`w-3 h-3 text-amber-400/90 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#0b101b] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[10px] uppercase font-black text-amber-400 border-b border-slate-800 mb-1.5 tracking-wider flex items-center justify-between">
                    <span>Espaces &amp; Rôles Démo</span>
                    <span className="text-[9px] text-slate-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded-full">4 Espaces</span>
                  </div>

                  <div className="space-y-1">
                    {(["client", "restaurant", "courier", "admin"] as UserRole[]).map((r) => {
                      const info = getRoleLabel(r);
                      const Icon = info.icon;
                      const isActive = currentRole === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            onChangeRole(r);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-white font-black border border-orange-500/50 shadow-sm"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              r === "client" ? "bg-orange-500/20 text-orange-400" :
                              r === "restaurant" ? "bg-emerald-500/20 text-emerald-400" :
                              r === "courier" ? "bg-cyan-500/20 text-cyan-400" :
                              "bg-purple-500/20 text-purple-400"
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold leading-tight truncate">{info.label}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {r === "client" && "Commander & plats phares"}
                                {r === "restaurant" && "Gestion commandes & carte"}
                                {r === "courier" && "Courses & livraisons GPS"}
                                {r === "admin" && "Supervision, paiements & analytics"}
                              </p>
                            </div>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-amber-400 shrink-0 font-black ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800 space-y-1">
                    {onOpenHowItWorks && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenHowItWorks();
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-amber-300 hover:bg-slate-800/80 transition cursor-pointer font-bold"
                      >
                        <Info className="w-3.5 h-3.5 text-amber-400" />
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
                        <CreditCard className="w-3.5 h-3.5 text-orange-400" />
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
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Contrat Partenaire</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Button 5: Cart Button */}
          {currentRole === "client" && (
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="relative w-8 h-8 min-[400px]:w-8.5 min-[400px]:h-8.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:to-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/25 transition active:scale-95 cursor-pointer border border-orange-400/40"
              title={cartTotal > 0 ? `Panier : ${cartTotal.toLocaleString()} FCFA` : "Voir le panier"}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 text-orange-400 text-[9px] font-black flex items-center justify-center border border-orange-400/60 shadow-sm">
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
