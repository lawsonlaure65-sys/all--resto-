import React, { useState } from "react";
import {
  UtensilsCrossed,
  Users,
  Sparkles,
  Award,
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  User,
  Clock,
  Package,
  HelpCircle,
  TrendingUp,
  Mic,
  Layers,
  Check,
  X,
} from "lucide-react";
import { UserRole, AppLanguage } from "../types";
import { t } from "../utils/translations";
import { ThemeToggle } from "./ThemeToggle";

interface MobileBottomNavProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenChefAI: () => void;
  onOpenVoiceOrder?: () => void;
  onOpenGroupOrder: () => void;
  onOpenAccount: () => void;
  onOpenTechPack: () => void;
  onOpenMenu?: () => void;
  onOpenOrdersHistory?: () => void;
  onOpenSauceBoxes?: () => void;
  onOpenFaq?: () => void;
  onOpenMarketingAI?: () => void;
  currentLanguage?: AppLanguage;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  onChangeRole,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenChefAI,
  onOpenVoiceOrder,
  onOpenGroupOrder,
  onOpenAccount,
  onOpenTechPack,
  onOpenMenu,
  onOpenOrdersHistory,
  onOpenSauceBoxes,
  onOpenFaq,
  onOpenMarketingAI,
  currentLanguage = "fr",
}) => {
  const [isSpaceSelectorOpen, setIsSpaceSelectorOpen] = useState(false);

  const getRoleInfo = (r: UserRole) => {
    switch (r) {
      case "client":
        return { label: "Client", title: "Espace Client", icon: User, color: "text-orange-400 bg-orange-500/20 border-orange-500/40", desc: "Menu, commandes & livraison" };
      case "restaurant":
        return { label: "Resto", title: "Espace Restaurant", icon: Store, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40", desc: "Commandes & gestion carte" };
      case "courier":
        return { label: "Livreur", title: "Espace Livreur", icon: Bike, color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/40", desc: "Courses & livraisons GPS" };
      case "admin":
        return { label: "Admin", title: "Espace Admin", icon: ShieldCheck, color: "text-purple-400 bg-purple-500/20 border-purple-500/40", desc: "Supervision & paiements" };
    }
  };

  const activeRoleInfo = getRoleInfo(currentRole);
  const ActiveRoleIcon = activeRoleInfo.icon;

  return (
    <>
      {/* Mobile Space Switcher Sheet */}
      {isSpaceSelectorOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSpaceSelectorOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0b101b] border-t border-slate-700 rounded-t-3xl p-4 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Changer d&apos;espace démo</h3>
                  <p className="text-[10px] text-slate-400">Sélectionnez l&apos;espace à afficher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSpaceSelectorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {(["client", "restaurant", "courier", "admin"] as UserRole[]).map((r) => {
                const info = getRoleInfo(r);
                const Icon = info.icon;
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      onChangeRole(r);
                      setIsSpaceSelectorOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${info.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-white">{info.title}</span>
                          {isSelected && (
                            <span className="px-2 py-0.2 rounded-full bg-orange-500 text-slate-950 font-black text-[9px] uppercase">
                              Actif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{info.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-amber-400 shrink-0 font-black" />}
                  </button>
                );
              })}
            </div>

            {/* Mobile Theme Switcher */}
            <div className="pt-3 border-t border-slate-800">
              <ThemeToggle variant="segmented" />
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-1 py-1 safe-area-pb w-full max-w-full">
        <div className="flex items-center justify-between w-full">
          {/* Tab 1: Accueil */}
          <button
            onClick={() => onChangeRole("client")}
            className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer flex-1 min-w-0 ${
              currentRole === "client"
                ? "text-orange-400 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 mb-0.5" />
            <span className="text-[8.5px] truncate max-w-full leading-none">{t(currentLanguage, "home")}</span>
          </button>

          {/* Tab 2: Menu (65+ Plats) */}
          {currentRole === "client" && onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer flex-1 min-w-0"
            >
              <UtensilsCrossed className="w-4 h-4 mb-0.5 text-orange-400" />
              <span className="text-[8.5px] truncate max-w-full leading-none">{t(currentLanguage, "menu")}</span>
            </button>
          )}

          {/* Tab 3: Commandes / Historique */}
          {currentRole === "client" && onOpenOrdersHistory && (
            <button
              onClick={onOpenOrdersHistory}
              className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-slate-400 hover:text-cyan-400 transition-all cursor-pointer flex-1 min-w-0"
            >
              <Clock className="w-4 h-4 mb-0.5 text-cyan-400" />
              <span className="text-[8.5px] truncate max-w-full leading-none">{t(currentLanguage, "orders")}</span>
            </button>
          )}

          {/* Tab 4: Commande Vocale */}
          {currentRole === "client" && onOpenVoiceOrder && (
            <button
              onClick={onOpenVoiceOrder}
              className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer flex-1 min-w-0"
            >
              <Mic className="w-4 h-4 mb-0.5 text-red-400 animate-pulse" />
              <span className="text-[8.5px] font-bold truncate max-w-full leading-none">{t(currentLanguage, "voice_order")}</span>
            </button>
          )}

          {/* Tab 5: AllôChef Floating Center AI Button */}
          <button
            onClick={onOpenChefAI}
            className="flex flex-col items-center justify-center -mt-3.5 cursor-pointer group flex-1 min-w-0 px-0.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            </div>
            <span className="text-[8.5px] font-black text-amber-400 mt-0.5 leading-none">AllôChef</span>
          </button>

          {/* Tab 6: Boxs Repas & Sauces */}
          {currentRole === "client" && onOpenSauceBoxes && (
            <button
              onClick={onOpenSauceBoxes}
              className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-slate-400 hover:text-amber-400 transition-all cursor-pointer flex-1 min-w-0"
            >
              <Package className="w-4 h-4 mb-0.5 text-amber-400" />
              <span className="text-[8.5px] truncate max-w-full leading-none">{t(currentLanguage, "boxes")}</span>
            </button>
          )}

          {/* Tab 7: Panier Dynamique */}
          {currentRole === "client" && (
            <button
              onClick={onOpenCart}
              className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer relative flex-1 min-w-0"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 mb-0.5 text-orange-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-orange-500 text-slate-950 text-[8px] font-black border border-slate-900 shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[8.5px] font-bold text-orange-400 truncate max-w-full leading-none">
                {cartTotal > 0 ? `${cartTotal.toLocaleString()} F` : t(currentLanguage, "cart")}
              </span>
            </button>
          )}

          {/* Tab 8: Switch Espaces (Always accessible on mobile) */}
          <button
            id="mobile-nav-spaces-btn"
            type="button"
            onClick={() => setIsSpaceSelectorOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer flex-1 min-w-0 ${
              currentRole !== "client"
                ? "text-amber-400 font-black"
                : "text-slate-400 hover:text-amber-400"
            }`}
            title="Changer d'espace (Client, Restaurant, Livreur, Admin)"
          >
            <div className="relative">
              <ActiveRoleIcon className="w-4 h-4 mb-0.5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <span className="text-[8.5px] font-bold truncate max-w-full leading-none">
              {activeRoleInfo.label}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
