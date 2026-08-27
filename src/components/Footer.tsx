import React from "react";
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  ShieldCheck,
  Heart,
  Scale,
  ChefHat,
  BookOpen,
  MessageCircle,
  Compass,
  Sparkles,
} from "lucide-react";
import { ALLORESTO_BRAND_INFO } from "../data/allorestoData";
import { BrandLogo } from "./BrandLogo";
import { BilloExpressLogo } from "./BilloExpressLogo";

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenDataProtection?: () => void;
  onOpenCatering?: () => void;
  onOpenBlog?: () => void;
  onOpenContact?: () => void;
  onOpenChefAI?: () => void;
  onOpenDistrictsDirectory?: () => void;
  onOpenLogoModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPartnerModal,
  onOpenDataProtection,
  onOpenCatering,
  onOpenBlog,
  onOpenContact,
  onOpenChefAI,
  onOpenDistrictsDirectory,
  onOpenLogoModal,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info & Contacts */}
          <div className="space-y-3">
            <div
              onClick={onOpenLogoModal}
              className="cursor-pointer inline-block group"
              title="Découvrir le logo et la charte graphique Allôresto"
            >
              <BrandLogo variant="full" size="md" showTagline={false} />
            </div>

            <p className="text-xs text-slate-300 font-medium italic">
              « {ALLORESTO_BRAND_INFO.signature} »
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              {ALLORESTO_BRAND_INFO.tagline} Plats du jour au bureau, box sauces artisanales et service traiteur.
            </p>

            <div className="pt-1 space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{ALLORESTO_BRAND_INFO.pickupLocation}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`tel:${ALLORESTO_BRAND_INFO.directLine.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Appels : {ALLORESTO_BRAND_INFO.directLine}</span>
                </a>
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href="https://wa.me/22770032552"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-300 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp : {ALLORESTO_BRAND_INFO.whatsappOrders}</span>
                </a>
              </div>
              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ouvrir la rubrique Contacts &bull; Support</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Services & Traiteur */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Services &amp; Événements
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {onOpenChefAI && (
                <li>
                  <button
                    onClick={onOpenChefAI}
                    className="text-orange-400 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>AllôChef IA (Conseiller Culinaire &amp; Sommelier)</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenCatering}
                  className="text-amber-400 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Service Traiteur &amp; Mariages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBlog}
                  className="text-orange-400 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Blog Culinaire &amp; Saveurs du Sahel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="text-slate-300 hover:text-white cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>E-mail : {ALLORESTO_BRAND_INFO.email}</span>
                </button>
              </li>
              <li>
                <span className="text-slate-300">
                  🛵 Livraison Express Billo Express ({ALLORESTO_BRAND_INFO.deliveryPartner.contact})
                </span>
              </li>
              <li>
                <span className="text-slate-300">
                  🍱 Déjeuners groupés Ministères &amp; Salariés
                </span>
              </li>
              <li>
                <button
                  onClick={onOpenPartnerModal}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer text-left"
                >
                  🏪 Rejoindre comme Restaurant Partenaire
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Districts in Niamey */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Zones de livraison à Niamey
            </h4>
            <div className="pt-1 pb-1">
              <div
                onClick={onOpenLogoModal}
                className="cursor-pointer inline-block"
                title="Découvrir le partenaire de livraison Bilo Express"
              >
                <BilloExpressLogo variant="badge" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Plateau (Ministères)",
                "Grande Mosquée Mouhamar Kadhafi",
                "Avenue de l'Islam",
                "Koira Kano",
                "Harobanda",
                "Yantala",
                "Recasement",
                "Goudel",
                "Wadata",
                "Dar-Es-Salam",
                "Francophonie",
                "Aéroport",
              ].map((zone) => (
                <span
                  key={zone}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                >
                  {zone}
                </span>
              ))}
            </div>

            {onOpenDistrictsDirectory && (
              <button
                onClick={onOpenDistrictsDirectory}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-orange-400" />
                <span>Calculer mes Frais de Livraison (50+ Quartiers)</span>
              </button>
            )}
          </div>

          {/* Col 4: PWA App Install & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Application PWA Android &amp; iOS
            </h4>
            <p className="text-[11px] text-slate-300">
              Installez Allôresto sur votre smartphone en 1 clic pour commander vos déjeuners sans téléchargement lourd sur le Play Store.
            </p>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-orange-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">PWA Installable &amp; Légère</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Mode hors-ligne partiel &amp; Cache</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>&copy; {new Date().getFullYear()} Allôresto Niger &bull; {ALLORESTO_BRAND_INFO.tagline}</p>
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
              <span>Mynita, Amanata, All-Iza, Zeyna, Airtel, Moov &amp; Espèces</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
