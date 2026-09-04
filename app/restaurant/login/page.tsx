'use client';

import React, { useState } from 'react';

export default function RestaurantLoginPage() {
  const [identifier, setIdentifier] = useState('manager@sahel-saveurs.ne');
  const [pinCode, setPinCode] = useState('2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (pinCode.length >= 4) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'alloresto_restaurant_session',
            JSON.stringify({
              restaurant_name: 'Cuisine & Saveurs du Sahel',
              restaurant_id: 'resto-01',
              role: 'manager',
              login_at: new Date().toISOString(),
            })
          );
          window.location.href = '/app/restaurant/dashboard';
        }
      } else {
        setError('Le code PIN doit comporter au moins 4 chiffres');
        setLoading(false);
      }
    }, 600);
  };

  const handleDemoLogin = () => {
    setIdentifier('demo@alloresto.ne');
    setPinCode('2026');
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'alloresto_restaurant_session',
        JSON.stringify({
          restaurant_name: 'Cuisine & Saveurs du Sahel',
          restaurant_id: 'resto-01',
          role: 'manager',
          login_at: new Date().toISOString(),
        })
      );
      window.location.href = '/app/restaurant/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center text-3xl font-black">
            🍽️
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Espace Restaurateur Partenaire
          </h1>
          <p className="text-xs text-slate-400">
            Accès Gérant &amp; Cuisine - Allôresto Niamey
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Email ou Téléphone du Restaurant
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="contact@monresto.ne ou +227 9X XX XX XX"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Code PIN Gérant (4 chiffres)
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Accéder à la Cuisine'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>⚡ Connexion Rapide Démo</span>
          </button>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <a href="/app/restaurant/plans" className="hover:text-orange-400 transition">
              Découvrir les Formules &amp; Tarifs
            </a>
            <a href="/" className="hover:text-white transition">
              Retour à l’accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
