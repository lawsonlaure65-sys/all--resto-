'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Store,
  UtensilsCrossed,
  Clock,
  Star,
  ArrowLeft,
  ShieldCheck,
  Globe,
  BookOpen,
  ExternalLink,
  Bike,
  X,
  Phone,
  Calendar,
} from 'lucide-react';
import { Restaurant, ServiceMode } from '../../src/types';
import { loadStoredRestaurants } from '../../src/services/dishStorageService';
import { getSupabaseClient } from '../../src/services/supabaseClient';

export interface RestaurantsPageProps {
  onBackHome?: () => void;
  onOpenMenu?: (restaurant: Restaurant) => void;
  onBookTable?: (restaurant: Restaurant) => void;
}

// Helper pour extraire le quartier à partir de l'adresse ou de la ville
function getRestaurantQuartier(resto: Restaurant): string {
  if (resto.quartier) return resto.quartier;
  const combined = `${resto.address} ${resto.city}`.toLowerCase();
  if (combined.includes('plateau')) return 'Plateau';
  if (combined.includes('yantala')) return 'Yantala';
  if (combined.includes('koubia')) return 'Koubia';
  if (combined.includes('harobanda')) return 'Harobanda';
  if (combined.includes('goudel')) return 'Goudel';
  if (combined.includes('recasement')) return 'Recasement';
  if (combined.includes('dar-es-salam') || combined.includes('dar es salam')) return 'Dar-es-Salam';
  if (combined.includes('francophonie')) return 'Village Francophonie';
  return resto.city.split('-')[0].trim() || 'Niamey';
}

export default function RestaurantsPage({
  onBackHome,
  onOpenMenu,
  onBookTable,
}: RestaurantsPageProps = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [quartier, setQuartier] = useState('');
  const [cuisine, setCuisine] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chargement des restaurants (Supabase avec repli robuste sur données locales)
  useEffect(() => {
    let isMounted = true;

    async function loadAllRestaurants() {
      setLoading(true);
      setError('');

      try {
        // 1. Initialiser avec les données locales stockées
        const localData = loadStoredRestaurants();
        if (isMounted && localData && localData.length > 0) {
          setRestaurants(localData);
        }

        // 2. Si le client Supabase est connecté, tenter de synchroniser
        const client = getSupabaseClient();
        if (client) {
          try {
            const { data, error: supaError } = await client
              .from('restaurants')
              .select('*')
              .order('name', { ascending: true });

            if (supaError) {
              console.warn('Supabase non disponible, utilisation du stock local:', supaError.message);
            } else if (data && data.length > 0 && isMounted) {
              // Mapper les colonnes Supabase potentielles
              const mapped: Restaurant[] = data.map((item: any) => {
                const localMatch = localData.find((l) => l.id === (item.id || item.restaurant_id));
                return {
                  id: item.id || item.restaurant_id || `resto-${Date.now()}`,
                  name: item.name || item.restaurant_name || localMatch?.name || 'Restaurant',
                  tagline: item.description || item.tagline || localMatch?.tagline || '',
                  cuisine: item.cuisine || localMatch?.cuisine || 'Cuisine variée',
                  cuisineCategory: item.cuisine_category || item.category || localMatch?.cuisineCategory || 'divers',
                  rating: Number(item.rating || localMatch?.rating || 4.8),
                  reviewCount: Number(item.review_count || localMatch?.reviewCount || 100),
                  deliveryTime: item.delivery_time || localMatch?.deliveryTime || '30-45 min',
                  minOrder: Number(item.min_order || localMatch?.minOrder || 1500),
                  deliveryFee: Number(item.delivery_fee || localMatch?.deliveryFee || 1000),
                  address: item.address || localMatch?.address || 'Niamey',
                  city: item.city || localMatch?.city || 'Niamey',
                  quartier: item.quartier || item.district || localMatch?.quartier,
                  image: item.image_url || item.image || localMatch?.image || '',
                  bannerImage: item.banner_image || localMatch?.bannerImage || '',
                  isOpen: item.is_open ?? item.isOpen ?? localMatch?.isOpen ?? true,
                  openingHours: item.opening_hours || localMatch?.openingHours || '08h00 - 23h00',
                  phone: item.phone || localMatch?.phone || '+227 96 05 23 10',
                  services: (item.services || localMatch?.services || ['delivery', 'takeaway']) as ServiceMode[],
                  menu: item.menu || localMatch?.menu || [],
                  websiteUrl: item.website_url || localMatch?.websiteUrl,
                  onlineCatalogUrl: item.online_catalog_url || localMatch?.onlineCatalogUrl,
                  isPartnerCertified: item.is_partner_certified ?? localMatch?.isPartnerCertified,
                  partnerStatusBadge: item.partner_status_badge || localMatch?.partnerStatusBadge,
                  isPromoted: item.is_promoted ?? localMatch?.isPromoted,
                  promoBadge: item.promo_badge || localMatch?.promoBadge,
                };
              });

              setRestaurants(mapped);
            }
          } catch (fetchErr: any) {
            console.warn('Erreur appel Supabase:', fetchErr?.message);
          }
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des restaurants:', err);
        setError('Impossible de charger les restaurants.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAllRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  // Liste unique des quartiers calculée dynamiquement
  const quartiers = useMemo(() => {
    const list = new Set<string>();
    restaurants.forEach((r) => {
      const q = getRestaurantQuartier(r);
      if (q) list.add(q);
    });
    // Garantir la présence des quartiers majeurs de Niamey
    ['Plateau', 'Yantala', 'Koubia', 'Harobanda', 'Goudel', 'Recasement'].forEach((item) => list.add(item));
    return Array.from(list).sort();
  }, [restaurants]);

  // Liste unique des types de cuisines
  const cuisinesList = useMemo(() => {
    return [
      { id: 'all', label: 'Toutes les Spécialités' },
      { id: 'khadys', label: "👑 Khady's Food & Event" },
      { id: 'africaine', label: '🍲 Dambou, Riz au Gras & Terroir' },
      { id: 'braises', label: '🔥 Choukouya & Grillades' },
      { id: 'poisson', label: '🐟 Poissons du Fleuve Niger' },
      { id: 'burgers', label: '🍔 Burgers & Fast-Food' },
    ];
  }, []);

  // Filtrage combiné : Recherche + Quartier + Spécialité
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // 1. Recherche texte (nom, description, quartier, menu)
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        restaurant.name.toLowerCase().includes(q) ||
        (restaurant.tagline && restaurant.tagline.toLowerCase().includes(q)) ||
        restaurant.cuisine.toLowerCase().includes(q) ||
        restaurant.address.toLowerCase().includes(q) ||
        (restaurant.menu && restaurant.menu.some((m) => m.name.toLowerCase().includes(q)));

      // 2. Filtre Quartier
      const restoQuartier = getRestaurantQuartier(restaurant).toLowerCase();
      const matchesQuartier =
        !quartier ||
        restoQuartier === quartier.toLowerCase() ||
        restaurant.address.toLowerCase().includes(quartier.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(quartier.toLowerCase());

      // 3. Filtre Cuisine
      const matchesCuisine =
        cuisine === 'all' ||
        restaurant.cuisineCategory === cuisine ||
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase());

      return matchesSearch && matchesQuartier && matchesCuisine;
    });
  }, [restaurants, search, quartier, cuisine]);

  // Gestion du retour à l'accueil
  const handleBack = () => {
    if (onBackHome) {
      onBackHome();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Navigation & En-tête */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 hover:underline transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l’accueil</span>
          </button>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Restaurants à Niamey
                </h1>
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-orange-400 text-xs font-black">
                  {filteredRestaurants.length} restaurant{filteredRestaurants.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="mt-2 text-sm sm:text-base text-slate-400">
                Choisissez un restaurant et commandez vos plats préférés livrés chez vous par Billo Express.
              </p>
            </div>

            {/* Accès rapide raccourci */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-orange-400" />
                <span>Livraison Billo Express 45 min</span>
              </span>
            </div>
          </div>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="mb-8 grid gap-3 sm:gap-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl md:grid-cols-12">
          {/* Champ de recherche */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Rechercher un restaurant ou un plat..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtre par quartier */}
          <div className="md:col-span-3">
            <div className="relative">
              <MapPin className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={quartier}
                onChange={(event) => setQuartier(event.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-8 py-3 text-sm text-white outline-none focus:border-orange-500 transition cursor-pointer"
              >
                <option value="">Tous les quartiers</option>
                {quartiers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtre par cuisine */}
          <div className="md:col-span-3">
            <div className="relative">
              <UtensilsCrossed className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={cuisine}
                onChange={(event) => setCuisine(event.target.value)}
                className="w-full appearance-none rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-8 py-3 text-sm text-white outline-none focus:border-orange-500 transition cursor-pointer"
              >
                {cuisinesList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold">Chargement des restaurants de Niamey...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && (
          <div className="mb-6 rounded-2xl bg-red-950/60 border border-red-800 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center shadow-xl space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Aucun restaurant ne correspond à votre recherche
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Modifiez vos mots-clés ou réinitialisez le filtre par quartier pour voir tous les établissements de Niamey.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setQuartier('');
                setCuisine('all');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-orange-400 transition cursor-pointer text-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Grille des restaurants */}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => {
              const currentQuartier = getRestaurantQuartier(restaurant);

              return (
                <article
                  key={restaurant.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800/90 shadow-lg hover:border-slate-700 transition duration-200"
                >
                  {/* Image du restaurant ou placeholder */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-950/30 text-5xl">
                        🍽️
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Badges d'état et de partenariat */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {restaurant.isPartnerCertified && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 shadow-md flex items-center gap-1 border border-amber-300/40">
                          <ShieldCheck className="w-3.5 h-3.5 fill-slate-950 text-amber-200" />
                          <span>Partenaire Certifié</span>
                        </span>
                      )}
                      {restaurant.promoBadge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md">
                          {restaurant.promoBadge}
                        </span>
                      )}
                    </div>

                    {/* Statut Ouvert ou Fermé */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-md flex items-center gap-1.5 ${
                          restaurant.isOpen
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            restaurant.isOpen ? 'bg-slate-950 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        <span>{restaurant.isOpen ? 'Ouvert' : 'Fermé'}</span>
                      </span>
                    </div>

                    {/* Note et temps de livraison */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl font-bold text-amber-300 border border-white/10">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                        <span className="text-slate-400 text-[10px]">({restaurant.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl font-bold text-slate-200 border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu et informations */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-white group-hover:text-orange-400 transition leading-snug">
                        {restaurant.name}
                      </h2>
                    </div>

                    {/* Quartier */}
                    {currentQuartier && (
                      <p className="mt-2 text-xs font-bold text-orange-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{currentQuartier} &bull; {restaurant.address}</span>
                      </p>
                    )}

                    {/* Spécialité et Description */}
                    {restaurant.tagline && (
                      <p className="mt-2.5 line-clamp-2 text-xs text-slate-400 leading-relaxed">
                        {restaurant.tagline}
                      </p>
                    )}

                    {/* Liens Directs Partenaire (ex: Khady's Food) */}
                    {(restaurant.websiteUrl || restaurant.onlineCatalogUrl) && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {restaurant.websiteUrl && (
                          <a
                            href={restaurant.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 hover:text-white text-[10px] font-bold transition shadow-sm"
                            title={`Site officiel & App de ${restaurant.name}`}
                          >
                            <Globe className="w-3 h-3 text-orange-400 shrink-0" />
                            <span>Site Officiel &amp; App</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
                          </a>
                        )}
                        {restaurant.onlineCatalogUrl && (
                          <a
                            href={restaurant.onlineCatalogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] font-bold transition shadow-sm"
                            title={`Catalogue en ligne de ${restaurant.name}`}
                          >
                            <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>Catalogue Walahy</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions : Voir le menu & Réservation */}
                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onOpenMenu) {
                            onOpenMenu(restaurant);
                          } else {
                            window.location.href = `/?restaurant=${restaurant.id}`;
                          }
                        }}
                        className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-center font-bold text-slate-950 text-xs sm:text-sm transition active:scale-95 cursor-pointer shadow-md shadow-orange-500/20"
                      >
                        Voir le menu
                      </button>

                      {restaurant.services?.includes('booking') && onBookTable && (
                        <button
                          onClick={() => onBookTable(restaurant)}
                          className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                          title="Réserver une table"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
