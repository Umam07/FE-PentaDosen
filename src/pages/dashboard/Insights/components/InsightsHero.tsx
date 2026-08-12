import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, BarChart3, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsHeroProps {
  stats: DashboardStats | null;
  loading: boolean;
  timePeriod: 'this_year' | '3_years' | 'all';
  setTimePeriod: (val: 'this_year' | '3_years' | 'all') => void;
  onExploreClick?: () => void;
}

export default function InsightsHero({
  stats,
  loading,
  timePeriod,
  setTimePeriod,
  onExploreClick
}: InsightsHeroProps) {
  const totalDocs = stats
    ? (stats.total_docs || 0) + (stats.total_research || 0) + (stats.total_scholar || 0) + (stats.total_scopus || 0)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 sm:p-10 lg:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="flex flex-col gap-10">
        {/* Top Control Bar: Period Filters */}
        <div className="flex items-center justify-end pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => setTimePeriod('this_year')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timePeriod === 'this_year'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tahun 2026
            </button>
            <button
              onClick={() => setTimePeriod('3_years')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timePeriod === '3_years'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Batch 3-Tahun
            </button>
            <button
              onClick={() => setTimePeriod('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timePeriod === 'all'
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua Periode
            </button>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                Penta<span className="text-primary-600 dark:text-primary-400">Insights</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
                Pantau distribusi capaian KPI, publisitas riset, dan performa akademis dosen lintas fakultas secara presisi.
              </p>
            </div>

            {onExploreClick && (
              <div className="pt-2">
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
                >
                  <span>Jelajahi Peringkat Fakultas</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {/* Metric 1: Total Dokumen */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Publikasi</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                {loading ? (
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {totalDocs.toLocaleString()}
                  </p>
                )}
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Dokumen terindeks</span>
              </div>

              {/* Metric 2: Total Sitasi */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sitasi Global</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                {loading ? (
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {(stats?.total_citations || 0).toLocaleString()}
                  </p>
                )}
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Kutipan riset</span>
              </div>

              {/* Metric 3: Rerata KPI */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rerata Poin KPI</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                {loading ? (
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stats?.total_dosen ? Math.round(stats.total_points / stats.total_dosen).toLocaleString() : '0'}
                  </p>
                )}
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Per dosen aktif</span>
              </div>

              {/* Metric 4: Akurasi Data */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Akurasi Data</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                {loading ? (
                  <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-md" />
                ) : (
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stats?.data_accuracy !== undefined ? stats.data_accuracy.toFixed(1) : '100'}%
                  </p>
                )}
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Tervalidasi LPPM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
