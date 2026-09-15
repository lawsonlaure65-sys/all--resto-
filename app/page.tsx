'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DishCard from './components/DishCard';

const KHADYS_DISHES = [
  {
    id: 'kf-attieke-caviar',
    name: 'Attiéké caviar',
    description: 'Attiéké fin cuit à la perfection avec caviar gourmand et assaisonnements authentiques signés Khady\'s Food.',
    price: 4000,
    imageSrc: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    badge: 'Tous les jours (09h–22h)',
    optionsHint: 'Disponible immédiatement',
  },
  {
    id: 'kf-sauce-gboma-mer',
    name: 'Sauce feuilles d’épinards (Gboma)',
    description: 'Sauce Gboma traditionnelle aux feuilles d\'épinards fraîches mijotées, servie avec poisson de mer. Accompagnement : riz blanc, pâte de maïs ou télibo.',
    price: 3500,
    imageSrc: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    badge: 'Sur commande',
    optionsHint: 'Poisson de mer • Riz, pâte de maïs ou télibo',
  },
  {
    id: 'kf-sauce-gboma-fleuve',
    name: 'Sauce Gboma avec carpe ou capitaine',
    description: 'Sauce traditionnelle Gboma aux feuilles d\'épinards savoureuses, accompagnée de carpe ou de capitaine frais du fleuve Niger. Accompagnement : riz blanc, pâte de maïs ou télibo.',
    price: 5000,
    imageSrc: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    badge: 'Sur commande',
    optionsHint: 'Carpe ou Capitaine • Riz, pâte ou télibo',
  },
  {
    id: 'kf-spaghetti-sautes',
    name: 'Spaghetti sautés',
    description: 'Spaghetti sautés aux petits légumes et épices du chef, servis chauds au choix avec merguez ou boulettes. Préparés sur commande.',
    price: 3500,
    imageSrc: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80',
    badge: 'Sur commande',
    optionsHint: 'Merguez ou boulettes au choix',
  },
  {
    id: 'kf-sandwich',
    name: 'Sandwich',
    description: 'Sandwich gourmand et croustillant garni de crudités fraîches et sauces au choix, servi avec merguez ou boulettes. Disponible tous les jours.',
    price: 2000,
    imageSrc: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    badge: 'Tous les jours',
    optionsHint: 'Merguez ou boulettes au choix',
  },
  {
    id: 'kf-doukounou-caviar-1',
    name: 'Doukounou caviar — formule 1',
    description: 'Doukounou traditionnel : 4 boules moelleuses accompagnées de sauce caviar et 1 morceau de poisson de mer. Disponible tous les jours.',
    price: 2500,
    imageSrc: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    badge: 'Tous les jours',
    optionsHint: '4 boules + 1 morceau de poisson de mer',
  },
  {
    id: 'kf-doukounou-caviar-2',
    name: 'Doukounou caviar — formule 2',
    description: 'Doukounou traditionnel formule gourmande : 4 boules moelleuses avec sauce caviar et 2 morceaux de poisson de mer. Disponible tous les jours.',
    price: 3500,
    imageSrc: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    badge: 'Tous les jours',
    optionsHint: '4 boules + 2 morceaux de poisson de mer',
  },
];

export default function HomePage() {
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (dishName: string) => {
    setAddedToCart(dishName);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Toast confirmation de panier */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white shadow-xl flex items-center justify-center gap-2"
          >
            <span>✓ Plat ajouté au panier : <strong>{addedToCart}</strong></span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Étape 3 : Hero Header Animate */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-100 flex items-center gap-2"
          >
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
              👑 Restaurant Fondateur • Ouvert jusqu’à 22 h
            </span>
            <span>Allôresto by Khady&apos;s Food &amp; Event</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl"
          >
            Vos plats préférés, livrés à Niamey.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl text-base text-orange-50 md:text-lg"
          >
            Commandez chez Khady&apos;s Food &amp; Event, notre restaurant fondateur,
            et auprès de nos restaurants partenaires à Niamey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#khadys-food"
              className="rounded-xl bg-white px-6 py-3 font-bold text-orange-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl inline-flex items-center gap-2"
            >
              <span>Voir le menu</span>
            </a>

            <a
              href="https://wa.me/22774441621"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10 inline-flex items-center gap-2"
            >
              <span>Commander par WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Menu Validé Khady's Food & Event */}
      <section id="khadys-food" className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              👑 Restaurant Fondateur • Ouvert jusqu’à 22 h
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Menu Validé Khady&apos;s Food &amp; Event
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Quartier Koubia, Niamey &bull; Livraison rapide par taxi-moto ou à emporter
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://walahy.me/c/74441621"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white transition"
            >
              Catalogue Walahy ↗
            </a>
            <a
              href="https://khadysfood.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 transition"
            >
              Site Officiel ↗
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {KHADYS_DISHES.map((dish) => (
            <DishCard
              key={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              imageSrc={dish.imageSrc}
              badge={dish.badge}
              optionsHint={dish.optionsHint}
              onAddToCart={() => handleAddToCart(dish.name)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
