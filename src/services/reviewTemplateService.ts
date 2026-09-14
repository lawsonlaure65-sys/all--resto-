export interface ReviewReplyTemplate {
  id: string;
  title: string;
  content: string;
  category?: "satisfaction" | "delay" | "quality" | "driver" | "general";
  is_default?: boolean;
  created_at: string;
}

const TEMPLATES_STORAGE_KEY = "alloresto_review_reply_templates";

export const DEFAULT_REVIEW_TEMPLATES: ReviewReplyTemplate[] = [
  {
    id: "tmpl-satisfaction-1",
    title: "Remerciement & Encouragement",
    category: "satisfaction",
    content:
      "Merci infiniment pour votre retour élogieux ! Nous transmettons chaleureusement vos félicitations à toute l'équipe du restaurant ainsi qu'au coursier. Au plaisir de vous régaler à nouveau !",
    is_default: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "tmpl-delay-1",
    title: "Excuses retard de livraison",
    category: "delay",
    content:
      "Nous vous prions d'accepter nos sincères excuses pour ce retard imprévu. Les conditions de circulation ont ralenti notre coursier. Nous mettons tout en œuvre pour que vos prochaines commandes arrivent dans les délais annoncés.",
    is_default: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "tmpl-quality-1",
    title: "Prise en charge réclamation plat",
    category: "quality",
    content:
      "Nous sommes désolés que votre plat n'ait pas été à la hauteur de vos attentes. Votre signalement a été transmis directement au gérant du restaurant pour un contrôle immédiat de la préparation et de l'emballage.",
    is_default: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "tmpl-driver-1",
    title: "Valorisation du coursier",
    category: "driver",
    content:
      "Un grand merci pour ce message valorisant le travail de notre livreur ! Votre satisfaction concernant la ponctualité et la courtoisie est notre plus belle récompense.",
    is_default: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "tmpl-general-1",
    title: "Fidélité Allôresto Niger",
    category: "general",
    content:
      "Merci pour votre confiance continue sur Allôresto. Votre satisfaction reste au cœur de nos priorités pour vous offrir le meilleur de la gastronomie à Niamey.",
    is_default: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export function getSavedReplyTemplates(): ReviewReplyTemplate[] {
  if (typeof window === "undefined") {
    return DEFAULT_REVIEW_TEMPLATES;
  }
  try {
    const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        TEMPLATES_STORAGE_KEY,
        JSON.stringify(DEFAULT_REVIEW_TEMPLATES)
      );
      return DEFAULT_REVIEW_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_REVIEW_TEMPLATES;
  } catch (e) {
    console.warn("Erreur lecture modèles de réponses:", e);
    return DEFAULT_REVIEW_TEMPLATES;
  }
}

export function saveReplyTemplate(
  data: Omit<ReviewReplyTemplate, "id" | "created_at"> & { id?: string }
): ReviewReplyTemplate {
  const current = getSavedReplyTemplates();
  const id = data.id || `tmpl-custom-${Date.now()}`;
  const now = new Date().toISOString();

  const existingIndex = current.findIndex((t) => t.id === id);
  let savedItem: ReviewReplyTemplate;

  if (existingIndex >= 0) {
    savedItem = {
      ...current[existingIndex],
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category || current[existingIndex].category || "general",
      is_default: false,
    };
    current[existingIndex] = savedItem;
  } else {
    savedItem = {
      id,
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category || "general",
      is_default: false,
      created_at: now,
    };
    current.unshift(savedItem);
  }

  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn("Erreur écriture modèles de réponses:", e);
  }

  return savedItem;
}

export function deleteReplyTemplate(id: string): boolean {
  try {
    const current = getSavedReplyTemplates();
    const filtered = current.filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.warn("Erreur suppression modèle de réponse:", e);
    return false;
  }
}

export function resetReplyTemplates(): ReviewReplyTemplate[] {
  try {
    localStorage.setItem(
      TEMPLATES_STORAGE_KEY,
      JSON.stringify(DEFAULT_REVIEW_TEMPLATES)
    );
    return DEFAULT_REVIEW_TEMPLATES;
  } catch (e) {
    console.warn("Erreur réinitialisation modèles de réponses:", e);
    return DEFAULT_REVIEW_TEMPLATES;
  }
}
