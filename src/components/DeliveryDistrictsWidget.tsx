import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Bike,
  Clock,
  Coins,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import {
  NIAMEY_DISTRICTS_DATA,
  calculateNiameyDeliveryFee,
  isNiameyNightTime,
  NiameyDistrict,
} from "../data/niameyDistrictsData";

interface DeliveryDistrictsWidgetProps {
  onOpenFullDirectory: () => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const DeliveryDistrictsWidget: React.FC<DeliveryDistrictsWidgetProps> = ({
  onOpenFullDirectory,
  onSelectDistrict,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("plateau");
  const isNight = isNiameyNightTime();

  const currentDistrict =
    NIAMEY_DISTRICTS_DATA.find((d) => d.id === selectedDistrictId) || NIAMEY_DISTRICTS_DATA[0];

  const { fee, timeEstimate, zoneLabel } = calculateNiameyDeliveryFee(currentDistrict.name, {
    isNight,
  });

  const popularDistricts = [
    { id: "plateau", label: "Plateau (Ministères)" },
    { id: "grande-mosquee-kadhafi", label: "Grande Mosquée (Gratuit)" },
    { id: "koira-kano", label: "Koira Kano" },
    { id: "yantala-haut-bas", label: "Yantala Corniche" },
    { id: "harobanda-nord-sud", label: "Harobanda (Rive Droite)" },
    { id: "goudel", label: "Goudel" },
    { id: "wadata", label: "Wadata" },
    { id: "aeroport", label: "Aéroport Diori Hamani" },
  ];

  return (
    <section className="bg-slate-900/90 border-y border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Title & Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Bike className="w-3.5 h-3.5" />
                <span>Calculateur de Frais de Livraison Express</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Quel est le tarif de livraison pour votre quartier à Niamey ?
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Allôresto dessert l’ensemble des <strong>5 Communes de Niamey</strong> (Centre-ville, Périphérie, Rive Droite et Ministères). Tous nos tarifs sont fixes, transparents et garantis par notre flotte officielle <strong>Billo Express 🏍️</strong>.
              </p>

              {/* Quick district selector pills */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sélection rapide de quartiers fréquents :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularDistricts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedDistrictId(item.id);
                        if (onSelectDistrict) onSelectDistrict(item.label);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedDistrictId === item.id
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-md"
                          : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Calculation Card */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-orange-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Quartier sélectionné :</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] border border-slate-800 flex items-center gap-1">
                    {isNight ? (
                      <>
                        <Moon className="w-3 h-3 text-indigo-400" />
                        <span>Nuit (≥ 21h)</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Jour (&lt; 21h)</span>
                      </>
                    )}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-white">{currentDistrict.name}</h4>
                  <p className="text-[11px] text-orange-400 font-semibold mt-0.5">
                    {currentDistrict.commune} &bull; {zoneLabel}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Frais de Livraison</span>
                    <span className="text-lg sm:text-xl font-black text-orange-400">
                      {fee === 0 ? "0 FCFA (Offert)" : `${fee.toLocaleString()} FCFA`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Délai Estimé</span>
                    <span className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      {timeEstimate}
                    </span>
                  </div>
                </div>

                {/* Key Landmarks */}
                {currentDistrict.landmarks && (
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Repères : </span>
                    {currentDistrict.landmarks.slice(0, 3).join(", ")}...
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onOpenFullDirectory}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-orange-400" />
                    <span>Explorer les 50+ Quartiers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
