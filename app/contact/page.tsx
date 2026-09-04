'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+227 ');
  const [subject, setSubject] = useState('Commande en cours');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert('✅ Votre message a été transmis à l’équipe support Allôresto Niamey ! Nous vous répondrons par SMS ou appel sous 10 minutes.');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Top */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <a href="/" className="flex items-center gap-2 text-white font-black text-lg">
            <span className="text-2xl">🍲</span> Allôresto Niger
          </a>
          <div className="flex items-center gap-3 text-xs font-bold">
            <a href="/app/about" className="text-slate-300 hover:text-white transition">
              À propos
            </a>
            <a href="/app/menu" className="text-slate-300 hover:text-white transition">
              Menu &amp; Plats
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-black"
            >
              Espace Restaurant
            </a>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Contactez le Support Client &amp; Partenaires
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Une assistance rapide 7j/7 de 08h00 à 23h30 pour vos commandes et questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Channels */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
              <span className="text-xl">📞</span>
              <h3 className="font-bold text-white text-sm">Téléphone Direct</h3>
              <p className="text-xs text-slate-400">Appel standard et urgences livraison</p>
              <a
                href="tel:+22780828282"
                className="inline-block text-orange-400 font-bold text-sm hover:underline"
              >
                +227 80 82 82 82
              </a>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-2 shadow-xl">
              <span className="text-xl">💬</span>
              <h3 className="font-bold text-emerald-400 text-sm">WhatsApp Assistance</h3>
              <p className="text-xs text-slate-400">Réponse instantanée par chat</p>
              <a
                href="https://wa.me/22790223344"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
              >
                Ouvrir WhatsApp
              </a>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
              <span className="text-xl">📍</span>
              <h3 className="font-bold text-white text-sm">Siège Niamey</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plateau, Boulevard du 15 Avril, Niamey, République du Niger.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4">Envoyer un message au service client</h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2">
                <span className="text-2xl">✅</span>
                <h3 className="text-sm font-bold text-emerald-300">Message bien reçu !</h3>
                <p className="text-xs text-slate-300">
                  Notre équipe prend en charge votre demande immédiatement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Votre Nom</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Moussa Kallo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Téléphone (Niger)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+227 9X XX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Objet</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Commande en cours">Suivi d'une commande en cours</option>
                    <option value="Question Restaurant Partenaire">Devenir Restaurant Partenaire</option>
                    <option value="Recrutement Livreur">Rejoindre la flotte Billo Express</option>
                    <option value="Service Traiteur / Événement">Devis Traiteur &amp; Événements</option>
                    <option value="Autre">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez votre demande ou votre numéro de commande..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
