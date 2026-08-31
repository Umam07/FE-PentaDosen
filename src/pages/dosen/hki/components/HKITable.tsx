import React from 'react';
import { 
  Shield, Pencil, Trash2, FileText, CheckCircle, XCircle, 
  Clock, Link, Lock, RotateCcw, Info
} from 'lucide-react';
import { HKI_CATEGORIES } from '../constants';
import YearFilterBar from '../../../../components/shared/YearFilterBar';
import Pagination from '../../dashboard/components/Pagination';
import { EmptyState } from '../../../../components/ui/EmptyState';

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
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
      {/* Header Tabel: Judul, Jumlah Dokumen, dan Counter Filter Aktif */}
      <div className="p-4 sm:p-5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
            Riwayat HKI
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

      {/* ── 1. Desktop & Tablet Table View (md ke atas) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Judul HKI</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Tanggal Perolehan</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Penelitian Asal</th>
              <th className="px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Poin KPI</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Dokumen</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Detail</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-hairline-light dark:border-hairline-dark last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-1 max-w-[240px]">
                          <div className="h-4 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                          <div className="h-3 w-2/3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-5 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-28 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="px-6 py-4 text-right sm:text-left"><div className="h-5 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg ml-auto sm:ml-0" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" /></td>
                    <td className="px-4 py-4 text-center"><div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-7 w-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto" /></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => {
                const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
                const DocIcon = catConfig ? catConfig.icon : Shield;
                return (
                  <tr key={doc.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group">
                    {/* 1. Judul HKI */}
                    <td className="px-6 py-4 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 text-body dark:text-on-dark-soft border border-hairline-light/60 dark:border-hairline-dark/60">
                          <DocIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate tracking-tight" title={doc.title}>{doc.title}</p>
                          <p className="text-[10px] sm:text-[11px] font-medium text-muted dark:text-on-dark-muted truncate mt-0.5" title={doc.category}>
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
                    
                    {/* 2. Tanggal Perolehan */}
                    <td className="px-6 py-4 align-middle text-xs font-mono text-muted dark:text-on-dark-muted whitespace-nowrap">
                      {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    
                    {/* 3. Status */}
                    <td className="px-6 py-4 align-middle">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border whitespace-nowrap ${
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

                    {/* 4. Penelitian Asal */}
                    <td className="px-6 py-4 align-middle text-left">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft rounded-lg border border-hairline-light dark:border-hairline-dark max-w-[170px] truncate">
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
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark text-[10px] font-semibold rounded-lg border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          <Link className="w-3 h-3 text-muted dark:text-on-dark-muted" /> Pilih Penelitian Asal
                        </button>
                      )}
                    </td>

                    {/* 5. Poin KPI */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col items-end sm:items-start">
                        <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark whitespace-nowrap">
                          +{Math.round(doc.awarded_points || 0)} Pts
                        </span>
                      </div>
                    </td>

                    {/* 6. Dokumen */}
                    <td className="px-6 py-4 align-middle">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          aria-label={`Lihat dokumen ${doc.title}`}
                          className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                        </button>
                      ) : (
                        <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors shadow-2xs whitespace-nowrap">
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

                    {/* 7. Detail */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        aria-label={`Lihat detail HKI ${doc.title}`}
                        className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all flex items-center justify-center mx-auto cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* 8. Aksi */}
                    <td className="px-6 py-4 text-center align-middle whitespace-nowrap">
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
                            aria-label={`Edit HKI ${doc.title}`}
                            className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all cursor-pointer"
                            title="Edit HKI"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                            aria-label={`Hapus HKI ${doc.title}`}
                            className="p-1.5 rounded-lg hover:bg-error-soft dark:hover:bg-error/20 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark transition-all cursor-pointer"
                            title="Hapus HKI"
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
                <td colSpan={8} className="p-0">
                  <EmptyState
                    icon={Shield}
                    title="Belum ada dokumen HKI"
                    description="Dokumen Hak Kekayaan Intelektual (HKI/Paten) belum ditemukan untuk filter ini."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── 2. Mobile Responsive Card List View (< md) ── */}
      <div className="block md:hidden divide-y divide-hairline-light dark:divide-hairline-dark">
        {isTableLoading ? (
          <phantom-ui loading={true} animation="shimmer" className="contents">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={`m-skeleton-${i}`} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-9 w-9 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                      <div className="h-3 w-1/2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                  <div className="h-5 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                </div>
                <div className="pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between">
                  <div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full" />
                  <div className="flex gap-1.5">
                    <div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
                    <div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </phantom-ui>
        ) : currentDocuments.length > 0 ? (
          currentDocuments.map((doc: any) => {
            const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
            const DocIcon = catConfig ? catConfig.icon : Shield;
            const docDate = doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
            const isApproved = doc.status === 'Approved';
            const isRejected = doc.status === 'Rejected';
            const isVerified = doc.status === 'Verified by Fakultas';
            const isLocked = isDocLocked(doc);

            return (
              <div 
                key={doc.id}
                className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised/40 dark:hover:bg-surface-dark-elevated/40 transition-colors"
              >
                {/* Top Section: Icon, Title & Points */}
                <div className="flex items-start justify-between gap-2.5">
                  <div 
                    className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer group"
                    onClick={() => setSelectedDocForDetail(doc)}
                  >
                    <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 mt-0.5 border border-hairline-light/60 dark:border-hairline-dark/60 text-body dark:text-on-dark-soft shadow-2xs">
                      <DocIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-2 hover:underline"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted dark:text-on-dark-muted flex-wrap mt-1">
                        <span className="font-mono">{docDate}</span>
                        <span>•</span>
                        <span className="font-medium">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Point Badge */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-bold font-mono tabular-nums border border-hairline-light dark:border-hairline-dark whitespace-nowrap shadow-2xs">
                      +{Math.round(doc.awarded_points || 0)} Pts
                    </span>
                  </div>
                </div>

                {/* Badges / Chips: Penelitian Asal Link */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {doc.penelitian ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft rounded-lg border border-hairline-light dark:border-hairline-dark max-w-full text-xs">
                      <Link className="w-3 h-3 shrink-0 text-muted dark:text-on-dark-muted" />
                      <span className="text-[11px] font-semibold truncate max-w-[200px]" title={doc.penelitian.judul_penelitian}>
                        {doc.penelitian.judul_penelitian}
                      </span>
                      <button 
                        type="button"
                        onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                        className="ml-1 text-[10px] font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer underline underline-offset-2"
                      >
                        Ubah
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark text-[10px] font-semibold rounded-lg border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      <Link className="w-3 h-3 text-muted dark:text-on-dark-muted" /> Pilih Penelitian Asal
                    </button>
                  )}
                </div>

                {/* Rejection Note */}
                {doc.status === 'Rejected' && doc.catatan && (
                  <div className="text-[11px] text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-2.5 py-1.5 rounded-lg border border-error-border dark:border-error/30">
                    Catatan: {doc.catatan}
                  </div>
                )}

                {/* Card Footer: Status, File Action, Detail & Action Buttons */}
                <div className="pt-2.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between gap-2 flex-wrap">
                  {/* Left: Status & PDF */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px] border whitespace-nowrap ${
                        isApproved
                          ? 'bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark border-success-border dark:border-success/30'
                          : isRejected
                          ? 'bg-error-soft text-error dark:bg-error/15 dark:text-error-on-dark border-error-border dark:border-error/30'
                          : isVerified
                          ? 'bg-accent-soft text-accent-hover dark:bg-accent/15 dark:text-accent-on-dark border-accent-border dark:border-accent/30'
                          : 'bg-warning-soft text-warning dark:bg-warning/15 dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                      }`}
                    >
                      {isApproved && <CheckCircle className="w-3.5 h-3.5 mr-1 text-success dark:text-success-on-dark" />}
                      {isRejected && <XCircle className="w-3.5 h-3.5 mr-1 text-error dark:text-error-on-dark" />}
                      {!isApproved && !isRejected && <Clock className="w-3.5 h-3.5 mr-1 text-warning dark:text-warning-on-dark" />}
                      <span>{isVerified ? 'Verified (Fakultas)' : isApproved ? 'Approved' : isRejected ? 'Rejected' : doc.status || 'Pending'}</span>
                    </div>

                    {/* PDF Action */}
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        aria-label={`Lihat dokumen ${doc.title}`}
                        className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
                    ) : (
                      <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors shadow-2xs whitespace-nowrap">
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
                  </div>

                  {/* Right: Detail, Edit, Delete / Locked */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      aria-label={`Lihat detail HKI ${doc.title}`}
                      className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Lihat Detail"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {isLocked ? (
                      <span
                        className="p-1.5 rounded-lg bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50 text-muted/60 dark:text-on-dark-muted/50 border border-hairline-light/60 dark:border-hairline-dark/60 inline-flex items-center justify-center cursor-not-allowed"
                        title="Dokumen sudah diverifikasi — tidak dapat diubah"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => openEditModal(doc)}
                          aria-label={`Edit HKI ${doc.title}`}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs"
                          title="Edit HKI"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          aria-label={`Hapus HKI ${doc.title}`}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark hover:border-error-border dark:hover:border-error/30 transition-all cursor-pointer shadow-2xs"
                          title="Hapus HKI"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyState
            compact
            icon={Shield}
            title="Belum ada dokumen HKI"
            description="Dokumen Hak Kekayaan Intelektual (HKI/Paten) belum ditemukan untuk filter ini."
          />
        )}
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
