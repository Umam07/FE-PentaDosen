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
      {/* Card 1: Direktori & Kapasitas SDM */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-3xl border border-hairline-light dark:border-hairline-dark flex items-center justify-between shadow-xs hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft transition-all duration-300"
      >
        {/* Dosen Aktif */}
        <button 
          onClick={onLecturersClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark flex items-center justify-center group-hover:bg-accent group-hover:text-on-ink transition-all duration-300 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                {totalDosen}
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-muted dark:text-on-dark-muted group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
              <span>Dosen Aktif</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="w-px h-16 bg-hairline-light dark:bg-hairline-dark mx-4 sm:mx-6" />

        {/* Fakultas Penyelenggara */}
        <button 
          onClick={onDepartmentsClick}
          className="text-left space-y-3 flex-1 group cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-success-soft dark:bg-success/15 text-success dark:text-success-on-dark flex items-center justify-center group-hover:bg-success group-hover:text-on-ink transition-all duration-300 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                6
              </p>
            )}
            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-muted dark:text-on-dark-muted group-hover:text-success dark:group-hover:text-success-on-dark transition-colors">
              <span>Fakultas Penyelenggara</span>
              <ArrowRight className="w-3.5 h-3.5 text-success dark:text-success-on-dark group-hover:translate-x-1 transition-transform" />
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
        className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-3xl border border-hairline-light dark:border-hairline-dark flex items-center justify-between shadow-xs hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft transition-all duration-300"
      >
        {/* Rata-rata Sitasi */}
        <div className="text-left space-y-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark flex items-center justify-center shadow-xs">
            <Quote className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                  {avgCitationsPerLecturer}
                </p>
                <span className="text-xs font-semibold text-muted dark:text-on-dark-muted">sitasi</span>
              </div>
            )}
            <p className="mt-1 text-xs font-semibold text-muted dark:text-on-dark-muted">
              Rerata Sitasi / Dosen
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-hairline-light dark:bg-hairline-dark mx-4 sm:mx-6" />

        {/* Rata-rata Publikasi */}
        <div className="text-left space-y-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark flex items-center justify-center shadow-xs">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            {loading ? (
              <div className="h-8 w-16 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark tracking-tight">
                  {avgDocsPerLecturer}
                </p>
                <span className="text-xs font-semibold text-muted dark:text-on-dark-muted">dokumen</span>
              </div>
            )}
            <p className="mt-1 text-xs font-semibold text-muted dark:text-on-dark-muted">
              Rerata Publikasi / Dosen
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
