import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Beaker, ShieldCheck, Book, Globe, BookMarked, Search, BarChart2, Lock
} from 'lucide-react';

const PdfPreviewModal = lazy(() =>
  import('../../../../components/features/documents').then((m) => ({ default: m.PdfPreviewModal }))
);
const DocumentDetailDrawer = lazy(() =>
  import('../../../../components/features/documents').then((m) => ({ default: m.DocumentDetailDrawer }))
);

import PenelitianTable from './internal-documents/PenelitianTable';
import HKITable from './internal-documents/HKITable';
import BukuTable from './internal-documents/BukuTable';
import JurnalTable from './internal-documents/JurnalTable';
import DefaultCardList from './internal-documents/DefaultCardList';
import MetricsGuide from './internal-documents/MetricsGuide';
import ScopusMetaBadges from './internal-documents/components/ScopusMetaBadges';
import { useInternalDocuments } from './internal-documents/hooks/useInternalDocuments';

import type {
  InternalDocumentsViewProps,
  InternalDocument,
  DocPreview,
  DocCategory,
  MainTab,
} from './internal-documents/internal-documents.types';

const docCategories: DocCategory[] = [
  { id: 'penelitian',           label: 'Penelitian',       icon: Beaker     },
  { id: 'hki',                  label: 'HKI',              icon: ShieldCheck },
  { id: 'buku',                 label: 'Buku',             icon: Book       },
  { id: 'jurnal internasional', label: 'J. Internasional', icon: Globe      },
  { id: 'jurnal nasional',      label: 'J. Nasional',      icon: BookMarked },
];

export default function InternalDocumentsView({
  filteredDocs,
  allInternalDocs = [],
  loading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  categoryFilter,
  setCategoryFilter,
  isPublic = false,
}: InternalDocumentsViewProps) {
  const {
    activeTab,
    setActiveTab,
    selectedDocForDetail,
    setSelectedDocForDetail,
    previewDoc,
    setPreviewDoc,
  } = useInternalDocuments();

  const renderActiveTable = () => {
    const tableProps = {
      filteredDocs: isPublic ? filteredDocs.slice(0, 5) : filteredDocs,
      currentPage,
      itemsPerPage,
      setItemsPerPage,
      setCurrentPage,
      setSelectedDocForDetail,
      setPreviewDoc,
      isPublic,
    };

    switch (categoryFilter) {
      case 'penelitian':           return <PenelitianTable {...tableProps} />;
      case 'hki':                  return <HKITable {...tableProps} />;
      case 'buku':                 return <BukuTable {...tableProps} />;
      case 'jurnal internasional':
      case 'jurnal nasional':      return <JurnalTable {...tableProps} />;
      default:                     return <DefaultCardList {...tableProps} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Card wrapper */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-8 shadow-xs">

        {/* ── Top Tab Bar: Dokumen | Metriks Penilaian ── */}
        <div className="flex items-center gap-5 sm:gap-8 pb-3 border-b border-hairline-light dark:border-hairline-dark mb-8 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {([
            { id: 'dokumen', label: 'Dokumen Internal', icon: FileText  },
            { id: 'metriks', label: 'Metriks Penilaian', icon: BarChart2 },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group/tab relative pb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'text-ink-heading dark:text-on-dark font-bold'
                  : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="internal-main-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-ink dark:bg-on-dark rounded-full"
                />
              )}
              {activeTab !== tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
              )}
            </button>
          ))}
        </div>

        {/* Content Tabs with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'dokumen' ? (
            <motion.div
              key="dokumen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
                {docCategories.map((cat) => {
                  const catDocs = allInternalDocs.filter(
                    (d) => d.category?.toLowerCase().includes(cat.id.toLowerCase())
                  );
                  const approvedCatDocs = catDocs.filter((d) => d.status === 'Approved');
                  const points = approvedCatDocs.reduce(
                    (acc, d) => acc + (Number(d.awarded_points) || 0),
                    0
                  );
                  const count = approvedCatDocs.length;
                  const isSelected = categoryFilter === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => { setCategoryFilter(cat.id); setCurrentPage(1); }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-surface-light-raised dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark shadow-2xs ring-1 ring-hairline-light dark:ring-hairline-dark'
                          : 'bg-surface-light dark:bg-surface-dark border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                      }`}
                    >
                      <phantom-ui loading={loading} animation="shimmer" className="block space-y-1">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                            isSelected
                              ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink border-transparent'
                              : 'bg-surface-light-raised dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft'
                          }`}>
                            <cat.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                            Poin
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted truncate">
                          {cat.label}
                        </p>
                        <h4 className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tracking-tight tabular-nums mt-0.5">
                          +{points} <span className="text-xs font-semibold text-muted dark:text-on-dark-muted">Pts</span>
                        </h4>
                        <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-1">
                          {count} Dokumen Disetujui
                        </p>
                      </phantom-ui>
                    </div>
                  );
                })}
              </div>

              {/* Category filter sub-tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
                  {docCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategoryFilter(cat.id); setCurrentPage(1); }}
                      className={`group/cat relative pb-2 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'text-ink-heading dark:text-on-dark font-bold'
                          : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      {cat.label}
                      {categoryFilter === cat.id && (
                        <motion.div
                          layoutId="internal-cat-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink dark:bg-on-dark rounded-full"
                        />
                      )}
                      {categoryFilter !== cat.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-hairline-light dark:bg-hairline-dark rounded-full scale-x-0 group-hover/cat:scale-x-100 transition-transform duration-200 origin-left" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Badge informasi jumlah dokumen yang netral & non-interaktif */}
                <div className="flex-shrink-0 px-3 py-1.5 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted dark:bg-on-dark-muted" />
                  {filteredDocs.length} Dokumen
                </div>
              </div>

              {/* Document list */}
              {loading ? (
                <phantom-ui loading={true} animation="shimmer" className="block space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark p-4" />
                  ))}
                </phantom-ui>
              ) : filteredDocs.length > 0 ? (
                <div className="space-y-4">
                  {renderActiveTable()}
                  {isPublic && filteredDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark rounded-3xl mt-4">
                      <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-3 text-center">
                        + {filteredDocs.length - 5} Dokumen Internal Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Login untuk Lihat Semua</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted dark:text-on-dark-muted opacity-40" />
                  <p className="text-xs font-semibold text-muted dark:text-on-dark-muted">
                    Tidak ada data ditemukan
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="metriks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              <MetricsGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedDocForDetail && (
        <Suspense fallback={null}>
          <DocumentDetailDrawer
            isOpen={!!selectedDocForDetail}
            onClose={() => setSelectedDocForDetail(null)}
            drawerTitle={selectedDocForDetail?.category === 'Penelitian' ? "Detail Penelitian" : "Detail Dokumen"}
            drawerSubtitle="Informasi &amp; Output Akademik"
            category={selectedDocForDetail?.category ?? ''}
            title={selectedDocForDetail?.title ?? ''}
            status={selectedDocForDetail?.status ?? ''}
            catatan={selectedDocForDetail?.catatan}
            year={
              selectedDocForDetail?.published_at
                ? new Date(selectedDocForDetail.published_at).getFullYear()
                : (selectedDocForDetail?.tahun_pelaksanaan ?? '-')
            }
            points={selectedDocForDetail?.awarded_points || 0}
            isKpiCounted={selectedDocForDetail?.is_kpi_counted}
            hideKpiClassification={selectedDocForDetail?.category === 'Penelitian'}
            showResearchLink={selectedDocForDetail?.category !== 'Penelitian' && selectedDocForDetail?.category !== 'all'}
            linkedResearch={selectedDocForDetail?.penelitian}
            fileUrl={selectedDocForDetail?.file_url}
            docId={selectedDocForDetail?.id || 0}
            onPreviewClick={() => {
              if (selectedDocForDetail?.file_url) {
                setPreviewDoc({
                  fileUrl: selectedDocForDetail.file_url,
                  title: selectedDocForDetail.title,
                  category: selectedDocForDetail.category,
                });
              }
            }}
            customMetadata={
              selectedDocForDetail && (
                <ScopusMetaBadges doc={selectedDocForDetail} />
              )
            }
          />
        </Suspense>
      )}

      {previewDoc && (
        <Suspense fallback={null}>
          <PdfPreviewModal
            isOpen={!!previewDoc}
            onClose={() => setPreviewDoc(null)}
            fileUrl={previewDoc?.fileUrl ?? null}
            title={previewDoc?.title}
            category={previewDoc?.category}
          />
        </Suspense>
      )}
    </div>
  );
}
