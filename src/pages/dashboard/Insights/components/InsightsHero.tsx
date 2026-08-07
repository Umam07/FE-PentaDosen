import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsHeroProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function InsightsHero({ stats, loading }: InsightsHeroProps) {
  const totalDocs = stats
    ? (stats.total_docs || 0) + (stats.total_research || 0) + (stats.total_scholar || 0) + (stats.total_scopus || 0)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden p-8 lg:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[0.95]">
              Penta<span className="text-primary-600 dark:text-primary-400">Insights</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg lg:text-xl font-medium max-w-xl leading-relaxed">
              Analisis cerdas untuk ekosistem akademik. Pantau pertumbuhan KPI dan output riset dengan <span className="relative inline-block">
                <span className="relative z-10 text-slate-900 dark:text-white font-extrabold">akurasi tingkat tinggi</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-primary-500/10 -rotate-1"></span>
              </span>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 w-full">
          <div className="grid grid-cols-2 gap-6 relative">
            {/* Floating Stats Cards - All Uniform Neutral Background */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Card 1: Total Dokumen */}
              <div className="group bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Dokumen</p>
                <phantom-ui loading={loading} animation="shimmer" className="block mt-2">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {totalDocs.toLocaleString()}
                  </p>
                </phantom-ui>
              </div>

              {/* Card 2: Total Sitasi */}
              <div className="group bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5.5 h-5.5 text-sky-600 dark:text-sky-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Sitasi</p>
                <phantom-ui loading={loading} animation="shimmer" className="block mt-2">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {(stats?.total_citations || 0).toLocaleString()}
                  </p>
                </phantom-ui>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-8 flex flex-col gap-6"
            >
              {/* Card 3: Rerata KPI */}
              <div className="group bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-5.5 h-5.5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Rerata KPI</p>
                <phantom-ui loading={loading} animation="shimmer" className="block mt-2">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
                  </p>
                </phantom-ui>
              </div>

              {/* Card 4: Akurasi Data */}
              <div className="group bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Akurasi Data</p>
                <phantom-ui loading={loading} animation="shimmer" className="block mt-2">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {stats?.data_accuracy !== undefined ? stats.data_accuracy.toFixed(1) : '100'}
                    <span className="text-xl text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">%</span>
                  </p>
                </phantom-ui>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
