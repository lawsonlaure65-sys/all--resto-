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
} from "lucide-react";
import { UserRole, ServiceMode, CityOption, UserProfile } from "../types";
import { CITIES_DATA, ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { NIAMEY_DISTRICTS_DATA } from "../data/niameyDistrictsData";
import { BrandLogo } from "./BrandLogo";

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
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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
          {onOpenDistrictsDirectory && (
            <button
              onClick={onOpenDistrictsDirectory}
              className="text-[11px] font-bold text-amber-200 hover:text-white flex items-center gap-1 cursor-pointer bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full border border-amber-300/30 transition-colors"
            >
              <Compass className="w-3 h-3 text-amber-300" />
              <span>Frais par Quartier (1 000 F / 1 500 F)</span>
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
          <button
            onClick={onOpenPartnerModal}
            className="text-[11px] font-bold underline hover:text-orange-100 cursor-pointer transition-colors flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rejoindre comme Restaurant</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo with Modern Clever Icon */}
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenLogoModal}
            className="flex items-center gap-2 group cursor-pointer"
            title="Cliquez pour découvrir le concept et la géométrie du logo Allôresto"
          >
            <BrandLogo variant="full" size="md" showTagline={false} />
          </div>

          {/* City / Location Selector */}
          <div className="relative">
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

        {/* Service Mode Switcher (Livraison / À Emporter / Réserver) */}
        {currentRole === "client" && (
          <div className="hidden lg:flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onChangeServiceMode("delivery")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                serviceMode === "delivery"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🛵 Livraison Express
            </button>
            <button
              onClick={() => onChangeServiceMode("takeaway")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                serviceMode === "takeaway"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🛍️ À Emporter (Click &amp; Collect)
            </button>
            <button
              onClick={() => onChangeServiceMode("booking")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                serviceMode === "booking"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🍽️ Réserver une Table
            </button>
          </div>
        )}

        {/* Right Actions: Group Orders, Account, AI Concierge, Role Switcher, Cart */}
        <div className="flex items-center gap-2">
          {/* Catering / Events Button */}
          {currentRole === "client" && onOpenCatering && (
            <button
              onClick={onOpenCatering}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Traiteur &amp; Événements</span>
            </button>
          )}

          {/* Blog Culinaire Button */}
          {currentRole === "client" && onOpenBlog && (
            <button
              onClick={onOpenBlog}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span>Blog Culinaire</span>
            </button>
          )}

          {/* Group Order Trigger */}
          {currentRole === "client" && (
            <button
              onClick={onOpenGroupOrder}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span>Groupe Bureau</span>
            </button>
          )}

          {/* Auth & User Account Triggers */}
          {currentRole === "client" && (
            <div className="flex items-center gap-1.5">
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold transition cursor-pointer"
                  title="Connexion ou Inscription avec Email vérifié"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {currentUser ? currentUser.name.split(" ")[0] : "Connexion"}
                  </span>
                </button>
              )}

              <button
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer"
                title="Club Sahel & Points de fidélité"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Fidélité</span>
              </button>

              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition cursor-pointer"
                  title="Coordonnées, WhatsApp, Support & Formulaire de contact"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contacts</span>
                </button>
              )}
            </div>
          )}

          {/* Tech Pack & Supabase Schema Exporter */}
          <button
            onClick={onOpenTechPack}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold transition cursor-pointer shadow-sm"
            title="Consulter le Schéma Supabase SQL & Architecture Option C"
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>Pack Tech Supabase</span>
          </button>

          {/* AllôChef AI Assistant Trigger */}
          <button
            id="allochef-nav-btn"
            onClick={onOpenChefAI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-500/50 hover:border-orange-400 text-orange-400 text-xs font-bold shadow-lg shadow-orange-500/10 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-current text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AllôChef IA</span>
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

          {/* Cart Button */}
          {currentRole === "client" && (
            <button
              id="cart-nav-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">
                {cartTotal > 0 ? `${cartTotal.toLocaleString()} FCFA` : "Panier"}
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

