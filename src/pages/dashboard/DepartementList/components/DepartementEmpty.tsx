import React from 'react';
import { Search } from 'lucide-react';

export default function DepartementEmpty() {
  return (
    <div className="text-center py-20 space-y-6">
      <div className="w-20 h-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full flex items-center justify-center mx-auto border border-dashed border-hairline-light dark:border-hairline-dark">
        <Search className="w-10 h-10 text-muted dark:text-on-dark-muted" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-ink-heading dark:text-on-dark">Tidak ada hasil</h3>
        <p className="text-muted dark:text-on-dark-muted text-sm">Coba kata kunci lain atau filter yang berbeda.</p>
      </div>
    </div>
  );
}
