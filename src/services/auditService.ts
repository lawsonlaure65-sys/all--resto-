import { getSupabaseClient } from "./supabaseClient";

export interface AuditLogEntry {
  id: string;
  actor_id?: string;
  actor_type: "admin" | "restaurant" | "driver" | "system";
  action: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

const STORAGE_KEY = "alloresto_audit_logs";

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-001",
    actor_id: "admin@alloresto.ne",
    actor_type: "admin",
    action: "export_data",
    entity_type: "orders_report",
    metadata: { format: "csv", count: 18, period: "7_days" },
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "log-002",
    actor_id: "admin@alloresto.ne",
    actor_type: "admin",
    action: "order_status_update",
    entity_type: "orders",
    entity_id: "ORD-9821",
    metadata: { previous_status: "cooking", new_status: "delivering" },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "log-003",
    actor_id: "admin@alloresto.ne",
    actor_type: "admin",
    action: "restaurant_activation",
    entity_type: "restaurants",
    entity_id: "resto-khadys-food",
    metadata: { status: "active", verified: true },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function getStoredAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

function saveStoredAuditLogs(logs: AuditLogEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, 200)));
  } catch (e) {
    console.warn("Erreur sauvegarde locale audit logs:", e);
  }
}

/**
 * Enregistre une action sensible dans le journal d'audit
 */
export async function logAuditEvent(entry: {
  actorId?: string;
  actorType?: "admin" | "restaurant" | "driver" | "system";
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const newLog: AuditLogEntry = {
    id: `log-${Date.now()}`,
    actor_id: entry.actorId || "admin@alloresto.ne",
    actor_type: entry.actorType || "admin",
    action: entry.action,
    entity_type: entry.entityType,
    entity_id: entry.entityId,
    metadata: entry.metadata || {},
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("audit_logs").insert([
        {
          actor_id: newLog.actor_id,
          actor_type: newLog.actor_type,
          action: newLog.action,
          entity_type: newLog.entity_type,
          entity_id: newLog.entity_id,
          metadata: newLog.metadata,
        },
      ]);
    } catch (e) {
      console.warn("Erreur insertion Supabase audit_logs, repli local:", e);
    }
  }

  const logs = getStoredAuditLogs();
  logs.unshift(newLog);
  saveStoredAuditLogs(logs);
}

/**
 * Récupère les logs d'audit pour la consultation admin
 */
export async function fetchAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as AuditLogEntry[];
      }
    } catch (e) {
      console.warn("Repli vers stockage local audit_logs:", e);
    }
  }

  return getStoredAuditLogs().slice(0, limit);
}
