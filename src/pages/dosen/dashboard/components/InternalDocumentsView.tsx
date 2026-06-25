import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Beaker, ShieldCheck, Book, Globe, BookMarked, Calendar, Search, BarChart2,
  CheckCircle, XCircle, Clock, Info, Lock, Shield, Award, Zap, Sparkles, Archive, Link, BookOpen,
  ChevronLeft, ChevronRight, Eye, Download, Upload
} from 'lucide-react';
import { getCategoryTheme } from '../utils';
import Pagination from './Pagination';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../../../components/ui/document-detail-drawer';
import { HKI_CATEGORIES } from '../../hki/constants';

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
                  (d) => d.category?.toLowerCase() === cat.id.toLowerCase()
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
                {categoryFilter === 'penelitian' ? (
                  /* ── Tabel khusus Penelitian ── */
                  <>
                    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Informasi Penelitian
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Program &amp; Skema
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Tahun
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Dana
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Dokumen
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Status
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Poin
                            </th>
                            <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                              Detail
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredDocs
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((doc: any, idx: number) => (
                              <motion.tr
                                key={idx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="hover:bg-primary-50/20 dark:hover:bg-primary-900/10 transition-colors group"
                              >
                                <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                                      <Beaker className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                                        {doc.title}
                                      </p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        <span className="md:hidden">{doc.tahun_pelaksanaan || '-'} • </span>
                                        ID: {doc.id_dokumen || ('RESEARCH-' + doc.id)}
                                      </p>
                                      {doc.status === 'Rejected' && doc.catatan && (
                                        <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                                          Catatan Umpan Balik: {doc.catatan}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden lg:table-cell px-6 py-4">
                                  <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                    {doc.program || '-'}
                                  </p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/30">
                                      {doc.skema || '-'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/30">
                                      {doc.fokus || '-'}
                                    </span>
                                  </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 text-center">
                                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                    {doc.tahun_pelaksanaan || '-'}
                                  </span>
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4 text-xs font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                                  {formatCurrency(doc.dana_disetujui || 0)}
                                </td>
                                <td className="px-6 py-4">
                                  {doc.file_url && doc.file_url !== '-' ? (
                                    <button
                                      onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                                    >
                                      <FileText className="w-3.5 h-3.5 mr-1" /> Lihat
                                    </button>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Tidak Ada File</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                    doc.status === 'Approved'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                      : doc.status === 'Rejected'
                                      ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                      : doc.status === 'Verified by Fakultas'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                      : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                  }`}>
                                    {doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : (doc.status || 'Pending')}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                                    +{Number(doc.awarded_points) || 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDocForDetail(doc)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center mx-auto"
                                    title="Lihat Detail"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination 
                      totalItems={filteredDocs.length} 
                      currentPage={currentPage} 
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
                ) : categoryFilter === 'hki' ? (
                  /* ── Tabel khusus HKI ── */
                  <>
                    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Informasi HKI</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Kategori HKI</th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Tahun</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Dokumen</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Status</th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Klasifikasi</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Poin</th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
                            <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredDocs
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((doc: any, idx: number) => {
                              const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
                              const DocIcon = catConfig ? catConfig.icon : Shield;
                              const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';
                              return (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  className="hover:bg-primary-50/20 dark:hover:bg-primary-900/10 transition-colors group"
                                >
                                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                                        <DocIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                                          {doc.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                          <span className="lg:hidden">{docYear} • </span>
                                          ID: {doc.id_dokumen || ('INTERNAL-' + doc.id)}
                                        </p>
                                        {doc.status === 'Rejected' && doc.catatan && (
                                          <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                                            Catatan Umpan Balik: {doc.catatan}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden lg:table-cell px-6 py-4">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block truncate max-w-[150px]" title={doc.category}>
                                      {doc.category}
                                    </span>
                                  </td>
                                  <td className="hidden md:table-cell px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 font-mono italic">
                                    {docYear}
                                  </td>
                                  <td className="px-6 py-4">
                                    {doc.file_url && doc.file_url !== '-' ? (
                                      <button
                                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                                      >
                                        <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                                      </button>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tidak Ada File</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                      doc.status === 'Approved'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                        : doc.status === 'Rejected'
                                        ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                        : doc.status === 'Verified by Fakultas'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                        : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                    }`}>
                                      {doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : (doc.status || 'Pending')}
                                    </div>
                                  </td>
                                  <td className="hidden sm:table-cell px-6 py-4">
                                    {doc.is_kpi_counted ? (
                                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-xl border border-primary-100">
                                        <Sparkles className="w-3 h-3" /> KPI
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-100">
                                        <Archive className="w-3 h-3" /> Arsip
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                                      +{Number(doc.awarded_points) || 0} PTS
                                    </span>
                                  </td>
                                  <td className="hidden sm:table-cell px-6 py-4">
                                    {doc.penelitian ? (
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 max-w-[150px] truncate" title={doc.penelitian.judul_penelitian}>
                                        <Link className="w-2.5 h-2.5 shrink-0" />
                                        <span className="text-[9px] font-black uppercase tracking-tight truncate">
                                          {doc.penelitian.judul_penelitian}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDocForDetail(doc)}
                                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center mx-auto"
                                      title="Lihat Detail"
                                    >
                                      <Info className="w-4 h-4" />
                                    </button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination 
                      totalItems={filteredDocs.length} 
                      currentPage={currentPage} 
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
                ) : categoryFilter === 'buku' ? (
                  /* ── Tabel khusus Buku ── */
                  <>
                    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Informasi Buku</th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Kategori Buku</th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Tahun</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Dokumen</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Status</th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Klasifikasi</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Poin</th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
                            <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredDocs
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((doc: any, idx: number) => {
                              const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';
                              return (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  className="hover:bg-primary-50/20 dark:hover:bg-primary-900/10 transition-colors group"
                                >
                                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                                        <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                                          {doc.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                          <span className="lg:hidden">{docYear} • </span>
                                          ID: {doc.id_dokumen || ('INTERNAL-' + doc.id)}
                                        </p>
                                        {doc.status === 'Rejected' && doc.catatan && (
                                          <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                                            Catatan Umpan Balik: {doc.catatan}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden lg:table-cell px-6 py-4">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block truncate max-w-[150px]" title={doc.category}>
                                      {doc.category}
                                    </span>
                                  </td>
                                  <td className="hidden md:table-cell px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 font-mono italic">
                                    {docYear}
                                  </td>
                                  <td className="px-6 py-4">
                                    {doc.file_url && doc.file_url !== '-' ? (
                                      <button
                                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                                      >
                                        <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                                      </button>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tidak Ada File</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                      doc.status === 'Approved'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                        : doc.status === 'Rejected'
                                        ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                        : doc.status === 'Verified by Fakultas'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                        : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                    }`}>
                                      {doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : (doc.status || 'Pending')}
                                    </div>
                                  </td>
                                  <td className="hidden sm:table-cell px-6 py-4">
                                    {doc.is_kpi_counted ? (
                                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-xl border border-primary-100">
                                        <Sparkles className="w-3 h-3" /> KPI
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-100">
                                        <Archive className="w-3 h-3" /> Arsip
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                                      +{Number(doc.awarded_points) || 0} PTS
                                    </span>
                                  </td>
                                  <td className="hidden sm:table-cell px-6 py-4">
                                    {doc.penelitian ? (
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 max-w-[150px] truncate" title={doc.penelitian.judul_penelitian}>
                                        <Link className="w-2.5 h-2.5 shrink-0" />
                                        <span className="text-[9px] font-black uppercase tracking-tight truncate">
                                          {doc.penelitian.judul_penelitian}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDocForDetail(doc)}
                                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center mx-auto"
                                      title="Lihat Detail"
                                    >
                                      <Info className="w-4 h-4" />
                                    </button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination 
                      totalItems={filteredDocs.length} 
                      currentPage={currentPage} 
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
                ) : (categoryFilter === 'jurnal internasional' || categoryFilter === 'jurnal nasional') ? (
                  /* ── Tabel khusus Jurnal Internasional & Nasional ── */
                  <>
                    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Judul Publikasi</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Dokumen</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Status</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Poin KPI</th>
                            <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredDocs
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((doc: any, idx: number) => {
                              const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';
                              return (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.04 }}
                                  className="hover:bg-primary-50/20 dark:hover:bg-primary-900/10 transition-colors group"
                                >
                                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                                          {doc.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                          <span>{docYear} • </span>
                                          {doc.category}
                                        </p>
                                        {(doc.quartile || doc.author_role) && (
                                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                            {doc.quartile && (
                                              <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase rounded border border-orange-100/50 dark:border-orange-900/20">
                                                {doc.quartile}
                                              </span>
                                            )}
                                            {doc.author_role && (
                                              <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-100/50 dark:border-indigo-900/20">
                                                {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                                              </span>
                                            )}
                                            {doc.is_hyperauthor && (
                                              <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded border border-red-100/50 dark:border-red-900/20">
                                                Hyper
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    {doc.file_url && doc.file_url !== '-' ? (
                                      <button
                                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                                      >
                                        <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                                      </button>
                                    ) : (
                                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tidak Ada File</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                      doc.status === 'Approved'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                        : doc.status === 'Rejected'
                                        ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                                        : doc.status === 'Verified by Fakultas'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                                        : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                    }`}>
                                      {doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : (doc.status || 'Pending')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                                      +{Number(doc.awarded_points) || 0} PTS
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDocForDetail(doc)}
                                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center mx-auto"
                                      title="Lihat Detail"
                                    >
                                      <Info className="w-4 h-4" />
                                    </button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination 
                      totalItems={filteredDocs.length} 
                      currentPage={currentPage} 
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
                ) : (
                  /* ── Card layout untuk kategori lain (e.g. 'all' view) ── */
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc, idx) => {
                        const theme = getCategoryTheme(doc.category);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all ${theme.bg} ${theme.border}`}
                          >
                            <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm transition-colors ${theme.iconBg}`}>
                              <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                {Number(doc.awarded_points) || 0}
                              </span>
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                                PTS
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}>
                                  {doc.category}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> 
                                  {doc.published_at ? new Date(doc.published_at).getFullYear() : (doc.tahun_pelaksanaan || '-')}
                                </span>
                              </div>
                              <h3 
                                onClick={() => setSelectedDocForDetail(doc)}
                                className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
                              >
                                {doc.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="hidden sm:flex flex-col items-end text-right gap-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  ID Dokumen
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                  {doc.id_dokumen || 'INTERNAL-' + doc.id}
                                </span>
                              </div>
                              {doc.file_url && doc.file_url !== '-' ? (
                                <button
                                  onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                  className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 transition-all flex items-center justify-center shadow-sm"
                                  title="Lihat Dokumen"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              ) : null}
                              <button
                                onClick={() => setSelectedDocForDetail(doc)}
                                className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center shadow-sm"
                                title="Lihat Detail"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <Pagination 
                      totalItems={filteredDocs.length} 
                      currentPage={currentPage} 
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </>
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
          </>
        )}

        {/* ══════════ TAB: METRIKS PENILAIAN ══════════ */}
        {activeTab === 'metriks' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="p-6 bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-[2rem] relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Panduan Metriks Penilaian KPI (Dokumen Internal)</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Poin dihitung otomatis berdasarkan kategori dokumen yang telah disetujui — HKI, Buku Akademik, dan Penelitian & Hibah.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest block text-center shadow-md shadow-primary-500/20">
                    Sesuai Kebijakan KPI Terbaru
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
            </div>

            {/* Grid: HKI & Buku */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* HKI Card */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 shadow-inner">
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Hak Kekayaan Intelektual (HKI)</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin HKI berdasarkan keputusan universitas</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis HKI</th>
                        <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Batasan Maksimal</th>
                        <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-2.5">HKI Paten</td>
                        <td className="py-2.5 text-center text-slate-400">-</td>
                        <td className="py-2.5 text-right text-purple-600 font-black">40</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">HKI Paten Sederhana</td>
                        <td className="py-2.5 text-center text-slate-400">-</td>
                        <td className="py-2.5 text-right text-purple-600 font-black">28</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">HKI Merek</td>
                        <td className="py-2.5 text-center text-slate-400">-</td>
                        <td className="py-2.5 text-right text-purple-600 font-black">12</td>
                      </tr>
                      <tr>
                        <td className="py-2.5">HKI Hak Cipta</td>
                        <td className="py-2.5 text-center text-red-500 font-black">Maks 2 / Tahun</td>
                        <td className="py-2.5 text-right text-purple-600 font-black">5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buku Card */}
              <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-inner">
                    <Book className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Buku Akademik</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin penerbitan buku dosen</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Buku</th>
                        <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-3">Buku Referensi</td>
                        <td className="py-3 text-right text-amber-600 font-black">40</td>
                      </tr>
                      <tr>
                        <td className="py-3">Buku Ajar</td>
                        <td className="py-3 text-right text-amber-600 font-black">20</td>
                      </tr>
                      <tr>
                        <td className="py-3">Buku Monograf</td>
                        <td className="py-3 text-right text-amber-600 font-black">20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Penelitian & Hibah Card — full width */}
            <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <Beaker className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Penelitian &amp; Hibah</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Poin pendanaan hibah penelitian yang disetujui</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Program Penelitian</th>
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Rupiah Poin</th>
                      <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-2.5">Penelitian Hibah Luar Negeri</td>
                      <td className="py-2.5 text-center text-slate-400">0</td>
                      <td className="py-2.5 text-right text-emerald-600 font-black">10</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Penelitian Hibah Eksternal (Dikti)</td>
                      <td className="py-2.5 text-center text-slate-400">0</td>
                      <td className="py-2.5 text-right text-emerald-600 font-black">6</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Penelitian Internal Institusi</td>
                      <td className="py-2.5 text-center text-slate-400">0</td>
                      <td className="py-2.5 text-right text-emerald-600 font-black">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black">i</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Catatan Penting</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                  Poin diberikan secara otomatis setelah dokumen diverifikasi dan disetujui oleh administrator. 
                  Dokumen yang masih berstatus <span className="font-black text-amber-500">pending</span> atau <span className="font-black text-red-500">ditolak</span> tidak akan dihitung dalam total KPI.
                </p>
              </div>
            </div>
          </div>
        )}
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
