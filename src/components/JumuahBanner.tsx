import React from "react";
import { motion } from "motion/react";
import { Clock, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { JumuahStatus } from "../utils/jumuahSchedule";

interface JumuahBannerProps {
  jumuahStatus: JumuahStatus;
  simulatedFridayPause: boolean;
  onToggleSimulatedFriday: () => void;
  onOpenScheduleOrder?: () => void;
}

export const JumuahBanner: React.FC<JumuahBannerProps> = ({
  jumuahStatus,
  simulatedFridayPause,
  onToggleSimulatedFriday,
  onOpenScheduleOrder,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-950 via-slate-950 to-orange-950 border-b border-amber-500/30 text-amber-100 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
        {/* Left message */}
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-sm border border-amber-500/40">
            🕌
          </span>
          <div>
            <p className="font-black text-white flex items-center gap-1.5 justify-center md:justify-start">
              <span>Règle Spéciale Vendredi &bull; Prière du Jumu&apos;ah</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/30">
                11h00 ➔ 15h00
              </span>
            </p>
            <p className="text-[11px] text-amber-200/80">
              {jumuahStatus.isPauseActive
                ? "Livraisons en pause pour la grande prière du vendredi. Reprise garantie dès 15h00 !"
                : "Chaque vendredi, les livraisons s'arrêtent à 11h00 et reprennent à 15h00."}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSimulatedFriday}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
              simulatedFridayPause
                ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm"
                : "bg-slate-900/80 text-amber-300 border-amber-500/40 hover:bg-slate-800"
            }`}
            title="Tester le comportement de la pause Jumu'ah"
          >
            <span>{simulatedFridayPause ? "🧪 Pause Active (Test)" : "🧪 Simuler Vendredi 11h-15h"}</span>
          </button>

          {onOpenScheduleOrder && (
            <button
              onClick={onOpenScheduleOrder}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[11px] hover:opacity-90 transition cursor-pointer shadow-sm"
            >
              Précommander pour 15h+
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
