import React from 'react';
import { Users, BookOpen, Globe } from 'lucide-react';
import type { SyncSummaryCardsProps } from '../types/adminSync.types';

export default function SyncSummaryCards({
  totalLecturers,
  scholarConnected,
  scopusConnected
}: SyncSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 flex items-center justify-between transition-all hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated">
         <div>
            <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Database Dosen</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-ink-heading dark:text-on-dark mt-1">{totalLecturers}</p>
         </div>
         <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
            <Users className="h-5 w-5" />
         </div>
      </div>
      
      <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 flex items-center justify-between transition-all hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated">
         <div>
            <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Scholar Connected</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-chart-scholar dark:text-chart-scholar-dark mt-1">{scholarConnected}</p>
         </div>
         <div className="p-3 bg-chart-scholar/10 text-chart-scholar dark:text-chart-scholar-dark rounded-xl border border-chart-scholar/20">
            <BookOpen className="h-5 w-5" />
         </div>
      </div>
      
      <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 flex items-center justify-between transition-all hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated">
         <div>
            <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Scopus Connected</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-chart-scopus dark:text-chart-scopus-dark mt-1">{scopusConnected}</p>
         </div>
         <div className="p-3 bg-chart-scopus/10 text-chart-scopus dark:text-chart-scopus-dark rounded-xl border border-chart-scopus/20">
            <Globe className="h-5 w-5" />
         </div>
      </div>
    </div>
  );
}
