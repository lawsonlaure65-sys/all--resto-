import React from "react";

interface BrandLogoProps {
  variant?: "full" | "icon" | "compact" | "badge" | "hero" | "horizontal" | "mascot";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showTagline?: boolean;
  theme?: "auto" | "dark" | "light";
  styleOption?: "gourmet_cloche" | "turbo_speed" | "smart_call";
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  theme = "auto",
  styleOption = "gourmet_cloche",
  onClick,
}) => {
  // Dimension tokens
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
  };

  const textSizes = {
    sm: "text-base sm:text-lg",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-3xl",
    "2xl": "text-4xl sm:text-5xl",
  };

  // NOUVEAU LOGO ALLÔRESTO : "La Cloche Gourmande Souriante & Connectée"
  // Concept Fusion Intelligent & Percutant :
  // 1. Cloche de Chef Gourmande en Dégradé Orange Sahel Énergique (#FF5E14 -> #FF8C00)
  // 2. Bouton supérieur façon Casque Téléphonique / Écouteur "Allô" avec Ondes Aériennes Wi-Fi & Vapeur
  // 3. Yeux complices avec clin d'œil malicieux et sourire d'appétit
  // 4. Plateau de service argenté & Flamme vive du Sahel
  const modernLogoEmblemSvg = (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
    >
      <defs>
        {/* Dégradé Cloche Orange Sahel Solaire */}
        <linearGradient
          id="alloChefOrange"
          x1="18"
          y1="24"
          x2="110"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFA133" />
          <stop offset="35%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#E63E00" />
        </linearGradient>

        {/* Dégradé Écouteur / Téléphone Allô */}
        <linearGradient
          id="alloTealPhone"
          x1="30"
          y1="10"
          x2="98"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="50%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#0A3F3B" />
        </linearGradient>

        {/* Halo Lumineux Chaud */}
        <radialGradient
          id="alloWarmGlow"
          cx="64"
          cy="60"
          r="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF9900" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
        </radialGradient>

        {/* Plateau Argenté Métallique */}
        <linearGradient
          id="alloSilverPlate"
          x1="20"
          y1="94"
          x2="108"
          y2="106"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Ombre Portée Intégrée */}
        <filter id="alloDropShadow" x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Fond Halo Doux */}
      <circle cx="64" cy="64" r="56" fill="url(#alloWarmGlow)" />

      {/* 1. Ondes Sonores & Vapeur d'Appétit "Allô" au sommet */}
      <g stroke="#FFB74D" strokeWidth="2.8" strokeLinecap="round" opacity="0.95">
        <path d="M 44 18 C 50 12 56 10 64 10 C 72 10 78 12 84 18" strokeDasharray="1 0" />
        <path d="M 52 23 C 56 20 60 19 64 19 C 68 19 72 20 76 23" />
      </g>

      {/* Petite Étoile / Étincelle Saveur Dorée */}
      <path
        d="M 98 19 L 100 24 L 105 26 L 100 28 L 98 33 L 96 28 L 91 26 L 96 24 Z"
        fill="#FBBF24"
        filter="url(#alloDropShadow)"
      />

      {/* 2. Poignée de Cloche façon Casque Téléphonique / Toque Connectée */}
      <g filter="url(#alloDropShadow)">
        {/* Arceau du casque / poignée */}
        <path
          d="M 46 36 C 46 25 82 25 82 36"
          stroke="url(#alloTealPhone)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Bouton central doré de préhension */}
        <circle cx="64" cy="27" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        {/* Oreillette droite avec micro d'appel "Allô!" */}
        <rect x="80" y="32" width="7" height="12" rx="3.5" fill="#0F766E" />
        <path d="M 85 41 C 88 44 87 49 82 52" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="80" cy="52.5" r="2" fill="#2DD4BF" />
      </g>

      {/* 3. Corps de la Cloche Gourmande (Dôme Aérodynamique Chaud) */}
      <g filter="url(#alloDropShadow)">
        <path
          d="M 64 34
             C 42 34 26 52 22 78
             C 21 84 25 88 32 88
             L 96 88
             C 103 88 107 84 106 78
             C 102 52 86 34 64 34
             Z"
          fill="url(#alloChefOrange)"
        />

        {/* Reflet Lumineux Épuré sur le Dôme Supérieur */}
        <path
          d="M 64 39
             C 50 39 37 49 32 64
             C 30 68 33 70 36 68
             C 40 56 50 46 64 45
             C 67 45 68 41 66 39.5
             C 65.5 39.2 64.8 39 64 39
             Z"
          fill="#FFFFFF"
          opacity="0.45"
        />
      </g>

      {/* 4. Visage Expressif & Joyeux (Clin d'œil malicieux & Sourire Gourmand) */}
      <g fill="#FFFFFF">
        {/* Œil gauche : Clin d'œil dynamique et complice */}
        <path
          d="M 42 63 C 45 58 52 58 55 63"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Œil droit : Grand œil pétillant ouvert */}
        <ellipse cx="74" cy="61" rx="4.8" ry="6" fill="#1E293B" />
        <circle cx="72.5" cy="59" r="2" fill="#FFFFFF" />
        <circle cx="76" cy="63" r="1" fill="#FFFFFF" />

        {/* Pommettes Rougies (Appétit & Chaleur Sahélienne) */}
        <circle cx="37" cy="69" r="3.5" fill="#EF4444" opacity="0.35" />
        <circle cx="81" cy="69" r="3.5" fill="#EF4444" opacity="0.35" />

        {/* Sourire Franc & Ouvert avec petite langue gourmande */}
        <path
          d="M 48 69
             C 48 78 70 78 70 69
             Z"
          fill="#1E293B"
        />
        {/* Petite langue rose bonbon */}
        <path
          d="M 55 74
             C 55 77 63 77 63 74
             Z"
          fill="#F43F5E"
        />
      </g>

      {/* 5. Plateau de Service & Lèvres Aérodynamiques */}
      <g filter="url(#alloDropShadow)">
        {/* Bord inférieur de la cloche */}
        <path
          d="M 18 88
             C 18 86 22 84 28 84
             L 100 84
             C 106 84 110 86 110 88
             L 108 92
             C 108 95 104 97 98 97
             L 30 97
             C 24 97 20 95 20 92
             Z"
          fill="url(#alloSilverPlate)"
          stroke="#94A3B8"
          strokeWidth="1"
        />

        {/* Plateau Base Fine */}
        <rect x="14" y="96" width="100" height="5" rx="2.5" fill="#475569" />
        <rect x="22" y="97" width="84" height="2" rx="1" fill="#94A3B8" opacity="0.8" />
      </g>

      {/* 6. Traits de Propulsion / Vitesse Express "Billo Speed" */}
      <g stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
        <line x1="8" y1="76" x2="16" y2="76" />
        <line x1="4" y1="84" x2="13" y2="84" />
        <line x1="7" y1="92" x2="14" y2="92" />
      </g>
    </svg>
  );

  // Variant: Just the standalone icon
  if (variant === "icon") {
    return (
      <div
        onClick={onClick}
        className={`${iconSizes[size]} flex items-center justify-center shrink-0 ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
        title="Allôresto Niger — Vos envies, bien servies !"
      >
        {modernLogoEmblemSvg}
      </div>
    );
  }

  // Variant: Badge / App screen icon preview
  if (variant === "badge") {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg group ${
          onClick ? "cursor-pointer hover:border-orange-500/50" : ""
        } ${className}`}
      >
        <div className={`${iconSizes[size]} shrink-0`}>
          {modernLogoEmblemSvg}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-black text-white tracking-tight">Allô</span>
            <span className="font-black text-orange-500 tracking-tight">resto</span>
            <span className="text-amber-400 font-black">!</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase">
              Niamey
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Vos envies, bien servies !</span>
        </div>
      </div>
    );
  }

  // Full Brand Logo with Reworked Modern Typography:
  // "Allô" (Teal/Blanc) + "resto" (Orange Sahel Vibrant) + "!" (Étincelle dorée)
  const isLightTheme = theme === "light";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Visual Emblem */}
      <div className={`${iconSizes[size]} relative shrink-0`}>
        {modernLogoEmblemSvg}
      </div>

      {/* Typographic Identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <div className={`${textSizes[size]} font-black tracking-tight flex items-center`}>
            {/* "Allô" */}
            <span
              className={
                isLightTheme
                  ? "text-slate-900 drop-shadow-sm font-black"
                  : "text-white drop-shadow-sm font-black"
              }
            >
              Allô
            </span>

            {/* "resto" */}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent ml-0.5 font-black drop-shadow-sm">
              resto
            </span>

            {/* "!" */}
            <span className="text-amber-400 font-black ml-0.5 animate-pulse">
              !
            </span>
          </div>

          {/* Sahel / Niger Badge */}
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
            Niger
          </span>
        </div>

        {showTagline && (
          <p
            className={`text-[10px] sm:text-[11px] font-semibold tracking-tight mt-0.5 ${
              isLightTheme ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Vos envies, bien servies à Niamey 🛵
          </p>
        )}
      </div>
    </div>
  );
};

