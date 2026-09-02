import { getSupabaseClient } from "./supabaseClient";
import { DriverProfile, DriverAssignment } from "../types";
import { BILLO_COURIERS } from "../components/BilloExpressDispatchModal";

const LOCAL_DRIVERS_KEY = "alloresto_niamey_drivers_v1";
const LOCAL_ASSIGNMENTS_KEY = "alloresto_niamey_driver_assignments_v1";

// Default Initial Drivers for Niamey Billo Express including Issoufou Moussa (+227 99 00 00 00)
export const DEFAULT_DRIVERS: DriverProfile[] = BILLO_COURIERS.map((c) => ({
  id: c.id,
  fullName: c.name,
  phone: c.phone,
  motoPlate: c.plate,
  vehicle: c.vehicle,
  status: c.status === "available" ? "available" : "busy",
  currentZone: c.zone,
  avatar: c.avatar,
  rating: c.rating,
  completedDeliveries: c.completedDeliveries,
}));

/**
 * Fetch all drivers from Supabase with fallback to local state
 */
export async function getDrivers(): Promise<DriverProfile[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("drivers")
        .select("*")
        .order("full_name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          fullName: d.full_name,
          phone: d.phone,
          motoPlate: d.moto_plate || "RN-0000",
          vehicle: d.vehicle || "Moto Boxer",
          status: d.status || "available",
          currentZone: d.current_zone || "Plateau Niamey",
          avatar:
            d.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          rating: 4.9,
          completedDeliveries: 150,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch drivers fallback:", e);
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(LOCAL_DRIVERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  // Seed default drivers to local storage
  localStorage.setItem(LOCAL_DRIVERS_KEY, JSON.stringify(DEFAULT_DRIVERS));
  return DEFAULT_DRIVERS;
}

/**
 * Seed Drivers table in Supabase if empty
 */
export async function seedDriversIfEmpty(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { count, error } = await client
      .from("drivers")
      .select("*", { count: "exact", head: true });

    if (!error && (count === null || count === 0)) {
      const driversToInsert = DEFAULT_DRIVERS.map((d) => ({
        full_name: d.fullName,
        phone: d.phone,
        moto_plate: d.motoPlate,
        status: d.status,
        current_zone: d.currentZone,
      }));

      await client.from("drivers").insert(driversToInsert);
    }
  } catch (e) {
    console.warn("Could not seed drivers to Supabase:", e);
  }
}

/**
 * Driver Login / Verification by Phone
 */
export async function verifyDriverLogin(phone: string): Promise<DriverProfile | null> {
  const normalizedPhone = phone.replace(/[^0-9+]/g, "");
  const drivers = await getDrivers();

  const matched = drivers.find((d) => {
    const cleanDPhone = d.phone.replace(/[^0-9+]/g, "");
    return (
      cleanDPhone.endsWith(normalizedPhone.slice(-8)) ||
      normalizedPhone.endsWith(cleanDPhone.slice(-8))
    );
  });

  return matched || null;
}

/**
 * Accept / Assign a Delivery Mission to a Driver
 */
export async function assignDriverToOrder(
  driverId: string,
  orderId: string,
  driverName: string,
  driverPhone: string
): Promise<DriverAssignment> {
  const newAssignment: DriverAssignment = {
    id: `assign-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    driverId,
    orderId,
    status: "accepted",
    acceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from("driver_assignments").insert([
        {
          driver_id: driverId.includes("-") && driverId.length > 30 ? driverId : undefined,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        },
      ]);

      await client
        .from("restaurant_orders")
        .update({
          order_status: "delivering",
          courier_name: driverName,
          courier_phone: driverPhone,
        })
        .eq("id", orderId);
    } catch (e) {
      console.warn("Supabase driver assignment sync error:", e);
    }
  }

  // 2. Save locally
  const saved = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
  const assignments: DriverAssignment[] = saved ? JSON.parse(saved) : [];
  assignments.unshift(newAssignment);
  localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(assignments));

  return newAssignment;
}

/**
 * Update Driver Assignment Status (picked_up, delivered)
 */
export async function updateDriverMissionStatus(
  orderId: string,
  driverId: string,
  status: "picked_up" | "delivered"
): Promise<void> {
  const now = new Date().toISOString();
  const client = getSupabaseClient();

  if (client) {
    try {
      const updateData: any = { status };
      if (status === "picked_up") updateData.picked_up_at = now;
      if (status === "delivered") updateData.delivered_at = now;

      await client
        .from("driver_assignments")
        .update(updateData)
        .eq("order_id", orderId)
        .eq("driver_id", driverId);

      await client
        .from("restaurant_orders")
        .update({
          order_status: status === "picked_up" ? "delivering" : "delivered",
        })
        .eq("id", orderId);
    } catch (e) {
      console.warn("Supabase mission status update error:", e);
    }
  }

  // Local update
  const saved = localStorage.getItem(LOCAL_ASSIGNMENTS_KEY);
  if (saved) {
    try {
      const assignments: DriverAssignment[] = JSON.parse(saved);
      const updated = assignments.map((a) => {
        if (a.orderId === orderId) {
          return {
            ...a,
            status,
            ...(status === "picked_up" ? { pickedUpAt: now } : { deliveredAt: now }),
          };
        }
        return a;
      });
      localStorage.setItem(LOCAL_ASSIGNMENTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}
