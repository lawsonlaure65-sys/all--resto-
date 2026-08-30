import React, { useState } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Bike,
  Store,
  ShoppingBag,
  Send,
  Check,
  ShieldCheck,
  Building2,
  Headphones,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderNow?: () => void;
  onOpenPartnerModal?: () => void;
  onOpenCourierSpace?: () => void;
  onOpenDataProtection?: () => void;
  onOpenCatering?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onOrderNow,
  onOpenPartnerModal,
  onOpenCourierSpace,
  onOpenDataProtection,
  onOpenCatering,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("🇳🇪 +227 ");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("commande");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [consentHapdp, setConsentHapdp] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getTargetEmail = (subj: string) => {
    switch (subj) {
      case "restaurant_partenaire":
        return ALLORESTO_BRAND_INFO.emails.partners;
      case "livraison":
        return ALLORESTO_BRAND_INFO.emails.delivery;
      case "reclamation":
      case "commande":
        return ALLORESTO_BRAND_INFO.emails.support;
      default:
        return ALLORESTO_BRAND_INFO.emails.general;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError("Veuillez saisir votre nom complet.");
      return;
    }
    if (!phone || phone.trim() === "🇳🇪 +227" || phone.replace(/\D/g, "").length < 8) {
      setFormError("Veuillez renseigner un numéro de téléphone valide au Niger (+227).");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Veuillez renseigner une adresse e-mail valide.");
      return;
    }
    if (!message.trim()) {
      setFormError("Veuillez rédiger votre message.");
      return;
    }
    if (!consentHapdp) {
      setFormError("Veuillez accepter le traitement des données pour la prise en charge de votre demande.");
      return;
    }

    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFullName("");
    setPhone("🇳🇪 +227 ");
    setEmail("");
    setSubject("commande");
    setOrderNumber("");
    setMessage("");
    setIsSubmitted(false);
    setFormError("");
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `*Demande Contact Allôresto Niamey*\n` +
      `👤 *Nom* : ${fullName}\n` +
      `📞 *Tél* : ${phone}\n` +
      `✉️ *E-mail* : ${email}\n` +
      `📌 *Objet* : ${subject}\n` +
      (orderNumber ? `🧾 *N° Commande* : ${orderNumber}\n` : "") +
      `💬 *Message* : ${message}`
    );
    return `https://wa.me/22770032552?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-orange-500/40 rounded-3xl p-5 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Contacts &bull; Allô<span className="text-orange-500">resto</span>
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Niamey 🇳🇪
                </span>
              </div>
              <p className="text-xs text-orange-400 font-semibold mt-0.5">
                « {ALLORESTO_BRAND_INFO.signature} »
              </p>
              <p className="text-[11px] text-slate-400">
                {ALLORESTO_BRAND_INFO.tagline} &bull; <em>{ALLORESTO_BRAND_INFO.promise}</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
              7j/7 &bull; 08h00 - 22h00
            </span>
          </div>
        </div>

        {/* 5 Quick Action Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Accès Rapides &bull; Que souhaitez-vous faire ?
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* 1. Commander maintenant */}
            <button
              onClick={() => {
                onClose();
                if (onOrderNow) onOrderNow();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 hover:scale-102 transition cursor-pointer text-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Commander maintenant</span>
            </button>

            {/* 2. Écrire sur WhatsApp */}
            <a
              href={`https://wa.me/22770032552?text=${encodeURIComponent("Bonjour Allôresto Niamey, je souhaite passer une commande ou poser une question.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:bg-emerald-900/60 transition cursor-pointer text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Écrire sur WhatsApp</span>
            </a>

            {/* 3. Devenir restaurant partenaire */}
            <button
              onClick={() => {
                onClose();
                if (onOpenPartnerModal) onOpenPartnerModal();
              }}
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-700 transition cursor-pointer text-center"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Devenir restaurant</span>
            </button>

            {/* 4. Devenir livreur partenaire */}
            <button
              onClick={() => {
                onClose();
                if (onOpenCourierSpace) onOpenCourierSpace();
              }}
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-700 transition cursor-pointer text-center"
            >
              <Bike className="w-4 h-4 text-cyan-400" />
              <span>Devenir livreur</span>
            </button>

            {/* 5. Contacter le support */}
            <a
              href="tel:+22796052310"
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 hover:bg-slate-700 transition cursor-pointer text-center col-span-2 sm:col-span-1"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Appeler le Support</span>
            </a>
          </div>
        </div>

        {/* 2-Column Main Section: Left = Coordinates & Delivery Rates, Right = Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Official Coordinates & Tarifs (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Official Coordinates Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>Coordonnées Officielles Niamey</span>
              </h4>

              <div className="space-y-2.5 text-slate-300">
                {/* Ligne Directe */}
                <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Ligne Directe &amp; Commandes</span>
                      <strong className="text-white text-xs">{ALLORESTO_BRAND_INFO.directLine}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(ALLORESTO_BRAND_INFO.directLine, "phone")}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition cursor-pointer"
                    title="Copier le numéro"
                  >
                    {copiedKey === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* WhatsApp Officiel */}
                <div className="flex items-start justify-between gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-400/80 block font-semibold">WhatsApp Commandes &amp; SAV</span>
                      <strong className="text-emerald-300 text-xs">{ALLORESTO_BRAND_INFO.whatsappOrders}</strong>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/22770032552"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-[10px] transition"
                    title="Ouvrir WhatsApp"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Horaires d'ouverture */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Service Client &amp; Cuisine</span>
                    <span className="text-slate-200 text-xs font-bold">{ALLORESTO_BRAND_INFO.openingHours}</span>
                  </div>
                </div>

                {/* Point de retrait */}
                <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Point de retrait &amp; Localisation</span>
                    <span className="text-slate-200 text-xs">{ALLORESTO_BRAND_INFO.pickupLocation}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Modèle 100% en ligne, livraison &amp; retrait sur place</span>
                  </div>
                </div>

                {/* Partenaire Livraison */}
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Partenaire Logistique Officiel</span>
                      <strong className="text-cyan-300 text-xs">{ALLORESTO_BRAND_INFO.deliveryPartner.name}</strong>
                      <span className="text-[10px] text-slate-400 block">Tél : {ALLORESTO_BRAND_INFO.deliveryPartner.contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Emails List */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>Adresses E-mails par Service</span>
              </h4>
              <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900">
                  <span className="text-slate-400">Général :</span>
                  <span className="font-mono text-slate-200">{ALLORESTO_BRAND_INFO.emails.general}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900">
                  <span className="text-slate-400">Partenariats restos :</span>
                  <span className="font-mono text-emerald-400">{ALLORESTO_BRAND_INFO.emails.partners}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900">
                  <span className="text-slate-400">Livraison / Livreurs :</span>
                  <span className="font-mono text-cyan-400">{ALLORESTO_BRAND_INFO.emails.delivery}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900">
                  <span className="text-slate-400">Assistance commandes :</span>
                  <span className="font-mono text-amber-400">{ALLORESTO_BRAND_INFO.emails.support}</span>
                </div>
              </div>
            </div>

            {/* Official Social Media Networks Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>📱 Réseaux Sociaux Officiels</span>
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* Facebook */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition">
                      f
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Facebook</span>
                      <strong className="text-white group-hover:text-blue-400 transition">{ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}</strong>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </a>

                {/* Instagram */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 text-pink-400 flex items-center justify-center text-xs font-black group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition">
                      📸
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Instagram</span>
                      <strong className="text-white group-hover:text-pink-400 transition">{ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}</strong>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </a>

                {/* TikTok */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-black group-hover:bg-cyan-500 group-hover:text-black transition">
                      🎵
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">TikTok</span>
                      <strong className="text-white group-hover:text-cyan-400 transition">{ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}</strong>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
                </a>
              </div>
            </div>

            {/* Official Delivery Pricing Table */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-orange-400" />
                <span>Tarifs de Livraison à Niamey</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1">Zone</th>
                      <th className="py-1 text-right">Avant 21h</th>
                      <th className="py-1 text-right text-orange-400">Dès 21h00</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    <tr>
                      <td className="py-1.5 font-medium">Centre-ville (Plateau, Mosquée, Yantala)</td>
                      <td className="py-1.5 text-right font-mono">1 000 FCFA</td>
                      <td className="py-1.5 text-right font-mono text-orange-400 font-bold">1 500 FCFA</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-medium">Périphérie (Koira Kano, Harobanda, Goudel...)</td>
                      <td className="py-1.5 text-right font-mono">1 500 FCFA</td>
                      <td className="py-1.5 text-right font-mono text-orange-400 font-bold">2 000 FCFA</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-medium text-emerald-400">Retrait direct (Grande Mosquée Kadhafi)</td>
                      <td className="py-1.5 text-right font-mono text-emerald-400 font-bold" colSpan={2}>
                        0 FCFA (Gratuit)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Le tarif de nuit s'applique automatiquement à partir de 21 h 00 précises dans le panier.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-4 h-4 text-orange-400" />
                    <span>Formulaire de Contact Allôresto</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Remplissez ce formulaire pour joindre l'équipe Allôresto ou le service dédié.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30">
                  Réponse &lt; 15 min
                </span>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 text-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Demande transmise avec succès !</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Merci <strong>{fullName}</strong>. Votre message a été adressé au département{" "}
                      <strong className="text-emerald-400">{getTargetEmail(subject)}</strong>. Notre service client à Niamey vous répondra par e-mail ou par téléphone au <strong>{phone}</strong> dans les plus brefs délais.
                    </p>
                  </div>

                  {/* Immediate WhatsApp shortcut */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Besoin d'une réponse ultra-rapide pour une commande en cours ?
                    </p>
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Transmettre aussi sur WhatsApp (+227 70 03 25 52)</span>
                    </a>
                  </div>

                  <button
                    onClick={resetForm}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Nom complet & Téléphone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Nom complet <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Amadou Oumarou"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Numéro de téléphone <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="🇳🇪 +227 96 00 00 00"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  {/* E-mail & Objet */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Adresse e-mail <span className="text-orange-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.ne"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        Objet de votre demande <span className="text-orange-400">*</span>
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="commande">📦 Question sur une commande</option>
                        <option value="restaurant_partenaire">🏪 Devenir restaurant partenaire</option>
                        <option value="livraison">🛵 Livraison / Rejoindre Billo Express</option>
                        <option value="reclamation">⚠️ Réclamation ou SAV</option>
                        <option value="traiteur">👑 Événements &amp; Devis Traiteur</option>
                        <option value="autre">💬 Autre demande générale</option>
                      </select>
                    </div>
                  </div>

                  {/* Numéro de commande (Facultatif) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Numéro de commande (facultatif)
                      </label>
                      <span className="text-[10px] text-slate-500">Ex: CMD-7842</span>
                    </div>
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Indiquez le code si votre demande concerne un repas"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Votre message <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Précisez votre demande, vos préférences, l'adresse ou le sujet..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                      required
                    />
                  </div>

                  {/* Notification destination e-mail preview */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400">
                    <span>Destinataire :</span>
                    <span className="font-mono text-orange-400 font-bold">{getTargetEmail(subject)}</span>
                  </div>

                  {/* HAPDP Consent */}
                  <label className="flex items-start gap-2.5 text-[11px] text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consentHapdp}
                      onChange={(e) => setConsentHapdp(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700 focus:ring-0"
                    />
                    <span>
                      J'accepte que mes coordonnées soient traitées par Allôresto Niger pour répondre à ma demande, conformément à la réglementation HAPDP (Loi n° 2022-59).
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer ma demande</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Service client localisé à Niamey &bull; Données protégées par la législation nigérienne.</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenDataProtection && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDataProtection();
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-400 underline cursor-pointer"
              >
                Politique HAPDP
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
