import React from 'react';
import Navbar from '../../../../components/Home/Navbar';
import Footer from '../../../../components/Home/Footer';

export default function ProfileInsightsSkeleton() {
  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark transition-colors duration-500 font-sans">
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-6">
        <phantom-ui loading={true} animation="shimmer" className="block space-y-6">
          {/* Back button skeleton */}
          <div className="h-4 w-40 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg animate-pulse" />

          {/* Main Profile Card Shell */}
          <div className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xs">
            {/* Top Profile details */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated shrink-0 animate-pulse" />
              <div className="space-y-2.5 flex-1">
                <div className="h-4 w-32 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-pill animate-pulse" />
                <div className="h-7 w-60 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg animate-pulse" />
                <div className="h-4 w-72 bg-surface-light-raised dark:bg-surface-dark-elevated rounded animate-pulse" />
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

            {/* KPI Stats Row (Flat Divided) */}
            <div className="grid grid-cols-3 divide-x divide-hairline-light dark:divide-hairline-dark">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-2 sm:px-3 first:pl-0 last:pr-0 space-y-2">
                  <div className="h-7 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded animate-pulse" />
                  <div className="h-3 w-28 bg-surface-light-raised dark:bg-surface-dark-elevated rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Contribution Progress Bar */}
            <div className="mt-5 space-y-2">
              <div className="h-4 w-48 bg-surface-light-raised dark:bg-surface-dark-elevated rounded animate-pulse" />
              <div className="h-2 w-full rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated animate-pulse" />
            </div>
          </div>

          {/* Switcher & Content Skeleton */}
          <div className="h-10 w-80 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl animate-pulse" />
          <div className="h-96 rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark animate-pulse" />
        </phantom-ui>
      </main>
      <Footer />
    </div>
  );
}
