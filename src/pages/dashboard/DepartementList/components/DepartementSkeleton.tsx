import React from 'react';

export default function DepartementSkeleton() {
  return (
    <phantom-ui loading={true} animation="shimmer" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900/90 p-7 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 min-h-[460px] flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
              <div className="h-12 bg-slate-200/60 dark:bg-slate-800/50 rounded-md w-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
            <div className="h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
        </div>
      ))}
    </phantom-ui>
  );
}

