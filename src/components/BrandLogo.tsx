import React from "react";

interface BrandLogoProps {
  variant?: "full" | "icon" | "compact" | "badge" | "hero";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  onClick,
}) => {
  // Dimensions according to size
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const smartIconSvg = (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-md"
    >
      <defs>
        <linearGradient id="allorestoGradient" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#E02E1B" />
        </linearGradient>
        <linearGradient id="goldAccent" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#FFAE00" />
        </linearGradient>
        <linearGradient id="badgeGloss" x1="0" y1="0" x2="120" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Modern Squircle Badge with Soft Lighting */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="32"
        fill="url(#allorestoGradient)"
      />
      {/* Specular gloss overlay */}
      <rect
        x="6"
        y="6"
        width="108"
        height="54"
        rx="32"
        fill="url(#badgeGloss)"
      />

      {/* INTELLIGENT SYMBOL: Fusing "Allô" (Handset / Audio Wave / Smile) + "Resto" (Gourmet Cloche / Dish / Fork) */}
      
      {/* 1. Cloche Handle / Notification Ping */}
      <circle cx="60" cy="27" r="5" fill="#FFFFFF" />
      <path
        d="M60 32 V 37"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* 2. Cloche Dome + Phone Arc (Gourmet Cover & Friendly Wave) */}
      <path
        d="M26 62 C26 43 41 37 60 37 C79 37 94 43 94 62"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* 3. Audio / Flavour Steam Waves (Express Call & Fresh Taste) */}
      <path
        d="M48 24 C52 20 54 20 58 24"
        stroke="url(#goldAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <path
        d="M62 24 C66 20 68 20 72 24"
        stroke="url(#goldAccent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* 4. Serving Platter / Phone Receiver Base (The Smile of Satisfaction) */}
      <path
        d="M20 68 C20 68 32 88 60 88 C88 88 100 68 100 68"
        stroke="url(#goldAccent)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Platter base rim */}
      <path
        d="M16 68 H104"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 5. Central Smart Element: Express Fork Silhouette */}
      <g transform="translate(60, 56) scale(0.9)">
        {/* Fork Prongs */}
        <line x1="-5" y1="-8" x2="-5" y2="-2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="0" y1="-9" x2="0" y2="-2" stroke="url(#goldAccent)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="5" y1="-8" x2="5" y2="-2" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        {/* Fork base & handle */}
        <path d="M-5 -2 C-5 3 5 3 5 -2" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <line x1="0" y1="2" x2="0" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* 6. Subtle Pulse / Instant Delivery Dot */}
      <circle cx="88" cy="42" r="3.5" fill="#FFE066" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <div
        onClick={onClick}
        className={`${iconSizes[size]} flex items-center justify-center shrink-0 cursor-pointer transition-transform hover:scale-105 ${className}`}
        title="Allôresto Niger"
      >
        {smartIconSvg}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 group select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Smart Icon Badge */}
      <div
        className={`${iconSizes[size]} relative shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1`}
      >
        {smartIconSvg}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
      </div>

      {/* Typographic Identity */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${textSizes[size]} font-black tracking-tight text-white flex items-center`}
          >
            Allô
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent ml-0.5">
              resto
            </span>
          </span>

          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
            Niger
          </span>
        </div>

        {showTagline && (
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-tight mt-0.5">
            Vos restaurants &amp; saveurs livrés à Niamey
          </p>
        )}
      </div>
    </div>
  );
};
