import React from 'react';
import { Search, X } from 'lucide-react';
import type { FaqSearchInputProps } from '../types/faqHelp.types';

export default function FaqSearchInput({
  searchQuery,
  onSearchChange,
  onClear,
}: FaqSearchInputProps) {
  return (
    <div className="relative group w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors pointer-events-none" />
      
      <input
        type="text"
        aria-label="Cari panduan, manual book, atau topik FAQ"
        placeholder="Cari topik panduan, sinkronisasi, perhitungan poin, atau kata kunci..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark rounded-xl text-xs sm:text-sm font-medium outline-hidden focus:border-accent dark:focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted shadow-xs"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Bersihkan pencarian"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-body dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          title="Bersihkan pencarian"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
