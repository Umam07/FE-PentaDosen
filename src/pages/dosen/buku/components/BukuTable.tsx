import React from 'react';
import { 
  Book, CheckCircle, XCircle, Clock, 
  FileText, Sparkles, Archive, Link, Info, 
  Lock, Pencil, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';

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
  availableYears: number[];
  filterYear: number | null;
  onYearChange: (year: number | null) => void;
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
  setIsLinkingModalOpen,
  availableYears,
  filterYear,
  onYearChange,
}: BukuTableProps) {
  
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40';
    if (status === 'Rejected') return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800/40';
    return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Riwayat Buku</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Informasi Buku</th>
              <th className="hidden lg:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Kategori Buku</th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Tanggal Terbit</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Dokumen</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Status</th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Klasifikasi</th>
              <th className="px-4 lg:px-6 py-3.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Poin</th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Penelitian Asal</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Detail</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-4 lg:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0" />
                        <div className="space-y-2 w-full max-w-[200px]">
                          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" /></td>
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-xl" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto" /></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : paginatedDocs.length > 0 ? (
              paginatedDocs.map((doc: any) => {
                const docDate = doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                          <Book className="h-4 w-4 lg:h-5 lg:w-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate tracking-tight" title={doc.title}>{doc.title}</p>
                          <p className="text-[10px] lg:text-xs font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{docDate} • </span>
                            {doc.category}
                          </p>

                          {doc.status === 'Rejected' && doc.catatan && (
                            <div className="mt-2 text-[10px] font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-200/60 dark:border-red-900/30 w-fit">
                              Catatan Umpan Balik: {doc.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-medium text-slate-500 dark:text-slate-400">
                      {docDate}
                    </td>

                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Lihat Dokumen
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer">
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
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[10px] border ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1">{doc.status}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                          <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          KPI
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                          <Archive className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
                          +{Math.round(doc.awarded_points || 0)} PTS
                        </span>
                      </div>
                    </td>

                    {/* Connect to Research column */}
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-right sm:text-left">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 max-w-[150px] truncate">
                          <Link className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="text-[10px] font-medium truncate" title={doc.penelitian.judul_penelitian}>
                            {doc.penelitian.judul_penelitian}
                          </span>
                          <button 
                            onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                            className="ml-auto text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold rounded-lg border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
                        >
                          <Link className="w-3 h-3" /> Pilih Asal
                        </button>
                      )}
                    </td>

                    {/* View Detail Button */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center mx-auto cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-4 text-center align-middle">
                      {isDocLocked(doc) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-medium cursor-not-allowed" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => openEditModal(doc)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer" title="Edit Buku">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer" title="Hapus Buku">
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
                     <Book className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
                     <p className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">Belum ada buku terdaftar</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan <span className="font-semibold font-mono text-slate-800 dark:text-zinc-200">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDocuments.length)}</span> dari <span className="font-semibold font-mono text-slate-800 dark:text-zinc-200">{filteredDocuments.length}</span> Buku
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">Limit:</span>
              <DropdownSelect
                value={itemsPerPage}
                onChange={(val) => {
                  setItemsPerPage(val);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" }
                ]}
                size="sm"
                className="w-[85px]"
                position="top"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400 dark:text-slate-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentPage === p 
                          ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs' 
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

