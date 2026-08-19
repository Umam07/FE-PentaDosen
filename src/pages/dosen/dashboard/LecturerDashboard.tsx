import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Info, FileText, Globe, RefreshCw, Award, 
  BookOpen, Building2, Mail, GraduationCap, Fingerprint
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
        className="rounded-3xl border border-hairline-light bg-surface-light p-6 shadow-sm dark:border-hairline-dark dark:bg-surface-dark sm:p-8"
      >
        {/* Top Profile Info Section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-hairline-light bg-surface-light-raised dark:border-hairline-dark dark:bg-surface-dark-elevated sm:h-22 sm:w-22">
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
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="truncate text-2xl font-bold tracking-tight text-ink-heading dark:text-on-dark sm:text-3xl">
              {activeUser?.name || 'Dosen'}
            </h2>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted dark:text-on-dark-muted">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statsLocal.map((stat, i) => (
            <div
              key={i}
              className="flex min-h-[88px] items-center gap-4 rounded-xl border border-hairline-light bg-surface-light-raised p-4 transition-all duration-200 hover:border-hairline-light hover:bg-surface-light dark:border-hairline-dark dark:bg-surface-dark-elevated dark:hover:border-hairline-dark"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-hairline-light bg-surface-light text-body-strong dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <phantom-ui loading={loading && !profileData} animation="shimmer" className="block space-y-1">
                  <span className="block text-[11px] font-semibold tracking-wide text-muted dark:text-on-dark-muted">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-2xl font-extrabold font-mono leading-none tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                    {stat.val ?? '0'}
                  </span>
                </phantom-ui>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* Scholar & Scopus Cards Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Google Scholar Card */}
          <div className="flex flex-col justify-between rounded-xl border border-hairline-light bg-surface-light-raised p-5 dark:border-hairline-dark dark:bg-surface-dark-elevated">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark">Google Scholar</h3>
                  {activeUser?.scholar_id ? (
                    <p className="text-xs font-mono text-muted dark:text-on-dark-muted mt-0.5">
                      ID: {activeUser.scholar_id}
                    </p>
                  ) : (
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                      ID belum dikonfigurasi
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    scholarData
                      ? 'border-success-border bg-success-soft text-success dark:text-success-on-dark'
                      : 'border-hairline-light bg-surface-light text-muted dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-muted'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${scholarData ? 'bg-success' : 'bg-muted'}`} />
                  {scholarData ? 'Tersinkron' : (loading && !profileData ? 'Memuat...' : 'Belum Sinkron')}
                </span>
              </div>

              <phantom-ui loading={loading && !profileData} animation="shimmer" className="block">
                {scholarData ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Dokumen
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.document_count ?? profileData?.publications?.length ?? 0}
                      </span>
                    </div>

                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Total Sitasi
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.total_citations}
                      </span>
                    </div>

                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        h-index
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scholarData.h_index}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                    <BookOpen className="h-6 w-6 text-muted dark:text-on-dark-muted mb-1.5" />
                    <p className="text-xs text-muted dark:text-on-dark-muted">Belum ada data terhubung</p>
                  </div>
                )}
              </phantom-ui>
            </div>

            {scholarData?.last_synced && (
              <div className="text-[11px] text-muted dark:text-on-dark-muted text-right mt-3">
                Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

          {/* Scopus Card */}
          <div className="flex flex-col justify-between rounded-xl border border-hairline-light bg-surface-light-raised p-5 dark:border-hairline-dark dark:bg-surface-dark-elevated">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark">Scopus</h3>
                  {activeUser?.scopus_id ? (
                    <p className="text-xs font-mono text-muted dark:text-on-dark-muted mt-0.5">
                      ID: {activeUser.scopus_id}
                    </p>
                  ) : (
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                      ID belum dikonfigurasi
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    scopusData
                      ? 'border-success-border bg-success-soft text-success dark:text-success-on-dark'
                      : 'border-hairline-light bg-surface-light text-muted dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-muted'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${scopusData ? 'bg-success' : 'bg-muted'}`} />
                  {scopusData ? 'Tersinkron' : (loading && !profileData ? 'Memuat...' : 'Belum Sinkron')}
                </span>
              </div>

              <phantom-ui loading={loading && !profileData} animation="shimmer" className="block">
                {scopusData ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Dokumen
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.document_count}
                      </span>
                    </div>

                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        Total Sitasi
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.total_citations}
                      </span>
                    </div>

                    <div className="rounded-lg border border-hairline-light bg-surface-light p-3.5 text-center dark:border-hairline-dark dark:bg-surface-dark">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
                        h-index
                      </span>
                      <span className="mt-1 block text-2xl font-bold font-mono tracking-tight text-ink-heading dark:text-on-dark tabular-nums">
                        {scopusData.h_index}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-dashed border-hairline-light bg-surface-light dark:border-hairline-dark dark:bg-surface-dark">
                    <Globe className="h-6 w-6 text-muted dark:text-on-dark-muted mb-1.5" />
                    <p className="text-xs text-muted dark:text-on-dark-muted">Belum ada data terhubung</p>
                  </div>
                )}
              </phantom-ui>
            </div>

            {scopusData?.last_synced && (
              <div className="text-[11px] text-muted dark:text-on-dark-muted text-right mt-3">
                Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-hairline-light dark:bg-hairline-dark" />

        {/* Point Contribution Section (Streamlined & Compact) */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-heading dark:text-on-dark">
                Kontribusi Poin
              </h3>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">
                Perbandingan sumber perolehan poin Anda
              </p>
            </div>

            {/* Compact Inline Legend & Points */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-body dark:text-on-dark-soft">
                  Internal:{' '}
                  <strong className="font-bold text-ink-heading dark:text-on-dark tabular-nums font-mono">
                    {internalPoints.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-[11px] text-muted dark:text-on-dark-muted">({internalPct.toFixed(1)}%)</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent dark:bg-accent-on-dark shrink-0" />
                <span className="text-body dark:text-on-dark-soft">
                  Eksternal:{' '}
                  <strong className="font-bold text-ink-heading dark:text-on-dark tabular-nums font-mono">
                    {apiPoints.total.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-[11px] text-muted dark:text-on-dark-muted">({apiPct.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clean Slim Progress Track */}
          <div className="h-2.5 w-full rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated overflow-hidden flex">
            {internalPct > 0 && (
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${internalPct}%` }}
              />
            )}
            {apiPct > 0 && (
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${apiPct}%` }}
              />
            )}
          </div>

          {/* Minimal Meta Subtext */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted dark:text-on-dark-muted pt-1">
            <span>{approvedDocs.length} dokumen internal terverifikasi</span>
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 text-muted dark:text-on-dark-muted" />
              <span>Poin diverifikasi Admin sesuai pedoman SINTA</span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* View Switcher Tabs & Refresh Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="grid grid-cols-2 sm:flex w-full sm:w-auto p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark gap-1">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-tight sm:tracking-wide transition-all cursor-pointer ${
                activeView === view.id 
                  ? 'bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark shadow-xs font-bold' 
                  : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
              }`}
            >
              <view.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeView === view.id ? 'text-accent dark:text-accent-on-dark' : 'text-muted'}`} />
              <span className="truncate">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark text-body-strong hover:text-ink-heading dark:text-on-dark-soft dark:hover:text-on-dark rounded-lg text-xs font-semibold border border-hairline-light dark:border-hairline-dark shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
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

