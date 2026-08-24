import React, { useState } from "react";
import {
  User,
  ShoppingBag,
  Award,
  MapPin,
  Heart,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Phone,
  Mail,
  CheckCircle2,
  Building,
  Home,
  CreditCard,
  Gift,
} from "lucide-react";
import { Order, UserProfile, Restaurant, MenuItem } from "../types";
import { DEFAULT_USER_PROFILE, RESTAURANTS_DATA } from "../data/allorestoData";

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
  onOpenDataProtection: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
  onOpenDataProtection,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<"orders" | "loyalty" | "addresses" | "preferences">("orders");
  const [reorderedAlert, setReorderedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handle1ClickReorder = (order: Order) => {
    onReorder(order);
    setReorderedAlert(`Commande #${order.id} dupliquée dans votre panier !`);
    setTimeout(() => {
      setReorderedAlert(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/25">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">{userProfile.name}</h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  Membre {userProfile.sahelClubTier} Allôresto
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-orange-400" />
                  {userProfile.phone}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-cyan-400" />
                  {userProfile.city}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-950/60 to-amber-950/60 border border-orange-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Gift className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-[10px] text-orange-300 uppercase tracking-wider block font-bold">
                Cagnotte Sahel Club
              </span>
              <span className="text-base font-black text-white">
                {userProfile.loyaltyPoints.toLocaleString()} Pts{" "}
                <span className="text-xs text-emerald-400 font-semibold">
                  ({(userProfile.loyaltyPoints * 2).toLocaleString()} FCFA)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Historique &amp; Re-Order Express ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("loyalty")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "loyalty"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Sahel Club &amp; Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === "addresses"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Adresses de livraison ({userProfile.savedAddresses.length})</span>
          </button>
        </div>

        {reorderedAlert && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center gap-3 text-xs text-emerald-200 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{reorderedAlert}</span>
          </div>
        )}

        {/* Tab 1: Orders History & 1-Click Reorder */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Vos commandes récentes à Niamey
              </h4>
              <span className="text-[11px] text-orange-400 font-semibold flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Répétez vos déjeuners préférés en un clic
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
                <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Aucune commande enregistrée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{order.restaurantName}</span>
                          <span className="text-[10px] font-mono text-slate-400">#{order.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{order.createdAt}</span>
                          <span>&bull;</span>
                          <span className="text-cyan-400">Partenaire : {order.deliveryPartner || "Billo Express 🏍️"}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400 block">
                          {order.total.toLocaleString()} FCFA
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            order.orderStatus === "delivered"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                              : "bg-orange-950 text-orange-400 border border-orange-500/30"
                          }`}
                        >
                          {order.orderStatus === "delivered" ? "Livrée au bureau" : "En cours de livraison"}
                        </span>
                      </div>
                    </div>

                    {/* Order items mini summary */}
                    <div className="text-xs text-slate-300 space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span>
                            {it.quantity}x {it.menuItem.name}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {it.totalPrice.toLocaleString()} FCFA
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {order.deliveryAddress}
                      </span>

                      <button
                        onClick={() => handle1ClickReorder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-orange-500/40 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Commander à nouveau en 1 clic</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Loyalty Sahel Club */}
        {activeTab === "loyalty" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/80 to-amber-950/80 border border-orange-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Programme Sahel Club Allôresto
                  </span>
                  <h4 className="text-lg font-black text-white">Niveau Or Sahélien</h4>
                </div>
                <Award className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-xs text-slate-300">
                Vous gagnez 10 points par tranche de 1 000 FCFA commandés. Échangez vos points contre des déjeuners offerts et des réductions au bureau !
              </p>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full w-3/4 rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 450 pts actuels</span>
                <span>Prochain rang : VIP Sahélien (2 000 pts)</span>
              </div>
            </div>

            {/* Promo Codes & Coupons */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Vos codes promo actifs à Niamey
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-orange-400">NIAMEY10</span>
                    <span className="text-[10px] bg-orange-950 text-orange-300 px-2 py-0.5 rounded font-bold">
                      -10% Première commande
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Valable sur l'ensemble des restaurants de Niamey.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-emerald-400">BUREAU15</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      -15% Midi au Bureau
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Valable pour les livraisons ministères &amp; bureaux.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Vos adresses habituelles à Niamey
            </h4>
            <div className="space-y-2">
              {userProfile.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-orange-400 shrink-0 mt-0.5">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-black text-white">{addr.label}</h5>
                        {addr.isDefault && (
                          <span className="px-2 py-0.2 text-[9px] bg-emerald-950 text-emerald-400 rounded-full border border-emerald-500/30">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{addr.address}</p>
                      {addr.notes && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">Note : {addr.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Data Protection & Legal Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Données protégées sous conformité HAPDP Niger (Loi n° 2022-59 / 2023-31)</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenDataProtection();
            }}
            className="text-orange-400 hover:text-orange-300 underline font-semibold cursor-pointer"
          >
            Politique de confidentialité &amp; droits
          </button>
        </div>
      </div>
    </div>
  );
};
