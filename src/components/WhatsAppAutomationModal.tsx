import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Phone,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Bike,
  ShoppingBag,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink,
  ChefHat,
  Flame,
  Globe,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { AppLanguage, Order } from "../types";

interface WhatsAppAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders?: Order[];
  currentLanguage?: AppLanguage;
}

export const WhatsAppAutomationModal: React.FC<WhatsAppAutomationModalProps> = ({
  isOpen,
  onClose,
  recentOrders = [],
  currentLanguage: defaultLang = "fr",
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(defaultLang);
  const [selectedTemplate, setSelectedTemplate] = useState<
    "order_client" | "kitchen_progress" | "client_request" | "billo_dispatch" | "cart_recovery" | "group_invite" | "status_update"
  >("order_client");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenWhatsApp = (text: string, phone: string = ALLORESTO_BRAND_INFO.whatsappOrders) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, "_blank");
  };

  const languagesList: { code: AppLanguage; label: string; flag: string }[] = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ha", label: "Hausa", flag: "🇳🇪" },
    { code: "zm", label: "Zarma", flag: "🇳🇪" },
  ];

  const getLocalizedTemplates = (lang: AppLanguage) => {
    switch (lang) {
      case "en":
        return {
          order_client: {
            title: "🧾 Customer Order Confirmation & Deposit Validation",
            target: "Sent to customer after payment deposit confirmation",
            phone: "+227 70 03 25 52",
            text: `✅ *ORDER CONFIRMED & SENT TO KITCHEN — ALLÔRESTO NIAMEY* 🍽️\n\nHello Sir/Madam,\nGreat news! Your payment/deposit has been confirmed and order *#CMD-2026-8801* is *now in preparation* at *Khady's Food*!\n\n👨‍🍳 *Kitchen Status:* Cooking started\n⏱️ *Estimated prep time:* ~25 minutes\n\n📦 *Items:*\n- 1x Royal Mutton Choukouya with Kan-Kan (4,500 F)\n- 2x Fresh Mint Bissap Juice 50cl (2,000 F)\n\n📍 *Delivery Address:* Ministry of Finance, Plateau, 3rd Floor\n💵 *Total:* 7,500 FCFA (Billo Express Delivery 1,000 F included)\n💳 *Payment:* Mynita (Confirmed ✅)\n🏍️ *Assigned Courier:* Ibrahim Oumarou (Billo Express Niamey) • +227 92 08 08 22\n\n👉 *Live tracking:* https://alloresto-niamey.com\n\n📞 Customer Service: +227 96 05 23 10 | WhatsApp: +227 70 03 25 52`,
          },
          kitchen_progress: {
            title: "👨‍🍳 Direct Kitchen Progress Alert",
            target: "Sent dynamically by the chef to inform the customer",
            phone: "+227 70 03 25 52",
            text: `🔥 *LIVE KITCHEN UPDATE — KHADY'S FOOD* 👨‍🍳\n\nHello Sir/Madam,\nThe chef is currently cooking your order *#CMD-2026-8801*.\n\n⏱️ *Estimated remaining time:* 10 minutes before thermal packaging.\n📝 *Chef note:* Meat braising on gentle heat with spiced Kan-Kan seasoning.\n\n🛵 Billo Express courier is already notified for pickup!\n👉 Live tracking: https://alloresto-niamey.com`,
          },
          client_request: {
            title: "💬 Customer Request to Kitchen (Pepper / Cutlery)",
            target: "Sent by customer to customize dish preparation",
            phone: "+227 70 03 25 52",
            text: `👋 *CUSTOMER MESSAGE FOR KITCHEN — ORDER #CMD-2026-8801*\n\n🏪 *Restaurant:* Khady's Food\n👤 *Customer:* Amadou Seyni (+227 90 12 34 56)\n📌 *Topic:* 🌶️ Pepper & Cutlery Request\n\n📝 *Details:*\n"Please serve pepper on the side and add 2 extra cutlery sets for the office."\n\nThank you! 🍽️`,
          },
          billo_dispatch: {
            title: "🏍️ Billo Express Courier Dispatch Sheet",
            target: "Sent directly to the assigned Billo Express courier",
            phone: "+227 92 08 08 22",
            text: `🚀 *NEW ALLÔRESTO & BILLO EXPRESS DELIVERY* 🏍️\n\n📋 *Order ID:* #CMD-2026-8801\n🏪 *Pickup Restaurant:* Khady's Food (Avenue de l'Islam, near Grand Mosque)\n\n👤 *Customer:* Amadou Seyni\n📞 *Customer Phone:* +227 90 12 34 56\n📍 *Delivery Location:* Plateau, Ministry Street, Main Building (Office 304)\n\n💵 *Amount to collect:* 7,500 FCFA (if cash payment)\n⏱️ *Guaranteed time:* 20 minutes chrono`,
          },
          cart_recovery: {
            title: "🛒 Abandoned Cart Reminder (+ Promo Code)",
            target: "Sent to re-engage visitors with pending carts",
            phone: "+227 70 03 25 52",
            text: `👋 *Hello! Hungry in Niamey?*\n\nYou left delicious dishes in your Allôresto cart (Mutton Choukouya & Braised Fish)!\n\n🎁 Enjoy an exclusive *-500 FCFA* discount code: \`SAVOUR500\`\n\n👉 *Complete your order in 1 click:* https://alloresto-niamey.com\n🏍️ *Express delivery by Billo Express to your home or office!*`,
          },
          group_invite: {
            title: "👥 Group Order Invitation (Office / Plateau)",
            target: "Share in your office WhatsApp group",
            phone: "",
            text: `🍽️ *OFFICE LUNCH GROUP ORDER!*\n\nJoin the Allôresto collective order started by *Amadou Seyni* at *Khady's Food* for today's lunch.\n\n🔑 *Session Code:* \`PLATEAU-MINISTERE-404\`\n⏱️ *Order deadline:* 11:45 AM\n🛵 *Group delivery at 12:30 PM* to the office!\n\n👉 *Add your meals here in 1 click:* https://alloresto-niamey.com`,
          },
          status_update: {
            title: "🛵 Courier On The Way Alert",
            target: "Sent when courier departs restaurant",
            phone: "+227 70 03 25 52",
            text: `🏍️ *YOUR COURIER IS ON THE WAY!*\n\nYour hot meal just left the kitchen! Courier *Ibrahim Oumarou (Billo Express)* will arrive at your address in *10 to 15 minutes*.\n\n📞 Courier Direct Line: *+227 92 08 08 22*\n👉 Have your cash or payment ready. Enjoy your meal with Allôresto!`,
          },
        };

      case "ha":
        return {
          order_client: {
            title: "🧾 Tabbatar da Oda & Karɓar Kuɗi (Hausa)",
            target: "Aika wa mai cin abinci bayan an duba rasidin biya",
            phone: "+227 70 03 25 52",
            text: `✅ *AN TABBATAR DA ODA KUMA TANA CIKIN GIRKI — ALLÔRESTO NIAMEY* 🍽️\n\nSannu Malam/Malama,\nLabari mai dadi! An tabbatar da biyan kuɗin ku kuma odar ku *#CMD-2026-8801* ta shiga cikin girki a gidan abinci na *Khady's Food*!\n\n👨‍🍳 *Yanayin Kicin:* An fara girki\n⏱️ *Lokacin gamawa:* Kimanin minti 25\n\n📦 *Abubuwan da aka oda:*\n- 1x Tsiren Rago na Musamman tare da Yaji Kan-Kan (4 500 F)\n- 2x Zoben Bissap da Na'a-na'a 50cl (2 000 F)\n\n📍 *Wurin Kaiwa:* Ma'aikatar Kudi (Ministère des Finances), Plateau\n💵 *Jimillar Kuɗi:* 7 500 FCFA (Kudin kaiwa na Billo Express 1 000 F na ciki)\n💳 *Hanyar Biya:* Mynita (An amince ✅)\n🏍️ *Mai Kaiwa:* Ibrahim Oumarou (Billo Express Niamey) • +227 92 08 08 22\n\n👉 *Binciki halin odar ka kai tsaye:* https://alloresto-niamey.com\n\n📞 Cibiyar Taimako: +227 96 05 23 10 | WhatsApp: +227 70 03 25 52`,
          },
          kitchen_progress: {
            title: "👨‍🍳 Saƙo Daga Kicin (Hausa)",
            target: "Kicin na aika wa mai oda bayanin yadda girki ke tafiya",
            phone: "+227 70 03 25 52",
            text: `🔥 *BAYANIN GIRKI DAGA KICIN — KHADY'S FOOD* 👨‍🍳\n\nSannu Malam/Malama,\nMai dafa abinci yana tsaka da shirya odar ku mai lamba *#CMD-2026-8801*.\n\n⏱️ *Sauran lokaci:* Minti 10 kafin a rufe cikin kwano.\n📝 *Bayanin mai girki:* Ana gasa naman da wuta maras karfi tare da yajin Kan-Kan mai dadi.\n\n🛵 Mai babur Billo Express ya riga ya shirya don karɓar abincin!\n👉 Duba odar ka: https://alloresto-niamey.com`,
          },
          client_request: {
            title: "💬 Saƙon Mai Oda Zuwa Kicin (Yaji / Cokali)",
            target: "Mai oda na neman a canza wani abu a girkin sa",
            phone: "+227 70 03 25 52",
            text: `👋 *SAƘON MAI ODA ZUWA KICIN — ODA #CMD-2026-8801*\n\n🏪 *Gidan Abinci:* Khady's Food\n👤 *Mai Oda:* Amadou Seyni (+227 90 12 34 56)\n📌 *Maganar:* 🌶️ Yaji daban & Cokula\n\n📝 *Bayanin buƙata:*\n« Don Allah a sa yajin daban a gefe, kuma a sanya cokula biyu karin don ofis. »\n\nMungode sosai! 🍽️`,
          },
          billo_dispatch: {
            title: "🏍️ Takardar Aiki ta Mai Babur Billo Express (Hausa)",
            target: "Aika wa mai kai kaya na Billo Express",
            phone: "+227 92 08 08 22",
            text: `🚀 *SABON AIKIN KAI ABINCI ALLÔRESTO & BILLO EXPRESS* 🏍️\n\n📋 *Lambar Oda:* #CMD-2026-8801\n🏪 *Wurin Karɓa:* Khady's Food (Kusa da Babban Masallacin Kadhafi)\n\n👤 *Sunan Mai Oda:* Amadou Seyni\n📞 *Lambar Wayar sa:* +227 90 12 34 56\n📍 *Inda za a kai:* Plateau, Titin Ma'aikatu, Ofis 304\n\n💵 *Kuɗin da za a karɓa:* 7 500 FCFA (idan tsabar kudi ne)\n⏱️ *Lokaci:* Minti 20 kacal`,
          },
          cart_recovery: {
            title: "🛒 Tuna Abincin da aka bari a Kwando (Hausa)",
            target: "Tuna wa mai oda abincin da bai kammala oda ba",
            phone: "+227 70 03 25 52",
            text: `👋 *Sannu! Kana jin yunwa a Yamai?*\n\nMun ga ka ajiye abinci mai dadi a kwandon Allôresto (Tsiren Rago & Kifi Gasasshe)!\n\n🎁 Ga rangwamen *-500 FCFA* da lambar: \`SAVOUR500\`\n\n👉 *Kammala odar ka nan take:* https://alloresto-niamey.com\n🏍️ *Billo Express zai kawo maka har gida ko ofis cikin sauri!*`,
          },
          group_invite: {
            title: "👥 Gayyatar Odar Abinci ta Rukunin Ofis (Hausa)",
            target: "Turawa a rukunin WhatsApp na ofis",
            phone: "",
            text: `🍽️ *ODAR ABINCIN RANA TA OFIS TARE!* 👥\n\nKu hada odar abincin rana a Allôresto tare da *Amadou Seyni* a *Khady's Food*.\n\n🔑 *Lambar Zama:* \`PLATEAU-MINISTERE-404\`\n⏱️ *Lokacin rufewa:* Karfe 11:45\n🛵 *Za a kawo duka karfe 12:30* a ofis!\n\n👉 *Zabi abincin ka a nan:* https://alloresto-niamey.com`,
          },
          status_update: {
            title: "🛵 Sanarwa: Mai Babur ya Fara Tafiya (Hausa)",
            target: "Aika wa mai oda lokacin da mai babur ya tashi",
            phone: "+227 70 03 25 52",
            text: `🏍️ *MAI BABUR YANA KAN HANYA!*\n\nAbincin ka mai zafi ya bar kicin yanzu! Mai kai kaya *Ibrahim Oumarou (Billo Express)* zai iso wurinka cikin *minti 10 zuwa 15*.\n\n📞 Lambar mai babur: *+227 92 08 08 22*\n👉 Shirya kudin ka ko ka tabbatar da Mynita. Barka da cin abinci tare da Allôresto!`,
          },
        };

      case "zm":
        return {
          order_client: {
            title: "🧾 Hantumayan & Noodiyan Tabbatar (Zarma)",
            target: "San sanma no bore se za a noodiya koro",
            phone: "+227 70 03 25 52",
            text: `✅ *NOODIYA TABBATAR ND'A GO GOBAN RA — ALLÔRESTO NIAMEY* 🍽️\n\nFo k'an te,\nBaaru hanno! Noodiyan nooru di hantum tabbatay nda war noodiya *#CMD-2026-8801* go daŋey goban ra *Khady's Food* do!\n\n👨‍🍳 *Hinayan alhali:* Hinayan go ga te\n⏱️ *Waati din:* Miniti 25 cire\n\n📦 *Hawariyan:* \n- 1x Hawri Hawsu nda Kan-Kan (4 500 F)\n- 2x Bissap haabu hanante 50cl (2 000 F)\n\n📍 *Kandiyan nango:* Ministère des Finances, Plateau\n💵 *Kulu:* 7 500 FCFA (Billo Express kandiyan nooru 1 000 F go a ra)\n💳 *Bannayan:* Mynita (Tabbatante ✅)\n🏍️ *Dirandikaw:* Ibrahim Oumarou (Billo Express Niamey) • +227 92 08 08 22\n\n👉 *Guna noodiya koy-nd-a-koyo sahã din ra:* https://alloresto-niamey.com\n\n📞 Faaba Taray: +227 96 05 23 10 | WhatsApp: +227 70 03 25 52`,
          },
          kitchen_progress: {
            title: "👨‍🍳 Hinikaw Saanayan Se (Zarma)",
            target: "Hinikaw go ga saanayan san bore se",
            phone: "+227 70 03 25 52",
            text: `🔥 *HINAYAN SAANAYAN KHADY'S FOOD DO* 👨‍🍳\n\nFo k'an te,\nHinikaw go ga war noodiya *#CMD-2026-8801* soola sohõ.\n\n⏱️ *Waati cire:* Miniti 10 jina a ma daŋ kunkuni ra.\n📝 *Hinikaw hantum:* Hamu go ga nyaano nda Kan-Kan kaano.\n\n🛵 Billo Express dirandikaw soola ka ŋwaari di za!\n👉 Guna a ra: https://alloresto-niamey.com`,
          },
          client_request: {
            title: "💬 Hawrikaw Saanayan Hinikaw Se (Hawsu / Kuuray)",
            target: "Bore go ga saanayan daŋ hinikaw se",
            phone: "+227 70 03 25 52",
            text: `👋 *HAWRIKAW SAANAYAN HINIKAW SE — NOODIYA #CMD-2026-8801*\n\n🏪 *Ŋwaari Nango:* Khady's Food\n👤 *Hawrikaw:* Amadou Seyni (+227 90 12 34 56)\n📌 *Mora:* 🌶️ Hawsu Gaali & Kuurey\n\n📝 *Hantumayan:*\n« Fofo, war ma hawsu di daŋ gaali, nda kuurey hinka bangu bureau se. »\n\nFofo baabo! 🍽️`,
          },
          billo_dispatch: {
            title: "🏍️ Billo Express Dirandikaw Hantum (Zarma)",
            target: "San sanma no Billo Express dirandikaw se",
            phone: "+227 92 08 08 22",
            text: `🚀 *ALLÔRESTO & BILLO EXPRESS DIRANDIYAN TAAGA* 🏍️\n\n📋 *Noodiya Lamba:* #CMD-2026-8801\n🏪 *Zaayan Nango:* Khady's Food (Grande Mosquée Kadhafi jine)\n\n👤 *Hawrikaw:* Amadou Seyni\n📞 *Talifono:* +227 90 12 34 56\n📍 *Kandiyan Nango:* Plateau, Ministère koyra, Bureau 304\n\n💵 *Nooru kaŋ ga za:* 7 500 FCFA (da nooru kani no)\n⏱️ *Waati:* Miniti 20 sahã ra`,
          },
          cart_recovery: {
            title: "🛒 Dondonandi Zaayan Tongo ra (Zarma)",
            target: "Bore kaŋ na ŋwaari naŋ tongo ra dondonandi",
            phone: "+227 70 03 25 52",
            text: `👋 *Fo k'an te! Haray go ga war dam Yamai ra?*\n\nIri di kaŋ war na ŋwaari hanante naŋ Allôresto tongo ra (Hawsu Hamu & Ham-kuurey)!\n\n🎁 War se nooru yeebandi *-500 FCFA* nda code: \`SAVOUR500\`\n\n👉 *Benandi war noodiya sohõ:* https://alloresto-niamey.com\n🏍️ *Billo Express ga kande a war se fu wala bureau ra!*`,
          },
          group_invite: {
            title: "👥 Bureau Margayan Ŋwaari Noori (Zarma)",
            target: "San sanma no bureau WhatsApp margay ra",
            phone: "",
            text: `🍽️ *BUREAU ZAARI ŊWAARI MARGAYAN!* 👥\n\nWa marga Allôresto noodiya ra kaŋ *Amadou Seyni* sintin *Khady's Food* do zaari ŋwaari se.\n\n🔑 *Session Lamba:* \`PLATEAU-MINISTERE-404\`\n⏱️ *Daŋyan Alwaati:* Guura 11:45\n🛵 *Kandiyan kulu Guura 12:30* bureau ra!\n\n👉 *War ŋwaari tonton ne:* https://alloresto-niamey.com`,
          },
          status_update: {
            title: "🛵 Dirandikaw Go Fondo Ra (Zarma)",
            target: "San sanma no da dirandikaw fun goban do",
            phone: "+227 70 03 25 52",
            text: `🏍️ *WAR DIRANDIKAW GO FONDO RA!*\n\nWar ŋwaari korante fun goban do sohõ! Dirandikaw *Ibrahim Oumarou (Billo Express)* ga to war do *miniti 10 hala 15* ra.\n\n📞 Dirandikaw Talifono: *+227 92 08 08 22*\n👉 War nooru soola wala Mynita tabbatandi. Ŋwaari kaano nda Allôresto!`,
          },
        };

      case "fr":
      default:
        return {
          order_client: {
            title: "🧾 Confirmation de Commande Client & Validation Dépôt",
            target: "Envoyé au client après validation de son reçu de paiement",
            phone: "+227 70 03 25 52",
            text: `✅ *COMMANDE CONFIRMÉE & EN CUISINE — ALLÔRESTO NIAMEY* 🍽️\n\nBonjour M./Mme,\nBonne nouvelle ! Votre paiement/dépôt a été validé et votre commande *#CMD-2026-8801* est *officiellement passée en cuisine* chez *Khady's Food* !\n\n👨‍🍳 *Statut Cuisine :* Cuisson lancée\n⏱️ *Temps de préparation estimé :* ~25 minutes\n\n📦 *Articles :*\n- 1x Choukouya de Mouton Royal au Kan-Kan (4 500 F)\n- 2x Jus de Bissap frais Menthe 50cl (2 000 F)\n\n📍 *Adresse de livraison :* Ministère des Finances, Plateau, 3ème étage\n💵 *Total :* 7 500 FCFA (Frais Billo Express 1 000 F inclus)\n💳 *Paiement :* Mynita (Validé ✅)\n🏍️ *Livreur assigné :* Ibrahim Oumarou (Billo Express Niamey) • +227 92 08 08 22\n\n👉 *Suivez la cuisson et votre livreur en temps réel sur notre app :* https://alloresto-niamey.com\n\n📞 Service Client : +227 96 05 23 10 | WhatsApp : +227 70 03 25 52`,
          },
          kitchen_progress: {
            title: "👨‍🍳 Notification Cuisine Directe (Cuisson & Temps)",
            target: "Envoyé dynamiquement par le chef pour alerter le client",
            phone: "+227 70 03 25 52",
            text: `🔥 *POINT CUISINE EN DIRECT — KHADY'S FOOD* 👨‍🍳\n\nBonjour M./Mme,\nLe chef cuisinier prépare actuellement votre commande *#CMD-2026-8801*.\n\n⏱️ *Temps restant estimé :* 10 minutes avant emballage thermique.\n📝 *Note du chef :* Viande en cours de braisage au feu doux avec sauce Kan-Kan bien relevée.\n\n🛵 Le coursier Billo Express est déjà alerté pour la prise en charge dès la fin de cuisson !\n👉 Suivi en direct : https://alloresto-niamey.com`,
          },
          client_request: {
            title: "💬 Demande Client vers la Cuisine (Sauce / Piment / Couverts)",
            target: "Envoyé par le client pour personnaliser sa préparation",
            phone: "+227 70 03 25 52",
            text: `👋 *MESSAGE CLIENT POUR LA CUISINE — COMMANDE #CMD-2026-8801*\n\n🏪 *Restaurant :* Khady's Food\n👤 *Client :* Amadou Seyni (+227 90 12 34 56)\n📌 *Sujet :* 🌶️ Préférence Piment & Couverts\n\n📝 *Détail de ma demande :*\n« Merci de bien vouloir servir le piment à part et d'ajouter 2 sets de couverts supplémentaires pour le bureau. »\n\nMerci pour votre réactivité ! 🍽️`,
          },
          billo_dispatch: {
            title: "🏍️ Fiche de Dispatch Livreur Billo Express",
            target: "Envoyé directement au coursier Billo Express assigné",
            phone: "+227 92 08 08 22",
            text: `🚀 *NOUVELLE COURSE ALLÔRESTO & BILLO EXPRESS* 🏍️\n\n📋 *ID Commande :* #CMD-2026-8801\n🏪 *Restaurant Retrait :* Khady's Food (Avenue de l'Islam, près Grande Mosquée)\n\n👤 *Client :* Amadou Seyni\n📞 *Téléphone Client :* +227 90 12 34 56\n📍 *Lieu de Livraison :* Plateau, Rue des Ministères, Immeuble Principal (Bureau 304)\n\n💵 *Montant à encaisser :* 7 500 FCFA (si paiement cash)\n⏱️ *Délai garanti :* 20 minutes chrono`,
          },
          cart_recovery: {
            title: "🛒 Relance Panier Abandonné (+ Code Promo)",
            target: "Pour réengager un visiteur n'ayant pas finalisé",
            phone: "+227 70 03 25 52",
            text: `👋 *Bonjour ! Vous avez faim à Niamey ?*\n\nNous avons remarqué que vous avez laissé des délices dans votre panier Allôresto (Choukouya de Mouton & Capitaine Braisé) !\n\n🎁 Pour vous régaler ce midi, voici un code promo exclusif de *-500 FCFA* : \`SAVOUR500\`\n\n👉 *Finalisez votre commande en 1 clic :* https://alloresto-niamey.com\n🏍️ *Livraison express Billo Express chez vous ou au bureau !*`,
          },
          group_invite: {
            title: "👥 Invitation Commande Groupée (Plateau / Ministères)",
            target: "À partager dans le groupe WhatsApp du bureau",
            phone: "",
            text: `🍽️ *COMMANDE GROUPÉE DÉJEUNER DU BUREAU !*\n\nRejoignez la commande collective Allôresto initiée par *Amadou Seyni* chez *Khady's Food* pour le déjeuner d'aujourd'hui.\n\n🔑 *Code Session :* \`PLATEAU-MINISTERE-404\`\n⏱️ *Heure limite d'ajout :* 11h45\n🛵 *Livraison groupée à 12h30* au bureau !\n\n👉 *Ajoutez vos plats ici en 1 clic :* https://alloresto-niamey.com`,
          },
          status_update: {
            title: "🛵 Alerte Livreur en Route",
            target: "Notification quand le livreur quitte le restaurant",
            phone: "+227 70 03 25 52",
            text: `🏍️ *VOTRE LIVREUR EST EN ROUTE !*\n\nVotre repas chaud vient de quitter les cuisines ! Le livreur *Ibrahim Oumarou (Billo Express)* arrive à votre adresse dans environ *10 à 15 minutes*.\n\n📞 Numéro direct du livreur : *+227 92 08 08 22*\n👉 Préparez votre règlement ou confirmez votre paiement Mynita. Bon appétit avec Allôresto !`,
          },
        };
    }
  };

  const localizedTemplates = getLocalizedTemplates(selectedLanguage);
  const currentTpl = localizedTemplates[selectedTemplate];

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
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3 h-3 fill-current" />
                <span>Automatisation WhatsApp Niamey</span>
              </span>
              <span className="text-xs text-slate-400">Canal Direct +227 70 03 25 52</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Centre d&apos;Automatisation &amp; Dispatch WhatsApp
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Notifications instantanées multilingues (FR / EN / Haoussa / Zarma), fiches de dispatch Billo Express et dialogue cuisine-client.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multilingual Language Switcher Bar */}
        <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold shrink-0">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Langue du message WhatsApp :</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {languagesList.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLanguage === lang.code
                    ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Template Selectors */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {(
            [
              { key: "order_client", label: "Confirmation Client", icon: ShoppingBag },
              { key: "kitchen_progress", label: "👨‍🍳 Cuisine ➔ Client", icon: ChefHat },
              { key: "client_request", label: "💬 Client ➔ Cuisine", icon: Flame },
              { key: "billo_dispatch", label: "Dispatch Livreur Billo", icon: Bike },
              { key: "cart_recovery", label: "Relance Panier", icon: Sparkles },
              { key: "group_invite", label: "Partage Groupe Bureau", icon: Users },
              { key: "status_update", label: "Livreur en Route", icon: CheckCircle2 },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = selectedTemplate === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSelectedTemplate(item.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Template Details */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
              <div>
                <h3 className="text-base font-black text-white">{currentTpl.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentTpl.target}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs font-bold">
                  WhatsApp Niger (+227)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  {languagesList.find((l) => l.code === selectedLanguage)?.flag} {languagesList.find((l) => l.code === selectedLanguage)?.label}
                </span>
              </div>
            </div>

            {/* Message Preview in WhatsApp Style Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {currentTpl.text}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopy(currentTpl.text, `${selectedTemplate}_${selectedLanguage}`)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === `${selectedTemplate}_${selectedLanguage}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Texte Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le Modèle</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenWhatsApp(currentTpl.text, currentTpl.phone)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25 ml-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Ouvrir &amp; Envoyer sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Direct WhatsApp Support Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Ligne Directe Commandes WhatsApp Allôresto</h4>
                <p className="text-slate-400 text-[11px]">
                  Assistance commandes, devis traiteur &amp; suivi : <strong>+227 70 03 25 52</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                window.open("https://api.whatsapp.com/send?phone=22770032552&text=Bonjour%20Allôresto,%20je%20souhaite%20commander%20!", "_blank")
              }
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Discuter en Direct</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

