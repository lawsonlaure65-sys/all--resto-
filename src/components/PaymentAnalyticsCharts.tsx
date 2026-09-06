import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { PaymentRecord, PAYMENT_PROVIDERS } from "../services/paymentService";

interface PaymentAnalyticsChartsProps {
  payments: PaymentRecord[];
}

// Brand-specific color palette for Niger Mobile Money providers
const PROVIDER_COLORS: Record<string, string> = {
  airtel_money: "#dc2626", // Red
  moov_money: "#2563eb", // Blue
  orange_zamany: "#ea580c", // Orange
  flooz: "#9333ea", // Purple
  mynita: "#059669", // Emerald
  amanata: "#0d9488", // Teal
  all_iza: "#4f46e5", // Indigo
  zeyna: "#db2777", // Pink
};

const DEFAULT_COLOR = "#64748b";

export const PaymentAnalyticsCharts: React.FC<PaymentAnalyticsChartsProps> = ({ payments }) => {
  const [metricMode, setMetricMode] = useState<"revenue" | "count">("revenue");
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "performance">("overview");

  // Aggregate stats per provider
  const providerStats = useMemo(() => {
    const statsMap: Record<
      string,
      {
        id: string;
        name: string;
        logo: string;
        color: string;
        completedRevenue: number;
        pendingRevenue: number;
        totalRevenue: number;
        completedCount: number;
        pendingCount: number;
        failedCount: number;
        totalCount: number;
      }
    > = {};

    // Initialize with all known providers
    PAYMENT_PROVIDERS.forEach((p) => {
      statsMap[p.id] = {
        id: p.id,
        name: p.name.replace(" Niger", ""),
        logo: p.logo,
        color: PROVIDER_COLORS[p.id] || DEFAULT_COLOR,
        completedRevenue: 0,
        pendingRevenue: 0,
        totalRevenue: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        totalCount: 0,
      };
    });

    // Populate with actual payment records
    payments.forEach((p) => {
      if (!statsMap[p.payment_method]) {
        statsMap[p.payment_method] = {
          id: p.payment_method,
          name: p.payment_method,
          logo: "💳",
          color: DEFAULT_COLOR,
          completedRevenue: 0,
          pendingRevenue: 0,
          totalRevenue: 0,
          completedCount: 0,
          pendingCount: 0,
          failedCount: 0,
          totalCount: 0,
        };
      }

      const item = statsMap[p.payment_method];
      item.totalCount += 1;
      item.totalRevenue += p.amount_xof;

      if (p.payment_status === "completed") {
        item.completedRevenue += p.amount_xof;
        item.completedCount += 1;
      } else if (p.payment_status === "pending") {
        item.pendingRevenue += p.amount_xof;
        item.pendingCount += 1;
      } else if (p.payment_status === "failed") {
        item.failedCount += 1;
      }
    });

    return Object.values(statsMap);
  }, [payments]);

  // Total completed revenue across all providers
  const totalCompletedRevenue = useMemo(() => {
    return providerStats.reduce((sum, p) => sum + p.completedRevenue, 0);
  }, [providerStats]);

  // Data formatted for BarChart (Revenue & Transactions)
  const barChartData = useMemo(() => {
    return providerStats
      .filter((p) => p.totalCount > 0 || p.totalRevenue > 0)
      .map((p) => {
        const sharePct = totalCompletedRevenue > 0
          ? Math.round((p.completedRevenue / totalCompletedRevenue) * 100)
          : 0;

        return {
          name: p.name,
          logo: p.logo,
          providerId: p.id,
          completedRevenue: p.completedRevenue,
          pendingRevenue: p.pendingRevenue,
          totalRevenue: p.totalRevenue,
          completedCount: p.completedCount,
          pendingCount: p.pendingCount,
          totalCount: p.totalCount,
          color: p.color,
          sharePct,
          avgTicket: p.completedCount > 0 ? Math.round(p.completedRevenue / p.completedCount) : 0,
        };
      })
      .sort((a, b) => b.completedRevenue - a.completedRevenue);
  }, [providerStats, totalCompletedRevenue]);

  // Data for Donut Chart (Market share among completed payments)
  const donutChartData = useMemo(() => {
    const data = barChartData
      .filter((p) => p.completedRevenue > 0)
      .map((p) => ({
        name: p.name,
        value: metricMode === "revenue" ? p.completedRevenue : p.completedCount,
        color: p.color,
        logo: p.logo,
        sharePct: p.sharePct,
        formattedVal:
          metricMode === "revenue"
            ? `${p.completedRevenue.toLocaleString()} FCFA`
            : `${p.completedCount} tx`,
      }));

    return data;
  }, [barChartData, metricMode]);

  // Data for Timeline Area Chart (Daily / chronological grouping)
  const timelineData = useMemo(() => {
    if (payments.length === 0) return [];

    // Group payments by date (DD/MM)
    const dateMap: Record<
      string,
      {
        dateLabel: string;
        timestamp: number;
        completed: number;
        pending: number;
        count: number;
      }
    > = {};

    payments.forEach((p) => {
      const d = new Date(p.created_at);
      const dayKey = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!dateMap[dayKey]) {
        dateMap[dayKey] = {
          dateLabel: dayKey,
          timestamp: d.getTime(),
          completed: 0,
          pending: 0,
          count: 0,
        };
      }

      dateMap[dayKey].count += 1;
      if (p.payment_status === "completed") {
        dateMap[dayKey].completed += p.amount_xof;
      } else if (p.payment_status === "pending") {
        dateMap[dayKey].pending += p.amount_xof;
      }
    });

    return Object.values(dateMap).sort((a, b) => a.timestamp - b.timestamp);
  }, [payments]);

  // Top Insights
  const leaderProvider = useMemo(() => {
    if (barChartData.length === 0) return null;
    return barChartData[0];
  }, [barChartData]);

  const highestTicketProvider = useMemo(() => {
    if (barChartData.length === 0) return null;
    return [...barChartData].sort((a, b) => b.avgTicket - a.avgTicket)[0];
  }, [barChartData]);

  const globalConversionRate = useMemo(() => {
    if (payments.length === 0) return 0;
    const completedCount = payments.filter((p) => p.payment_status === "completed").length;
    return Math.round((completedCount / payments.length) * 100);
  }, [payments]);

  // Custom Tooltip for BarChart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
            <span className="text-base">{data.logo}</span>
            <span className="font-black text-white">{data.name}</span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Encaissé :
              </span>
              <span className="font-mono font-bold text-white">
                {data.completedRevenue.toLocaleString()} FCFA
              </span>
            </div>

            {data.pendingRevenue > 0 && (
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  En attente :
                </span>
                <span className="font-mono text-amber-200">
                  {data.pendingRevenue.toLocaleString()} FCFA
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/60 text-[11px]">
              <span>Part de marché :</span>
              <span className="font-bold text-orange-400">{data.sharePct}%</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Transactions :</span>
              <span className="text-slate-200 font-medium">
                {data.completedCount} validées / {data.totalCount} tot.
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Panier moyen :</span>
              <span className="text-slate-200 font-mono">
                {data.avgTicket.toLocaleString()} FCFA
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Donut Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-300 flex items-center justify-between gap-4">
            <span className="text-slate-400">Valeur :</span>
            <span className="font-mono font-bold text-white">{data.payload.formattedVal}</span>
          </div>
          <div className="text-slate-300 flex items-center justify-between gap-4">
            <span className="text-slate-400">Part :</span>
            <span className="font-bold text-orange-400">{data.payload.sharePct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Timeline Area Chart
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[180px]">
          <p className="font-black text-white border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Journée du {label}</span>
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span className="text-emerald-400 font-bold">Encaissé :</span>
              <span className="font-mono font-bold text-white">
                {(payload[0]?.value || 0).toLocaleString()} FCFA
              </span>
            </div>
            {payload[1] && (
              <div className="flex justify-between text-slate-300">
                <span className="text-amber-400 font-bold">En attente :</span>
                <span className="font-mono text-amber-200">
                  {(payload[1]?.value || 0).toLocaleString()} FCFA
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Top Header: Title, Tabs & Metric Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Recharts Analytics
            </span>
            <span className="text-xs text-slate-400 font-mono">
              8 Opérateurs Nigériens
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>Visualisation des Revenus par Provider Mobile Money</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ventilation analytique détaillée des flux Airtel, Moov, Orange, Flooz, MyNita, Amanata, All-Iza & Zeyna
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active Chart View Tabs */}
          <div className="p-1 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Revenus &amp; Parts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("timeline")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "timeline"
                  ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Évolution Temporelle</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("performance")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "performance"
                  ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Comparatif Détaillé</span>
            </button>
          </div>

          {/* Metric Mode Toggle (Revenue vs Transactions) */}
          {activeTab === "overview" && (
            <div className="p-1 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setMetricMode("revenue")}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  metricMode === "revenue"
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Montant (FCFA)
              </button>
              <button
                type="button"
                onClick={() => setMetricMode("count")}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  metricMode === "count"
                    ? "bg-slate-800 text-blue-400 border border-blue-500/30 font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Volume (Tx)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Top Operator */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center text-lg shrink-0">
            {leaderProvider?.logo || "🏆"}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Opérateur N°1 en Recettes
            </span>
            <p className="text-sm font-black text-white truncate">
              {leaderProvider?.name || "Aucun"}
            </p>
            <p className="text-[11px] font-mono text-emerald-400 font-bold">
              {leaderProvider?.completedRevenue.toLocaleString() || 0} FCFA ({leaderProvider?.sharePct || 0}%)
            </p>
          </div>
        </div>

        {/* Card 2: Highest Average Ticket */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-lg shrink-0">
            {highestTicketProvider?.logo || "💎"}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Panier Moyen Record
            </span>
            <p className="text-sm font-black text-white truncate">
              {highestTicketProvider?.name || "N/A"}
            </p>
            <p className="text-[11px] font-mono text-indigo-300 font-bold">
              {highestTicketProvider?.avgTicket.toLocaleString() || 0} FCFA / commande
            </p>
          </div>
        </div>

        {/* Card 3: Success & Confirmation Rate */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Taux de Confirmation
            </span>
            <p className="text-sm font-black text-emerald-400">
              {globalConversionRate}%
            </p>
            <p className="text-[11px] text-slate-400">
              {payments.filter((p) => p.payment_status === "completed").length} sur {payments.length} commandes validées
            </p>
          </div>
        </div>

        {/* Card 4: Diversity of Mobile Channels */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-lg shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Réseau Mobile Actif
            </span>
            <p className="text-sm font-black text-white">
              {barChartData.length} / {PAYMENT_PROVIDERS.length} Canaux
            </p>
            <p className="text-[11px] text-purple-300">
              Couverture 100% Niamey &amp; Régions
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW (BAR CHART + DONUT CHART) */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Bar Chart: 7 cols on desktop */}
          <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" />
                  <span>
                    {metricMode === "revenue"
                      ? "Classement des Revenus par Provider (FCFA)"
                      : "Volume de Transactions par Provider"}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {metricMode === "revenue"
                    ? "Montants encaissés vs montants en cours de validation"
                    : "Nombre d'opérations initiées par canal"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Validé
                </span>
                {metricMode === "revenue" && (
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    En attente
                  </span>
                )}
              </div>
            </div>

            {barChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                Aucune transaction disponible à afficher.
              </div>
            ) : (
              <div className="w-full h-72 sm:h-80 min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) =>
                        metricMode === "revenue"
                          ? val >= 1000
                            ? `${val / 1000}k`
                            : `${val}`
                          : `${val}`
                      }
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    {metricMode === "revenue" ? (
                      <>
                        <Bar
                          dataKey="completedRevenue"
                          name="Encaissé"
                          radius={[6, 6, 0, 0]}
                          fill="#10b981"
                        >
                          {barChartData.map((entry, index) => (
                            <Cell key={`cell-comp-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                        <Bar
                          dataKey="pendingRevenue"
                          name="En attente"
                          radius={[6, 6, 0, 0]}
                          fill="#f59e0b"
                          opacity={0.6}
                        />
                      </>
                    ) : (
                      <Bar
                        dataKey="totalCount"
                        name="Transactions"
                        radius={[6, 6, 0, 0]}
                        fill="#3b82f6"
                      >
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-cnt-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total Réseau Mobile :</span>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {totalCompletedRevenue.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Donut Chart (Market Share): 5 cols on desktop */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-amber-400" />
                  <span>Parts de Marché ({metricMode === "revenue" ? "Revenus" : "Transactions"})</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Donut 360°
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Répartition relative des encaissements par opérateur
              </p>
            </div>

            {donutChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                Aucune donnée à afficher.
              </div>
            ) : (
              <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={donutChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutChartData.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="#0b101b" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Badge in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Validé</span>
                  <span className="text-sm font-black text-white font-mono">
                    {metricMode === "revenue"
                      ? `${(totalCompletedRevenue / 1000).toFixed(0)}k F`
                      : `${payments.filter((p) => p.payment_status === "completed").length} tx`}
                  </span>
                </div>
              </div>
            )}

            {/* Micro Legend Chips */}
            <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
              {donutChartData.slice(0, 6).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-[11px] px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white shrink-0 ml-1">
                    {item.sharePct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TIMELINE (AREA CHART) */}
      {/* ========================================================= */}
      {activeTab === "timeline" && (
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Trajectoire Chronologique des Flux Mobile Money</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Évolution journalière des montants validés et en cours
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                Encaissé (FCFA)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-3 h-3 rounded-md bg-amber-500" />
                En attente (FCFA)
              </span>
            </div>
          </div>

          {timelineData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Aucune donnée temporelle disponible.
            </div>
          ) : (
            <div className="w-full h-72 sm:h-80 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dateLabel" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${val / 1000}k` : val}`}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Encaissé"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPending)"
                    name="En attente"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PERFORMANCE DETAILS & BENCHMARK TABLE */}
      {/* ========================================================= */}
      {activeTab === "performance" && (
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Matrice Comparative Complète des 8 Opérateurs</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Chiffre d&apos;affaires, panier moyen, taux d&apos;approbation et volume transactionnel
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Opérateur</th>
                  <th className="py-2.5 px-3">Encaissé</th>
                  <th className="py-2.5 px-3">En attente</th>
                  <th className="py-2.5 px-3">Part</th>
                  <th className="py-2.5 px-3">Transactions</th>
                  <th className="py-2.5 px-3">Panier Moyen</th>
                  <th className="py-2.5 px-3">Taux Succès</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {barChartData.map((prov) => {
                  const successRate =
                    prov.totalCount > 0
                      ? Math.round((prov.completedCount / prov.totalCount) * 100)
                      : 0;

                  return (
                    <tr key={prov.providerId} className="hover:bg-slate-900/40 transition">
                      <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-white">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prov.color }} />
                        <span>{prov.logo} {prov.name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                        {prov.completedRevenue.toLocaleString()} FCFA
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-300">
                        {prov.pendingRevenue > 0 ? `${prov.pendingRevenue.toLocaleString()} FCFA` : "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(prov.sharePct, 100)}%`,
                                backgroundColor: prov.color,
                              }}
                            />
                          </div>
                          <span className="font-bold text-slate-300 text-[11px]">{prov.sharePct}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {prov.completedCount} / {prov.totalCount}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-200">
                        {prov.avgTicket.toLocaleString()} FCFA
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            successRate >= 80
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : successRate >= 50
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {successRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
