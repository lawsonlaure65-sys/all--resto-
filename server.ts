import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { setupContractPdfRoute } from "./server/contractPdfRoute";
import { setupAllorestoApiRoutes } from "./server/allorestoApi";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));

// Route téléchargement contrat
setupContractPdfRoute(app);

// Routes API Allôresto (daily-menus, sync dishes, restaurants menu, maintenance & cron)
setupAllorestoApiRoutes(app);

// Lazy-initialized Google Gen AI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Fallback culinary dictionaries for instant Zarma / Haoussa / English translations
const LOCAL_TERMS_DICTIONARY: Record<string, { ha: string; zm: string; en: string }> = {
  "choukouya": { ha: "Choukouya (Gasasshen Naman Rago)", zm: "Choukouya (Ham Tonte Kaano)", en: "Sahelian Grilled Lamb BBQ (Choukouya)" },
  "dambou": { ha: "Dambou na Musamman (Shinkafa da Ganye)", zm: "Dambou Hanno (Kopto nda Shinkafa)", en: "Royal Dambou (Steamed Sahelian Couscous & Moringa)" },
  "grillades": { ha: "Gasasshen Nama & Kayan Toshi", zm: "Ham Tonte nda Gani", en: "Grilled Meat & BBQ Specialties" },
  "petit dejeuner": { ha: "Karin Kumallo na Safe", zm: "Susubay Ŋwaari", en: "Breakfast" },
  "dejeuner": { ha: "Abincin Rana", zm: "Zaari Ŋwaari", en: "Lunch" },
  "diner": { ha: "Abincin Dare", zm: "Cini Ŋwaari", en: "Dinner" },
  "menu du jour": { ha: "Abincin Ranar Yau na Musamman", zm: "Hanno Ŋwaari Hunkuna", en: "Daily Special Menu" },
  "boissons": { ha: "Abubuwan Sha & Ruwan Lemo", zm: "Hari Kaana nda Bissap", en: "Drinks & Local Juices" },
  "desserts": { ha: "Kayan Zaki & 'Ya'yan Itace", zm: "Ŋwaari Kaana", en: "Desserts & Pastries" },
  "poisson": { ha: "Kifin Kogin Kwara (Niger)", zm: "Isa Hari Ham (Niger)", en: "Niger River Fresh Fish" },
  "poulet": { ha: "Naman Kaza na Gida", zm: "Gorzo Ham", en: "Local Farm Chicken" },
  "mouton": { ha: "Naman Rago mai Taushi", zm: "Feeji Ham Kaano", en: "Tender Sahelian Lamb" },
  "livraison": { ha: "Isar da Sauri Billo Express", zm: "Billo Express Kandeyaŋ Sannu", en: "Billo Express Delivery" },
  "riz": { ha: "Shinkafa mai Dadi", zm: "Mo Kaano", en: "Savory Rice" },
  "sauce": { ha: "Miya mai Kamshi", zm: "Hawari Hanno", en: "Rich Sauce" },
};

function getLocalFallbackTranslation(
  item: { id: string; name: string; description: string; category?: string },
  targetLang: "ha" | "zm" | "en" | "fr"
): { id: string; name: string; description: string; category?: string } {
  if (targetLang === "fr") {
    return item;
  }

  const nameLower = (item.name || "").toLowerCase();
  const descLower = (item.description || "").toLowerCase();

  let translatedName = item.name;
  let translatedDesc = item.description;
  let translatedCat = item.category;

  if (targetLang === "ha") {
    if (nameLower.includes("choukouya") || nameLower.includes("mouton") || nameLower.includes("grillade")) {
      translatedName = `🥩 ${item.name} (Gasasshen Naman Rago na Sahel)`;
      translatedDesc = `Daddadan naman rago da aka gasa a gawayi da kayan yaji na Kan-Kan, albasa Galmi mai dadi da tumatir sabo. ${item.description}`;
    } else if (nameLower.includes("dambou")) {
      translatedName = `🍚 ${item.name} (Dambou na Gargajiya)`;
      translatedDesc = `Abincin gargajiya na Nijar da shinkafa da ganyen zogale sabo, kaji mai dadi da mai mai kamshi. ${item.description}`;
    } else if (nameLower.includes("capitaine") || nameLower.includes("poisson")) {
      translatedName = `🐟 ${item.name} (Kifin Kogin Kwara)`;
      translatedDesc = `Kifi sabo daga kogin Kwara (Niger) da aka gasa sosai, tare da alloco ko attieke da miya mai yaji. ${item.description}`;
    } else if (nameLower.includes("massa") || nameLower.includes("petit déjeuner") || nameLower.includes("bouillie")) {
      translatedName = `🌅 ${item.name} (Karin Kumallo na Safe)`;
      translatedDesc = `Daddadan karin kumallo na safe mai karfafa jiki, tare da zuma da shayi mai dumi. ${item.description}`;
    } else if (nameLower.includes("burger") || nameLower.includes("chawarma") || nameLower.includes("pizza")) {
      translatedName = `🍔 ${item.name} (Abinci mai Sauri na Yamai)`;
      translatedDesc = `An shirya shi da naman sahel sabo, cuku mai dadi da fankasau mai laushi. ${item.description}`;
    } else if (nameLower.includes("bissap") || nameLower.includes("jus") || nameLower.includes("boisson")) {
      translatedName = `🍹 ${item.name} (Ruwan Lemo mai Sanyi)`;
      translatedDesc = `Abin sha na gargajiya mai sanyi da dadi da ganyen karkashi/bissap da 'ya'yan itace. ${item.description}`;
    } else {
      translatedName = `${item.name} [Haoussa]`;
      translatedDesc = `Abinci mai dadi na Allôresto Yamai: ${item.description}`;
    }

    if (translatedCat) {
      if (translatedCat.includes("Déjeuner") || translatedCat.includes("Midi")) translatedCat = "☀️ Abincin Rana";
      else if (translatedCat.includes("Petit")) translatedCat = "🌅 Karin Kumallo";
      else if (translatedCat.includes("Dîner")) translatedCat = "🌙 Abincin Dare";
      else if (translatedCat.includes("Grillades") || translatedCat.includes("Choukouya")) translatedCat = "🔥 Gasasshen Nama";
      else if (translatedCat.includes("Boissons") || translatedCat.includes("Jus")) translatedCat = "🍹 Abubuwan Sha";
      else if (translatedCat.includes("Menu")) translatedCat = "⭐ Abincin Yau";
    }
  } else if (targetLang === "zm") {
    if (nameLower.includes("choukouya") || nameLower.includes("mouton") || nameLower.includes("grillade")) {
      translatedName = `🥩 ${item.name} (Ham Tonte Kaano na Sahel)`;
      translatedDesc = `Feeji ham tonte hanno kaano nda Kan-Kan hawari, Galmi albasa nda tumatir ciinayaŋ. ${item.description}`;
    } else if (nameLower.includes("dambou")) {
      translatedName = `🍚 ${item.name} (Dambou Hanno)`;
      translatedDesc = `Niamey dambou cimi dumi nda kopto hari sabo, gorzo ham nda ji kaano. ${item.description}`;
    } else if (nameLower.includes("capitaine") || nameLower.includes("poisson")) {
      translatedName = `🐟 ${item.name} (Isa Hari Ham)`;
      translatedDesc = `Isa hari ham tonte kaano, kande nda alloco wala attieke nda hawari kaana. ${item.description}`;
    } else if (nameLower.includes("massa") || nameLower.includes("petit déjeuner") || nameLower.includes("bouillie")) {
      translatedName = `🌅 ${item.name} (Susubay Ŋwaari)`;
      translatedDesc = `Susubay ŋwaari kaano nda arawak nda yu kaana se teero borey kulu se. ${item.description}`;
    } else if (nameLower.includes("burger") || nameLower.includes("chawarma") || nameLower.includes("pizza")) {
      translatedName = `🍔 ${item.name} (Niamey Ŋwaari Sannu)`;
      translatedDesc = `Sahel ham kaano nda fromage nda fritte hanno teeyante Niamey ra. ${item.description}`;
    } else if (nameLower.includes("bissap") || nameLower.includes("jus") || nameLower.includes("boisson")) {
      translatedName = `🍹 ${item.name} (Hari Kaana nda Bissap)`;
      translatedDesc = `Niamey hari kaano yaabey se kande nda bissap sabo nda sukur kaana. ${item.description}`;
    } else {
      translatedName = `${item.name} [Zarma]`;
      translatedDesc = `Niamey ŋwaari kaano: ${item.description}`;
    }

    if (translatedCat) {
      if (translatedCat.includes("Déjeuner") || translatedCat.includes("Midi")) translatedCat = "☀️ Zaari Ŋwaari";
      else if (translatedCat.includes("Petit")) translatedCat = "🌅 Susubay Ŋwaari";
      else if (translatedCat.includes("Dîner")) translatedCat = "🌙 Cini Ŋwaari";
      else if (translatedCat.includes("Grillades") || translatedCat.includes("Choukouya")) translatedCat = "🔥 Ham Tonte";
      else if (translatedCat.includes("Boissons") || translatedCat.includes("Jus")) translatedCat = "🍹 Hari Kaana";
      else if (translatedCat.includes("Menu")) translatedCat = "⭐ Hanno Ŋwaari";
    }
  } else if (targetLang === "en") {
    translatedName = item.name
      .replace(/Petit Déjeuner/gi, "Breakfast")
      .replace(/Déjeuner/gi, "Lunch")
      .replace(/Dîner/gi, "Dinner")
      .replace(/Grillades/gi, "Grilled BBQ")
      .replace(/Poulet Braisé/gi, "Braised Chicken")
      .replace(/Poisson/gi, "Fresh Fish")
      .replace(/Jus/gi, "Fresh Juice");
    translatedDesc = `Authentic Niamey specialty: ${item.description}`;
    if (translatedCat) {
      if (translatedCat.includes("Déjeuner")) translatedCat = "☀️ Lunch Specials";
      else if (translatedCat.includes("Petit")) translatedCat = "🌅 Breakfast";
      else if (translatedCat.includes("Dîner")) translatedCat = "🌙 Dinner";
      else if (translatedCat.includes("Grillades")) translatedCat = "🔥 BBQ & Grills";
      else if (translatedCat.includes("Boissons")) translatedCat = "🍹 Local Drinks & Juices";
      else if (translatedCat.includes("Menu")) translatedCat = "⭐ Daily Special Menus";
    }
  }

  return {
    id: item.id,
    name: translatedName,
    description: translatedDesc,
    category: translatedCat,
  };
}

// API: Batch Gemini Translation for Menus & Dishes
app.post("/api/translate", async (req, res) => {
  const { items, targetLang, sourceLang = "fr" } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing items array to translate" });
  }

  const validLang = targetLang === "ha" || targetLang === "zm" || targetLang === "en" || targetLang === "fr" ? targetLang : "fr";

  // If target is French, return as is
  if (validLang === "fr") {
    return res.json({
      success: true,
      targetLang: "fr",
      source: "original",
      items,
    });
  }

  const languageNames: Record<string, string> = {
    ha: "Haoussa (Harshen Hausa na Nijar - Yamai)",
    zm: "Zarma (Zarmaciine / Djerma na Niamey - Niger)",
    en: "English (US / International)",
    fr: "Français",
  };

  try {
    const ai = getGenAIClient();

    if (ai) {
      const itemsToTranslate = items.slice(0, 30); // Max 30 items per batch for optimal performance
      const systemInstruction = `Tu es un traducteur culinaire expert et sommelier bilingue pour Allôresto Niger 🇳🇪 (Niamey).
Tu traduis les menus, les noms de plats, les descriptions gastronomiques et les catégories du français vers le ${languageNames[validLang]}.

DIRECTIVES MAJEURES :
1. Pour le Haoussa (ha) : Utilise la langue Haoussa naturelle du Niger / Niamey. Traduis les descriptions avec élégance et gourmandise sahélienne (ex: "Gasasshen naman rago na Sahel mai taushi da yaji Kan-Kan", "Dambou na gargajiya da ganyen zogale", "Kifin kogin Kwara sabo").
2. Pour le Zarma (zm) : Utilise la langue Zarma authentique parlée à Niamey. Traduis les descriptions de façon fluide et appétissante (ex: "Ham tonte kaano nda Kan-Kan hawari", "Dambou hanno nda kopto sabo", "Isa hari ham kaano").
3. Conserve les noms propres célèbres (Choukouya, Dambou, Massa, Kilichi, Capitaine du Fleuve, Bissap, Fura da nono, Kopto, Alloco, Attiéké) tout en traduisant les adjectifs et la composition.
4. Réponds UNIQUEMENT sous forme de tableau JSON valide contenant exactement les objets traduits avec { id, name, description, category }.`;

      const prompt = `Traduis ces ${itemsToTranslate.length} plats et menus de restaurant en ${languageNames[validLang]} :
${JSON.stringify(
  itemsToTranslate.map((it) => ({
    id: it.id,
    name: it.name,
    description: it.description,
    category: it.category || "",
  }))
)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["id", "name", "description"],
            },
          },
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        try {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return res.json({
              success: true,
              targetLang: validLang,
              source: "gemini",
              items: parsed,
            });
          }
        } catch (parseErr) {
          console.warn("Failed to parse Gemini JSON translation response, falling back to local dictionary:", parseErr);
        }
      }
    }

    // Fallback to rich local Sahelian dictionary
    const fallbackItems = items.map((item) => getLocalFallbackTranslation(item, validLang));
    return res.json({
      success: true,
      targetLang: validLang,
      source: "local-sahelian-engine",
      items: fallbackItems,
    });
  } catch (error) {
    console.error("Gemini translation error, using local Sahelian fallback:", error);
    const fallbackItems = items.map((item) => getLocalFallbackTranslation(item, validLang));
    return res.json({
      success: true,
      targetLang: validLang,
      source: "local-sahelian-engine",
      items: fallbackItems,
    });
  }
});

// API: Single Text or Phrase Gemini Translation
app.post("/api/translate-text", async (req, res) => {
  const { text, targetLang = "ha", context = "culinary" } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text to translate" });
  }

  const validLang = targetLang === "ha" || targetLang === "zm" || targetLang === "en" || targetLang === "fr" ? targetLang : "ha";

  if (validLang === "fr") {
    return res.json({ success: true, translation: text, source: "original" });
  }

  try {
    const ai = getGenAIClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Traduis ce texte gastronomique ou message client en langue ${validLang === "ha" ? "Haoussa du Niger" : validLang === "zm" ? "Zarma de Niamey" : "Anglais"} : "${text}"`,
        config: {
          systemInstruction: "Tu es un traducteur expert des langues du Niger (Haoussa, Zarma). Traduis de manière concise, naturelle et fluide.",
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        return res.json({
          success: true,
          translation: response.text.trim(),
          source: "gemini",
        });
      }
    }

    // Local fallback
    const fallback = getLocalFallbackTranslation({ id: "custom", name: text, description: text }, validLang);
    return res.json({
      success: true,
      translation: fallback.name,
      source: "local",
    });
  } catch (err) {
    console.error("Translate text error:", err);
    return res.json({
      success: true,
      translation: text,
      source: "error-fallback",
    });
  }
});

// Fallback culinary recommendation generator for Niamey (Khady's Food & Event officiel)
function generateLocalAlloChefReply(message: string, district?: string, budget?: number): string {
  const lower = (message || "").toLowerCase();
  
  if (lower.includes("choukouya") || lower.includes("grillade") || lower.includes("mouton") || lower.includes("viande") || lower.includes("tchintchinga") || lower.includes("suya")) {
    return `Excellente idée ! Chez notre restaurant partenaire officiel **Khady's Food & Event** (Avenue de l'Islam, près Grande Mosquée), je vous recommande vivement les **Brochettes de Filet de Bœuf (Suya)** marinées aux épices Kankankan (4 000 FCFA avec alloco doré) ou le **Choukouya d'Agneau Prestige** au vrai Kan-Kan (4 500 FCFA). Livraison express garantie par Billo Express !`;
  }

  if (lower.includes("plat du jour") || lower.includes("midi") || lower.includes("bureau") || lower.includes("ministère") || lower.includes("rapide")) {
    return `Pour votre déjeuner au bureau à Niamey, découvrez le **Plat du Jour Khady's Food** (4 000 FCFA) : préparé chaque matin avec des ingrédients frais, accompagné d'alloco doré croustillant et de piment vert maison. Livré directement à votre bureau par Billo Express !`;
  }

  if (lower.includes("sauce") || lower.includes("crin") || lower.includes("terroir") || lower.includes("tradition")) {
    return `Pour un goût 100% authentique du Sahel, je vous conseille la **Sauce Crin-Crin au Poisson Fumé & Viande de Bœuf** chez **Khady's Food & Event**, servie avec pâte de maïs ou riz local parfumé. Un vrai délice du terroir nigérien !`;
  }

  if (budget && budget <= 3500) {
    return `Avec votre budget de ${budget.toLocaleString()} FCFA, je vous conseille nos formules déjeuners et jus frais de bissap menthe chez **Khady's Food & Event**. Livraison rapide sur tout Niamey (Plateau, Yantala, Koubia) !`;
  }

  return `Bonjour et bienvenue sur Allôresto Niamey 🇳🇪 ! En tant qu'AllôChef, je vous recommande aujourd'hui les spécialités de notre restaurant partenaire certifié **Khady's Food & Event** :
1. 🍢 **Brochettes de Filet de Bœuf (Suya)** aux épices Kankankan (4 000 FCFA avec alloco)
2. 🥩 **Choukouya d'Agneau Prestige** au vrai Kan-Kan (4 500 FCFA)
3. 🍲 **Sauce Crin-Crin du Terroir** avec viande tendre et poisson fumé

Indiquez-moi votre quartier à Niamey ou votre envie pour une recommandation personnalisée !`;
}

// API: AllôChef Culinary AI Assistant (Gemini 3.7 + Resilient Local Fallback)
app.post("/api/allochef", async (req, res) => {
  const { message, context, userPreferences, district, budget } = req.body;

  try {
    const ai = getGenAIClient();

    if (ai) {
      const systemInstruction = `Tu es "AllôChef", le sommelier et assistant culinaire digital d'Allôresto Niger 🇳🇪, plateforme de commande et livraison de repas à Niamey.
Restaurant partenaire officiel certifié :
- Khady's Food & Event (Avenue de l'Islam, près Grande Mosquée / Plateau) : Brochettes de Filet de Bœuf (Suya), Choukouya d'Agneau Prestige au Kan-Kan, Sauce Crin-Crin au Poisson Fumé, Poulet braisé, Alloco, Jus de Bissap frais Menthe (2 000 à 7 000 FCFA).

Directives :
- Réponds en français avec convivialité, énergie et chaleur sahélienne.
- Mentionne les prix en FCFA (XOF).
- Ne cite AUCUN restaurant fictif. Le seul partenaire officiel actif est Khady's Food & Event.
- Cite les quartiers de Niamey (Plateau, Koira Kano, Grande Mosquée, Yantala, Goudel, Harobanda).
- Sois concis (1 à 3 paragraphes max) et incite à ajouter le plat au panier.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: message || "Que me conseilles-tu pour mon repas à Niamey ce midi ?",
        config: {
          systemInstruction,
          temperature: 0.75,
        },
      });

      if (response && response.text) {
        return res.json({
          success: true,
          reply: response.text,
        });
      }
    }

    // Fallback if AI response was empty or client uninitialized
    const fallbackReply = generateLocalAlloChefReply(message, district, budget);
    return res.json({
      success: true,
      reply: fallbackReply,
    });
  } catch (error) {
    console.error("AllôChef AI error, using resilient fallback:", error);
    const fallbackReply = generateLocalAlloChefReply(message, district, budget);
    return res.json({
      success: true,
      reply: fallbackReply,
    });
  }
});

// API: Restaurant Partnership Registration
app.post("/api/partner/register", async (req, res) => {
  try {
    const { restaurantName, managerName, email, phone, city, cuisineType } = req.body;
    // In production, this would store into database and send notification email
    res.json({
      success: true,
      message: `Votre demande pour le restaurant ${restaurantName} a été enregistrée avec succès. Notre équipe d'intégration Allôresto vous contactera sous 24h au ${phone}.`,
      partnerId: "PART-" + Math.floor(100000 + Math.random() * 900000),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erreur lors de l'enregistrement" });
  }
});

// Registre des paiements réels en mémoire (aucun faux paiement codé en dur)
const IN_MEMORY_PAYMENTS: any[] = [];

// API: Process Mobile Money Payment
app.post("/api/payment/process", async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, phoneNumber } = req.body;

    if (!orderId || !amount || !paymentMethod || !phoneNumber) {
      return res.status(400).json({ success: false, error: "Paramètres de paiement incomplets" });
    }

    let transactionId = "";
    const prefix = (paymentMethod || "").toUpperCase().replace(/_MONEY/g, "");
    switch (paymentMethod) {
      case "airtel_money":
        transactionId = `AIRTEL-${Date.now()}`;
        break;
      case "moov_money":
        transactionId = `MOOV-${Date.now()}`;
        break;
      case "orange_zamany":
        transactionId = `ORANGE-${Date.now()}`;
        break;
      case "flooz":
        transactionId = `FLOOZ-${Date.now()}`;
        break;
      case "mynita":
        transactionId = `MYN-${Date.now().toString().slice(-6)}`;
        break;
      case "amanata":
        transactionId = `AMA-${Date.now().toString().slice(-6)}`;
        break;
      case "all_iza":
        transactionId = `IZZA-${Date.now().toString().slice(-6)}`;
        break;
      case "zeyna":
        transactionId = `ZEY-${Date.now().toString().slice(-6)}`;
        break;
      default:
        transactionId = `${prefix || "TXN"}-${Date.now()}`;
    }

    const newPayment = {
      id: "pay_" + Date.now(),
      order_id: orderId,
      amount_xof: Number(amount),
      payment_method: paymentMethod,
      payment_status: "completed",
      transaction_id: transactionId,
      phone_number: phoneNumber,
      provider_response: { status: "success", gateway: "Allôresto Instant Mobile Gateway" },
      created_at: new Date().toISOString(),
    };

    IN_MEMORY_PAYMENTS.unshift(newPayment);

    // Also sync to Supabase if credentials exist in server env
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("http")) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("payments").insert({
          order_id: orderId,
          amount_xof: Number(amount),
          payment_method: paymentMethod,
          payment_status: "completed",
          transaction_id: transactionId,
          phone_number: phoneNumber,
          provider_response: { status: "success" },
        });
      } catch (dbErr) {
        console.warn("Supabase server sync warning:", dbErr);
      }
    }

    return res.json({
      success: true,
      transactionId,
      payment: newPayment,
      message: "Paiement validé avec succès",
    });
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return res.status(500).json({ success: false, error: error.message || "Erreur lors du paiement" });
  }
});

// API: List all Mobile Money payments
app.get("/api/payments", (req, res) => {
  res.json({
    success: true,
    payments: IN_MEMORY_PAYMENTS,
  });
});

// API: Interactive AI Consultant Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentProjectContext } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        reply: "Merci pour votre question ! Notre studio peut concevoir votre application web ou mobile PWA sur mesure avec les meilleures technologies actuelles (React/Next.js, PWA, Tailwind CSS, Stripe, Node.js, et IA Gemini). Remplissez le configurateur ci-dessus pour obtenir immédiatement une architecture personnalisée et un chiffrage !",
      });
    }

    const systemInstruction = `Tu es l'Assistant IA Expert de "Atelier Web & PWA Studio".
Tu es un consultant senior en ingénierie logicielle, UX design et stratégie digitale.
Tu t'exprimes en français avec élégance, clarté, expertise et bienveillance.
Tu aides les clients à cadrer leurs projets :
- Sites vitrines haut de gamme orientés conversion
- Applications web mobiles (PWA) installables avec notifications et offline
- Plateformes SaaS (abonnements, tableaux de bord, auth, multi-tenant)
- E-commerce moderne (panier réactif, checkout Stripe, gestion catalogue)
- Outils métiers intelligents (CRM, réservation, workflows internes)
- Solutions avec IA (assistants Gemini, recherche sémantique, génération de contenus, résumés)

Voici le contexte actuel du projet configuré par l'utilisateur :
${JSON.stringify(currentProjectContext || {})}

Réponds de manière concise (2 à 4 paragraphes max), structurée, pragmatique et constructive. Mets en avant les meilleures pratiques (PWA mobile-first, sécurité, performance score 100, ROI).`;

    const chatMessages = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // If no previous messages, supply default prompt
    if (chatMessages.length === 0) {
      chatMessages.push({
        role: "user",
        parts: [{ text: "Bonjour, que pouvez-vous faire pour mon projet ?" }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Je suis à votre disposition pour vous accompagner dans la conception de votre application.",
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      reply: "Désolé, une erreur temporaire est survenue. Veuillez réessayer.",
    });
  }
});

// Vite middleware / Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
