import React, { useState } from "react";
import {
  Users,
  Clock,
  Share2,
  Check,
  Plus,
  Trash2,
  Bike,
  Sparkles,
  Building2,
  X,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import { GroupOrderSession, Restaurant, MenuItem } from "../types";
import { RESTAURANTS_DATA } from "../data/allorestoData";

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRestaurantMenu: (restaurant: Restaurant) => void;
  onAddToCartForParticipant?: (item: MenuItem, participantName: string) => void;
}

export const GroupOrderModal: React.FC<GroupOrderModalProps> = ({
  isOpen,
  onClose,
  onSelectRestaurantMenu,
}) => {
  const [activeSession, setActiveSession] = useState<GroupOrderSession>({
    id: "grp-session-1",
    code: "PLATEAU-DEJ-402",
    title: "Déjeuner Direction Financière & Trésor (Plateau)",
    creatorName: "Amadou Seyni",
    restaurantId: "resto-khadys-food",
    restaurantName: "Khady's Food — La Référence Sahélienne",
    cutoffTime: "11:45",
    deliveryAddress: "Immeuble Ministériel, 3ème étage, Bureau 304, Plateau, Niamey",
    scheduledTime: "12:30",
    isActive: true,
    members: [
      { id: "m-1", name: "Amadou Seyni", department: "Chef de Division", itemsCount: 2, subtotal: 5200 },
      { id: "m-2", name: "Mariama Souley", department: "Trésorerie", itemsCount: 1, subtotal: 3500 },
      { id: "m-3", name: "Ousseini K.", department: "Comptabilité", itemsCount: 2, subtotal: 4200 },
    ],
  });

  const [newMemberName, setNewMemberName] = useState("");
  const [newDepartment, setNewDepartment] = useState("Cabinet / Bureau");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("Pause Déjeuner Bureau Ministère");
  const [newCutoffTime, setNewCutoffTime] = useState("11:45");
  const [newScheduledTime, setNewScheduledTime] = useState("12:30");
  const [selectedRestoId, setSelectedRestoId] = useState("resto-khadys-food");

  if (!isOpen) return null;

  const totalGroupAmount = activeSession.members.reduce((sum, m) => sum + m.subtotal, 0);
  const totalItemsCount = activeSession.members.reduce((sum, m) => sum + m.itemsCount, 0);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(
      `https://alloresto.ne/groupe/${activeSession.code}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newM = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      department: newDepartment.trim(),
      itemsCount: 1,
      subtotal: 3200,
    };
    setActiveSession((prev) => ({
      ...prev,
      members: [...prev.members, newM],
    }));
    setNewMemberName("");
  };

  const handleRemoveMember = (id: string) => {
    setActiveSession((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenResto = RESTAURANTS_DATA.find((r) => r.id === selectedRestoId) || RESTAURANTS_DATA[0];
    const newCode = `NIAMEY-${Math.floor(100 + Math.random() * 900)}`;
    setActiveSession({
      id: `grp-${Date.now()}`,
      code: newCode,
      title: newSessionTitle,
      creatorName: "Vous",
      restaurantId: chosenResto.id,
      restaurantName: chosenResto.name,
      cutoffTime: newCutoffTime,
      deliveryAddress: "Plateau, Immeuble Administratif, Niamey",
      scheduledTime: newScheduledTime,
      isActive: true,
      members: [
        { id: "m-user", name: "Vous (Organisateur)", department: "Mon Bureau", itemsCount: 1, subtotal: 3500 },
      ],
    });
    setIsCreatingNew(false);
  };

  const currentResto = RESTAURANTS_DATA.find((r) => r.id === activeSession.restaurantId) || RESTAURANTS_DATA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">Commande de Groupe Bureaux</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Midi au Bureau
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chaque collègue choisit son plat avant l'heure limite &bull; Une seule livraison unifiée par Billo Express
            </p>
          </div>
        </div>

        {!isCreatingNew ? (
          <>
            {/* Active Session Info Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-orange-500/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                    Session Collective Active
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-white">{activeSession.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeSession.deliveryAddress}</span>
                  </div>
                </div>
                <div className="text-right bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Code de partage</span>
                  <span className="text-sm font-black text-orange-400 font-mono tracking-wider">
                    #{activeSession.code}
                  </span>
                </div>
              </div>

              {/* Timing & Restaurant badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Clôture des ajouts</span>
                    <span className="text-xs font-bold text-white">{activeSession.cutoffTime} (avant midi)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Bike className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Livraison prévue</span>
                    <span className="text-xs font-bold text-cyan-300">{activeSession.scheduledTime} pile au bureau</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <ChefHat className="w-4 h-4 text-orange-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block">Restaurant sélectionné</span>
                    <span className="text-xs font-bold text-orange-300 truncate block">
                      {activeSession.restaurantName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share link CTA */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Lien copié dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-orange-400" />
                      <span>Copier le lien d'invitation pour vos collègues</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700"
                >
                  Nouvelle session
                </button>
              </div>
            </div>

            {/* Participants list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>Collègues inscrits ({activeSession.members.length})</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-orange-400 font-mono">
                    {totalItemsCount} plats choisis
                  </span>
                </h4>
                <span className="text-xs font-black text-emerald-400">
                  Total groupe : {totalGroupAmount.toLocaleString()} FCFA
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeSession.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{member.name}</h5>
                        <span className="text-[10px] text-slate-400 block">{member.department}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 block">
                          {member.subtotal.toLocaleString()} FCFA
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {member.itemsCount} plat(s)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Retirer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add member quick form */}
              <form onSubmit={handleAddMember} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Nom du collègue (ex: Oumarou - Bureau 204)"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Facture unifiée &bull; Frais de livraison offerts dès 10 000 FCFA</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onSelectRestaurantMenu(currentResto);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition cursor-pointer"
              >
                <span>Ajouter mes plats chez {currentResto.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Create New Group Session View */
          <form onSubmit={handleCreateSession} className="space-y-4">
            <h4 className="text-base font-black text-white">Créer une session de groupe au bureau</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Nom du groupe / Service *
                </label>
                <input
                  type="text"
                  required
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="Ex: Déjeuner Ministère des Finances - 3ème étage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Restaurant partenaire pour la commande groupée *
                </label>
                <select
                  value={selectedRestoId}
                  onChange={(e) => setSelectedRestoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  {RESTAURANTS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.cuisine} ({r.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Heure limite d'ajout *
                  </label>
                  <select
                    value={newCutoffTime}
                    onChange={(e) => setNewCutoffTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="11:30">11h30 (Très matinal)</option>
                    <option value="11:45">11h45 (Recommandé)</option>
                    <option value="12:00">12h00 (Dernière minute)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Livraison souhaitée au bureau *
                  </label>
                  <select
                    value={newScheduledTime}
                    onChange={(e) => setNewScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="12:15">12h15</option>
                    <option value="12:30">12h30 (Pause midi classique)</option>
                    <option value="12:45">12h45</option>
                    <option value="13:00">13h00</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition"
              >
                Lancer la session collective
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
