import React from 'react';

export default function LecturerSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark min-h-[480px] flex flex-col justify-between animate-pulse"
        >
          <div className="space-y-4">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl" />
              <div className="w-28 h-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
            </div>
            
            {/* Name & Badge */}
            <div className="space-y-2">
              <div className="h-5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-4/5" />
              <div className="h-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md w-3/5" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                <div className="h-5 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
              </div>
            </div>

            {/* Metrics Block */}
            <div className="space-y-3 py-3 border-y border-hairline-light-soft dark:border-hairline-dark-soft">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                <div className="h-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                <div className="h-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl" />
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-end pt-4">
            <div className="space-y-1.5">
              <div className="h-3 w-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
              <div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
            </div>
            <div className="h-8 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}
