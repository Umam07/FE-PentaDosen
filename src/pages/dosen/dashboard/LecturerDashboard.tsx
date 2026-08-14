import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, FileText, Globe, RefreshCw, Award, 
  BookOpen, Building2, Mail, GraduationCap, Fingerprint
} from 'lucide-react';

import useLecturerDashboard from './useLecturerDashboard';
import InternalDocumentsView from './components/InternalDocumentsView';
import ExternalDocumentsView from './components/ExternalDocumentsView';

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
      val: grandTotal.toLocaleString(), 
      icon: Award
    },
    { 
      label: 'Total KPI Tahun Ini',
      val: grandTotalThisYear.toLocaleString(),
      icon: Globe
    },
    { 
      label: 'Poin (Internal)',
      val: internalPoints.toLocaleString(),
      icon: FileText
    }
  ];

  if (loading) return (
    <phantom-ui loading={true} animation="shimmer" className="block space-y-6 max-w-none pb-12">
      {/* Profile Card Shell */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Profile Info Row Skeleton */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="flex gap-4">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex min-h-[88px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* Scholar & Scopus Skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center space-y-2">
                    <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                    <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switcher & Content Skeleton */}
      <div className="h-12 w-full sm:w-80 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-8" />
      <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 mt-6" />
    </phantom-ui>
  );

  return (
    <div className="w-full space-y-6 pb-20">

      {/* MAIN PROFILE & KPI SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        {/* Top Profile Info Section */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 sm:h-22 sm:w-22">
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
              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-2xl font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                {activeUser?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          {/* Name & Academic Meta */}
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {activeUser?.name || 'Dosen'}
            </h2>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              {affiliation ? (
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span className="truncate">{affiliation}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>Universitas YARSI</span>
                </div>
              )}

              {activeUser?.email && (
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span className="truncate">{activeUser.email}</span>
                </div>
              )}

              {activeUser?.nidn && (
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <GraduationCap className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>NIDN: {activeUser.nidn}</span>
                </div>
              )}

              {activeUser?.penta_id && (
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Fingerprint className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                  <span>Penta ID: {activeUser.penta_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* KPI Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statsLocal.map((stat, i) => (
            <div
              key={i}
              className="flex min-h-[88px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <span className="mt-1 block text-2xl font-extrabold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {stat.val}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* Scholar & Scopus Cards Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          
          {/* Google Scholar Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Google Scholar</h3>
                  {activeUser?.scholar_id ? (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      ID: {activeUser.scholar_id}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      ID belum dikonfigurasi
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    scholarData
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${scholarData ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {scholarData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>
              </div>

              {scholarData ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Dokumen
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scholarData.document_count ?? profileData?.publications?.length ?? 0}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Total Sitasi
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scholarData.total_citations}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      h-index
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scholarData.h_index}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-dashed border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
                  <BookOpen className="h-6 w-6 text-slate-300 dark:text-slate-600 mb-1.5" />
                  <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada data terhubung</p>
                </div>
              )}
            </div>

            {scholarData?.last_synced && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right mt-3">
                Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

          {/* Scopus Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Scopus</h3>
                  {activeUser?.scopus_id ? (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      ID: {activeUser.scopus_id}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      ID belum dikonfigurasi
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    scopusData
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${scopusData ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {scopusData ? 'Tersinkron' : 'Belum Sinkron'}
                </span>
              </div>

              {scopusData ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Dokumen
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scopusData.document_count}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Total Sitasi
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scopusData.total_citations}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/80">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      h-index
                    </span>
                    <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {scopusData.h_index}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-dashed border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
                  <Globe className="h-6 w-6 text-slate-300 dark:text-slate-600 mb-1.5" />
                  <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada data terhubung</p>
                </div>
              )}
            </div>

            {scopusData?.last_synced && (
              <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right mt-3">
                Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            )}
          </div>

        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

        {/* Point Contribution Section (Streamlined & Compact) */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Kontribusi Poin
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Perbandingan sumber perolehan poin Anda
              </p>
            </div>

            {/* Compact Inline Legend & Points */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">
                  Internal:{' '}
                  <strong className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {internalPoints.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-[11px] text-slate-400">({internalPct.toFixed(1)}%)</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">
                  Eksternal:{' '}
                  <strong className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {apiPoints.total.toLocaleString()} pts
                  </strong>{' '}
                  <span className="text-[11px] text-slate-400">({apiPct.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clean Slim Progress Track */}
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
            {internalPct > 0 && (
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${internalPct}%` }}
              />
            )}
            {apiPct > 0 && (
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${apiPct}%` }}
              />
            )}
          </div>

          {/* Minimal Meta Subtext */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            <span>{approvedDocs.length} dokumen internal terverifikasi</span>
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>Poin diverifikasi Admin sesuai pedoman SINTA</span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* View Switcher Tabs & Refresh Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="grid grid-cols-2 sm:flex w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 gap-1">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-semibold tracking-tight sm:tracking-wide transition-all ${
                activeView === view.id 
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <view.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeView === view.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
              <span className="truncate">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl text-xs font-semibold border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Memuat...' : 'Refresh Dokumen'}</span>
        </button>
      </div>

      {/* Tab Content View */}
      <div className="mt-4">
        {activeView === 'external' && (
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
        )}

        {activeView === 'internal' && (
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
        )}
      </div>

    </div>
  );
}

