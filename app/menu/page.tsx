'use client';

import React, { useState } from 'react';

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
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <a href="/" className="flex items-center gap-2 text-white font-black text-lg">
            <span className="text-2xl">🍲</span> Allôresto Niamey
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <span>🛒 Panier</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-white text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
          </div>
        </header>

        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 md:p-8 text-slate-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-black">Carte des Plats &amp; Spécialités de Niamey</h1>
            <p className="text-xs md:text-sm font-medium mt-1 text-slate-900">
              Commandez en ligne et faites-vous livrer en 30 minutes par Billo Express
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-950 text-orange-400 text-xs font-black">
            Livraison 1 000 FCFA
          </span>
        </div>

        {/* Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-black shadow-2xl flex items-center gap-2">
            <span>✓ {addedToast} ajouté au panier !</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un plat, grillade, restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dish) => (
            <div
              key={dish.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition"
            >
              <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 border border-slate-700">
                  {dish.restaurant_name} ({dish.district})
                </div>
                <div className="absolute top-3 right-3 bg-orange-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg">
                  {dish.price.toLocaleString()} FCFA
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-sm">{dish.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>~{dish.preparation_time_min} min</span>
                  </span>
                  <span className="text-emerald-400 font-bold">Livré par Billo Express</span>
                </div>

                <button
                  onClick={() => handleAddToCart(dish)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-orange-500/20"
                >
                  Ajouter au Panier 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
