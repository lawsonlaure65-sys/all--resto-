'use client';

import React, { useEffect, useState } from 'react';
import {
  ReviewRecord,
  ReviewStatus,
  fetchAllReviews,
  moderateReview,
} from '../../../src/services/reviewService';
import { logAuditEvent } from '../../../src/services/auditService';
import {
  Star,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Filter,
  MessageSquare,
  User,
  ChefHat,
  Bike,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (e) {
      console.warn('Erreur chargement avis:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: ReviewStatus) => {
    try {
      await moderateReview(reviewId, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
      setActionSuccess(`Statut mis à jour : ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);

      logAuditEvent({
        action: 'moderate_review',
        entityType: 'reviews',
        entityId: reviewId,
        metadata: { newStatus },
      });
    } catch (e) {
      console.error('Erreur modération avis:', e);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (typeFilter !== 'all' && r.reviewer_type !== typeFilter) return false;
    return true;
  });

  const reportedCount = reviews.filter((r) => r.status === 'reported').length;
  const publishedCount = reviews.filter((r) => r.status === 'published').length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-full md:max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Modération des Évaluations &amp; Réputation
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allôresto Niger &bull; Contrôle des avis clients, restaurants et livreurs &bull; Protection stricte de la vie privée
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/app/admin/dashboard"
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tableau de Bord</span>
            </a>
            <button
              onClick={loadData}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>🔄 Actualiser</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Note Moyenne Globale</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-black text-amber-500 font-mono">{avgRating}</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Sur {reviews.length} avis recueillis</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avis Publiés Actifs</span>
            <p className="text-3xl font-black text-emerald-600 font-mono mt-2">{publishedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Visibles par les clients</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avis Signalés</span>
            <div className="flex items-center justify-between mt-2">
              <p className="text-3xl font-black text-rose-600 font-mono">{reportedCount}</p>
              {reportedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold animate-pulse">
                  Nécessite modération
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Masqués automatiquement jusqu'à décision</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="font-bold text-gray-700">Filtrer par statut :</span>
            <div className="flex items-center gap-1">
              {(['all', 'published', 'reported', 'hidden'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st === 'all'
                    ? 'Tous'
                    : st === 'published'
                    ? 'Publiés'
                    : st === 'reported'
                    ? 'Signalés'
                    : 'Masqués'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">Auteur :</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 font-medium cursor-pointer focus:outline-none"
            >
              <option value="all">Tous types</option>
              <option value="customer">Clients</option>
              <option value="restaurant">Restaurants</option>
              <option value="driver">Livreurs</option>
            </select>
          </div>
        </div>

        {/* Liste des avis */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-500">
              Chargement des avis...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-400">
              Aucun avis correspondant aux critères de filtre.
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className={`bg-white p-5 rounded-2xl shadow-sm border transition ${
                  rev.status === 'reported'
                    ? 'border-rose-300 bg-rose-50/20'
                    : rev.status === 'hidden'
                    ? 'border-gray-200 bg-gray-50/50 opacity-70'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      {rev.reviewer_type === 'customer' ? (
                        <User className="w-5 h-5" />
                      ) : rev.reviewer_type === 'restaurant' ? (
                        <ChefHat className="w-5 h-5" />
                      ) : (
                        <Bike className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">
                          {rev.reviewer_name || 'Utilisateur Allôresto'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase">
                          {rev.reviewer_type === 'customer'
                            ? 'Client'
                            : rev.reviewer_type === 'restaurant'
                            ? 'Restaurant'
                            : 'Livreur'}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">
                          Réf : {rev.order_id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'fill-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {rev.restaurant_name ? `Pour : ${rev.restaurant_name}` : ''}
                          {rev.driver_name ? ` &bull; Livreur : ${rev.driver_name}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions de modération */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        rev.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rev.status === 'reported'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {rev.status === 'published'
                        ? 'En ligne'
                        : rev.status === 'reported'
                        ? 'Signalé'
                        : 'Masqué'}
                    </span>

                    {rev.status !== 'published' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'published')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Approuver et publier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Publier</span>
                      </button>
                    )}

                    {rev.status !== 'hidden' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'hidden')}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Masquer de la vue publique"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Masquer</span>
                      </button>
                    )}

                    {rev.status !== 'reported' && (
                      <button
                        onClick={() => handleStatusChange(rev.id, 'reported')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Marquer comme signalé"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Signaler</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Commentaire de l'avis */}
                {rev.comment && (
                  <div className="mt-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-700 leading-relaxed">
                    "{rev.comment}"
                  </div>
                )}

                <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                  <span>
                    Posté le {new Date(rev.created_at).toLocaleString('fr-FR')} &bull; Vie privée : aucun numéro affiché
                  </span>
                  <span className="font-mono">ID: {rev.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
