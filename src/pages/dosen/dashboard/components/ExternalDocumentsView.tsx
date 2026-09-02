import React, { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Search, Lock, ChevronDown, X, Globe, BookOpen, Layers, BarChart2
} from 'lucide-react';

const ProfileTrendChart = lazy(() =>
  import('./ProfileCharts').then((m) => ({ default: m.ProfileTrendChart }))
);
import YearFilterBar from '../../../../components/shared/YearFilterBar';

// Import refactored types, hooks, calculations, components
import { ExternalDocumentsViewProps } from './external-documents/external-documents.types';
import { useExternalDocuments } from './external-documents/hooks/useExternalDocuments';
import { normalizeTitle } from './external-documents/utils/calculations';
import ScopusTable from './external-documents/components/ScopusTable';
import ScholarTable from './external-documents/components/ScholarTable';
import CrossIndexedTable from './external-documents/components/CrossIndexedTable';
import Pagination from './external-documents/components/Pagination';
import MetricsGuide from './external-documents/components/MetricsGuide';

const externalSubTabs = [
  { id: 'scopus', label: 'Scopus-Only', icon: Globe },
  { id: 'scholar', label: 'Scholar-Only', icon: BookOpen },
  { id: 'cross_indexed', label: 'Cross-Indexed', icon: Layers },
  { id: 'metriks', label: 'Metriks Penilaian', icon: BarChart2 }
];

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
    <div className="space-y-6">
      {/* Unified Table Section Container (Matching InternalDocumentsView) */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
        
        {/* ── Top Unified Sub-Tab Bar ── */}
        <div className="border-b border-hairline-light dark:border-hairline-dark px-6 pt-5 pb-0 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-6 sm:gap-8 pb-3.5 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            {externalSubTabs.map((sub) => {
              const isActive = publicationSubTab === sub.id;
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setPublicationSubTab(sub.id as any);
                    setCurrentPage(1);
                  }}
                  className={`group/tab relative pb-3.5 flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-ink-heading dark:text-on-dark'
                      : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {sub.label}
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="external-subtab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-ink dark:bg-on-dark rounded-full"
                    />
                  )}
                  {/* Hover underline */}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Tabs with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {publicationSubTab === 'scopus' ? (
            <motion.div
              key="scopus"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {/* Optional Collapsible Chart Section */}
              {scopusChartData.chartData.length > 0 && (
                <div className="border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/20">
                  <button
                    type="button"
                    onClick={() => setIsScopusChartOpen(!isScopusChartOpen)}
                    className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-surface-light dark:hover:bg-surface-dark-elevated/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-surface-light dark:bg-surface-dark text-chart-scopus dark:text-chart-scopus-dark rounded-lg flex items-center justify-center border border-hairline-light dark:border-hairline-dark shrink-0 shadow-2xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink-heading dark:text-on-dark">Analisis Tren Scopus</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted">
                          {scopusChartData.chartData.length} Tahun
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted dark:text-on-dark-muted hidden sm:inline-block">
                        {isScopusChartOpen ? 'Tutup Grafik' : 'Lihat Grafik'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted dark:text-on-dark-muted transition-transform duration-200 ${isScopusChartOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isScopusChartOpen && (
                      <motion.div
                        key="scopus-chart-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-hairline-light dark:border-hairline-dark p-4 sm:p-6 bg-surface-light dark:bg-surface-dark"
                      >
                        <div className="h-[300px] w-full">
                          <Suspense fallback={<div className="h-[300px] w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl animate-pulse" />}>
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
              )}

              {/* Toolbar: Search + Filters */}
              {!isPublic && (() => {
                const unconfirmedScopusCount = scopusList.filter((doc) => {
                  const totalAuthors = Number(doc.total_authors) || 1;
                  const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                  return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
                }).length;

                return (
                  <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Search Box */}
                    <div className="relative w-full sm:w-64 md:w-72 shrink-0">
                      <Search className="w-4 h-4 text-muted dark:text-on-dark-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        placeholder="Cari judul publikasi..."
                        className="w-full pl-9 pr-8 py-2 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center sm:justify-end gap-2.5">
                      {/* Status Segmented Control */}
                      <div className="inline-flex items-center bg-surface-light-raised dark:bg-surface-dark-elevated p-1 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                        {[
                          { id: 'all', label: 'Semua' },
                          { id: 'unconfirmed', label: 'Perlu Konfirmasi', count: unconfirmedScopusCount },
                          { id: 'confirmed', label: 'Approved' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => { setScopusFilter(opt.id as any); setCurrentPage(1); }}
                            className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

                      {/* Tipe Segmented Control */}
                      <div className="inline-flex items-center bg-surface-light-raised dark:bg-surface-dark-elevated p-1 rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs shrink-0">
                        {[
                          { id: 'all', label: 'Semua Tipe' },
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

                      {/* Year Filter */}
                      {availableYearsScopus.length > 0 && (
                        <YearFilterBar
                          availableYears={availableYearsScopus}
                          selectedYear={filterYearExt}
                          onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                          variant="inline"
                          align="right"
                        />
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Table or Empty/Loading State */}
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark animate-pulse" />
                  ))}
                </div>
              ) : filteredScopusList.length > 0 ? (
                <div>
                  <ScopusTable
                    documents={isPublic ? filteredScopusList.slice(0, 5) : filteredScopusList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                    isAlsoScholarCheck={(title) => crossIndexedDocs.some((c) => normalizeTitle(c.title) === normalizeTitle(title))}
                    onRefresh={onRefresh}
                    isPublic={isPublic}
                  />
                  {!isPublic && (
                    <Pagination
                      totalItems={filteredScopusList.length}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                    />
                  )}
                  {isPublic && filteredScopusList.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border-t border-dashed border-hairline-light dark:border-hairline-dark">
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
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-4">
                  <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
                    <Search className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Dokumen</p>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
                      {searchTerm ? `Tidak ada dokumen yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada dokumen Scopus yang ditemukan.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : publicationSubTab === 'scholar' ? (
            <motion.div
              key="scholar"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {/* Optional Collapsible Scholar Trend Chart */}
              {scholarChartData.chartData.length > 0 && (
                <div className="border-b border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/20">
                  <button
                    type="button"
                    onClick={() => setIsScholarChartOpen(!isScholarChartOpen)}
                    className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-surface-light dark:hover:bg-surface-dark-elevated/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-surface-light dark:bg-surface-dark text-chart-scholar dark:text-chart-scholar-dark rounded-lg flex items-center justify-center border border-hairline-light dark:border-hairline-dark shrink-0 shadow-2xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink-heading dark:text-on-dark">Tren Google Scholar</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted">
                          {scholarChartData.chartData.length} Tahun
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted dark:text-on-dark-muted hidden sm:inline-block">
                        {isScholarChartOpen ? 'Tutup Grafik' : 'Lihat Grafik'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted dark:text-on-dark-muted transition-transform duration-200 ${isScholarChartOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isScholarChartOpen && (
                      <motion.div
                        key="scholar-chart-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-hairline-light dark:border-hairline-dark p-4 sm:p-6 bg-surface-light dark:bg-surface-dark"
                      >
                        <div className="h-[300px] w-full">
                          <Suspense fallback={<div className="h-[300px] w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl animate-pulse" />}>
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
              )}

              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative w-full sm:w-64 md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-muted dark:text-on-dark-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Cari judul publikasi..."
                    className="w-full pl-9 pr-8 py-2 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Year Filter */}
                {!isPublic && availableYearsScholar.length > 0 && (
                  <div className="flex items-center justify-end shrink-0">
                    <YearFilterBar
                      availableYears={availableYearsScholar}
                      selectedYear={filterYearExt}
                      onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                      variant="inline"
                      align="right"
                    />
                  </div>
                )}
              </div>

              {/* Table or Empty/Loading State */}
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark animate-pulse" />
                  ))}
                </div>
              ) : filteredScholarList.length > 0 ? (
                <div>
                  <ScholarTable
                    documents={isPublic ? filteredScholarList.slice(0, 5) : filteredScholarList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                    scopusPublications={scopusPublications}
                    isPublic={isPublic}
                  />
                  {!isPublic && (
                    <Pagination
                      totalItems={filteredScholarList.length}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                    />
                  )}
                  {isPublic && filteredScholarList.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border-t border-dashed border-hairline-light dark:border-hairline-dark">
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
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-4">
                  <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
                    <Search className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Dokumen</p>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
                      {searchTerm ? `Tidak ada dokumen yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada dokumen Google Scholar yang ditemukan.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : publicationSubTab === 'cross_indexed' ? (
            <motion.div
              key="cross_indexed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64 md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-muted dark:text-on-dark-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Cari judul publikasi..."
                    className="w-full pl-9 pr-8 py-2 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark rounded-xl text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:hover:text-on-dark p-0.5 rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Year Filter */}
                {!isPublic && availableYearsCross.length > 0 && (
                  <div className="flex items-center justify-end shrink-0">
                    <YearFilterBar
                      availableYears={availableYearsCross}
                      selectedYear={filterYearExt}
                      onYearChange={(y) => { setFilterYearExt(y); setCurrentPage(1); }}
                      variant="inline"
                      align="right"
                    />
                  </div>
                )}
              </div>

              {/* Table or Empty/Loading State */}
              {loading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark animate-pulse" />
                  ))}
                </div>
              ) : filteredCrossIndexedDocs.length > 0 ? (
                <div>
                  <CrossIndexedTable
                    documents={isPublic ? filteredCrossIndexedDocs.slice(0, 5) : filteredCrossIndexedDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                    scopusPublications={scopusPublications}
                    isPublic={isPublic}
                  />
                  {!isPublic && (
                    <Pagination
                      totalItems={filteredCrossIndexedDocs.length}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      setItemsPerPage={setItemsPerPage}
                    />
                  )}
                  {isPublic && filteredCrossIndexedDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border-t border-dashed border-hairline-light dark:border-hairline-dark">
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
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted dark:text-on-dark-muted space-y-4">
                  <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
                    <Search className="w-6 h-6 opacity-50" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink-heading dark:text-on-dark">Belum Ada Publikasi Terindeks Ganda</p>
                    <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
                      {searchTerm ? `Tidak ada publikasi yang cocok dengan kata kunci "${searchTerm}".` : 'Tidak ada publikasi yang terindeks ganda di Scopus dan Scholar.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : publicationSubTab === 'metriks' ? (
            <motion.div
              key="metriks"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="p-6"
            >
              <MetricsGuide />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  );
}

