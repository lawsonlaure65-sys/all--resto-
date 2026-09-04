'use client';

import React, { useState } from 'react';

interface PastTrip {
  id: string;
  date: string;
  restaurant: string;
  district: string;
  delivery_fee: number;
  tip: number;
  total_earned: number;
  payment_type: 'airtel_money' | 'flooz' | 'cash';
}

const SAMPLE_HISTORY: PastTrip[] = [
  {
    id: 'TRP-881',
    date: 'Aujourd’hui 11:30',
    restaurant: 'Cuisine & Saveurs du Sahel',
    district: 'Plateau',
    delivery_fee: 1000,
    tip: 500,
    total_earned: 1500,
    payment_type: 'airtel_money',
  },
  {
    id: 'TRP-880',
    date: 'Aujourd’hui 10:15',
    restaurant: 'Le Dambou d’Or',
    district: 'Harobanda',
    delivery_fee: 1500,
    tip: 1000,
    total_earned: 2500,
    payment_type: 'flooz',
  },
  {
    id: 'TRP-879',
    date: 'Aujourd’hui 09:00',
    restaurant: 'Grillades & Braises du Sahel',
    district: 'Koira Kano',
    delivery_fee: 1200,
    tip: 0,
    total_earned: 1200,
    payment_type: 'cash',
  },
  {
    id: 'TRP-878',
    date: 'Hier 19:45',
    restaurant: 'Le Palmier - Oasis',
    district: 'Koubia',
    delivery_fee: 1500,
    tip: 500,
    total_earned: 2000,
    payment_type: 'airtel_money',
  },
  {
    id: 'TRP-877',
    date: 'Hier 18:20',
    restaurant: 'Cuisine du Sahel',
    district: 'Banifandou',
    delivery_fee: 1200,
    tip: 1000,
    total_earned: 2200,
    payment_type: 'flooz',
  },
];

export default function DriverHistoryPage() {
  const [history] = useState<PastTrip[]>(SAMPLE_HISTORY);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('airtel_money');
  const [payoutPhone, setPayoutPhone] = useState('+227 96 12 34 56');

  const totalBalance = 24500;
  const totalDeliveriesMonth = 78;
  const totalTipsMonth = 38500;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutRequested(true);
    setTimeout(() => {
      alert(`✅ Demande de virement de ${totalBalance.toLocaleString()} FCFA envoyée sur votre compte ${payoutMethod === 'airtel_money' ? 'Airtel Money' : 'Moov Flooz'} (${payoutPhone}). Traitement sous 15 minutes !`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Gains &amp; Portefeuille Coursier
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Historique des courses effectuées et encaissement mobile money
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/app/driver/dashboard"
              className="px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              🛵 Retour au Radar
            </a>
          </div>
        </header>

        {/* Balance Card with Payout Trigger */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-cyan-500/40 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Solde Disponible Immédiatement
            </span>
            <div className="text-3xl md:text-4xl font-black text-cyan-400">
              {totalBalance.toLocaleString()} FCFA
            </div>
            <p className="text-[11px] text-slate-400">
              Courses validées + pourboires clients 100% reversés
            </p>
          </div>

          <form onSubmit={handleRequestPayout} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="airtel_money">Airtel Money</option>
              <option value="flooz">Moov Flooz</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Retirer mes Gains
            </button>
          </form>
        </div>

        {/* Monthly Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Courses (Ce Mois)</span>
            <div className="text-2xl font-black text-white mt-1">{totalDeliveriesMonth}</div>
            <span className="text-[11px] text-slate-500">Moyenne 3.2 courses/jour</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Pourboires Récoltés</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {totalTipsMonth.toLocaleString()} FCFA
            </div>
            <span className="text-[11px] text-emerald-400">0% de retenue par Allôresto</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <span className="text-xs text-slate-400 font-medium">Fidélité Billo Express</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">Niveau Or 🏆</div>
            <span className="text-[11px] text-slate-400">Bonus palier +5 000 FCFA</span>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Historique Récent des Courses</h3>
            <span className="text-xs text-slate-400">Dernières livraisons</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Quartier</th>
                  <th className="py-3 px-4">Frais Course</th>
                  <th className="py-3 px-4">Pourboire</th>
                  <th className="py-3 px-4 text-right">Total Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">{trip.id}</td>
                    <td className="py-3 px-4 text-slate-400">{trip.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{trip.restaurant}</td>
                    <td className="py-3 px-4 text-orange-400 font-medium">{trip.district}</td>
                    <td className="py-3 px-4">{trip.delivery_fee.toLocaleString()} FCFA</td>
                    <td className="py-3 px-4 text-amber-400">
                      {trip.tip > 0 ? `+${trip.tip.toLocaleString()} FCFA` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-cyan-400">
                      {trip.total_earned.toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
