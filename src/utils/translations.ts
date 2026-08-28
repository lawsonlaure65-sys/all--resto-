import { AppLanguage } from "../types";

export type { AppLanguage };

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  native: string;
  flag: string;
  speechCode: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "fr",
    label: "Français",
    native: "Français",
    flag: "🇫🇷",
    speechCode: "fr-FR",
    description: "Langue officielle & administration",
  },
  {
    code: "en",
    label: "English",
    native: "English",
    flag: "🇬🇧",
    speechCode: "en-US",
    description: "International, NGOs & Expats",
  },
  {
    code: "ha",
    label: "Haoussa",
    native: "Harshen Hausa",
    flag: "🇳🇪",
    speechCode: "ha-NE",
    description: "Yaren Hausa na Nijar",
  },
  {
    code: "zm",
    label: "Zarma",
    native: "Zarmaciine",
    flag: "🇳🇪",
    speechCode: "dje-NE",
    description: "Ciine Zarma / Djerma na Niamey",
  },
];

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  fr: {
    // Nav & General
    app_name: "Allôresto Niamey",
    tagline: "La première plateforme de restauration & livraison de repas à Niamey",
    pickup_point: "Point de retrait : Grande Mosquée Mouhamar Khadafi",
    home: "Accueil",
    menu_catalog: "Menu (65+ Plats)",
    orders: "Commandes",
    boxes: "Boxs & Sauces",
    events: "Évents Traiteur",
    group_order: "Groupe Bureau",
    account: "Compte",
    loyalty: "Fidélité",
    voice_order: "Commande Vocale",
    chef_ai: "AllôChef IA",
    cart: "Panier",
    free_delivery_badge: "Livraison Express Billo",
    change_role: "Changer d'Espace",
    role_client: "Espace Client",
    role_restaurant: "Espace Restaurant",
    role_courier: "Espace Livreur",
    role_admin: "Espace Admin",

    // Hero
    hero_title: "Savourez le meilleur de Niamey chez vous ou au bureau",
    hero_subtitle: "Plats sahéliens authentiques, grillades de mouton, dambou royal, poissons du fleuve Niger & cuisines du monde livrés en 25 à 35 minutes.",
    order_now: "Commander maintenant",
    voice_order_cta: "🎙️ Commander par la Voix",
    view_full_menu: "Découvrir nos 65+ plats",

    // Search & Filters
    search_placeholder: "Rechercher un plat, grillade, burger, dambou, boisson...",
    filter_all: "Tous les Délices",
    filter_choukouya: "Grillades & Choukouya",
    filter_dambou: "Dambou & Spécialités",
    filter_fish: "Poissons du Fleuve",
    filter_drinks: "Boissons Locales & Jus",
    filter_boxes: "Boxs & Packs",

    // Voice Order
    voice_modal_title: "Commande Vocale Intelligente",
    voice_modal_subtitle: "Parlez simplement en Français, Anglais, Haoussa ou Zarma",
    voice_listening: "Écoute en cours... Parlez maintenant",
    voice_click_to_speak: "Appuyez sur le micro pour parler",
    voice_detected_items: "Plats détectés par la voix :",
    voice_add_all_to_cart: "Ajouter ces plats au panier",
    voice_example_prompt: "Exemples de commandes à dicter :",
    voice_speak_feedback: "Ajouté avec succès !",

    // WhatsApp Interaction
    wa_kitchen_channel: "Canal WhatsApp Cuisine ➔ Client",
    wa_client_channel: "Échanger avec la Cuisine par WhatsApp",
    wa_send_btn: "Envoyer sur WhatsApp",
    wa_cooking_started: "Cuisson lancée & Commande Confirmée",
    wa_eta_adjust: "Ajuster temps de cuisson",
    wa_order_ready: "Prêt & Remis au Livreur",

    // Live Tracking
    tracking_title: "Suivi de Commande en Direct",
    status_received: "Reçue",
    status_preparing: "En Cuisine",
    status_delivering: "En Route",
    status_delivered: "Livrée",
    estimated_arrival: "Arrivée estimée :",
    courier_assigned: "Livreur Billo Express assigné :",

    // Payment & Cash
    payment_method: "Mode de paiement",
    payment_mynita: "Mynita",
    payment_amanata: "Amanata",
    payment_airtel: "Airtel Money",
    payment_moov: "Moov Money Flooz",
    payment_cash: "Espèces à la livraison",
  },

  en: {
    // Nav & General
    app_name: "Allôresto Niamey",
    tagline: "The premier food ordering & delivery platform in Niamey, Niger",
    pickup_point: "Pickup spot: Grand Mosque Mouhamar Gaddafi",
    home: "Home",
    menu_catalog: "Menu (65+ Dishes)",
    orders: "My Orders",
    boxes: "Boxes & Sauces",
    events: "Catering & Events",
    group_order: "Office Group Order",
    account: "Account",
    loyalty: "Loyalty Club",
    voice_order: "Voice Order",
    chef_ai: "AllôChef AI",
    cart: "Cart",
    free_delivery_badge: "Billo Express Delivery",
    change_role: "Switch Workspace",
    role_client: "Customer Space",
    role_restaurant: "Restaurant Portal",
    role_courier: "Courier Space",
    role_admin: "Admin Console",

    // Hero
    hero_title: "Taste the finest flavors of Niamey at home or the office",
    hero_subtitle: "Authentic Sahelian dishes, charcoal grilled lamb, royal dambou, Niger river fish & global cuisines delivered in 25 to 35 minutes.",
    order_now: "Order Now",
    voice_order_cta: "🎙️ Order with Your Voice",
    view_full_menu: "Explore 65+ dishes",

    // Search & Filters
    search_placeholder: "Search for a dish, BBQ, burger, dambou, drinks...",
    filter_all: "All Delights",
    filter_choukouya: "BBQ & Choukouya",
    filter_dambou: "Dambou & Specialties",
    filter_fish: "River Fish",
    filter_drinks: "Local Juices & Drinks",
    filter_boxes: "Boxes & Packs",

    // Voice Order
    voice_modal_title: "Smart Multilingual Voice Ordering",
    voice_modal_subtitle: "Speak naturally in English, French, Hausa, or Zarma",
    voice_listening: "Listening now... Please speak",
    voice_click_to_speak: "Tap microphone to speak",
    voice_detected_items: "Dishes recognized by voice:",
    voice_add_all_to_cart: "Add recognized dishes to cart",
    voice_example_prompt: "Sample voice commands to try:",
    voice_speak_feedback: "Successfully added to cart!",

    // WhatsApp Interaction
    wa_kitchen_channel: "Kitchen ➔ Customer WhatsApp Channel",
    wa_client_channel: "Chat with Kitchen via WhatsApp",
    wa_send_btn: "Send on WhatsApp",
    wa_cooking_started: "Cooking started & Order Confirmed",
    wa_eta_adjust: "Adjust Cooking ETA",
    wa_order_ready: "Ready & Handed to Courier",

    // Live Tracking
    tracking_title: "Live Order Tracking",
    status_received: "Received",
    status_preparing: "Cooking in Kitchen",
    status_delivering: "Out for Delivery",
    status_delivered: "Delivered",
    estimated_arrival: "Estimated delivery time:",
    courier_assigned: "Assigned Billo Express courier:",

    // Payment & Cash
    payment_method: "Payment Method",
    payment_mynita: "Mynita",
    payment_amanata: "Amanata",
    payment_airtel: "Airtel Money",
    payment_moov: "Moov Money Flooz",
    payment_cash: "Cash on delivery",
  },

  ha: {
    // Nav & General
    app_name: "Allôresto Yamai (Niamey)",
    tagline: "Babban dandalin yin odar abinci da kaiwa gida a Yamai, Nijar",
    pickup_point: "Wurin karba : Babban Masallacin Gaddafi (Niamey)",
    home: "Farko / Gida",
    menu_catalog: "Jerin Abinci (Plats 65+)",
    orders: "Oda na",
    boxes: "Akwatin Abinci & Miya",
    events: "Biki da Taron Ofis",
    group_order: "Odar Kungiyar Ofis",
    account: "Asusu na",
    loyalty: "Lada & Kyaututtuka",
    voice_order: "Oda da Murya (Magana)",
    chef_ai: "AllôChef AI",
    cart: "Kayan da aka Zaba",
    free_delivery_badge: "Isar da sauri Billo Express",
    change_role: "Sauya Sashe",
    role_client: "Sashen Masu Saye",
    role_restaurant: "Sashen Gidan Abinci",
    role_courier: "Sashen Mai Kai Abinci",
    role_admin: "Sashen Manajoji",

    // Hero
    hero_title: "Dandani daddadan abincin Yamai a gidanka ko ofis dinka",
    hero_subtitle: "Kayan abincin gargajiya na Sahel, gasasshen naman rago (Choukouya), dambou royal, kifin kogin Kwara (Niger) cikin minti 25 zuwa 35.",
    order_now: "Yi Oda Yanzu",
    voice_order_cta: "🎙️ Yi Oda da Murya",
    view_full_menu: "Duba dukkan abinci 65+",

    // Search & Filters
    search_placeholder: "Nemi abinci, nama, burger, dambou, ruwan lemo...",
    filter_all: "Dukkan Abinci",
    filter_choukouya: "Gasasshen Nama & Choukouya",
    filter_dambou: "Dambou & Na Musamman",
    filter_fish: "Kifin Kogin Kwara",
    filter_drinks: "Abubuwan Sha & Bissap",
    filter_boxes: "Akwatin Abinci",

    // Voice Order
    voice_modal_title: "Oda da Murya cikin Harshen Hausa / Faransanci",
    voice_modal_subtitle: "Yi magana kai tsaye: 'Ina son Choukouya da Bissap biyu'",
    voice_listening: "Ina saurarenka... Fara magana yanzu",
    voice_click_to_speak: "Danna alamar magana don fara magana",
    voice_detected_items: "Abincin da aka gane da murya :",
    voice_add_all_to_cart: "Sanya su a kwandon saya",
    voice_example_prompt: "Misalan abubuwan da zaka iya fada :",
    voice_speak_feedback: "An sanya a kwandon saya lafiya !",

    // WhatsApp Interaction
    wa_kitchen_channel: "Tattaunawa tsakanin Kicin da Mai Saye (WhatsApp)",
    wa_client_channel: "Aika sako zuwa kicin da WhatsApp",
    wa_send_btn: "Aika ta WhatsApp",
    wa_cooking_started: "An fara dafa abinci & An tabbatar da oda",
    wa_eta_adjust: "Karin lokacin dafawa",
    wa_order_ready: "Abinci ya shirya, an ba mai babur",

    // Live Tracking
    tracking_title: "Bibiyar Odar Ka kai Tsaye",
    status_received: "An Karba",
    status_preparing: "Ana Dafa a Kicin",
    status_delivering: "Yana Kan Hanya",
    status_delivered: "An Kai Lafiya",
    estimated_arrival: "Lokacin isowa :",
    courier_assigned: "Mai kawo abinci na Billo Express :",

    // Payment & Cash
    payment_method: "Hanyar Biyan Kudi",
    payment_mynita: "Mynita",
    payment_amanata: "Amanata",
    payment_airtel: "Airtel Money",
    payment_moov: "Moov Money Flooz",
    payment_cash: "Kudi a hannu (Cash idan an kawo)",
  },

  zm: {
    // Nav & General
    app_name: "Allôresto Niamey",
    tagline: "Niamey ŋwaari heebandi nda kande do do cimi dumi",
    pickup_point: "Ŋwaari zaa do : Gaddafi Juuma mise do (Niamey)",
    home: "Farka / Fu",
    menu_catalog: "Ŋwaari Dumi-dumi (65+)",
    orders: "Ay Ŋwaareyaŋ",
    boxes: "Ŋwaari Bata nda Hawari",
    events: "Boro Booboyaŋ Ŋwaari",
    group_order: "Gondi Ofis Ŋwaari",
    account: "Ay Asusu",
    loyalty: "Baani & Nooru gani",
    voice_order: "Ciine/Jinde Ŋwaari Noo",
    chef_ai: "AllôChef AI",
    cart: "Ŋwaari Kaa I Za",
    free_delivery_badge: "Billo Express ga kande ni se",
    change_role: "Bere Sashe",
    role_client: "Daykow Sashe",
    role_restaurant: "Ŋwaari Teedo Sashe",
    role_courier: "Ŋwaari Kandekow",
    role_admin: "Jineborey Sashe",

    // Hero
    hero_title: "Dandani Niamey ŋwaari kaano ni fu kulu wala ofis ra",
    hero_subtitle: "Sahel ŋwaari hanno, ham tonte (Choukouya), dambou royal, Isa hari ham (Niger) minti 25 hala 35 ra.",
    order_now: "Ŋwaari Noo Sohõ",
    voice_order_cta: "🎙️ Noo Ŋwaari nda ni Jinde",
    view_full_menu: "Guna ŋwaari 65+ kulu",

    // Search & Filters
    search_placeholder: "Ceeci ŋwaari, ham, burger, dambou, hari kaana...",
    filter_all: "Ŋwaarey Kulu",
    filter_choukouya: "Ham Tonte & Choukouya",
    filter_dambou: "Dambou & Mise Hanno",
    filter_fish: "Isa Hari Ham",
    filter_drinks: "Bissap nda Hari Kaana",
    filter_boxes: "Ŋwaari Bata",

    // Voice Order
    voice_modal_title: "Ŋwaari Noo nda Zarmaciine / Faransi Jinde",
    voice_modal_subtitle: "Salaŋ sohõ : 'Ay ba Choukouya nda Bissap hinka'",
    voice_listening: "Ay ga hanga... Salaŋ sohõ",
    voice_click_to_speak: "Karu micro ga ka salaŋ",
    voice_detected_items: "Ŋwaarey kaŋ jindo zaa :",
    voice_add_all_to_cart: "Dake i ga bata ra",
    voice_example_prompt: "Mise kaŋ ni ga hin ka ci :",
    voice_speak_feedback: "A daŋ bata ra hanno !",

    // WhatsApp Interaction
    wa_kitchen_channel: "Kicin nda Daykow WhatsApp Diyaŋ",
    wa_client_channel: "Sanba sako kicin se WhatsApp ra",
    wa_send_btn: "Sanba WhatsApp ra",
    wa_cooking_started: "Ŋwaari teeyaŋ sindin & A tabatandi",
    wa_eta_adjust: "Alwakti tonton",
    wa_order_ready: "Ŋwaari teeyaŋ ban, a noondi kandekow se",

    // Live Tracking
    tracking_title: "Guna ni Ŋwaaro fonda ra sohõ",
    status_received: "A Zaandi",
    status_preparing: "I go g'a te Kicin ra",
    status_delivering: "A go Fonda ra",
    status_delivered: "A Kande ban",
    estimated_arrival: "Alwakti kaŋ a ga to :",
    courier_assigned: "Billo Express kandekow :",

    // Payment & Cash
    payment_method: "Nooru Nooyaŋ Fonda",
    payment_mynita: "Mynita",
    payment_amanata: "Amanata",
    payment_airtel: "Airtel Money",
    payment_moov: "Moov Money Flooz",
    payment_cash: "Nooru cimi kande do (Cash)",
  },
};

/**
 * Helper to fetch translation with fallback to French
 */
export function t(lang: AppLanguage | string = "fr", key: string): string {
  const safeLang = (lang as AppLanguage) in TRANSLATIONS ? (lang as AppLanguage) : "fr";
  return TRANSLATIONS[safeLang]?.[key] || TRANSLATIONS.fr[key] || key;
}
