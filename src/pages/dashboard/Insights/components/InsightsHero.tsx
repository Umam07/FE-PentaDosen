import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, FileText, BarChart3, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsHeroProps {
  stats: DashboardStats | null;
  loading: boolean;
  onExploreClick?: () => void;
}

export default function InsightsHero({ stats, loading, onExploreClick }: InsightsHeroProps) {
  const totalDocs =
    (stats?.total_docs || 0) +
    (stats?.total_research || 0) +
    (stats?.total_scholar || 0) +
    (stats?.total_scopus || 0);

  const avgKpi = stats?.total_dosen
    ? Math.round(stats.total_points / stats.total_dosen)
    : 0;

  const metrics = [
    {
      label: 'Total Publikasi',
      value: totalDocs.toLocaleString(),
      sub: 'Dokumen terindeks',
      icon: FileText,
      iconColor: 'text-accent dark:text-accent-on-dark',
      iconBg: 'bg-accent-soft dark:bg-accent/15',
      accentLine: 'bg-accent',
    },
    {
      label: 'Sitasi Global',
      value: (stats?.total_citations || 0).toLocaleString(),
      sub: 'Kutipan riset aktif',
      icon: Sparkles,
      iconColor: 'text-accent dark:text-accent-on-dark',
      iconBg: 'bg-accent-soft dark:bg-accent/15',
      accentLine: 'bg-accent',
    },
    {
      label: 'Rerata Poin KPI',
      value: avgKpi.toLocaleString(),
      sub: 'Per dosen aktif',
      icon: BarChart3,
      iconColor: 'text-warning dark:text-warning-on-dark',
      iconBg: 'bg-warning-soft dark:bg-warning/15',
      accentLine: 'bg-warning',
    },
    {
      label: 'Akurasi Data',
      value: `${stats?.data_accuracy !== undefined ? stats.data_accuracy.toFixed(1) : '100'}%`,
      sub: 'Tervalidasi LPPM',
      icon: ShieldCheck,
      iconColor: 'text-success dark:text-success-on-dark',
      iconBg: 'bg-success-soft dark:bg-success/15',
      accentLine: 'bg-success',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs"
    >
      <div className="p-8 sm:p-10 lg:p-12">
        {/* Hero Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">

          {/* Left: Headline */}
          <div className="space-y-4 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink-heading dark:text-on-dark leading-[1.05]">
              Penta<span className="text-accent dark:text-accent-on-dark">Insights</span>
            </h1>

            <p className="text-body dark:text-on-dark-soft text-base sm:text-lg font-normal leading-relaxed">
              Pantau distribusi capaian KPI, publisitas riset, dan performa akademis
              dosen lintas fakultas secara presisi dan real-time.
            </p>

            {onExploreClick && (
              <div className="pt-1">
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover active:scale-[0.98] text-on-ink font-bold text-sm transition-all duration-200 shadow-xs cursor-pointer"
                >
                  <span>Jelajahi Peringkat Fakultas</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Modern Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-[420px] xl:w-[460px] shrink-0">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                className="group relative p-5 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Row: Icon & Label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                    {m.label}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                    <m.icon className={`w-4 h-4 ${m.iconColor}`} />
                  </div>
                </div>

                {/* Value & Subtitle */}
                <div>
                  {loading ? (
                    <div className="h-8 w-20 bg-hairline-light dark:bg-hairline-dark animate-pulse rounded-lg" />
                  ) : (
                    <p className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                      {m.value}
                    </p>
                  )}
                  <span className="text-[11px] font-medium text-muted dark:text-on-dark-muted mt-1 block">
                    {m.sub}
                  </span>
                </div>

                {/* Subtle Left Accent Line on Hover */}
                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${m.accentLine} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="pt-6 border-t border-hairline-light dark:border-hairline-dark">
          <span className="text-[11px] font-medium text-muted dark:text-on-dark-muted">
            Data bersumber dari Google Scholar, Scopus, dan Dokumen Internal.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
