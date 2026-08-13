import React from 'react';
import { motion } from 'motion/react';
import { Award, CalendarCheck, Zap } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsStatsHighlightsProps {
  stats: DashboardStats | null;
  loading: boolean;
  periodKpiValues?: {
    thisYear: number;
    threeYears: number;
    allTime: number;
  };
}

export default function InsightsStatsHighlights({ stats, loading, periodKpiValues }: InsightsStatsHighlightsProps) {
  const allTimeVal = periodKpiValues?.allTime ?? stats?.total_points ?? 0;
  const threeYearsVal = periodKpiValues?.threeYears ?? stats?.kpi_score_3_years ?? 0;
  const thisYearVal = periodKpiValues?.thisYear ?? stats?.kpi_score_this_year ?? 0;

  const highlights = [
    {
      title: 'Akumulasi Poin KPI Overall',
      val: allTimeVal.toLocaleString(),
      subtitle: 'Total akumulasi seluruh periode',
      icon: Award,
      accent: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-primary-500/10 dark:bg-primary-500/20',
      border: 'border-primary-100/80 dark:border-primary-500/10',
      barColor: 'bg-primary-500',
    },
    {
      title: 'Skor KPI 3-Tahun (2024–2026)',
      val: threeYearsVal.toLocaleString(),
      subtitle: 'Evaluasi ritme tridharma 3 tahun',
      icon: CalendarCheck,
      accent: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-100/80 dark:border-emerald-500/10',
      barColor: 'bg-emerald-500',
    },
    {
      title: 'Skor KPI Tahun Berjalan (2026)',
      val: thisYearVal.toLocaleString(),
      subtitle: 'Progresif kinerja semester berjalan',
      icon: Zap,
      accent: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      border: 'border-amber-100/80 dark:border-amber-500/10',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {highlights.map((item, i) => {
        const pct = allTimeVal > 0 ? Math.round((Number(item.val.replace(/,/g, '')) / allTimeVal) * 100) : 0;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border ${item.border} border-slate-200/80 dark:border-slate-800 shadow-xs transition-all duration-300 overflow-hidden`}
          >
            {/* Header Row */}
            <div className="relative z-10 flex items-start justify-between mb-5">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">{item.subtitle}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl ${item.iconBg} ${item.accent} flex items-center justify-center shrink-0`}>
                <item.icon className="w-5 h-5" />
              </div>
            </div>

            {/* Value */}
            <div className="relative z-10">
              {loading ? (
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
              ) : (
                <p className={`text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white`}>
                  {item.val}
                  <span className="text-base font-semibold text-slate-400 dark:text-slate-500 ml-1.5">poin</span>
                </p>
              )}
            </div>

            {/* Mini progress bar showing proportion vs overall */}
            {i > 0 && !loading && allTimeVal > 0 && (
              <div className="relative z-10 mt-4 space-y-1">
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className={`h-full ${item.barColor} rounded-full`}
                  />
                </div>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {pct}% dari total KPI keseluruhan
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
