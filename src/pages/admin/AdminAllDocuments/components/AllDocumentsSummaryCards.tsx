import React from 'react';
import { Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AllDocumentsSummaryCardsProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsSummaryCards({
  activeTab,
  totalCount,
  approvedCount,
  pendingCount,
  tabDetails
}: AllDocumentsSummaryCardsProps) {
  const currentTabInfo = tabDetails[activeTab];

  const stats = [
    { 
      label: `Total ${activeTab}`, 
      value: totalCount, 
      icon: currentTabInfo.icon, 
      type: 'neutral' 
    },
    { 
      label: 'Telah Disetujui', 
      value: approvedCount, 
      icon: Award, 
      type: 'success' 
    },
    { 
      label: 'Menunggu Verifikasi', 
      value: pendingCount, 
      icon: Clock, 
      type: 'warning' 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, i) => {
        const IconComponent = stat.icon;
        return (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.2 }}
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-xs"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
              stat.type === 'success' 
                ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30' :
              stat.type === 'warning' 
                ? 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30' :
                'bg-ink-soft dark:bg-surface-dark-elevated text-body dark:text-on-dark border border-ink-border/50 dark:border-hairline-dark'
            }`}>
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-[0.15em]">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-ink-heading dark:text-on-dark mt-0.5 tabular-nums">{stat.value.toLocaleString('id-ID')}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
