import React, { useState, useRef } from "react";
import {
  Calendar,
  Clock,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  Utensils,
  Store,
  DollarSign,
  Flame,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Smartphone,
  Layers,
  ChevronRight,
  RefreshCw,
  QrCode,
  Tag,
} from "lucide-react";
import { RESTAURANTS_DATA, ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { Restaurant, MenuItem } from "../types";

interface AdminDailyMenuSchedulerProps {
  restaurants?: Restaurant[];
  onSaveDailySpecial?: (special: DailySpecialPlan) => void;
  onClose?: () => void;
}

export interface DailySpecialPlan {
  id: string;
  targetDate: string; // "Demain, 9 Septembre 2026"
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  dishName: string;
  description: string;
  starter?: string;
  mainCourse: string;
  drinkOrDessert?: string;
  priceFcfa: number;
  availablePortions: number;
  imageUrl: string;
  chefNote?: string;
  publishTime: string; // "20:00"
  orderCutoffTime: string; // "21:00"
  deliveryStartTime: string; // "12:00"
  isActive: boolean;
}

const SAMPLE_FOOD_IMAGES = [
  {
    label: "Riz au Gras & Pintade Fumée",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80",
  },
  {
    label: "Choukouya d'Agneau au Kan-Kan",
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&auto=format&fit=crop&q=80",
  },
  {
    label: "Capitaine Braisé du Fleuve Niger",
    url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=900&auto=format&fit=crop&q=80",
  },
  {
    label: "Tchep Royal / Riz Sauté & Légumes",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&auto=format&fit=crop&q=80",
  },
  {
    label: "Poulet Bicyclette Rôti & Alloco",
    url: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=900&auto=format&fit=crop&q=80",
  },
];

export const AdminDailyMenuScheduler: React.FC<AdminDailyMenuSchedulerProps> = ({
  restaurants = RESTAURANTS_DATA,
  onSaveDailySpecial,
}) => {
  // Calculer la date de demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const capitalizedTomorrow =
    formattedTomorrow.charAt(0).toUpperCase() + formattedTomorrow.slice(1);

  // État du formulaire de programmation
  const [targetDate, setTargetDate] = useState<string>(capitalizedTomorrow);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    restaurants[0]?.id || "rest-1"
  );
  const [dishName, setDishName] = useState<string>(
    "Riz au Gras Impérial & Demi-Pintade Fumée du Fleuve"
  );
  const [starter, setStarter] = useState<string>(
    "Salade fraîche maraîchère de Niamey ou Pastels croustillants au thon"
  );
  const [mainCourse, setMainCourse] = useState<string>(
    "Riz au gras mijoté aux légumes du Sahel, demi-pintade braisée et jus réduit aux herbes"
  );
  const [drinkOrDessert, setDrinkOrDessert] = useState<string>(
    "Jus de Bissap frais 33cl offert ou Dêguê onctueux au lait caillé"
  );
  const [priceFcfa, setPriceFcfa] = useState<number>(3000);
  const [availablePortions, setAvailablePortions] = useState<number>(45);
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_FOOD_IMAGES[0].url);
  const [chefNote, setChefNote] = useState<string>(
    "Cuisson lente au feu de bois pour une chair fondante, assaisonnement Kan-Kan traditionnel."
  );

  // Studio Affiche & Réseaux
  const [activeNetworkTab, setActiveNetworkTab] = useState<
    "whatsapp" | "facebook" | "instagram" | "tiktok" | "sms"
  >("whatsapp");
  const [posterFormat, setPosterFormat] = useState<"square" | "story">("square");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState<boolean>(false);

  // Canvas caché pour export de l'affiche en PNG
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  // Génération des textes automatisés selon le réseau
  const getWhatsAppMessage = () => {
    return `🌙 *MENU DU JOUR ALLÔRESTO — SERVICE DU ${targetDate.toUpperCase()}* 🍲🔥

Demain midi à Niamey, régalez-vous avec la formule prestige du Chef de *${currentRestaurant?.name}* !

⭐ *${dishName.toUpperCase()}*
🥗 *Entrée :* ${starter}
🍛 *Plat Principal :* ${mainCourse}
🥤 *Boisson / Douceur :* ${drinkOrDessert}
💵 *Tarif unique :* ${priceFcfa.toLocaleString()} FCFA
📦 *Stock limité :* Seulement ${availablePortions} portions disponibles !

⚠️ *RÈGLE D'OR DE PRÉCOMMANDE :*
Commandez dès ce soir *avant 21h00* pour réserver votre portion chaude et garantir votre livraison prioritaire dès 12h00 à votre bureau ou domicile !

🛵 *Livraison express* par Billo Express dans tout Niamey (Plateau, Yantala, Koira Kano, etc.)
💳 *Paiement sécurisé :* Airtel Money (*155#), Moov Flooz (*156#), Espèces à la livraison.

📲 *Réservez en 1 clic :* https://alloresto.ne
📞 *WhatsApp Direct :* +227 70 03 25 52`;
  };

  const getFacebookMessage = () => {
    return `🍲 À TOUS LES GOURMETS DE NIAMEY : VOICI LE MENU DU JOUR DE DEMAIN (${targetDate}) ! 🍲

Fini le casse-tête du déjeuner au bureau ou à la maison ! Demain midi, le restaurant ${currentRestaurant?.name} vous prépare sa formule signature :

✨ ${dishName}
👉 Entrée : ${starter}
👉 Plat de résistance : ${mainCourse}
👉 Boisson : ${drinkOrDessert}

💰 Seulement ${priceFcfa.toLocaleString()} FCFA la formule complète !
⏰ PRÉCOMMANDES OUVERTES CE SOIR JUSQU'À 21H00 !
Ne tardez pas, les premières portions partent très vite pour les bureaux du Plateau et des Ministères.

🛵 Livraison chaude garantie dès 12h00 par Billo Express Niamey.
📲 Commandez directement ici : https://alloresto.ne
📞 Info & Réservation WhatsApp : +227 70 03 25 52

#Alloresto #Niamey #PlatDuJour #GastronomieNiger #BilloExpress #DejeunerNiamey`;
  };

  const getInstagramMessage = () => {
    return `✨ DEMAIN MIDI À NIAMEY : ${dishName.toUpperCase()} ✨
Par @${currentRestaurant?.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()} x @alloresto_niger

Une formule complète d'exception pour sublimer votre pause déjeuner :
🥗 ${starter}
🍛 ${mainCourse}
🥤 ${drinkOrDessert}

💰 Formule Complète : ${priceFcfa.toLocaleString()} FCFA
⏳ Précommandes ouvertes ce soir jusqu'à 21h00 tapantes !
🛵 Livraison ultra-rapide 45-60 min à votre bureau ou domicile avec @billo_express_niamey.

📲 Lien en bio pour commander en 2 clics : alloresto.ne
💬 Ou par DM / WhatsApp : +227 70 03 25 52

#NiameyFood #AllorestoNiger #NigerFoodie #PlatDuJour #MidiNiamey #PlateauNiamey #KhadyFood #BilloExpress #SahelEats`;
  };

  const getTikTokMessage = () => {
    return `🔥 Le meilleur plat de Niamey demain midi !
${dishName} chez ${currentRestaurant?.name} pour seulement ${priceFcfa.toLocaleString()} FCFA avec boisson offerte !
⏰ Précommandez ce soir avant 21h00 sur alloresto.ne pour être livré dès 12h00 au bureau !
🛵 Billo Express livre partout à Niamey. Lien en bio !`;
  };

  const getSmsMessage = () => {
    return `ALLORESTO: Menu du Jour de demain ${dishName} (${priceFcfa} F) chez ${currentRestaurant?.name}! Precommandez ce soir avant 21h sur alloresto.ne ou WhatsApp 70032552. Livr 12h!`;
  };

  const getCurrentMessage = () => {
    switch (activeNetworkTab) {
      case "facebook":
        return getFacebookMessage();
      case "instagram":
        return getInstagramMessage();
      case "tiktok":
        return getTikTokMessage();
      case "sms":
        return getSmsMessage();
      default:
        return getWhatsAppMessage();
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const text = getWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  // Téléchargement de l'affiche au format PNG haute résolution
  const handleDownloadPoster = () => {
    setIsGeneratingPoster(true);

    const canvas = document.createElement("canvas");
    const width = posterFormat === "square" ? 1080 : 1080;
    const height = posterFormat === "square" ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsGeneratingPoster(false);
      return;
    }

    // Charger l'image de fond
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      // 1. Fond sombre chic
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // 2. Dessiner l'image du plat en haut (ou au centre)
      const imgHeight = posterFormat === "square" ? 540 : 850;
      ctx.drawImage(img, 0, 0, width, imgHeight);

      // 3. Dégradé pour transition douce
      const gradient = ctx.createLinearGradient(0, imgHeight - 220, 0, imgHeight + 80);
      gradient.addColorStop(0, "rgba(9, 13, 22, 0)");
      gradient.addColorStop(1, "rgba(9, 13, 22, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, imgHeight - 220, width, 300);

      // 4. Header Bar / Badge
      ctx.fillStyle = "#f97316";
      ctx.fillRect(60, 50, 420, 56);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText("⭐ ALLÔRESTO NIGER", 80, 88);

      // Badge Veille / Date
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(width - 440, 50, 380, 56);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillText(`MENU DU ${targetDate.toUpperCase()}`, width - 420, 88);

      // 5. Pastille de Prix Ronde Vibrante
      const priceY = imgHeight - 40;
      ctx.beginPath();
      ctx.arc(width - 150, priceY, 95, 0, Math.PI * 2);
      ctx.fillStyle = "#ea580c";
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#fbbf24";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 36px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${priceFcfa.toLocaleString()}`, width - 150, priceY - 5);
      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillStyle = "#fef08a";
      ctx.fillText("FCFA", width - 150, priceY + 30);

      // 6. Titre du Restaurant & Nom du Plat
      ctx.textAlign = "left";
      ctx.fillStyle = "#fdba74";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText(`PAR LE CHEF • ${currentRestaurant?.name.toUpperCase()}`, 60, imgHeight + 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 48px Arial, sans-serif";
      const titleLines = wrapText(ctx, dishName, width - 120);
      let textY = imgHeight + 120;
      titleLines.forEach((line) => {
        ctx.fillText(line, 60, textY);
        textY += 56;
      });

      // 7. Formule complète (Entrée, Plat, Boisson)
      textY += 20;
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText(`🥗 Entrée : ${starter}`, 60, textY);
      textY += 40;
      ctx.fillText(`🍛 Plat : ${mainCourse}`, 60, textY);
      textY += 40;
      ctx.fillText(`🥤 Boisson : ${drinkOrDessert}`, 60, textY);

      // 8. Box d'Alerte Précommande Veille (Urgence 20h - 21h)
      textY += 45;
      ctx.fillStyle = "rgba(234, 88, 12, 0.15)";
      ctx.fillRect(60, textY, width - 120, 110);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#f97316";
      ctx.strokeRect(60, textY, width - 120, 110);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText("⏰ PRÉCOMMANDE OBLIGATOIRE LA VEILLE AVANT 21H00 !", 90, textY + 45);

      ctx.fillStyle = "#ffffff";
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText(
        "Garantit votre portion chaude livrée dès 12h00 à votre bureau ou domicile.",
        90,
        textY + 85
      );

      // 9. Footer Call-to-action & Contacts
      const footerY = height - 90;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, height - 140, width, 140);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText("📲 Commandez sur alloresto.ne", 60, footerY);

      ctx.fillStyle = "#34d399";
      ctx.fillText("📞 WhatsApp : +227 70 03 25 52", width - 480, footerY);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "20px Arial, sans-serif";
      ctx.fillText("Paiement Airtel Money • Moov Flooz • Cash à la livraison Billo Express", 60, footerY + 35);

      // Déclencher le téléchargement du PNG
      const link = document.createElement("a");
      link.download = `Affiche_Menu_du_Jour_${dishName.slice(0, 20).replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsGeneratingPoster(false);
    };

    img.onerror = () => {
      alert("Impossible de charger l'image pour l'affiche. Veuillez vérifier l'URL de l'image.");
      setIsGeneratingPoster(false);
    };
  };

  // Fonction utilitaire de wrapping pour le titre de l'affiche
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleSaveAndActivate = () => {
    const plan: DailySpecialPlan = {
      id: `daily-${Date.now()}`,
      targetDate,
      restaurantId: selectedRestaurantId,
      restaurantName: currentRestaurant?.name || "Restaurant Partenaire",
      restaurantPhone: currentRestaurant?.phone || "+227 96 05 23 10",
      dishName,
      description: `${mainCourse}. Inclus : ${starter} et ${drinkOrDessert}`,
      starter,
      mainCourse,
      drinkOrDessert,
      priceFcfa,
      availablePortions,
      imageUrl,
      chefNote,
      publishTime: "20:00",
      orderCutoffTime: "21:00",
      deliveryStartTime: "12:00",
      isActive: true,
    };

    // Stockage local
    try {
      localStorage.setItem("alloresto_active_daily_special", JSON.stringify(plan));
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    if (onSaveDailySpecial) {
      onSaveDailySpecial(plan);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Bannière d'Explication Clé du Timing : 20h -> 21h */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 border border-orange-500/30 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Programmation du Menu du Jour &amp; Studio d&apos;Affiches Réseaux
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
                  Veille de Service
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configurez le menu du lendemain, générez l&apos;affiche visuelle HD et diffusez automatiquement les messages de précommande.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleSaveAndActivate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/25"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Menu Enregistré &amp; Actif !</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activer sur l&apos;Application</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chronologie des Heures Clés */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm shrink-0">
              20h
            </div>
            <div>
              <span className="text-xs font-bold text-white block">1. Diffusion Réseaux Sociaux</span>
              <span className="text-[11px] text-slate-400">
                Partage de l&apos;affiche sur WhatsApp, Facebook &amp; Instagram
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
              21h
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 block">2. Clôture Précommande Veille</span>
              <span className="text-[11px] text-slate-400">
                Arrêt des commandes pour calibrer le marché et la cuisine
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
              12h
            </div>
            <div>
              <span className="text-xs font-bold text-white block">3. Livraison Express Jour J</span>
              <span className="text-[11px] text-slate-400">
                Livraison garantie en 45 min par Billo Express au bureau
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Formulaire à gauche + Studio Affiche & Messages à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* COLONNE GAUCHE (5 cols) : Formulaire de programmation */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-400" />
              <span>1. Détails du Menu pour Demain</span>
            </h4>

            {/* Date ciblée */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>Date du service (la veille pour le lendemain) :</span>
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Restaurant Partenaire */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-orange-400" />
                <span>Restaurant Partenaire :</span>
              </label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {restaurants.map((rest) => (
                  <option key={rest.id} value={rest.id}>
                    {rest.name} ({rest.cuisine})
                  </option>
                ))}
              </select>
            </div>

            {/* Nom du Plat du Jour */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Nom de la Formule ou Plat du Jour :</span>
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Ex : Riz au Gras Impérial & Pintade Fumée"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Entrée */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                🥗 Entrée incluse ou au choix :
              </label>
              <input
                type="text"
                value={starter}
                onChange={(e) => setStarter(e.target.value)}
                placeholder="Ex : Salade maraîchère de Niamey ou Pastels"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Plat Principal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                🍛 Plat Principal &amp; Cuisson :
              </label>
              <input
                type="text"
                value={mainCourse}
                onChange={(e) => setMainCourse(e.target.value)}
                placeholder="Ex : Riz au gras mijoté, demi-pintade braisée"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Boisson / Douceur */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                🥤 Boisson fraîche ou Dessert inclus :
              </label>
              <input
                type="text"
                value={drinkOrDessert}
                onChange={(e) => setDrinkOrDessert(e.target.value)}
                placeholder="Ex : Jus de Bissap 33cl offert ou Dêguê"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Prix & Portions Disponibles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-orange-400" />
                  <span>Prix Formule (FCFA) :</span>
                </label>
                <input
                  type="number"
                  value={priceFcfa}
                  onChange={(e) => setPriceFcfa(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Portions max :</span>
                </label>
                <input
                  type="number"
                  value={availablePortions}
                  onChange={(e) => setAvailablePortions(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Photo du Plat */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                <span>Photo du Plat (Sélection rapide) :</span>
              </label>

              <div className="grid grid-cols-5 gap-1.5">
                {SAMPLE_FOOD_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer relative ${
                      imageUrl === img.url
                        ? "border-orange-500 ring-2 ring-orange-500/50 scale-95"
                        : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
                    }`}
                    title={img.label}
                  >
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Ou collez l'URL d'une image..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLONNE DROITE (7 cols) : Studio Affiche & Messages */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Studio d'Affiche Visuelle */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>2. Affiche Digitale Réseaux Sociaux</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Visuel prêt à être partagé en Statut WhatsApp, Story Instagram &amp; Facebook dès 20h00.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPosterFormat("square")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      posterFormat === "square"
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Carré 1:1 (Post)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosterFormat("story")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      posterFormat === "story"
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Story 9:16 (Statut)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  disabled={isGeneratingPoster}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-orange-600/20 disabled:opacity-50"
                  title="Télécharger l'affiche en PNG HD pour la publier sur vos réseaux"
                >
                  {isGeneratingPoster ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Télécharger l&apos;Affiche (PNG)</span>
                </button>
              </div>
            </div>

            {/* Rendu Live de l'Affiche Visuelle */}
            <div className="flex justify-center p-3 bg-slate-900/50 rounded-2xl border border-slate-800/80">
              <div
                className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950 flex flex-col justify-between relative transition-all ${
                  posterFormat === "square" ? "aspect-square" : "aspect-[9/16]"
                }`}
              >
                {/* Image Header with Gradient Overlay */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
                  <img
                    src={imageUrl}
                    alt={dishName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Allôresto Niger</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-400 text-[10px] font-bold border border-amber-500/40 backdrop-blur-md">
                      MENU DU {targetDate.toUpperCase()}
                    </span>
                  </div>

                  {/* Pastille de Prix Ronde */}
                  <div className="absolute -bottom-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 border-4 border-amber-400 flex flex-col items-center justify-center text-white shadow-xl shadow-orange-500/40 z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-100">
                      Tarif
                    </span>
                    <span className="text-base font-black leading-none">
                      {priceFcfa.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-amber-200">FCFA</span>
                  </div>
                </div>

                {/* Body Content of Poster */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block">
                      PAR LE CHEF &bull; {currentRestaurant?.name}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                      {dishName}
                    </h3>

                    {/* Formula components */}
                    <div className="mt-2 space-y-1 text-xs text-slate-300">
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-emerald-400 font-bold">🥗 Entrée :</span>
                        <span>{starter}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-orange-400 font-bold">🍛 Plat :</span>
                        <span>{mainCourse}</span>
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <span className="text-amber-400 font-bold">🥤 Boisson :</span>
                        <span>{drinkOrDessert}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badge d'Urgence Précommande */}
                  <div className="p-2.5 rounded-xl bg-orange-950/60 border border-orange-500/40 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block text-[11px]">
                          Précommande ce soir avant 21h00 !
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Livraison garantie dès 12h00 au bureau par Billo Express
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white font-black text-[10px] uppercase shrink-0">
                      Demain
                    </span>
                  </div>

                  {/* Footer Bar of Poster */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-orange-400 font-bold">
                      📲 alloresto.ne
                    </span>
                    <span className="text-emerald-400 font-bold">
                      WhatsApp: +227 70 03 25 52
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Automatiques selon le Réseau */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>3. Messages Automatiques Prêts à Partager (Dès 20h00)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Copiez le message ou diffusez-le en 1 clic directement sur WhatsApp.
                </p>
              </div>

              {/* Network Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                {(
                  [
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "facebook", label: "Facebook" },
                    { id: "instagram", label: "Instagram" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "sms", label: "SMS" },
                  ] as const
                ).map((net) => (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setActiveNetworkTab(net.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      activeNetworkTab === net.id
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {net.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
              {getCurrentMessage()}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">
                Heure recommandée de publication : <strong className="text-orange-400">20h00</strong> &bull; Clôture : <strong className="text-amber-400">21h00</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(getCurrentMessage())}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier le Texte</span>
                    </>
                  )}
                </button>

                {activeNetworkTab === "whatsapp" && (
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/25"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Diffuser sur WhatsApp (Web/Mobile)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
