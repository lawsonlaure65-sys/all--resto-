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
import { UserRole } from "../types";
import { Bike, Store } from "lucide-react";

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenDataProtection?: () => void;
  onOpenCatering?: () => void;
  onOpenBlog?: () => void;
  onOpenContact?: () => void;
  onOpenChefAI?: () => void;
  onOpenDistrictsDirectory?: () => void;
  onOpenLogoModal?: () => void;
  onChangeRole?: (role: UserRole) => void;
  onOpenHowItWorks?: () => void;
  onOpenPlans?: () => void;
  onOpenContract?: () => void;
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
  onChangeRole,
  onOpenHowItWorks,
  onOpenPlans,
  onOpenContract,
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
                <button
                  type="button"
                  onClick={() => onChangeRole && onChangeRole("courier")}
                  className="text-cyan-400 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Bike className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Espace Livreur Billo Express ({ALLORESTO_BRAND_INFO.deliveryPartner.contact})</span>
                </button>
              </li>
              <li>
                <span className="text-slate-300">
                  🍱 Déjeuners groupés Ministères &amp; Salariés
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onChangeRole && onChangeRole("restaurant")}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Espace Restaurant Partenaire</span>
                </button>
              </li>
              {onOpenHowItWorks && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenHowItWorks}
                    className="text-amber-300 hover:text-white font-bold cursor-pointer text-left flex items-center gap-1.5 transition"
                  >
                    <span>💡 Comment ça marche ? (Guide complet)</span>
                  </button>
                </li>
              )}
              {onOpenPlans && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenPlans}
                    className="text-orange-400 hover:text-orange-300 font-bold cursor-pointer text-left flex items-center gap-1.5 transition"
                  >
                    <span>💳 Formules &amp; Tarifs Restaurant</span>
                  </button>
                </li>
              )}
              {onOpenContract && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenContract}
                    className="text-slate-300 hover:text-white cursor-pointer text-left flex items-center gap-1.5 transition"
                  >
                    <span>📜 Contrat Partenaire &amp; Adhésion</span>
                  </button>
                </li>
              )}
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
            {/* Social Media Networks */}
            <div className="pt-2 border-t border-slate-900 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Suivez-nous sur les réseaux
              </span>
              <div className="flex flex-col gap-1.5 text-xs">
                {/* Facebook */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition group"
                >
                  <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-[11px] font-black group-hover:bg-blue-600 group-hover:text-white transition">
                    f
                  </span>
                  <span>Facebook : <strong className="text-white group-hover:text-blue-400">{ALLORESTO_BRAND_INFO.socialMedia.facebook.handle}</strong></span>
                </a>

                {/* Instagram */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition group"
                >
                  <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 text-pink-400 flex items-center justify-center text-[10px] font-black group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition">
                    📸
                  </span>
                  <span>Instagram : <strong className="text-white group-hover:text-pink-400">{ALLORESTO_BRAND_INFO.socialMedia.instagram.handle}</strong></span>
                </a>

                {/* TikTok */}
                <a
                  href={ALLORESTO_BRAND_INFO.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition group"
                >
                  <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-black group-hover:bg-cyan-500 group-hover:text-black transition">
                    🎵
                  </span>
                  <span>TikTok : <strong className="text-white group-hover:text-cyan-400">{ALLORESTO_BRAND_INFO.socialMedia.tiktok.handle}</strong></span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Pages Quick Links Bar */}
        <div className="py-6 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
          <div>
            <span className="font-bold text-slate-300 block mb-1.5 uppercase text-[10px] tracking-wider">
              Espace Public
            </span>
            <ul className="space-y-1">
              <li><a href="/app/menu" className="hover:text-orange-400 transition">📋 Carte des Plats</a></li>
              <li><a href="/app/about" className="hover:text-orange-400 transition">🇳🇪 À propos d'Allôresto</a></li>
              <li><a href="/app/contact" className="hover:text-orange-400 transition">📞 Contact &amp; Support</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-orange-400 block mb-1.5 uppercase text-[10px] tracking-wider">
              Espace Restaurant
            </span>
            <ul className="space-y-1">
              <li><a href="/app/restaurant/dashboard" className="hover:text-white transition">🍳 Écran Cuisine Direct</a></li>
              <li><a href="/app/restaurant/menu" className="hover:text-white transition">🥘 Gestion des Plats</a></li>
              <li><a href="/app/restaurant/stats" className="hover:text-white transition">📊 Statistiques &amp; Ventes</a></li>
              <li><a href="/app/restaurant/plans" className="hover:text-white transition">💳 Formules Partenaires</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-cyan-400 block mb-1.5 uppercase text-[10px] tracking-wider">
              Espace Coursier
            </span>
            <ul className="space-y-1">
              <li><a href="/app/driver/dashboard" className="hover:text-white transition">🛵 Radar des Courses</a></li>
              <li><a href="/app/driver/history" className="hover:text-white transition">💰 Gains &amp; Retraits</a></li>
              <li><a href="/app/driver/login" className="hover:text-white transition">🔑 Connexion Coursier</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-purple-400 block mb-1.5 uppercase text-[10px] tracking-wider">
              Espace Administration
            </span>
            <ul className="space-y-1">
              <li><a href="/app/admin/settings" className="hover:text-white transition">⚙️ Paramètres &amp; NIF</a></li>
              <li><a href="/app/admin/drivers" className="hover:text-white transition">🛵 Flotte Livreurs</a></li>
              <li><a href="/app/admin/orders" className="hover:text-white transition">📦 Toutes Commandes</a></li>
              <li><a href="/app/admin/dashboard" className="hover:text-white transition">📈 Dashboard Admin</a></li>
            </ul>
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
              <span>Espèces, Mynita, Amanata, All-Iza, Zeyna &amp; Airtel Money</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
