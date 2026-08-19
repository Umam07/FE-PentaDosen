import React from 'react';
import { Award, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HKIStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    points: number;
  };
  isTableLoading: boolean;
}

export default function HKIStats({ stats, isTableLoading }: HKIStatsProps) {
  const statItems = [
    { label: 'Total HKI', value: stats.total, icon: Award, color: 'neutral' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'neutral' },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 transition-all"
        >
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 border ${
            item.color === 'emerald'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
              : item.color === 'amber'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80'
          }`}>
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <phantom-ui loading={isTableLoading} animation="shimmer" className="block space-y-0.5">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate" title={item.label}>
                {item.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {item.value}
              </p>
            </phantom-ui>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

