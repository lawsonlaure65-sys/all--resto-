'use client';

import React, { useState } from 'react';

interface DeliveryMission {
  id: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  district: string;
  items_summary: string;
  fee_driver: number;
  tip: number;
  status: 'available' | 'accepted' | 'at_resto' | 'picked_up' | 'delivered';
}

const SAMPLE_MISSIONS: DeliveryMission[] = [
  {
    id: 'MIS-401',
    restaurant_name: 'Cuisine & Saveurs du Sahel',
    restaurant_address: 'Plateau, Bd 15 Avril',
    customer_name: 'Fatima Amadou',
    customer_phone: '+227 90 22 33 44',
    delivery_address: 'Villa 14, Rue du Grand Marché',
    district: 'Plateau',
    items_summary: '2x Choukouya, 2x Bissap',
    fee_driver: 1000,
    tip: 500,
    status: 'available',
  },
  {
    id: 'MIS-402',
    restaurant_name: 'Le Dambou d’Or',
    restaurant_address: 'Quartier Harobanda',
    customer_name: 'Dr. Boubacar',
    customer_phone: '+227 96 55 66 77',
    delivery_address: 'Rectorat Université Abdou Moumouni',
    district: 'Harobanda',
    items_summary: '3x Dambou Blanc, 1x Capitaine',
    fee_driver: 1500,
    tip: 1000,
    status: 'available',
  },
];

export default function DriverDashboardPage() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [missions, setMissions] = useState<DeliveryMission[]>(SAMPLE_MISSIONS);
  const [activeMission, setActiveMission] = useState<DeliveryMission | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [completedToday, setCompletedToday] = useState(8);
  const [earnedToday, setEarnedToday] = useState(14500);

  const handleAcceptMission = (mission: DeliveryMission) => {
    const updated = { ...mission, status: 'accepted' as const };
    setActiveMission(updated);
    setMissions((prev) => prev.filter((m) => m.id !== mission.id));
  };

  const handleStepForward = () => {
    if (!activeMission) return;
    if (activeMission.status === 'accepted') {
      setActiveMission({ ...activeMission, status: 'at_resto' });
    } else if (activeMission.status === 'at_resto') {
      setActiveMission({ ...activeMission, status: 'picked_up' });
    } else if (activeMission.status === 'picked_up') {
      // Validation livraison
      const reward = activeMission.fee_driver + activeMission.tip;
      setEarnedToday((prev) => prev + reward);
      setCompletedToday((prev) => prev + 1);
      setActiveMission(null);
      setOtpCode('');
      alert(`🎉 Course validée avec succès ! +${reward.toLocaleString()} FCFA crédités sur votre compte.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛵</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Radar Coursier Billo Express
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Moussa Ibrahim (Moto Haojue RN-8821-B) - Secteur Niamey
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg ${
                isOnline
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{isOnline ? '🟢 En ligne (Disponible)' : '⚪ En Pause'}</span>
            </button>

            <a
              href="/app/driver/history"
              className="px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              💰 Mes Gains
            </a>
          </div>
        </header>

        {/* Live Daily Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Courses du Jour</span>
            <div className="text-2xl font-black text-white mt-1">{completedToday}</div>
            <span className="text-[11px] text-emerald-400">Objectif 10 courses</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Gains Cumulés (Jour)</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {earnedToday.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-slate-400">Frais + Pourboires inclus</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Note Satisfaction</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">★ 4.95 / 5</div>
            <span className="text-[11px] text-slate-400">Top Coursier Plateau</span>
          </div>
        </div>

        {/* Active Mission Card (if in progress) */}
        {activeMission && (
          <div className="bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-900 border-2 border-cyan-500 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-cyan-800/40">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                Course en cours #{activeMission.id}
              </span>
              <span className="font-black text-amber-400 text-sm">
                Gain : {(activeMission.fee_driver + activeMission.tip).toLocaleString()} FCFA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">1. Récupération Restaurant</span>
                <div className="font-bold text-white text-sm">{activeMission.restaurant_name}</div>
                <div className="text-slate-300">{activeMission.restaurant_address}</div>
                <div className="text-cyan-400 pt-1">Contenu : {activeMission.items_summary}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block">2. Livraison Client</span>
                <div className="font-bold text-white text-sm">{activeMission.customer_name}</div>
                <div className="text-orange-400 font-bold">{activeMission.delivery_address} ({activeMission.district})</div>
                <a
                  href={`tel:${activeMission.customer_phone}`}
                  className="inline-block mt-1 text-emerald-400 font-bold hover:underline"
                >
                  📞 Appeler le client : {activeMission.customer_phone}
                </a>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="pt-2">
              {activeMission.status === 'accepted' && (
                <button
                  onClick={handleStepForward}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Je suis arrivé au restaurant 📍
                </button>
              )}

              {activeMission.status === 'at_resto' && (
                <button
                  onClick={handleStepForward}
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Commande récupérée, en route vers le client 🛵💨
                </button>
              )}

              {activeMission.status === 'picked_up' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Code OTP client (4 chiffres)"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white text-center font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleStepForward}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                    >
                      Valider Livraison ✓
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Demandez le code secret à 4 chiffres au client lors de la remise du sac.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Radar: Available Missions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>📡</span> Courses Disponibles dans votre Secteur
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {missions.length} proposition(s)
            </span>
          </div>

          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{mission.restaurant_name}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="font-bold text-orange-400">{mission.district}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{mission.items_summary}</p>
                  <div className="text-emerald-400 font-bold text-[11px]">
                    Gain garanti : {mission.fee_driver.toLocaleString()} FCFA {mission.tip > 0 && `+ ${mission.tip} FCFA pourboire`}
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptMission(mission)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  Accepter la Course
                </button>
              </div>
            ))}

            {missions.length === 0 && !activeMission && (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <div className="text-2xl animate-pulse">📡</div>
                <p>Recherche des nouvelles commandes en cours à Niamey...</p>
                <p className="text-[11px] text-slate-600">Restez positionné à proximité des restaurants partenaires.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
