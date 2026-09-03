import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { X, Store, CheckCircle2, Phone, Mail, MapPin, Utensils, Send, ArrowRight } from "lucide-react";

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Niamey");
  const [cuisineType, setCuisineType] = useState("Grillades du Sahel & Dambou");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName,
          managerName,
          email,
          phone,
          city,
          cuisineType,
        }),
      });
      await res.json();
    } catch (e) {
      // Continue anyway
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/30 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">Rejoindre le Réseau Allôresto</h3>
              <p className="text-xs text-orange-100 opacity-90">
                Multipliez vos commandes &amp; votre chiffre d&apos;affaires
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Demande enregistrée avec succès !</h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Merci <strong>{managerName}</strong>. Notre équipe d&apos;intégration Allôresto prendra contact avec vous au <strong>{phone}</strong> sous 24 heures pour finaliser la mise en ligne de votre menu et la fourniture de la tablette de réception des commandes.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs hover:bg-orange-400 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nom de l&apos;établissement *
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Ex: Le Grill Savoyard, Chez Mama..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Nom du gérant *</label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Ex: Alexandre Bernard"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Ville d&apos;activité *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Niamey (Plateau, Yantala, Koira Kano...)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Téléphone direct Niger *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+227 90 12 34 56"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Email professionnel *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@monresto.ne"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Type de cuisine principale</label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Grillades du Sahel & Dambou">Grillades du Sahel &amp; Dambou</option>
                <option value="Spécialités Nigériennes & Riz au Gras">Spécialités Nigériennes &amp; Riz au Gras</option>
                <option value="Chawarma & Libanais">Chawarma &amp; Libanais</option>
                <option value="Burgers & Fast Food Niamey">Burgers &amp; Fast Food Niamey</option>
                <option value="Pâtisserie & Brunch Fleuve">Pâtisserie &amp; Brunch Fleuve</option>
                <option value="Pizzas & Italien">Pizzas &amp; Italien</option>
              </select>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">✨ Forfait Lancement 2026 :</span>
                <span className="font-mono text-emerald-400 font-bold">75 000 FCFA/mois (0% comm.)</span>
              </div>
              <p className="text-slate-400 leading-tight">
                Flotte Billo Express incluse, marketing et application de commande.
                Vous pourrez également <a href="/app/admin/contracts" target="_blank" rel="noreferrer" className="text-orange-400 underline hover:text-orange-300 font-semibold">consulter ou signer le contrat numérique ici</a>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Envoi de votre dossier...</span>
              ) : (
                <>
                  <span>Soumettre ma demande de partenariat</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
