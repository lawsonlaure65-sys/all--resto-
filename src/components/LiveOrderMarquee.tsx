import React from "react";
import { Sparkles, Bike, Flame, CheckCircle, Clock } from "lucide-react";

interface TickerItem {
  id: string;
  icon: string;
  text: string;
  badge: string;
  badgeColor: string;
  time: string;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: "1",
    icon: "🛵",
    text: "Amadou (Plateau) vient de commander 1x Attiéké Caviar Poulet",
    badge: "Livraison Billo Express",
    badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
    time: "Il y a 2 min",
  },
  {
    id: "2",
    icon: "🍲",
    text: "Fatouma (Koubia) a commandé 2x Sauces Gboma Poisson Mer",
    badge: "Khady's Food",
    badgeColor: "text-orange-400 bg-orange-950/60 border-orange-500/30",
    time: "Il y a 5 min",
  },
  {
    id: "3",
    icon: "⚡",
    text: "Commande de 4x Déjeuners livrée en 24 mn aux bureaux SONIDEP",
    badge: "Express Niamey",
    badgeColor: "text-cyan-400 bg-cyan-950/60 border-cyan-500/30",
    time: "Il y a 8 min",
  },
  {
    id: "4",
    icon: "🥩",
    text: "Idrissa (Yantala) : 1x Choukouya Royal Mouton & Alloco",
    badge: "Grillades Sahel",
    badgeColor: "text-amber-400 bg-amber-950/60 border-amber-500/30",
    time: "Il y a 11 min",
  },
  {
    id: "5",
    icon: "👑",
    text: "Khady's Food & Event : Cuisine ouverte jusqu'à 22h ce soir",
    badge: "Service Continu",
    badgeColor: "text-rose-400 bg-rose-950/60 border-rose-500/30",
    time: "En direct",
  },
  {
    id: "6",
    icon: "🍹",
    text: "Aïchatou (Goudel) : 1x Doukounou Caviar & Jus de Bissap frais",
    badge: "Spécialité",
    badgeColor: "text-purple-400 bg-purple-950/60 border-purple-500/30",
    time: "Il y a 14 min",
  },
];

export const LiveOrderMarquee: React.FC = () => {
  // Repeat items to ensure seamless infinite looping without jump
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-slate-950/90 border-y border-orange-500/20 py-2.5 overflow-hidden relative select-none backdrop-blur-md">
      {/* Left/Right gradient masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      {/* Pulsing Live Tag */}
      <div className="flex items-center">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 mr-4 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-400 text-[11px] font-black tracking-wider uppercase shrink-0 z-20 shadow-sm ml-4">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          <span>En Direct &bull; Niamey</span>
        </div>

        {/* Continuous Scrolling Marquee */}
        <div className="animate-marquee-smooth flex items-center gap-6 sm:gap-8">
          {repeatedItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-2.5 text-xs text-slate-300 shrink-0 bg-slate-900/60 hover:bg-slate-850 px-3 py-1.5 rounded-full border border-slate-800 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-semibold text-white">{item.text}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
              >
                {item.badge}
              </span>
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
