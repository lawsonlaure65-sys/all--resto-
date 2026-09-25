import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { syncDishesToSupabase } from "../services/supabaseDishService";
import { localDishes } from "../data/allorestoData";

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants?: any;
  onRestaurantsUpdated?: (updated: any) => void;
}

export function SupabaseSyncModal({
  isOpen,
  onClose,
}: SupabaseSyncModalProps) {
  const [status, setStatus] = useState<"idle" | "testing" | "syncing" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [restaurantsCount, setRestaurantsCount] = useState<number>(0);
  const [dishesCount, setDishesCount] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    loadCounts();
  }, [isOpen]);

  async function loadCounts() {
    const isConfigured =
      typeof isSupabaseConfigured === "function"
        ? isSupabaseConfigured()
        : Boolean(isSupabaseConfigured);

    if (!isConfigured) {
      setRestaurantsCount(0);
      setDishesCount(0);
      return;
    }

    try {
      const { count: rCount } = await (supabase as any)
        .from("restaurants")
        .select("*", { count: "exact", head: true });

      const { count: dCount } = await (supabase as any)
        .from("dishes")
        .select("*", { count: "exact", head: true });

      setRestaurantsCount(rCount || 0);
      setDishesCount(dCount || 0);
    } catch {
      // Ignorer silencieusement si hors-ligne
    }
  }

  async function handleTestOnly() {
    setStatus("testing");
    setMessage("Test en cours...");
    try {
      const { data, error } = await (supabase as any)
        .from("restaurants")
        .select("id, name")
        .limit(1);

      if (error) throw error;
      setMessage(`Test OK. Restaurants trouvés : ${data?.length || 0}`);
      setStatus("done");
    } catch (e: any) {
      setMessage(`Erreur : ${e?.message || "Échec du test"}`);
      setStatus("error");
    }
  }

  async function handleSaveAndTest() {
    setStatus("testing");
    setMessage("Sauvegarde & test en cours...");
    try {
      const { error } = await (supabase as any)
        .from("restaurants")
        .select("id, name")
        .limit(1);

      if (error) throw error;
      setMessage("Connexion OK. Prêt à synchroniser les plats.");
      setStatus("done");
    } catch (e: any) {
      setMessage(`Erreur : ${e?.message || "Échec de la connexion"}`);
      setStatus("error");
    }
  }

  async function handleSendDishes() {
    setStatus("syncing");
    setMessage(`Envoi de ${localDishes.length} plats vers Supabase...`);
    try {
      const result = await syncDishesToSupabase(localDishes, "khadys-food-event");
      setMessage(`Succès ! ${result.rowsSent} plats synchronisés.`);
      setStatus("done");
      await loadCounts();
    } catch (e: any) {
      setMessage(`Erreur : ${e?.message || "Échec de la synchronisation"}`);
      setStatus("error");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl">
        <h2 className="text-lg font-black text-amber-400 mb-2">Synchronisation Supabase</h2>
        <p className="text-xs text-slate-300 mb-4">
          Cette fenêtre permet de tester la connexion et d’envoyer les plats locaux vers votre base Supabase.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Restaurants</div>
            <div className="text-lg font-black text-white">{restaurantsCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400">Plats</div>
            <div className="text-lg font-black text-white">{dishesCount}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleTestOnly}
            disabled={status === "testing" || status === "syncing"}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            1. Tester seulement
          </button>

          <button
            onClick={handleSaveAndTest}
            disabled={status === "testing" || status === "syncing"}
            className="w-full px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black disabled:opacity-50 cursor-pointer"
          >
            2. Sauvegarder & Tester la Connexion
          </button>

          <button
            onClick={handleSendDishes}
            disabled={status === "testing" || status === "syncing"}
            className="w-full px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black disabled:opacity-50 cursor-pointer"
          >
            3. Envoyer les Plats Locaux ({localDishes.length})
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
            {message}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupabaseSyncModal;
