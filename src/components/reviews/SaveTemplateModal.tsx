'use client';

import React, { useState } from 'react';
import {
  ReviewReplyTemplate,
  saveReplyTemplate,
} from '../../services/reviewTemplateService';
import { BookmarkPlus, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  initialContent: string;
  onClose: () => void;
  onSaved: (newTemplate: ReviewReplyTemplate) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  initialContent,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState<
    'satisfaction' | 'delay' | 'quality' | 'driver' | 'general'
  >('general');
  const [error, setError] = useState<string | null>(null);

  // Synchronise le contenu quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setTitle('');
      setError(null);
    }
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Veuillez donner un titre à ce modèle.');
      return;
    }
    if (!content.trim()) {
      setError('Le contenu du modèle ne peut pas être vide.');
      return;
    }

    const saved = saveReplyTemplate({
      title: title.trim(),
      content: content.trim(),
      category,
    });

    onSaved(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-blue-900">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Enregistrer comme modèle (Save as Template)
              </h3>
              <p className="text-[11px] text-gray-500">
                Sauvegardez cette réponse pour la réutiliser en un clic via Quick Apply
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Nom du modèle <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Excuses livraison retardée (Yantala / Plateau)"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500 bg-gray-50/50 focus:bg-white transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Catégorie thématique
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | 'satisfaction'
                    | 'delay'
                    | 'quality'
                    | 'driver'
                    | 'general'
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-800 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="satisfaction">🌟 Satisfaction & Remerciements</option>
              <option value="delay">⏳ Retard de livraison & Trafic</option>
              <option value="quality">🍽️ Réclamation qualité plat / emballage</option>
              <option value="driver">🛵 Évaluation et comportement coursier</option>
              <option value="general">💬 Réponse générale & Fidélité</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Contenu de la réponse type <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Rédigez la réponse type..."
              className="w-full p-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              {content.length} caractères &bull; Modèle accessible immédiatement pour tous les modérateurs
            </span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Enregistrer le modèle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
