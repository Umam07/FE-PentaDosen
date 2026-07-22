import React from 'react';

export default function LecturerSkeleton() {
  return (
    <phantom-ui loading={true} animation="shimmer" count={8} className="contents">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-100 dark:border-slate-800/80 h-[480px] space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
          <div className="h-32 bg-slate-200/50 dark:bg-slate-800/40 rounded-2xl" />
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            </div>
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </phantom-ui>
  );
}

