import React from "react";
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
} from "lucide-react";
import { UserRole } from "../types";

interface MobileBottomNavProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenChefAI: () => void;
  onOpenGroupOrder: () => void;
  onOpenAccount: () => void;
  onOpenTechPack: () => void;
  onOpenMenu?: () => void;
  onOpenOrdersHistory?: () => void;
  onOpenSauceBoxes?: () => void;
  onOpenFaq?: () => void;
  onOpenMarketingAI?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  onChangeRole,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenChefAI,
  onOpenGroupOrder,
  onOpenAccount,
  onOpenTechPack,
  onOpenMenu,
  onOpenOrdersHistory,
  onOpenSauceBoxes,
  onOpenFaq,
  onOpenMarketingAI,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-1.5 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Tab 1: Accueil */}
        <button
          onClick={() => onChangeRole("client")}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            currentRole === "client"
              ? "text-orange-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UtensilsCrossed className="w-4 h-4 mb-0.5" />
          <span className="text-[9px]">Accueil</span>
        </button>

        {/* Tab 2: Menu (65+ Plats) */}
        {currentRole === "client" && onOpenMenu && (
          <button
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4 mb-0.5 text-orange-400" />
            <span className="text-[9px]">Menu</span>
          </button>
        )}

        {/* Tab 3: Commandes / Historique */}
        {currentRole === "client" && onOpenOrdersHistory && (
          <button
            onClick={onOpenOrdersHistory}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 mb-0.5 text-cyan-400" />
            <span className="text-[9px]">Commandes</span>
          </button>
        )}

        {/* Tab 4: AllôChef Floating Center AI Button */}
        <button
          onClick={onOpenChefAI}
          className="flex flex-col items-center justify-center -mt-4 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>
          <span className="text-[9px] font-black text-amber-400 mt-0.5">AllôChef</span>
        </button>

        {/* Tab 5: Boxs Repas & Sauces */}
        {currentRole === "client" && onOpenSauceBoxes && (
          <button
            onClick={onOpenSauceBoxes}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[9px]">Boxs</span>
          </button>
        )}

        {/* Tab 6: Panier Dynamique */}
        {currentRole === "client" ? (
          <button
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 mb-0.5 text-orange-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-orange-500 text-slate-950 text-[8px] font-black border border-slate-900 shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold text-orange-400">
              {cartTotal > 0 ? `${cartTotal.toLocaleString()} F` : "Panier"}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenTechPack}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Tech</span>
          </button>
        )}

        {/* Tab 7: Compte / FAQ */}
        {currentRole === "client" && onOpenAccount && (
          <button
            onClick={onOpenAccount}
            className="flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">Compte</span>
          </button>
        )}
      </div>
    </div>
  );
};
