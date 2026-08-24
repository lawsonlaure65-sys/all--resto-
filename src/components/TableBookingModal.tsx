import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  X,
  Calendar,
  Clock,
  Users,
  Utensils,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Sparkles,
} from "lucide-react";
import { Restaurant, TableBooking } from "../types";

interface TableBookingModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (booking: TableBooking) => void;
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onBookingConfirmed,
}) => {
  const [guests, setGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState("2025-05-18");
  const [bookingTime, setBookingTime] = useState("20:00");
  const [customerName, setCustomerName] = useState("Amadou Seyni");
  const [customerPhone, setCustomerPhone] = useState("+227 90 12 34 56");
  const [customerEmail, setCustomerEmail] = useState("amadou.seyni@alloresto.ne");
  const [specialRequests, setSpecialRequests] = useState("Terrasse ou salon climatisé");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!restaurant || !isOpen) return null;

  const timeSlots = ["12:00", "12:30", "13:00", "13:30", "19:30", "20:00", "20:30", "21:00", "21:30"];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: TableBooking = {
      id: "RES-" + Math.floor(1000 + Math.random() * 9000),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      customerName: customerName || "Invité",
      customerPhone,
      customerEmail,
      date: bookingDate,
      time: bookingTime,
      guests,
      specialRequests,
      status: "confirmed",
      createdAt: "À l'instant",
    };

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    setIsSuccess(true);
    setTimeout(() => {
      onBookingConfirmed(newBooking);
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
              Réservation de Table
            </span>
            <h3 className="text-base font-black text-slate-950 mt-1">{restaurant.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/10 hover:bg-black/20 text-slate-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">Réservation Confirmée !</h4>
            <p className="text-xs text-slate-300">
              Votre table pour <strong>{guests} personnes</strong> le <strong>{bookingDate}</strong> à{" "}
              <strong>{bookingTime}</strong> est bien réservée au nom de <strong>{customerName}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* Number of Guests */}
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre de personnes :
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                      guests === num
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {num} {num === 1 ? "pers." : "pers."}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Date :
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Heure :
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Nom &amp; Prénom *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Sophie Laurent"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Demande particulière (allergies, anniversaire...)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirmer ma réservation gratuite</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
