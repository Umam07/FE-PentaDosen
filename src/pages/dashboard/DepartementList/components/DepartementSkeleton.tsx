import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DepartementSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Menyelaraskan Data...</p>
    </div>
  );
}
