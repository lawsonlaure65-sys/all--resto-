import React from "react";
import { ShieldCheck, Lock, FileText, CheckCircle2, X, Scale, UserCheck } from "lucide-react";

interface HapdpDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HapdpDataModal: React.FC<HapdpDataModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">Protection des Données Personnelles</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Conformité Niger 🇳🇪
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cadre légal Loi n° 2022-59 modifiée par la Loi n° 2023-31 &bull; Supervision HAPDP
            </p>
          </div>
        </div>

        {/* Legal Clauses */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Scale className="w-4 h-4" />
              <span>Engagement et Conformité Réglementaire</span>
            </div>
            <p>
              La plateforme <strong>Allôresto Niger</strong> respecte scrupuleusement la législation nigérienne relative à la protection des données à caractère personnel (Loi n° 2022-59 du 16 décembre 2022, modifiée par la loi n° 2023-31 du 4 juillet 2023), placée sous l'autorité de la <strong>Haute Autorité de Protection des Données à caractère Personnel (HAPDP)</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-orange-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white mb-0.5">1. Données strictement nécessaires</h5>
                <p className="text-slate-400">
                  Nous collectons uniquement votre prénom, numéro de téléphone, adresse de livraison (bureau ou domicile) et détails de commande afin d'assurer l'acheminement par <strong>Billo Express</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-cyan-400 shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white mb-0.5">2. Confidentialité &amp; Non-cession</h5>
                <p className="text-slate-400">
                  Vos informations ne sont jamais revendues ni cédées à des tiers. Les coursiers Billo Express ne reçoivent que les instructions nécessaires pour votre course.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-white mb-0.5">3. Droit d'accès, de rectification et d'effacement</h5>
                <p className="text-slate-400">
                  Conformément aux directives de la HAPDP, vous pouvez à tout moment demander l'accès ou la suppression totale de vos coordonnées sur simple demande à <code>contact@alloresto.ne</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer"
          >
            J'ai compris &bull; Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
