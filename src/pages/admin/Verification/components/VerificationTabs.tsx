import React from 'react';
import { VerificationTabsProps } from '../types/verification.types';

export default function VerificationTabs({
  activeTab,
  onTabChange
}: VerificationTabsProps) {
  return (
    <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/10 overflow-x-auto scrollbar-hide">
      {(['publikasi', 'hki', 'penelitian', 'buku'] as const).map((tab) => (
         <button
           key={tab}
           onClick={() => onTabChange(tab)}
           className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap ${
             activeTab === tab 
               ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-zinc-900' 
               : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
           }`}
         >
           {tab}
         </button>
      ))}
    </div>
  );
}
