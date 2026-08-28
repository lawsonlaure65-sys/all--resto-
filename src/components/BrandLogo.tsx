import React from "react";

export type LogoStyleOption = "signature_cloche" | "tech_monogram" | "speed_courier";

interface BrandLogoProps {
  variant?: "full" | "icon" | "compact" | "badge" | "hero" | "horizontal" | "mascot";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showTagline?: boolean;
  theme?: "auto" | "dark" | "light";
  styleOption?: LogoStyleOption;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  theme = "auto",
  styleOption = "signature_cloche",
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

  const isLightTheme = theme === "light";

  // =========================================================================
  // OPTION 1 (SIGNATURE) : "La Cloche Connectée & Souriante 3.0"
  // Un chef-d'œuvre vectoriel : Cloche gastronomique + Casque d'appel "Allô"
  // + Ondes sonores & étincelle d'appétit + Sourire complice + Plateau fuselé
  // =========================================================================
  const signatureClocheSvg = (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1 select-none"
    >
      <defs>
        {/* Dégradé Cloche Solaire Sahélien (#FF9E00 -> #FF5100 -> #E52E00) */}
        <linearGradient
          id="alloGourmetFlame"
          x1="18"
          y1="20"
          x2="110"
          y2="108"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFA62B" />
          <stop offset="30%" stopColor="#FF6600" />
          <stop offset="70%" stopColor="#FF3C00" />
          <stop offset="100%" stopColor="#D92200" />
        </linearGradient>

        {/* Dégradé Casque / Smart Headset "Allô" Teal Mint (#2DD4BF -> #0F766E) */}
        <linearGradient
          id="alloHeadsetGrad"
          x1="26"
          y1="12"
          x2="102"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        {/* Dégradé Plateau Chromé Métallique */}
        <linearGradient
          id="alloChromePlate"
          x1="16"
          y1="92"
          x2="112"
          y2="106"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E2E8F0" />
          <stop offset="75%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Halo Lumineux Doux */}
        <radialGradient
          id="alloWarmAura"
          cx="64"
          cy="60"
          r="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF8800" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#FF5500" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#FF2200" stopOpacity="0" />
        </radialGradient>

        <filter id="alloShadowGlow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Halo Solaire de fond */}
      <circle cx="64" cy="62" r="54" fill="url(#alloWarmAura)" />

      {/* 1. Ondes Sonores & Vapeur d'Appétit Supérieure ("Allô !") */}
      <g stroke="#FFB703" strokeWidth="2.8" strokeLinecap="round" opacity="0.95">
        <path d="M 44 16 C 50 10 56 8 64 8 C 72 8 78 10 84 16" />
        <path d="M 52 21 C 56 18 60 17 64 17 C 68 17 72 18 76 21" />
      </g>

      {/* Étoile Dorée Saveur & Qualité */}
      <path
        d="M 98 18 L 100 23 L 105 25 L 100 27 L 98 32 L 96 27 L 91 25 L 96 23 Z"
        fill="#FBBF24"
        filter="url(#alloShadowGlow)"
      />

      {/* 2. Poignée de Cloche façon Casque Téléphonique / Toque Connectée */}
      <g filter="url(#alloShadowGlow)">
        {/* Arceau supérieur */}
        <path
          d="M 46 34 C 46 23 82 23 82 34"
          stroke="url(#alloHeadsetGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Bouton doré central */}
        <circle cx="64" cy="25" r="5.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
        {/* Écouteur & Microphone Allô */}
        <rect x="80" y="30" width="7" height="12" rx="3.5" fill="#0F766E" />
        <path d="M 85 39 C 89 42 88 47 83 50" stroke="#2DD4BF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="81" cy="50.5" r="2" fill="#2DD4BF" />
      </g>

      {/* 3. Dôme de la Cloche Gourmande (Silhouette Épurée & Aérodynamique) */}
      <g filter="url(#alloShadowGlow)">
        <path
          d="M 64 32
             C 41 32 25 50 21 76
             C 20 83 24 87 31 87
             L 97 87
             C 104 87 108 83 107 76
             C 103 50 87 32 64 32
             Z"
          fill="url(#alloGourmetFlame)"
        />

        {/* Reflet de lumière soyeux sur la courbure gauche */}
        <path
          d="M 64 37
             C 49 37 36 47 31 62
             C 29 66 32 68 35 66
             C 39 54 49 44 64 43
             C 67 43 68 39 66 37.5
             C 65.5 37.2 64.8 37 64 37
             Z"
          fill="#FFFFFF"
          opacity="0.4"
        />
      </g>

      {/* 4. Visage Gourmand Expressif (Clin d'œil Malicieux & Sourire Complice) */}
      <g fill="#FFFFFF">
        {/* Œil gauche : Clin d'œil dynamique */}
        <path
          d="M 41 61 C 44 56 51 56 54 61"
          stroke="#FFFFFF"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Œil droit : Pétillant & Vif */}
        <ellipse cx="73" cy="59" rx="4.5" ry="5.8" fill="#1E293B" />
        <circle cx="71.5" cy="57" r="1.8" fill="#FFFFFF" />
        <circle cx="75" cy="61" r="0.9" fill="#FFFFFF" />

        {/* Pommettes Rougies */}
        <circle cx="36" cy="67" r="3.2" fill="#EF4444" opacity="0.4" />
        <circle cx="80" cy="67" r="3.2" fill="#EF4444" opacity="0.4" />

        {/* Grand Sourire Chaleureux avec langue gourmande */}
        <path
          d="M 47 67
             C 47 76 69 76 69 67
             Z"
          fill="#1E293B"
        />
        {/* Langue Rose Délicieuse */}
        <path
          d="M 54 72
             C 54 75 62 75 62 72
             Z"
          fill="#F43F5E"
        />
      </g>

      {/* 5. Plateau de Service & Lèvres Aérodynamiques */}
      <g filter="url(#alloShadowGlow)">
        <path
          d="M 17 87
             C 17 85 21 83 27 83
             L 101 83
             C 107 83 111 85 111 87
             L 109 91
             C 109 94 105 96 99 96
             L 29 96
             C 23 96 19 94 19 91
             Z"
          fill="url(#alloChromePlate)"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />
        <rect x="13" y="95" width="102" height="4.5" rx="2.2" fill="#334155" />
        <rect x="22" y="96" width="84" height="1.8" rx="0.9" fill="#E2E8F0" opacity="0.85" />
      </g>

      {/* 6. Traits de Propulsion Express "Billo Speed" */}
      <g stroke="#FF7700" strokeWidth="2.4" strokeLinecap="round" opacity="0.95">
        <line x1="7" y1="75" x2="15" y2="75" />
        <line x1="3" y1="83" x2="12" y2="83" />
        <line x1="6" y1="91" x2="13" y2="91" />
      </g>
    </svg>
  );

  // =========================================================================
  // OPTION 2 : "Le Monogramme Tech & Fourchette Connectée"
  // Ultra-moderne, géométrique, épuré, style Silicon Valley / FoodTech
  // =========================================================================
  const techMonogramSvg = (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105 select-none"
    >
      <defs>
        <linearGradient id="techFlameGrad" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAA00" />
          <stop offset="50%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#E60000" />
        </linearGradient>
        <linearGradient id="techTealGrad" x1="30" y1="20" x2="98" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Hexagone Arrondi Tech */}
      <rect x="14" y="14" width="100" height="100" rx="30" fill="#0F172A" stroke="url(#techFlameGrad)" strokeWidth="3" />

      {/* A initial stylisé façon cloche + ondes */}
      <path
        d="M 64 26
           L 92 84
           C 94 88 91 94 86 94
           L 42 94
           C 37 94 34 88 36 84
           Z"
        fill="url(#techFlameGrad)"
      />

      {/* Fourchette connectée blanche en contre-forme */}
      <g fill="#0F172A">
        <rect x="62" y="48" width="4" height="38" rx="2" />
        <rect x="52" y="48" width="3.5" height="18" rx="1.7" />
        <rect x="72.5" y="48" width="3.5" height="18" rx="1.7" />
        <path d="M 52 66 C 52 74 76 74 76 66 Z" />
      </g>

      {/* Cercle récepteur / microphone "Allô" */}
      <circle cx="64" cy="38" r="5" fill="#38BDF8" />
      <path d="M 52 30 C 58 24 70 24 76 30" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  // =========================================================================
  // OPTION 3 : "Billo l'Aigle / Gazelle Express" (Mascotte Rapide)
  // Dynamique, fun, sportive, casque de moto et paquet repas
  // =========================================================================
  const speedCourierSvg = (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover:scale-105 select-none"
    >
      <defs>
        <linearGradient id="courierGrad" x1="20" y1="20" x2="108" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA62B" />
          <stop offset="50%" stopColor="#FF6600" />
          <stop offset="100%" stopColor="#D92200" />
        </linearGradient>
      </defs>

      {/* Bouclier Circulaire Énergique */}
      <circle cx="64" cy="64" r="52" fill="#0B132B" stroke="url(#courierGrad)" strokeWidth="3.5" />

      {/* Casque de livreur avec visière et toque intégrée */}
      <path
        d="M 38 60
           C 38 42 50 32 64 32
           C 78 32 90 42 90 60
           C 90 74 78 84 64 84
           C 50 84 38 74 38 60
           Z"
        fill="url(#courierGrad)"
      />

      {/* Visière profilée rapide */}
      <path
        d="M 56 46
           L 86 46
           C 91 46 94 52 91 57
           L 78 72
           C 76 75 72 77 68 77
           L 56 77
           Z"
        fill="#1E293B"
      />
      {/* Reflet sur visière */}
      <path d="M 62 50 L 82 50 L 74 62 L 58 62 Z" fill="#38BDF8" opacity="0.8" />

      {/* Toque de chef sur le casque */}
      <path
        d="M 52 32
           C 50 24 58 20 64 20
           C 70 20 78 24 76 32
           Z"
        fill="#FFFFFF"
      />

      {/* Éclair de vitesse inférieur */}
      <path
        d="M 62 82 L 56 98 L 70 98 L 66 112 L 78 94 L 68 94 Z"
        fill="#FBBF24"
      />
    </svg>
  );

  // Pick active SVG according to styleOption
  const activeLogoEmblemSvg =
    styleOption === "tech_monogram"
      ? techMonogramSvg
      : styleOption === "speed_courier"
      ? speedCourierSvg
      : signatureClocheSvg;

  // Variant: Standalone icon
  if (variant === "icon") {
    return (
      <div
        onClick={onClick}
        className={`${iconSizes[size]} flex items-center justify-center shrink-0 ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
        title="Allôresto Niger — Vos envies, bien servies !"
      >
        {activeLogoEmblemSvg}
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
          {activeLogoEmblemSvg}
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
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Visual Emblem */}
      <div className={`${iconSizes[size]} relative shrink-0`}>
        {activeLogoEmblemSvg}
      </div>

      {/* Typographic Identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <div className={`${textSizes[size]} font-black tracking-tight flex items-center`}>
            {/* "Allô" */}
            <span
              className={
                isLightTheme
                  ? "text-slate-900 drop-shadow-sm font-black tracking-tight"
                  : "text-white drop-shadow-sm font-black tracking-tight"
              }
            >
              Allô
            </span>

            {/* "resto" */}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent ml-0.5 font-black tracking-tight drop-shadow-sm">
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
