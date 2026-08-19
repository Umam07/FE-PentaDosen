import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Calendar, Search, Lock, AlertTriangle, Info
} from 'lucide-react';

const ProfileTrendChart = lazy(() =>
  import('./ProfileCharts').then((m) => ({ default: m.ProfileTrendChart }))
);
import { calculateScholarPoints } from '../pointsCalculator';
import YearFilterBar from '../../../../components/ui/YearFilterBar';

// Import refactored types, hooks, calculations, components
import { ExternalDocumentsViewProps } from './external-documents/external-documents.types';
import { useExternalDocuments } from './external-documents/hooks/useExternalDocuments';
import { calculateScopusBreakdown, normalizeTitle } from './external-documents/utils/calculations';
import ScopusTable from './external-documents/components/ScopusTable';
import ScholarTable from './external-documents/components/ScholarTable';
import CrossIndexedTable from './external-documents/components/CrossIndexedTable';
import Pagination from './external-documents/components/Pagination';
import MetricsGuide from './external-documents/components/MetricsGuide';

export default function ExternalDocumentsView({
  publicationSubTab,
  setPublicationSubTab,
  scopusChartData,
  scholarChartData,
  scopusData,
  scholarData,
  publications,
  scopusPublications,
  tabVariants,
  onRefresh,
  loading = false,
  isPublic = false
}: ExternalDocumentsViewProps) {
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    scopusFilter,
    setScopusFilter,
    articleFilter,
    setArticleFilter,
    filterYearExt,
    setFilterYearExt,
    availableYearsScopus,
    availableYearsScholar,
    availableYearsCross,
    scopusList,
    scholarList,
    crossIndexedDocs,
    filteredScopusList,
    filteredScholarList,
    filteredCrossIndexedDocs,
  } = useExternalDocuments({
    publicationSubTab,
    publications,
    scopusPublications,
    isPublic,
  });

  return (
    <motion.div
      key="insights"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 lg:p-10 shadow-2xs min-h-[500px] relative overflow-hidden">
        <div className="space-y-8 sm:space-y-10 relative z-10">
          {/* Nested Publication Sub-tabs - Underline Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-5 sm:gap-8 pb-3 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
              {[
                { id: 'scopus', label: 'Scopus Indexed' },
                { id: 'scholar', label: 'Google Scholar' },
                { id: 'cross_indexed', label: 'Cross-Indexed (Irisan)' },
                { id: 'metriks', label: 'Metriks Penilaian' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPublicationSubTab(sub.id as any)}
                  className={`group/tab relative pb-3 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    publicationSubTab === sub.id
                      ? 'text-slate-950 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {sub.label}
                  {/* Active indicator */}
                  {publicationSubTab === sub.id && (
                    <motion.div
                      layoutId="insights-subtab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-950 dark:bg-white rounded-full"
                    />
                  )}
                  {/* Hover underline */}
                  {publicationSubTab !== sub.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-300 dark:bg-slate-700 rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ringkasan kalkulasi poin dari seluruh publikasi eksternal (Scopus & Scholar) - Disembunyikan pada subtab metriks */}
          {publicationSubTab !== 'metriks' && (() => {
            const crossTitles = new Set(
              scholarList.filter(sd =>
                scopusList.some(s => normalizeTitle(s.title) === normalizeTitle(sd.title))
              ).map(d => normalizeTitle(d.title))
            );
            const crossPts = scopusList.filter(s => crossTitles.has(normalizeTitle(s.title))).reduce((a: number, d: any) => a + calculateScopusBreakdown(d).totalPoints, 0);
            const scopusOnly = scopusList.filter(s => !crossTitles.has(normalizeTitle(s.title))).reduce((a: number, d: any) => a + calculateScopusBreakdown(d).totalPoints, 0);
            const scholarOnly = Math.round(scholarList.filter(s => !crossTitles.has(normalizeTitle(s.title))).reduce((a: number, d: any) => a + calculateScholarPoints(d), 0));
            const grandTotal = crossPts + scopusOnly + scholarOnly;
            const scopusOnlyCount = scopusList.length - crossTitles.size;
            const scholarOnlyCount = scholarList.length - crossTitles.size;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* Scopus-only */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                   <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Scopus-Only</p>
                   <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">{Math.round(scopusOnly)} <span className="text-xs font-normal text-slate-500">Pts</span></p>
                   <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">{scopusOnlyCount} dokumen</p>
                </div>
                {/* Scholar-only */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                   <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Scholar-Only</p>
                   <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">{Math.round(scholarOnly)} <span className="text-xs font-normal text-slate-500">Pts</span></p>
                   <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">{scholarOnlyCount} dokumen</p>
                </div>
                {/* Cross-indexed */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                   <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Cross-Indexed</p>
                   <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">{Math.round(crossPts)} <span className="text-xs font-normal text-slate-500">Pts</span></p>
                   <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">{crossTitles.size} irisan</p>
                </div>
                {/* Grand Total */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                   <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Total (No Double)</p>
                   <p className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">{Math.round(grandTotal)} <span className="text-xs font-normal text-slate-500">Pts</span></p>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scopus + Scholar</p>
                </div>
              </div>
            );
          })()}

          {/* Publication Content */}
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {publicationSubTab === 'scopus' ? (
                <motion.div
                  key="scopus"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-8"
                >
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scopusChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-slate-50/70 dark:bg-slate-800/40 p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60 shadow-xs">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Analisis Tren Scopus</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Statistik Publikasi &amp; Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <Suspense fallback={<div className="h-[350px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />}>
                            <ProfileTrendChart
                              chartData={scopusChartData.chartData}
                              leftDomainMax={scopusChartData.leftMax}
                              rightDomainMax={scopusChartData.rightMax}
                              barColor="#f59e0b"
                              barGradientColor="#fbbf24"
                              lineColor="#64748b"
                              areaGradientColor="#64748b"
                              gradientId="scopus"
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {/* Consolidated Toolbar Container (Notice, Formula Tooltip, and Filters) */}
                      {!isPublic && (() => {
                        const unconfirmedScopusCount = scopusList.filter((doc) => {
                          const totalAuthors = Number(doc.total_authors) || 1;
                          const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                          return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
                        }).length;

                        return (
                          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                            {/* Baris 1: Alert Banner jika ada dokumen butuh konfirmasi */}
                            {unconfirmedScopusCount > 0 && (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                                      <span className="font-bold text-amber-700 dark:text-amber-400">{unconfirmedScopusCount} Publikasi</span> butuh konfirmasi status korespondensi
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                                      Konfirmasi status korespondensi untuk kalkulasi poin SINTA
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScopusFilter(scopusFilter === 'unconfirmed' ? 'all' : 'unconfirmed');
                                    setCurrentPage(1);
                                  }}
                                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center shrink-0 shadow-xs bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                  {scopusFilter === 'unconfirmed' ? 'Tampilkan Semua' : 'Filter Perlu Update'}
                                </button>
                              </div>
                            )}

                            {/* Baris 2: Judul & Info Tooltip */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  Dokumen Scopus Indexed
                                </span>
                                {/* Info Tooltip Formula Penilaian Scopus */}
                                <div className="relative group inline-block">
                                  <button
                                    type="button"
                                    aria-label="Info Formula Penilaian Scopus"
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-800 z-50 pointer-events-none">
                                    <p className="font-semibold text-amber-300 mb-1">Formula Penilaian Scopus SINTA</p>
                                    <p className="text-slate-300 text-[11px] leading-relaxed">
                                      Base SKS (Q1=40, Q2=38, Q3=35, Q4=33) · Didasarkan pada peran penulis (First/Member) &amp; status korespondensi.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Baris 3: Filter Chips & Filter Tahun */}
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1 border-t border-slate-200/80 dark:border-slate-800">
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                {/* Filter Korespondensi */}
                                <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                  {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'unconfirmed', label: 'Perlu Update', count: unconfirmedScopusCount },
                                    { id: 'confirmed', label: 'Selesai' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setScopusFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                        scopusFilter === opt.id
                                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                      {opt.count !== undefined && opt.count > 0 && (
                                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                          scopusFilter === opt.id
                                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                                        }`}>
                                          {opt.count}
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>

                                {/* Filter Tipe Dokumen */}
                                <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                  {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'article', label: 'Article' },
                                    { id: 'non-article', label: 'Non-Article' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setArticleFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                                        articleFilter === opt.id
                                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Year Filter */}
                              {availableYearsScopus.length > 0 && (
                                <div className="w-full sm:w-auto shrink-0 relative z-30">
                                  <YearFilterBar
                                    availableYears={availableYearsScopus}
                                    selectedYear={filterYearExt}
                                    onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                                    className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs w-full sm:w-auto"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Standard Table View */}
                      {filteredScopusList.length > 0 ? (
                        <ScopusTable
                          documents={isPublic ? filteredScopusList.slice(0, 5) : filteredScopusList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                          isAlsoScholarCheck={(title) => crossIndexedDocs.some((c) => normalizeTitle(c.title) === normalizeTitle(title))}
                          onRefresh={onRefresh}
                          isPublic={isPublic}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tidak Ada Dokumen</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScopusList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl mt-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">
                              + {filteredScopusList.length - 5} Dokumen Scopus Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Login untuk Lihat Semua</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <Pagination
                          totalItems={filteredScopusList?.length || 0}
                          currentPage={currentPage}
                          onPageChange={setCurrentPage}
                          itemsPerPage={itemsPerPage}
                          setItemsPerPage={setItemsPerPage}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data Tidak Ditemukan</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'scholar' ? (
                <motion.div
                  key="scholar"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-8"
                >
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scholarChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-slate-50/70 dark:bg-slate-800/40 p-6 sm:p-8 lg:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center border border-sky-200/60 dark:border-sky-800/60 shadow-xs">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tren Google Scholar</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Analisis Publikasi &amp; Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <Suspense fallback={<div className="h-[350px] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />}>
                            <ProfileTrendChart
                              chartData={scholarChartData.chartData}
                              leftDomainMax={scholarChartData.leftMax}
                              rightDomainMax={scholarChartData.rightMax}
                              barColor="#0284c7"
                              barGradientColor="#38bdf8"
                              lineColor="#64748b"
                              areaGradientColor="#64748b"
                              gradientId="scholar"
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>

                    {/* Document List Table */}
                    <div className="space-y-4 sm:space-y-5">
                      {/* Skema poin GS banner */}
                      <div className="flex items-start gap-3 p-4 bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 rounded-xl">
                        <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-sky-950 dark:text-sky-300">Skema Poin Google Scholar</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            Dihitung berdasarkan dokumen Google Scholar, jumlah sitasi, &amp; bonus tersitasi.
                          </p>
                        </div>
                      </div>

                      {/* Year Filter for Scholar */}
                      {!isPublic && availableYearsScholar.length > 0 && (
                        <div className="relative z-30">
                          <YearFilterBar
                            availableYears={availableYearsScholar}
                            selectedYear={filterYearExt}
                            onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                            className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
                          />
                        </div>
                      )}

                      {/* Standard Scholar Table */}
                      {filteredScholarList.length > 0 ? (
                        <ScholarTable
                          documents={isPublic ? filteredScholarList.slice(0, 5) : filteredScholarList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                          scopusPublications={scopusPublications}
                          isPublic={isPublic}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tidak Ada Dokumen</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScholarList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl mt-4">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">
                              + {filteredScholarList.length - 5} Dokumen Google Scholar Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Login untuk Lihat Semua</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <Pagination
                          totalItems={filteredScholarList?.length || 0}
                          currentPage={currentPage}
                          onPageChange={setCurrentPage}
                          itemsPerPage={itemsPerPage}
                          setItemsPerPage={setItemsPerPage}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum Ada Data</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'cross_indexed' ? (
                <motion.div
                  key="cross_indexed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      Daftar Publikasi Terindeks Ganda
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Poin diambil dari Scopus (lebih besar)
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 bg-slate-50/70 dark:bg-slate-800/40 sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-none">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none">
                        Total Poin
                      </p>
                      <p className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                        {Math.round(crossIndexedDocs.reduce((acc: number, doc: any) => {
                          const sd = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                          return acc + calculateScopusBreakdown(sd || doc).totalPoints;
                        }, 0))} <span className="text-xs font-normal text-slate-500">Pts</span>
                      </p>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold shadow-2xs">
                      {filteredCrossIndexedDocs?.length || 0} Total
                    </div>
                  </div>
                </div>

                {/* Info banner cross-indexed */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950 dark:text-emerald-300">Deduplikasi Otomatis — Poin Scopus Digunakan</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Ketika judul ada di Scopus &amp; Scholar, sistem memakai poin Scopus (kalkulasi SINTA) karena lebih besar.
                    </p>
                  </div>
                </div>

                {/* Year Filter for Cross-Indexed */}
                {!isPublic && availableYearsCross.length > 0 && (
                  <div className="relative z-30">
                    <YearFilterBar
                      availableYears={availableYearsCross}
                      selectedYear={filterYearExt}
                      onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                      className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
                    />
                  </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredCrossIndexedDocs.length > 0 ? (
                      <CrossIndexedTable
                        documents={isPublic ? filteredCrossIndexedDocs.slice(0, 5) : filteredCrossIndexedDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                        scopusPublications={scopusPublications}
                        isPublic={isPublic}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum Ada Publikasi Terindeks Ganda</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isPublic ? (
                  filteredCrossIndexedDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl mt-4">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 text-center">
                        + {filteredCrossIndexedDocs.length - 5} Dokumen Terindeks Ganda Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Login untuk Lihat Semua</span>
                      </button>
                    </div>
                  )
                ) : (
                  <Pagination
                    totalItems={filteredCrossIndexedDocs?.length || 0}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                )}
                </motion.div>
              ) : publicationSubTab === 'metriks' ? (
                <MetricsGuide />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

