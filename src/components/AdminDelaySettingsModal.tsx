import React, { useState } from "react";
import { X, Settings, Check, Clock, AlertTriangle, Gift, Globe, Volume2 } from "lucide-react";
import {
  DelayAutomationConfig,
  saveDelayAutomationConfig,
} from "../utils/whatsappNotifications";
import { AppLanguage } from "../types";

interface AdminDelaySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DelayAutomationConfig;
  onSave: (newConfig: DelayAutomationConfig) => void;
}

export const AdminDelaySettingsModal: React.FC<AdminDelaySettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [form, setForm] = useState<DelayAutomationConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDelayAutomationConfig(form);
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Configuration des Alertes Retard WhatsApp
              </h3>
              <p className="text-xs text-slate-400">
                Définissez les seuils de détection automatique et les messages d&apos;excuses par défaut.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Toggle Auto Alert */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                Système d&apos;Alerte &amp; Détection Automatique
              </span>
              <span className="text-[11px] text-slate-400">
                Surveille en temps réel les commandes en cours et signale immédiatement les dépassements de délai.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, autoAlertEnabled: !form.autoAlertEnabled })}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                form.autoAlertEnabled ? "bg-emerald-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform transform absolute top-1 ${
                  form.autoAlertEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Threshold Minutes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Seuil de déclenchement d&apos;alerte (minutes après commande)</span>
              </span>
              <span className="text-amber-400 font-mono font-bold text-sm">
                {form.thresholdMinutes} min
              </span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[25, 30, 35, 40, 45].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm({ ...form, thresholdMinutes: val })}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    form.thresholdMinutes === val
                      ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  {val} min
                </button>
              ))}
            </div>
          </div>

          {/* Default Additional Delay Minutes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ⏱️ Retard additionnel annoncé par défaut au client
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setForm({ ...form, defaultAdditionalMinutes: val })}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    form.defaultAdditionalMinutes === val
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  +{val} min
                </button>
              ))}
            </div>
          </div>

          {/* Default Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              📝 Motif de retard par défaut
            </label>
            <input
              type="text"
              value={form.defaultReason}
              onChange={(e) => setForm({ ...form, defaultReason: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Default Compensation */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geste commercial par défaut (code promo / cadeau)</span>
            </label>
            <input
              type="text"
              value={form.compensationText}
              onChange={(e) => setForm({ ...form, compensationText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Default Language */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Langue de communication par défaut</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { code: "fr", label: "Français", flag: "🇫🇷" },
                { code: "ha", label: "Hausa", flag: "🇳🇪" },
                { code: "zm", label: "Zarma", flag: "🇳🇪" },
                { code: "en", label: "English", flag: "🇬🇧" },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setForm({ ...form, defaultLanguage: l.code as AppLanguage })}
                  className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                    form.defaultLanguage === l.code
                      ? "bg-purple-600 text-white border-purple-400 font-black shadow-sm"
                      : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <span>Sauvegarder les Règles</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
