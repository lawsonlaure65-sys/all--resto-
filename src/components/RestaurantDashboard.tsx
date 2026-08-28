import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Store,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Bike,
  Plus,
  Power,
  Edit2,
  Trash2,
  ArrowRight,
  Package,
  Flame,
} from "lucide-react";
import { Order, Restaurant, MenuItem, OrderStatus } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";
import { DishManagementModal } from "./DishManagementModal";
import { sendOrderConfirmationWhatsApp } from "../utils/whatsappNotifications";
import { MessageSquare } from "lucide-react";

interface RestaurantDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedRestoId, setSelectedRestoId] = useState<string>("resto-1");
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "analytics">("orders");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(RESTAURANTS_DATA[0].menu);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  
  // Dish modal state
  const [showDishModal, setShowDishModal] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const currentResto =
    RESTAURANTS_DATA.find((r) => r.id === selectedRestoId) || RESTAURANTS_DATA[0];

  const currentOrders = orders.filter(
    (o) => o.restaurantId === selectedRestoId || o.restaurantName.includes(currentResto.name)
  );

  const toggleItemStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const handleOpenAddDish = () => {
    setEditingDish(null);
    setShowDishModal(true);
  };

  const handleOpenEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setShowDishModal(true);
  };

  const handleSaveDish = (dish: MenuItem) => {
    if (editingDish) {
      setMenuItems((prev) => prev.map((d) => (d.id === dish.id ? dish : d)));
    } else {
      setMenuItems((prev) => [dish, ...prev]);
    }
    setShowDishModal(false);
    setEditingDish(null);
  };

  const handleDeleteDish = (dishId: string) => {
    setMenuItems((prev) => prev.filter((d) => d.id !== dishId));
  };

  const totalRevenue = currentOrders.reduce((sum, o) => sum + o.subtotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Profile & Restaurant Switcher */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentResto.name}</h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isRestaurantOpen
                    ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                    : "bg-rose-950 text-rose-400 border-rose-500/40"
                }`}
              >
                {isRestaurantOpen ? "En Ligne & Reçoit des commandes" : "Fermé temporairement"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tableau de bord gérant &bull; {currentResto.city} &bull; Note client {currentResto.rating}/5
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              isRestaurantOpen
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isRestaurantOpen ? "Mettre en pause" : "Ouvrir les commandes"}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>CA du Jour</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{(totalRevenue + 125000).toLocaleString()} FCFA</p>
          <span className="text-[10px] text-emerald-400 font-bold">+18% vs hier</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Commandes traitées</span>
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">{currentOrders.length + 14}</p>
          <span className="text-[10px] text-slate-400">100% complétées</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Temps de prépa moyen</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">14 min</p>
          <span className="text-[10px] text-emerald-400 font-bold">Rapide &amp; Optimisé</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Note de satisfaction</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{currentResto.rating} / 5</p>
          <span className="text-[10px] text-cyan-400">Top 5% de la ville</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-orange-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Commandes en direct ({currentOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "menu"
              ? "bg-orange-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Gestion de la Carte &amp; Stocks</span>
        </button>
      </div>

      {/* Orders Tab View */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Flux des commandes clients
            </h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Écoute temps réel active
            </span>
          </div>

          {currentOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Toutes les commandes sont à jour</h4>
              <p className="text-xs">Les prochaines commandes apparaîtront ici avec alerte sonore.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-orange-400 text-sm">#{order.id}</span>
                        <span className="text-xs text-slate-400">&bull; {order.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{order.customerName}</h4>
                      <p className="text-[11px] text-slate-400">{order.deliveryAddress}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-white block">
                        {order.total.toLocaleString()} FCFA
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>
                          <strong>{it.quantity}x</strong> {it.menuItem.name}
                        </span>
                        <span className="font-mono text-slate-400">{it.totalPrice.toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Receipt Verification Status */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Mode de règlement :</span>
                      <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
                      {order.paymentReference && (
                        <span className="text-[10px] text-amber-400 font-mono block">
                          Réf: {order.paymentReference}
                        </span>
                      )}
                    </div>
                    <div>
                      {order.paymentMethod === "cash" ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                          💵 Espèces à la livraison
                        </span>
                      ) : order.receiptProofAttached ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                          ✅ Reçu de dépôt vérifié
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                          ⚠️ Reçu à valider
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                    {order.orderStatus === "received" && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, "preparing")}
                        className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>
                          {order.paymentMethod === "cash"
                            ? "Accepter & Lancer Préparation"
                            : "Valider Reçu & Passer en Cuisine"}
                        </span>
                      </button>
                    )}

                    {order.orderStatus === "preparing" && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, "delivering")}
                        className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Commande Prête &bull; Remettre au livreur</span>
                      </button>
                    )}

                    {order.orderStatus === "delivering" && (
                      <div className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-cyan-400" />
                        <span>En cours de livraison avec {order.courierName || "Livreur"}</span>
                      </div>
                    )}

                    {/* Quick WhatsApp Notification Button */}
                    <button
                      type="button"
                      onClick={() => sendOrderConfirmationWhatsApp(order)}
                      title="Envoyer ou renvoyer la confirmation WhatsApp au client"
                      className="px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Notifier WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Articles au Menu ({menuItems.length})
            </h3>
            <button
              onClick={handleOpenAddDish}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un plat (+ Photo Galerie)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.isSpicy && (
                      <span className="absolute top-1 left-1 bg-red-950/80 text-red-300 text-[8px] font-black px-1 rounded">
                        🌶️
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.category}</p>
                    <span className="text-xs font-extrabold text-orange-400">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleItemStock(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                      item.isAvailable !== false
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    }`}
                  >
                    {item.isAvailable !== false ? "En Stock" : "Rupture"}
                  </button>

                  <button
                    onClick={() => handleOpenEditDish(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    title="Modifier le plat"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dish Modal */}
      {showDishModal && (
        <DishManagementModal
          isOpen={showDishModal}
          onClose={() => {
            setShowDishModal(false);
            setEditingDish(null);
          }}
          onSaveDish={handleSaveDish}
          initialDish={editingDish}
        />
      )}
    </div>
  );
};
