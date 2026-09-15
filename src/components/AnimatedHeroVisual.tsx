import React from "react";
import { Sparkles, Flame, Clock, MapPin, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";

export const AnimatedHeroVisual: React.FC<{
  onExploreMenu?: () => void;
}> = ({ onExploreMenu }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none pt-4 pb-2">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-orange-600/20 via-amber-500/20 to-red-600/20 rounded-full blur-3xl pointer-events-none animate-radar-glow" />

      {/* Main Showcase Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-800 p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Top Status Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-white">
              Billo Express &bull; Coursiers en Ligne
            </span>
          </div>

          <span className="text-[11px] font-mono text-orange-400 bg-orange-950/70 border border-orange-500/40 px-2.5 py-1 rounded-full font-bold">
            ⚡ 25 à 40 mn à Niamey
          </span>
        </div>

        {/* Center: Interactive Courier Scooter in Motion */}
        <div className="relative bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800/80 mb-4 overflow-hidden">
          {/* Night Skyline Backdrop Silhouette */}
          <div className="absolute top-2 right-4 flex items-end gap-1.5 opacity-25 pointer-events-none">
            <div className="w-4 h-12 bg-slate-700 rounded-t-sm" />
            <div className="w-6 h-18 bg-slate-700 rounded-t-sm" />
            <div className="w-5 h-14 bg-slate-700 rounded-t-sm" />
            <div className="w-8 h-20 bg-slate-700 rounded-t-sm" />
          </div>

          {/* Delivery Courier SVG Illustration with CSS Motion */}
          <div className="relative flex items-center justify-center py-4">
            <div className="animate-soft-float relative">
              {/* Hot Food Steam rising from delivery box */}
              <div className="absolute -top-3 left-6 flex items-center gap-1">
                <span className="text-xs animate-steam-1 text-orange-400 opacity-75">♨️</span>
                <span className="text-[10px] animate-steam-2 text-amber-300 opacity-60">♨️</span>
              </div>

              {/* Scooter & Driver SVG */}
              <svg
                viewBox="0 0 160 100"
                className="w-44 sm:w-52 h-28 sm:h-32 filter drop-shadow-[0_10px_15px_rgba(249,115,22,0.3)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wind / Speed lines */}
                <path d="M10 35 H30" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M5 50 H22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <path d="M12 65 H28" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

                {/* Delivery Box (Billo Express / Khady's) */}
                <rect x="35" y="32" width="28" height="28" rx="5" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
                <path d="M42 46 H56" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M49 39 V53" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

                {/* Driver Silhouette */}
                <circle cx="75" cy="24" r="9" fill="#020617" stroke="#fdba74" strokeWidth="2" />
                {/* Helmet visor */}
                <path d="M78 22 Q83 24 81 28" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                {/* Jacket */}
                <path d="M68 34 Q75 32 82 35 L86 54 H62 Z" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" />

                {/* Scooter Frame */}
                <path d="M55 60 H95 L110 50 L115 62 H125" stroke="#f97316" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M95 60 L108 34" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                {/* Handlebar & Headlight */}
                <path d="M104 33 H114" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="116" cy="46" r="3.5" fill="#fef08a" />
                {/* Headlight beam */}
                <polygon points="119,45 155,35 155,60 119,48" fill="url(#headlightGrad)" opacity="0.4" />

                {/* Rear Wheel (Spinning) */}
                <g className="animate-wheel-spin origin-[52px_74px]">
                  <circle cx="52" cy="74" r="14" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                  <circle cx="52" cy="74" r="6" fill="#f97316" />
                  <line x1="52" y1="60" x2="52" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="38" y1="74" x2="66" y2="74" stroke="#cbd5e1" strokeWidth="1.5" />
                </g>

                {/* Front Wheel (Spinning) */}
                <g className="animate-wheel-spin origin-[122px_74px]">
                  <circle cx="122" cy="74" r="14" fill="#0f172a" stroke="#475569" strokeWidth="3" />
                  <circle cx="122" cy="74" r="6" fill="#f97316" />
                  <line x1="122" y1="60" x2="122" y2="88" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="108" y1="74" x2="136" y2="74" stroke="#cbd5e1" strokeWidth="1.5" />
                </g>

                <defs>
                  <linearGradient id="headlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Animated Road Lines below scooter */}
          <div className="w-full h-1.5 animate-road-move rounded-full mt-1 mb-2 opacity-85" />

          {/* Location pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400" />
              <span>Zone Koubia &bull; Grande Mosquée &bull; Plateau</span>
            </span>
            <span className="text-emerald-400 font-bold">Livreurs disponibles</span>
          </div>
        </div>

        {/* Bottom Card: Floating Featured Dish with Micro-Animation */}
        <div className="animate-soft-float-delayed relative rounded-2xl bg-gradient-to-r from-orange-500/15 via-slate-800/70 to-amber-500/10 border border-orange-500/30 p-3.5 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-orange-500/40 shrink-0 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80"
                alt="Attiéké Caviar Poulet"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-1 left-1 bg-orange-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full">
                👑 Star
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Attiéké Caviar Khady&apos;s
                </h4>
                <span className="text-amber-400 text-xs">⭐ 4.9</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Poulet fermier doré &bull; Alloco fondant &bull; Piment maison
              </p>
              <span className="text-xs font-extrabold text-orange-400">
                2 500 FCFA
              </span>
            </div>
          </div>

          {onExploreMenu && (
            <button
              onClick={onExploreMenu}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition shadow-md shadow-orange-500/30 shrink-0 cursor-pointer"
            >
              Commander
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
