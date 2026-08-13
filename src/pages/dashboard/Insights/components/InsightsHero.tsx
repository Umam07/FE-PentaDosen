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
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      accentLine: 'bg-blue-500',
    },
    {
      label: 'Sitasi Global',
      value: (stats?.total_citations || 0).toLocaleString(),
      sub: 'Kutipan riset aktif',
      icon: Sparkles,
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-950/40',
      accentLine: 'bg-sky-500',
    },
    {
      label: 'Rerata Poin KPI',
      value: avgKpi.toLocaleString(),
      sub: 'Per dosen aktif',
      icon: BarChart3,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      accentLine: 'bg-amber-500',
    },
    {
      label: 'Akurasi Data',
      value: `${stats?.data_accuracy !== undefined ? stats.data_accuracy.toFixed(1) : '100'}%`,
      sub: 'Tervalidasi LPPM',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      accentLine: 'bg-emerald-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="p-8 sm:p-10 lg:p-12">
        {/* Hero Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">

          {/* Left: Headline */}
          <div className="space-y-4 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Penta<span className="text-primary-600 dark:text-primary-400">Insights</span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-normal leading-relaxed">
              Pantau distribusi capaian KPI, publisitas riset, dan performa akademis
              dosen lintas fakultas secara presisi dan real-time.
            </p>

            {onExploreClick && (
              <div className="pt-1">
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <span>Jelajahi Peringkat Fakultas</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Modern Metric Cards (No Glow / No Gradient) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-[420px] xl:w-[460px] shrink-0">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                className="group relative p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top Row: Icon & Label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {m.label}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                    <m.icon className={`w-4 h-4 ${m.iconColor}`} />
                  </div>
                </div>

                {/* Value & Subtitle */}
                <div>
                  {loading ? (
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
                  ) : (
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {m.value}
                    </p>
                  )}
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 block">
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
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Data bersumber dari Google Scholar, Scopus, dan Dokumen Internal.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
