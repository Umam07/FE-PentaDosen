import React from 'react';
import { 
  Filter, BookOpen, CheckCircle, XCircle, Clock, 
  FileText, Upload, Sparkles, Archive, Link, Info, 
  Lock, Pencil, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { BUKU_CATEGORIES } from '../constants';

interface BukuTableProps {
  isTableLoading: boolean;
  filterKategori: string;
  setFilterKategori: (k: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  filteredDocuments: any[];
  paginatedDocs: any[];
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (doc: { fileUrl: string; title: string; category: string } | null) => void;
  uploadingPdfId: number | null;
  handleUploadPdf: (e: React.ChangeEvent<HTMLInputElement>, id: number) => Promise<void>;
  openEditModal: (doc: any) => void;
  setDeleteDoc: (doc: any) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setDocToLink: (doc: any) => void;
  setIsLinkingModalOpen: (isOpen: boolean) => void;
}

export default function BukuTable({
  isTableLoading,
  filterKategori,
  setFilterKategori,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredDocuments,
  paginatedDocs,
  setSelectedDocForDetail,
  setPreviewDoc,
  uploadingPdfId,
  handleUploadPdf,
  openEditModal,
  setDeleteDoc,
  setIsDeleteModalOpen,
  setDocToLink,
  setIsLinkingModalOpen
}: BukuTableProps) {
  
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
    if (status === 'Rejected') return 'text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
        <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Buku</h3>
      </div>

      {/* Filter bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </div>
        {['', ...BUKU_CATEGORIES.map(b => b.value)].map(k => (
          <button 
            key={k} 
            onClick={() => { setFilterKategori(k); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filterKategori === k 
                ? 'bg-primary-600 text-white' 
                : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-200 dark:border-zinc-700 hover:border-primary-300'
            }`}
          >
            {k || 'Semua'}
          </button>
        ))}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
          <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
            <tr>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Informasi Buku</th>
              <th className="hidden lg:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Kategori Buku</th>
              <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tahun</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
              <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Klasifikasi</th>
              <th className="px-4 lg:px-8 py-4 text-right text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin</th>
              <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
              <th className="px-4 py-4 w-12 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Detail</th>
              <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
            {isTableLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
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
              ))
            ) : paginatedDocs.length > 0 ? (
              paginatedDocs.map((doc: any) => {
                const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
                return (
                  <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                          <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{docYear || '-'} • </span>
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
                    
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-black text-gray-500 dark:text-zinc-400 font-mono italic">
                      {docYear || '-'}
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
                              <Upload className="w-3.5 h-3.5 mr-1" /> Upload File
                              <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                            </>
                          )}
                        </label>
                      )}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status}</span>
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
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter">
                          +{doc.awarded_points || 0} PTS
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
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-400 hover:text-blue-600 transition-all" title="Edit Buku">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 transition-all" title="Hapus Buku">
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
                <td colSpan={10} className="px-4 lg:px-8 py-16 text-center">
                  <div className="flex flex-col items-center">
                     <BookOpen className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                     <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">Inventory Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} entries
            </span>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-2 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Per Page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 py-1 pl-2 pr-6 focus:ring-2 focus:ring-primary-200 outline-none cursor-pointer"
              >
                {[10, 25, 50, 100].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-2 text-gray-300 dark:text-zinc-600 font-bold">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        currentPage === p 
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30' 
                          : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
