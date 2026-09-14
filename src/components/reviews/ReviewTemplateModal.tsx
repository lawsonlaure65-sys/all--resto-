'use client';

import React, { useState } from 'react';
import {
  ReviewReplyTemplate,
  deleteReplyTemplate,
  resetReplyTemplates,
  saveReplyTemplate,
} from '../../services/reviewTemplateService';
import {
  X,
  Search,
  Zap,
  Trash2,
  Plus,
  RotateCcw,
  Sparkles,
  Check,
  FileText,
  Bookmark,
  ChevronRight,
} from 'lucide-react';

interface ReviewTemplateModalProps {
  isOpen: boolean;
  templates: ReviewReplyTemplate[];
  onClose: () => void;
  onApplyTemplate?: (template: ReviewReplyTemplate) => void;
  onTemplatesUpdated: (updated: ReviewReplyTemplate[]) => void;
  isReplyingActive?: boolean;
}

export const ReviewTemplateModal: React.FC<ReviewTemplateModalProps> = ({
  isOpen,
  templates,
  onClose,
  onApplyTemplate,
  onTemplatesUpdated,
  isReplyingActive = false,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<
    'satisfaction' | 'delay' | 'quality' | 'driver' | 'general'
  >('general');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'satisfaction', label: '🌟 Satisfaction' },
    { id: 'delay', label: '⏳ Retard' },
    { id: 'quality', label: '🍽️ Qualité plat' },
    { id: 'driver', label: '🛵 Livreur' },
    { id: 'general', label: '💬 Général' },
  ];

  const filteredTemplates = templates.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApply = (template: ReviewReplyTemplate) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
      setAppliedId(template.id);
      setTimeout(() => {
        setAppliedId(null);
        onClose();
      }, 400);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer ce modèle de réponse type ?')) {
      deleteReplyTemplate(id);
      onTemplatesUpdated(templates.filter((t) => t.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Réinitialiser les modèles par défaut ? Cela rétablira les modèles Allôresto standard.'
      )
    ) {
      const defs = resetReplyTemplates();
      onTemplatesUpdated(defs);
    }
  };

  const handleCreateNewTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const saved = saveReplyTemplate({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
    });

    onTemplatesUpdated([saved, ...templates]);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-gray-900">
                  Modèles de Réponses Réutilisables
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  {templates.length} modèles
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Gérez vos réponses types et appliquez-les directement (Quick Apply)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingNew && (
              <button
                onClick={() => setIsCreatingNew(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau modèle</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Nouveau Modèle si ouvert */}
        {isCreatingNew && (
          <form
            onSubmit={handleCreateNewTemplate}
            className="p-4 bg-blue-50/40 border-b border-blue-100 space-y-3 text-xs shrink-0 animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Créer un nouveau modèle de réponse type</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre du modèle (ex: Excuses coupure d'électricité)"
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500"
                required
              />
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value as
                      | 'satisfaction'
                      | 'delay'
                      | 'quality'
                      | 'driver'
                      | 'general'
                  )
                }
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              >
                <option value="satisfaction">🌟 Satisfaction</option>
                <option value="delay">⏳ Retard</option>
                <option value="quality">🍽️ Qualité plat</option>
                <option value="driver">🛵 Livreur</option>
                <option value="general">💬 Général</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Contenu de la réponse..."
              className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-sans"
              required
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              >
                Enregistrer ce modèle
              </button>
            </div>
          </form>
        )}

        {/* Barre de recherche et filtres de catégorie */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-2.5 shrink-0 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par mot-clé (ex: excuses, retard, félicitations, choukouya...)"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des modèles */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center text-gray-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs font-semibold text-gray-600">
                Aucun modèle correspondant à votre recherche.
              </p>
            </div>
          ) : (
            filteredTemplates.map((template) => {
              const isApplied = appliedId === template.id;

              return (
                <div
                  key={template.id}
                  className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xs transition space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-bold text-xs text-gray-900">
                        {template.title}
                      </span>
                      {template.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                          {template.category}
                        </span>
                      )}
                      {template.is_default && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700">
                          Standard Allôresto
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* BOUTON QUICK APPLY */}
                      <button
                        onClick={() => handleApply(template)}
                        disabled={isApplied}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isApplied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        }`}
                        title="Charger ce modèle directement dans la boîte de réponse"
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Appliqué !</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Quick Apply</span>
                          </>
                        )}
                      </button>

                      {!template.is_default && (
                        <button
                          onClick={(e) => handleDelete(template.id, e)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Supprimer ce modèle personnalisé"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-sans bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                    "{template.content}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer avec réinitialisation */}
        <div className="p-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser les modèles par défaut Allôresto</span>
          </button>
          <span>
            {templates.length} modèle{templates.length > 1 ? 's' : ''} enregistré{templates.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
