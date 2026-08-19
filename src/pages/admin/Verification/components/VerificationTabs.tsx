import React from 'react';
import { VerificationTabsProps } from '../types/verification.types';

export default function VerificationTabs({
  activeTab,
  onTabChange
}: VerificationTabsProps) {
  return (
    <div className="flex border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated overflow-x-auto scrollbar-hide">
      {(['publikasi', 'hki', 'penelitian', 'buku'] as const).map((tab) => (
         <button
           key={tab}
           onClick={() => onTabChange(tab)}
           className={`px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
             activeTab === tab 
               ? 'border-accent dark:border-accent-on-dark text-ink-heading dark:text-on-dark bg-surface-light dark:bg-surface-dark font-bold' 
               : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
           }`}
         >
           {tab}
         </button>
      ))}
    </div>
  );
}
