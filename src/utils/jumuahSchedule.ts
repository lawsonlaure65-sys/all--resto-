/**
 * Utilitaire pour la gestion des horaires de la Prière du Jumu'ah (Vendredi)
 * À Niamey, les livraisons s'arrêtent à 11h00 pour reprendre à 15h00 le vendredi.
 */

export interface JumuahStatus {
  isFriday: boolean;
  isPauseActive: boolean; // true si c'est vendredi entre 11h00 et 15h00
  message: string;
  nextResumeTime: string;
  allowedTimeSlots: string[];
}

/**
 * Vérifie si le créneau actuel ou simulé correspond à la pause de la prière du Jumu'ah
 */
export function getJumuahStatus(
  simulatedFridayPause: boolean = false,
  customDate?: Date
): JumuahStatus {
  const now = customDate || new Date();
  const day = now.getDay(); // 0 = Dimanche, 5 = Vendredi
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentDecimalTime = hours + minutes / 60;

  // Vendredi réel ou simulation activée
  const isFriday = day === 5 || simulatedFridayPause;

  // Entre 11h00 (11.0) et 15h00 (15.0)
  const isPauseActive =
    simulatedFridayPause || (isFriday && currentDecimalTime >= 11.0 && currentDecimalTime < 15.0);

  const nextResumeTime = "15h00";

  let message = "";
  if (isPauseActive) {
    message =
      "🕌 Pause Prière du Jumu'ah : Les livraisons sont suspendues le vendredi de 11h00 à 15h00 pour la grande prière. Précommandez dès maintenant pour une livraison à partir de 15h00 !";
  } else if (isFriday) {
    if (currentDecimalTime < 11.0) {
      message =
        "ℹ️ Rappel Jumu'ah : Les livraisons du vendredi seront en pause de 11h00 à 15h00 pour la prière.";
    } else {
      message = "✨ Service de livraison actif après la prière du Jumu'ah.";
    }
  }

  // Créneaux horaires valides pour le vendredi
  const allowedTimeSlots = [
    "09:30",
    "10:00",
    "10:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  return {
    isFriday,
    isPauseActive,
    message,
    nextResumeTime,
    allowedTimeSlots,
  };
}

/**
 * Filtre les créneaux horaires d'un jour donné pour respecter le Jumu'ah
 */
export function filterTimeSlotsForDay(
  slots: string[],
  isFriday: boolean
): { time: string; disabled: boolean; reason?: string }[] {
  return slots.map((slot) => {
    const [h, m] = slot.split(":").map(Number);
    const decimal = h + (m || 0) / 60;
    const inPause = isFriday && decimal >= 11.0 && decimal < 15.0;

    return {
      time: slot,
      disabled: inPause,
      reason: inPause ? "🕌 Pause Prière du Jumu'ah (11h-15h)" : undefined,
    };
  });
}
