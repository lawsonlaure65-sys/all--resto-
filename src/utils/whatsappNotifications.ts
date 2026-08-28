import { Order, OrderStatus, KitchenWhatsAppMessage } from "../types";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

/**
 * Nettoie et formate un numéro de téléphone pour l'API WhatsApp
 * Ex: "+227 90 40 51 18" -> "22790405118"
 */
export function formatPhoneNumberForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  // Si le numéro commence sans indicatif (8 chiffres typiques au Niger ex 90405118), ajouter 227
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
 * Génère le message WhatsApp officiel de confirmation de commande
 * Envoyé dès que le paiement/dépôt est validé et que la commande passe en cuisine.
 */
export function generateOrderConfirmationMessage(order: Order, chefEtaMinutes: number = 25): string {
  const itemsText = order.items
    .map((it) => `• *${it.quantity}x* ${it.menuItem.name} (${it.totalPrice.toLocaleString()} F)`)
    .join("\n");

  const paymentLabel = order.paymentMethod === "cash" 
    ? "Espèces à la livraison" 
    : `${order.paymentMethod.toUpperCase()}${order.paymentReference ? ` (Réf : ${order.paymentReference})` : ""}`;

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
 * Message dynamique du Chef au Client : Ajustement du temps de cuisson / Cuisson en cours
 */
export function generateCookingProgressMessage(order: Order, minutesLeft: number, dishNote?: string): string {
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
 * Message dynamique du Chef au Client : Précision spéciale ingrédients / sauces / emballage
 */
export function generateKitchenSpecialNoteMessage(order: Order, customChefNote: string): string {
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
export function generateOrderReadyMessage(order: Order): string {
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
  details: string
): string {
  let subject = "Précision sur ma commande";
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
export function generateStatusUpdateMessage(order: Order, status: OrderStatus): string {
  if (status === "preparing") {
    return generateOrderConfirmationMessage(order);
  }

  if (status === "delivering") {
    return generateOrderReadyMessage(order);
  }

  if (status === "delivered") {
    return (
      `🎉 *COMMANDE LIVRÉE — ALLÔRESTO NIAMEY* 🌟\n\n` +
      `Bonjour *${order.customerName || "Client"}*,\n` +
      `Votre commande *#${order.id}* a été livrée avec succès par Billo Express.\n\n` +
      `Nous espérons que vous avez apprécié votre repas chez *${order.restaurantName}* !\n` +
      `🌟 N'hésitez pas à laisser votre avis et à cumuler vos points de fidélité pour votre prochain repas.\n\n` +
      `👉 https://alloresto-niamey.com`
    );
  }

  return generateOrderConfirmationMessage(order);
}

/**
 * Déclenche l'envoi immédiat de la notification WhatsApp vers le client
 */
export function sendOrderConfirmationWhatsApp(order: Order, chefEtaMinutes: number = 25): void {
  const message = generateOrderConfirmationMessage(order, chefEtaMinutes);
  openWhatsAppDirect(order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders, message);
}

/**
 * Déclenche l'envoi de notification selon le nouveau statut
 */
export function sendOrderStatusNotificationWhatsApp(order: Order, status: OrderStatus): void {
  const message = generateStatusUpdateMessage(order, status);
  openWhatsAppDirect(order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders, message);
}
