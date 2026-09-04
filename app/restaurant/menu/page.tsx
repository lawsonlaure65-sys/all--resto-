'use client';

import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  preparation_time_min: number;
  calories?: number;
  spicy_level?: number;
}

const DEFAULT_DISHES: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Choukouya de Mouton Royal du Sahel',
    category: 'Grillades & Braises',
    price: 6500,
    description: 'Morceaux de mouton tendre du Sahel marinés aux épices Kan-Kan traditionnelles et oignons Galmi doux.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    preparation_time_min: 25,
    spicy_level: 2,
  },
  {
    id: 'dish-2',
    name: 'Dambou Blanc & Moringa Bio de Niamey',
    category: 'Plats Traditionnels',
    price: 3500,
    description: 'Semoule de riz vapeur fine, feuilles de moringa fraîches, morceaux de gésiers confits et sauce pimentée.',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    preparation_time_min: 15,
    spicy_level: 1,
  },
  {
    id: 'dish-3',
    name: 'Capitaine Grillé du Fleuve Niger',
    category: 'Poissons du Fleuve',
    price: 8000,
    description: 'Pavé de capitaine entier fraîchement pêché, braisé au charbon avec attiéké fondant et alloco doré.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    preparation_time_min: 30,
    spicy_level: 2,
  },
  {
    id: 'dish-4',
    name: 'Poulet Bicyclette Braisé Galmi',
    category: 'Grillades & Braises',
    price: 7500,
    description: 'Poulet local fermier entier mariné aux herbes du fleuve et moutarde douce de Galmi.',
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    is_available: false,
    preparation_time_min: 35,
    spicy_level: 1,
  },
  {
    id: 'dish-5',
    name: 'Jus de Bissap Sauvage à la Menthe Fraîche',
    category: 'Boissons & Jus Locaux',
    price: 1000,
    description: 'Infusion fraîche de fleurs d’hibiscus du Niger, menthe sauvage et pointe de gingembre.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    is_available: true,
    preparation_time_min: 5,
    spicy_level: 0,
  },
];

const CATEGORIES = [
  'Tous',
  'Grillades & Braises',
  'Plats Traditionnels',
  'Poissons du Fleuve',
  'Fast Food & Street Food',
  'Boissons & Jus Locaux',
  'Desserts & Pâtisseries',
];

export default function RestaurantMenuPage() {
  const [dishes, setDishes] = useState<MenuItem[]>(DEFAULT_DISHES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Grillades & Braises');
  const [formPrice, setFormPrice] = useState(3000);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formPrepTime, setFormPrepTime] = useState(20);

  useEffect(() => {
    // Charger depuis localStorage ou Supabase
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('restaurant_menu_dishes');
      if (saved) {
        try {
          setDishes(JSON.parse(saved));
        } catch (e) {
          console.warn('Erreur chargement menu local:', e);
        }
      }
    }
  }, []);

  const saveDishes = (newDishes: MenuItem[]) => {
    setDishes(newDishes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('restaurant_menu_dishes', JSON.stringify(newDishes));
    }
  };

  const handleToggleAvailable = (id: string) => {
    const updated = dishes.map((d) =>
      d.id === id ? { ...d, is_available: !d.is_available } : d
    );
    saveDishes(updated);
  };

  const openAddModal = () => {
    setEditingDish(null);
    setFormName('');
    setFormCategory('Grillades & Braises');
    setFormPrice(3500);
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80');
    setFormPrepTime(20);
    setIsModalOpen(true);
  };

  const openEditModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category);
    setFormPrice(dish.price);
    setFormDesc(dish.description);
    setFormImage(dish.image_url);
    setFormPrepTime(dish.preparation_time_min);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    if (editingDish) {
      const updated = dishes.map((d) =>
        d.id === editingDish.id
          ? {
              ...d,
              name: formName,
              category: formCategory,
              price: Number(formPrice),
              description: formDesc,
              image_url: formImage,
              preparation_time_min: Number(formPrepTime),
            }
          : d
      );
      saveDishes(updated);
    } else {
      const newDish: MenuItem = {
        id: `dish-${Date.now()}`,
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        description: formDesc,
        image_url: formImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        preparation_time_min: Number(formPrepTime),
      };
      saveDishes([newDish, ...dishes]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous supprimer ce plat de la carte ?')) {
      const updated = dishes.filter((d) => d.id !== id);
      saveDishes(updated);
    }
  };

  const filtered = dishes.filter((dish) => {
    const matchesCat = selectedCategory === 'Tous' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Gestion de la Carte &amp; des Plats
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Activez ou désactivez vos plats en temps réel pour éviter les ruptures en cuisine
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <span>➕ Ajouter un Plat</span>
            </button>
            <a
              href="/app/restaurant/dashboard"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>🍳 Cuisine (Commandes)</span>
            </a>
            <a
              href="/app/restaurant/stats"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📊 Statistiques</span>
            </a>
            <a
              href="/app/restaurant/plans"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>💳 Formule &amp; Tarifs</span>
            </a>
            <a
              href="/?role=restaurant"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              Vue Gérant
            </a>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un plat, ingrédient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid - Responsive 1 -> 2 -> 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((dish) => (
            <div
              key={dish.id}
              className={`bg-slate-900/90 border rounded-3xl overflow-hidden shadow-xl flex flex-col transition ${
                dish.is_available ? 'border-slate-800' : 'border-rose-900/40 opacity-75'
              }`}
            >
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 border border-slate-700">
                  {dish.category}
                </div>
                <div className="absolute top-3 right-3 bg-orange-500/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-950 shadow-lg">
                  {dish.price.toLocaleString()} FCFA
                </div>
                {!dish.is_available && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-black tracking-wider uppercase shadow-lg">
                      Rupture de Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{dish.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{dish.preparation_time_min} min</span>
                  </span>
                  <span
                    className={`font-bold text-[11px] ${
                      dish.is_available ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {dish.is_available ? '🟢 Disponible à la commande' : '🔴 Masqué aux clients'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleToggleAvailable(dish.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dish.is_available
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {dish.is_available ? 'Mettre en rupture' : 'Rendre disponible'}
                  </button>

                  <button
                    onClick={() => openEditModal(dish)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    title="Modifier"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition cursor-pointer"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Ajouter / Modifier Plat */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  {editingDish ? 'Modifier le plat' : 'Ajouter un nouveau plat au menu'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom du plat</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Choukouya Royal"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Catégorie</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {CATEGORIES.filter((c) => c !== 'Tous').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Prix (FCFA)</label>
                    <input
                      type="number"
                      required
                      min="500"
                      step="100"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Temps de préparation (min)</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description appétissante</label>
                  <textarea
                    rows={2}
                    placeholder="Détails, accompagnements, épices..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL de la photo</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    {editingDish ? 'Sauvegarder' : 'Ajouter le plat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
