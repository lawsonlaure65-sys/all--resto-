import React from "react";
import { motion } from "motion/react";
import { Sparkles, Smartphone, ArrowRight, ShieldCheck, Zap, Gauge, Bot, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  onOpenConfigurator: () => void;
  onScrollToDemos: () => void;
  onScrollToEstimator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConfigurator,
  onScrollToDemos,
  onScrollToEstimator,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background ambient glowing mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Chip */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 mb-6 shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Studio de Conception Web & PWA — De la stratégie au code déployé</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Concevez une <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Application Web Mobile (PWA)</span> et un site professionnel orienté conversion.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Sites vitrines haut de gamme, plateformes SaaS, boutiques e-commerce rapides, outils métiers intelligents et intégrations d&apos;intelligence artificielle sur mesure. Prêt pour la production, sans compromis.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              id="hero-btn-configure"
              onClick={onOpenConfigurator}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
              <span>Configurer mon Projet (6 étapes + IA)</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
            </button>

            <button
              id="hero-btn-demos"
              onClick={onScrollToDemos}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Tester les Démos & PWA Live</span>
            </button>

            <button
              id="hero-btn-estimator"
              onClick={onScrollToEstimator}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span>Estimer budget & délais</span>
            </button>
          </motion.div>

          {/* Core Guarantees & Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">PWA Mobile-First</h4>
                <p className="text-xs text-slate-400 mt-0.5">Installable sans store &amp; mode offline</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vitesse &amp; SEO 98+</h4>
                <p className="text-xs text-slate-400 mt-0.5">Score Lighthouse &amp; conversion</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sécurité &amp; Rôles</h4>
                <p className="text-xs text-slate-400 mt-0.5">Auth robuste, Stripe &amp; données RGPD</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">IA Gemini Intégrée</h4>
                <p className="text-xs text-slate-400 mt-0.5">Assistants, résumés &amp; automatisation</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
