import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Mail, GraduationCap, Fingerprint, ExternalLink
} from 'lucide-react';

import useLecturerDashboard from './useLecturerDashboard';

const InternalDocumentsView = lazy(() => import('./components/InternalDocumentsView'));
const ExternalDocumentsView = lazy(() => import('./components/ExternalDocumentsView'));

export default function LecturerDashboard({ user }: { user: any }) {
  const {
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    categoryFilter,
    setCategoryFilter,
    activeView,
    setActiveView,
    publicationSubTab,
    setPublicationSubTab,
    profileData,
    fetchData,
    internalDocumentsOnly,
    approvedDocs,
    apiPoints,
    internalPoints,
    grandTotal,
    apiPoints3Years,
    internalPoints3Years,
    grandTotal3Years,
    apiPointsThisYear,
    internalPointsThisYear,
    grandTotalThisYear,
    filteredDocs,
    scholarChartData,
    scopusChartData
  } = useLecturerDashboard(user);

  const activeUser = profileData?.user || user;
  const scholarData = profileData?.scholarData;
  const scopusData = profileData?.scopusData;

  const programStudi = activeUser?.program_studi;

  const internalPct = grandTotal > 0 ? (internalPoints / grandTotal) * 100 : 0;
  const apiPct = grandTotal > 0 ? (apiPoints.total / grandTotal) * 100 : 0;

  const tabVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  const statsLocal = [
    { label: 'KPI Overall', fullLabel: 'Total KPI Overall', val: loading && !profileData ? null : grandTotal.toLocaleString() },
    { label: 'KPI 3 Tahun', fullLabel: 'Total KPI 3 Tahun', val: loading && !profileData ? null : grandTotal3Years.toLocaleString() },
    { label: 'KPI Tahun Ini', fullLabel: 'Total KPI Tahun Ini', val: loading && !profileData ? null : grandTotalThisYear.toLocaleString() },
  ];

  return (
    <div className="w-full space-y-6 pb-20">

      {/* MAIN PROFILE & EXECUTIVE SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-7 shadow-2xs"
      >
        {/* Top Profile Info Section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated sm:h-20 sm:w-20">
            {activeUser?.avatar ? (
              <img
                src={activeUser.avatar}
                alt={activeUser?.name || 'User'}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : scholarData?.thumbnail ? (
              <img
                src={scholarData.thumbnail}
                alt={activeUser?.name || 'User'}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-ink text-2xl font-bold text-on-ink dark:bg-on-dark dark:text-ink">
                {activeUser?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          {/* Name & Academic Meta */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="truncate text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark sm:text-2xl">
              {activeUser?.name || 'Dosen'}
            </h2>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted dark:text-on-dark-muted">
              {programStudi ? (
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span className="truncate">{programStudi}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span>Universitas YARSI</span>
                </div>
              )}

              {activeUser?.email && (
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span className="truncate">{activeUser.email}</span>
                </div>
              )}

              {activeUser?.nidn && (
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <GraduationCap className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span>NIDN: {activeUser.nidn}</span>
                </div>
              )}

              {activeUser?.penta_id && (
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Fingerprint className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span>Penta ID: {activeUser.penta_id}</span>
                </div>
              )}

              {/* Scopus Profile Link */}
              {activeUser?.scopus_id && (
                <a
                  href={`https://www.scopus.com/authid/detail.uri?authorId=${activeUser.scopus_id.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-ink-heading dark:hover:text-on-dark transition-colors group"
                  title="Buka Profil Scopus"
                  aria-label="Buka Profil Scopus"
                >
                  <span className="h-2 w-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark shrink-0" />
                  <span>Scopus</span>
                  <ExternalLink className="h-3 w-3 text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark transition-colors" />
                </a>
              )}

              {/* Scholar Profile Link */}
              {activeUser?.scholar_id && (
                <a
                  href={`https://scholar.google.com/citations?user=${activeUser.scholar_id.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-ink-heading dark:hover:text-on-dark transition-colors group"
                  title="Buka Profil Google Scholar"
                  aria-label="Buka Profil Google Scholar"
                >
                  <span className="h-2 w-2 rounded-full bg-chart-scholar dark:bg-chart-scholar-dark shrink-0" />
                  <span>Scholar</span>
                  <ExternalLink className="h-3 w-3 text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark transition-colors" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* ─── Inline KPI Stats (flat, no cards) ─── */}
        <div className="grid grid-cols-3 divide-x divide-hairline-light dark:divide-hairline-dark">
          {statsLocal.map((stat, i) => (
            <div key={i} className="px-2 sm:px-3 first:pl-0 last:pr-0 text-center sm:text-left">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums leading-none">
                {stat.val ?? (loading && !profileData ? '…' : '0')}
              </span>
              <span className="block text-[11px] sm:text-xs font-semibold text-muted dark:text-on-dark-muted mt-1.5 leading-tight sm:leading-normal">
                <span className="hidden sm:inline">{stat.fullLabel}</span>
                <span className="inline sm:hidden">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>

        {/* ─── Kontribusi Poin (Internal vs Eksternal) ─── */}
        <div className="mt-5 space-y-2">
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="font-semibold text-ink-heading dark:text-on-dark">
                Kontribusi Poin:
              </span>
              
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark shrink-0" />
                <span className="text-muted dark:text-on-dark-muted">
                  Internal <strong className="font-bold font-mono text-xs sm:text-sm text-ink-heading dark:text-on-dark tabular-nums">{internalPoints.toLocaleString()}</strong> <span className="font-mono text-muted dark:text-on-dark-muted">({internalPct.toFixed(1)}%)</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent dark:bg-accent-on-dark shrink-0" />
                <span className="text-muted dark:text-on-dark-muted">
                  Eksternal <strong className="font-bold font-mono text-xs sm:text-sm text-ink-heading dark:text-on-dark tabular-nums">{apiPoints.total.toLocaleString()}</strong> <span className="font-mono text-muted dark:text-on-dark-muted">({apiPct.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contribution Progress Bar (8px / h-2 sesuai token contribution-bar design.md) */}
          <div className="h-2 w-full rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden flex">
            {internalPct > 0 && (
              <div
                className="h-full bg-chart-scopus dark:bg-chart-scopus-dark transition-all duration-500"
                style={{ width: `${internalPct}%` }}
              />
            )}
            {apiPct > 0 && (
              <div
                className="h-full bg-accent dark:bg-accent-on-dark transition-all duration-500"
                style={{ width: `${apiPct}%` }}
              />
            )}
          </div>
        </div>

      </motion.div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex w-full sm:w-auto p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark gap-1">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', shortLabel: 'Dokumen Eksternal' },
            { id: 'internal', label: 'Dokumen Internal', shortLabel: 'Dokumen Internal' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex-1 sm:flex-initial flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer text-center ${
                activeView === view.id 
                  ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs' 
                  : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
              }`}
            >
              <span className="hidden sm:inline">{view.label}</span>
              <span className="inline sm:hidden">{view.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content View */}
      <div className="mt-4">
        {activeView === 'external' && (
          <Suspense fallback={
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 min-h-[400px] animate-pulse" />
          }>
            <div className="space-y-6">
              <ExternalDocumentsView 
                publicationSubTab={publicationSubTab}
                setPublicationSubTab={setPublicationSubTab}
                scopusChartData={scopusChartData}
                scholarChartData={scholarChartData}
                scopusData={scopusData}
                scholarData={scholarData}
                publications={profileData?.publications || []}
                scopusPublications={profileData?.scopusPublications || []}
                tabVariants={tabVariants}
                onRefresh={fetchData}
                loading={loading}
              />
            </div>
          </Suspense>
        )}

        {activeView === 'internal' && (
          <Suspense fallback={
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 min-h-[400px] animate-pulse" />
          }>
            <InternalDocumentsView 
              filteredDocs={filteredDocs}
              allInternalDocs={internalDocumentsOnly}
              loading={loading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          </Suspense>
        )}
      </div>

    </div>
  );
}

