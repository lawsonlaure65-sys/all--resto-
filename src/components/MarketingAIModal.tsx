import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Send,
  Target,
  Flame,
  Zap,
  Phone,
  MessageSquare,
  Gift,
  DollarSign,
  Users,
  Clock,
  Store,
  ChevronRight,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface MarketingCampaign {
  id: string;
  title: string;
  targetAudience: string;
  channel: "WhatsApp" | "SMS" | "Facebook" | "Instagram" | "Statut";
  headline: string;
  messageText: string;
  promoCode: string;
  discountValue: string;
  expectedConversion: string;
  projectedRevenue: string;
}

const PRESET_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: "camp-veille-20h",
    title: "🌙 Veille à 20h00 : Précommande Menu du Jour (Avant 21h)",
    targetAudience: "Tous clients, Fonctionnaires, Entreprises & Familles de Niamey",
    channel: "Statut",
    headline: "Précommandez votre Plat du Jour avant 21h00 pour garantir votre déjeuner !",
    messageText:
      "🌙 *MENU DU JOUR DE DEMAIN — PRÉCOMMANDES OUVERTES JUSQU'À 21H !* 🔥🍲\n\nDemain midi à Niamey, le Chef Khady's Food & Allôresto vous réserve son fameux *Riz au Gras Impérial & Pintade Fumée du Fleuve* avec Jus de Bissap frais offert (3 000 FCFA) !\n\n⚠️ *RÈGLE D'OR :* Précommandez ce soir avant *21h00 au plus tard* pour garantir votre portion chaude livrée à votre bureau ou domicile dès 12h00 !\n\n🛵 Livraison Billo Express dans tout Niamey\n📲 Commandez en 1 clic : https://alloresto-niamey.vercel.app\n📞 WhatsApp Direct : +227 70 03 25 52\n\nSuivez nos créations : Facebook @Allôresto • Insta @allo_resteau • TikTok @allo_restau",
    promoCode: "PRE21H",
    discountValue: "-500 FCFA",
    expectedConversion: "41.0%",
    projectedRevenue: "+320 000 FCFA / jour",
  },
  {
    id: "camp-matin-08h",
    title: "☀️ Jour J à 08h00 : Flash Matinal & Dernières Portions",
    targetAudience: "Travailleurs, Cadres du Plateau & Habitants de Niamey",
    channel: "WhatsApp",
    headline: "Bonjour Niamey ! Le Chef allume les fourneaux — Dernières portions disponibles",
    messageText:
      "☀️ *BONJOUR NIAMEY — PLAT DU JOUR FRAÎCHEMENT PRÉPARÉ !* 🍲🔥\n\nLes fourneaux tournent déjà chez Allôresto ! Les portions du jour partent très vite ce midi.\n\n✨ *Riz au Gras & Demi-Pintade Fumée* (3 000 FCFA)\n⚡ Livraison chrono 45-60 min par Billo Express à votre bureau ou domicile.\n\n⚠️ *Dernières portions disponibles !* Réservez avant rupture : https://alloresto-niamey.vercel.app\n📞 WhatsApp Express : +227 70 03 25 52\n\nFacebook : @Allôresto • Instagram : @allo_resteau • TikTok : @allo_restau",
    promoCode: "MATIN08",
    discountValue: "Jus Local Offert",
    expectedConversion: "36.5%",
    projectedRevenue: "+280 000 FCFA / midi",
  },
  {
    id: "camp-1",
    title: "⚡ Rush Midi Ministères & Bureaux du Plateau",
    targetAudience: "Fonctionnaires, Cadres de Banques & Sociétés de Niamey",
    channel: "WhatsApp",
    headline: "Votre Déjeuner Chaud Livré en 45 à 60 mn au Bureau !",
    messageText:
      "🔥 *PAUSE DÉJEUNER SANS ATTENTE À NIAMEY !*\n\nVous êtes au bureau au Plateau, Koira Kano ou Yantala ?\nCommandez votre *Formule Midi Khady's Food* (Demi-Pintade Braisée, Riz au Gras & Jus de Bissap frais) livrée chaude directement à votre accueil avec *Billo Express* !\n\n🎁 *Code Promo Spécial :* `MIDI2026` (-500 FCFA sur votre commande)\n🛵 *Livraison express garantie.*\n\n👉 *Commandez en 2 clics sur Allôresto :* https://alloresto-niamey.vercel.app",
    promoCode: "MIDI2026",
    discountValue: "-500 FCFA",
    expectedConversion: "28.5%",
    projectedRevenue: "+180 000 FCFA / jour",
  },
  {
    id: "camp-2",
    title: "🌙 Soirée Choukouya & Grillades Royales du Sahel",
    targetAudience: "Familles, Soirées entre Amis & Dîners Nocturnes",
    channel: "Statut",
    headline: "Choukouya d'Agneau au Kan-Kan & Capitaine Braisé",
    messageText:
      "🌙 *CE SOIR À NIAMEY : C'EST CHOUKOUYA TIME !* 🥩🔥\n\nLe goût authentique du Sahel directement chez vous :\n✨ *Choukouya de Mouton Royal* saupoudré d'épices Kan-Kan.\n✨ *Gros Capitaine Braisé* du Fleuve Niger avec Alloco doré.\n✨ *Boissons locales fraîches* (Bissap menthe, Jus de Baobab).\n\n📱 Paiement ultra simple par *Mynita, Amanata, Al-Izza ou Cash* à la livraison.\n👉 *Découvrez la Grande Carte du Soir :* https://alloresto-niamey.vercel.app",
    promoCode: "SAHEL2026",
    discountValue: "Jus Local Offert",
    expectedConversion: "22.0%",
    projectedRevenue: "+250 000 FCFA / weekend",
  },
  {
    id: "camp-3",
    title: "🌅 Petit Déjeuner Énergétique Sahélien (07h - 10h)",
    targetAudience: "Travailleurs matinaux & Familles",
    channel: "SMS",
    headline: "Commencez la journée avec une bonne Omelette Galmi & Bouillie Arawak",
    messageText:
      "🌅 *BONJOUR NIAMEY !* Allôresto vous livre votre petit déjeuner chaud dès 07h00 : Omelettes savoureuses aux oignons doux de Galmi, beignets Massa au miel et Café Touba chaud. Commandez dès maintenant : https://alloresto-niamey.vercel.app",
    promoCode: "MATIN10",
    discountValue: "-10%",
    expectedConversion: "18.5%",
    projectedRevenue: "+95 000 FCFA / matin",
  },
  {
    id: "camp-4",
    title: "🎉 Box Repas Événements & Commandes Groupées",
    targetAudience: "Directions Générales, ONG & Réunions de Projets",
    channel: "WhatsApp",
    headline: "Gagnez du temps : 1 commande groupée pour tout le service !",
    messageText:
      "💼 *COMMANDE GROUPÉE ENTREPRISE SUR ALLÔRESTO*\nFini les fiches de commande manuelles ! Créez un lien de groupe pour vos collaborateurs au bureau et recevez toutes vos barquettes étiquetées en 1 seule livraison Billo Express avec reçu certifié.\n\n📞 Assistance dédiée WhatsApp : +227 70 03 25 52\n👉 https://alloresto-niamey.vercel.app",
    promoCode: "PRO100",
    discountValue: "Livraison Offerte",
    expectedConversion: "34.0%",
    projectedRevenue: "+350 000 FCFA / semaine",
  },
];

interface MarketingAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketingAIModal: React.FC<MarketingAIModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"campaigns" | "generator" | "automation" | "insights">("campaigns");
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign>(PRESET_CAMPAIGNS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom AI Generator state
  const [dishKeyword, setDishKeyword] = useState("Choukouya de Mouton et Capitaine braisé");
  const [tone, setTone] = useState<"gourmand" | "urgent" | "bureau" | "vip">("gourmand");
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShareWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleGenerateCopy = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let copy = "";
      if (tone === "urgent") {
        copy = `🚨 *OFFRE FLASH DU JOUR SUR ALLÔRESTO NIAMEY !* ⏱️\n\nEnvie de *${dishKeyword}* ?\nProfitez de *-15% exceptionnels* pour toute commande passée avant 14h00 !\n\n🏍️ Livraison express avec *Billo Express* sur tous les quartiers de Niamey.\n💳 Paiement par *Mynita, Amanata, Al-Izza & Cash*.\n\n👉 Commandez maintenant : https://alloresto.ne`;
      } else if (tone === "bureau") {
        copy = `💼 *PAUSE DÉJEUNER EFFICACE AU BUREAU* 🇳🇪\n\nNe perdez plus 1h dans les embouteillages ! Savourez votre *${dishKeyword}* chaud, emballé sous barquette scellée et livré en direct à votre poste de travail.\n\n🎁 *Code Promo Pro :* \`BUREAU227\`\n👉 https://alloresto.ne`;
      } else if (tone === "vip") {
        copy = `👑 *L'EXCELLENCE CULINAIRE SAHÉLIENNE À VOTRE TABLE*\n\nDécouvrez la perfection avec notre *${dishKeyword}*, préparé par les meilleurs chefs de Niamey avec des épices nobles et des ingrédients frais du terroir.\n\n✨ Service traiteur & livraison soignée.\n👉 https://alloresto.ne`;
      } else {
        copy = `🤤 *VOS PAPILLES VONT ADORER CE MIDI !* 🔥\n\nCraquez pour notre savoureux *${dishKeyword}*, mariné aux aromates du terroir et servi avec ses accompagnements dorés.\n\n🛵 Livré chaud et prêt à déguster à Niamey.\n👉 Commandez ici : https://alloresto.ne`;
      }
      setGeneratedCopy(copy);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>IA Marketing &amp; Croissance Allôresto</span>
              </span>
              <span className="text-xs text-slate-400">Automatisation des Ventes à Niamey</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Pilote Automatique Commercial &amp; Campagnes Virales
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Générez du chiffre d&apos;affaires sans effort : campagnes WhatsApp prêtes à diffuser, offres flash pour ministères et simulateur de rentabilité.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "campaigns"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Campagnes Virales Prêtes</span>
          </button>

          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "generator"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Générateur Copywriting IA</span>
          </button>

          <button
            onClick={() => setActiveTab("automation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "automation"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Vente &amp; Stratégies Niamey</span>
          </button>

          <button
            onClick={() => setActiveTab("insights")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "insights"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/20"
                : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tableau de Croissance</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: PRESET CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {PRESET_CAMPAIGNS.map((camp) => (
                  <button
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                      selectedCampaign.id === camp.id
                        ? "bg-slate-800 border-orange-500 shadow-md shadow-orange-500/10 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-orange-400">
                        {camp.channel}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-2 leading-snug">
                        {camp.title}
                      </h4>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 font-bold">
                      {camp.projectedRevenue}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Campaign Detail & Share Box */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
                  <div>
                    <h3 className="text-base font-black text-white">{selectedCampaign.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Cible : <strong>{selectedCampaign.targetAudience}</strong> &bull; Canal : <strong>{selectedCampaign.channel}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black">
                      Taux Conversion : {selectedCampaign.expectedConversion}
                    </span>
                  </div>
                </div>

                {/* Message Preview Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedCampaign.messageText}
                </div>

                {/* Actions Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Code promo inclus :</span>
                    <span className="font-mono font-bold text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-lg border border-orange-500/30 text-xs">
                      {selectedCampaign.promoCode} ({selectedCampaign.discountValue})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleCopy(selectedCampaign.messageText, selectedCampaign.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedId === selectedCampaign.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le Texte</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(selectedCampaign.messageText)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Diffuser sur WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI COPYWRITING GENERATOR */}
          {activeTab === "generator" && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-black text-white">Générateur de Textes &amp; Posts Gourmands</h3>
                    <p className="text-xs text-slate-400">
                      Entrez un plat ou une formule pour générer un message publicitaire irrésistible.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Nom du plat ou de la formule :
                    </label>
                    <input
                      type="text"
                      value={dishKeyword}
                      onChange={(e) => setDishKeyword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Ton de communication :
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTone("gourmand")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          tone === "gourmand"
                            ? "bg-orange-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        🤤 Gourmand &amp; Saveurs
                      </button>
                      <button
                        onClick={() => setTone("urgent")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          tone === "urgent"
                            ? "bg-orange-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        ⏱️ Flash &amp; Promo
                      </button>
                      <button
                        onClick={() => setTone("bureau")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          tone === "bureau"
                            ? "bg-orange-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        💼 Bureaux &amp; Cadres
                      </button>
                      <button
                        onClick={() => setTone("vip")}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          tone === "vip"
                            ? "bg-orange-500 text-slate-950 font-black"
                            : "bg-slate-900 text-slate-400 border border-slate-800"
                        }`}
                      >
                        👑 Prestige Sahélien
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateCopy}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                  <span>{isGenerating ? "Génération en cours..." : "Générer le Post Copywriting avec l'IA"}</span>
                </button>
              </div>

              {generatedCopy && (
                <div className="p-5 rounded-3xl bg-slate-950 border border-orange-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Texte Copywrite Généré :</span>
                    </span>
                    <button
                      onClick={() => handleCopy(generatedCopy, "custom-gen")}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-900 px-3 py-1 rounded-lg border border-slate-800"
                    >
                      {copiedId === "custom-gen" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {generatedCopy}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleShareWhatsApp(generatedCopy)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Diffuser sur WhatsApp Direct</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUTO-SALE STRATEGIES */}
          {activeTab === "automation" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Moteur d&apos;Auto-Vente Actif :</strong> Allôresto configure des déclencheurs automatiques pour relancer les paniers abandonnés, booster les commandes du midi au Plateau et stimuler les dîners de weekend.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">💼</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Actif (11h00 - 14h00)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Push Déjeuner Ministères &amp; Banques</h4>
                  <p className="text-xs text-slate-400">
                    Alerte quotidienne automatique avec le Menu du Jour Khady&apos;s Food à 11h15 pour capter les commandes de groupe avant le rush.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl">
                    Panier moyen : <strong>3 800 FCFA</strong> &bull; Taux de conversion : <strong>+31%</strong>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🛒</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Actif (Auto-Détect)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Relance Panier Abandonné WhatsApp</h4>
                  <p className="text-xs text-slate-400">
                    Envoi d&apos;un message bienveillant 15 min après abandon avec une remise de 5% pour finaliser la commande.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl">
                    Récupération : <strong>24% des paniers</strong> &bull; Chiffre généré : <strong>+85 000 FCFA/sem</strong>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🍗</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Actif (Vendredi &amp; Samedi 18h)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Offre Flash Weekend Choukouya &amp; Braisés</h4>
                  <p className="text-xs text-slate-400">
                    Mise en avant des grillades royales, alloco et boissons locales avec livraison prioritaire Billo Express.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl">
                    Ventes weekend : <strong>+45 commandes</strong> &bull; Satisfaction client : <strong>4.98/5</strong>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🎉</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      Actif (Sur Demande)
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Générateur de Devis Traiteur Automatique</h4>
                  <p className="text-xs text-slate-400">
                    Calcul instantané des budgets pour baptêmes, mariages et buffets d&apos;entreprises avec envoi direct sur WhatsApp.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 bg-slate-900 p-2.5 rounded-xl">
                    Devis moyen : <strong>350 000 FCFA</strong> &bull; Délai devis : <strong>Instantané</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GROWTH INSIGHTS */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Revenus Estimés</span>
                  <div className="text-lg sm:text-xl font-black text-orange-400 font-mono mt-1">
                    2 450 000 F
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">+28% ce mois</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Commandes Totales</span>
                  <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
                    684
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">98% livrées à temps</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Panier Moyen</span>
                  <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
                    3 580 F
                  </div>
                  <span className="text-[10px] text-slate-400">Niamey Plateau &amp; Yantala</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Part WhatsApp</span>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1">
                    74%
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Canal N°1 au Niger</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white">Top 3 des Plats les Plus Commandés à Niamey</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-bold text-white">1. Choukouya de Mouton Royal du Niger (Khady&apos;s Food)</span>
                    <span className="font-mono text-orange-400 font-bold">245 commandes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-bold text-white">2. Formule Midi Ministères &amp; Bureaux (Braisé + Riz + Bissap)</span>
                    <span className="font-mono text-orange-400 font-bold">188 commandes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-bold text-white">3. Gros Capitaine Braisé du Fleuve Niger</span>
                    <span className="font-mono text-orange-400 font-bold">132 commandes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6 shrink-0">
          <span>Allôresto IA Marketing &bull; Spécial Niamey 🇳🇪</span>
          <span className="text-orange-400 font-semibold">+227 70 03 25 52</span>
        </div>
      </motion.div>
    </div>
  );
};
