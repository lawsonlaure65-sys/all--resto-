'use client';

import React, { useState } from 'react';
import { BrandLogo } from '../../../src/components/BrandLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation de connexion admin (supporte admin123 & Niamey2026!)
    if (email === 'admin@alloresto.ne' && (password === 'admin123' || password === 'Niamey2026!')) {
      localStorage.setItem('admin', JSON.stringify({ email, role: 'super_admin' }));
      if (typeof window !== 'undefined') {
        window.location.href = '/?role=admin';
      }
    } else {
      setError('Identifiants invalides (essayez admin@alloresto.ne / admin123)');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo variant="icon" size="xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Allôresto Niger</h1>
          <p className="text-gray-600 mt-1 text-sm">Portail Super-Admin &amp; Direction</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Administrateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@alloresto.ne"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20 cursor-pointer text-sm"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500 flex flex-col gap-1">
          <p className="font-semibold text-gray-700">Accès Démo :</p>
          <code className="bg-gray-100 py-1 px-2 rounded text-gray-800 text-[11px]">admin@alloresto.ne / admin123</code>
        </div>
      </div>
    </div>
  );
}
