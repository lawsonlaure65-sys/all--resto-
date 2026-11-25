import React from "react";

export type LogoStyleOption = "signature_cloche" | "tech_monogram" | "speed_courier";

export const ALLORESTO_OFFICIAL_LOGO_URL = "/images/alloresto-logo.png";
export const ALLORESTO_OFFICIAL_LOGO_WITH_CONTACTS_URL = "/images/alloresto-logo-contacts.png";
export const ALLORESTO_OFFICIAL_ICON_URL = "/images/alloresto-logo-square.png";

interface BrandLogoProps {
  variant?: "full" | "icon" | "compact" | "badge" | "hero" | "horizontal" | "mascot";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showTagline?: boolean;
  showContacts?: boolean;
  theme?: "auto" | "dark" | "light";
  styleOption?: LogoStyleOption;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  showTagline = false,
  showContacts = false,
  theme = "auto",
  onClick,
}) => {
  const isLightTheme = theme === "light";

  // Responsive height classes preserving exact natural proportions (1096x660 wide, 512x512 square)
  const fullHeightSizes: Record<NonNullable<BrandLogoProps["size"]>, string> = {
    sm: "h-7 sm:h-9",
    md: "h-9 sm:h-11",
    lg: "h-12 sm:h-14",
    xl: "h-16 sm:h-20",
    "2xl": "h-24 sm:h-28",
  };

  const iconSizes: Record<NonNullable<BrandLogoProps["size"]>, string> = {
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-12 h-12 sm:w-14 sm:h-14",
    xl: "w-16 h-16 sm:w-20 sm:h-20",
    "2xl": "w-24 h-24 sm:w-28 sm:h-28",
  };

  const framePaddingSizes: Record<NonNullable<BrandLogoProps["size"]>, string> = {
    sm: "px-2 py-1 rounded-xl",
    md: "px-2.5 py-1.5 rounded-xl",
    lg: "px-3 py-2 rounded-2xl",
    xl: "px-4 py-2.5 rounded-2xl",
    "2xl": "px-5 py-3 rounded-3xl",
  };

  // Variant: Standalone square app/brand icon (never shows contacts)
  if (variant === "icon" || variant === "mascot") {
    return (
      <div
        onClick={onClick}
        className={`${iconSizes[size]} inline-flex items-center justify-center shrink-0 rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 overflow-hidden select-none ${
          onClick ? "cursor-pointer transition-transform duration-200 hover:scale-105" : ""
        } ${className}`}
        title="Allôresto"
      >
        <img
          src={ALLORESTO_OFFICIAL_ICON_URL}
          alt="Allôresto"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    );
  }

  // Variant: Badge card preview
  if (variant === "badge") {
    return (
      <div
        onClick={onClick}
        className={`p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 inline-flex items-center gap-3 shadow-lg group select-none ${
          onClick ? "cursor-pointer hover:border-orange-500/50" : ""
        } ${className}`}
      >
        <div className="bg-white rounded-xl px-2.5 py-1 shrink-0 shadow-sm">
          <img
            src={ALLORESTO_OFFICIAL_LOGO_URL}
            alt="Allôresto"
            className={`${fullHeightSizes[size]} w-auto max-w-full object-contain`}
            draggable={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Niamey &bull; Niger</span>
          <span className="text-[10px] text-slate-400 font-medium">Vos envies, bien servies !</span>
        </div>
      </div>
    );
  }

  // Variant with Olive-Green Contact Band (for Footer & Communication Materials)
  if (showContacts) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-stretch max-w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-md transition-transform duration-200 hover:scale-[1.01] select-none p-3 gap-2 ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
      >
        <div className="flex items-center justify-center px-2 pt-1 bg-white">
          <img
            src={ALLORESTO_OFFICIAL_LOGO_URL}
            alt="Allôresto"
            className={`${fullHeightSizes[size]} w-auto max-w-full object-contain block`}
            draggable={false}
          />
        </div>
        <div className="bg-[#83903e] text-white rounded-xl px-3.5 py-2 text-center leading-snug space-y-0.5 shadow-sm">
          <p className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
            +227 70 03 25 52 — Appels &amp; WhatsApp
          </p>
          <p className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
            +227 74 44 16 21 — WhatsApp uniquement
          </p>
        </div>
      </div>
    );
  }

  // Default / Full / Compact / Horizontal / Hero official wordmark logo (without contacts)
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-start group select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div
        className={`inline-flex items-center justify-center bg-white border border-slate-200/80 shadow-sm transition-transform duration-200 group-hover:scale-[1.02] ${framePaddingSizes[size]}`}
      >
        <img
          src={ALLORESTO_OFFICIAL_LOGO_URL}
          alt="Allôresto"
          className={`${fullHeightSizes[size]} w-auto max-w-full object-contain block`}
          draggable={false}
        />
      </div>

      {showTagline && (
        <p
          className={`text-[10px] sm:text-[11px] font-semibold tracking-tight mt-1 ${
            isLightTheme ? "text-slate-600" : "text-slate-400"
          }`}
        >
          Vos envies, bien servies à Niamey
        </p>
      )}
    </div>
  );
};
