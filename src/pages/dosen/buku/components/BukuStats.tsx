import React from 'react';
import { Book, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface BukuStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    points: number;
  };
  isTableLoading: boolean;
}

export default function BukuStats({ stats, isTableLoading }: BukuStatsProps) {
  const statItems = [
    { label: 'Total Buku', value: stats.total, icon: Book, color: 'slate' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'slate' },
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
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${
            item.color === 'slate' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' :
            item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
            'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
          }`}>
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <phantom-ui loading={isTableLoading} animation="shimmer" className="block space-y-1">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate" title={item.label}>
                {item.label}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
                {item.value}
              </p>
            </phantom-ui>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

