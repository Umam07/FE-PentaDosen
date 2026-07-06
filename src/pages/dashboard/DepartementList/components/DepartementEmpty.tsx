import React from 'react';
import { Search } from 'lucide-react';

export default function DepartementEmpty() {
  return (
    <div className="text-center py-20 space-y-6">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
        <Search className="w-10 h-10 text-slate-300" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Tidak ada hasil</h3>
        <p className="text-slate-500 text-sm">Coba kata kunci lain atau filter yang berbeda.</p>
      </div>
    </div>
  );
}
