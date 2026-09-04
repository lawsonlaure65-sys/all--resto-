'use client';

import React, { useState } from 'react';

export default function DriverLoginPage() {
  const [phone, setPhone] = useState('+227 96 12 34 56');
  const [pin, setPin] = useState('1234');
  const [zone, setZone] = useState('Plateau / Centre-Ville');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'alloresto_driver_session',
          JSON.stringify({
            name: 'Moussa Ibrahim',
            phone,
            zone,
            vehicle: 'Moto Haojue RN-8821-B',
            status: 'online',
          })
        );
        window.location.href = '/app/driver/dashboard';
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-3xl font-black">
            🛵
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Espace Coursier Billo Express
          </h1>
          <p className="text-xs text-slate-400">
            Connexion Livreurs Partenaires Niamey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Numéro de Téléphone (Niger)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Zone de départ privilégiée
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="Plateau / Centre-Ville">Plateau / Centre-Ville</option>
              <option value="Harobanda / Université">Harobanda / Université</option>
              <option value="Ryad / Koira Kano">Ryad / Koira Kano</option>
              <option value="Koubia / Francophonie">Koubia / Francophonie</option>
              <option value="Yantala / Banifandou">Yantala / Banifandou</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Code PIN Coursier
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? 'Connexion au radar...' : 'Se Connecter & Prendre la Route'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <a href="/app/driver/history" className="hover:text-cyan-400 transition">
            Consulter mes gains
          </a>
          <a href="/" className="hover:text-white transition">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
