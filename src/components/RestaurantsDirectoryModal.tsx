'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Store,
  Search,
  MapPin,
  Star,
  Clock,
  Bike,
  Sparkles,
  Flame,
  ChevronRight,
  Phone,
  UtensilsCrossed,
  Filter,
  CheckCircle2,
  Share2,
  Calendar,
  ShieldCheck,
  Globe,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Restaurant, ServiceMode } from '../types';
import { shareRestaurantOnWhatsApp } from '../utils/whatsappNotifications';

interface RestaurantsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  serviceMode: ServiceMode;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBookTable?: (restaurant: Restaurant) => void;
}

export const RestaurantsDirectoryModal: React.FC<RestaurantsDirectoryModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  serviceMode,
  onSelectRestaurant,
  onBookTable,
}) => {
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  // Synchroniser l'URL avec /restaurants
  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      if (!window.location.pathname.startsWith('/restaurants')) {
        window.history.pushState({ modal: 'restaurants' }, '', '/restaurants');
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/restaurants')) {
      window.history.pushState({}, '', '/');
    }
    onClose();
  };

  const neighborhoods = [
    { id: 'all', label: 'Tous les Quartiers' },
    { id: 'Plateau', label: 'Plateau (Ministères)' },
    { id: 'Yantala', label: 'Yantala & Corniche' },
    { id: 'Koubia', label: 'Koubia' },
    { id: 'Harobanda', label: 'Harobanda' },
    { id: 'Goudel', label: 'Goudel' },
    { id: 'Recasement', label: 'Recasement' },
  ];

  const cuisines = [
    { id: 'all', label: 'Toutes les Spécialités' },
    { id: 'khadys', label: '👑 Khady’s Food & Event' },
    { id: 'nigerienne', label: '🇳🇪 Cuisine Nigérienne' },
    { id: 'grillades', label: '🔥 Grillades & Choukouya' },
    { id: 'poisson', label: '🐟 Poissons du Fleuve' },
    { id: 'fastfood', label: '🍔 Fast-Food & Burgers' },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((resto) => {
      // Filtre par quartier
      if (selectedNeighborhood !== 'all') {
        const addr = (resto.address + ' ' + resto.city).toLowerCase();
        if (!addr.includes(selectedNeighborhood.toLowerCase())) {
          return false;
        }
      }

      // Filtre par cuisine
      if (selectedCuisine !== 'all' && resto.cuisineCategory !== selectedCuisine) {
        return false;
      }

      // Recherche texte
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = resto.name.toLowerCase().includes(q);
        const matchCuisine = resto.cuisine.toLowerCase().includes(q);
        const matchCity = (resto.city || '').toLowerCase().includes(q);
        const matchAddress = resto.address.toLowerCase().includes(q);
        const matchDish = resto.menu.some((m) => m.name.toLowerCase().includes(q));
        if (!matchName && !matchCuisine && !matchCity && !matchAddress && !matchDish) {
          return false;
        }
      }

      return true;
    });
  }, [restaurants, search, selectedNeighborhood, selectedCuisine]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white">
                  Restaurants Partenaires à Niamey
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] sm:text-xs font-black">
                  {filteredRestaurants.length} établissement{filteredRestaurants.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Découvrez la liste complète des restaurants partenaires, leurs adresses à Niamey et leurs menus
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche & Filtres */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom de restaurant, spécialité, quartier (Plateau, Yantala, Koubia)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Filtres Quartiers & Cuisines */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            {/* Quartiers */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span>Quartier :</span>
              </span>
              {neighborhoods.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNeighborhood(n.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedNeighborhood === n.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            {/* Cuisines */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-amber-400" />
                <span>Cuisine :</span>
              </span>
              {cuisines.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCuisine(c.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCuisine === c.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des restaurants */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Store className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Aucun restaurant trouvé</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Aucun établissement ne correspond à vos critères de recherche. Réinitialisez les filtres pour voir les 8 partenaires.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedNeighborhood('all');
                  setSelectedCuisine('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.map((resto) => (
                <div
                  key={resto.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all p-4 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Image & Badges */}
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={resto.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"}
                        alt={resto.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                        {resto.isPartnerCertified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 shadow-md flex items-center gap-1 border border-amber-300/40">
                            <ShieldCheck className="w-3 h-3 fill-slate-950 text-amber-200" />
                            <span>Partenaire Certifié</span>
                          </span>
                        )}
                        {resto.promoBadge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-current" />
                            <span>{resto.promoBadge}</span>
                          </span>
                        )}
                        {resto.isPromoted && !resto.isPartnerCertified && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Sélection Allôresto</span>
                          </span>
                        )}
                      </div>

                      {/* Quick WhatsApp Share */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareRestaurantOnWhatsApp(resto);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md cursor-pointer"
                        title="Partager sur WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delivery & Rating */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-950/90 backdrop-blur-md text-slate-200 border border-slate-800 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-orange-400" />
                          <span>{resto.deliveryTime}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-lg bg-slate-950/90 backdrop-blur-md text-amber-400 border border-slate-800 flex items-center gap-1 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{resto.rating}</span>
                          <span className="text-slate-400 text-[9px]">({resto.reviewCount})</span>
                        </span>
                      </div>
                    </div>

                    {/* Infos textuelles */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-black text-white group-hover:text-blue-400 transition">
                          {resto.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                          {resto.cuisine}
                        </span>
                      </div>

                      <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{resto.address}</span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Bike className="w-3 h-3 text-cyan-400" />
                          <span>Frais livraison : <strong className="text-slate-200">{resto.deliveryFee} FCFA</strong></span>
                        </span>
                        <span>&bull;</span>
                        <span>Min. commande : <strong className="text-slate-200">{resto.minOrder} FCFA</strong></span>
                        <span>&bull;</span>
                        <span className="text-emerald-400 font-semibold">{resto.menu.length} plats au menu</span>
                      </div>

                      {/* Liens Partenaire Directs */}
                      {(resto.websiteUrl || resto.onlineCatalogUrl) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                          {resto.websiteUrl && (
                            <a
                              href={resto.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 hover:text-white text-[10px] font-bold transition active:scale-95 shadow-sm"
                              title={`Site officiel & App de ${resto.name}`}
                            >
                              <Globe className="w-3 h-3 text-orange-400 shrink-0" />
                              <span>Site Officiel &amp; App</span>
                              <ExternalLink className="w-2.5 h-2.5 text-orange-400/80 shrink-0" />
                            </a>
                          )}
                          {resto.onlineCatalogUrl && (
                            <a
                              href={resto.onlineCatalogUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] font-bold transition active:scale-95 shadow-sm"
                              title={`Catalogue en ligne de ${resto.name}`}
                            >
                              <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>Catalogue WhatsApp</span>
                              <ExternalLink className="w-2.5 h-2.5 text-emerald-400/80 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions boutons */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {resto.services?.includes('booking') && onBookTable && (
                      <button
                        onClick={() => {
                          onClose();
                          onBookTable(resto);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Réserver table</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onClose();
                        onSelectRestaurant(resto);
                      }}
                      className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Ouvrir le Menu &amp; Commander</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tous nos restaurants respectent les normes d'hygiène et les protocoles de livraison rapide à Niamey.</span>
          </div>
          <span className="font-bold text-slate-300">
            Livraisons assurées par Billo Express 🛵
          </span>
        </div>
      </div>
    </div>
  );
};
