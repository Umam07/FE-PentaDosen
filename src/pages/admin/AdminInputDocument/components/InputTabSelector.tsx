import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import type { InputTabSelectorProps } from '../types/adminInputDocument.types';

export default function InputTabSelector({
  activeTab,
  onTabChange
}: InputTabSelectorProps) {
  return (
    <div className="flex border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl p-1 max-w-md">
      <button
        type="button"
        onClick={() => onTabChange('manual')}
        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
          activeTab === 'manual'
            ? 'bg-surface-light dark:bg-surface-dark shadow-xs border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark'
            : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <FileText className={`w-3.5 h-3.5 ${activeTab === 'manual' ? 'text-accent dark:text-accent-on-dark' : 'text-muted'}`} />
          Input Manual
        </span>
      </button>
      <button
        type="button"
        onClick={() => onTabChange('import')}
        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
          activeTab === 'import'
            ? 'bg-surface-light dark:bg-surface-dark shadow-xs border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark'
            : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === 'import' ? 'text-accent dark:text-accent-on-dark' : 'text-muted'}`} />
          Import Excel Massal
        </span>
      </button>
    </div>
  );
}
