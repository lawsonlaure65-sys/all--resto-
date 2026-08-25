import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShoppingBag,
  Clock,
  MapPin,
  RotateCcw,
  CheckCircle2,
  Bike,
  Phone,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  Store,
  Sparkles,
  Search,
} from "lucide-react";
import { Order, CartItem, MenuItem } from "../types";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onOpenWhatsAppHelp: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
  onTrackOrder,
  onOpenWhatsAppHelp,
}) => {
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "delivered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "active" && order.orderStatus === "delivered") return false;
    if (filterStatus === "delivered" && order.orderStatus !== "delivered") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchResto = order.restaurantName.toLowerCase().includes(q);
      const matchAddr = order.deliveryAddress.toLowerCase().includes(q);
      const matchItems = order.items.some((it) => it.menuItem.name.toLowerCase().includes(q));
      if (!matchId && !matchResto && !matchAddr && !matchItems) return false;
    }

    return true;
  });

  const getStatusBadge = (status: Order["orderStatus"]) => {
    switch (status) {
      case "received":
        return {
          label: "Commande Reçue",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: Clock,
        };
      case "preparing":
        return {
          label: "En Cuisine & Préparation",
          color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          icon: Sparkles,
        };
      case "delivering":
        return {
          label: "En Livraison • Billo Express 🏍️",
          color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse",
          icon: Bike,
        };
      case "delivered":
        return {
          label: "Livrée & Savourée",
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-black uppercase tracking-wider">
                Suivi &amp; Historique 🇳🇪
              </span>
              <span className="text-xs text-slate-400">Toutes vos commandes Allôresto</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Historique des Commandes
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "all"
                  ? "bg-orange-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "active"
                  ? "bg-orange-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              En cours ({orders.filter((o) => o.orderStatus !== "delivered").length})
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === "delivered"
                  ? "bg-orange-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              Livrées ({orders.filter((o) => o.orderStatus === "delivered").length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par n° commande, plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Orders List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Aucune commande trouvée</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Vos commandes passées apparaîtront ici avec les reçus, le suivi livreur Billo Express et la possibilité de re-commander en 1 clic.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusBadge(order.orderStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-lg"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-orange-400">
                          {order.id}
                        </span>
                        <span className="text-xs text-slate-400">&bull; {order.createdAt}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Store className="w-4 h-4 text-orange-400" />
                        <span>{order.restaurantName}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Items summary */}
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-900 text-orange-400 font-black text-[11px] flex items-center justify-center border border-slate-800">
                            {item.quantity}x
                          </span>
                          <span className="font-semibold">{item.menuItem.name}</span>
                        </div>
                        <span className="font-mono text-slate-400">
                          {item.totalPrice.toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address & Courier snippet */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono font-bold text-white">
                      <span className="text-slate-400 font-sans text-[11px]">Total payé :</span>
                      <span className="text-orange-400 text-sm">{order.total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {order.orderStatus !== "delivered" && (
                        <button
                          onClick={() => onTrackOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>Suivre en direct</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Voir Facture &amp; Reçu</span>
                      </button>

                      <button
                        onClick={() => onOpenWhatsAppHelp(order)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Aide WhatsApp</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onReorder(order)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-500/20 ml-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-commander ce panier</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Receipt Popup */}
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧾</span>
                  <div>
                    <h3 className="text-base font-black text-white">Reçu Officiel Allôresto</h3>
                    <p className="text-[11px] text-slate-400">Niamey, Niger &bull; Billo Express Logistique</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Numéro de Commande :</span>
                  <span className="font-mono font-bold text-orange-400">{selectedReceiptOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date &amp; Heure :</span>
                  <span className="font-semibold">{selectedReceiptOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client :</span>
                  <span className="font-semibold">{selectedReceiptOrder.customerName} ({selectedReceiptOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Restaurant Partenaire :</span>
                  <span className="font-semibold">{selectedReceiptOrder.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Adresse de Livraison :</span>
                  <span className="font-semibold text-right max-w-xs">{selectedReceiptOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode de Paiement :</span>
                  <span className="font-bold text-emerald-400 uppercase">{selectedReceiptOrder.paymentMethod} (Payé)</span>
                </div>
              </div>

              {/* Items Detail */}
              <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Détail des Plats
                </span>
                {selectedReceiptOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{it.quantity}x {it.menuItem.name}</span>
                    <span className="font-mono">{it.totalPrice.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sous-total :</span>
                  <span className="font-mono">{selectedReceiptOrder.subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Frais de livraison (Billo Express) :</span>
                  <span className="font-mono">{selectedReceiptOrder.deliveryFee.toLocaleString()} FCFA</span>
                </div>
                {selectedReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Remise appliquée :</span>
                    <span className="font-mono">-{selectedReceiptOrder.discount.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Réglé :</span>
                  <span className="font-mono text-orange-400">{selectedReceiptOrder.total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer la Facture</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="py-2.5 px-6 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
