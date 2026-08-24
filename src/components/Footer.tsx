import React from "react";
import { UtensilsCrossed, Phone, Mail, MapPin, Smartphone, ShieldCheck, Heart, Scale } from "lucide-react";
import { CITIES_DATA } from "../data/allorestoData";

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenDataProtection?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPartnerModal, onOpenDataProtection }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">
                Allô<span className="text-orange-500">resto</span> <span className="text-xs font-semibold text-emerald-400">Niger 🇳🇪</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La plateforme moderne de restauration et de livraison à Niamey : commande express, précommande au bureau et partenariat logistique Billo Express.
            </p>
            <div className="pt-1 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Grande Mosquée Mouhamar Khadafi, Niamey</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Assistance &amp; WhatsApp : +227 90 12 34 56</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services & Roles */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Espaces &amp; Solutions
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  🛵 Livraison Express à domicile &amp; bureau
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  🍱 Commande groupée Ministères &amp; Salariés
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  🛍️ Click &amp; Collect à emporter
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPartnerModal}
                  className="text-orange-400 font-bold hover:underline cursor-pointer text-left"
                >
                  🏪 Rejoindre comme Restaurant Partenaire
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  🏍️ Devenir Coursier Billo Express
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Districts in Niamey */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Zones de livraison à Niamey
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Plateau (Ministères)",
                "Grande Mosquée Khadafi",
                "Koira Kano",
                "Koira Tegui",
                "Yantala",
                "Recasement",
                "Goudel",
                "Dar-Es-Salam",
                "Francophonie",
                "Aéroport",
              ].map((zone) => (
                <span
                  key={zone}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: PWA App Install & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Application PWA Android
            </h4>
            <p className="text-[11px] text-slate-300">
              Installez Allôresto sur votre smartphone Android en 1 clic pour commander vos déjeuners sans téléchargement lourd.
            </p>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-orange-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">PWA Prête &amp; Rapide</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Compatible Android &amp; iOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>&copy; {new Date().getFullYear()} Allôresto Niger. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenDataProtection}
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conformité HAPDP (Loi n° 2022-59 / 2023-31)</span>
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>Airtel Money, Moov Flooz &amp; Espèces</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

