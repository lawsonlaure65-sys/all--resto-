import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Google Gen AI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
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

// Fallback culinary recommendation generator for Niamey
function generateLocalAlloChefReply(message: string, district?: string, budget?: number): string {
  const lower = (message || "").toLowerCase();
  
  if (lower.includes("choukouya") || lower.includes("grillade") || lower.includes("mouton") || lower.includes("viande") || lower.includes("tchintchinga")) {
    return `Excellente idée ! Pour les meilleures grillades du Sahel à Niamey, je vous recommande vivement le **Demi-Mouton & Grillades du Sahel** chez *Le Khadafi Palace & Grillades* (Grande Mosquée / Plateau) à 15 000 FCFA pour partager, ou les brochettes **Tchintchinga & Poulet Braisé** (2 500 - 4 000 FCFA). Livraison express garantie en moins de 25 min par Billo Express !`;
  }

  if (lower.includes("dambou") || lower.includes("terroir") || lower.includes("tradition") || lower.includes("niger") || lower.includes("sahel")) {
    return `Pour un goût 100% authentique du Niger 🇳🇪, je vous suggère le **Dambou Royal au Poulet Fermier** chez *Saveurs du Niger & Dambou Express* (4 500 FCFA). Préparé selon la recette traditionnelle avec feuilles de moringa fraîches et piment doux du terroir. Un régal copieux très apprécié pour le déjeuner !`;
  }

  if (lower.includes("poisson") || lower.includes("capitaine") || lower.includes("fleuve") || lower.includes("braisé")) {
    return `Pour les amateurs de poisson frais, rien ne vaut le **Capitaine Braisé du Fleuve Niger** chez *Le Fleuve Gourmand & Capitaine Braisé* (5 500 FCFA). Servi avec alloco croustillant, attiéké frais et sauce tomate-oignon pimentée maison !`;
  }

  if (lower.includes("midi") || lower.includes("bureau") || lower.includes("ministère") || lower.includes("rapide") || lower.includes("groupe") || lower.includes("collègue")) {
    return `Pour le déjeuner au bureau à Niamey, nos formules express sont idéales : testez le **Menu Express Déjeuner Sahel** (3 500 FCFA avec boisson) ou la **Box Salariés & Ministères** livrée directement à votre bureau avec couverts biodégradables inclus !`;
  }

  if (lower.includes("burger") || lower.includes("pizza") || lower.includes("chawarma") || lower.includes("fast")) {
    return `Envie d'un plaisir street-food de qualité ? Le **Chawarma Mixte XXL** chez *Le Cèdre du Liban & Chawarma Palace* (3 500 FCFA) ou le **Burger Sahel Double Fromage** (4 000 FCFA) sont les favoris absolus de nos clients à Niamey !`;
  }

  if (budget && budget <= 3500) {
    return `Avec votre budget de ${budget.toLocaleString()} FCFA, je vous conseille le **Chawarma Royal** (2 500 FCFA) ou le **Riz au Gras Sahel & Poulet** (3 200 FCFA). Livraison économique en centre-ville à 1 000 FCFA !`;
  }

  return `Bonjour et bienvenue sur Allôresto Niamey 🇳🇪 ! En tant qu'AllôChef, je vous conseille aujourd'hui :
1. 🥩 **Grillades & Choukouya Royal** chez *Le Khadafi Palace* (Grande Mosquée)
2. 🍚 **Dambou Royal au Poulet** chez *Saveurs du Niger* (Plat traditionnel raffiné)
3. 🐟 **Capitaine Braisé du Fleuve** chez *Le Fleuve Gourmand* (5 500 FCFA)

Indiquez-moi votre budget, votre quartier à Niamey ou votre envie pour une recommandation sur mesure !`;
}

// API: AllôChef Culinary AI Assistant (Gemini 3.7 + Resilient Local Fallback)
app.post("/api/allochef", async (req, res) => {
  const { message, context, userPreferences, district, budget } = req.body;

  try {
    const ai = getGenAIClient();

    if (ai) {
      const systemInstruction = `Tu es "AllôChef", le sommelier et assistant culinaire digital d'Allôresto Niger 🇳🇪, plateforme de commande et livraison de repas à Niamey.
Restaurants partenaires phares :
1. Le Khadafi Palace & Grillades (Grande Mosquée Khadafi / Plateau) : Demi-Mouton, Choukouya, Tchintchinga, Poulet braisé (4 500 à 15 000 FCFA).
2. Saveurs du Niger & Dambou Express (Plateau) : Dambou Royal, Riz au gras, Sauce gombo (3 500 à 5 000 FCFA).
3. Le Fleuve Gourmand (Corniche de Niamey) : Capitaine braisé du Fleuve Niger, Alloco, Attiéké (5 500 FCFA).
4. Le Cèdre du Liban & Chawarma Palace (Yantala) : Chawarmas, Mezzés, Grillades mixtes (2 500 à 6 000 FCFA).
5. L'Atelier du Burger Sahel (Koira Kano) : Burgers artisanaux, Frites maison (3 500 à 5 000 FCFA).

Directives :
- Réponds en français avec convivialité, énergie et chaleur sahélienne.
- Mentionne les prix en FCFA (XOF).
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
