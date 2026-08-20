import React from 'react';
import { Beaker, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    points: string | number;
  };
  isTableLoading: boolean;
}

export default function ResearchStats({ stats, isTableLoading }: ResearchStatsProps) {
  const items = [
    { label: 'Total Penelitian', value: stats.total, icon: Beaker, color: 'neutral' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'approved' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'pending' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'neutral' },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-surface-light dark:bg-surface-dark shadow-2xs rounded-2xl border border-hairline-light dark:border-hairline-dark p-3.5 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 transition-all"
        >
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 border ${
            item.color === 'approved' ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30' :
            item.color === 'pending' ? 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30' :
            'bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark'
          }`}>
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <phantom-ui loading={isTableLoading} animation="shimmer" className="block space-y-0.5">
              <p className="text-xs font-semibold text-muted dark:text-on-dark-muted truncate" title={item.label}>
                {item.label}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark">
                {item.value}
              </p>
            </phantom-ui>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
