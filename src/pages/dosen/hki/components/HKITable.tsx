import React from 'react';
import { 
  Shield, Pencil, Trash2, FileText, CheckCircle, XCircle, 
  Clock, Archive, Sparkles, Link, Info, Lock 
} from 'lucide-react';
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

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 tracking-tight">Riwayat Dokumen HKI</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Informasi HKI</th>
              <th className="hidden lg:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kategori HKI</th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tanggal Perolehan</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Dokumen</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Klasifikasi</th>
              <th className="px-4 lg:px-6 py-3.5 text-right sm:text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Poin</th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3.5 text-right sm:text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Penelitian Asal</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detail</th>
              <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Aksi</th>
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
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => {
                const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
                const DocIcon = catConfig ? catConfig.icon : Shield;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors shrink-0 text-slate-700 dark:text-slate-300">
                          <DocIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 truncate tracking-tight" title={doc.title}>{doc.title}</p>
                          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} • </span>
                            {doc.category}
                          </p>
                          
                          {doc.status === 'Rejected' && doc.catatan && (
                            <div className="mt-2 text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit">
                              Catatan Umpan Balik: {doc.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-mono text-slate-500 dark:text-slate-400">
                      {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Lihat Dokumen
                        </button>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold transition-colors cursor-pointer">
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
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                        doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60' :
                        doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/60' :
                        doc.status === 'Verified by Fakultas' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60' :
                        'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />}
                        {(doc.status === 'Pending' || doc.status === 'Verified by Fakultas') && <Clock className="w-3 h-3" />}
                        <span>{doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : doc.status}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          KPI
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                          <Archive className="w-3 h-3" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className="flex flex-col items-end sm:items-start">
                        <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100">
                          +{Math.round(doc.awarded_points)} PTS
                        </span>
                      </div>
                    </td>

                    {/* Connect to Research column */}
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-right sm:text-left">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200/80 dark:border-slate-700/80 max-w-[150px] truncate">
                          <Link className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="text-[11px] font-semibold truncate" title={doc.penelitian.judul_penelitian}>
                            {doc.penelitian.judul_penelitian}
                          </span>
                          <button 
                            onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                            className="ml-auto text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-lg border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
                        >
                          <Link className="w-3 h-3 text-slate-400" /> Pilih Penelitian Asal
                        </button>
                      )}
                    </td>
                    
                    {/* View Detail Button */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center mx-auto cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-4 text-center align-middle">
                      {isDocLocked(doc) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-semibold cursor-not-allowed" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => openEditModal(doc)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer" title="Edit HKI">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 transition-all cursor-pointer" title="Hapus HKI">
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
                    <Shield className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
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

