import React from 'react';
import type { DocTab, AllDocumentsTabsProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsTabs({
  activeTab,
  tabDetails,
  onTabChange
}: AllDocumentsTabsProps) {
  const tabsList: DocTab[] = ['publikasi', 'hki', 'penelitian', 'buku'];

  return (
    <div className="flex border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated overflow-x-auto scrollbar-hide">
      {tabsList.map((tab) => {
        const IconComponent = tabDetails[tab].icon;
        const isSelected = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isSelected 
                ? 'border-accent text-ink-heading dark:text-on-dark bg-surface-light dark:bg-surface-dark' 
                : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-accent dark:text-accent-on-dark' : 'text-muted'}`} />
            {tab}
          </button>
        );
      })}
    </div>
  );
}
