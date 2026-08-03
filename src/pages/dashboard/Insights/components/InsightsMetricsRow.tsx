import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Trophy, Crown } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsMetricsRowProps {
  stats: DashboardStats | null;
  loading: boolean;
  onLecturersClick: () => void;
  onDepartmentsClick: () => void;
}

export default function InsightsMetricsRow({
  stats,
  loading,
  onLecturersClick,
  onDepartmentsClick
}: InsightsMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Personnel Statistics (Dosen & Prodi) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-around overflow-hidden relative group shadow-xs hover:shadow-md transition-all duration-500"
      >
        <button 
          onClick={onLecturersClick}
          className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all duration-500 shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <phantom-ui loading={loading} animation="shimmer" className="block">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{stats?.total_dosen || 0}</p>
            </phantom-ui>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Dosen Aktif</p>
          </div>
        </button>

        <div className="w-px h-20 bg-slate-100 dark:bg-slate-800"></div>

        <button 
          onClick={onDepartmentsClick}
          className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-all duration-500 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter">6</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Fakultas</p>
          </div>
        </button>
      </motion.div>

      {/* Top Performer Card - Clean, Minimalist, Elegant (No Glow Gradient) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-slate-900 p-7 lg:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group overflow-hidden relative shadow-xs hover:shadow-md transition-all duration-500"
      >
        {/* Content Section */}
        <div className="space-y-3.5 flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20 text-[11px] font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Performa Terbaik Utama</span>
          </div>

          <phantom-ui loading={loading} animation="shimmer" className="block space-y-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              {stats?.top_performer?.name || 'N/A'}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Akumulasi KPI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline-block" />
              <div className="inline-flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/60 shadow-xs">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {Math.round(stats?.top_performer?.total_kpi_points || 0).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Poin KPI
                </span>
              </div>
            </div>
          </phantom-ui>
        </div>
        
        {/* Rank 01 Badge Section - Solid Clean Style */}
        <div className="self-stretch sm:self-center flex items-center justify-end sm:justify-center">
          <div className="px-6 py-4 rounded-2xl bg-amber-500 text-white flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5 shadow-sm border border-amber-400/20">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-left sm:text-center">
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-amber-100 leading-none">Rank</span>
              <span className="text-xl font-black tracking-tight leading-none text-white">#01</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


