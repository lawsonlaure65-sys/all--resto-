'use client';

import React from 'react';
import { ReviewReplyTemplate } from '../../services/reviewTemplateService';
import { Zap, BookOpen, ChevronRight, Check } from 'lucide-react';

interface QuickApplyBarProps {
  templates: ReviewReplyTemplate[];
  onQuickApply: (template: ReviewReplyTemplate) => void;
  onOpenTemplateManager: () => void;
  appliedTemplateId?: string | null;
}

export const QuickApplyBar: React.FC<QuickApplyBarProps> = ({
  templates,
  onQuickApply,
  onOpenTemplateManager,
  appliedTemplateId,
}) => {
  // Affiche les 4 premiers modèles les plus pertinents
  const featuredTemplates = templates.slice(0, 4);

  return (
    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-amber-50/30 border border-blue-100/90 space-y-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
          <span>Application Rapide (Quick Apply) :</span>
          <span className="text-[10px] font-normal text-blue-700 hidden sm:inline">
            Cliquez pour charger instantanément une réponse type
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenTemplateManager}
          className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
        >
          <BookOpen className="w-3 h-3" />
          <span>Tous les modèles ({templates.length})</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Rangée de boutons Quick Apply */}
      <div className="flex flex-wrap gap-1.5">
        {featuredTemplates.map((tmpl) => {
          const isSelected = appliedTemplateId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`inline-flex items-center rounded-lg border transition shadow-2xs ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                  : 'bg-white border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              {/* Libellé du modèle */}
              <span className="px-2 py-1 text-[11px] font-semibold text-gray-800 max-w-[200px] truncate">
                {tmpl.title}
              </span>

              {/* Bouton Quick Apply dédié */}
              <button
                type="button"
                onClick={() => onQuickApply(tmpl)}
                className={`px-2 py-1 text-[10px] font-bold rounded-r-lg flex items-center gap-1 transition cursor-pointer border-l ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                }`}
                title={`Charger directement "${tmpl.title}" dans la boîte de réponse`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    <span>Chargé !</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    <span>Quick Apply</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
