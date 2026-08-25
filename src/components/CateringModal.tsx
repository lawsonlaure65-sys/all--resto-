import React, { useState } from "react";
import {
  X,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  Send,
  Check,
  Clock,
  HeartHandshake,
  DollarSign,
  Utensils,
  ChefHat,
  MessageCircle,
} from "lucide-react";
import { CateringQuoteRequest } from "../types";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote?: (quote: CateringQuoteRequest) => void;
}

export const CateringModal: React.FC<CateringModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuote,
}) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("+227 ");
  const [eventType, setEventType] = useState<CateringQuoteRequest["eventType"]>("entreprise");
  const [guestCount, setGuestCount] = useState<number>(30);
  const [eventDate, setEventDate] = useState("");
  const [budgetFCFA, setBudgetFCFA] = useState<number>(150000);
  const [location, setLocation] = useState("Quartier Plateau / Grande Mosquée, Niamey");
  const [culinaryPreferences, setCulinaryPreferences] = useState("Choukouya au Kan-Kan, Dambou au Kopto, Grillades de Pintade & Jus de Bissap");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const eventTypesList = [
    { id: "entreprise", label: "💼 Déjeuner d'Entreprise / Ministère", pricePerHead: 3500 },
    { id: "mariage", label: "💍 Mariage & Réception Prestigieuse", pricePerHead: 5000 },
    { id: "bapteme", label: "👶 Baptême & Célébration Familiale", pricePerHead: 4000 },
    { id: "dot", label: "🎁 Dot & Cérémonie Coutumière", pricePerHead: 4500 },
    { id: "anniversaire", label: "🎉 Anniversaire & Fête Privée", pricePerHead: 3500 },
    { id: "brunch", label: "🥐 Brunch & Pause Petit-Déjeuner", pricePerHead: 2500 },
    { id: "soutenance", label: "🎓 Soutenance de Thèse / Cocktail", pricePerHead: 3000 },
    { id: "box_sauces", label: "🥫 Commande Box Sauces en Gros", pricePerHead: 2000 },
  ];

  const estimatedTotal = guestCount * (eventTypesList.find(e => e.id === eventType)?.pricePerHead || 3500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quoteRequest: CateringQuoteRequest = {
      id: `DEV-TRAITEUR-${Date.now().toString().slice(-4)}`,
      clientName: clientName || "Client Traiteur Allôresto",
      clientPhone: clientPhone || "+227 96 05 23 10",
      eventType,
      guestCount,
      eventDate: eventDate || "Date à convenir",
      budgetFCFA: budgetFCFA || estimatedTotal,
      location,
      culinaryPreferences,
      notes,
      status: "pending",
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (onSubmitQuote) {
      onSubmitQuote(quoteRequest);
    }

    // Format WhatsApp message
    const eventLabel = eventTypesList.find(e => e.id === eventType)?.label || eventType;
    const waText = encodeURIComponent(
      `*DEMANDE DE DEVIS ÉVÉNEMENT & TRAITEUR ALLÔRESTO NIAMEY*\n\n` +
      `👤 *Client :* ${quoteRequest.clientName}\n` +
      `📞 *Téléphone :* ${quoteRequest.clientPhone}\n` +
      `🎉 *Type d'événement :* ${eventLabel}\n` +
      `👥 *Nombre de convives :* ${guestCount} personnes\n` +
      `📅 *Date souhaitée :* ${quoteRequest.eventDate}\n` +
      `📍 *Lieu :* ${location}\n` +
      `💰 *Budget estimé :* ${estimatedTotal.toLocaleString()} FCFA\n` +
      `🍲 *Préférences :* ${culinaryPreferences}\n` +
      `${notes ? `📝 *Notes :* ${notes}\n` : ""}\n` +
      `_Envoyé via Allôresto.ne — Vos envies, bien servies à Niamey._`
    );

    // Open WhatsApp in new tab
    const waUrl = `https://wa.me/22770032552?text=${waText}`;
    window.open(waUrl, "_blank");

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/25 shrink-0">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Service Traiteur &amp; Événements
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                Niamey &amp; Fleuve
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Mariages, baptêmes, cocktails de ministères, buffets de bureau et plateaux à partager.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-white">
              Demande de Devis Transmise avec Succès !
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Votre demande a été envoyée directement à notre responsable traiteur sur WhatsApp (<strong>+227 70 03 25 52</strong>). Nous vous recontacterons sous 2 heures avec une proposition sur-mesure.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
              >
                Retour à l'application
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Type of event */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">
                Type d'événement traiteur *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {eventTypesList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEventType(t.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition cursor-pointer flex items-center justify-between ${
                      eventType === t.id
                        ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span>{t.label}</span>
                    {eventType === t.id && <Check className="w-3.5 h-3.5 text-orange-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>Nombre de personnes :</span>
                  <span className="text-orange-400 font-black">{guestCount} convives</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10 pers.</span>
                  <span>100 pers.</span>
                  <span>500+ pers.</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">
                  Date de l'événement *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Client Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">
                  Nom complet ou Entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hadiza Moussa / Ministère de l'Économie"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">
                  Téléphone / WhatsApp au Niger (+227) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+227 96 00 00 00"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            {/* Location & Preferences */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">
                Lieu ou Quartier de livraison / réception à Niamey
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Quartier Plateau, Salle de conférence, ou Domicile Koira Kano"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 block">
                Plats &amp; Préférences culinaires souhaitées
              </label>
              <textarea
                rows={2}
                value={culinaryPreferences}
                onChange={(e) => setCulinaryPreferences(e.target.value)}
                placeholder="Ex: Choukouya d'agneau, pintade braisée, dambou kopto, assortiment de jus de fruits frais..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Estimation Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-950 border border-orange-500/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">
                  Budget indicatif automatique pour {guestCount} personnes :
                </span>
                <span className="text-xl font-black text-amber-400">
                  ~ {estimatedTotal.toLocaleString()} FCFA
                </span>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Devis personnalisé gratuit
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Envoyer ma Demande de Devis sur WhatsApp</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              📞 Assistance directe : <strong>+227 96 05 23 10</strong> &bull; WhatsApp : <strong>+227 70 03 25 52</strong>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
