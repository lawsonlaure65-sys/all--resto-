'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ReviewRecord,
  ReviewStatus,
  ReviewReply,
  fetchAllReviews,
  moderateReview,
  moderateReviewsBulk,
  replyToReview,
  deleteReviewReply,
} from '../../../src/services/reviewService';
import {
  ReviewReplyTemplate,
  getSavedReplyTemplates,
} from '../../../src/services/reviewTemplateService';
import { SaveTemplateModal } from '../../../src/components/reviews/SaveTemplateModal';
import { ReviewTemplateModal } from '../../../src/components/reviews/ReviewTemplateModal';
import { QuickApplyBar } from '../../../src/components/reviews/QuickApplyBar';
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
  CheckSquare,
  Square,
  ArrowUpDown,
  CornerDownRight,
  Trash2,
  Edit3,
  Send,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
  BookmarkPlus,
  Bookmark,
  Zap,
  BookOpen,
} from 'lucide-react';

type SortOption =
  | 'newest'
  | 'oldest'
  | 'rating_desc'
  | 'rating_asc'
  | 'urgent'
  | 'unanswered';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // État de sélection pour actions groupées (Bulk Action)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState<boolean>(false);

  // État du panneau d'insights
  const [showInsights, setShowInsights] = useState<boolean>(true);

  // État pour la fonctionnalité de réponse
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyAuthorName, setReplyAuthorName] = useState<string>('Support Allôresto');
  const [replyAuthorRole, setReplyAuthorRole] = useState<'admin' | 'restaurant'>('admin');
  const [replyComment, setReplyComment] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState<boolean>(false);

  // État pour les modèles de réponses (Save as Template & Quick Apply)
  const [templates, setTemplates] = useState<ReviewReplyTemplate[]>([]);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState<boolean>(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState<boolean>(false);
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
      setSelectedIds([]);
      setTemplates(getSavedReplyTemplates());
    } catch (e) {
      console.warn('Erreur chargement avis:', e);
    } finally {
      setLoading(false);
    }
  };

  // Action d'application rapide d'un modèle (Quick Apply)
  const handleQuickApply = (template: ReviewReplyTemplate) => {
    setReplyComment(template.content);
    setAppliedTemplateId(template.id);
    showToast(`Modèle "${template.title}" appliqué (Quick Apply).`);
    setTimeout(() => {
      setAppliedTemplateId(null);
    }, 1800);
  };

  // Notification temporaire
  const showToast = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Modération unitaire
  const handleStatusChange = async (reviewId: string, newStatus: ReviewStatus) => {
    try {
      await moderateReview(reviewId, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
      );
      showToast(`Statut mis à jour : ${newStatus === 'published' ? 'En ligne' : newStatus === 'hidden' ? 'Masqué' : 'Signalé'}`);

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

  // Modération groupée (Bulk Action)
  const handleBulkStatusChange = async (newStatus: ReviewStatus) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    try {
      const res = await moderateReviewsBulk(selectedIds, newStatus);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: newStatus } : r))
        );
        showToast(
          `${res.count} avis mis à jour avec succès (${newStatus === 'published' ? 'En ligne' : newStatus === 'hidden' ? 'Masqués' : 'Signalés'})`
        );
        logAuditEvent({
          action: 'bulk_moderate_reviews',
          entityType: 'reviews',
          entityId: 'bulk',
          metadata: { count: res.count, newStatus, selectedIds },
        });
        setSelectedIds([]);
      }
    } catch (e) {
      console.error('Erreur action groupée:', e);
    } finally {
      setBulkProcessing(false);
    }
  };

  // Sélection individuelle
  const toggleSelectReview = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Répondre à un avis
  const handleOpenReplyForm = (review: ReviewRecord) => {
    setReplyingReviewId(review.id);
    if (review.reply) {
      setReplyAuthorName(review.reply.author_name);
      setReplyAuthorRole(review.reply.author_role);
      setReplyComment(review.reply.comment);
    } else {
      setReplyAuthorName(
        review.restaurant_name ? `Support Allôresto / ${review.restaurant_name}` : 'Support Client Allôresto'
      );
      setReplyAuthorRole('admin');
      setReplyComment('');
    }
  };

  const handleCancelReply = () => {
    setReplyingReviewId(null);
    setReplyComment('');
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyComment.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await replyToReview(reviewId, {
        author_name: replyAuthorName.trim() || 'Support Allôresto',
        author_role: replyAuthorRole,
        comment: replyComment.trim(),
        created_at: new Date().toISOString(),
      });

      if (res.success && res.review) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, reply: res.review?.reply } : r))
        );
        showToast('Réponse officielle publiée avec succès.');
        setReplyingReviewId(null);
        setReplyComment('');

        logAuditEvent({
          action: 'reply_review',
          entityType: 'reviews',
          entityId: reviewId,
          metadata: { replyAuthor: replyAuthorName, role: replyAuthorRole },
        });
      }
    } catch (e) {
      console.error('Erreur envoi réponse:', e);
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleDeleteReply = async (reviewId: string) => {
    if (!confirm('Confirmez-vous la suppression de cette réponse ?')) return;
    try {
      const res = await deleteReviewReply(reviewId);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => {
            if (r.id === reviewId) {
              const updated = { ...r };
              delete updated.reply;
              return updated;
            }
            return r;
          })
        );
        showToast('Réponse supprimée.');
        logAuditEvent({
          action: 'delete_reply_review',
          entityType: 'reviews',
          entityId: reviewId,
        });
      }
    } catch (e) {
      console.error('Erreur suppression réponse:', e);
    }
  };

  // Calcul des statistiques pour Reporting Insights
  const insights = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        total: 0,
        avgRating: '0.0',
        satisfactionRate: 0,
        starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        starPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
        repliedCount: 0,
        replyRate: 0,
        reportedCount: 0,
        publishedCount: 0,
        hiddenCount: 0,
        topRestaurants: [] as { name: string; avg: number; count: number }[],
        urgentAttentionCount: 0,
      };
    }

    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRating = 0;
    let repliedCount = 0;
    let reportedCount = 0;
    let publishedCount = 0;
    let hiddenCount = 0;
    let satisfiedCount = 0; // 4 ou 5 étoiles
    let urgentAttentionCount = 0; // signalés ou note <= 2 sans réponse

    // Regroupement par restaurant
    const restoMap: Record<string, { totalRating: number; count: number }> = {};

    reviews.forEach((r) => {
      sumRating += r.rating;
      if (r.rating in starCounts) {
        starCounts[r.rating]++;
      }
      if (r.rating >= 4) satisfiedCount++;
      if (r.reply) repliedCount++;
      if (r.status === 'reported') reportedCount++;
      if (r.status === 'published') publishedCount++;
      if (r.status === 'hidden') hiddenCount++;

      if (r.status === 'reported' || (r.rating <= 2 && !r.reply)) {
        urgentAttentionCount++;
      }

      if (r.restaurant_name) {
        if (!restoMap[r.restaurant_name]) {
          restoMap[r.restaurant_name] = { totalRating: 0, count: 0 };
        }
        restoMap[r.restaurant_name].totalRating += r.rating;
        restoMap[r.restaurant_name].count += 1;
      }
    });

    const starPercentages: Record<number, number> = {
      5: Math.round((starCounts[5] / total) * 100),
      4: Math.round((starCounts[4] / total) * 100),
      3: Math.round((starCounts[3] / total) * 100),
      2: Math.round((starCounts[2] / total) * 100),
      1: Math.round((starCounts[1] / total) * 100),
    };

    const topRestaurants = Object.entries(restoMap)
      .map(([name, data]) => ({
        name,
        avg: Number((data.totalRating / data.count).toFixed(1)),
        count: data.count,
      }))
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 3);

    return {
      total,
      avgRating: (sumRating / total).toFixed(1),
      satisfactionRate: Math.round((satisfiedCount / total) * 100),
      starCounts,
      starPercentages,
      repliedCount,
      replyRate: Math.round((repliedCount / total) * 100),
      reportedCount,
      publishedCount,
      hiddenCount,
      topRestaurants,
      urgentAttentionCount,
    };
  }, [reviews]);

  // Filtrage et Tri combinés
  const filteredAndSortedReviews = useMemo(() => {
    let result = reviews.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (typeFilter !== 'all' && r.reviewer_type !== typeFilter) return false;
      if (starFilter !== 'all' && r.rating !== starFilter) return false;
      return true;
    });

    // Tri
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        case 'urgent': {
          // Signalés d'abord, puis note la plus basse
          const scoreA = (a.status === 'reported' ? 100 : 0) + (5 - a.rating);
          const scoreB = (b.status === 'reported' ? 100 : 0) + (5 - b.rating);
          return scoreB - scoreA;
        }
        case 'unanswered': {
          // Sans réponse d'abord
          const hasReplyA = a.reply ? 1 : 0;
          const hasReplyB = b.reply ? 1 : 0;
          if (hasReplyA !== hasReplyB) return hasReplyA - hasReplyB;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, statusFilter, typeFilter, starFilter, sortBy]);

  // Gestion Tout Sélectionner / Désélectionner
  const isAllSelected =
    filteredAndSortedReviews.length > 0 &&
    filteredAndSortedReviews.every((r) => selectedIds.includes(r.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedReviews.map((r) => r.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-full md:max-w-7xl mx-auto space-y-6">

        {/* Header Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                Modération des Évaluations &amp; Réputation
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allôresto Niger &bull; Actions groupées, insights détaillés, réponses officielles &amp; protection stricte des données
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTemplateManagerOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-amber-50/50 border border-gray-200 text-gray-700 hover:text-amber-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Gérer les modèles de réponses types (Templates)"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Modèles de réponses ({templates.length})</span>
            </button>
            <a
              href="/app/admin/dashboard"
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tableau de Bord</span>
            </a>
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* SECTION REPORTING INSIGHT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            onClick={() => setShowInsights(!showInsights)}
            className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>Reporting Insights &amp; Analyse des Sentiments</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    Direct
                  </span>
                </h2>
                <p className="text-[11px] text-gray-400">
                  Satisfaction client ({insights.satisfactionRate}%), répartition des étoiles et alertes prioritaires
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
              {showInsights ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showInsights && (
            <div className="p-5 space-y-6">
              {/* Cartes KPI clés */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Note globale */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Note Globale
                  </span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                      {insights.avgRating}
                    </span>
                    <span className="text-xs text-gray-400">/ 5</span>
                  </div>
                  <div className="flex text-amber-400 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(Number(insights.avgRating))
                            ? 'fill-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Taux de satisfaction */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      Satisfaction
                    </span>
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono mt-1.5">
                    {insights.satisfactionRate}%
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-1">
                    Avis positifs (&ge; 4 étoiles)
                  </p>
                </div>

                {/* Taux de réponse du support */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                      Taux Réponse
                    </span>
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-blue-700 font-mono mt-1.5">
                    {insights.replyRate}%
                  </p>
                  <p className="text-[11px] text-blue-600 mt-1">
                    {insights.repliedCount} avis répondus
                  </p>
                </div>

                {/* Alertes prioritaires */}
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                      À Traiter
                    </span>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-rose-700 font-mono mt-1.5">
                    {insights.urgentAttentionCount}
                  </p>
                  <p className="text-[11px] text-rose-600 mt-1">
                    {insights.reportedCount} signalé(s) &bull; notes basses
                  </p>
                </div>
              </div>

              {/* Répartition par étoiles & Top restaurants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                {/* Histogramme interactif des étoiles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">Distribution des Notes (1 à 5 ★)</span>
                    {starFilter !== 'all' && (
                      <button
                        onClick={() => setStarFilter('all')}
                        className="text-blue-600 hover:underline text-[11px] font-semibold"
                      >
                        Réinitialiser filtre étoile ({starFilter}★)
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = insights.starCounts[star] || 0;
                      const pct = insights.starPercentages[star] || 0;
                      const isSelected = starFilter === star;

                      return (
                        <div
                          key={star}
                          onClick={() => setStarFilter(isSelected ? 'all' : star)}
                          className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition ${
                            isSelected ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-gray-50'
                          }`}
                          title={`Filtrer par ${star} étoiles`}
                        >
                          <span className="w-8 text-xs font-bold text-gray-700 flex items-center gap-0.5">
                            {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>

                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                star >= 4
                                  ? 'bg-emerald-500'
                                  : star === 3
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <span className="w-10 text-right text-xs font-mono font-bold text-gray-600">
                            {count}
                          </span>
                          <span className="w-10 text-right text-[11px] font-mono text-gray-400">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Restaurants & Synthèse */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-700 block">
                    Top Restaurants les Mieux Notés
                  </span>
                  <div className="space-y-2">
                    {insights.topRestaurants.length > 0 ? (
                      insights.topRestaurants.map((resto, idx) => (
                        <div
                          key={resto.name}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white text-gray-600 font-bold font-mono text-[11px] flex items-center justify-center border border-gray-200">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-gray-800">{resto.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {resto.avg}
                            </span>
                            <span className="text-gray-400 text-[11px]">({resto.count} avis)</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Aucune donnée par restaurant.</p>
                    )}
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/60 text-[11px] text-blue-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Les avis sont vérifiés pour chaque commande. Les numéros de téléphone sont strictement chiffrés et masqués pour le respect du RGPD/protection des données.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BARRE DE CONTRÔLE : FILTRES & TRI & ACTIONS GROUPÉES */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filtre par statut */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-bold text-gray-700">Statut :</span>
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

            {/* Tri (Review Sorting) */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-gray-700">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-800 font-medium cursor-pointer focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="newest">📅 Plus récents d'abord</option>
                <option value="oldest">📅 Plus anciens d'abord</option>
                <option value="rating_desc">⭐ Note la plus élevée (5 → 1)</option>
                <option value="rating_asc">⭐ Note la plus basse (1 → 5)</option>
                <option value="urgent">🚨 Priorité : Signalés &amp; Urgents</option>
                <option value="unanswered">💬 En attente de réponse</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
            {/* Filtre Auteur */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Auteur :</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 font-medium cursor-pointer focus:outline-none"
              >
                <option value="all">Tous types d'auteurs</option>
                <option value="customer">Clients uniquement</option>
                <option value="restaurant">Restaurants partenaires</option>
                <option value="driver">Livreurs Allôresto</option>
              </select>
            </div>

            {/* Compteur d'avis affichés */}
            <div className="text-gray-400 text-[11px] flex items-center gap-2">
              <span>
                Affichage de <strong className="text-gray-700">{filteredAndSortedReviews.length}</strong> avis
              </span>
              {(statusFilter !== 'all' || typeFilter !== 'all' || starFilter !== 'all') && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setStarFilter('all');
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BARRE D'ACTION GROUPÉE (BULK ACTIONS SUPPORT) */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-blue-600 cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>
                {isAllSelected
                  ? 'Tout désélectionner'
                  : `Sélectionner tout (${filteredAndSortedReviews.length})`}
              </span>
            </button>

            {selectedIds.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Boutons d'action en masse */}
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-gray-500 font-medium mr-1">Action groupée :</span>

              <button
                onClick={() => handleBulkStatusChange('published')}
                disabled={bulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Approuver ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => handleBulkStatusChange('hidden')}
                disabled={bulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-gray-700 hover:bg-gray-800 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Masquer ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => handleBulkStatusChange('reported')}
                disabled={bulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Signaler ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition cursor-pointer"
              >
                Annuler
              </button>
            </div>
          ) : (
            <span className="text-gray-400 text-[11px] italic">
              Cochez des avis pour appliquer une modération en masse (Publier, Masquer, Signaler).
            </span>
          )}
        </div>

        {/* LISTE DES AVIS */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white p-12 rounded-2xl text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span>Chargement des évaluations...</span>
            </div>
          ) : filteredAndSortedReviews.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center text-xs text-gray-400 space-y-2">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-600">Aucun avis correspondant aux critères sélectionnés.</p>
              <p className="text-[11px]">Essayez de modifier les filtres de statut, de note ou d'auteur.</p>
            </div>
          ) : (
            filteredAndSortedReviews.map((rev) => {
              const isSelected = selectedIds.includes(rev.id);
              const isReplying = replyingReviewId === rev.id;

              return (
                <div
                  key={rev.id}
                  className={`bg-white p-5 rounded-2xl shadow-sm border transition ${
                    isSelected
                      ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50/10'
                      : rev.status === 'reported'
                      ? 'border-rose-300 bg-rose-50/20'
                      : rev.status === 'hidden'
                      ? 'border-gray-200 bg-gray-50/50 opacity-75'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Checkbox de sélection pour action groupée */}
                      <button
                        onClick={() => toggleSelectReview(rev.id)}
                        className="mt-1 text-gray-400 hover:text-blue-600 cursor-pointer transition"
                        title="Sélectionner pour action groupée"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>

                      {/* Avatar par type */}
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {rev.reviewer_type === 'customer' ? (
                          <User className="w-5 h-5" />
                        ) : rev.reviewer_type === 'restaurant' ? (
                          <ChefHat className="w-5 h-5" />
                        ) : (
                          <Bike className="w-5 h-5" />
                        )}
                      </div>

                      {/* Infos auteur & note */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                          {rev.reply && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                              <MessageSquare className="w-2.5 h-2.5" />
                              <span>Répondu</span>
                            </span>
                          )}
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

                    {/* Actions de modération et bouton répondre */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center flex-wrap">
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

                      {/* Bouton pour déclencher la réponse */}
                      {!isReplying && (
                        <button
                          onClick={() => handleOpenReplyForm(rev)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            rev.reply
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                          title={rev.reply ? 'Modifier la réponse' : 'Répondre officiellement'}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{rev.reply ? 'Modifier réponse' : 'Répondre'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Commentaire de l'avis */}
                  {rev.comment && (
                    <div className="mt-3 p-3 rounded-xl bg-gray-50/90 border border-gray-100 text-xs text-gray-800 leading-relaxed">
                      "{rev.comment}"
                    </div>
                  )}

                  {/* RÉPONSE OFFICIELLE EXISTANTE (REVIEW REPLY DISPLAY) */}
                  {rev.reply && !isReplying && (
                    <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-bold text-blue-900">
                            {rev.reply.author_name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200/60 text-blue-800">
                            {rev.reply.author_role === 'restaurant'
                              ? 'Restaurant Partenaire'
                              : 'Support Officiel'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>
                            {new Date(rev.reply.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <button
                            onClick={() => handleOpenReplyForm(rev)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Modifier la réponse"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReply(rev.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Supprimer la réponse"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-blue-950 pl-5 font-normal leading-relaxed">
                        {rev.reply.comment}
                      </p>
                    </div>
                  )}

                  {/* FORMULAIRE DE RÉPONSE DÉPLIABLE (REVIEW REPLY FORM) */}
                  {isReplying && (
                    <div className="mt-3 p-4 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {rev.reply ? 'Modifier la réponse officielle' : 'Rédiger une réponse officielle'}
                          </span>
                        </span>
                        <button
                          onClick={handleCancelReply}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">
                            Nom du signataire :
                          </label>
                          <input
                            type="text"
                            value={replyAuthorName}
                            onChange={(e) => setReplyAuthorName(e.target.value)}
                            placeholder="Ex: Support Client Allôresto"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 bg-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">
                            Rôle :
                          </label>
                          <select
                            value={replyAuthorRole}
                            onChange={(e) =>
                              setReplyAuthorRole(e.target.value as 'admin' | 'restaurant')
                            }
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="admin">Administrateur / Support Allôresto</option>
                            <option value="restaurant">Restaurant Partenaire</option>
                          </select>
                        </div>
                      </div>

                      {/* APPLICATION RAPIDE DE MODÈLE (QUICK APPLY) */}
                      <QuickApplyBar
                        templates={templates}
                        onQuickApply={handleQuickApply}
                        onOpenTemplateManager={() => setIsTemplateManagerOpen(true)}
                        appliedTemplateId={appliedTemplateId}
                      />

                      {/* Zone de texte */}
                      <div>
                        <textarea
                          rows={3}
                          value={replyComment}
                          onChange={(e) => setReplyComment(e.target.value)}
                          placeholder="Rédigez ici votre réponse officielle visible par le client..."
                          className="w-full p-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                        />
                      </div>

                      {/* Boutons validation & Sauvegarder en modèle */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          disabled={!replyComment.trim()}
                          onClick={() => setIsSaveTemplateModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Enregistrer cette réponse comme modèle réutilisable"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5 text-amber-600" />
                          <span>Enregistrer comme modèle (Save as Template)</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCancelReply}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            disabled={replySubmitting || !replyComment.trim()}
                            onClick={() => handleSubmitReply(rev.id)}
                            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{replySubmitting ? 'Envoi...' : 'Publier la réponse'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pied de carte */}
                  <div className="mt-3 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>
                      Posté le {new Date(rev.created_at).toLocaleString('fr-FR')} &bull; Vie privée : aucun numéro affiché
                    </span>
                    <span className="font-mono">ID: {rev.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODALE D'ENREGISTREMENT DE NOUVEAU MODÈLE (SAVE AS TEMPLATE) */}
        <SaveTemplateModal
          isOpen={isSaveTemplateModalOpen}
          initialContent={replyComment}
          onClose={() => setIsSaveTemplateModalOpen(false)}
          onSaved={(newTmpl) => {
            setTemplates((prev) => [newTmpl, ...prev]);
            showToast(`Modèle "${newTmpl.title}" enregistré avec succès (Save as Template).`);
          }}
        />

        {/* MODALE COMPLÈTE DE GESTION DES MODÈLES AVEC QUICK APPLY */}
        <ReviewTemplateModal
          isOpen={isTemplateManagerOpen}
          templates={templates}
          onClose={() => setIsTemplateManagerOpen(false)}
          onApplyTemplate={(tmpl) => {
            handleQuickApply(tmpl);
          }}
          onTemplatesUpdated={(updated) => {
            setTemplates(updated);
          }}
          isReplyingActive={Boolean(replyingReviewId)}
        />

      </div>
    </div>
  );
}
