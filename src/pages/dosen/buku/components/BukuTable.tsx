import React from 'react';
import { 
  Book, Pencil, Trash2, FileText, CheckCircle, XCircle, 
  Clock, Archive, Sparkles, Link, Info, Lock, RotateCcw
} from 'lucide-react';
import { BUKU_CATEGORIES } from '../constants';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import Pagination from '../../dashboard/components/Pagination';

interface BukuTableProps {
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

export default function BukuTable({
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
}: BukuTableProps) {
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
      {/* Header Tabel: Judul, Jumlah Dokumen, dan Counter Filter Aktif */}
      <div className="p-4 sm:p-5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
            Riwayat Dokumen Buku
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-semibold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
            {filteredDocuments.length} Dokumen
          </span>
          {filterYear !== null && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-ink text-on-ink dark:bg-on-dark dark:text-ink">
              1 Filter Aktif
            </span>
          )}
        </div>

        {/* Tombol Reset Filter di Ujung Kanan Header */}
        {filterYear !== null && (
          <button
            type="button"
            onClick={() => {
              onYearChange(null);
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar Terpadu */}
      {(availableYears.length > 0 || filterYear !== null) && (
        <div className="px-3.5 sm:px-5 py-3 border-b border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light-raised/40 dark:bg-surface-dark-elevated/30 flex flex-wrap items-center gap-2">
          <YearFilterBar
            availableYears={availableYears}
            selectedYear={filterYear}
            onYearChange={(y) => {
              onYearChange(y);
              setCurrentPage(1);
            }}
            variant="inline"
          />
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Informasi Buku</th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Kategori Buku</th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Tanggal Terbit</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Dokumen</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Status</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Klasifikasi</th>
              <th className="px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Poin</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Penelitian Asal</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">Detail</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0" />
                        <div className="space-y-2 w-full max-w-[200px]">
                          <div className="h-4 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                          <div className="h-3 w-2/3 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" /></td>
                    <td className="hidden md:table-cell px-6 py-4"><div className="h-4 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full" /></td>
                    <td className="hidden sm:table-cell px-6 py-4"><div className="h-6 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="hidden sm:table-cell px-6 py-4"><div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-6 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-12 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto" /></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => {
                const catConfig = BUKU_CATEGORIES.find(c => c.value === doc.category);
                const DocIcon = catConfig ? catConfig.icon : Book;
                const docDate = doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                return (
                  <tr key={doc.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group">
                    <td className="px-6 py-4 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 text-body dark:text-on-dark-soft border border-hairline-light/60 dark:border-hairline-dark/60">
                          <DocIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate tracking-tight" title={doc.title}>{doc.title}</p>
                          <p className="text-[10px] sm:text-[11px] font-medium text-muted dark:text-on-dark-muted truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{docDate} • </span>
                            {doc.category}
                          </p>
                          
                          {doc.status === 'Rejected' && doc.catatan && (
                            <div className="mt-2 text-[11px] text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-2.5 py-1 rounded-lg border border-error-border dark:border-error/30 w-fit">
                              Catatan: {doc.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden lg:table-cell px-6 py-4 align-middle">
                      <span className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    <td className="hidden md:table-cell px-6 py-4 align-middle text-xs font-mono text-muted dark:text-on-dark-muted">
                      {docDate}
                    </td>
                    
                    <td className="px-6 py-4 align-middle">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          aria-label={`Lihat dokumen ${doc.title}`}
                          className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                        </button>
                      ) : (
                        <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors shadow-2xs">
                          {uploadingPdfId === doc.id ? (
                            <span className="animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              Upload
                              <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                            </>
                          )}
                        </label>
                      )}
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                        doc.status === 'Approved' ? 'bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark border-success-border dark:border-success/30' :
                        doc.status === 'Rejected' ? 'bg-error-soft text-error dark:bg-error/15 dark:text-error-on-dark border-error-border dark:border-error/30' :
                        doc.status === 'Verified by Fakultas' ? 'bg-accent-soft text-accent-hover dark:bg-accent/15 dark:text-accent-on-dark border-accent-border dark:border-accent/30' :
                        'bg-warning-soft text-warning dark:bg-warning/15 dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 text-success" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 text-error" />}
                        {(doc.status === 'Pending' || doc.status === 'Verified by Fakultas') && <Clock className="w-3 h-3" />}
                        <span>{doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : doc.status}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-6 py-4 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-ink-heading dark:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark">
                          <Sparkles className="w-3 h-3 text-warning" />
                          KPI
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted dark:text-on-dark-muted bg-surface-light-raised/50 dark:bg-surface-dark-soft px-2.5 py-1 rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft">
                          <Archive className="w-3 h-3" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col items-end sm:items-start">
                        <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark">
                          +{Math.round(doc.awarded_points || 0)} Pts
                        </span>
                      </div>
                    </td>

                    {/* Connect to Research column */}
                    <td className="hidden sm:table-cell px-6 py-4 align-middle text-right sm:text-left">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft rounded-lg border border-hairline-light dark:border-hairline-dark max-w-[150px] truncate">
                          <Link className="w-3 h-3 shrink-0 text-muted dark:text-on-dark-muted" />
                          <span className="text-[11px] font-semibold truncate" title={doc.penelitian.judul_penelitian}>
                            {doc.penelitian.judul_penelitian}
                          </span>
                          <button 
                            type="button"
                            onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                            className="ml-auto text-[10px] font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark text-[10px] font-semibold rounded-lg border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs"
                        >
                          <Link className="w-3 h-3 text-muted dark:text-on-dark-muted" /> Pilih Penelitian Asal
                        </button>
                      )}
                    </td>
                    
                    {/* View Detail Button */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        aria-label={`Lihat detail buku ${doc.title}`}
                        className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all flex items-center justify-center mx-auto cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4 text-center align-middle">
                      {isDocLocked(doc) ? (
                        <div className="flex items-center justify-center gap-1" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted-soft dark:text-on-dark-muted text-[10px] font-semibold cursor-not-allowed border border-hairline-light dark:border-hairline-dark">
                            <Lock className="w-3 h-3" /> Terkunci
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(doc)}
                            aria-label={`Edit buku ${doc.title}`}
                            className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all cursor-pointer"
                            title="Edit Buku"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            aria-label={`Hapus buku ${doc.title}`}
                            className="p-1.5 rounded-lg hover:bg-error-soft dark:hover:bg-error/20 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark transition-all cursor-pointer"
                            title="Hapus Buku"
                          >
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
                    <Book className="w-12 h-12 text-muted-soft/40 dark:text-on-dark-muted/40 mb-3" />
                    <p className="text-xs font-semibold text-muted dark:text-on-dark-muted">
                      Belum ada buku terdaftar.
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


