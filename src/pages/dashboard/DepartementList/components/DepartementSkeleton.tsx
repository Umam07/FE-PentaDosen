import React from 'react';

export default function DepartementSkeleton() {
  return (
    <phantom-ui loading={true} animation="shimmer" count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface-light dark:bg-surface-dark p-7 rounded-3xl border border-hairline-light dark:border-hairline-dark min-h-[460px] flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated" />
              <div className="w-20 h-5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-3/4" />
              <div className="h-12 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/50 rounded-md w-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
              <div className="h-4 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
            </div>
          </div>
          <div className="pt-5 border-t border-hairline-light-soft dark:border-hairline-dark-soft space-y-4">
            <div className="h-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl" />
            <div className="h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-1/2" />
          </div>
        </div>
      ))}
    </phantom-ui>
  );
}

