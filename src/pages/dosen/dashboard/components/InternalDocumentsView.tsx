import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Beaker, ShieldCheck, Book, Globe, BookMarked, Search, BarChart2
} from 'lucide-react';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../../components/ui/document-detail-drawer';

// Import refactored sub-components
import PenelitianTable from './internal-documents/PenelitianTable';
import HKITable from './internal-documents/HKITable';
import BukuTable from './internal-documents/BukuTable';
import JurnalTable from './internal-documents/JurnalTable';
import DefaultCardList from './internal-documents/DefaultCardList';
import MetricsGuide from './internal-documents/MetricsGuide';

interface InternalDocumentsViewProps {
  filteredDocs: any[];
  allInternalDocs?: any[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
}

const docCategories = [
  { id: 'penelitian',            label: 'Penelitian',      icon: Beaker     },
  { id: 'hki',                   label: 'HKI',             icon: ShieldCheck},
  { id: 'buku',                  label: 'Buku',            icon: Book       },
  { id: 'jurnal internasional',  label: 'J. Internasional',icon: Globe      },
  { id: 'jurnal nasional',       label: 'J. Nasional',     icon: BookMarked },
];

export default function InternalDocumentsView({
  filteredDocs,
  allInternalDocs = [],
  loading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  categoryFilter,
  setCategoryFilter
}: InternalDocumentsViewProps) {
  const [activeTab, setActiveTab] = useState<'dokumen' | 'metriks'>('dokumen');
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  const renderActiveTable = () => {
    const tableProps = {
      filteredDocs,
      currentPage,
      itemsPerPage,
      setCurrentPage,
      setSelectedDocForDetail,
      setPreviewDoc,
    };

    switch (categoryFilter) {
      case 'penelitian':
        return <PenelitianTable {...tableProps} />;
      case 'hki':
        return <HKITable {...tableProps} />;
      case 'buku':
        return <BukuTable {...tableProps} />;
      case 'jurnal internasional':
      case 'jurnal nasional':
        return <JurnalTable {...tableProps} />;
      default:
        return <DefaultCardList {...tableProps} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Card wrapper */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">

        {/* ── Top Tab Bar: Dokumen | Metriks Penilaian ── */}
        <div className="flex items-center gap-8 pb-3 border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'dokumen',  label: 'Dokumen Internal',  icon: FileText   },
            { id: 'metriks',  label: 'Metriks Penilaian', icon: BarChart2  },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group/tab relative pb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
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

        {/* ══════════ TAB: DOKUMEN ══════════ */}
        {activeTab === 'dokumen' && (
          <>
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
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center">
                        <cat.icon className={`w-4 h-4 ${
                          categoryFilter === cat.id 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-slate-400'
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

              {/* Doc count badge */}
              <div className="flex-shrink-0 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
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
              </div>
            ) : (
              <div className="py-24 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Tidak ada data ditemukan
                </p>
              </div>
            )}
          </>
        )}

        {/* ══════════ TAB: METRIKS PENILAIAN ══════════ */}
        {activeTab === 'metriks' && <MetricsGuide />}
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
              category: selectedDocForDetail.category
            });
          }
        }}
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
