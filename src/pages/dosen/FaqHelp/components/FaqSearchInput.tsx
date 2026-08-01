import React from 'react';
import { Search, X } from 'lucide-react';
import type { FaqSearchInputProps } from '../types/faqHelp.types';

export default function FaqSearchInput({
  searchQuery,
  onSearchChange,
  onClear
}: FaqSearchInputProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
      <input
        type="text"
        placeholder="Cari panduan, kata kunci, atau topik..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-2xs"
      />
      {searchQuery && (
        <button
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          title="Bersihkan pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
