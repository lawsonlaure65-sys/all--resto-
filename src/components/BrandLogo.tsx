import React from "react";

interface BrandLogoProps {
  variant?: "full" | "icon" | "compact" | "badge" | "hero" | "horizontal";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showTagline?: boolean;
  theme?: "auto" | "dark" | "light";
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  theme = "auto",
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

  // Re-worked Official Allôresto Intelligent Logo Emblem
  // Fusing:
  // 1) "Allô" Pin & Speech Bubble in Deep Oceanic Teal (#0F4C64 / #135C75)
  // 2) 3 Flying Food-Tech / Delivery Cubes in Vibrant Sahel Orange (#F36C21)
  // 3) Sleek Negative Space 3-Prong Culinary Fork in Pure White (#FFFFFF)
  const logoEmblemSvg = (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105 duration-300"
    >
      <defs>
        {/* Deep Teal Gradient */}
        <linearGradient
          id="alloTealGrad"
          x1="20"
          y1="20"
          x2="100"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#145F78" />
          <stop offset="50%" stopColor="#0F4C64" />
          <stop offset="100%" stopColor="#0A3748" />
        </linearGradient>

        {/* Sahel Orange Gradient */}
        <linearGradient
          id="alloOrangeGrad"
          x1="60"
          y1="10"
          x2="100"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF7E26" />
          <stop offset="100%" stopColor="#F15A1A" />
        </linearGradient>
      </defs>

      {/* 3 Digital / Delivery Pixels (Orange Sahel) */}
      <rect x="79" y="15" width="16" height="16" rx="3.5" fill="url(#alloOrangeGrad)" />
      <rect x="67" y="24" width="15" height="15" rx="3.5" fill="url(#alloOrangeGrad)" />
      <rect x="81" y="31" width="17" height="17" rx="3.5" fill="url(#alloOrangeGrad)" />

      {/* Main Allôresto Pin & Speech Bubble (Teal) */}
      <path
        d="M 50 20 
           C 32 20 20 34 20 54 
           C 20 66 26 76 33 82 
           L 33 97 
           L 46 87 
           C 48 87 50 87 52 87 
           C 69 87 83 73 83 55 
           C 83 48 80 42 76 37 
           L 64 37 
           L 64 20 
           Z"
        fill="url(#alloTealGrad)"
      />

      {/* Negative Space 3-Prong Fork (Pure White) */}
      {/* Left Prong */}
      <rect x="37" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF" />
      {/* Center Prong */}
      <rect x="47.5" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF" />
      {/* Right Prong */}
      <rect x="58" y="34" width="7" height="20" rx="3.5" fill="#FFFFFF" />

      {/* Fork Cup Base */}
      <path
        d="M 37 46 
           C 37 62 65 62 65 46 
           Z"
        fill="#FFFFFF"
      />

      {/* Fork Stem / Handle */}
      <path
        d="M 47.5 56 
           L 54.5 56 
           L 54.5 90 
           L 47.5 90 
           Z"
        fill="#FFFFFF"
      />
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
        title="Allôresto Niger"
      >
        {logoEmblemSvg}
      </div>
    );
  }

  // Variant: Badge / App screen icon preview
  if (variant === "badge") {
    return (
      <div
        onClick={onClick}
        className={`p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-lg ${
          onClick ? "cursor-pointer hover:border-orange-500/40" : ""
        } ${className}`}
      >
        <div className={`${iconSizes[size]} shrink-0`}>
          {logoEmblemSvg}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-white tracking-tight">Allô</span>
            <span className="font-extrabold text-orange-500 tracking-tight">resto</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase">
              Niamey
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Application Mobile PWA</span>
        </div>
      </div>
    );
  }

  // Full Brand Logo with Reworked Typography: "Allô" (Teal/White) + "resto" (Orange Sahel)
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
        {logoEmblemSvg}
      </div>

      {/* Typographic Identity: Remplacement officiel de DigitRestau par Allôresto */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <div className={`${textSizes[size]} font-black tracking-tight flex items-center`}>
            {/* "Allô" */}
            <span
              className={
                isLightTheme
                  ? "text-[#0F4C64]"
                  : "text-white"
              }
            >
              Allô
            </span>

            {/* "resto" */}
            <span className="text-[#F36C21] ml-0.5 font-black">
              resto
            </span>
          </div>

          {/* Sahel / Niger Badge */}
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30">
            Niger
          </span>
        </div>

        {showTagline && (
          <p
            className={`text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 ${
              isLightTheme ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Vos restaurants &amp; saveurs livrés à Niamey
          </p>
        )}
      </div>
    </div>
  );
};
