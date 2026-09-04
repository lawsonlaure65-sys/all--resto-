'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../src/services/supabaseClient';

interface Driver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicle_type: 'moto' | 'scooter' | 'velo_electrique';
  license_plate?: string;
  zone: string;
  status: 'available' | 'on_delivery' | 'offline';
  is_active: boolean;
  total_deliveries: number;
  rating: number;
  today_earnings: number;
  created_at?: string;
}

const SAMPLE_DRIVERS: Driver[] = [
  {
    id: 'drv-01',
    name: 'Moussa Ibrahim',
    phone: '+227 96 12 34 56',
    email: 'moussa.billo@alloresto.ne',
    vehicle_type: 'moto',
    license_plate: 'RN-8821-B',
    zone: 'Plateau / Centre-Ville',
    status: 'available',
    is_active: true,
    total_deliveries: 342,
    rating: 4.9,
    today_earnings: 14500,
  },
  {
    id: 'drv-02',
    name: 'Abdoulaye Garba',
    phone: '+227 90 45 67 89',
    email: 'garba.billo@alloresto.ne',
    vehicle_type: 'moto',
    license_plate: 'RN-5412-A',
    zone: 'Harobanda / Université',
    status: 'on_delivery',
    is_active: true,
    total_deliveries: 418,
    rating: 4.8,
    today_earnings: 18000,
  },
  {
    id: 'drv-03',
    name: 'Oumarou Sani',
    phone: '+227 94 33 22 11',
    email: 'sani.billo@alloresto.ne',
    vehicle_type: 'scooter',
    license_plate: 'RN-3109-C',
    zone: 'Ryad / Koira Kano',
    status: 'available',
    is_active: true,
    total_deliveries: 195,
    rating: 4.95,
    today_earnings: 9500,
  },
  {
    id: 'drv-04',
    name: 'Idrissa Mahamadou',
    phone: '+227 89 77 66 55',
    email: 'idrissa.billo@alloresto.ne',
    vehicle_type: 'moto',
    license_plate: 'RN-9012-D',
    zone: 'Koubia / Francophonie',
    status: 'offline',
    is_active: true,
    total_deliveries: 280,
    rating: 4.7,
    today_earnings: 0,
  },
  {
    id: 'drv-05',
    name: 'Souleymane Daouda',
    phone: '+227 92 11 44 77',
    email: 'souley.billo@alloresto.ne',
    vehicle_type: 'velo_electrique',
    license_plate: 'N/A',
    zone: 'Plateau Express',
    status: 'available',
    is_active: true,
    total_deliveries: 88,
    rating: 4.85,
    today_earnings: 6000,
  },
];

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(SAMPLE_DRIVERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'on_delivery' | 'offline'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    zone: 'Plateau / Centre-Ville',
    vehicle_type: 'moto' as 'moto' | 'scooter' | 'velo_electrique',
    license_plate: '',
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setDrivers(data);
        }
      }
    } catch (e) {
      console.warn('Utilisation livreurs locaux:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;

    const created: Driver = {
      id: `drv-${Date.now()}`,
      name: newDriver.name,
      phone: newDriver.phone,
      zone: newDriver.zone,
      vehicle_type: newDriver.vehicle_type,
      license_plate: newDriver.license_plate || 'RN-TEMP',
      status: 'available',
      is_active: true,
      total_deliveries: 0,
      rating: 5.0,
      today_earnings: 0,
      created_at: new Date().toISOString(),
    };

    setDrivers((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewDriver({
      name: '',
      phone: '',
      zone: 'Plateau / Centre-Ville',
      vehicle_type: 'moto',
      license_plate: '',
    });
  };

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = drivers.filter((d) => d.is_active).length;
  const totalAvailable = drivers.filter((d) => d.status === 'available').length;
  const totalOnDelivery = drivers.filter((d) => d.status === 'on_delivery').length;
  const totalDailyEarnings = drivers.reduce((acc, d) => acc + (d.today_earnings || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛵</span>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Flotte des Livreurs Billo Express
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supervision des coursiers actifs à Niamey, assignation et performances
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <span>➕ Nouveau Livreur</span>
            </button>
            <a
              href="/app/admin/dashboard"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📊 Dashboard</span>
            </a>
            <a
              href="/app/admin/orders"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>📦 Commandes</span>
            </a>
            <a
              href="/app/admin/settings"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <span>⚙️ Paramètres</span>
            </a>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Livreurs Inscrits</span>
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm">👥</span>
            </div>
            <div className="text-2xl font-black text-white mt-2">{drivers.length}</div>
            <div className="text-[11px] text-emerald-400 mt-1">{totalActive} comptes actifs</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Disponibles (Prêts)</span>
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm">🟢</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">{totalAvailable}</div>
            <div className="text-[11px] text-slate-400 mt-1">En attente d'une commande</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">En Course Active</span>
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 text-sm">🛵</span>
            </div>
            <div className="text-2xl font-black text-orange-400 mt-2">{totalOnDelivery}</div>
            <div className="text-[11px] text-slate-400 mt-1">Livraisons en transit</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Gains Distribués (Jour)</span>
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm">💰</span>
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2">
              {totalDailyEarnings.toLocaleString()} FCFA
            </div>
            <div className="text-[11px] text-slate-400 mt-1">100% conservé par la flotte</div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, quartier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'available', 'on_delivery', 'offline'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {st === 'all' && 'Tous'}
                {st === 'available' && '🟢 Prêts'}
                {st === 'on_delivery' && '🛵 En course'}
                {st === 'offline' && '⚪ Déconnectés'}
              </button>
            ))}
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Livreur</th>
                  <th className="py-3.5 px-4">Téléphone</th>
                  <th className="py-3.5 px-4">Zone Affectée</th>
                  <th className="py-3.5 px-4">Véhicule</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Courses &amp; Note</th>
                  <th className="py-3.5 px-4">Gains Jour</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-black">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <div>{driver.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{driver.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <a href={`tel:${driver.phone}`} className="hover:text-orange-400 transition">
                        {driver.phone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{driver.zone}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px]">
                        {driver.vehicle_type === 'moto' && '🏍️ Moto'}
                        {driver.vehicle_type === 'scooter' && '🛵 Scooter'}
                        {driver.vehicle_type === 'velo_electrique' && '⚡ Vélo Électrique'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          driver.status === 'available'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : driver.status === 'on_delivery'
                            ? 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {driver.status === 'available' && 'Disponible'}
                        {driver.status === 'on_delivery' && 'En course'}
                        {driver.status === 'offline' && 'Hors ligne'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{driver.total_deliveries} courses</div>
                      <div className="text-[10px] text-amber-400 font-bold">★ {driver.rating} / 5.0</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {driver.today_earnings.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(driver.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          driver.is_active
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {driver.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Ajouter Nouveau Livreur */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Ajouter un Livreur Billo Express</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddDriver} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nom Complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Abdoul Razak"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Téléphone (Niger)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+227 9X XX XX XX"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Zone de Référence</label>
                  <select
                    value={newDriver.zone}
                    onChange={(e) => setNewDriver({ ...newDriver, zone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Plateau / Centre-Ville">Plateau / Centre-Ville</option>
                    <option value="Harobanda / Université">Harobanda / Université</option>
                    <option value="Ryad / Koira Kano">Ryad / Koira Kano</option>
                    <option value="Koubia / Francophonie">Koubia / Francophonie</option>
                    <option value="Banifandou / Yantala">Banifandou / Yantala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Type de Véhicule</label>
                  <select
                    value={newDriver.vehicle_type}
                    onChange={(e) =>
                      setNewDriver({
                        ...newDriver,
                        vehicle_type: e.target.value as 'moto' | 'scooter' | 'velo_electrique',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="moto">🏍️ Moto</option>
                    <option value="scooter">🛵 Scooter</option>
                    <option value="velo_electrique">⚡ Vélo Électrique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Immatriculation</label>
                  <input
                    type="text"
                    placeholder="Ex: RN-1234-A"
                    value={newDriver.license_plate}
                    onChange={(e) => setNewDriver({ ...newDriver, license_plate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Enregistrer
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
