import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { DashboardStats } from '../types';

interface InsightsStatsHighlightsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export default function InsightsStatsHighlights({ stats, loading }: InsightsStatsHighlightsProps) {
  const highlights = [
    { 
      label: 'Total KPI Overall', 
      val: stats?.total_points?.toLocaleString() || '0', 
      change: 'Akumulasi Poin', 
      icon: CheckCircle2, 
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20'
    },
    { 
      label: 'KPI Score 3 Tahun', 
      val: stats?.kpi_score_3_years?.toLocaleString() || '0', 
      change: 'Batch 2024-2026', 
      icon: TrendingUp, 
      colorClass: 'text-primary-600 dark:text-primary-400 bg-primary-500/10 dark:bg-primary-500/20'
    },
    { 
      label: 'KPI Tahun Ini', 
      val: stats?.kpi_score_this_year?.toLocaleString() || '0', 
      change: 'Periode Berjalan 2026', 
      icon: Zap, 
      colorClass: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {highlights.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-xs transition-all duration-300"
        >
          <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl ${item.colorClass} flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-105`}>
              <item.icon className="w-7 h-7" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-3">{item.label}</p>
            <phantom-ui loading={loading} animation="shimmer" className="block mb-6">
              <p className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{item.val}</p>
            </phantom-ui>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight">{item.change}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

