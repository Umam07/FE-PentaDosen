import React from 'react';

export default function ProfileSkeleton() {
  return (
    <phantom-ui loading={true} animation="shimmer" className="block space-y-6 pb-20">
      {/* Back button skeleton */}
      <div className="h-4 w-40 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg animate-pulse" />

      {/* Main Profile Card Shell */}
      <div className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xs">
        {/* Top Profile details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated shrink-0 animate-pulse" />
          <div className="space-y-2.5 flex-1">
            <div className="h-4 w-32 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-pill animate-pulse" />
            <div className="h-7 w-60 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-surface-light-raised dark:bg-surface-dark-elevated rounded animate-pulse" />
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex min-h-[80px] items-center gap-3.5 rounded-2xl border border-hairline-light bg-surface-light-raised p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated"
            >
              <div className="h-10 w-10 rounded-xl bg-surface-light dark:bg-surface-dark shrink-0 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-surface-light dark:bg-surface-dark rounded animate-pulse" />
                <div className="h-5 w-14 bg-surface-light dark:bg-surface-dark rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* Scholar & Scopus Cards */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-hairline-light bg-surface-light-raised p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-surface-light dark:bg-surface-dark animate-pulse" />
                  <div className="h-4 w-28 bg-surface-light dark:bg-surface-dark rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-surface-light dark:bg-surface-dark rounded-pill animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-surface-light dark:bg-surface-dark rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switcher & Content Skeleton */}
      <div className="h-10 w-80 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl animate-pulse" />
      <div className="h-96 rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark animate-pulse" />
    </phantom-ui>
  );
}
