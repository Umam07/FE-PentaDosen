import React from 'react';

export default function LecturerSkeleton() {
  return (
    <phantom-ui loading={true} animation="shimmer" count={8} className="contents">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-3xl p-7 border border-hairline-light dark:border-hairline-dark h-[480px] space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl" />
            <div className="w-24 h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-3/4" />
            <div className="h-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-1/2" />
          </div>
          <div className="h-32 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl" />
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-2">
              <div className="h-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded w-12" />
              <div className="h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded w-16" />
            </div>
            <div className="w-10 h-10 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full" />
          </div>
        </div>
      ))}
    </phantom-ui>
  );
}

