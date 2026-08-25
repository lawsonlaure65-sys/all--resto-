import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Search,
  Bike,
  Clock,
  Coins,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  NIAMEY_DISTRICTS_DATA,
  NIAMEY_PRICING_RULES,
  NiameyDistrict,
  searchNiameyDistricts,
  isNiameyNightTime,
} from "../data/niameyDistrictsData";

interface DeliveryFeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict?: (district: NiameyDistrict) => void;
  selectedDistrictName?: string;
}

export const DeliveryFeeCalculatorModal: React.FC<DeliveryFeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectDistrict,
  selectedDistrictName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<"all" | "centre" | "peripherie" | "relais_gratuit">("all");
  const [communeFilter, setCommuneFilter] = useState<string>("all");
  const [forceNightMode, setForceNightMode] = useState<boolean>(isNiameyNightTime());
  const [selectedItem, setSelectedItem] = useState<NiameyDistrict | null>(
    NIAMEY_DISTRICTS_DATA.find((d) => d.name === selectedDistrictName) || NIAMEY_DISTRICTS_DATA[0]
  );
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDistricts = searchNiameyDistricts(searchQuery).filter((d) => {
    if (zoneFilter !== "all" && d.zone !== zoneFilter) return false;
    if (communeFilter !== "all" && d.commune !== communeFilter) return false;
    return true;
  });

  const handleApplyDistrict = (district: NiameyDistrict) => {
    setSelectedItem(district);
    if (onSelectDistrict) {
      onSelectDistrict(district);
      setAppliedToast(`Quartier « ${district.name} » sélectionné pour votre livraison !`);
      setTimeout(() => {
        setAppliedToast(null);
        onClose();
      }, 1000);
    }
  };

  const communes = [
    { label: "Toutes les Communes", value: "all" },
    { label: "Commune I (Nord-Ouest)", value: "Commune I" },
    { label: "Commune II (Centre)", value: "Commune II" },
    { label: "Commune III (Sud-Est)", value: "Commune III" },
    { label: "Commune IV (Est / Aéroport)", value: "Commune IV" },
    { label: "Commune V (Rive Droite)", value: "Commune V (Rive Droite)" },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[850px]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Répertoire des Quartiers &amp; Frais de Livraison
                </h3>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase shadow-sm">
                  Niamey 🇳🇪
                </span>
              </div>
              <p className="text-xs text-orange-100 opacity-95 flex items-center gap-1 mt-0.5">
                <Bike className="w-3.5 h-3.5 text-amber-300" />
                <span>Calcul automatique des tarifs officiels Billo Express</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Summary Banner */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {NIAMEY_PRICING_RULES.map((rule) => {
              const activeFee = forceNightMode ? rule.nightFee : rule.dayFee;
              return (
                <div
                  key={rule.zone}
                  onClick={() => setZoneFilter(rule.zone)}
                  className={`p-2.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    zoneFilter === rule.zone
                      ? "bg-orange-500/15 border-orange-500 text-white"
                      : "bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate">{rule.title}</span>
                    <span className="text-xs font-black text-orange-400">
                      {rule.dayFee === 0 ? "0 FCFA" : `${activeFee.toLocaleString()} F`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {rule.timeEstimate}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {forceNightMode && rule.dayFee > 0 ? "Tarif Nuit (≥21h)" : "Tarif Jour (<21h)"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters & Search Controls */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un quartier, ministère, monument (ex: Plateau, Koira Kano, UAM, BCEAO, Yantala)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Day / Night Toggle Mode */}
            <div className="flex items-center gap-2 shrink-0 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setForceNightMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  !forceNightMode
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Jour (&lt; 21h)</span>
              </button>
              <button
                type="button"
                onClick={() => setForceNightMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  forceNightMode
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Nuit (&ge; 21h)</span>
              </button>
            </div>
          </div>

          {/* Quick Zone & Commune Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Zone :</span>
            <button
              onClick={() => setZoneFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                zoneFilter === "all"
                  ? "bg-orange-500 text-slate-950 font-bold"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              Tous les quartiers ({NIAMEY_DISTRICTS_DATA.length})
            </button>
            <button
              onClick={() => setZoneFilter("centre")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                zoneFilter === "centre"
                  ? "bg-orange-500 text-slate-950 font-bold"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              📍 Centre-ville ({forceNightMode ? "1 500 F" : "1 000 F"})
            </button>
            <button
              onClick={() => setZoneFilter("peripherie")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                zoneFilter === "peripherie"
                  ? "bg-orange-500 text-slate-950 font-bold"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              🗺️ Périphérie &amp; Rive Droite ({forceNightMode ? "2 000 F" : "1 500 F"})
            </button>
            <button
              onClick={() => setZoneFilter("relais_gratuit")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                zoneFilter === "relais_gratuit"
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-950 border border-slate-800 text-emerald-400 hover:text-white"
              }`}
            >
              🕌 Retrait Gratuit (0 F)
            </button>

            {/* Commune Dropdown */}
            <div className="ml-auto flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">Commune :</span>
              <select
                value={communeFilter}
                onChange={(e) => setCommuneFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] font-medium rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {communes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {appliedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shrink-0"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{appliedToast}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Districts Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60">
          {filteredDistricts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Aucun quartier correspondant trouvé</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Essayez d'autres mots-clés comme « Plateau », « Koira Kano », « Yantala », « Fleuve » ou « Aéroport ».
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setZoneFilter("all");
                  setCommuneFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-orange-400 transition"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDistricts.map((district) => {
                const isSelected = selectedItem?.id === district.id;
                const fee = forceNightMode ? district.nightDeliveryFee : district.dayDeliveryFee;

                return (
                  <div
                    key={district.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-slate-950 border-orange-500/80 shadow-lg shadow-orange-500/10"
                        : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-white text-sm">{district.name}</h4>
                            {district.isPopular && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Populaire
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-orange-400 font-semibold mt-0.5 block">
                            {district.commune} &bull; {district.zoneLabel}
                          </span>
                        </div>

                        {/* Fee Badge */}
                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-black block ${
                              district.dayDeliveryFee === 0
                                ? "text-emerald-400"
                                : "text-orange-400"
                            }`}
                          >
                            {district.dayDeliveryFee === 0 ? "0 FCFA" : `${fee.toLocaleString()} FCFA`}
                          </span>
                          <span className="text-[9px] text-slate-500">
                            {forceNightMode ? "Tarif Nuit (≥21h)" : "Tarif Jour (<21h)"}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {district.description}
                      </p>

                      {/* Landmarks */}
                      {district.landmarks && district.landmarks.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {district.landmarks.map((lm, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[10px] border border-slate-800"
                            >
                              📍 {lm}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Info & CTA */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>Délai : <strong>{district.estimatedDeliveryTime}</strong></span>
                      </span>

                      <button
                        onClick={() => handleApplyDistrict(district)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                            : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Quartier Actif</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Sélectionner</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Livraisons assurées par <strong>Billo Express Niamey 🏍️</strong> &bull; Suivi GPS &amp; WhatsApp en direct.</span>
          </div>
          <span className="text-slate-500 text-[10px]">
            Pour toute demande d'entreprise ou commande de groupe : +227 96 05 23 10
          </span>
        </div>
      </motion.div>
    </div>
  );
};
