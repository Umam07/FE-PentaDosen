import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, BookCheck, Quote, ArrowRight } from 'lucide-react';
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
  const totalDosen = stats?.total_dosen || 0;
  const totalCitations = stats?.total_citations || 0;
  const totalDocs =
    (stats?.total_docs || 0) +
    (stats?.total_research || 0) +
    (stats?.total_scholar || 0) +
    (stats?.total_scopus || 0);

  const avgCitationsPerLecturer = totalDosen > 0 ? (totalCitations / totalDosen).toFixed(1) : '0';
  const avgDocsPerLecturer = totalDosen > 0 ? (totalDocs / totalDosen).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      {/* Card 1: Direktori & Kapasitas SDM (Original Style) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
      >
        {/* Dosen Aktif */}
        <button 
          onClick={onLecturersClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalDosen}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span>Dosen Aktif</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-16 bg-slate-100 dark:bg-slate-800 mx-4 sm:mx-6" />

        {/* Fakultas Penyelenggara */}
        <button 
          onClick={onDepartmentsClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
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

      {/* Card 2: Rasio Produktivitas & Dampak Ilmiah */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
      >
        {/* Rata-rata Sitasi */}
        <div className="text-left space-y-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <Quote className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {avgCitationsPerLecturer}
                </p>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">sitasi</span>
              </div>
            )}
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rerata Sitasi / Dosen
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-slate-100 dark:bg-slate-800 mx-4 sm:mx-6" />

        {/* Rata-rata Publikasi */}
        <div className="text-left space-y-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {avgDocsPerLecturer}
                </p>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">dokumen</span>
              </div>
            )}
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Rerata Publikasi / Dosen
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
