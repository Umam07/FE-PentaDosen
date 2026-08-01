import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import type { InputTabSelectorProps } from '../types/adminInputDocument.types';

export default function InputTabSelector({
  activeTab,
  onTabChange
}: InputTabSelectorProps) {
  return (
    <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/10 rounded-2xl p-1 max-w-md">
      <button
        type="button"
        onClick={() => onTabChange('manual')}
        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${
          activeTab === 'manual'
            ? 'bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 text-primary-600 dark:text-primary-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Input Manual
        </span>
      </button>
      <button
        type="button"
        onClick={() => onTabChange('import')}
        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${
          activeTab === 'import'
            ? 'bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 text-primary-600 dark:text-primary-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Import Excel Massal
        </span>
      </button>
    </div>
  );
}
