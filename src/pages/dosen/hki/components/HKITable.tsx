import React from 'react';
import { 
  Shield, Pencil, Trash2, FileText, Upload, CheckCircle, XCircle, 
  Clock, Archive, Sparkles, Link, Info, Lock, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { HKI_CATEGORIES } from '../constants';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import Pagination from '../../dashboard/components/Pagination';

interface HKITableProps {
  isTableLoading: boolean;
  currentDocuments: any[];
  filteredDocuments: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (doc: { fileUrl: string; title: string; category: string } | null) => void;
  uploadingPdfId: number | null;
  handleUploadPdf: (e: React.ChangeEvent<HTMLInputElement>, id: number) => Promise<void>;
  openEditModal: (doc: any) => void;
  setDeleteDoc: (doc: any) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setDocToLink: (doc: any) => void;
  setIsLinkingModalOpen: (isOpen: boolean) => void;
  availableYears: number[];
  filterYear: number | null;
  onYearChange: (year: number | null) => void;
}

export default function HKITable({
  isTableLoading,
  currentDocuments,
  filteredDocuments,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setSelectedDocForDetail,
  setPreviewDoc,
  uploadingPdfId,
  handleUploadPdf,
  openEditModal,
  setDeleteDoc,
  setIsDeleteModalOpen,
  setDocToLink,
  setIsLinkingModalOpen,
  availableYears,
  filterYear,
  onYearChange,
}: HKITableProps) {
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
        <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Dokumen HKI</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
          <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
            <tr>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Informasi HKI</th>
              <th className="hidden lg:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Kategori HKI</th>
              <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tanggal Perolehan</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
              <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Klasifikasi</th>
              <th className="px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin</th>
              <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
              <th className="px-4 py-4 w-12 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Detail</th>
              <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-4 lg:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0" />
                        <div className="space-y-2 w-full max-w-[200px]">
                          <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
                          <div className="h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded" /></td>
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-12 bg-gray-200 dark:bg-zinc-700 rounded-lg" /></td>
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-lg" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-gray-200 dark:bg-zinc-700 rounded-lg mx-auto" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-12 bg-gray-200 dark:bg-zinc-700 rounded-lg mx-auto" /></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => {
                const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
                const DocIcon = catConfig ? catConfig.icon : Shield;
                return (
                  <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                          <DocIcon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} • </span>
                            {doc.category}
                          </p>
                          
                          {doc.status === 'Rejected' && doc.catatan && (
                            <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                              Catatan Umpan Balik: {doc.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-bold text-gray-500 dark:text-zinc-400">
                      {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                          {uploadingPdfId === doc.id ? (
                            <span className="animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              Upload File
                              <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                            </>
                          )}
                        </label>
                      )}
                    </td>

                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest ${
                        doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30' :
                        doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow-sm border border-red-100' :
                        doc.status === 'Verified by Fakultas' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100' :
                        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1" />}
                        {(doc.status === 'Pending' || doc.status === 'Verified by Fakultas') && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1" />}
                        <span>{doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : doc.status}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-xl border border-primary-100">
                          <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          KPI
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-gray-100">
                          <Archive className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className="flex flex-col items-end sm:items-start">
                        <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter">
                          +{Math.round(doc.awarded_points)} PTS
                        </span>
                      </div>
                    </td>

                    {/* Connect to Research column */}
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-right sm:text-left">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 max-w-[150px] truncate">
                          <Link className="w-2.5 h-2.5 shrink-0" />
                          <span className="text-[9px] font-black uppercase tracking-tight truncate" title={doc.penelitian.judul_penelitian}>
                            {doc.penelitian.judul_penelitian}
                          </span>
                          <button 
                            onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                            className="ml-auto text-[9px] font-black text-indigo-400 hover:text-indigo-600 uppercase"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 text-[9px] font-black uppercase tracking-widest rounded-md border transition-all"
                        >
                          <Link className="w-3 h-3" /> Pilih Penelitian Asal
                        </button>
                      )}
                    </td>
                    
                    {/* View Detail Button */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center justify-center mx-auto"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-4 text-center align-middle">
                      {isDocLocked(doc) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 text-[9px] font-black uppercase tracking-widest cursor-not-allowed" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => openEditModal(doc)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-400 hover:text-blue-600 transition-all" title="Edit HKI">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 transition-all" title="Hapus HKI">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                    <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">
                      Belum ada dokumen HKI yang diunggah.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isTableLoading && (
        <Pagination
          totalItems={filteredDocuments.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </section>
  );
}
