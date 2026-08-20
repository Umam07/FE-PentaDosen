import React from 'react';
import { FileText, CheckCircle, Clock, Sparkles, Layers, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicationStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    points: number;
    crossIndexed?: number;
  };
  isTableLoading: boolean;
  onCrossIndexedClick?: () => void;
  isCrossIndexedActive?: boolean;
}

export default function PublicationStats({
  stats,
  isTableLoading,
  onCrossIndexedClick,
  isCrossIndexedActive
}: PublicationStatsProps) {
  const statItems = [
    { label: 'Total Dokumen', value: stats.total, icon: FileText, color: 'neutral' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'approved' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'pending' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'neutral' },
    {
      label: 'Irisan (Cross-Indexed)',
      value: stats.crossIndexed ?? 0,
      icon: Layers,
      color: 'iris',
      onClick: onCrossIndexedClick,
      isActive: isCrossIndexedActive,
      isClickable: true
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={item.onClick}
          className={`group bg-surface-light dark:bg-surface-dark shadow-2xs rounded-2xl border p-3.5 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 transition-all relative overflow-hidden ${
            item.isClickable ? 'cursor-pointer hover:border-accent hover:shadow-md active:scale-95' : ''
          } ${
            item.isActive
              ? 'border-accent ring-2 ring-accent/20 bg-accent-soft/40 dark:bg-accent/10'
              : 'border-hairline-light dark:border-hairline-dark'
          }`}
        >
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 border ${
            item.color === 'approved' ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30' :
            item.color === 'pending' ? 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30' :
            item.color === 'iris' ? 'bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/30' :
            'bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border-hairline-light dark:border-hairline-dark'
          }`}>
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <phantom-ui loading={isTableLoading} animation="shimmer" className="block space-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-muted dark:text-on-dark-muted truncate" title={item.label}>
                  {item.label}
                </p>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-1.5 mt-0.5">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark">
                  {item.value}
                </p>
                {item.isClickable && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border whitespace-nowrap ${
                    item.isActive
                      ? 'bg-accent border-accent text-white shadow-2xs'
                      : 'bg-accent-soft dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/40 group-hover:bg-accent group-hover:border-accent group-hover:text-white'
                  }`}>
                    <Filter className="w-2.5 h-2.5" />
                    {item.isActive ? 'Filter Clean' : 'Klik Filter'}
                  </span>
                )}
              </div>
            </phantom-ui>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
