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
    { label: 'Total Dokumen', value: stats.total, icon: FileText, color: 'slate' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'indigo' },
    {
      label: 'Irisan (Cross-Indexed)',
      value: stats.crossIndexed ?? 0,
      icon: Layers,
      color: 'teal',
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
          className={`group bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border p-3.5 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 transition-all relative overflow-hidden ${
            item.isClickable ? 'cursor-pointer hover:border-teal-400 hover:shadow-md active:scale-95' : ''
          } ${
            item.isActive
              ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/40 dark:bg-teal-950/30'
              : 'border-gray-100 dark:border-zinc-800'
          }`}
        >
          <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${
            item.color === 'slate' ? 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400' :
            item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
            item.color === 'amber' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' :
            item.color === 'teal' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400' :
            'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
          }`}>
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <phantom-ui loading={isTableLoading} animation="shimmer" className="block space-y-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[9px] sm:text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-wider truncate" title={item.label}>
                  {item.label}
                </p>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-1.5 mt-0.5">
                <p className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100">{item.value}</p>
                {item.isClickable && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                    item.isActive
                      ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                      : 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/40 group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white'
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
