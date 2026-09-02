import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Beaker, Award, Book, Search, BarChart2, Lock
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

const internalSubTabs = [
  { id: 'jurnal internasional', label: 'J. Internasional',   icon: FileText },
  { id: 'jurnal nasional',      label: 'J. Nasional',        icon: FileText },
  { id: 'penelitian',           label: 'Penelitian',         icon: Beaker   },
  { id: 'hki',                  label: 'HKI',                icon: Award    },
  { id: 'buku',                 label: 'Buku',               icon: Book     },
  { id: 'metriks',              label: 'Metriks Penilaian',   icon: BarChart2 },
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
    <div className="space-y-6">
      {/* Unified Table Section Container */}
      <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">

        {/* ── Top Unified Sub-Tab Bar: Penelitian | HKI | Buku | J. Internasional | J. Nasional | Metriks Penilaian ── */}
        <div className="border-b border-hairline-light dark:border-hairline-dark px-6 pt-5 pb-0 bg-surface-light dark:bg-surface-dark">
          <div className="flex items-center gap-6 sm:gap-8 pb-3.5 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
            {internalSubTabs.map((tab) => {
              const isActive =
                activeTab === 'metriks'
                  ? tab.id === 'metriks'
                  : activeTab === 'dokumen' && categoryFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'metriks') {
                      setActiveTab('metriks');
                    } else {
                      setActiveTab('dokumen');
                      setCategoryFilter(tab.id);
                      setCurrentPage(1);
                    }
                  }}
                  className={`group/tab relative pb-3.5 flex items-center gap-2 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-ink-heading dark:text-on-dark'
                      : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="internal-subtab-indicator"
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
          {activeTab === 'dokumen' ? (
            <motion.div
              key={categoryFilter}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {/* Document list */}
              {loading ? (
                <phantom-ui loading={true} animation="shimmer" className="block space-y-3 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark p-4" />
                  ))}
                </phantom-ui>
              ) : filteredDocs.length > 0 ? (
                <div>
                  {renderActiveTable()}
                  {isPublic && filteredDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-surface-light-raised dark:bg-surface-dark-elevated border-t border-dashed border-hairline-light dark:border-hairline-dark">
                      <p className="text-xs font-semibold text-muted dark:text-on-dark-muted mb-3 text-center">
                        + {filteredDocs.length - 5} Dokumen Internal Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="px-4 py-2 bg-ink hover:bg-black dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        Masuk untuk Akses Lengkap
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
                    <p className="text-xs mt-1 text-muted dark:text-on-dark-muted">
                      Tidak ada dokumen internal untuk kategori ini.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
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
          )}
        </AnimatePresence>
      </section>

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
