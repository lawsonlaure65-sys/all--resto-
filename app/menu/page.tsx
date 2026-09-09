'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Clock, Check, Sparkles, UtensilsCrossed } from 'lucide-react';

interface CatalogDish {
  id: string;
  name: string;
  restaurant_name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  preparation_time_min: number;
  district: string;
}

const ALL_DISHES: CatalogDish[] = [
  {
    id: 'd-1',
    name: 'Choukouya de Mouton Royal du Sahel',
    restaurant_name: 'Cuisine & Saveurs du Sahel',
    category: 'Grillades',
    price: 6500,
    description: 'Mouton tendre du Sahel mariné aux épices Kan-Kan traditionnelles et oignons Galmi doux.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 25,
    district: 'Plateau',
  },
  {
    id: 'd-2',
    name: 'Dambou Blanc & Moringa Bio de Niamey',
    restaurant_name: 'Le Dambou d’Or Niamey',
    category: 'Plats Traditionnels',
    price: 3500,
    description: 'Semoule de riz fine, feuilles de moringa fraîches, morceaux de gésiers confits.',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 15,
    district: 'Harobanda',
  },
  {
    id: 'd-3',
    name: 'Capitaine Grillé du Fleuve Niger',
    restaurant_name: 'Le Fleuve Gourmand',
    category: 'Poissons',
    price: 8000,
    description: 'Pavé de capitaine entier fraîchement pêché, braisé au charbon avec attiéké et alloco.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 30,
    district: 'Plateau',
  },
  {
    id: 'd-4',
    name: 'Poulet Bicyclette Braisé Galmi',
    restaurant_name: 'Grillades & Braises du Sahel',
    category: 'Grillades',
    price: 7500,
    description: 'Poulet local fermier entier mariné aux herbes du fleuve et moutarde douce.',
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 35,
    district: 'Koira Kano',
  },
  {
    id: 'd-5',
    name: 'Burger Sahel Double Steak & Cuku',
    restaurant_name: 'Fast Food Le Wadata',
    category: 'Fast Food',
    price: 4500,
    description: 'Pain brioché artisanal, double steak de boeuf haché local, fromage fondu et sauce maison.',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 15,
    district: 'Wadata',
  },
  {
    id: 'd-6',
    name: 'Jus de Bissap Sauvage à la Menthe Fraîche',
    restaurant_name: 'Cuisine & Saveurs du Sahel',
    category: 'Boissons',
    price: 1000,
    description: 'Infusion fraîche de fleurs d’hibiscus du Niger, menthe sauvage et pointe de gingembre.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    preparation_time_min: 5,
    district: 'Plateau',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 16,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
};

export default function MenuPublicPage() {
  const [selectedCat, setSelectedCat] = useState<string>('Tous');
  const [search, setSearch] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories = ['Tous', 'Grillades', 'Plats Traditionnels', 'Poissons', 'Fast Food', 'Boissons'];

  const handleAddToCart = (dish: CatalogDish) => {
    setCartCount((prev) => prev + 1);
    setAddedToast(dish.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const filtered = ALL_DISHES.filter((d) => {
    const matchesCat = selectedCat === 'Tous' || d.category === selectedCat;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.restaurant_name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <motion.header
          id="menu-header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800"
        >
          <a href="/" className="flex items-center gap-2 text-white font-black text-lg">
            <span className="text-2xl">🍲</span> Allôresto Niamey
          </a>

          <div className="flex items-center gap-3">
            <motion.a
              id="menu-cart-link"
              href="/"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Panier</span>
              <AnimatePresence mode="wait">
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                    className="w-5 h-5 rounded-full bg-slate-950 text-white text-[10px] font-black flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
          </div>
        </motion.header>

        {/* Banner */}
        <motion.div
          id="menu-hero-banner"
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 md:p-8 text-slate-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl md:text-3xl font-black">Carte des Plats &amp; Spécialités de Niamey</h1>
            <p className="text-xs md:text-sm font-medium mt-1 text-slate-900">
              Commandez en ligne et faites-vous livrer en 30 minutes par Billo Express
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-950 text-orange-400 text-xs font-black">
            Livraison 1 000 FCFA
          </span>
        </motion.div>

        {/* Toast */}
        <AnimatePresence>
          {addedToast && (
            <motion.div
              id="menu-toast-added"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black shadow-2xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{addedToast} ajouté au panier !</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.div
          id="menu-filter-bar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800"
        >
          <div className="relative flex-1">
            <input
              id="menu-search-input"
              type="text"
              placeholder="Rechercher un plat, grillade, restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                id={`category-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-orange-500 text-slate-950 shadow-sm font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dishes Grid with Staggered Framer-Motion Animations */}
        <motion.div
          id="menu-dishes-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((dish, index) => (
              <motion.div
                layout
                key={dish.id}
                id={`dish-card-${dish.id}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/50 hover:shadow-orange-500/10 transition-colors"
              >
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 border border-slate-700 shadow-sm">
                    {dish.restaurant_name} ({dish.district})
                  </div>
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 + index * 0.04 }}
                    className="absolute top-3 right-3 bg-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg"
                  >
                    {dish.price.toLocaleString()} FCFA
                  </motion.div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>~{dish.preparation_time_min} min</span>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Billo Express</span>
                    </span>
                  </div>

                  <motion.button
                    id={`add-to-cart-${dish.id}`}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleAddToCart(dish)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ajouter au Panier</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state when no dishes match */}
          {filtered.length === 0 && (
            <motion.div
              id="empty-menu-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="col-span-full py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-2xl text-slate-400">
                <UtensilsCrossed className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-base font-bold text-white">Aucun plat trouvé</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Aucune spécialité ne correspond à votre recherche &quot;{search}&quot; dans la catégorie {selectedCat}.
              </p>
              <motion.button
                id="reset-search-btn"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearch('');
                  setSelectedCat('Tous');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold transition cursor-pointer"
              >
                Réinitialiser les filtres
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
