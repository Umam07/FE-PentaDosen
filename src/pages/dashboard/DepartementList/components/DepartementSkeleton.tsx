import React from 'react';

export default function DepartementSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-surface-light dark:bg-surface-dark p-6 sm:p-7 rounded-3xl border border-hairline-light dark:border-hairline-dark min-h-[460px] flex flex-col justify-between animate-pulse"
        >
          <div className="space-y-4">
            {/* Top Row */}
            <div className="flex items-start justify-between">
              <div className="w-13 h-13 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated" />
              <div className="w-24 h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-3/4" />
              <div className="h-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-full" />
              <div className="h-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-4/5" />
            </div>

            {/* Program Studi */}
            <div className="space-y-2 pt-1">
              <div className="h-3 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
              <div className="flex gap-1.5 flex-wrap">
                <div className="h-6 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                <div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mt-5 pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft space-y-3.5">
            <div className="h-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl" />
            <div className="flex justify-between items-center pt-1">
              <div className="h-4 w-32 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
              <div className="w-8 h-8 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
