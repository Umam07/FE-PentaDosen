import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Trophy, Sparkles, Zap } from 'lucide-react';
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
        className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-around overflow-hidden relative group shadow-xs hover:shadow-lg transition-all duration-700"
      >
        <button 
          onClick={onLecturersClick}
          className="text-center space-y-4 relative z-10 flex-1 group/btn cursor-pointer"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all duration-700 shadow-sm group-hover/btn:shadow-blue-500/25">
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
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-all duration-700 shadow-sm group-hover/btn:shadow-indigo-500/25">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter text-glow">6</p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Fakultas</p>
          </div>
        </button>
      </motion.div>

      {/* Top Performer Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-12 xl:col-span-7 bg-[#0F172A] dark:bg-slate-900 p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between group overflow-hidden relative shadow-md border border-white/5"
      >
        <div className="relative z-10 space-y-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/30 shadow-sm">
              <Trophy className="w-5.5 h-5.5 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500">Performa Terbaik Utama</span>
          </div>
          <phantom-ui loading={loading} animation="shimmer" className="block space-y-2">
            <p className="text-3xl lg:text-4xl font-extrabold tracking-tight group-hover:text-amber-400 transition-colors duration-500">{stats?.top_performer?.name || 'N/A'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <p className="text-slate-400 font-semibold text-sm tracking-tight">Akumulasi:</p>
              <p className="text-white font-extrabold text-xl">{Math.round(stats?.top_performer?.total_kpi_points || 0).toLocaleString()} <span className="text-[11px] uppercase text-slate-500 tracking-widest ml-1 font-bold">Poin KPI</span></p>
            </div>
          </phantom-ui>
        </div>
        
        <div className="mt-6 sm:mt-0 relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-3 group-hover:border-amber-500/40 transition-all duration-700 shadow-xl">
           <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] text-slate-200">Rank 01</p>
           <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 flex items-center justify-center text-slate-900 shadow-md">
              <Sparkles className="w-7 h-7" />
           </div>
        </div>
        
        <Zap className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 -rotate-12 group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}
