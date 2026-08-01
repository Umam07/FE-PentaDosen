import React from 'react';
import { Award, Archive } from 'lucide-react';
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
    { label: `Total ${activeTab}`, value: totalCount, icon: currentTabInfo.icon, color: 'primary' },
    { label: 'Telah Disetujui', value: approvedCount, icon: Award, color: 'emerald' },
    { label: 'Menunggu Verifikasi', value: pendingCount, icon: Archive, color: 'gray' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const IconComponent = stat.icon;
        return (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-6 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
              stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
              stat.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' :
              'bg-gray-50 dark:bg-zinc-800 text-gray-400'
            }`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-3xl font-black mt-0.5 ${
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'primary' ? 'text-primary-600' :
                'text-gray-900 dark:text-zinc-100'
              }`}>{stat.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
