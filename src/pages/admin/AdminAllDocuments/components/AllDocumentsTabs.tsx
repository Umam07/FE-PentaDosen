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
            className={`px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isSelected 
                ? 'border-accent dark:border-accent-on-dark text-ink-heading dark:text-on-dark bg-surface-light dark:bg-surface-dark font-bold' 
                : 'border-transparent text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-accent dark:text-accent-on-dark' : 'text-muted dark:text-on-dark-muted'}`} />
            <span>{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
