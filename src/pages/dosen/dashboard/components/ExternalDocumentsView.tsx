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
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-8 lg:p-10 shadow-2xs min-h-[500px] relative overflow-hidden">
        <div className="space-y-8 sm:space-y-10 relative z-10">
          {/* Nested Publication Sub-tabs - Underline Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-light dark:border-hairline-dark pb-2">
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
                      ? 'text-ink-heading dark:text-on-dark'
                      : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                  }`}
                >
                  {sub.label}
                  {/* Active indicator */}
                  {publicationSubTab === sub.id && (
                    <motion.div
                      layoutId="insights-subtab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-ink dark:bg-on-dark rounded-full"
                    />
                  )}
                  {/* Hover underline */}
                  {publicationSubTab !== sub.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
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
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-1">Scopus-Only</p>
                   <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">{Math.round(scopusOnly)} <span className="text-xs font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-xs font-mono text-muted dark:text-on-dark-muted mt-1">{scopusOnlyCount} dokumen</p>
                </div>
                {/* Scholar-only */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-1">Scholar-Only</p>
                   <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">{Math.round(scholarOnly)} <span className="text-xs font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-xs font-mono text-muted dark:text-on-dark-muted mt-1">{scholarOnlyCount} dokumen</p>
                </div>
                {/* Cross-indexed */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-1">Cross-Indexed</p>
                   <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">{Math.round(crossPts)} <span className="text-xs font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-xs font-mono text-muted dark:text-on-dark-muted mt-1">{crossTitles.size} irisan</p>
                </div>
                {/* Grand Total */}
                <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-1">Total (No Double)</p>
                   <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">{Math.round(grandTotal)} <span className="text-xs font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-xs text-muted dark:text-on-dark-muted mt-1">Scopus + Scholar</p>
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
                    <div className="h-64 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scopusChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-surface-light-raised dark:bg-surface-dark-elevated p-6 sm:p-8 lg:p-10 rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-2xs transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-surface-light dark:bg-surface-dark text-chart-scopus dark:text-chart-scopus-dark rounded-xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark shadow-xs">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">Analisis Tren Scopus</h4>
                              <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Statistik Publikasi &amp; Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-light dark:bg-surface-dark rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
                            <span className="text-xs font-semibold text-body dark:text-on-dark-soft">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <Suspense fallback={<div className="h-[350px] w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl animate-pulse" />}>
                            <ProfileTrendChart
                              chartData={scopusChartData.chartData}
                              leftDomainMax={scopusChartData.leftMax}
                              rightDomainMax={scopusChartData.rightMax}
                              barColor="#d9823b"
                              barGradientColor="#efa466"
                              lineColor="#858078"
                              areaGradientColor="#858078"
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
                          <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-4 sm:p-5 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-4">
                            {/* Baris 1: Alert Banner jika ada dokumen butuh konfirmasi */}
                            {unconfirmedScopusCount > 0 && (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-warning-soft dark:bg-warning/10 border border-warning-border dark:border-warning/30 rounded-xl">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-warning-soft dark:bg-warning/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-warning dark:text-warning-on-dark" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark leading-tight">
                                      <span className="font-bold text-warning dark:text-warning-on-dark">{unconfirmedScopusCount} Publikasi</span> butuh konfirmasi status korespondensi
                                    </p>
                                    <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5 hidden sm:block">
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
                                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center shrink-0 shadow-xs bg-warning hover:bg-warning/90 dark:bg-warning-on-dark dark:hover:bg-warning-on-dark/90 text-white dark:text-ink"
                                >
                                  {scopusFilter === 'unconfirmed' ? 'Tampilkan Semua' : 'Filter Perlu Update'}
                                </button>
                              </div>
                            )}

                            {/* Baris 2: Judul & Info Tooltip */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-ink-heading dark:text-on-dark">
                                  Dokumen Scopus Indexed
                                </span>
                                {/* Info Tooltip Formula Penilaian Scopus */}
                                <div className="relative group inline-block">
                                  <button
                                    type="button"
                                    aria-label="Info Formula Penilaian Scopus"
                                    className="p-1 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 p-3 bg-surface-dark text-on-dark text-xs rounded-xl shadow-xl border border-hairline-dark z-50 pointer-events-none">
                                    <p className="font-semibold text-warning-on-dark mb-1">Formula Penilaian Scopus SINTA</p>
                                    <p className="text-on-dark-soft text-[11px] leading-relaxed">
                                      Base SKS (Q1=40, Q2=38, Q3=35, Q4=33) · Didasarkan pada peran penulis (First/Member) &amp; status korespondensi.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Baris 3: Filter Chips & Filter Tahun */}
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1 border-t border-hairline-light dark:border-hairline-dark">
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                {/* Filter Korespondensi */}
                                <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
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
                                          ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-xs'
                                          : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark'
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                      {opt.count !== undefined && opt.count > 0 && (
                                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                                          scopusFilter === opt.id
                                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-ink'
                                            : 'bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark'
                                        }`}>
                                          {opt.count}
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>

                                {/* Filter Tipe Dokumen */}
                                <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center gap-1 bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
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
                                          ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-xs'
                                          : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark'
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
                                    className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xs w-full sm:w-auto"
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
                        <div className="flex flex-col items-center justify-center py-12 text-muted dark:text-on-dark-muted space-y-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tidak Ada Dokumen</p>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScopusList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl mt-4">
                            <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-3 text-center">
                              + {filteredScopusList.length - 5} Dokumen Scopus Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
                  <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-4">
                    <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Data Tidak Ditemukan</p>
                      <p className="text-xs text-muted dark:text-on-dark-muted mt-1">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
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
                    <div className="h-64 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scholarChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-surface-light-raised dark:bg-surface-dark-elevated p-6 sm:p-8 lg:p-10 rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-2xs transition-all duration-300">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-surface-light dark:bg-surface-dark text-chart-scholar dark:text-chart-scholar-dark rounded-xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark shadow-xs">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">Tren Google Scholar</h4>
                              <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Analisis Publikasi &amp; Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-light dark:bg-surface-dark rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
                            <Calendar className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
                            <span className="text-xs font-semibold text-body dark:text-on-dark-soft">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <Suspense fallback={<div className="h-[350px] w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl animate-pulse" />}>
                            <ProfileTrendChart
                              chartData={scholarChartData.chartData}
                              leftDomainMax={scholarChartData.leftMax}
                              rightDomainMax={scholarChartData.rightMax}
                              barColor="#4a78d0"
                              barGradientColor="#86a8e5"
                              lineColor="#858078"
                              areaGradientColor="#858078"
                              gradientId="scholar"
                            />
                          </Suspense>
                        </div>
                      </div>
                    </div>

                    {/* Document List Table */}
                    <div className="space-y-4 sm:space-y-5">
                      {/* Skema poin GS banner */}
                      <div className="flex items-start gap-3 p-4 bg-accent-soft dark:bg-accent/10 border border-accent-border dark:border-accent/30 rounded-xl">
                        <div className="w-6 h-6 rounded-lg bg-accent text-on-ink flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-accent dark:text-accent-on-dark">Skema Poin Google Scholar</p>
                          <p className="text-xs text-body dark:text-on-dark-soft mt-0.5">
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
                            className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xs"
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
                        <div className="flex flex-col items-center justify-center py-12 text-muted dark:text-on-dark-muted space-y-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tidak Ada Dokumen</p>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScholarList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl mt-4">
                            <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-3 text-center">
                              + {filteredScholarList.length - 5} Dokumen Google Scholar Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
                  <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-4">
                    <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
                      <Search className="w-6 h-6 opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Data</p>
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
                    <h4 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark">
                      Daftar Publikasi Terindeks Ganda
                    </h4>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                      Poin diambil dari Scopus (lebih besar)
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 bg-surface-light-raised dark:bg-surface-dark-elevated sm:bg-transparent sm:dark:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-hairline-light dark:border-hairline-dark sm:border-none">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-medium text-muted dark:text-on-dark-muted leading-none">
                        Total Poin
                      </p>
                      <p className="text-base sm:text-lg font-bold font-mono text-success dark:text-success-on-dark mt-1 tabular-nums">
                        {Math.round(crossIndexedDocs.reduce((acc: number, doc: any) => {
                          const sd = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                          return acc + calculateScopusBreakdown(sd || doc).totalPoints;
                        }, 0))} <span className="text-xs font-normal text-muted dark:text-on-dark-muted">Pts</span>
                      </p>
                    </div>
                    <div className="px-3 py-1.5 bg-success text-on-ink rounded-xl text-xs font-mono font-bold shadow-2xs">
                      {filteredCrossIndexedDocs?.length || 0} Total
                    </div>
                  </div>
                </div>

                {/* Info banner cross-indexed */}
                <div className="flex items-start gap-3 p-4 bg-success-soft dark:bg-success/10 border border-success-border dark:border-success/30 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-success text-on-ink flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-success-dark dark:text-success-on-dark">Deduplikasi Otomatis — Poin Scopus Digunakan</p>
                    <p className="text-xs text-body dark:text-on-dark-soft mt-0.5">
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
                      className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xs"
                    />
                  </div>
                )}

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl animate-pulse" />
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
                      <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-3">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Publikasi Terindeks Ganda</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isPublic ? (
                  filteredCrossIndexedDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl mt-4">
                      <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-3 text-center">
                        + {filteredCrossIndexedDocs.length - 5} Dokumen Terindeks Ganda Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex items-center gap-2 px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
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

