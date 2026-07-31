import React from 'react';
import { motion } from 'motion/react';
import { 
  Info, FileText, Globe, RefreshCw, Award, 
  BookOpen, ShieldCheck, Mail, Fingerprint, TrendingUp,
  Database, Zap, User
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



  if (loading) return (
    <phantom-ui loading={true} animation="shimmer" className="block space-y-6 max-w-none pb-12">
      {/* Profile Card Shell */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        {/* Cover Banner */}
        <div className="h-28 sm:h-32 w-full bg-slate-100 dark:bg-slate-950 border-b border-slate-200/40 dark:border-slate-850"></div>
        
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
          {/* Profile details row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-8 relative z-10 mb-6">
            <div className="h-24 w-24 rounded-3xl bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900"></div>
            <div className="space-y-2 pb-1 flex-1">
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-3.5 w-64 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Scholar & Scopus Boxes */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
            {[1, 2].map(i => (
              <div key={i} className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-800/80 dark:bg-slate-950/20 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-center flex flex-col gap-2">
                      <div className="h-2.5 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
                      <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Switcher Tab & Content Area */}
      <div className="h-14 w-full sm:w-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mt-8"></div>
      <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 mt-6"></div>
    </phantom-ui>
  );

  const activeUser = profileData?.user || user;
  const scholarData = profileData?.scholarData;
  const scopusData = profileData?.scopusData;

  const internalPct = grandTotal > 0 ? (internalPoints / grandTotal) * 100 : 0;
  const apiPct = grandTotal > 0 ? (apiPoints.total / grandTotal) * 100 : 0;

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const statsLocal = [
    { 
      label: 'Total KPI Overall', 
      val: grandTotal.toLocaleString(), 
      icon: Award, 
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
    },
    { 
      label: 'Total KPI Tahun Ini',
      val: grandTotalThisYear.toLocaleString(),
      icon: Globe, 
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
    },
    { 
      label: 'Poin (Internal)',
      val: internalPoints.toLocaleString(),
      icon: FileText, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">

      {/* Information Notice — minimalist inline */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl">
        <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed">
          <span className="font-bold">Informasi:</span> Poin berasal dari dokumen yang telah diverifikasi (<em>Approved</em>) oleh Admin. Bobot poin setiap kategori mengacu pada pedoman SINTA.
        </p>
      </div>

      {/* TOP COMPREHENSIVE HEADER CARD */}
      <div 
        className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Header Cover Banner */}
        <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden border-b border-slate-200/40 dark:border-slate-800/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        {/* Profile details & KPI stats container */}
        <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
          {/* Profile details row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left -mt-8 relative z-10 mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg dark:bg-slate-900 border-2 border-white dark:border-slate-800">
                {activeUser?.avatar ? (
                  <img 
                    src={activeUser.avatar} 
                    alt={activeUser?.name || 'Lecturer'} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : scholarData?.thumbnail ? (
                  <img 
                    src={scholarData.thumbnail} 
                    alt={activeUser?.name || 'Lecturer'} 
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary-600 text-2xl font-black text-white">
                    {activeUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-1.5 pb-1 flex-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Lecturer Profile
              </div>
              <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white min-h-[32px] flex items-center justify-center sm:justify-start">
                {loading ? (
                  <span className="inline-block h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-48" />
                ) : (
                  activeUser?.name || 'User'
                )}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                {loading ? (
                  <>
                    <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-24" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    <span className="inline-block h-3.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-28" />
                  </>
                ) : (
                  <>
                    <span className="capitalize">{activeUser?.role || 'Lecturer'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                    {activeUser?.fakultas && (
                      <>
                        <span>{activeUser.fakultas}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                      </>
                    )}
                    <span>{activeUser?.program_studi || 'Lecturer'}</span>
                    {activeUser?.penta_id && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                        <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
                          <Fingerprint className="h-3.5 w-3.5" />
                          <span className="font-black">{activeUser.penta_id}</span>
                        </span>
                      </>
                    )}
                    {activeUser?.email && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:inline" />
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{activeUser.email}</span>
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Elegant Divider */}
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

          {/* KPI Stats Row (Zero Overlap) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
            {statsLocal.map((stat, i) => (
              <div 
                key={i} 
                className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 dark:border-slate-800 dark:from-slate-950/50 dark:to-slate-900/30 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{stat.label}</span>
                  <span className="mt-1.5 block text-2xl font-black leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {loading ? (
                      <span className="inline-block h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-16" />
                    ) : (
                      stat.val
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Scholar & Scopus Boxes Row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
            
            {/* Box Scholar */}
            <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-850 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/80 text-blue-600 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400 shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Google Scholar</h3>
                      {loading ? (
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-805 animate-pulse rounded w-32 mt-1.5" />
                      ) : activeUser?.scholar_id ? (
                        <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1">ID: {activeUser?.scholar_id}</p>
                      ) : (
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                      )}
                    </div>
                  </div>
                  <span
                     className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      !loading && scholarData
                         ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                         : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                     }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${!loading && scholarData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    {loading ? 'Memuat...' : scholarData ? 'Tersinkron' : 'Belum Sinkron'}
                  </span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm text-center flex flex-col justify-center gap-1.5">
                        <span className="h-2.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12 mx-auto" />
                        <span className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-8 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : scholarData ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Dokumen</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{scholarData.document_count ?? profileData?.publications?.length ?? 0}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Sitasi</span>
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{scholarData.total_citations}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">h-index</span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scholarData.h_index}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <BookOpen className="h-8 w-8 text-slate-200 dark:text-slate-850 mb-2" />
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                  </div>
                )}
              </div>
              {!loading && scholarData && (
                <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 text-right mt-5">
                  Update Terakhir: {new Date(scholarData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </div>

            {/* Box Scopus */}
            <div className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 dark:border-slate-850 dark:bg-slate-950/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50/80 text-orange-600 dark:border-orange-900/30 dark:bg-orange-950/20 dark:text-orange-400 shadow-sm">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Scopus</h3>
                      {loading ? (
                        <div className="h-3.5 bg-slate-200 dark:bg-slate-805 animate-pulse rounded w-32 mt-1.5" />
                      ) : activeUser?.scopus_id ? (
                        <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1">ID: {activeUser?.scopus_id}</p>
                      ) : (
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">ID tidak terkonfigurasi</p>
                      )}
                    </div>
                  </div>
                  <span
                     className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      !loading && scopusData
                         ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300'
                         : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'
                     }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${!loading && scopusData ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    {loading ? 'Memuat...' : scopusData ? 'Tersinkron' : 'Belum Sinkron'}
                  </span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm text-center flex flex-col justify-center gap-1.5">
                        <span className="h-2.5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-12 mx-auto" />
                        <span className="h-6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-8 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : scopusData ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Dokumen</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{scopusData.document_count}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Sitasi</span>
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{scopusData.total_citations}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col justify-center gap-1">
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">h-index</span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{scopusData.h_index}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <Globe className="h-8 w-8 text-slate-200 dark:text-slate-855 mb-2" />
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Belum ada data terhubung</p>
                  </div>
                )}
              </div>
              {!loading && scopusData && (
                <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 text-right mt-5">
                  Update Terakhir: {new Date(scopusData.last_synced).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              )}
            </div>

          </div>

          {/* Contribution visualization section */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Kontribusi Poin
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Perbandingan sumber poin Anda
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                  <span className="text-[8px] font-black text-slate-505 dark:text-slate-400 uppercase tracking-widest">
                    Internal ({internalPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                  <span className="text-[8px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                    API / Eksternal ({apiPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Stacked Progress Bar */}
            <div className="relative">
              <div className="relative h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 relative transition-all duration-1000"
                  style={{ width: `${internalPct}%` }}
                >
                  {internalPct > 8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest">
                      {internalPct.toFixed(0)}%
                    </span>
                  )}
                </div>
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 relative transition-all duration-1000"
                  style={{ width: `${apiPct}%` }}
                >
                  {apiPct > 8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest">
                      {apiPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Tick marks */}
              <div className="flex justify-between mt-1.5 px-0.5">
                {[0, 25, 50, 75, 100].map((tick) => (
                  <span key={tick} className="text-[7px] font-bold text-slate-300 dark:text-slate-650">
                    {tick}%
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* View Switcher Tabs & Refresh Button Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8">
        <div className="flex w-full sm:w-auto p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-3 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full text-[9px] min-[380px]:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeView === view.id 
                  ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-md sm:shadow-xl shadow-primary-500/10' 
                  : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <view.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeView === view.id ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-white dark:bg-slate-900 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 rounded-2xl sm:rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Dokumen'}
        </button>
      </div>

      {/* Tab content view rendering */}
      <div className="mt-6">
        {activeView === 'external' && (
          <div className="space-y-8">
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
