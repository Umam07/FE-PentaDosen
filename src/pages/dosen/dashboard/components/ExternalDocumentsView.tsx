import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Calendar, Search, Lock, AlertTriangle, Info
} from 'lucide-react';
import { ProfileTrendChart } from './ProfileCharts';
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
  const [showFormulaInfo, setShowFormulaInfo] = React.useState(true);

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
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm min-h-[500px] relative overflow-hidden">
        <div className="space-y-10 relative z-10">
          {/* Nested Publication Sub-tabs - Underline Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {/* pb-3 on inner div so overflow-x-auto doesn't clip bottom-0 underlines */}
            <div className="flex items-center gap-8 pb-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'scopus', label: 'Scopus Indexed' },
                { id: 'scholar', label: 'Google Scholar' },
                { id: 'cross_indexed', label: 'Cross-Indexed (Irisan)' },
                { id: 'metriks', label: 'Metriks Penilaian' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPublicationSubTab(sub.id as any)}
                  className={`group/tab relative pb-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${publicationSubTab === sub.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  {sub.label}
                  {/* Active indicator */}
                  {publicationSubTab === sub.id && (
                    <motion.div
                      layoutId="insights-subtab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600 dark:bg-primary-500 rounded-full"
                    />
                  )}
                  {/* Hover underline — slides in from left when not active */}
                  {publicationSubTab !== sub.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ringkasan kalkulasi poin dari seluruh publikasi eksternal (Scopus & Scholar) */}
          {(() => {
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Scopus-only */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                   <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Scopus-Only</p>
                   <p className="text-xl font-black text-slate-900 dark:text-white">{Math.round(scopusOnly)} <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">pts</span></p>
                   <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{scopusOnlyCount} dokumen</p>
                </div>
                {/* Scholar-only */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                   <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Scholar-Only</p>
                   <p className="text-xl font-black text-slate-900 dark:text-white">{Math.round(scholarOnly)} <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">pts</span></p>
                   <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{scholarOnlyCount} dokumen</p>
                </div>
                {/* Cross-indexed */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                   <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Cross-Indexed</p>
                   <p className="text-xl font-black text-slate-900 dark:text-white">{Math.round(crossPts)} <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">pts</span></p>
                   <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{crossTitles.size} irisan</p>
                </div>
                {/* Grand Total */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                   <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Total (No Double)</p>
                   <p className="text-xl font-black text-slate-900 dark:text-white">{Math.round(grandTotal)} <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">pts</span></p>
                   <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-1">Scopus + Scholar + Cross</p>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-10"
                >
                {loading ? (
                  <phantom-ui loading={true} animation="shimmer" className="block space-y-6">
                    <div className="h-64 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-200/60 dark:border-slate-800" />
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[1.75rem]" />
                      ))}
                    </div>
                  </phantom-ui>
                ) : scopusChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                              <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Analisis Tren Scopus</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Statistik Publikasi & Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <ProfileTrendChart
                            chartData={scopusChartData.chartData}
                            leftDomainMax={scopusChartData.leftMax}
                            rightDomainMax={scopusChartData.rightMax}
                            barColor="#f97316" // orange-500
                            barGradientColor="#fb923c" // orange-400
                            lineColor="#10b981" // emerald-500
                            areaGradientColor="#10b981"
                            gradientId="scopus"
                          />
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
                          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                            {/* Baris 1: Notice Ringkas / Title + Formula Tooltip + Action Button */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                                {unconfirmedScopusCount > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                      <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{unconfirmedScopusCount} Publikasi</strong> perlu konfirmasi status korespondensi
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                    Dokumen Scopus Indexed
                                  </span>
                                )}

                                {/* Info Tooltip Formula Penilaian Scopus */}
                                <div className="relative group inline-block">
                                  <button
                                    type="button"
                                    aria-label="Info Formula Penilaian Scopus"
                                    className="p-1 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 p-3 bg-slate-900 text-white dark:bg-slate-800 text-[10px] rounded-xl shadow-xl border border-slate-800 dark:border-slate-700 z-50 pointer-events-none">
                                    <p className="font-bold text-amber-400 mb-1">Formula Penilaian Scopus SINTA</p>
                                    <p className="text-slate-300 text-[9px] leading-relaxed">
                                      Base SKS (Q1=40, Q2=38, Q3=35, Q4=33) · Didasarkan pada peran penulis (First/Member) &amp; status korespondensi.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {unconfirmedScopusCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setScopusFilter('unconfirmed');
                                    setCurrentPage(1);
                                  }}
                                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600/90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
                                >
                                  Filter Perlu Update ({unconfirmedScopusCount})
                                </button>
                              )}
                            </div>

                            {/* Baris 2: Filter Chip (Korespondensi, Tipe Dokumen, Tahun) dalam satu container */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Filter Korespondensi */}
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                                  {[
                                    { id: 'all', label: 'Semua Status' },
                                    { id: 'unconfirmed', label: 'Perlu Konfirmasi', count: unconfirmedScopusCount },
                                    { id: 'confirmed', label: 'Selesai' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setScopusFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        scopusFilter === opt.id
                                          ? 'bg-amber-600 dark:bg-amber-600/90 text-white shadow-xs'
                                          : 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      {opt.label} {opt.count !== undefined && opt.count > 0 ? `(${opt.count})` : ''}
                                    </button>
                                  ))}
                                </div>

                                {/* Filter Tipe Dokumen */}
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
                                  {[
                                    { id: 'all', label: 'Semua Tipe' },
                                    { id: 'article', label: 'Article' },
                                    { id: 'non-article', label: 'Non-Article' }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => { setArticleFilter(opt.id as any); setCurrentPage(1); }}
                                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        articleFilter === opt.id
                                          ? 'bg-amber-600 dark:bg-amber-600/90 text-white shadow-xs'
                                          : 'text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Year Filter */}
                              {availableYearsScopus.length > 0 && (
                                <div className="shrink-0">
                                  <YearFilterBar
                                    availableYears={availableYearsScopus}
                                    selectedYear={filterYearExt}
                                    onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80"
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
                        <div className="flex flex-col items-center justify-center py-12 text-slate-300 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-100 dark:border-slate-800/80 rounded-[2rem]">
                          <Search className="w-6 h-6 opacity-30" />
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak Ada Dokumen</p>
                            <p className="text-[9px] font-bold text-slate-400/80 mt-1">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScopusList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">
                              + {filteredScopusList.length - 5} Dokumen Scopus Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm"
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
                  <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                      <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Data Tidak Ditemukan</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'scholar' ? (
                <motion.div
                  key="scholar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-10"
                >
                {loading ? (
                  <phantom-ui loading={true} animation="shimmer" className="block space-y-6">
                    <div className="h-64 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-slate-200/60 dark:border-slate-800" />
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[1.75rem]" />
                      ))}
                    </div>
                  </phantom-ui>
                ) : scholarChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                              <TrendingUp className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Tren Google Scholar</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Analisis Publikasi & Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <ProfileTrendChart
                            chartData={scholarChartData.chartData}
                            leftDomainMax={scholarChartData.leftMax}
                            rightDomainMax={scholarChartData.rightMax}
                            barColor="#3b82f6" // blue-500
                            barGradientColor="#60a5fa" // blue-400
                            lineColor="#8b5cf6" // violet-500
                            areaGradientColor="#8b5cf6"
                            gradientId="scholar"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document List Table */}
                    <div className="space-y-6">
                      {/* Skema poin GS banner */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-[10px] font-black">i</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Skema Poin Google Scholar</p>
                          <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 mt-1">
                            Dihitung berdasarkan dokumen Google Scholar, jumlah sitasi, &amp; bonus tersitasi.
                          </p>
                        </div>
                      </div>

                      {/* Year Filter for Scholar */}
                      {!isPublic && (
                        <div className="mt-0 mb-0 relative z-50">
                          <YearFilterBar
                            availableYears={availableYearsScholar}
                            selectedYear={filterYearExt}
                            onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                            className="rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs"
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
                        <div className="flex flex-col items-center justify-center py-12 text-slate-300 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-100 dark:border-slate-800/80 rounded-[2rem]">
                          <Search className="w-6 h-6 opacity-30" />
                          <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak Ada Dokumen</p>
                            <p className="text-[9px] font-bold text-slate-400/80 mt-1">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                          </div>
                        </div>
                      )}

                      {isPublic ? (
                        filteredScholarList.length > 5 && (
                          <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">
                              + {filteredScholarList.length - 5} Dokumen Google Scholar Lainnya Tersedia
                            </p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm"
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
                  <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                      <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Data</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'cross_indexed' ? (
                <motion.div
                  key="cross_indexed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Publikasi Terindeks Ganda</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Poin diambil dari Scopus (lebih besar)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Poin</p>
                      <p className="text-lg font-black text-emerald-600">
                        {Math.round(crossIndexedDocs.reduce((acc: number, doc: any) => {
                          const sd = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                          return acc + calculateScopusBreakdown(sd || doc).totalPoints;
                        }, 0))} pts
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {filteredCrossIndexedDocs?.length || 0} Total
                    </div>
                  </div>
                </div>

                {/* Info banner cross-indexed */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-[10px] font-black">i</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Deduplikasi Otomatis — Poin Scopus Digunakan</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                      Ketika judul ada di Scopus &amp; Scholar, sistem memakai poin Scopus (kalkulasi SINTA) karena lebih besar.
                    </p>
                  </div>
                </div>

                {/* Year Filter for Cross-Indexed */}
                {!isPublic && (
                  <div className="relative z-50">
                    <YearFilterBar
                      availableYears={availableYearsCross}
                      selectedYear={filterYearExt}
                      onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                      className="rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs"
                    />
                  </div>
                )}

                {loading ? (
                  <phantom-ui loading={true} animation="shimmer" className="block space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[1.75rem]" />
                    ))}
                  </phantom-ui>
                ) : (
                  <>
                    {filteredCrossIndexedDocs.length > 0 ? (
                      <CrossIndexedTable
                        documents={isPublic ? filteredCrossIndexedDocs.slice(0, 5) : filteredCrossIndexedDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                        scopusPublications={scopusPublications}
                        isPublic={isPublic}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Publikasi Terindeks Ganda</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {isPublic ? (
                  filteredCrossIndexedDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-850/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-4">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">
                        + {filteredCrossIndexedDocs.length - 5} Dokumen Terindeks Ganda Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm"
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

