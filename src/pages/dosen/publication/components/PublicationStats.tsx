import React from 'react';
import { FileText, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicationStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    points: number;
  };
  isTableLoading: boolean;
}

export default function PublicationStats({ stats, isTableLoading }: PublicationStatsProps) {
  const statItems = [
    { label: 'Total Dokumen', value: stats.total, icon: FileText, color: 'blue' },
    { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
    { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
    { label: 'Total Poin KPI', value: stats.points, icon: Sparkles, color: 'indigo' },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
        >
          <div className={`p-3 rounded-xl shrink-0 ${
            item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' :
            item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
            item.color === 'amber' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' :
            'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
          }`}>
            <item.icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">{item.label}</p>
            {isTableLoading ? (
              <div className="h-6 w-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 mt-0.5">{item.value}</p>
            )}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
