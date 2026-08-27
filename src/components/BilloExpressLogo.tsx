import React from "react";

interface BilloExpressLogoProps {
  variant?: "full" | "icon" | "horizontal" | "badge" | "compact";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  theme?: "dark" | "light" | "auto";
  showTagline?: boolean;
  onClick?: () => void;
}

export const BilloExpressLogo: React.FC<BilloExpressLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
  theme = "auto",
  showTagline = true,
  onClick,
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
    "2xl": "w-28 h-28",
  };

  const isLight = theme === "light";
  const navyColor = isLight ? "#102A43" : "#FFFFFF";
  const textColor = isLight ? "text-slate-900" : "text-white";
  const taglineColor = isLight ? "text-slate-600" : "text-slate-400";

  // Emblem Vector: Maison, Moto avec lignes de vitesse, Colis Orange avec Bouclier et Arc circulaire
  const emblemSvg = (
    <svg
      viewBox="0 0 500 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-105 duration-300 select-none"
    >
      <defs>
        <linearGradient id="billoNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? "#1E3048" : "#38BDF8"} />
          <stop offset="100%" stopColor={isLight ? "#0F1C2E" : "#0284C7"} />
        </linearGradient>

        <linearGradient id="billoOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA043" />
          <stop offset="100%" stopColor="#F36C21" />
        </linearGradient>
      </defs>

      {/* Dynamic Circular Orange Swoosh wrapping the house & bike */}
      <path
        d="M 440 210 
           C 460 270 445 340 395 385 
           C 335 440 240 455 170 420 
           C 140 405 125 385 135 365 
           C 145 345 170 355 195 370 
           C 245 395 320 385 365 345 
           C 400 310 415 260 395 210 
           C 385 185 410 160 425 175 
           C 435 185 438 198 440 210 Z"
        fill="url(#billoOrangeGrad)"
      />

      {/* House Roof & Chimney Silhouette */}
      <rect x="345" y="145" width="22" height="40" rx="2" fill={isLight ? "#102A43" : "#E2E8F0"} />
      <path
        d="M 300 120 
           L 415 210 
           L 395 210 
           L 300 138 
           L 205 210 
           L 185 210 
           Z"
        fill={isLight ? "#102A43" : "#E2E8F0"}
      />

      {/* 4-Pane Square Window */}
      <g transform="translate(288, 175)" fill={isLight ? "#102A43" : "#E2E8F0"}>
        <rect x="0" y="0" width="10" height="10" rx="1.5" />
        <rect x="14" y="0" width="10" height="10" rx="1.5" />
        <rect x="0" y="14" width="10" height="10" rx="1.5" />
        <rect x="14" y="14" width="10" height="10" rx="1.5" />
      </g>

      {/* Speed Lines behind Motorcycle */}
      <g stroke={isLight ? "#102A43" : "#94A3B8"} strokeLinecap="round">
        <line x1="60" y1="318" x2="200" y2="318" strokeWidth="8" />
        <line x1="100" y1="300" x2="190" y2="300" strokeWidth="8" />
        <line x1="75" y1="336" x2="175" y2="336" strokeWidth="7" />
      </g>

      {/* Delivery Courier Motorcycle */}
      {/* Rear Wheel */}
      <circle cx="215" cy="335" r="35" stroke={isLight ? "#102A43" : "#F8FAFC"} strokeWidth="16" fill="none" />
      {/* Front Wheel */}
      <circle cx="395" cy="335" r="35" stroke={isLight ? "#102A43" : "#F8FAFC"} strokeWidth="16" fill="none" />

      {/* Motorcycle Frame & Seat */}
      <path
        d="M 195 305 
           L 255 305 
           C 275 270 305 260 345 260 
           L 365 240 
           L 380 265 
           C 385 270 395 295 375 325 
           L 330 330 
           L 275 330 
           C 255 315 220 315 195 305 Z"
        fill={isLight ? "#102A43" : "#F8FAFC"}
      />

      {/* Headlight */}
      <path
        d="M 372 250 
           C 385 250 395 260 390 275 
           L 375 275 Z"
        fill={isLight ? "#102A43" : "#F8FAFC"}
      />

      {/* Orange Delivery Box on Rear Rack with Shield Motif */}
      <g transform="translate(225, 230)">
        <rect x="0" y="0" width="50" height="50" rx="8" fill="url(#billoOrangeGrad)" />
        <path
          d="M 25 10 
             L 38 16 
             L 38 29 
             C 38 38 25 42 25 42 
             C 25 42 12 38 12 29 
             L 12 16 
             Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return (
      <div
        onClick={onClick}
        className={`${iconSizes[size]} flex items-center justify-center shrink-0 ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
        title="Bilo Express — Livraison à Domicile Rapide"
      >
        {emblemSvg}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        onClick={onClick}
        className={`px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 shadow-md ${
          onClick ? "cursor-pointer hover:border-orange-500/40" : ""
        } ${className}`}
      >
        <div className="w-9 h-9 shrink-0">{emblemSvg}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-tight">
            <span className="font-extrabold text-white text-xs">Bilo</span>
            <span className="font-extrabold text-orange-500 text-xs">Express</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
              Partenaire Officiel
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Livraison à Domicile Rapide
          </span>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2.5 group ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
      >
        <div className={`${iconSizes[size]} shrink-0`}>{emblemSvg}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span className={`font-black text-sm sm:text-base ${textColor}`}>
              Bilo
            </span>
            <span className="font-black text-sm sm:text-base text-orange-500">
              Express
            </span>
          </div>
          {showTagline && (
            <span className={`text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 ${taglineColor}`}>
              Livraison à Domicile Rapide
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Full Brand Card / Lockup
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center text-center group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className={`${iconSizes[size]} shrink-0 mb-1`}>{emblemSvg}</div>
      <div className="flex items-center gap-1.5 leading-tight">
        <span className={`font-black text-base sm:text-lg ${textColor}`}>
          Bilo
        </span>
        <span className="font-black text-base sm:text-lg text-orange-500">
          Express
        </span>
      </div>
      {showTagline && (
        <span className={`text-[11px] sm:text-xs font-semibold tracking-normal mt-0.5 ${taglineColor}`}>
          Livraison à Domicile Rapide
        </span>
      )}
    </div>
  );
};
