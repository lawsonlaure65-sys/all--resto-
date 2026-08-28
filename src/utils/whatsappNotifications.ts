import { Order, OrderStatus } from "../types";
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
 * Génère le message WhatsApp officiel de confirmation de commande
 * Envoyé dès que le paiement/dépôt est validé et que la commande passe en cuisine.
 */
export function generateOrderConfirmationMessage(order: Order): string {
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
 * Génère le message WhatsApp pour d'autres mises à jour de statut (ex: livreur en route, livrée)
 */
export function generateStatusUpdateMessage(order: Order, status: OrderStatus): string {
  if (status === "preparing") {
    return generateOrderConfirmationMessage(order);
  }

  if (status === "delivering") {
    return (
      `🛵 *VOTRE COMMANDE ALLÔRESTO EST EN ROUTE !* 🏍️\n\n` +
      `Bonjour *${order.customerName || "Client"}*,\n` +
      `Votre repas chaud *#${order.id}* vient de quitter les cuisines de *${order.restaurantName}* !\n\n` +
      `👤 *Livreur assigné :* ${order.courierName || "Billo Express"}\n` +
      `📞 *Contact coursier :* ${order.courierPhone || "+227 92 08 08 22"}\n` +
      `📍 *Destination :* ${order.deliveryAddress}\n\n` +
      `Le livreur arrive d'ici quelques minutes. Bon appétit ! 🍽️\n` +
      `👉 *Suivi GPS en direct :* https://alloresto-niamey.com`
    );
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
export function sendOrderConfirmationWhatsApp(order: Order): void {
  const message = generateOrderConfirmationMessage(order);
  const targetPhone = order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders;
  const cleanPhone = formatPhoneNumberForWhatsApp(targetPhone);
  const encodedText = encodeURIComponent(message);
  
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
}

/**
 * Déclenche l'envoi de notification selon le nouveau statut
 */
export function sendOrderStatusNotificationWhatsApp(order: Order, status: OrderStatus): void {
  const message = generateStatusUpdateMessage(order, status);
  const targetPhone = order.customerPhone || ALLORESTO_BRAND_INFO.whatsappOrders;
  const cleanPhone = formatPhoneNumberForWhatsApp(targetPhone);
  const encodedText = encodeURIComponent(message);
  
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, "_blank");
}
