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
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: AllôChef Culinary AI Assistant (Gemini 3.7)
app.post("/api/allochef", async (req, res) => {
  try {
    const { message, context, userPreferences } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        reply: "Voici mes recommandations personnalisées sur Allôresto Niamey 🇳🇪 ! Selon vos envies du moment, je vous suggère de tester le **Demi-Mouton & Grillades du Sahel** chez *Le Khadafi Palace & Grillades* (situé à la Grande Mosquée, livraison express au Plateau) ou le **Dambou Royal au Poulet** chez *Saveurs du Niger & Dambou Express* (4 500 FCFA, noté 4.9/5). Souhaitez-vous que je les ajoute directement à votre panier ?",
        suggestedItems: ["Demi-Mouton & Grillades du Sahel", "Dambou Royal au Poulet"],
      });
    }

    const systemInstruction = `Tu es "AllôChef", l'assistant culinaire et sommelier digital d'Allôresto Niger 🇳🇪, la plateforme n°1 de commande et livraison de repas à Niamey.
Ton rôle :
- Aider l'utilisateur à choisir le repas parfait selon ses envies, budget en FCFA, quartier de livraison à Niamey (Plateau, Grande Mosquée Khadafi, Yantala, Koira Kano, Goudel, Gamkallé, Haro Banda, Terminus, etc.).
- Proposer des restaurants et plats adaptés parmi la sélection Allôresto Niamey (Grillades du Sahel, Dambou traditionnel, Poulet braisé, Chawarmas, Burgers gourmets, Riz au gras, Pâtisserie du Fleuve).
- Adapter pour les fonctionnaires, ministères et bureaux (repas rapides, formules midi, menus pour groupes/réunions).
- Être chaleureux, enthousiaste, appétissant et concis (1 à 3 paragraphes maximum).
- Indiquer les prix en FCFA (ex: 2 500 FCFA, 5 000 FCFA).
- Terminer par une suggestion concrète invitant à commander avec livraison ou retrait.

Contexte utilisateur : ${JSON.stringify(userPreferences || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message || "Que me conseilles-tu de bon à manger ce midi ?",
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({
      success: true,
      reply: response.text || "Je vous recommande de parcourir notre sélection de plats du jour !",
    });
  } catch (error) {
    console.error("AllôChef error:", error);
    res.status(500).json({
      success: false,
      reply: "Désolé, AllôChef a rencontré un petit souci en cuisine. N'hésitez pas à parcourir directement les restaurants à proximité !",
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
