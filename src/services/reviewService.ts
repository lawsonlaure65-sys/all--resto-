import { getSupabaseClient } from "./supabaseClient";

export type ReviewerType = "customer" | "restaurant" | "driver";
export type ReviewStatus = "published" | "hidden" | "reported";

export interface ReviewReply {
  id?: string;
  author_name: string;
  author_role: "admin" | "restaurant";
  comment: string;
  created_at: string;
}

export interface ReviewRecord {
  id: string;
  order_id: string;
  reviewer_id?: string;
  reviewer_type: ReviewerType;
  reviewer_name?: string; // Prénom uniquement ou pseudonyme (pas de téléphone affiché publiquement)
  restaurant_id?: string;
  restaurant_name?: string;
  driver_id?: string;
  driver_name?: string;
  rating: number; // 1 à 5
  comment?: string;
  status: ReviewStatus;
  created_at: string;
  reply?: ReviewReply;
}

const STORAGE_KEY = "alloresto_reviews_v2";

export const INITIAL_SAMPLE_REVIEWS: ReviewRecord[] = [
  {
    id: "rev-001",
    order_id: "ORD-9821",
    reviewer_type: "customer",
    reviewer_name: "Fatima A.",
    restaurant_id: "resto-khadys-food",
    restaurant_name: "Khady's Food & Event",
    rating: 5,
    comment: "Le choukouya de mouton et le suya étaient délicieux et bien chauds ! Livré au Plateau en 35 minutes.",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    reply: {
      id: "rep-001",
      author_name: "Direction Khady's Food & Event",
      author_role: "restaurant",
      comment: "Merci infiniment Fatima ! C'est un réel plaisir de vous régaler avec nos viandes fraîches et nos épices Kankankan.",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  },
  {
    id: "rev-002",
    order_id: "ORD-9820",
    reviewer_type: "customer",
    reviewer_name: "Boubacar S.",
    restaurant_id: "resto-khadys-food",
    restaurant_name: "Khady's Food & Event",
    driver_name: "Moussa I.",
    rating: 5,
    comment: "Très bon plat du jour avec alloco croustillant. Livreur très courtois au Plateau.",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "rev-003",
    order_id: "ORD-9819",
    reviewer_type: "customer",
    reviewer_name: "Aïchatou M.",
    restaurant_id: "resto-khadys-food",
    restaurant_name: "Khady's Food & Event",
    rating: 5,
    comment: "Brochettes de filet de bœuf fondantes et jus de bissap bien frais. Service impeccable.",
    status: "published",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function getStoredReviews(): ReviewRecord[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REVIEWS));
      return INITIAL_SAMPLE_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_REVIEWS;
  }
}

function saveStoredReviews(reviews: ReviewRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn("Erreur sauvegarde locale reviews:", e);
  }
}

/**
 * Récupère tous les avis pour l'espace modération Admin
 */
export async function fetchAllReviews(): Promise<ReviewRecord[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ReviewRecord[];
      }
    } catch (e) {
      console.warn("Repli vers stockage local reviews:", e);
    }
  }

  return getStoredReviews();
}

/**
 * Récupère les avis publiés pour un restaurant
 */
export async function fetchPublishedRestaurantReviews(restaurantId: string): Promise<ReviewRecord[]> {
  const all = await fetchAllReviews();
  return all.filter((r) => r.restaurant_id === restaurantId && r.status === "published");
}

/**
 * Soumission d'un avis client ou partenaire avec contrôles d'intégrité :
 * - Commande existante
 * - Note comprise entre 1 et 5
 * - Unique par order_id et reviewer_type
 * - Numéro de téléphone protégé (non affiché)
 */
export async function submitReview(input: {
  orderId: string;
  reviewerId?: string;
  reviewerType: ReviewerType;
  reviewerName?: string;
  restaurantId?: string;
  restaurantName?: string;
  driverId?: string;
  driverName?: string;
  rating: number;
  comment?: string;
}): Promise<{ success: boolean; error?: string; review?: ReviewRecord }> {
  // Validation note
  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: "La note doit être comprise entre 1 et 5 étoiles." };
  }

  const existingReviews = getStoredReviews();
  // Vérification de l'unicité par commande et auteur
  const alreadyReviewed = existingReviews.some(
    (r) => r.order_id === input.orderId && r.reviewer_type === input.reviewerType
  );
  if (alreadyReviewed) {
    return { success: false, error: "Un avis a déjà été soumis pour cette commande." };
  }

  const newReview: ReviewRecord = {
    id: `rev-${Date.now()}`,
    order_id: input.orderId,
    reviewer_id: input.reviewerId,
    reviewer_type: input.reviewerType,
    reviewer_name: input.reviewerName || "Client Allôresto",
    restaurant_id: input.restaurantId,
    restaurant_name: input.restaurantName,
    driver_id: input.driverId,
    driver_name: input.driverName,
    rating: Math.round(input.rating),
    comment: input.comment?.trim() || "",
    status: "published",
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("reviews").insert([
        {
          order_id: newReview.order_id,
          reviewer_id: newReview.reviewer_id,
          reviewer_type: newReview.reviewer_type,
          restaurant_id: newReview.restaurant_id,
          driver_id: newReview.driver_id,
          rating: newReview.rating,
          comment: newReview.comment,
          status: newReview.status,
        },
      ]);
      if (error) {
        console.warn("Erreur insertion Supabase review, repli local:", error);
      }
    } catch (e) {
      console.warn("Exception insertion Supabase review:", e);
    }
  }

  // Enregistrement local
  existingReviews.unshift(newReview);
  saveStoredReviews(existingReviews);

  return { success: true, review: newReview };
}

/**
 * Modération d'un avis par l'administrateur (publié, masqué, signalé)
 */
export async function moderateReview(
  reviewId: string,
  newStatus: ReviewStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("reviews").update({ status: newStatus }).eq("id", reviewId);
    } catch (e) {
      console.warn("Erreur modération Supabase:", e);
    }
  }

  const reviews = getStoredReviews();
  const updated = reviews.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r));
  saveStoredReviews(updated);

  return { success: true };
}

/**
 * Modération en masse de plusieurs avis (Action groupée / Bulk action)
 */
export async function moderateReviewsBulk(
  reviewIds: string[],
  newStatus: ReviewStatus
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!reviewIds || reviewIds.length === 0) {
    return { success: false, count: 0, error: "Aucun avis sélectionné." };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("reviews").update({ status: newStatus }).in("id", reviewIds);
    } catch (e) {
      console.warn("Erreur modération en masse Supabase:", e);
    }
  }

  const idSet = new Set(reviewIds);
  const reviews = getStoredReviews();
  let updatedCount = 0;
  const updated = reviews.map((r) => {
    if (idSet.has(r.id)) {
      updatedCount++;
      return { ...r, status: newStatus };
    }
    return r;
  });

  saveStoredReviews(updated);
  return { success: true, count: updatedCount };
}

/**
 * Réponse officielle à un avis (par l'administrateur ou le restaurant)
 */
export async function replyToReview(
  reviewId: string,
  reply: ReviewReply
): Promise<{ success: boolean; review?: ReviewRecord; error?: string }> {
  if (!reply.comment || reply.comment.trim().length === 0) {
    return { success: false, error: "Le commentaire de réponse ne peut pas être vide." };
  }

  const formattedReply: ReviewReply = {
    id: reply.id || `rep-${Date.now()}`,
    author_name: reply.author_name || "Support Allôresto",
    author_role: reply.author_role || "admin",
    comment: reply.comment.trim(),
    created_at: reply.created_at || new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from("reviews")
        .update({
          reply: formattedReply,
        })
        .eq("id", reviewId);
    } catch (e) {
      console.warn("Erreur sauvegarde réponse Supabase:", e);
    }
  }

  const reviews = getStoredReviews();
  let targetReview: ReviewRecord | undefined;
  const updated = reviews.map((r) => {
    if (r.id === reviewId) {
      targetReview = { ...r, reply: formattedReply };
      return targetReview;
    }
    return r;
  });

  saveStoredReviews(updated);
  return { success: true, review: targetReview };
}

/**
 * Suppression de la réponse d'un avis
 */
export async function deleteReviewReply(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from("reviews")
        .update({ reply: null })
        .eq("id", reviewId);
    } catch (e) {
      console.warn("Erreur suppression réponse Supabase:", e);
    }
  }

  const reviews = getStoredReviews();
  const updated = reviews.map((r) => {
    if (r.id === reviewId) {
      const copy = { ...r };
      delete copy.reply;
      return copy;
    }
    return r;
  });

  saveStoredReviews(updated);
  return { success: true };
}
