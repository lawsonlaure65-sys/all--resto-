import React, { useState } from "react";
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Store,
  Bike,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Sparkles,
  Database,
} from "lucide-react";
import { RESTAURANTS_DATA } from "../data/allorestoData";

interface AdminDashboardProps {
  onOpenTechPack?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenTechPack }) => {
  const [partnerRequests, setPartnerRequests] = useState([
    {
      id: "REQ-901",
      name: "Le Dôme & Saveurs du Fleuve",
      owner: "Moussa Garba",
      city: "Niamey (Goudel)",
      cuisine: "Capitaine grillé & Riz Local",
      phone: "+227 96 55 44 33",
      status: "pending",
    },
    {
      id: "REQ-902",
      name: "Kebab & Chawarma de la Mosquée",
      owner: "Mariama Souley",
      city: "Niamey (Grande Mosquée)",
      cuisine: "Chawarmas & Grillades",
      phone: "+227 90 12 34 56",
      status: "pending",
    },
  ]);

  const handleApprove = (id: string) => {
    setPartnerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  const handleReject = (id: string) => {
    setPartnerRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Supervision Allôresto Niger 🇳🇪</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-500/40">
                Mode Administrateur HQ
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Suivi global des transactions Niamey, commissions plateforme, et agréments restaurants
            </p>
          </div>
        </div>

        {onOpenTechPack && (
          <button
            onClick={onOpenTechPack}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Pack Tech &amp; Schéma Supabase SQL</span>
          </button>
        )}
      </div>

      {/* Global Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Volume d&apos;affaires (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">22 850 000 FCFA</p>
          <span className="text-[10px] text-emerald-400 font-bold">+24.5% ce mois</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Commissions Allôresto (10%)</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">2 285 000 FCFA</p>
          <span className="text-[10px] text-purple-400 font-bold">Revenu net plateforme</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Restaurants Partenaires</span>
            <Store className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">{RESTAURANTS_DATA.length + 24}</p>
          <span className="text-[10px] text-slate-400">98% taux de satisfaction</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Flotte Livreurs Niamey</span>
            <Bike className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">85</p>
          <span className="text-[10px] text-cyan-400">Temps moyen d&apos;attribution : 35s</span>
        </div>
      </div>

      {/* Partner Approval Requests Queue */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Demandes d&apos;adhésion de nouveaux restaurants
          </h3>
          <span className="text-xs text-orange-400 font-semibold">
            {partnerRequests.filter((r) => r.status === "pending").length} en attente
          </span>
        </div>

        <div className="space-y-3">
          {partnerRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{req.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">({req.city})</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gérant : {req.owner} &bull; Spécialité : {req.cuisine} &bull; Tél : {req.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valider &amp; Activer</span>
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Refuser</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      req.status === "approved"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-950 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {req.status === "approved" ? "Agréé & Déployé" : "Refusé"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
