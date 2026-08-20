import React, { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Calendar, Search, Lock, AlertTriangle, Info, ChevronDown, X
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
  const [isScopusChartOpen, setIsScopusChartOpen] = useState(false);
  const [isScholarChartOpen, setIsScholarChartOpen] = useState(false);

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
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
      className="space-y-6"
    >
      {/* Main Content Card */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-7 shadow-2xs min-h-[500px] relative">
        <div className="space-y-6 sm:space-y-7 relative z-10">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Scopus-only */}
                <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">Scopus-Only</p>
                   <p className="text-lg font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums mt-0.5">{Math.round(scopusOnly)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">{scopusOnlyCount} dokumen</p>
                </div>
                {/* Scholar-only */}
                <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">Scholar-Only</p>
                   <p className="text-lg font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums mt-0.5">{Math.round(scholarOnly)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">{scholarOnlyCount} dokumen</p>
                </div>
                {/* Cross-indexed */}
                <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">Cross-Indexed</p>
                   <p className="text-lg font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums mt-0.5">{Math.round(crossPts)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">{crossTitles.size} irisan</p>
                </div>
                {/* Grand Total */}
                <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                   <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">Total (No Double)</p>
                   <p className="text-lg font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums mt-0.5">{Math.round(grandTotal)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span></p>
                   <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">Scopus + Scholar</p>
                </div>
              </div>
            );
          })()}

          {/* Publication Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {publicationSubTab === 'scopus' ? (
                <motion.div
                  key="scopus"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scopusChartData.chartData.length > 0 ? (
                  <>
                    {/* Collapsible Scopus Trend Chart Container */}
                    <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-2xs overflow-hidden transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => setIsScopusChartOpen(!isScopusChartOpen)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-light dark:hover:bg-surface-dark/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark text-chart-scopus dark:text-chart-scopus-dark rounded-xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">Analisis Tren Scopus</h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted">
                                {scopusChartData.chartData.length} Tahun
                              </span>
                            </div>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Statistik Publikasi &amp; Sitasi Tahunan</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-body dark:text-on-dark-soft hidden sm:inline-block">
                            {isScopusChartOpen ? 'Tutup Grafik' : 'Lihat Statistik Tahunan'}
                          </span>
                          <div className={`p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted transition-transform duration-200 ${isScopusChartOpen ? 'rotate-180 text-ink-heading dark:text-on-dark' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Expandable Chart Content */}
                      <AnimatePresence initial={false}>
                        {isScopusChartOpen && (
                          <motion.div
                            key="scopus-chart-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="border-t border-hairline-light dark:border-hairline-dark p-4 sm:p-6"
                          >
                            <div className="h-[320px] w-full">
                              <Suspense fallback={<div className="h-[320px] w-full bg-surface-light dark:bg-surface-dark rounded-xl animate-pulse" />}>
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-3.5">
                      {/* Consolidated Toolbar Container (Compact Single-Row Layout) */}
                      {!isPublic && (() => {
                        const unconfirmedScopusCount = scopusList.filter((doc) => {
                          const totalAuthors = Number(doc.total_authors) || 1;
                          const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                          return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
                        }).length;

                        return (
                          <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-2.5 sm:p-3 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-2.5 relative z-20">
                            {/* Alert Banner Ramping Terintegrasi */}
                            {unconfirmedScopusCount > 0 && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 bg-warning-soft dark:bg-warning/10 border border-warning-border dark:border-warning/30 rounded-xl text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-5 h-5 rounded-md bg-warning-soft dark:bg-warning/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-3.5 h-3.5 text-warning dark:text-warning-on-dark" />
                                  </div>
                                  <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate">
                                    <span className="font-bold text-warning dark:text-warning-on-dark">{unconfirmedScopusCount} Publikasi</span> butuh konfirmasi korespondensi
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScopusFilter(scopusFilter === 'unconfirmed' ? 'all' : 'unconfirmed');
                                    setCurrentPage(1);
                                  }}
                                  className="self-start sm:self-auto px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-center shrink-0 bg-warning hover:bg-warning/90 dark:bg-warning-on-dark dark:hover:bg-warning-on-dark/90 text-white dark:text-ink shadow-2xs"
                                >
                                  {scopusFilter === 'unconfirmed' ? 'Tampilkan Semua' : 'Filter Perlu Update'}
                                </button>
                              </div>
                            )}

                            {/* Right-Aligned Consolidated Filter Toolbar: Search -> Status -> Tipe -> Tahun */}
                            <div className="flex flex-wrap items-center justify-end gap-2 w-full">
                              {/* 1. Search Box (Mepet & Ramping) */}
                              <div className="relative w-full sm:w-48 md:w-56 shrink-0">
                                <Search className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={searchTerm}
                                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                  placeholder="Cari judul, jurnal, penulis..."
                                  className="w-full pl-8 pr-7 py-1.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                                />
                                {searchTerm && (
                                  <button
                                    type="button"
                                    onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              {/* Separator Tipis 0 */}
                              <div className="hidden sm:block h-5 w-px bg-hairline-light dark:bg-hairline-dark shrink-0" />

                              {/* 2. Grup Status */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] text-muted dark:text-on-dark-muted font-normal select-none">
                                  Status:
                                </span>
                                <div className="inline-flex items-center bg-surface-light dark:bg-surface-dark p-0.5 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                                  {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'unconfirmed', label: 'Perlu Update', count: unconfirmedScopusCount },
                                    { id: 'confirmed', label: 'Selesai' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setScopusFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                              </div>

                              {/* Separator Vertikal Tipis 1 */}
                              <div className="h-5 w-px bg-hairline-light dark:bg-hairline-dark shrink-0" />

                              {/* 3. Grup Tipe */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] text-muted dark:text-on-dark-muted font-normal select-none">
                                  Tipe:
                                </span>
                                <div className="inline-flex items-center bg-surface-light dark:bg-surface-dark p-0.5 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                                  {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'article', label: 'Article' },
                                    { id: 'non-article', label: 'Non-Article' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setArticleFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

                              {/* Separator Vertikal Tipis 2 & Filter Tahun */}
                              {availableYearsScopus.length > 0 && (
                                <>
                                  <div className="h-5 w-px bg-hairline-light dark:bg-hairline-dark shrink-0" />
                                  <div className="relative z-30 shrink-0">
                                    <YearFilterBar
                                      availableYears={availableYearsScopus}
                                      selectedYear={filterYearExt}
                                      onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                                      className="!bg-transparent !border-none !shadow-none !p-0 !m-0"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Standard Table View with Attached Sticky Pagination */}
                      {filteredScopusList.length > 0 ? (
                        <ScopusTable
                          documents={isPublic ? filteredScopusList.slice(0, 5) : filteredScopusList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                          isAlsoScholarCheck={(title) => crossIndexedDocs.some((c) => normalizeTitle(c.title) === normalizeTitle(title))}
                          onRefresh={onRefresh}
                          isPublic={isPublic}
                        >
                          {!isPublic && (
                            <Pagination
                              totalItems={filteredScopusList?.length || 0}
                              currentPage={currentPage}
                              onPageChange={setCurrentPage}
                              itemsPerPage={itemsPerPage}
                              setItemsPerPage={setItemsPerPage}
                            />
                          )}
                        </ScopusTable>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted dark:text-on-dark-muted space-y-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tidak Ada Dokumen</p>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                              {searchTerm ? `Tidak ada dokumen yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada dokumen yang cocok dengan filter yang dipilih.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {isPublic && filteredScopusList.length > 5 && (
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
                  className="space-y-6"
                >
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark animate-pulse" />
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                ) : scholarChartData.chartData.length > 0 ? (
                  <>
                    {/* Collapsible Scholar Trend Chart Container */}
                    <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-2xs overflow-hidden transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => setIsScholarChartOpen(!isScholarChartOpen)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface-light dark:hover:bg-surface-dark/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark text-chart-scholar dark:text-chart-scholar-dark rounded-xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark">Tren Google Scholar</h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted">
                                {scholarChartData.chartData.length} Tahun
                              </span>
                            </div>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Analisis Publikasi &amp; Sitasi Tahunan</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold text-body dark:text-on-dark-soft hidden sm:inline-block">
                            {isScholarChartOpen ? 'Tutup Grafik' : 'Lihat Statistik Tahunan'}
                          </span>
                          <div className={`p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted transition-transform duration-200 ${isScholarChartOpen ? 'rotate-180 text-ink-heading dark:text-on-dark' : ''}`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Expandable Chart Content */}
                      <AnimatePresence initial={false}>
                        {isScholarChartOpen && (
                          <motion.div
                            key="scholar-chart-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="border-t border-hairline-light dark:border-hairline-dark p-4 sm:p-6"
                          >
                            <div className="h-[320px] w-full">
                              <Suspense fallback={<div className="h-[320px] w-full bg-surface-light dark:bg-surface-dark rounded-xl animate-pulse" />}>
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Document List Table */}
                    <div className="space-y-3.5">
                      {/* Unified Compact Toolbar for Google Scholar */}
                      <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-2.5 sm:p-3 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-2">
                        <div className="flex items-center gap-2 px-1 text-xs">
                          <div className="w-4 h-4 rounded-md bg-accent text-on-ink flex items-center justify-center shrink-0">
                            <Info className="w-2.5 h-2.5" />
                          </div>
                          <p className="text-xs text-body dark:text-on-dark-soft">
                            <span className="font-bold text-accent dark:text-accent-on-dark">Skema Google Scholar:</span> Dihitung dari dokumen, jumlah sitasi, &amp; bonus tersitasi.
                          </p>
                        </div>

                        {/* Search Input Box + Year Filter for Scholar */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1.5 border-t border-hairline-light/60 dark:border-hairline-dark/60">
                          {/* Search Box */}
                          <div className="relative w-full sm:w-48 md:w-56 shrink-0">
                            <Search className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                              placeholder="Cari judul publikasi atau jurnal..."
                              className="w-full pl-8 pr-7 py-1.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                            />
                            {searchTerm && (
                              <button
                                type="button"
                                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {!isPublic && availableYearsScholar.length > 0 && (
                            <>
                              <div className="hidden sm:block h-5 w-px bg-hairline-light dark:bg-hairline-dark shrink-0" />
                              <div className="relative z-30 shrink-0">
                                <YearFilterBar
                                  availableYears={availableYearsScholar}
                                  selectedYear={filterYearExt}
                                  onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                                  className="!bg-transparent !border-none !shadow-none !p-0 !m-0"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Standard Scholar Table with Attached Sticky Pagination */}
                      {filteredScholarList.length > 0 ? (
                        <ScholarTable
                          documents={isPublic ? filteredScholarList.slice(0, 5) : filteredScholarList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                          scopusPublications={scopusPublications}
                          isPublic={isPublic}
                        >
                          {!isPublic && (
                            <Pagination
                              totalItems={filteredScholarList?.length || 0}
                              currentPage={currentPage}
                              onPageChange={setCurrentPage}
                              itemsPerPage={itemsPerPage}
                              setItemsPerPage={setItemsPerPage}
                            />
                          )}
                        </ScholarTable>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted dark:text-on-dark-muted space-y-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl">
                          <Search className="w-6 h-6 opacity-40" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tidak Ada Dokumen</p>
                            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                              {searchTerm ? `Tidak ada dokumen yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada dokumen yang cocok dengan filter yang dipilih.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {isPublic && filteredScholarList.length > 5 && (
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

                {/* Search Bar + Year Filter for Cross-Indexed */}
                <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-2.5 sm:p-3 rounded-2xl border border-hairline-light dark:border-hairline-dark flex flex-wrap items-center justify-end gap-2 relative z-20">
                  <div className="relative w-full sm:w-48 md:w-56 shrink-0">
                    <Search className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      placeholder="Cari judul publikasi atau jurnal..."
                      className="w-full pl-8 pr-7 py-1.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {!isPublic && availableYearsCross.length > 0 && (
                    <>
                      <div className="hidden sm:block h-5 w-px bg-hairline-light dark:bg-hairline-dark shrink-0" />
                      <div className="relative z-30 shrink-0">
                        <YearFilterBar
                          availableYears={availableYearsCross}
                          selectedYear={filterYearExt}
                          onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                          className="!bg-transparent !border-none !shadow-none !p-0 !m-0"
                        />
                      </div>
                    </>
                  )}
                </div>

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
                      >
                        {!isPublic && (
                          <Pagination
                            totalItems={filteredCrossIndexedDocs?.length || 0}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                          />
                        )}
                      </CrossIndexedTable>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-3">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Publikasi Terindeks Ganda</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isPublic && (
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

