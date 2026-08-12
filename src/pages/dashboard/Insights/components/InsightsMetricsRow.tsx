import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Trophy, ArrowRight, Star } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsMetricsRowProps {
  stats: DashboardStats | null;
  loading: boolean;
  onLecturersClick: () => void;
  onDepartmentsClick: () => void;
  onTopPerformerClick?: () => void;
}

export default function InsightsMetricsRow({
  stats,
  loading,
  onLecturersClick,
  onDepartmentsClick,
  onTopPerformerClick
}: InsightsMetricsRowProps) {
  const topPerformer = stats?.top_performer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
      {/* Personnel Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
      >
        <button 
          onClick={onLecturersClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stats?.total_dosen || 0}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span>Dosen Aktif</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>

        <div className="w-px h-16 bg-slate-100 dark:bg-slate-800 mx-4" />

        <button 
          onClick={onDepartmentsClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                6
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <span>Fakultas Penyelenggara</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>
      </motion.div>

      {/* Top Performer Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        onClick={onTopPerformerClick}
        className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex items-center gap-5 min-w-0 flex-1">
          {/* Avatar / Rank Icon */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xl border border-amber-200/60 dark:border-amber-500/30 overflow-hidden shadow-xs">
              {topPerformer?.thumbnail ? (
                <img src={topPerformer.thumbnail} alt={topPerformer.name} className="w-full h-full object-cover" />
              ) : (
                topPerformer?.name?.charAt(0) || '★'
              )}
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Dosen Performa Terbaik #01</span>
            </div>

            {loading ? (
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            ) : (
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {topPerformer?.name || 'Prof. Dr. Ir. Academic Performer'}
              </h3>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {topPerformer?.program_studi || 'Fakultas Teknologi Informasi'}
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Poin KPI</span>
          <div className="inline-flex items-baseline gap-1 px-4 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-lg border border-amber-200/80 dark:border-amber-500/30">
            <span>{Math.round(topPerformer?.total_kpi_points || 0).toLocaleString()}</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Poin</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
