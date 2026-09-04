'use client';

import React, { useState } from 'react';

interface DeliveryMissionDetail {
  id: string;
  order_number: number;
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_address: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district: string;
  items: { name: string; quantity: number; notes?: string }[];
  delivery_fee: number;
  tip: number;
  customer_total_due: number;
  payment_method: 'airtel_money' | 'flooz' | 'cash';
  payment_status: 'paid' | 'collect_cash';
  status: 'accepted' | 'at_restaurant' | 'picked_up' | 'on_the_way' | 'delivered';
  customer_otp: string;
  created_at: string;
}

const DEFAULT_MISSION: DeliveryMissionDetail = {
  id: 'CMD-1082',
  order_number: 1082,
  restaurant_name: 'Cuisine & Saveurs du Sahel',
  restaurant_phone: '+227 96 05 23 10',
  restaurant_address: 'Boulevard de la République, Plateau, Niamey',
  customer_name: 'Moussa Garba',
  customer_phone: '+227 90 12 34 56',
  customer_address: 'Villa 42, Rue des Ambassades, Plateau',
  district: 'Plateau / Centre-Ville',
  items: [
    { name: 'Choukouya Royal d’Agneau au Kan-Kan Relevé', quantity: 2, notes: 'Bien pimenté Kan-Kan' },
    { name: 'Jus de Baobab Naturel Frais 33cl', quantity: 2 },
  ],
  delivery_fee: 1000,
  tip: 500,
  customer_total_due: 11500,
  payment_method: 'airtel_money',
  payment_status: 'paid',
  status: 'accepted',
  customer_otp: '7412',
  created_at: 'Il y a 10 min',
};

export default function DriverOrderDetailPage() {
  const [mission, setMission] = useState<DeliveryMissionDetail>(DEFAULT_MISSION);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleNextStep = () => {
    if (mission.status === 'accepted') {
      setMission({ ...mission, status: 'at_restaurant' });
    } else if (mission.status === 'at_restaurant') {
      setMission({ ...mission, status: 'picked_up' });
    } else if (mission.status === 'picked_up') {
      setMission({ ...mission, status: 'on_the_way' });
    }
  };

  const handleValidateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === mission.customer_otp || enteredOtp.trim() === '1234') {
      setMission({ ...mission, status: 'delivered' });
      setCompleted(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 pb-24">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Navigation & Titre Mission */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <a
            href="/app/driver/dashboard"
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <span>← Retour au Radar</span>
          </a>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
            Course Active
          </span>
        </div>

        {/* Bannière Course & Gains Livreur */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Mission #{mission.order_number}
              </span>
              <h1 className="text-xl font-black text-white">Livraison {mission.district}</h1>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Votre Gain Net</span>
              <span className="text-lg font-black text-emerald-400">
                {(mission.delivery_fee + mission.tip).toLocaleString()} FCFA
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Frais course : {mission.delivery_fee} FCFA</span>
            <span className="text-amber-400 font-bold">Pourboire : +{mission.tip} FCFA</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              100% pour vous
            </span>
          </div>
        </div>

        {/* Étape 1 : Collecte Restaurant */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Point de Collecte (Restaurant)
              </span>
            </div>
            <a
              href={`tel:${mission.restaurant_phone}`}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
            >
              📞 Appeler
            </a>
          </div>

          <div>
            <h3 className="text-sm font-black text-white">{mission.restaurant_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">📍 {mission.restaurant_address}</p>
          </div>

          {/* Liste des articles à vérifier */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Articles à vérifier avec le cuisinier :
            </span>
            <div className="space-y-1.5 text-xs">
              {mission.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-200">
                  <span>
                    <strong>{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="text-emerald-400 text-xs">✓ Vérifié</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Étape 2 : Livraison Client */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Destination Client
              </span>
            </div>
            <a
              href={`tel:${mission.customer_phone}`}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1"
            >
              📞 Appeler
            </a>
          </div>

          <div>
            <h3 className="text-sm font-black text-white">{mission.customer_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">📍 {mission.customer_address}</p>
          </div>

          {/* Statut Paiement Client */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Règlement Commande</span>
              <span className="text-xs font-bold text-emerald-400">
                {mission.payment_status === 'paid'
                  ? '✅ Déjà payé via Airtel Money (0 FCFA à réclamer)'
                  : `💵 Encaisser ${mission.customer_total_due.toLocaleString()} FCFA en espèces`}
              </span>
            </div>
            <span className="text-lg">
              {mission.payment_status === 'paid' ? '📱' : '💵'}
            </span>
          </div>
        </div>

        {/* Actions selon le statut */}
        {!completed ? (
          <div className="space-y-3">
            {mission.status === 'accepted' && (
              <button
                onClick={handleNextStep}
                className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-sm transition shadow-lg shadow-orange-500/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>📍 Arrivé au Restaurant</span>
              </button>
            )}

            {mission.status === 'at_restaurant' && (
              <button
                onClick={handleNextStep}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🛍️ Commande Récupérée &amp; En Route</span>
              </button>
            )}

            {(mission.status === 'picked_up' || mission.status === 'on_the_way') && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Validation de Livraison (Code OTP)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demandez au client son code secret à 4 chiffres (ou entrez <strong>{mission.customer_otp}</strong>).
                  </p>
                </div>

                <form onSubmit={handleValidateDelivery} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Ex: 7412"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer"
                    >
                      Valider
                    </button>
                  </div>
                  {otpError && (
                    <p className="text-xs text-rose-400 font-medium">
                      Code OTP incorrect. Le code test est {mission.customer_otp} ou 1234.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <div className="text-3xl">🎉</div>
            <h3 className="text-lg font-black text-emerald-400">Livraison Validée avec Succès !</h3>
            <p className="text-xs text-slate-300">
              Votre gain de {(mission.delivery_fee + mission.tip).toLocaleString()} FCFA a été crédité sur votre
              compte Billo Express.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <a
                href="/app/driver/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
              >
                Prochaine Course
              </a>
              <a
                href="/app/driver/history"
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
              >
                Voir mes Gains
              </a>
            </div>
          </div>
        )}

        {/* Assistance Urgente */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Un problème sur la route ?</span>
          <a
            href="tel:+22780828282"
            className="text-orange-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Support Billo (+227 80 82 82 82)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
