import express, { Request, Response } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import cron from "node-cron";
import { RESTAURANTS_DATA } from "../src/data/allorestoData";

// Helper: normalize dish names to detect permanent specialties (attiéké, doukounou)
export function isPermanentDishName(name?: string): boolean {
  if (!name) return false;
  const norm = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return norm.includes("attieke") || norm.includes("doukounou");
}

// Helper: Get Supabase client server-side (from env or custom headers)
export function getServerSupabaseClient(req?: Request): SupabaseClient | null {
  const url =
    (req?.headers["x-supabase-url"] as string) ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const key =
    (req?.headers["x-supabase-key"] as string) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) return null;

  try {
    const cleanUrl = url.trim().replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "");
    return createClient(cleanUrl, key.trim(), {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn("[Backend Supabase] Échec initialisation client:", err);
    return null;
  }
}

// In-memory maintenance report
interface MaintenanceReport {
  lastRunAt: string | null;
  status: "idle" | "success" | "error";
  cleanedDailyMenusCount: number;
  dishesCheckedCount: number;
  inconsistenciesFound: string[];
  message: string;
}

let latestMaintenanceReport: MaintenanceReport = {
  lastRunAt: null,
  status: "idle",
  cleanedDailyMenusCount: 0,
  dishesCheckedCount: 0,
  inconsistenciesFound: [],
  message: "Aucune tâche de maintenance exécutée pour le moment.",
};

// Core maintenance logic (can be triggered by cron or on-demand API)
export async function executeMaintenanceTasks(): Promise<MaintenanceReport> {
  const startedAt = new Date().toISOString();
  console.log(`[Maintenance Allôresto] Début de la routine nocturne à ${startedAt}`);

  const report: MaintenanceReport = {
    lastRunAt: startedAt,
    status: "success",
    cleanedDailyMenusCount: 0,
    dishesCheckedCount: 0,
    inconsistenciesFound: [],
    message: "Maintenance effectuée avec succès.",
  };

  const client = getServerSupabaseClient();
  if (!client) {
    report.status = "idle";
    report.message = "Supabase non configuré côté serveur; vérification locale uniquement.";
    latestMaintenanceReport = report;
    return report;
  }

  try {
    // 1. Nettoyer les anciens daily_menus > 30 jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateLimit = thirtyDaysAgo.toISOString().slice(0, 10);

    const { data: deleted, error: deleteErr } = await client
      .from("daily_menus")
      .delete()
      .lt("menu_date", dateLimit)
      .select("id");

    if (deleteErr) {
      console.warn("[Maintenance] Nettoyage daily_menus:", deleteErr.message);
      report.inconsistenciesFound.push(`Nettoyage daily_menus: ${deleteErr.message}`);
    } else {
      report.cleanedDailyMenusCount = deleted ? deleted.length : 0;
    }

    // 2. Vérifier la cohérence des plats (prix négatifs ou nuls, noms vides, disponibilité)
    const { data: dishes, error: dishesErr } = await client
      .from("dishes")
      .select("id, name, price, is_available, restaurant_id");

    if (dishesErr) {
      console.warn("[Maintenance] Audit plats:", dishesErr.message);
      report.inconsistenciesFound.push(`Audit plats: ${dishesErr.message}`);
    } else if (dishes) {
      report.dishesCheckedCount = dishes.length;
      for (const d of dishes) {
        if (!d.name || d.name.trim() === "") {
          report.inconsistenciesFound.push(`Plat ID ${d.id}: Nom manquant ou vide`);
        }
        if (typeof d.price !== "number" || d.price <= 0) {
          report.inconsistenciesFound.push(`Plat "${d.name}" (${d.id}): Prix anormal (${d.price})`);
        }
        // Détecter si une spécialité permanente a été marquée par erreur comme plat du jour en base
        if (isPermanentDishName(d.name) && (d as any).is_daily_special) {
          report.inconsistenciesFound.push(`Plat "${d.name}": Spécialité permanente marquée plat du jour. Correction automatique.`);
          await client.from("dishes").update({ is_daily_special: false, is_menu_du_jour: false }).eq("id", d.id);
        }
      }
    }

    report.message = `Routine terminée: ${report.cleanedDailyMenusCount} menus archivés nettoyés, ${report.dishesCheckedCount} plats audités.`;
    console.log(`[Maintenance Allôresto] ${report.message}`);
  } catch (err: any) {
    report.status = "error";
    report.message = `Erreur durant la maintenance: ${err?.message || err}`;
    console.error("[Maintenance Allôresto] Erreur:", err);
  }

  latestMaintenanceReport = report;
  return report;
}

// Setup Allôresto Express API Routes & Nightly Cron
export function setupAllorestoApiRoutes(app: express.Express) {
  /**
   * GET /api/daily-menus?date=YYYY-MM-DD&restaurantId=...
   * Lit daily_menus et renvoie le plat du jour (ou null)
   */
  app.get("/api/daily-menus", async (req: Request, res: Response) => {
    try {
      const targetDate = (req.query.date as string) || new Date().toISOString().slice(0, 10);
      const restaurantId = req.query.restaurantId as string | undefined;

      const client = getServerSupabaseClient(req);
      if (!client) {
        return res.json({
          success: true,
          source: "offline_fallback",
          date: targetDate,
          data: null,
          message: "Supabase non configuré côté serveur.",
        });
      }

      let query = client
        .from("daily_menus")
        .select("*")
        .eq("menu_date", targetDate)
        .order("created_at", { ascending: false });

      if (restaurantId) {
        query = query.eq("restaurant_id", restaurantId);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error) {
        console.warn("[GET /api/daily-menus] Supabase warning/error:", error.message);
        return res.json({
          success: true,
          date: targetDate,
          data: null,
          message: "Plat du jour bientôt disponible.",
          notice: error.message,
        });
      }

      if (!data) {
        return res.json({
          success: true,
          date: targetDate,
          data: null,
          message: "Aucun plat du jour publié pour cette date.",
        });
      }

      const dishName = data.dish_name || data.title || "";
      // Protection anti-spécialité permanente (ne jamais renvoyer attiéké/doukounou en plat du jour)
      if (isPermanentDishName(dishName)) {
        return res.json({
          success: true,
          date: targetDate,
          data: null,
          message: "Spécialité permanente ignorée pour le plat du jour.",
        });
      }

      return res.json({
        success: true,
        date: targetDate,
        data: {
          id: data.id,
          restaurantId: data.restaurant_id,
          menuDate: data.menu_date,
          dishName: data.dish_name || data.title,
          description: data.description || "",
          price: Number(data.price_xof || data.price_fcfa || data.price || 4000),
          imageUrl: data.image_url || data.photo_url || null,
          accompaniments: data.accompaniments || null,
          availablePortions: data.available_portions || 25,
          createdAt: data.created_at,
        },
      });
    } catch (err: any) {
      console.error("[GET /api/daily-menus] Exception:", err);
      return res.status(500).json({ success: false, error: err?.message || "Erreur interne serveur" });
    }
  });

  /**
   * POST /api/daily-menus
   * Crée ou met à jour un plat du jour (avec upsert), en validant que ce n'est pas une spécialité permanente
   */
  app.post("/api/daily-menus", async (req: Request, res: Response) => {
    try {
      const {
        restaurant_id = "resto-khadys-food",
        menu_date = new Date().toISOString().slice(0, 10),
        dish_name,
        title,
        description,
        price_xof,
        price,
        image_url,
        accompaniments,
        available_portions,
      } = req.body;

      const effectiveName = dish_name || title;
      if (!effectiveName || typeof effectiveName !== "string") {
        return res.status(400).json({
          success: false,
          error: "Le nom du plat (dish_name ou title) est obligatoire.",
        });
      }

      // VALIDATION CRITIQUE : Bloquer explicitement toute spécialité permanente (attiéké/doukounou)
      if (isPermanentDishName(effectiveName)) {
        return res.status(400).json({
          success: false,
          error: "Refusé : Les spécialités permanentes (Attiéké, Doukounou) ne peuvent pas être publiées comme Plat du Jour.",
        });
      }

      const client = getServerSupabaseClient(req);
      if (!client) {
        return res.status(503).json({
          success: false,
          error: "Supabase n'est pas configuré. Veuillez vérifier vos identifiants.",
        });
      }

      const effectivePrice = Number(price_xof || price || 4000);

      // Upsert du menu du jour
      const payload: any = {
        restaurant_id,
        menu_date,
        dish_name: effectiveName,
        title: effectiveName,
        description: description || null,
        price_xof: effectivePrice,
        price: effectivePrice,
        image_url: image_url || null,
        accompaniments: accompaniments || null,
        available_portions: Number(available_portions || 25),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from("daily_menus")
        .upsert(payload, { onConflict: "restaurant_id, menu_date" })
        .select()
        .maybeSingle();

      if (error) {
        console.warn("[POST /api/daily-menus] Erreur upsert:", error.message);
        // Tentative alternative sans onConflict explicite
        const retryRes = await client.from("daily_menus").upsert(payload).select().maybeSingle();
        if (retryRes.error) {
          return res.status(500).json({ success: false, error: retryRes.error.message });
        }
      }

      return res.json({
        success: true,
        message: `Plat du jour "${effectiveName}" enregistré avec succès pour le ${menu_date}.`,
        data: data || payload,
      });
    } catch (err: any) {
      console.error("[POST /api/daily-menus] Exception:", err);
      return res.status(500).json({ success: false, error: err?.message || "Erreur interne serveur" });
    }
  });

  /**
   * GET /api/restaurants/:id/menu
   * Renvoie le menu complet d'un restaurant (avec filtres : category, available)
   */
  app.get("/api/restaurants/:id/menu", async (req: Request, res: Response) => {
    try {
      const restaurantId = req.params.id;
      const categoryFilter = req.query.category as string | undefined;
      const availableOnly = req.query.available === "true";

      const client = getServerSupabaseClient(req);
      let dishesData: any[] | null = null;

      if (client) {
        let query = client
          .from("dishes")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("name", { ascending: true });

        if (categoryFilter) {
          query = query.eq("category", categoryFilter);
        }
        if (availableOnly) {
          query = query.eq("is_available", true);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          dishesData = data;
        }
      }

      // Repli sur le catalogue local si Supabase n'a pas de plats pour ce restaurant
      if (!dishesData || dishesData.length === 0) {
        const localResto =
          RESTAURANTS_DATA.find((r) => r.id === restaurantId) ||
          (restaurantId.includes("khady") ? RESTAURANTS_DATA[0] : undefined);

        if (localResto) {
          let filtered = localResto.menu;
          if (categoryFilter) {
            filtered = filtered.filter((m) => m.category === categoryFilter);
          }
          if (availableOnly) {
            filtered = filtered.filter((m) => m.isAvailable !== false);
          }
          dishesData = filtered.map((m) => ({
            id: m.id,
            restaurant_id: localResto.id,
            name: m.name,
            description: m.description || "",
            price: m.price,
            category: m.category,
            image: m.image,
            image_url: m.image,
            is_available: m.isAvailable !== false,
            is_daily_special: Boolean(m.isDailySpecial),
            is_menu_du_jour: Boolean(m.isMenuDuJour),
          }));
        }
      }

      // Deduplicate dishes by ID
      const seen = new Set<string>();
      const menu = (dishesData || []).filter((d: any) => {
        if (!d || !d.id || seen.has(d.id)) return false;
        seen.add(d.id);
        return true;
      });

      return res.json({
        success: true,
        restaurantId,
        source: client && dishesData && dishesData.length > 0 ? "supabase" : "local_catalog",
        count: menu.length,
        data: menu,
      });
    } catch (err: any) {
      console.error("[GET /api/restaurants/:id/menu] Exception:", err);
      return res.status(500).json({ success: false, error: err?.message || "Erreur interne serveur" });
    }
  });

  /**
   * POST /api/sync/dishes
   * Reçoit un lot de plats et fait un upsert massif dans dishes
   */
  app.post("/api/sync/dishes", async (req: Request, res: Response) => {
    try {
      const { restaurant_id = "resto-khadys-food", dishes } = req.body;

      if (!Array.isArray(dishes) || dishes.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Le paramètre 'dishes' doit être un tableau non vide.",
        });
      }

      const client = getServerSupabaseClient(req);
      if (!client) {
        return res.status(503).json({
          success: false,
          error: "Supabase non configuré.",
        });
      }

      // S'assurer que le restaurant existe sans banner_image
      await client
        .from("restaurants")
        .upsert({ id: restaurant_id, name: "Restaurant Allôresto" }, { onConflict: "id" });

      // Normalisation des colonnes de plats
      const cleanRows = dishes.map((dish: any) => {
        const isPerm = isPermanentDishName(dish.name);
        return {
          id: dish.id,
          restaurant_id: dish.restaurant_id || restaurant_id,
          name: dish.name,
          description: dish.description || null,
          price: Number(dish.price || 0),
          category: dish.category || "africain",
          image_url: dish.image || dish.image_url || null,
          image: dish.image || dish.image_url || null,
          is_available: dish.isAvailable !== false && dish.is_available !== false,
          // Spécialités permanentes jamais en plat du jour
          is_daily_special: isPerm ? false : Boolean(dish.isDailySpecial || dish.is_daily_special),
          is_menu_du_jour: isPerm ? false : Boolean(dish.isMenuDuJour || dish.is_menu_du_jour),
          updated_at: new Date().toISOString(),
        };
      });

      // Upsert massif avec gestion des variations de noms de colonnes (image_url vs image)
      let { error } = await client.from("dishes").upsert(cleanRows, { onConflict: "id" });

      if (error && (error.message?.includes("image_url") || error.code === "PGRST204")) {
        const fallbackRows = cleanRows.map((r: any) => {
          const copy = { ...r };
          delete copy.image_url;
          return copy;
        });
        const retryRes = await client.from("dishes").upsert(fallbackRows, { onConflict: "id" });
        error = retryRes.error;
      }

      if (error) {
        console.error("[POST /api/sync/dishes] Erreur:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.json({
        success: true,
        count: cleanRows.length,
        message: `${cleanRows.length} plats synchronisés et upsertés avec succès.`,
      });
    } catch (err: any) {
      console.error("[POST /api/sync/dishes] Exception:", err);
      return res.status(500).json({ success: false, error: err?.message || "Erreur interne serveur" });
    }
  });

  /**
   * Maintenance Endpoints:
   * GET /api/maintenance/report
   * POST /api/maintenance/run-now
   */
  app.get("/api/maintenance/report", (req: Request, res: Response) => {
    res.json({
      success: true,
      report: latestMaintenanceReport,
    });
  });

  app.post("/api/maintenance/run-now", async (req: Request, res: Response) => {
    try {
      const report = await executeMaintenanceTasks();
      res.json({
        success: true,
        report,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err?.message || "Erreur lors de l'exécution de la maintenance.",
      });
    }
  });

  // Tâche planifiée nocturne (Chaque nuit à 02:00, heure de Niamey)
  // Format cron : minute heure jour mois jour-semaine
  try {
    cron.schedule(
      "0 2 * * *",
      async () => {
        console.log("[CRON] Déclenchement automatique de la tâche nocturne de maintenance Allôresto (02h00 Africa/Niamey)");
        await executeMaintenanceTasks();
      },
      {
        timezone: "Africa/Niamey",
      }
    );
    console.log("[CRON] Tâche de maintenance nocturne Allôresto programmée avec succès (chaque nuit à 02:00 Africa/Niamey)");
  } catch (cronErr) {
    console.warn("[CRON] Impossible d'initialiser le planificateur cron:", cronErr);
  }
}
