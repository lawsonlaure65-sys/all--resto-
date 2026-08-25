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
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Tab 1: Home / Restaurants */}
        <button
          onClick={() => onChangeRole("client")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentRole === "client"
              ? "text-orange-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Explorer</span>
        </button>

        {/* Tab 2: Group Order (Bureau / Ministères) */}
        {currentRole === "client" ? (
          <button
            onClick={onOpenGroupOrder}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer relative"
          >
            <Users className="w-5 h-5 mb-0.5 text-orange-400" />
            <span className="text-[10px]">Bureau</span>
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          </button>
        ) : (
          <button
            onClick={() => onChangeRole("client")}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Client</span>
          </button>
        )}

        {/* Tab 3: AllôChef AI Floating Center Button */}
        <button
          onClick={onOpenChefAI}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <span className="text-[10px] font-black text-amber-400 mt-1">AllôChef</span>
        </button>

        {/* Tab 4: Account / Sahel Club */}
        {currentRole === "client" ? (
          <button
            onClick={onOpenAccount}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
          >
            <Award className="w-5 h-5 mb-0.5 text-amber-400" />
            <span className="text-[10px]">Compte</span>
          </button>
        ) : currentRole === "restaurant" ? (
          <button
            onClick={() => onChangeRole("restaurant")}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-emerald-400 font-bold cursor-pointer"
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Cuisine</span>
          </button>
        ) : currentRole === "courier" ? (
          <button
            onClick={() => onChangeRole("courier")}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-cyan-400 font-bold cursor-pointer"
          >
            <Bike className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Courses</span>
          </button>
        ) : (
          <button
            onClick={() => onChangeRole("admin")}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-purple-400 font-bold cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Admin</span>
          </button>
        )}

        {/* Tab 5: Cart Drawer Button */}
        {currentRole === "client" ? (
          <button
            onClick={onOpenCart}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-orange-400 transition-all cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-orange-500 text-slate-950 text-[9px] font-black border border-slate-900 shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">
              {cartTotal > 0 ? `${cartTotal.toLocaleString()}` : "Panier"}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenTechPack}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Tech</span>
          </button>
        )}
      </div>
    </div>
  );
};
