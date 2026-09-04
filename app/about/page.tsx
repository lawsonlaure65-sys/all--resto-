'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Top */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <a href="/" className="flex items-center gap-2 text-white font-black text-lg">
            <span className="text-2xl">🍲</span> Allôresto Niger
          </a>
          <div className="flex items-center gap-3 text-xs font-bold">
            <a href="/app/menu" className="text-slate-300 hover:text-white transition">
              Menu &amp; Plats
            </a>
            <a href="/app/contact" className="text-slate-300 hover:text-white transition">
              Contact
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-black"
            >
              Devenir Restaurant Partenaire
            </a>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 p-6 md:p-12 text-slate-950 shadow-2xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-wider">
            1ère Plateforme Gastronomique 100% Nigérienne 🇳🇪
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Connecter les meilleures tables de Niamey aux gourmets du Sahel
          </h1>
          <p className="text-xs md:text-sm font-medium max-w-2xl leading-relaxed text-slate-900">
            Née de la volonté de valoriser le patrimoine culinaire du Niger et de moderniser la livraison urbaine, Allôresto s'appuie sur une flotte de coursiers passionnés (Billo Express) et une technologie conçue sur mesure pour les réalités de Niamey.
          </p>
        </div>

        {/* 3 Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl font-black">
              🥩
            </div>
            <h3 className="font-bold text-white text-base">Terroir &amp; Authenticité</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Du Choukouya tendre du Sahel au Dambou blanc et Moringa bio, en passant par le Capitaine braisé du fleuve Niger, nous célébrons les saveurs locales.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-black">
              ⚡
            </div>
            <h3 className="font-bold text-white text-base">Flotte Billo Express</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Des livreurs formés, géolocalisés en temps réel et rémunérés équitablement (100% des pourboires conservés) pour des livraisons en moins de 30 minutes.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-black">
              🤝
            </div>
            <h3 className="font-bold text-white text-base">Modèle Équitable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pas de commissions prédatrices de 20-30% : Allôresto propose un abonnement fixe sans commission cachée pour préserver la rentabilité des restaurateurs.
            </p>
          </div>
        </div>

        {/* Company Info & Legal Details */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🏢</span> Informations Officielles de l'Entreprise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block">Raison Sociale :</span>
              <strong className="text-white">Allôresto Niger SARL</strong>
            </div>
            <div>
              <span className="text-slate-500 block">NIF (Numéro Fiscale) :</span>
              <strong className="text-white font-mono">NIF-89210-NE</strong>
            </div>
            <div>
              <span className="text-slate-500 block">RCCM :</span>
              <strong className="text-white font-mono">RCCM-NI-NIA-2026-B-1142</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Siège Social :</span>
              <strong className="text-white">Plateau, Boulevard du 15 Avril, Niamey, Niger</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
