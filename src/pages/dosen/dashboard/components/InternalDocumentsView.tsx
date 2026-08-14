import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Beaker, ShieldCheck, Book, Globe, BookMarked, Search, BarChart2, Lock
} from 'lucide-react';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../../components/ui/document-detail-drawer';

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
      <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-5 sm:p-8 shadow-sm">

        {/* ── Top Tab Bar: Dokumen | Metriks Penilaian ── */}
        <div className="flex items-center gap-5 sm:gap-8 pb-3 border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {([
            { id: 'dokumen', label: 'Dokumen Internal', icon: FileText  },
            { id: 'metriks', label: 'Metriks Penilaian', icon: BarChart2 },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group/tab relative pb-3 flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest whitespace-nowrap shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="internal-main-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600 dark:bg-primary-500 rounded-full"
                />
              )}
              {activeTab !== tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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

                  return (
                    <div
                      key={cat.id}
                      onClick={() => { setCategoryFilter(cat.id); setCurrentPage(1); }}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                        categoryFilter === cat.id
                          ? 'bg-primary-50/30 dark:bg-primary-950/10 border-primary-200 dark:border-primary-800 shadow-md shadow-primary-500/5'
                          : 'bg-slate-50/40 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                          categoryFilter === cat.id
                            ? 'bg-primary-100/80 dark:bg-primary-900/40 border-primary-200 dark:border-primary-800/60'
                            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60'
                        }`}>
                          <cat.icon className={`w-4 h-4 ${
                            categoryFilter === cat.id
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Poin
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                        {cat.label}
                      </p>
                      <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1">
                        +{points} <span className="text-xs font-black text-slate-400 dark:text-slate-500">PTS</span>
                      </h4>
                      <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                        {count} Dokumen Disetujui
                      </p>
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
                      className={`group/cat relative pb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                        categoryFilter === cat.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.label}
                      {categoryFilter === cat.id && (
                        <motion.div
                          layoutId="internal-cat-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 dark:bg-primary-500 rounded-full"
                        />
                      )}
                      {categoryFilter !== cat.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-700 rounded-full scale-x-0 group-hover/cat:scale-x-100 transition-transform duration-200 origin-left" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Badge informasi jumlah dokumen yang netral & non-interaktif */}
                <div className="flex-shrink-0 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  {filteredDocs.length} Dokumen
                </div>
              </div>

              {/* Document list */}
              {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                  Memuat data...
                </div>
              ) : filteredDocs.length > 0 ? (
                <div className="space-y-4">
                  {renderActiveTable()}
                  {isPublic && filteredDocs.length > 5 && (
                    <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl mt-4">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">
                        + {filteredDocs.length - 5} Dokumen Internal Lainnya Tersedia
                      </p>
                      <button
                        onClick={() => window.location.href = '/login'}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-all shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Login untuk Lihat Semua</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
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

      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />
    </div>
  );
}
