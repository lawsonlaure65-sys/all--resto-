export interface NiameyDistrict {
  id: string;
  name: string;
  zone: "centre" | "peripherie" | "relais_gratuit";
  zoneLabel: string;
  commune: "Commune I" | "Commune II" | "Commune III" | "Commune IV" | "Commune V (Rive Droite)";
  description: string;
  landmarks: string[];
  dayDeliveryFee: number; // in FCFA (< 21h)
  nightDeliveryFee: number; // in FCFA (>= 21h)
  estimatedDeliveryTime: string;
  isPopular?: boolean;
}

export interface NiameyPricingRule {
  zone: "centre" | "peripherie" | "relais_gratuit";
  title: string;
  dayFee: number;
  nightFee: number;
  timeEstimate: string;
  coverageDescription: string;
}

export const NIAMEY_PRICING_RULES: NiameyPricingRule[] = [
  {
    zone: "relais_gratuit",
    title: "🕌 Point de Retrait Gratuit",
    dayFee: 0,
    nightFee: 0,
    timeEstimate: "10-15 min",
    coverageDescription: "Grande Mosquée Mouhamar Kadhafi (Avenue de l'Islam) — Retrait sans frais de coursier.",
  },
  {
    zone: "centre",
    title: "📍 Centre-ville & Quartiers Urbains",
    dayFee: 1000,
    nightFee: 1500,
    timeEstimate: "15-25 min",
    coverageDescription: "Plateau (Ministères & Ambassades), Grande Mosquée, Yantala, Terminus, Château, Zongo, Boukoki, Gamkallé, Djemadjé, Kalley, Losso-Goungou.",
  },
  {
    zone: "peripherie",
    title: "🗺️ Périphérie & Rive Droite",
    dayFee: 1500,
    nightFee: 2000,
    timeEstimate: "25-40 min",
    coverageDescription: "Koira Kano, Koira Tagui, Harobanda, Goudel, Wadata, Banifandou, Dar-es-Salam, Bobiel, Kirkissoye, Aéroport, Cité Députés, Saga, Tondibia, Francophonie.",
  },
];

export const NIAMEY_DISTRICTS_DATA: NiameyDistrict[] = [
  // ==========================================
  // COMMUNE II (Centre Institutionnel & Affaires)
  // ==========================================
  {
    id: "plateau",
    name: "Plateau (Ministères & Ambassades)",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Cœur administratif de Niamey, siège de la Présidence, des Ministères, Banques (BCEAO) et Ambassades.",
    landmarks: ["Ministère des Finances", "BCEAO", "Hôtel Bravia / Radisson Blu", "Palais Présidentiel", "Avenue du Général de Gaulle"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
    isPopular: true,
  },
  {
    id: "grande-mosquee-kadhafi",
    name: "Grande Mosquée Kadhafi & Avenue de l'Islam",
    zone: "relais_gratuit",
    zoneLabel: "Point Relais Offert (0 F)",
    commune: "Commune II",
    description: "Point de retrait officiel Allôresto Niger avec stationnement facile et retrait express.",
    landmarks: ["Grande Mosquée Khadafi", "Avenue de l'Islam", "Rond-Point Mosquée", "Boulevard Mali Béro"],
    dayDeliveryFee: 0,
    nightDeliveryFee: 0,
    estimatedDeliveryTime: "10-15 min",
    isPopular: true,
  },
  {
    id: "terminus",
    name: "Terminus / Camp Bagagi",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Zone dynamique au centre, proche des gares et centres d'affaires.",
    landmarks: ["Gare Terminus", "Camp Militaire Bagagi", "Rond-Point Maourey", "Avenue de l'Entente"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
    isPopular: true,
  },
  {
    id: "zongo",
    name: "Zongo / Grand Marché",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Quartier commerçant et animé de Niamey, autour du Grand Marché.",
    landmarks: ["Grand Marché de Niamey", "Petit Marché", "Avenue du Commerce", "Banque Centrale"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-25 min",
    isPopular: true,
  },
  {
    id: "chateau-1-2",
    name: "Château 1 & Château 2",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Quartiers centraux résidentiels et commerciaux réputés pour leur proximité avec les grandes artères.",
    landmarks: ["Château d'Eau de Niamey", "Boulevard de l'Indépendance", "Pharmacie Château"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
  },
  {
    id: "boukoki-1-2-3-4",
    name: "Boukoki (Boukoki 1, 2, 3 et 4)",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Grand quartier historique populaire et dense de Niamey.",
    landmarks: ["Marché Boukoki", "Stade Municipal", "Boulevard Mali Béro Nord"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "20-25 min",
    isPopular: true,
  },
  {
    id: "lazaret",
    name: "Lazaret / Dan Zama Koira",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune II",
    description: "Secteur central bordant le boulevard Mali Béro.",
    landmarks: ["Rond-point Lazaret", "Clinique Gamkalley", "Axe Route Filingué"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "20-25 min",
  },
  {
    id: "koira-kano",
    name: "Koira Kano (Résidentiel Nord)",
    zone: "peripherie",
    zoneLabel: "Périphérie Résidentielle",
    commune: "Commune II",
    description: "Quartier résidentiel huppé du nord de Niamey, villas privées et bureaux d'ONGs.",
    landmarks: ["Cité Koira Kano", "Clinique Magori", "Boulevard Tanimoune", "Ambassades Nord"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-30 min",
    isPopular: true,
  },
  {
    id: "banifandou",
    name: "Banifandou 1 & 2 / Dar-es-Salam",
    zone: "peripherie",
    zoneLabel: "Périphérie",
    commune: "Commune II",
    description: "Quartiers en extension nord-est de Niamey, forte densité résidentielle.",
    landmarks: ["Marché Banifandou", "Poste Dar-es-Salam", "Axe Ceinture Verte"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
  },
  {
    id: "bobiel",
    name: "Bobiel / Sonici / Bassora",
    zone: "peripherie",
    zoneLabel: "Périphérie",
    commune: "Commune II",
    description: "Quartiers nord récents, proches de l'échangeur Diori Hamani et de la ceinture verte.",
    landmarks: ["Échangeur Diori Hamani", "Complexe Scolaire Bobiel", "Route de Ouallam"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-35 min",
  },
  {
    id: "francophonie",
    name: "Cité de la Francophonie",
    zone: "peripherie",
    zoneLabel: "Périphérie",
    commune: "Commune II",
    description: "Zone résidentielle construite pour les Jeux de la Francophonie, cadre calme et aéré.",
    landmarks: ["Villas Francophonie", "Route de l'Aéroport Nord"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-40 min",
  },

  // ==========================================
  // COMMUNE I (Nord-Ouest & Corniche Fleuve Niger)
  // ==========================================
  {
    id: "yantala-haut-bas",
    name: "Yantala (Yantala Haut & Bas, Corniche)",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune I",
    description: "Quartier bordant la rive gauche du fleuve Niger, réputé pour ses maquis de poisson frais et restaurants.",
    landmarks: ["Corniche Yantala", "Hôtel Gaweye", "Ambassade de France", "Musée National Boubou Hama"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
    isPopular: true,
  },
  {
    id: "losso-goungou",
    name: "Losso-Goungou / Recasement",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune I",
    description: "Quartier riverain du fleuve Niger, accès rapide vers le pont Kennedy.",
    landmarks: ["Palais des Congrès", "Avenue de l'Afrique", "Berges du Fleuve"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
  },
  {
    id: "goudel",
    name: "Goudel / Route de Tillabéri",
    zone: "peripherie",
    zoneLabel: "Périphérie Ouest",
    commune: "Commune I",
    description: "Grand quartier de l'ouest de Niamey longeant le fleuve en direction de Tillabéri.",
    landmarks: ["Château d'eau de Goudel", "Usine SEEN / NIGELEC", "Avenue Goudel"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
    isPopular: true,
  },
  {
    id: "koira-tagui",
    name: "Koira Tagui / Tchangarey",
    zone: "peripherie",
    zoneLabel: "Périphérie",
    commune: "Commune I",
    description: "Secteur nord-ouest en plein essor urbain, habitats neufs.",
    landmarks: ["Carrefour Koira Tagui", "Axe Route de Tillabéri Nord"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-40 min",
  },
  {
    id: "tondibia",
    name: "Tondibia / Tondikoirey",
    zone: "peripherie",
    zoneLabel: "Périphérie Lointaine",
    commune: "Commune I",
    description: "Zone périphérique abritant le camp d'instruction militaire et les résidences du bord du fleuve.",
    landmarks: ["Camp Militaire de Tondibia", "Base des Forces de Défense"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "35-45 min",
  },

  // ==========================================
  // COMMUNE III (Sud-Est & Marché Wadata)
  // ==========================================
  {
    id: "gamkalle",
    name: "Gamkallé / Djemadjé",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune III",
    description: "Quartier animé et commerçant du sud-est, réputé pour ses grillades nocturnes et choukouya.",
    landmarks: ["Rond-point Gamkallé", "Avenue du Fleuve", "Quai des Pêcheurs"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-25 min",
    isPopular: true,
  },
  {
    id: "lacouroussou",
    name: "Lacouroussou / Kalley (Est & Ouest)",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune III",
    description: "Quartiers historiques au centre-sud, forte densité artisanale et commerciale.",
    landmarks: ["Marché de Kalley", "Stade Général Seyni Kountché (SGSK)", "Avenue de l'OUA"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "15-20 min",
    isPopular: true,
  },
  {
    id: "wadata",
    name: "Wadata (Grand Marché Wadata & Artisans)",
    zone: "peripherie",
    zoneLabel: "Périphérie Commerciale",
    commune: "Commune III",
    description: "Pôle commercial incontournable réputé pour son marché d'artisanat cuir, tissus et vivres.",
    landmarks: ["Marché Wadata", "Gare Voyageurs Wadata", "Maison des Artisans", "Boulevard Mali Béro Est"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-30 min",
    isPopular: true,
  },
  {
    id: "cite-deputes",
    name: "Cité Députés / Cité Fayçal",
    zone: "peripherie",
    zoneLabel: "Périphérie",
    commune: "Commune III",
    description: "Zone résidentielle calme composée de villas pour cadres et diplomates.",
    landmarks: ["Villas Cité Députés", "Mosquée Fayçal", "Axe Route Dosso"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
  },
  {
    id: "abidjan-poudriere",
    name: "Abidjan / Poudrière / Foulan Koira",
    zone: "centre",
    zoneLabel: "Centre-ville",
    commune: "Commune III",
    description: "Quartiers péricentraux proches de la zone industrielle et de la caserne.",
    landmarks: ["Ancienne Poudrière", "Route de Torodi", "Carrefour Foulan Koira"],
    dayDeliveryFee: 1000,
    nightDeliveryFee: 1500,
    estimatedDeliveryTime: "20-25 min",
  },

  // ==========================================
  // COMMUNE IV (Est & Pôle Aéroport / Industriel)
  // ==========================================
  {
    id: "talladje",
    name: "Talladjé / Saga",
    zone: "peripherie",
    zoneLabel: "Périphérie Est",
    commune: "Commune IV",
    description: "Quartier en plein développement le long de la Route Nationale 1 (vers Dosso).",
    landmarks: ["Marché Talladjé", "Rond-Point 6ème", "Village artisanal de Saga", "Riziculture Saga"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
    isPopular: true,
  },
  {
    id: "aeroport",
    name: "Aéroport International Diori Hamani & Base 101",
    zone: "peripherie",
    zoneLabel: "Périphérie Aéroportuaire",
    commune: "Commune IV",
    description: "Zone de l'aéroport de Niamey, hôtels de transit, bases aériennes et complexes hôteliers.",
    landmarks: ["Terminal Aéroport Diori Hamani", "Base Aérienne 101", "Hôtel Noom", "Voie Express Aéroport"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-40 min",
    isPopular: true,
  },
  {
    id: "pays-bas-tourakou",
    name: "Pays-Bas / Tourakou / Koubia",
    zone: "peripherie",
    zoneLabel: "Périphérie Est",
    commune: "Commune IV",
    description: "Zones périphériques orientales réputées pour le marché de bétail de Tourakou.",
    landmarks: ["Grand Marché à Bétail de Tourakou", "Poste de Péage Est", "Route de Fada"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-45 min",
  },
  {
    id: "zone-industrielle",
    name: "Zone Industrielle & Entrepôts",
    zone: "peripherie",
    zoneLabel: "Périphérie Entreprises",
    commune: "Commune IV",
    description: "Quartier des usines, grands entrepôts logistiques, sociétés d'import-export et brasseries.",
    landmarks: ["Sociétés Industrielles (BRANIGER / SOLANI)", "Magasins Généraux", "Douanes de Niamey"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
  },

  // ==========================================
  // COMMUNE V (Rive Droite du Fleuve Niger)
  // ==========================================
  {
    id: "harobanda-nord-sud",
    name: "Harobanda (Harobanda Nord & Sud)",
    zone: "peripherie",
    zoneLabel: "Rive Droite du Fleuve Niger",
    commune: "Commune V (Rive Droite)",
    description: "Quartier principal de la rive droite, accessible par le Pont Kennedy et le Pont Chinois (Pont de l'Amitié).",
    landmarks: ["Sortie Pont Kennedy", "Rond-Point Harobanda", "Pharmacie Harobanda", "Avenue de l'Indépendance Rive Droite"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
    isPopular: true,
  },
  {
    id: "universite-uam",
    name: "Université Abdou Moumouni (Campus UAM)",
    zone: "peripherie",
    zoneLabel: "Rive Droite Universitaire",
    commune: "Commune V (Rive Droite)",
    description: "Campus universitaire central, facultés de sciences, lettres, droit et médecine, cités universitaires.",
    landmarks: ["Campus Universitaire UAM", "Rectorat UAM", "Hôpital National Lamordé", "FSS Faculté des Sciences de la Santé"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
    isPopular: true,
  },
  {
    id: "lamorde-hopital",
    name: "Lamordé & Hôpital National Lamordé",
    zone: "peripherie",
    zoneLabel: "Rive Droite Médicale",
    commune: "Commune V (Rive Droite)",
    description: "Quartier médical et résidentiel entourant le grand Centre Hospitalier Universitaire de Lamordé.",
    landmarks: ["Hôpital National Lamordé", "Écoles Professionnelles de Santé", "Carrefour Lamordé"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "25-35 min",
  },
  {
    id: "kirkissoye-karadje",
    name: "Kirkissoye & Karadjé",
    zone: "peripherie",
    zoneLabel: "Rive Droite",
    commune: "Commune V (Rive Droite)",
    description: "Quartiers résidentiels de la rive droite en expansion vers la route de Torodi.",
    landmarks: ["Sortie Pont de l'Amitié Sino-Nigérienne (2ème Pont)", "Marché Kirkissoye", "Route de Say"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "30-40 min",
  },
  {
    id: "nogare-bangabaye",
    name: "Nogaré / Bangabaye / Zarmagandey",
    zone: "peripherie",
    zoneLabel: "Rive Droite Lointaine",
    commune: "Commune V (Rive Droite)",
    description: "Quartiers calmes situés au sud de la rive droite en direction du fleuve amont.",
    landmarks: ["Axe Route de Say", "Rive Sud Fleuve Niger"],
    dayDeliveryFee: 1500,
    nightDeliveryFee: 2000,
    estimatedDeliveryTime: "35-45 min",
  },
];

/**
 * Helper function to determine if the given local hour triggers night rates (>= 21h00)
 */
export function isNiameyNightTime(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 21 || currentHour < 5;
}

/**
 * Calculates delivery fee based on district name/ID and night/service criteria
 */
export function calculateNiameyDeliveryFee(
  districtQuery: string,
  options?: {
    isNight?: boolean;
    serviceMode?: "delivery" | "takeaway" | "booking";
  }
): {
  fee: number;
  zone: "centre" | "peripherie" | "relais_gratuit";
  zoneLabel: string;
  matchedDistrict?: NiameyDistrict;
  isNightRate: boolean;
  timeEstimate: string;
} {
  const serviceMode = options?.serviceMode || "delivery";
  const isNight = options?.isNight !== undefined ? options.isNight : isNiameyNightTime();

  if (serviceMode === "takeaway") {
    return {
      fee: 0,
      zone: "relais_gratuit",
      zoneLabel: "Retrait Sur Place (0 FCFA)",
      isNightRate: isNight,
      timeEstimate: "10-15 min",
    };
  }

  const query = (districtQuery || "").toLowerCase().trim();

  if (
    query.includes("mosquée") ||
    query.includes("mosquee") ||
    query.includes("kadhafi") ||
    query.includes("khadafi") ||
    query.includes("relais")
  ) {
    const mosqueeDist = NIAMEY_DISTRICTS_DATA.find((d) => d.id === "grande-mosquee-kadhafi");
    return {
      fee: 0,
      zone: "relais_gratuit",
      zoneLabel: "🕌 Point Relais Grande Mosquée (Offert)",
      matchedDistrict: mosqueeDist,
      isNightRate: isNight,
      timeEstimate: "10-15 min",
    };
  }

  // Look for exact or fuzzy match in districts
  const matched = NIAMEY_DISTRICTS_DATA.find((d) => {
    const nameLower = d.name.toLowerCase();
    const idLower = d.id.toLowerCase();
    const landmarksMatch = d.landmarks.some((lm) => query.includes(lm.toLowerCase()));
    return query.includes(nameLower) || nameLower.includes(query) || query.includes(idLower) || landmarksMatch;
  });

  if (matched) {
    const fee = isNight ? matched.nightDeliveryFee : matched.dayDeliveryFee;
    return {
      fee,
      zone: matched.zone,
      zoneLabel: matched.zoneLabel,
      matchedDistrict: matched,
      isNightRate: isNight,
      timeEstimate: matched.estimatedDeliveryTime,
    };
  }

  // Fallback heuristic: check if peripherie keywords are present
  const peripherieKeywords = [
    "koira kano",
    "harobanda",
    "goudel",
    "wadata",
    "aeroport",
    "aéroport",
    "talladje",
    "talladjé",
    "saga",
    "banifandou",
    "dar-es-salam",
    "bobiel",
    "francophonie",
    "kirkissoye",
    "karadje",
    "karadjé",
    "lamorde",
    "lamordé",
    "uam",
    "université",
    "universite",
    "tondibia",
    "pays-bas",
    "tourakou",
  ];

  const isPeripherie = peripherieKeywords.some((k) => query.includes(k));

  if (isPeripherie) {
    return {
      fee: isNight ? 2000 : 1500,
      zone: "peripherie",
      zoneLabel: "Périphérie Niamey",
      isNightRate: isNight,
      timeEstimate: "25-35 min",
    };
  }

  // Default to Centre-ville
  return {
    fee: isNight ? 1500 : 1000,
    zone: "centre",
    zoneLabel: "Centre-ville Niamey",
    isNightRate: isNight,
    timeEstimate: "15-25 min",
  };
}

/**
 * Live search helper across all Niamey districts
 */
export function searchNiameyDistricts(searchTerm: string): NiameyDistrict[] {
  const clean = searchTerm.toLowerCase().trim();
  if (!clean) return NIAMEY_DISTRICTS_DATA;

  return NIAMEY_DISTRICTS_DATA.filter((d) => {
    const matchName = d.name.toLowerCase().includes(clean);
    const matchCommune = d.commune.toLowerCase().includes(clean);
    const matchZone = d.zoneLabel.toLowerCase().includes(clean);
    const matchLandmarks = d.landmarks.some((lm) => lm.toLowerCase().includes(clean));
    const matchDesc = d.description.toLowerCase().includes(clean);
    return matchName || matchCommune || matchZone || matchLandmarks || matchDesc;
  });
}
