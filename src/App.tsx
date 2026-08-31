import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { FlashMidiBanner } from "./components/FlashMidiBanner";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantMenuModal } from "./components/RestaurantMenuModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { LiveOrderTracker } from "./components/LiveOrderTracker";
import { AlloChefModal } from "./components/AlloChefModal";
import { TableBookingModal } from "./components/TableBookingModal";
import { GroupOrderModal } from "./components/GroupOrderModal";
import { UserAccountModal } from "./components/UserAccountModal";
import { HapdpDataModal } from "./components/HapdpDataModal";
import { TechPackModal } from "./components/TechPackModal";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { RestaurantDashboard } from "./components/RestaurantDashboard";
import { CourierDashboard } from "./components/CourierDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthModal } from "./components/AuthModal";
import { DailySpecialCard } from "./components/DailySpecialCard";
import { DailySpecialShareModal } from "./components/DailySpecialShareModal";
import { SauceBoxesSection } from "./components/SauceBoxesSection";
import { CateringModal } from "./components/CateringModal";
import { CulinaryBlogModal } from "./components/CulinaryBlogModal";
import { PartnerRegistrationModal } from "./components/PartnerRegistrationModal";
import { ContactModal } from "./components/ContactModal";
import { DeliveryFeeCalculatorModal } from "./components/DeliveryFeeCalculatorModal";
import { DeliveryDistrictsWidget } from "./components/DeliveryDistrictsWidget";
import { LogoPresentationModal } from "./components/LogoPresentationModal";
import { DishesCatalogModal } from "./components/DishesCatalogModal";
import { OrderHistoryModal } from "./components/OrderHistoryModal";
import { MarketingAIModal } from "./components/MarketingAIModal";
import { WhatsAppAutomationModal } from "./components/WhatsAppAutomationModal";
import { DynamicFaqModal } from "./components/DynamicFaqModal";
import { VisualNotificationToast, ToastNotification } from "./components/VisualNotificationToast";
import { Footer } from "./components/Footer";
import { ReceiptTicketModal } from "./components/ReceiptTicketModal";
import { JumuahBanner } from "./components/JumuahBanner";
import { VoiceOrderModal } from "./components/VoiceOrderModal";
import { getJumuahStatus } from "./utils/jumuahSchedule";
import { loadStoredRestaurants, syncFromSupabaseIfAvailable } from "./services/dishStorageService";
import { applyOfficialBrandFavicon } from "./utils/faviconManager";

import {
  playSoundCartAdd,
  playSoundOrderConfirmed,
  playSoundStatusUpdate,
  playSoundPromoApplied,
  playSoundSuccessChime,
} from "./utils/audioNotifications";
import {
  sendOrderConfirmationWhatsApp,
  sendOrderStatusNotificationWhatsApp,
} from "./utils/whatsappNotifications";

import {
  UserRole,
  ServiceMode,
  Restaurant,
  MenuItem,
  MealMoment,
  CartItem,
  Order,
  OrderStatus,
  TableBooking,
  DailySpecial,
  SauceBox,
  CateringQuoteRequest,
  UserProfile,
  AppLanguage,
} from "./types";
import {
  RESTAURANTS_DATA,
  INITIAL_ORDERS,
  DAILY_SPECIALS_DATA,
  SAUCE_BOXES_DATA,
  ALLORESTO_BRAND_INFO,
  DEFAULT_USER_PROFILE,
} from "./data/allorestoData";
import {
  Store,
  Bike,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  UtensilsCrossed,
  Layers,
  Users,
  ChefHat,
  BookOpen,
  Volume2,
  VolumeX,
  Mic,
} from "lucide-react";

export function App() {
  // Navigation, Language & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>("client");
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>("fr");
  const [selectedCity, setSelectedCity] = useState<string>("Niamey (Plateau / Centre-Ville)");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("delivery");

  // Persistent Restaurants & Dishes State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => loadStoredRestaurants());

  // Background Cloud Sync from Supabase & ensure brand favicon on launch
  useEffect(() => {
    applyOfficialBrandFavicon();
    syncFromSupabaseIfAvailable((freshRestaurants) => {
      setRestaurants(freshRestaurants);
    });
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [filterPromoOnly, setFilterPromoOnly] = useState<boolean>(false);
  const [filterFastDelivery, setFilterFastDelivery] = useState<boolean>(false);

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [simulatedFridayPause, setSimulatedFridayPause] = useState<boolean>(false);
  const [cateringQuotes, setCateringQuotes] = useState<CateringQuoteRequest[]>([]);

  // Friday Jumu'ah schedule check
  const jumuahStatus = getJumuahStatus(simulatedFridayPause);

  // Sound & Visual Notifications State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Helper to add visual toast + sound
  const showNotification = (
    title: string,
    message: string,
    type: "success" | "info" | "warning" | "error" = "info",
    soundType?: "cart" | "order" | "status" | "promo" | "success"
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date(),
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    if (soundEnabled) {
      if (soundType === "cart") playSoundCartAdd();
      else if (soundType === "order") playSoundOrderConfirmed();
      else if (soundType === "status") playSoundStatusUpdate();
      else if (soundType === "promo") playSoundPromoApplied();
      else if (soundType === "success") playSoundSuccessChime();
    }
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Checkout Props passing
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>("");
  const [selectedTip, setSelectedTip] = useState<number>(500);

  // Modals & Drawers Visibility
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState<Restaurant | null>(null);
  const [selectedRestaurantForBooking, setSelectedRestaurantForBooking] = useState<Restaurant | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER_PROFILE);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isChefAIOpen, setIsChefAIOpen] = useState<boolean>(false);
  const [isVoiceOrderOpen, setIsVoiceOrderOpen] = useState<boolean>(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState<boolean>(false);
  const [isGroupOrderOpen, setIsGroupOrderOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isHapdpModalOpen, setIsHapdpModalOpen] = useState<boolean>(false);
  const [isTechPackOpen, setIsTechPackOpen] = useState<boolean>(false);
  const [isCateringOpen, setIsCateringOpen] = useState<boolean>(false);
  const [isBlogOpen, setIsBlogOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isDistrictsModalOpen, setIsDistrictsModalOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isDishesCatalogOpen, setIsDishesCatalogOpen] = useState<boolean>(false);
  const [catalogMealMoment, setCatalogMealMoment] = useState<"all" | MealMoment>("all");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("Plateau (Ministères & Ambassades)");

  // New Requested Modals
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState<boolean>(false);
  const [isMarketingAIOpen, setIsMarketingAIOpen] = useState<boolean>(false);
  const [isWhatsAppAutomationOpen, setIsWhatsAppAutomationOpen] = useState<boolean>(false);
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isSpecialShareOpen, setIsSpecialShareOpen] = useState<boolean>(false);
  const [selectedSpecialForShare, setSelectedSpecialForShare] = useState<DailySpecial | null>(null);

  // Flattened all dishes across stored restaurants
  const allDishes = useMemo(() => restaurants.flatMap((r) => r.menu), [restaurants]);

  // Cart Calculations
  const cartTotal = cartItems.reduce((sum, it) => sum + it.totalPrice, 0);
  const cartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  // Add Item to Cart
  const handleAddToCart = (
    item: MenuItem,
    selectedOptions: Record<string, string>,
    quantity: number
  ) => {
    let unitPrice = item.price;
    if (item.options) {
      item.options.forEach((opt) => {
        const choiceLabel = selectedOptions[opt.name];
        const match = opt.choices.find((c) => c.label === choiceLabel);
        if (match) unitPrice += match.extraPrice;
      });
    }

    const newItemId = `${item.id}-${Object.values(selectedOptions).join("-")}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.id === newItemId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQ = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQ,
          totalPrice: newQ * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: newItemId,
            menuItem: item,
            quantity,
            selectedOptions,
            unitPrice,
            totalPrice: unitPrice * quantity,
          },
        ];
      }
    });

    showNotification(
      "Plat ajouté au panier 🛒",
      `${quantity}x ${item.name} (${(unitPrice * quantity).toLocaleString()} FCFA)`,
      "success",
      "cart"
    );
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity: newQty,
              totalPrice: it.unitPrice * newQty,
            }
          : it
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCheckout = (
    discount: number,
    promoCode: string,
    tip: number,
    cutlery: boolean
  ) => {
    setAppliedDiscount(discount);
    setAppliedPromoCode(promoCode);
    setSelectedTip(tip);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setActiveTrackingOrder(newOrder);
    showNotification(
      "Commande confirmée avec succès ! 🎉",
      `Commande #${newOrder.id} transmise à ${newOrder.restaurantName}. Suivi Billo Express activé.`,
      "success",
      "order"
    );
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: nextStatus } : o))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, orderStatus: nextStatus } : null));
    }

    if (nextStatus === "preparing") {
      playSoundOrderConfirmed();
      showNotification(
        "Commande confirmée & en cuisine ! 👨‍🍳",
        `Commande #${orderId} validée. Notification WhatsApp de confirmation envoyée au client.`,
        "success",
        "order"
      );
      if (targetOrder) {
        // Envoi automatique et multilingue de la notification WhatsApp de confirmation
        sendOrderConfirmationWhatsApp(targetOrder, currentLanguage);
      }
    } else {
      playSoundStatusUpdate();
      showNotification(
        "Statut de commande mis à jour 📲",
        `Commande #${orderId} est passée à l'étape : ${nextStatus.toUpperCase()}`,
        "info",
        "status"
      );
      if (targetOrder && (nextStatus === "delivering" || nextStatus === "delivered")) {
        sendOrderStatusNotificationWhatsApp(targetOrder, nextStatus, currentLanguage);
      }
    }
  };

  // 1-Click Reorder handler
  const handleReorder = (order: Order) => {
    setCartItems(order.items);
    setIsOrderHistoryOpen(false);
    setIsCartOpen(true);
    showNotification(
      "Articles réinjectés dans le panier 🔁",
      `${order.items.length} article(s) de la commande #${order.id} prêts pour commande rapide.`,
      "success",
      "cart"
    );
  };

  // Promo code direct application
  const handleApplyPromoCodeFromBanner = (code: string) => {
    setAppliedPromoCode(code);
    setAppliedDiscount(1500);
    showNotification(
      "Code promo appliqué ! 🎁",
      `Remise de 1 500 FCFA activée avec le code ${code}`,
      "success",
      "promo"
    );
  };

  // Add Daily Special directly to cart
  const handleAddDailySpecialToCart = (special: DailySpecial) => {
    const menuItem: MenuItem = {
      id: special.id,
      name: special.title,
      description: `${special.description} (Accompagnement : ${special.accompaniedBy})`,
      price: special.price,
      image: special.image,
      category: "Plat du Jour",
      isPopular: true,
      isHalal: true,
      preparationTime: 10,
    };

    handleAddToCart(menuItem, {}, 1);
    setIsCartOpen(true);
  };

  // Add Sauce Box directly to cart
  const handleAddSauceToCart = (sauce: SauceBox) => {
    const menuItem: MenuItem = {
      id: sauce.id,
      name: sauce.name,
      description: `${sauce.description} — ${sauce.volume} (Idéal avec: ${sauce.bestWith.join(", ")})`,
      price: sauce.price,
      image: sauce.image,
      category: "Sauces & Terroir",
      isPopular: sauce.isPopular,
      isHalal: true,
      isSpicy: sauce.spiceLevel.includes("Piquant") || sauce.spiceLevel.includes("Kan-Kan"),
      preparationTime: 5,
    };

    handleAddToCart(menuItem, {}, 1);
    setIsCartOpen(true);
  };

  // Handle Catering Quote Submission
  const handleCateringQuoteSubmit = (quote: CateringQuoteRequest) => {
    setCateringQuotes((prev) => [quote, ...prev]);
    showNotification(
      "Demande de devis traiteur envoyée 🍽️",
      "Notre équipe événementielle vous recontactera sous 2h ouvrées.",
      "success",
      "success"
    );
  };

  // Filter Restaurants
  const filteredRestaurants = restaurants.filter((resto) => {
    // Cuisine filter
    if (selectedCuisine !== "all" && resto.cuisineCategory !== selectedCuisine) {
      return false;
    }
    // Promo filter
    if (filterPromoOnly && !resto.promoBadge) {
      return false;
    }
    // Fast delivery filter (Livraison Express <= 55 min)
    if (filterFastDelivery && !resto.deliveryTime.includes("45-55") && !resto.deliveryTime.includes("45-50") && !resto.deliveryTime.includes("45")) {
      return false;
    }
    // Search query match (name, tagline, cuisine, or dishes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = resto.name.toLowerCase().includes(q);
      const matchCuisine = resto.cuisine.toLowerCase().includes(q);
      const matchDish = resto.menu.some(
        (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
      if (!matchName && !matchCuisine && !matchDish) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-slate-950">
      {/* Visual Notification Toasts */}
      <VisualNotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Universal Header with Role, City, Group Order, FAQ, Marketing AI & Account Switching */}
      <Header
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        serviceMode={serviceMode}
        onChangeServiceMode={setServiceMode}
        cartCount={cartCount}
        cartTotal={cartTotal}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChefAI={() => setIsChefAIOpen(true)}
        onOpenVoiceOrder={() => setIsVoiceOrderOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenGroupOrder={() => setIsGroupOrderOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onOpenTechPack={() => setIsTechPackOpen(true)}
        onOpenCatering={() => setIsCateringOpen(true)}
        onOpenBlog={() => setIsBlogOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenDistrictsDirectory={() => setIsDistrictsModalOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenMenu={() => {
          setCatalogMealMoment("all");
          setIsDishesCatalogOpen(true);
        }}
        onOpenOrdersHistory={() => setIsOrderHistoryOpen(true)}
        onOpenSauceBoxes={() => {
          const el = document.getElementById("sauce-boxes-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenMarketingAI={() => setIsMarketingAIOpen(true)}
        onOpenWhatsAppAutomation={() => setIsWhatsAppAutomationOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          setSoundEnabled((prev) => !prev);
          showNotification(
            soundEnabled ? "Notifications sonores désactivées" : "Notifications sonores activées 🔔",
            soundEnabled ? "Les effets audio ont été mis en sourdine." : "Les bips et retours audio sont maintenant actifs.",
            "info",
            !soundEnabled ? "success" : undefined
          );
        }}
      />

      {/* Main Content Rendered by Role */}
      <main className="flex-1 pb-20 md:pb-0">
        {/* ======================================================== */}
        {/* 1. ESPACE CLIENT                                         */}
        {/* ======================================================== */}
        {currentRole === "client" && (
          <div>
            {/* Friday Jumu'ah Prayer Delivery Pause Notice & Status Banner */}
            <JumuahBanner
              jumuahStatus={jumuahStatus}
              simulatedFridayPause={simulatedFridayPause}
              onToggleSimulatedFriday={() => {
                const nextVal = !simulatedFridayPause;
                setSimulatedFridayPause(nextVal);
                showNotification(
                  nextVal ? "Mode Vendredi Jumu'ah Activé 🕌" : "Mode Vendredi Jumu'ah Désactivé ✨",
                  nextVal
                    ? "Les livraisons directes sont en pause de 11h à 15h. Précommandes programmées autorisées."
                    : "Horaires de livraison standard rétablis.",
                  "info"
                );
              }}
              onOpenScheduleOrder={() => {
                if (cartItems.length > 0) {
                  setIsCheckoutOpen(true);
                } else {
                  setCatalogMealMoment("all");
                  setIsDishesCatalogOpen(true);
                }
              }}
            />

            {/* Hero & Search Banner */}
            <HeroBanner
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCuisine={selectedCuisine}
              onSelectCuisine={setSelectedCuisine}
              filterPromoOnly={filterPromoOnly}
              onTogglePromo={() => setFilterPromoOnly(!filterPromoOnly)}
              filterFastDelivery={filterFastDelivery}
              onToggleFastDelivery={() => setFilterFastDelivery(!filterFastDelivery)}
              onOpenChefAI={() => setIsChefAIOpen(true)}
              onOpenLogoModal={() => setIsLogoModalOpen(true)}
              onOpenDishesCatalog={() => {
                setCatalogMealMoment("all");
                setIsDishesCatalogOpen(true);
              }}
              onOpenDishesCatalogWithMoment={(moment) => {
                setCatalogMealMoment(moment);
                setIsDishesCatalogOpen(true);
              }}
            />

            {/* Active Live Order Pill Banner if tracking */}
            {orders.length > 0 && orders[0].orderStatus !== "delivered" && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-4 relative z-20">
                <div
                  onClick={() => setActiveTrackingOrder(orders[0])}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 border border-orange-400/50 shadow-2xl flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform text-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                        Commande en cours #{orders[0].id}
                      </span>
                      <h4 className="text-xs font-bold mt-0.5">
                        {orders[0].restaurantName} &bull; État :{" "}
                        <strong className="underline uppercase">{orders[0].orderStatus}</strong>
                      </h4>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-xl bg-slate-950 text-orange-400 font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <span>Suivre avec Billo Express</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => {
                    setCatalogMealMoment("all");
                    setIsDishesCatalogOpen(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold whitespace-nowrap cursor-pointer transition"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Grande Carte (65+ Plats)</span>
                </button>

                <button
                  onClick={() => setIsOrderHistoryOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold whitespace-nowrap cursor-pointer transition"
                >
                  <Clock className="w-4 h-4" />
                  <span>Historique des Commandes</span>
                </button>

                <button
                  onClick={() => setIsMarketingAIOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold whitespace-nowrap cursor-pointer transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>IA Marketing &amp; Croissance</span>
                </button>

                <button
                  onClick={() => setIsWhatsAppAutomationOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold whitespace-nowrap cursor-pointer transition"
                >
                  <Users className="w-4 h-4" />
                  <span>Automatisation WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsFaqOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold whitespace-nowrap cursor-pointer transition"
                >
                  <span>FAQ &amp; Guide Niamey</span>
                </button>
              </div>
            </div>

            {/* Flash Midi Banner for Offices */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <FlashMidiBanner
                onOpenGroupOrder={() => setIsGroupOrderOpen(true)}
                onApplyPromoCode={handleApplyPromoCodeFromBanner}
              />
            </div>

            {/* Section: Plats du Jour & Suggestions Fraîches */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                      ⚡ Plats du Jour &bull; 11h - 15h
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Préparés ce matin à Niamey</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Les Spécialités Fraîches du Sahel
                  </h2>
                </div>
                <button
                  onClick={() => setIsChefAIOpen(true)}
                  className="text-xs text-orange-400 font-bold hover:underline self-start sm:self-auto flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Demander conseil à AllôChef IA</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {DAILY_SPECIALS_DATA.map((special) => (
                  <DailySpecialCard
                    key={special.id}
                    special={special}
                    onAddToCart={handleAddDailySpecialToCart}
                    onShareSpecial={(spec) => {
                      setSelectedSpecialForShare(spec);
                      setIsSpecialShareOpen(true);
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Main Restaurants Directory Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span>Restaurants disponibles à</span>
                    <span className="text-orange-500">{selectedCity}</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {filteredRestaurants.length} établissement(s) ouvert(s) avec livraison rapide
                  </p>
                </div>

                {/* Service Mode Indicator Badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                    Mode :{" "}
                    <strong className="text-orange-400 uppercase">
                      {serviceMode === "delivery"
                        ? "Livraison Express"
                        : serviceMode === "takeaway"
                        ? "À Emporter"
                        : "Réservation Table"}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Restaurants Grid */}
              {filteredRestaurants.length === 0 ? (
                <div className="p-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
                  <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Aucun restaurant trouvé</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Essayez de réinitialiser vos filtres ou effectuez une autre recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCuisine("all");
                      setFilterPromoOnly(false);
                      setFilterFastDelivery(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((resto) => (
                    <RestaurantCard
                      key={resto.id}
                      restaurant={resto}
                      serviceMode={serviceMode}
                      onOpenMenu={(r) => setSelectedRestaurantForMenu(r)}
                      onBookTable={(r) => setSelectedRestaurantForBooking(r)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section: Box Sauces Terroir & Bocaux Hermétiques */}
            <div id="sauce-boxes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SauceBoxesSection
                onAddSauceToCart={handleAddSauceToCart}
                onOpenCatering={() => setIsCateringOpen(true)}
              />
            </div>

            {/* Section: Répertoire des Quartiers de Niamey & Calculateur de Frais */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <DeliveryDistrictsWidget
                onOpenFullCalculator={() => setIsDistrictsModalOpen(true)}
                onSelectDistrictForDelivery={(district) => {
                  setSelectedDistrictName(district.name);
                  if (cartItems.length > 0) {
                    setIsCheckoutOpen(true);
                  } else {
                    setIsDistrictsModalOpen(true);
                  }
                }}
              />
            </div>

            {/* Strategic Value Proposition for Allôresto Users */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/20 space-y-8">
                <div className="max-w-2xl space-y-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Pourquoi choisir Allôresto Niger ?
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Une expérience gastronomique complète pensée pour Niamey
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Allôresto réunit en une seule application web mobile l&apos;ensemble de l&apos;écosystème de la restauration :
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                      🛵
                    </div>
                    <h4 className="text-sm font-bold text-white">Clients &amp; Bureaux</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Recherche rapide, commande de groupe entre collègues, paiement en espèces ou Airtel Money, livraison ponctuelle au bureau par Billo Express.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      🏪
                    </div>
                    <h4 className="text-sm font-bold text-white">Restaurants Partenaires</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tableau de bord gérant avec réception des commandes, modification des menus en direct, gestion des stocks et hausse du chiffre d&apos;affaires.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      🚴
                    </div>
                    <h4 className="text-sm font-bold text-white">Livreurs Billo Express</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Application dédiée avec radar GPS des courses disponibles, rémunération transparente, pourboires 100% conservés et gestion des créneaux.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ESPACE RESTAURANT                                     */}
        {/* ======================================================== */}
        {currentRole === "restaurant" && (
          <RestaurantDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ======================================================== */}
        {/* 3. ESPACE LIVREUR                                        */}
        {/* ======================================================== */}
        {currentRole === "courier" && (
          <CourierDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ======================================================== */}
        {/* 4. ESPACE ADMIN                                          */}
        {/* ======================================================== */}
        {currentRole === "admin" && (
          <AdminDashboard
            onOpenTechPack={() => setIsTechPackOpen(true)}
            onUpdateRestaurants={(updated) => setRestaurants(updated)}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      {/* 1. Restaurant Menu Modal */}
      <RestaurantMenuModal
        restaurant={selectedRestaurantForMenu}
        isOpen={!!selectedRestaurantForMenu}
        onClose={() => setSelectedRestaurantForMenu(null)}
        onAddToCart={handleAddToCart}
        onBookTable={(resto) => setSelectedRestaurantForBooking(resto)}
        serviceMode={serviceMode}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        restaurantName={
          cartItems.length > 0 ? "Votre sélection Allôresto" : undefined
        }
        serviceMode={serviceMode}
        onChangeServiceMode={setServiceMode}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        restaurantId={
          selectedRestaurantForMenu?.id || RESTAURANTS_DATA[0].id
        }
        restaurantName={
          selectedRestaurantForMenu?.name || RESTAURANTS_DATA[0].name
        }
        restaurantPhone={
          selectedRestaurantForMenu?.phone || RESTAURANTS_DATA[0].phone
        }
        serviceMode={serviceMode}
        city={selectedCity}
        discount={appliedDiscount}
        promoCode={appliedPromoCode}
        tip={selectedTip}
        onOrderPlaced={handleOrderPlaced}
        onOpenDistrictsDirectory={() => setIsDistrictsModalOpen(true)}
        initialDistrictName={selectedDistrictName}
        simulatedFridayPause={simulatedFridayPause}
        currentLanguage={currentLanguage}
      />

      {/* 4. Live Order Tracker Modal */}
      <LiveOrderTracker
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        onAdvanceStatus={handleUpdateOrderStatus}
        onViewReceipt={(order) => setActiveReceiptOrder(order)}
        simulatedFridayPause={simulatedFridayPause}
      />

      {/* 4b. Official Thermal Receipt Ticket Modal */}
      <ReceiptTicketModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        onTrackOrder={(order) => {
          setActiveReceiptOrder(null);
          setActiveTrackingOrder(order);
        }}
      />

      {/* 5. AllôChef AI Concierge Modal (Gemini 3.7) */}
      <AlloChefModal
        isOpen={isChefAIOpen}
        onClose={() => setIsChefAIOpen(false)}
        onAddToCart={handleAddToCart}
        onSelectRestaurant={(r) => setSelectedRestaurantForMenu(r)}
      />

      {/* 6. Table Booking Modal */}
      <TableBookingModal
        restaurant={selectedRestaurantForBooking}
        isOpen={!!selectedRestaurantForBooking}
        onClose={() => setSelectedRestaurantForBooking(null)}
        onBookingConfirmed={(booking: TableBooking) => {
          showNotification(
            "Réservation de table confirmée ! 🍽️",
            `Table réservée pour ${booking.guests || booking.guestCount || 2} pers. le ${booking.date} à ${booking.time}`,
            "success",
            "success"
          );
        }}
      />

      {/* 7. Group Order Modal */}
      <GroupOrderModal
        isOpen={isGroupOrderOpen}
        onClose={() => setIsGroupOrderOpen(false)}
        onSelectRestaurantMenu={(resto) => {
          setSelectedRestaurantForMenu(resto);
          setIsGroupOrderOpen(false);
        }}
      />

      {/* 8. User Account & 1-Click Re-Order Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        onReorder={handleReorder}
        onOpenDataProtection={() => setIsHapdpModalOpen(true)}
      />

      {/* 8b. Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
          showNotification(
            "Connexion réussie",
            `Bienvenue ${user.name} sur Allôresto !`,
            "success",
            "success"
          );
        }}
        onLogout={() => {
          setCurrentUser(null);
          setIsAuthOpen(false);
          showNotification(
            "Déconnexion",
            "Vous avez été déconnecté.",
            "info"
          );
        }}
        onOpenDataProtection={() => {
          setIsAuthOpen(false);
          setIsHapdpModalOpen(true);
        }}
      />

      {/* 9. HAPDP Data Protection Modal (Niger) */}
      <HapdpDataModal
        isOpen={isHapdpModalOpen}
        onClose={() => setIsHapdpModalOpen(false)}
      />

      {/* 10. Restaurant Partner Registration Modal */}
      <PartnerRegistrationModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* 11. Tech Pack & Supabase Architecture Modal */}
      <TechPackModal
        isOpen={isTechPackOpen}
        onClose={() => setIsTechPackOpen(false)}
      />

      {/* 12. Service Traiteur & Événements Modal */}
      <CateringModal
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
        onSubmitQuote={handleCateringQuoteSubmit}
      />

      {/* 13. Blog Culinaire & Saveurs du Sahel Modal */}
      <CulinaryBlogModal
        isOpen={isBlogOpen}
        onClose={() => setIsBlogOpen(false)}
      />

      {/* 14. Rubrique Contacts & Support Officiel Allôresto */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOrderNow={() => {
          setIsContactOpen(false);
          window.scrollTo({ top: 450, behavior: "smooth" });
        }}
        onOpenPartnerModal={() => {
          setIsContactOpen(false);
          setIsPartnerModalOpen(true);
        }}
        onOpenCourierSpace={() => {
          setIsContactOpen(false);
          setCurrentRole("courier");
        }}
        onOpenDataProtection={() => {
          setIsContactOpen(false);
          setIsHapdpModalOpen(true);
        }}
        onOpenCatering={() => {
          setIsContactOpen(false);
          setIsCateringOpen(true);
        }}
      />

      {/* 15. Répertoire et Calculateur Officiel des Quartiers de Niamey */}
      <DeliveryFeeCalculatorModal
        isOpen={isDistrictsModalOpen}
        onClose={() => setIsDistrictsModalOpen(false)}
        selectedDistrictId={selectedDistrictName}
        onSelectDistrict={(district) => {
          setSelectedDistrictName(district.name);
          setIsDistrictsModalOpen(false);
          if (cartItems.length > 0) {
            setIsCheckoutOpen(true);
          }
        }}
      />

      {/* 16. Présentation et Charte du Logo Intelligent Allôresto */}
      <LogoPresentationModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* 17. Grande Carte & Catalogue des Plats (Petit-déj, Déjeuner, Dîner, Menus du jour, Africain, Européen...) */}
      <DishesCatalogModal
        isOpen={isDishesCatalogOpen}
        onClose={() => setIsDishesCatalogOpen(false)}
        dishes={allDishes}
        restaurants={restaurants}
        initialMealMoment={catalogMealMoment}
        onAddToCart={(item) => {
          handleAddToCart(item, {}, 1);
          setIsCartOpen(true);
        }}
        onSelectRestaurant={(resto) => setSelectedRestaurantForMenu(resto)}
        onOpenRestaurantMenu={(restaurantId) => {
          const foundResto = restaurants.find((r) => r.id === restaurantId);
          if (foundResto) {
            setSelectedRestaurantForMenu(foundResto);
          }
        }}
      />

      {/* 18. Historique Complet des Commandes */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onReorder={handleReorder}
        onTrackOrder={(order) => {
          setIsOrderHistoryOpen(false);
          setActiveTrackingOrder(order);
        }}
        onContactSupport={() => {
          setIsOrderHistoryOpen(false);
          setIsContactOpen(true);
        }}
      />

      {/* 19. IA Marketing & Automatisation de Croissance */}
      <MarketingAIModal
        isOpen={isMarketingAIOpen}
        onClose={() => setIsMarketingAIOpen(false)}
        onApplyDiscountCampaign={(code, discount) => {
          setAppliedPromoCode(code);
          setAppliedDiscount(discount);
          showNotification(
            "Campagne Marketing Activée ! 🚀",
            `Code promo ${code} (${discount.toLocaleString()} FCFA) prêt pour vos clients.`,
            "success",
            "promo"
          );
        }}
      />

      {/* 20. Centre d'Automatisation WhatsApp */}
      <WhatsAppAutomationModal
        isOpen={isWhatsAppAutomationOpen}
        onClose={() => setIsWhatsAppAutomationOpen(false)}
        recentOrders={orders}
      />

      {/* 20b. Partage Réseaux Sociaux & Affiche Flyer IA (Veille 20h / Matin 08h) */}
      <DailySpecialShareModal
        isOpen={isSpecialShareOpen}
        onClose={() => setIsSpecialShareOpen(false)}
        special={selectedSpecialForShare || DAILY_SPECIALS_DATA[0]}
      />

      {/* 21. FAQ Dynamique & Assistance 24/7 */}
      <DynamicFaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onOpenContact={() => {
          setIsFaqOpen(false);
          setIsContactOpen(true);
        }}
        onOpenDistrictsCalculator={() => {
          setIsFaqOpen(false);
          setIsDistrictsModalOpen(true);
        }}
      />

      {/* 22. Commande Vocale Intelligente (Speech Recognition Niger) */}
      <VoiceOrderModal
        isOpen={isVoiceOrderOpen}
        onClose={() => setIsVoiceOrderOpen(false)}
        availableDishes={allDishes}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onAddToCart={(dish, optionsOrQty, quantity) => {
          const actualQty = typeof optionsOrQty === "number" ? optionsOrQty : (quantity || 1);
          const actualOpts = typeof optionsOrQty === "object" ? optionsOrQty : {};
          handleAddToCart(dish, actualOpts, actualQty);
          setIsCartOpen(true);
          showNotification(
            "Plat ajouté par la voix 🎙️",
            `${actualQty}x ${dish.name} ajouté(s) à votre panier.`,
            "success",
            "cart"
          );
        }}
        onDirectCheckout={(orderItems) => {
          orderItems.forEach((item) => {
            handleAddToCart(item.dish, {}, item.quantity);
          });
          setIsCheckoutOpen(true);
          showNotification(
            "Commande vocale prête pour livraison 🚀",
            "Vérifiez l'adresse et le mode de règlement.",
            "success",
            "promo"
          );
        }}
      />

      {/* Floating Commande Vocale Trigger Button */}
      {currentRole === "client" && (
        <button
          onClick={() => setIsVoiceOrderOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white font-black text-xs shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 group"
          title="Commander à la voix (Microphone)"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <Mic className="w-4 h-4 text-white group-hover:animate-pulse" />
          <span className="hidden sm:inline">Commande Vocale</span>
        </button>
      )}

      {/* PWA Mobile App Install Prompt for Android */}
      <PwaInstallPrompt />

      {/* Universal Footer */}
      <Footer
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenDataProtection={() => setIsHapdpModalOpen(true)}
        onOpenCatering={() => setIsCateringOpen(true)}
        onOpenBlog={() => setIsBlogOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenChefAI={() => setIsChefAIOpen(true)}
        onOpenDistrictsDirectory={() => setIsDistrictsModalOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
      />

      {/* Responsive Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        cartCount={cartCount}
        cartTotal={cartTotal}
        currentLanguage={currentLanguage}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChefAI={() => setIsChefAIOpen(true)}
        onOpenVoiceOrder={() => setIsVoiceOrderOpen(true)}
        onOpenGroupOrder={() => setIsGroupOrderOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenTechPack={() => setIsTechPackOpen(true)}
        onOpenMenu={() => {
          setCatalogMealMoment("all");
          setIsDishesCatalogOpen(true);
        }}
        onOpenOrdersHistory={() => setIsOrderHistoryOpen(true)}
        onOpenSauceBoxes={() => {
          const el = document.getElementById("sauce-boxes-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenMarketingAI={() => setIsMarketingAIOpen(true)}
      />
    </div>
  );
}

export default App;
