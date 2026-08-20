import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Info, FileText, Globe, RefreshCw, Award, 
  BookOpen, Building2, Mail, GraduationCap, Fingerprint, ExternalLink
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

  const affiliation = [activeUser?.program_studi, activeUser?.fakultas].filter(Boolean).join(' • ');

  const internalPct = grandTotal > 0 ? (internalPoints / grandTotal) * 100 : 0;
  const apiPct = grandTotal > 0 ? (apiPoints.total / grandTotal) * 100 : 0;

  const tabVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  const statsLocal = [
    { 
      label: 'Total KPI Overall', 
      val: loading && !profileData ? null : grandTotal.toLocaleString(), 
      icon: Award
    },
    { 
      label: 'Total KPI Tahun Ini',
      val: loading && !profileData ? null : grandTotalThisYear.toLocaleString(),
      icon: Globe
    },
    { 
      label: 'Poin (Internal)',
      val: loading && !profileData ? null : internalPoints.toLocaleString(),
      icon: FileText
    }
  ];

  return (
    <div className="w-full space-y-6 pb-20">

      {/* MAIN PROFILE & KPI SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xs"
      >
        {/* Top Profile Info Section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated sm:h-22 sm:w-22">
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

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted dark:text-on-dark-muted">
              {affiliation ? (
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="h-4 w-4 shrink-0 text-muted dark:text-on-dark-muted" />
                  <span className="truncate">{affiliation}</span>
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
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {statsLocal.map((stat, i) => (
            <div
              key={i}
              className="flex min-h-[80px] items-center gap-3.5 rounded-2xl border border-hairline-light bg-surface-light-raised p-4 transition-all duration-200 hover:border-hairline-light hover:bg-surface-light dark:border-hairline-dark dark:bg-surface-dark-elevated dark:hover:border-hairline-dark dark:hover:bg-surface-dark"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline-light bg-surface-light text-body-strong dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <phantom-ui loading={loading && !profileData} animation="shimmer" className="block space-y-0.5">
                  <span className="block text-xs font-semibold text-muted dark:text-on-dark-muted truncate">
                    {stat.label}
                  </span>
                  <span className="block text-xl font-bold font-mono leading-tight tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {stat.val ?? '0'}
                  </span>
                </phantom-ui>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* Scholar & Scopus Cards Row (Compact & Streamlined) */}
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          
          {/* Google Scholar Compact Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light-raised p-3.5 sm:p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated">
            <div className="space-y-3">
              {/* Card Header: Icon, Info, Status & Profile Link */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold tracking-tight text-ink-heading dark:text-on-dark truncate">
                        Google Scholar
                      </h3>
                      {activeUser?.scholar_id && (
                        <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted hidden sm:inline truncate">
                          ({activeUser.scholar_id})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                      scholarData
                        ? 'border-hairline-light bg-surface-light text-ink-heading dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark'
                        : 'border-hairline-light-soft bg-transparent text-muted dark:border-hairline-dark-soft dark:text-on-dark-muted'
                    }`}
                  >
                    {scholarData ? 'Tersinkron' : (loading && !profileData ? 'Memuat...' : 'Belum Sinkron')}
                  </span>

                  {activeUser?.scholar_id && (
                    <a
                      href={`https://scholar.google.com/citations?user=${activeUser.scholar_id.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-hairline-light bg-surface-light px-2 py-0.5 text-[10px] font-semibold text-body hover:text-ink-heading hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-soft dark:hover:text-on-dark dark:hover:bg-surface-dark-elevated transition-colors"
                      title="Buka Profil Google Scholar"
                    >
                      <span>Profil</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Metrics Compact Bar */}
              <phantom-ui loading={loading && !profileData} animation="shimmer" className="block">
                {scholarData ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Dokumen
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.document_count ?? profileData?.publications?.length ?? 0}
                      </span>
                    </div>

                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Sitasi
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.total_citations}
                      </span>
                    </div>

                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        h-index
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.h_index}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 px-3 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                    <BookOpen className="h-3.5 w-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                    <p className="text-[11px] text-muted dark:text-on-dark-muted">Belum terhubung</p>
                  </div>
                )}
              </phantom-ui>
            </div>
          </div>

          {/* Scopus Compact Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-hairline-light bg-surface-light-raised p-3.5 sm:p-4 dark:border-hairline-dark dark:bg-surface-dark-elevated">
            <div className="space-y-3">
              {/* Card Header: Icon, Info, Status & Profile Link */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold tracking-tight text-ink-heading dark:text-on-dark truncate">
                        Scopus
                      </h3>
                      {activeUser?.scopus_id && (
                        <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted hidden sm:inline truncate">
                          ({activeUser.scopus_id})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                      scopusData
                        ? 'border-hairline-light bg-surface-light text-ink-heading dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark'
                        : 'border-hairline-light-soft bg-transparent text-muted dark:border-hairline-dark-soft dark:text-on-dark-muted'
                    }`}
                  >
                    {scopusData ? 'Tersinkron' : (loading && !profileData ? 'Memuat...' : 'Belum Sinkron')}
                  </span>

                  {activeUser?.scopus_id && (
                    <a
                      href={`https://www.scopus.com/authid/detail.uri?authorId=${activeUser.scopus_id.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-hairline-light bg-surface-light px-2 py-0.5 text-[10px] font-semibold text-body hover:text-ink-heading hover:bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-soft dark:hover:text-on-dark dark:hover:bg-surface-dark-elevated transition-colors"
                      title="Buka Profil Scopus"
                    >
                      <span>Profil</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Metrics Compact Bar */}
              <phantom-ui loading={loading && !profileData} animation="shimmer" className="block">
                {scopusData ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Dokumen
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.document_count}
                      </span>
                    </div>

                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Sitasi
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.total_citations}
                      </span>
                    </div>

                    <div className="rounded-xl border border-hairline-light bg-surface-light px-2.5 py-1.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        h-index
                      </span>
                      <span className="block text-sm font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.h_index}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 px-3 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                    <Globe className="h-3.5 w-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                    <p className="text-[11px] text-muted dark:text-on-dark-muted">Belum terhubung</p>
                  </div>
                )}
              </phantom-ui>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-5 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* Point Contribution Section (Streamlined & Compact) */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-heading dark:text-on-dark">
                Kontribusi Poin
              </h3>
            </div>

            {/* Compact Inline Legend & Points */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-scopus dark:bg-chart-scopus-dark shrink-0" />
                <span className="text-body dark:text-on-dark-soft text-[11px]">
                  Internal:{' '}
                  <strong className="font-bold text-ink-heading dark:text-on-dark tabular-nums font-mono">
                    {internalPoints.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-muted dark:text-on-dark-muted">({internalPct.toFixed(1)}%)</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent dark:bg-accent-on-dark shrink-0" />
                <span className="text-body dark:text-on-dark-soft text-[11px]">
                  Eksternal:{' '}
                  <strong className="font-bold text-ink-heading dark:text-on-dark tabular-nums font-mono">
                    {apiPoints.total.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-muted dark:text-on-dark-muted">({apiPct.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clean Slim Progress Track */}
          <div className="h-1.5 w-full rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden flex border border-hairline-light dark:border-hairline-dark">
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

          {/* Minimal Meta Subtext */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted dark:text-on-dark-muted">
            <span>{approvedDocs.length} dokumen internal terverifikasi</span>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0 text-muted dark:text-on-dark-muted" />
              <span>Sesuai pedoman SINTA</span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* View Switcher Tabs & Refresh Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="grid grid-cols-2 sm:flex w-full sm:w-auto p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark gap-1">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                activeView === view.id 
                  ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs' 
                  : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
              }`}
            >
              <view.icon className={`w-4 h-4 shrink-0`} />
              <span className="truncate">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark text-body-strong hover:text-ink-heading dark:text-on-dark dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated rounded-xl text-xs font-semibold border border-hairline-light dark:border-hairline-dark shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Memuat...' : 'Refresh Dokumen'}</span>
        </button>
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

