export type UserRole = "client" | "restaurant" | "courier" | "admin";

export type ServiceMode = "delivery" | "takeaway" | "booking";

export interface MenuItemOptionChoice {
  label: string;
  extraPrice: number;
}

export interface MenuItemOption {
  name: string;
  required?: boolean;
  choices: MenuItemOptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isHalal?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  preparationTime?: number;
  options?: MenuItemOption[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  cuisineCategory: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  address: string;
  city: string;
  image: string;
  bannerImage: string;
  isPromoted?: boolean;
  promoBadge?: string;
  isOpen: boolean;
  openingHours: string;
  phone: string;
  services: ServiceMode[];
  menu: MenuItem[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  participantName?: string; // For Group Orders (e.g., "Amadou", "Mariama")
}

export type PaymentMethod =
  | "mynita"
  | "amanata"
  | "al_izza_business"
  | "al_izza_transfer"
  | "zeyna"
  | "mobile_money"
  | "cash"
  | "card"
  | "apple_pay";

export interface LocalPaymentOption {
  id: PaymentMethod;
  name: string;
  category: "mobile_agency" | "telco" | "cash" | "card";
  depositNumber?: string;
  depositName?: string;
  instructions: string;
  badge?: string;
}

export type OrderStatus = "received" | "preparing" | "delivering" | "delivered";

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  serviceType: ServiceMode;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  tip: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending";
  orderStatus: OrderStatus;
  estimatedDeliveryTime: string;
  scheduledTime?: string; // Ex: "Aujourd'hui à 12h30 (Midi au Bureau)"
  deliveryPartner?: string; // "Billo Express Niamey 🏍️"
  courierName?: string;
  courierPhone?: string;
  isGroupOrder?: boolean;
  groupSessionCode?: string;
  cashChangeAmount?: string; // e.g. "Prévoir la monnaie sur 10 000 FCFA"
}

export interface GroupOrderMember {
  id: string;
  name: string;
  department?: string; // e.g. "Direction Financière"
  itemsCount: number;
  subtotal: number;
}

export interface GroupOrderSession {
  id: string;
  code: string; // e.g. "ALLO-PLATEAU-88"
  title: string; // e.g. "Déjeuner Équipe Ministère des Finances"
  creatorName: string;
  restaurantId: string;
  restaurantName: string;
  cutoffTime: string; // e.g. "11:45"
  deliveryAddress: string;
  scheduledTime: string; // e.g. "12:30"
  members: GroupOrderMember[];
  isActive: boolean;
}

export interface TableBooking {
  id: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: "confirmed" | "pending";
  createdAt: string;
}

export interface CuisineFilter {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CityOption {
  name: string;
  country: string;
  popular?: boolean;
}

export interface SavedAddress {
  id: string;
  label: string; // e.g. "🏢 Bureau Ministère (Plateau)", "🏠 Domicile Koira Kano"
  address: string;
  notes?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  loyaltyPoints: number;
  sahelClubTier: "Bronze" | "Argent" | "Or" | "VIP Sahélien";
  savedAddresses: SavedAddress[];
  favoriteRestaurantIds: string[];
  referralCode?: string;
  referralCount?: number;
}

export interface DailySpecial {
  id: string;
  title: string;
  restaurantName: string;
  restaurantId: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  servingsLeft: number;
  availableUntil: string;
  accompaniedBy: string;
  tags: string[];
}

export interface CateringQuoteRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventType: "mariage" | "bapteme" | "dot" | "anniversaire" | "brunch" | "entreprise" | "soutenance" | "pique_nique" | "box_sauces";
  guestCount: number;
  eventDate: string;
  budgetFCFA: number;
  location: string;
  culinaryPreferences: string;
  notes?: string;
  status: "pending" | "quoted" | "confirmed";
  createdAt: string;
}

export interface SauceBox {
  id: string;
  name: string;
  volume: string; // e.g. "Bocal 500ml", "Grand Format 1L", "Pack Dégustation 3 x 250ml"
  description: string;
  price: number;
  spiceLevel: "Doux" | "Moyen" | "Piquant Sahélien 🔥" | "Kan-Kan Explosif 🌶️🌶️";
  bestWith: string[]; // e.g. ["Riz blanc", "Dambou", "Pintade", "Choukouya"]
  image: string;
  isPopular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
}
