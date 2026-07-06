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
      className="relative overflow-hidden p-8 lg:p-16 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-850 bg-white/95 dark:bg-slate-900/80 backdrop-blur-md shadow-xs"
    >
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[0.95]">
              Penta<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Insights</span>
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
            {/* Floating Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="group bg-white dark:bg-slate-800/40 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-xs transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-5.5 h-5.5 text-primary-500" />
                </div>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1">Total Dokumen</p>
                {loading ? (
                  <div className="h-9 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                    {totalDocs.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="group bg-primary-600 p-6 rounded-3xl text-white shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-5.5 h-5.5 text-white" />
                </div>
                <p className="text-[10px] font-bold text-primary-100 uppercase tracking-widest mb-1">Total Sitasi</p>
                {loading ? (
                  <div className="h-9 bg-white/20 animate-pulse rounded-md w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-extrabold tracking-tighter text-white">
                    {(stats?.total_citations || 0).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-8 flex flex-col gap-6"
            >
              <div className="group bg-slate-900 dark:bg-white p-6 rounded-3xl text-white dark:text-slate-900 shadow-md transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-white/10 dark:bg-slate-900/5 flex items-center justify-center mb-4">
                  <Trophy className="w-5.5 h-5.5 text-white dark:text-slate-800" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rerata KPI</p>
                {loading ? (
                  <div className="h-9 bg-white/10 dark:bg-slate-200 animate-pulse rounded-md w-16 mt-2" />
                ) : (
                  <p className="text-3xl font-extrabold tracking-tighter">
                    {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
                  </p>
                )}
              </div>

              <div className="group bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5.5 h-5.5 text-white" />
                </div>
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Akurasi Data</p>
                <p className="text-3xl font-extrabold tracking-tighter text-white">99.9<span className="text-xl">%</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
