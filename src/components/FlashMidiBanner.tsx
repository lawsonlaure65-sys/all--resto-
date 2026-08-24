import React, { useState, useEffect } from "react";
import { Flame, Clock, Users, ArrowRight, Sparkles, Building2, Check } from "lucide-react";

interface FlashMidiBannerProps {
  onOpenGroupOrder: () => void;
  onApplyPromoCode?: (code: string) => void;
}

export const FlashMidiBanner: React.FC<FlashMidiBannerProps> = ({
  onOpenGroupOrder,
  onApplyPromoCode,
}) => {
  const [timeLeft, setTimeLeft] = useState("01:24:18");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(12, 30, 0, 0);
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, target.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.("BUREAU15");
    setCopiedCode(true);
    onApplyPromoCode?.("BUREAU15");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-800 p-4 sm:p-6 text-white shadow-xl shadow-orange-950/30 border border-orange-400/30 mb-8">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Flash Midi Bureaux &amp; Ministères
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-white" />
              Clôture dans {timeLeft}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Précommandez votre déjeuner pour 12h30 avec <span className="underline decoration-amber-300">-15%</span> !
          </h3>
          <p className="text-xs text-orange-100 max-w-xl">
            Profitez des menus express Khady's Food et Le Khadafi Palace livrés directement à votre étage par <strong>Billo Express</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-amber-300/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Code BUREAU15 appliqué !</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Code : BUREAU15</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenGroupOrder}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-orange-600" />
            <span>Commander en groupe avec mes collègues</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
