import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Phone,
  Copy,
  Check,
  Smartphone,
  TrendingUp,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  PaymentRecord,
  PAYMENT_PROVIDERS,
  fetchAllPayments,
  updatePaymentStatus,
} from "../services/paymentService";

export const AdminPaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPayments();
      setPayments(data);
    } catch (err) {
      console.error("Error loading payments in admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProviderInfo = (method: string) => {
    return (
      PAYMENT_PROVIDERS.find((p) => p.id === method) || {
        name: method,
        logo: "💳",
        color: "bg-slate-700",
      }
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (paymentId: string, newStatus: "pending" | "completed" | "failed") => {
    updatePaymentStatus(paymentId, newStatus);
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, payment_status: newStatus } : p))
    );
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone_number.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || p.payment_status === statusFilter;
    const matchesProvider = providerFilter === "all" || p.payment_method === providerFilter;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  const totalPaid = payments
    .filter((p) => p.payment_status === "completed")
    .reduce((sum, p) => sum + p.amount_xof, 0);

  const totalPending = payments
    .filter((p) => p.payment_status === "pending")
    .reduce((sum, p) => sum + p.amount_xof, 0);

  return (
    <div className="space-y-6">
      {/* Header with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-orange-400" />
            <span>Paiements Mobile Money Niger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi en temps réel des encaissements Airtel, Moov, Orange, Flooz, MyNita, Amanata, All-Iza & Zeyna
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Encaissé</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
              ✓
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            {totalPaid.toLocaleString()} <span className="text-sm font-semibold">FCFA</span>
          </p>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            {payments.filter((p) => p.payment_status === "completed").length} transactions confirmées
          </p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">En Attente de Validation</span>
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
              ⏳
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            {totalPending.toLocaleString()} <span className="text-sm font-semibold">FCFA</span>
          </p>
          <p className="text-[11px] text-amber-300/80 mt-1">
            {payments.filter((p) => p.payment_status === "pending").length} paiements en cours
          </p>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Volume Global</span>
            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
              📊
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-2">
            {payments.length} <span className="text-sm font-semibold">Opérations</span>
          </p>
          <p className="text-[11px] text-blue-300/80 mt-1">
            Moyenne :{" "}
            {payments.length > 0
              ? Math.round(
                  payments.reduce((acc, p) => acc + p.amount_xof, 0) / payments.length
                ).toLocaleString()
              : 0}{" "}
            FCFA / commande
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par référence, commande (CMD-...), ou téléphone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">✅ Validé (completed)</option>
            <option value="pending">⏳ En attente (pending)</option>
            <option value="failed">❌ Échoué (failed)</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
          >
            <option value="all">Tous les opérateurs</option>
            {PAYMENT_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.logo} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Payments */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Commande
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Montant
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Statut
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Aucun paiement trouvé pour ces critères.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const prov = getProviderInfo(p.payment_method);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400 flex items-center gap-1.5">
                        <span>{p.transaction_id}</span>
                        <button
                          onClick={() => handleCopy(p.transaction_id)}
                          className="text-slate-500 hover:text-white transition p-1 cursor-pointer"
                          title="Copier ID transaction"
                        >
                          {copiedId === p.transaction_id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{p.order_id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{prov.logo}</span>
                          <span className="text-slate-200 font-medium">{prov.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{p.phone_number}</td>
                      <td className="py-3.5 px-4 font-black text-white">
                        {p.amount_xof.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.payment_status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : p.payment_status === "pending"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {p.payment_status === "completed" && "● Validé"}
                          {p.payment_status === "pending" && "⏳ En attente"}
                          {p.payment_status === "failed" && "✖ Échoué"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(p.created_at).toLocaleDateString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {p.payment_status === "pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStatusChange(p.id, "completed")}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                              title="Valider la réception du paiement"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => handleStatusChange(p.id, "failed")}
                              className="px-2 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 font-bold text-[10px] border border-red-800 transition cursor-pointer"
                              title="Rejeter"
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Clôturé</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
