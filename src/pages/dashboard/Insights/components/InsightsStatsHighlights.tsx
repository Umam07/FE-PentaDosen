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
  const allTimeVal = periodKpiValues?.allTime || (stats?.total_points || 125);
  const threeYearsVal = periodKpiValues?.threeYears || (stats?.kpi_score_3_years || 100);
  const thisYearVal = periodKpiValues?.thisYear || (stats?.kpi_score_this_year || 21);

  const highlights = [
    { 
      title: 'Akumulasi Poin KPI Overall', 
      val: allTimeVal.toLocaleString(), 
      subtitle: 'Total akumulasi seluruh periode', 
      icon: Award, 
      colorClass: 'text-primary-600 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/20'
    },
    { 
      title: 'Skor KPI 3-Tahun (2024-2026)', 
      val: threeYearsVal.toLocaleString(), 
      subtitle: 'Evaluasi ritme tridharma 3 tahun', 
      icon: CalendarCheck, 
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20'
    },
    { 
      title: 'Skor KPI Tahun Berjalan (2026)', 
      val: thisYearVal.toLocaleString(), 
      subtitle: 'Progresik kinerja semester berjalan', 
      icon: Zap, 
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {highlights.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">{item.subtitle}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl ${item.colorClass} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
              <item.icon className="w-5.5 h-5.5" />
            </div>
          </div>

          {loading ? (
            <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg" />
          ) : (
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {item.val}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
