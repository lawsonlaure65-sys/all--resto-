import { Order, OrderStatus, KitchenWhatsAppMessage, AppLanguage } from "../types";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

/**
 * Nettoie et formate un numéro de téléphone pour l'API WhatsApp
 * Ex: "+227 90 40 51 18" -> "22790405118"
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 8) {
    return `227${digits}`;
  }
  return digits;
}

/**
 * Ouvre WhatsApp avec un numéro et un message encodé
 */
export function openWhatsAppDirect(phone: string, message: string): void {
  const cleanPhone = formatPhoneNumberForWhatsApp(phone || ALLORESTO_BRAND_INFO.whatsappOrders);
  const encodedText = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
}

/**
 * Génère le message WhatsApp officiel de confirmation de commande (FR / EN / HA / ZM)
 */
export function generateOrderConfirmationMessage(
  order: Order,
  chefEtaMinutes: number = 25,
  lang: AppLanguage = "fr"
): string {
  const itemsText = order.items
    .map((it) => `• *${it.quantity}x* ${it.menuItem.name} (${it.totalPrice.toLocaleString()} F)`)
    .join("\n");

  const paymentLabel = order.paymentMethod === "cash" 
    ? (lang === "en" ? "Cash on delivery" : lang === "ha" ? "Kudi a hannu (Cash)" : lang === "zm" ? "Nooru cimi (Cash)" : "Espèces à la livraison")
    : `${order.paymentMethod.toUpperCase()}${order.paymentReference ? ` (Réf : ${order.paymentReference})` : ""}`;

  if (lang === "en") {
    return (
      `✅ *ORDER CONFIRMED & COOKING IN KITCHEN — ALLÔRESTO NIAMEY* 🍽️\n\n` +
      `Hello *${order.customerName || "Customer"}*,\n` +
      `Great news! Your payment/deposit has been verified and your order *#${order.id}* is now *officially confirmed and in the kitchen* at *${order.restaurantName}*!\n\n` +
      `👨‍🍳 *Kitchen Status:* Cooking started\n` +
      `⏱️ *Estimated prep time:* ~${chefEtaMinutes} minutes\n\n` +
      `📦 *Order Summary:*\n` +
      `${itemsText}\n\n` +
      `💵 *Total:* ${order.total.toLocaleString()} FCFA\n` +
      `💳 *Payment:* ${paymentLabel} (Verified ✅)\n` +
      `📍 *Delivery Address:* ${order.deliveryAddress || "Niamey"}\n` +
      `🕒 *Estimated ETA:* ${order.scheduledTime || order.estimatedDeliveryTime || "25-35 min"}\n` +
      `🏍️ *Courier:* ${order.courierName || "Billo Express Niamey"}\n\n` +
      `👉 *Live Tracking:* https://alloresto-niamey.com\n\n` +
      `📞 *Customer Care:* +227 96 05 23 10 | WhatsApp : +227 70 03 25 52\n` +
      `_Thank you for choosing Allôresto Niger! Enjoy your meal!_ 🇳🇪`
    );
  }

  if (lang === "ha") {
    return (
      `✅ *AN TABBATAR DA ODA & ANA DAFAWA A KICIN — ALLÔRESTO YAMAI* 🍽️\n\n` +
      `Barka *${order.customerName || "Mai Saye"}*,\n` +
      `Mun karbi biyan kudin ku lafiya! Odar ku mai lamba *#${order.id}* yanzu haka tana kicin ana dafawa a *${order.restaurantName}* !\n\n` +
      `👨‍🍳 *Halin Kicin :* An fara dafawa yanzu\n` +
      `⏱️ *Kimanin lokacin gamawa :* ~minti ${chefEtaMinutes}\n\n` +
      `📦 *Abincin da aka zaba :*\n` +
      `${itemsText}\n\n` +
      `💵 *Jimla :* ${order.total.toLocaleString()} FCFA\n` +
      `💳 *Biyan kudi :* ${paymentLabel} (An Tabbatar ✅)\n` +
      `📍 *Wurin kaiwa :* ${order.deliveryAddress || "Yamai (Niamey)"}\n` +
      `🕒 *Lokacin isowa :* ${order.scheduledTime || order.estimatedDeliveryTime || "25-35 min"}\n` +
      `🏍️ *Mai kaiwa :* ${order.courierName || "Billo Express Niamey"}\n\n` +
      `👉 *Bibiyar odar ka a intanet :* https://alloresto-niamey.com\n\n` +
      `📞 *Sabis na Abokan Ciniki :* +227 96 05 23 10 | WhatsApp : +227 70 03 25 52\n` +
      `_Mun gode da zabar Allôresto Niger! A ci abinci lafiya !_ 🇳🇪`
    );
  }

  if (lang === "zm") {
    return (
      `✅ *ŊWAARI TABATANDI & I GO G'A TE KICIN RA — ALLÔRESTO NIAMEY* 🍽️\n\n` +
      `Kubanni *${order.customerName || "Daykow"}*,\n` +
      `Ni nooru nootaray tabatandi lafiya ! Ni ŋwaaro *#${order.id}* sindin kicin ra *${order.restaurantName}* do !\n\n` +
      `👨‍🍳 *Kicin mise :* Ŋwaari teeyan sindin sohõ\n` +
      `⏱️ *Alwakti kaŋ a ga ban :* ~minti ${chefEtaMinutes}\n\n` +
      `📦 *Ŋwaarey kaŋ ni za :*\n` +
      `${itemsText}\n\n` +
      `💵 *Kulu :* ${order.total.toLocaleString()} FCFA\n` +
      `💳 *Nooru nooyaŋ :* ${paymentLabel} (Tabatandi ✅)\n` +
      `📍 *Kande do :* ${order.deliveryAddress || "Niamey"}\n` +
      `🕒 *Alwakti :* ${order.scheduledTime || order.estimatedDeliveryTime || "25-35 min"}\n` +
      `🏍️ *Kandekow :* ${order.courierName || "Billo Express Niamey"}\n\n` +
      `👉 *Guna ni ŋwaaro fonda ra :* https://alloresto-niamey.com\n\n` +
      `📞 *Allôresto Alhabar :* +227 96 05 23 10 | WhatsApp : +227 70 03 25 52\n` +
      `_Fofo Allôresto do ! Ŋwa kaano !_ 🇳🇪`
    );
  }

  // Default: Français
  return (
    `✅ *COMMANDE CONFIRMÉE & EN CUISINE — ALLÔRESTO NIAMEY* 🍽️\n\n` +
    `Bonjour *${order.customerName || "Client"}*,\n` +
    `Bonne nouvelle ! Votre paiement/dépôt a bien été validé et votre commande *#${order.id}* est maintenant *officiellement confirmée et passée en cuisine* chez *${order.restaurantName}* !\n\n` +
    `👨‍🍳 *Statut Cuisine :* Cuisson lancée\n` +
    `⏱️ *Temps de préparation estimé :* ~${chefEtaMinutes} minutes\n\n` +
    `📦 *Récapitulatif de votre commande :*\n` +
    `${itemsText}\n\n` +
    `💵 *Total :* ${order.total.toLocaleString()} FCFA\n` +
    `💳 *Règlement :* ${paymentLabel} (Validé ✅)\n` +
    `📍 *Adresse de livraison :* ${order.deliveryAddress || "Niamey"}\n` +
    `🕒 *Horaire prévu :* ${order.scheduledTime || order.estimatedDeliveryTime || "25-35 min"}\n` +
    `🏍️ *Livraison assurée par :* ${order.courierName || "Billo Express Niamey"}\n\n` +
    `👉 *Suivez votre commande en direct :* https://alloresto-niamey.com\n\n` +
    `📞 *Service Client Allôresto :* +227 96 05 23 10 | WhatsApp : +227 70 03 25 52\n` +
    `_Merci pour votre confiance et bon appétit !_ 🇳🇪`
  );
}

/**
 * Message dynamique du Chef au Client : Ajustement du temps de cuisson
 */
export function generateCookingProgressMessage(
  order: Order,
  minutesLeft: number,
  dishNote?: string,
  lang: AppLanguage = "fr"
): string {
  if (lang === "en") {
    return (
      `🔥 *LIVE KITCHEN UPDATE — ${order.restaurantName.toUpperCase()}* 👨‍🍳\n\n` +
      `Hello *${order.customerName || "Customer"}*,\n` +
      `The executive chef at *${order.restaurantName}* is preparing your order *#${order.id}*.\n\n` +
      `⏱️ *Estimated remaining time:* ${minutesLeft} minutes before thermal packaging.\n` +
      `${dishNote ? `📝 *Chef note:* ${dishNote}\n` : ""}\n` +
      `🛵 The Billo Express courier is already on standby for fast pickup!\n\n` +
      `👉 Live Tracking: https://alloresto-niamey.com\n` +
      `_Allôresto Niamey — Flavor at your doorstep._ 🇳🇪`
    );
  }

  if (lang === "ha") {
    return (
      `🔥 *SANARWAR KICIN KAI TSAYE — ${order.restaurantName.toUpperCase()}* 👨‍🍳\n\n` +
      `Barka *${order.customerName || "Mai Saye"}*,\n` +
      `Babban mai dafa abinci na *${order.restaurantName}* yana kan shirya odar ku mai lamba *#${order.id}*.\n\n` +
      `⏱️ *Ragowar lokaci :* minti ${minutesLeft} kafin a rufe a akwatin zafi.\n` +
      `${dishNote ? `📝 *Bayani daga mai dafawa :* ${dishNote}\n` : ""}\n` +
      `🛵 Mai babur na Billo Express yana nan a shirye don karba da zarar an gama !\n\n` +
      `👉 Bibiya : https://alloresto-niamey.com\n` +
      `_Allôresto Yamai — Dadin abinci a gidanka._ 🇳🇪`
    );
  }

  if (lang === "zm") {
    return (
      `🔥 *KICIN ALHABAR SOHÕ — ${order.restaurantName.toUpperCase()}* 👨‍🍳\n\n` +
      `Kubanni *${order.customerName || "Daykow"}*,\n` +
      `Ŋwaari teekow na *${order.restaurantName}* go g'a te ni ŋwaaro *#${order.id}* se.\n\n` +
      `⏱️ *Alwakti kaŋ cindi :* minti ${minutesLeft} jina a ma daŋ kankey ra.\n` +
      `${dishNote ? `📝 *Teekow sako :* ${dishNote}\n` : ""}\n` +
      `🛵 Billo Express kandekow go soola kaŋ a ga za a !\n\n` +
      `👉 Guna fonda ra : https://alloresto-niamey.com\n` +
      `_Allôresto Niamey — Ŋwaari kaano ni fu kulu._ 🇳🇪`
    );
  }

  return (
    `🔥 *POINT CUISINE EN DIRECT — ${order.restaurantName.toUpperCase()}* 👨‍🍳\n\n` +
    `Bonjour *${order.customerName || "Client"}*,\n` +
    `Le chef cuisinier de *${order.restaurantName}* prépare actuellement votre commande *#${order.id}*.\n\n` +
    `⏱️ *Temps restant estimé :* ${minutesLeft} minutes avant emballage thermique.\n` +
    `${dishNote ? `📝 *Note du chef :* ${dishNote}\n` : ""}\n` +
    `🛵 Le coursier Billo Express est déjà alerté pour la prise en charge dès la fin de cuisson !\n\n` +
    `👉 Suivi en direct : https://alloresto-niamey.com\n` +
    `_Allôresto Niamey — La saveur à votre porte._ 🇳🇪`
  );
}

/**
 * Message dynamique du Chef au Client : Précision spéciale ingrédients
 */
export function generateKitchenSpecialNoteMessage(
  order: Order,
  customChefNote: string,
  lang: AppLanguage = "fr"
): string {
  if (lang === "en") {
    return (
      `👨‍🍳 *MESSAGE FROM EXECUTIVE CHEF — ORDER #${order.id}*\n\n` +
      `Hello *${order.customerName || "Customer"}*,\n` +
      `The kitchen team at *${order.restaurantName}* has a note for your order:\n\n` +
      `💬 « *${customChefNote}* »\n\n` +
      `Your dish is prepared with the utmost care for an extraordinary dining experience!\n` +
      `📞 For direct requests, simply reply to this WhatsApp message.\n\n` +
      `👉 Allôresto Niamey & ${order.restaurantName}`
    );
  }

  if (lang === "ha") {
    return (
      `👨‍🍳 *SAKO DAGA MAI DAFA ABINCI — ODA #${order.id}*\n\n` +
      `Barka *${order.customerName || "Mai Saye"}*,\n` +
      `Kicin na *${order.restaurantName}* yana da sako a kan odar ku :\n\n` +
      `💬 « *${customChefNote}* »\n\n` +
      `Ana kula da abincin ku sosai don ya zama mai dadi !\n` +
      `📞 Kuna iya mayar da martani kai tsaye a wannan WhatsApp.\n\n` +
      `👉 Allôresto Yamai & ${order.restaurantName}`
    );
  }

  if (lang === "zm") {
    return (
      `👨‍🍳 *SAKO KAŊ HU KAŊ ŊWAARI TEEKOW DO — ŊWAARI #${order.id}*\n\n` +
      `Kubanni *${order.customerName || "Daykow"}*,\n` +
      `*${order.restaurantName}* kicin boro go nda sako ni se :\n\n` +
      `💬 « *${customChefNote}* »\n\n` +
      `I go g'a te nda sahã zama a ma kaan !\n` +
      `📞 Ni ga hin ka zaabi sohõ WhatsApp ra.\n\n` +
      `👉 Allôresto Niamey & ${order.restaurantName}`
    );
  }

  return (
    `👨‍🍳 *MESSAGE DU CHEF CUISINIER — COMMANDE #${order.id}*\n\n` +
    `Bonjour *${order.customerName || "Client"}*,\n` +
    `La cuisine de *${order.restaurantName}* a un message pour vous concernant votre commande :\n\n` +
    `💬 « *${customChefNote}* »\n\n` +
    `Votre plat est soigné avec attention pour vous garantir une expérience parfaite !\n` +
    `📞 Pour toute question directe, répondez simplement à ce message WhatsApp.\n\n` +
    `👉 Allôresto Niamey & ${order.restaurantName}`
  );
}

/**
 * Message dynamique : Commande prête et remise au livreur
 */
export function generateOrderReadyMessage(order: Order, lang: AppLanguage = "fr"): string {
  if (lang === "en") {
    return (
      `🍽️ *ORDER READY & HANDED TO COURIER!* 🏍️\n\n` +
      `Hello *${order.customerName || "Customer"}*,\n` +
      `Your order *#${order.id}* is freshly cooked and safely packed at *${order.restaurantName}*!\n\n` +
      `👤 *Billo Express Courier:* ${order.courierName || "Ibrahim Oumarou"}\n` +
      `📞 *Courier Phone:* ${order.courierPhone || "+227 92 08 08 22"}\n` +
      `📍 *Heading to:* ${order.deliveryAddress}\n\n` +
      `Estimated arrival: *10 to 15 minutes*. Enjoy your meal! 🌟`
    );
  }

  if (lang === "ha") {
    return (
      `🍽️ *ABINCI YA SHIRYA & AN BA MAI BABUR!* 🏍️\n\n` +
      `Barka *${order.customerName || "Mai Saye"}*,\n` +
      `Odar ku *#${order.id}* ta shirya da dumi kuma an rufe ta a *${order.restaurantName}* !\n\n` +
      `👤 *Mai kawo abinci (Billo Express):* ${order.courierName || "Ibrahim Oumarou"}\n` +
      `📞 *Lambar Waya:* ${order.courierPhone || "+227 92 08 08 22"}\n` +
      `📍 *Yana kan hanya zuwa:* ${order.deliveryAddress}\n\n` +
      `Zai iso cikin: *minti 10 zuwa 15*. A ci lafiya! 🌟`
    );
  }

  if (lang === "zm") {
    return (
      `🍽️ *ŊWAARI BAN & A NOONDI KANDEKOW SE!* 🏍️\n\n` +
      `Kubanni *${order.customerName || "Daykow"}*,\n` +
      `Ni ŋwaaro *#${order.id}* ban da dumi kicin ra *${order.restaurantName}* do !\n\n` +
      `👤 *Billo Express Kandekow:* ${order.courierName || "Ibrahim Oumarou"}\n` +
      `📞 *Kandekow Talifon:* ${order.courierPhone || "+227 92 08 08 22"}\n` +
      `📍 *A go fonda ra ka koy:* ${order.deliveryAddress}\n\n` +
      `A ga to minti *10 hala 15 ra*. Ŋwa kaano! 🌟`
    );
  }

  return (
    `🍽️ *COMMANDE PRÊTE & REMISE AU LIVREUR !* 🏍️\n\n` +
    `Bonjour *${order.customerName || "Client"}*,\n` +
    `Votre commande *#${order.id}* est prête, chaude et soigneusement emballée chez *${order.restaurantName}* !\n\n` +
    `👤 *Coursier Billo Express :* ${order.courierName || "Ibrahim Oumarou"}\n` +
    `📞 *Téléphone Coursier :* ${order.courierPhone || "+227 92 08 08 22"}\n` +
    `📍 *En route vers :* ${order.deliveryAddress}\n\n` +
    `Délai d'arrivée estimé : *10 à 15 minutes*. Bon appétit ! 🌟`
  );
}

/**
 * Message dynamique envoyé par le CLIENT à la CUISINE
 */
export function generateClientToKitchenMessage(
  order: Order,
  type: "spice" | "sauce" | "cutlery" | "delay" | "address_note" | "custom",
  details: string,
  lang: AppLanguage = "fr"
): string {
  let subject = "Précision sur ma commande";
  if (lang === "en") {
    if (type === "spice") subject = "🌶️ Pepper & Spice preference";
    if (type === "sauce") subject = "🥫 Sauce selection or extra sauce";
    if (type === "cutlery") subject = "🥢 Extra Cutlery & Napkins";
    if (type === "delay") subject = "⏰ Delivery timing note";
    if (type === "address_note") subject = "📍 Office / Gate details";

    return (
      `👋 *CUSTOMER NOTE FOR KITCHEN — ORDER #${order.id}*\n\n` +
      `🏪 *Restaurant:* ${order.restaurantName}\n` +
      `👤 *Customer:* ${order.customerName} (${order.customerPhone})\n` +
      `📌 *Subject:* ${subject}\n\n` +
      `📝 *Details:*\n` +
      `« ${details} »\n\n` +
      `Thank you for taking this into account! 🍽️`
    );
  }

  if (lang === "ha") {
    if (type === "spice") subject = "🌶️ Barkono da Yaji";
    if (type === "sauce") subject = "🥫 Karin Miya ko Kan-Kan";
    if (type === "cutlery") subject = "🥢 Cokali da Takardar Hannu";
    if (type === "delay") subject = "⏰ Lokacin Kawo Abinci";
    if (type === "address_note") subject = "📍 Karin Bayanin Wuri";

    return (
      `👋 *SAKO DAGA MAI SAYE ZUWA KICIN — ODA #${order.id}*\n\n` +
      `🏪 *Gidan Abinci:* ${order.restaurantName}\n` +
      `👤 *Mai Saye:* ${order.customerName} (${order.customerPhone})\n` +
      `📌 *Maudu'i:* ${subject}\n\n` +
      `📝 *Bayanin sako:*\n` +
      `« ${details} »\n\n` +
      `Mungode da kuka lura da wannan ! 🍽️`
    );
  }

  if (lang === "zm") {
    if (type === "spice") subject = "🌶️ Tonte nda Yaji";
    if (type === "sauce") subject = "🥫 Hawari tonton";
    if (type === "cutlery") subject = "🥢 Karkasu nda kankey";
    if (type === "delay") subject = "⏰ Alwakti mise";
    if (type === "address_note") subject = "📍 Do mise tonton";

    return (
      `👋 *SAKO KAŊ HU DAYKOW DO KA KOY KICIN SE — ŊWAARI #${order.id}*\n\n` +
      `🏪 *Ŋwaari Teedo:* ${order.restaurantName}\n` +
      `👤 *Daykow:* ${order.customerName} (${order.customerPhone})\n` +
      `📌 *Mise:* ${subject}\n\n` +
      `📝 *Sako cimi:*\n` +
      `« ${details} »\n\n` +
      `Fofo kaŋ araŋ ga hanga a se ! 🍽️`
    );
  }

  if (type === "spice") subject = "🌶️ Préférence Piment / Épices";
  if (type === "sauce") subject = "🥫 Choix ou supplément de Sauce";
  if (type === "cutlery") subject = "🥢 Couverts & Serviettes supplémentaires";
  if (type === "delay") subject = "⏰ Indication sur l'horaire de livraison";
  if (type === "address_note") subject = "📍 Précision sur l'adresse / bureau";

  return (
    `👋 *MESSAGE CLIENT POUR LA CUISINE — COMMANDE #${order.id}*\n\n` +
    `🏪 *Restaurant :* ${order.restaurantName}\n` +
    `👤 *Client :* ${order.customerName} (${order.customerPhone})\n` +
    `📌 *Sujet :* ${subject}\n\n` +
    `📝 *Détail de ma demande :*\n` +
    `« ${details} »\n\n` +
    `Merci de bien vouloir prendre en compte cette indication pour la préparation ! 🍽️`
  );
}

/**
 * Génère le message WhatsApp pour d'autres mises à jour de statut
 */
export function generateStatusUpdateMessage(order: Order, status: OrderStatus, lang: AppLanguage | string = "fr"): string {
  const safeLang = (lang === "en" || lang === "ha" || lang === "zm") ? lang : "fr";
  if (status === "preparing") {
    return generateOrderConfirmationMessage(order, 25, safeLang);
  }

  if (status === "delivering") {
    return generateOrderReadyMessage(order, safeLang);
  }

  if (status === "delivered") {
    if (safeLang === "en") {
      return (
        `🎉 *ORDER DELIVERED — ALLÔRESTO NIAMEY* 🌟\n\n` +
        `Hello *${order.customerName || "Customer"}*,\n` +
        `Your order *#${order.id}* has been successfully delivered by Billo Express.\n\n` +
        `We hope you enjoyed your meal from *${order.restaurantName}*!\n` +
        `🌟 Don't hesitate to share your review and earn loyalty points on your next order.\n\n` +
        `👉 https://alloresto-niamey.com`
      );
    }
    if (safeLang === "ha") {
      return (
        `🎉 *AN KAI ABINCI LAFIYA — ALLÔRESTO YAMAI* 🌟\n\n` +
        `Barka *${order.customerName || "Mai Saye"}*,\n` +
        `An kai odar ku mai lamba *#${order.id}* lafiya ta hannun Billo Express.\n\n` +
        `Muna fatan abincin *${order.restaurantName}* ya yi dadi sosai !\n` +
        `🌟 Ku tara maki na ladan saya a oda ta gaba.\n\n` +
        `👉 https://alloresto-niamey.com`
      );
    }
    if (safeLang === "zm") {
      return (
        `🎉 *ŊWAARI TO BAN LAFIYA — ALLÔRESTO NIAMEY* 🌟\n\n` +
        `Kubanni *${order.customerName || "Daykow"}*,\n` +
        `Ni ŋwaaro *#${order.id}* to ban lafiya nda Billo Express.\n\n` +
        `Iri ga tammahã ŋwaaro kaan *${order.restaurantName}* do !\n` +
        `🌟 Nooru gani tonton ni kande tontoni ra.\n\n` +
        `👉 https://alloresto-niamey.com`
      );
    }
    return (
      `🎉 *COMMANDE LIVRÉE — ALLÔRESTO NIAMEY* 🌟\n\n` +
      `Bonjour *${order.customerName || "Client"}*,\n` +
      `Votre commande *#${order.id}* a été livrée avec succès par Billo Express.\n\n` +
      `Nous espérons que vous avez apprécié votre repas chez *${order.restaurantName}* !\n` +
      `🌟 N'hésitez pas à laisser votre avis et à cumuler vos points de fidélité pour votre prochain repas.\n\n` +
      `👉 https://alloresto-niamey.com`
    );
  }

  return generateOrderConfirmationMessage(order, 25, safeLang);
}

/**
 * Alias pour la confirmation de commande WhatsApp
 */
export function generateWhatsAppOrderConfirmation(
  order: Order,
  lang: AppLanguage | string = "fr"
): string {
  const safeLang = (lang === "en" || lang === "ha" || lang === "zm") ? lang : "fr";
  return generateOrderConfirmationMessage(order, 25, safeLang);
}

/**
 * Déclenche l'envoi immédiat de la notification WhatsApp vers le client
 */
export function sendOrderConfirmationWhatsApp(
  order: Order,
  chefEtaOrLang: number | AppLanguage | string = 25,
  maybeLang: AppLanguage | string = "fr"
): void {
  const eta = typeof chefEtaOrLang === "number" ? chefEtaOrLang : 25;
  const langCandidate = typeof chefEtaOrLang === "string" ? chefEtaOrLang : maybeLang;
  const safeLang = (langCandidate === "en" || langCandidate === "ha" || langCandidate === "zm") ? langCandidate : "fr";
  const message = generateOrderConfirmationMessage(order, eta, safeLang);
  openWhatsAppDirect(order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders, message);
}

/**
 * Déclenche l'envoi de notification selon le nouveau statut
 */
export function sendOrderStatusNotificationWhatsApp(order: Order, status: OrderStatus, lang: AppLanguage | string = "fr"): void {
  const safeLang = (lang === "en" || lang === "ha" || lang === "zm") ? lang : "fr";
  const message = generateStatusUpdateMessage(order, status, safeLang);
  openWhatsAppDirect(order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders, message);
}
