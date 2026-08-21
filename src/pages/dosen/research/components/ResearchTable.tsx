import React from 'react';
import { 
   ChevronLeft, ChevronRight, Lock, Pencil, Trash2, 
   FileText, Info, RotateCcw
} from 'lucide-react';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { getResearchSchemaIcon } from '../utils/researchIconMapper';

const formatDateVal = (dateStr: string | number) => {
  if (!dateStr) return '-';
  const str = String(dateStr);
  if (str.length === 4 && !isNaN(Number(str))) {
    return str;
  }
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return str;
  }
};

interface ResearchTableProps {
  researchList: any[];
  currentItems: any[];
  isTableLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setItemsPerPage: (val: number) => void;
  onViewDetail: (doc: any) => void;
  onPreviewPdf: (preview: { fileUrl: string; title: string; category: string }) => void;
  onUploadPdf: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  uploadingPdfId: number | null;
  onEditClick: (doc: any) => void;
  onDeleteClick: (doc: any) => void;
  availableYears: number[];
  filterYear: number | null;
  onYearChange: (year: number | null) => void;
}

export default function ResearchTable({
  researchList,
  currentItems,
  isTableLoading,
  currentPage,
  itemsPerPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  setCurrentPage,
  setItemsPerPage,
  onViewDetail,
  onPreviewPdf,
  onUploadPdf,
  uploadingPdfId,
  onEditClick,
  onDeleteClick,
  availableYears,
  filterYear,
  onYearChange,
}: ResearchTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
      {/* Header Tabel: Judul, Jumlah Dokumen, dan Counter Filter Aktif */}
      <div className="p-4 sm:p-5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
            Riwayat Penelitian
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-semibold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
            {researchList.length} Dokumen
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
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Informasi Penelitian
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Program &amp; Skema
              </th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Tanggal Pelaksanaan
              </th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Dana
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Dokumen
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted dark:text-on-dark-muted">
                Poin
              </th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">
                Detail
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-6 py-4 bg-surface-light-raised/30 h-16"></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentItems.length > 0 ? (
              currentItems.map((res: any) => {
                const SchemaIcon = getResearchSchemaIcon(res.program, res.skema);
                return (
                  <tr key={res.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => onViewDetail(res)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 text-body dark:text-on-dark-soft border border-hairline-light/60 dark:border-hairline-dark/60">
                          <SchemaIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p
                            className="font-bold text-ink-heading dark:text-on-dark truncate max-w-md"
                            title={res.judul_penelitian}
                          >
                            {res.judul_penelitian}
                          </p>
                          <p className="lg:hidden text-[11px] text-muted dark:text-on-dark-muted mt-0.5">
                            <span className="md:hidden font-mono">{formatDateVal(res.tahun)} • </span>
                            <span>{res.program}</span>
                          </p>
                          {res.status === 'Rejected' && res.catatan && (
                            <div className="mt-2 text-[11px] text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-2.5 py-1 rounded-lg border border-error-border dark:border-error/30 w-fit">
                              Catatan: {res.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                        {res.program}
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] font-medium text-body dark:text-on-dark-soft bg-surface-light-raised dark:bg-surface-dark-elevated px-2 py-0.5 rounded-md border border-hairline-light dark:border-hairline-dark">
                          {res.skema}
                        </span>
                        <span className="text-[10px] font-medium text-body dark:text-on-dark-soft bg-surface-light-raised dark:bg-surface-dark-elevated px-2 py-0.5 rounded-md border border-hairline-light dark:border-hairline-dark">
                          {res.fokus}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-center">
                      <span className="text-xs font-mono font-medium text-body dark:text-on-dark-soft bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark">
                        {formatDateVal(res.tahun)}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-xs font-mono tabular-nums font-semibold text-body-strong dark:text-on-dark">
                      {formatCurrency(res.dana_disetujui)}
                    </td>
                    <td className="px-6 py-4">
                      {res.file_url && res.file_url !== '-' ? (
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewPdf({
                              fileUrl: res.file_url,
                              title: res.judul_penelitian,
                              category: res.program,
                            })
                          }
                          aria-label={`Lihat PDF untuk ${res.judul_penelitian}`}
                          className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" />
                          Lihat
                        </button>
                      ) : (
                        <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark-soft px-2.5 py-1 rounded-md border border-hairline-light dark:border-hairline-dark transition-colors shadow-2xs">
                          {uploadingPdfId === res.id ? (
                            <span className="animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              Upload
                              <input
                                type="file"
                                accept=".pdf"
                                className="sr-only"
                                onChange={(e) => onUploadPdf(e, res.id)}
                                disabled={uploadingPdfId === res.id}
                              />
                            </>
                          )}
                        </label>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                          res.status === 'Approved'
                            ? 'bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark border-success-border dark:border-success/30'
                            : res.status === 'Rejected'
                            ? 'bg-error-soft text-error dark:bg-error/15 dark:text-error-on-dark border-error-border dark:border-error/30'
                            : res.status === 'Verified by Fakultas'
                            ? 'bg-accent-soft text-accent-hover dark:bg-accent/15 dark:text-accent-on-dark border-accent-border dark:border-accent/30'
                            : 'bg-warning-soft text-warning dark:bg-warning/15 dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                        }`}
                      >
                        {res.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : res.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark">
                        +{Math.round(res.awarded_points)} Pts
                      </span>
                    </td>

                    {/* View Detail Button */}
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => onViewDetail(res)}
                        aria-label={`Lihat detail penelitian ${res.judul_penelitian}`}
                        className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all flex items-center justify-center mx-auto cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Aksi: Edit & Delete */}
                    <td className="px-4 py-4 text-center align-middle">
                      {isDocLocked(res) ? (
                        <div
                          className="flex items-center justify-center gap-1"
                          title="Dokumen sudah diverifikasi — tidak dapat diubah"
                        >
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted-soft dark:text-on-dark-muted text-[10px] font-semibold cursor-not-allowed border border-hairline-light dark:border-hairline-dark">
                            <Lock className="w-3 h-3" />
                            Terkunci
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditClick(res)}
                            aria-label={`Edit penelitian ${res.judul_penelitian}`}
                            className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-all cursor-pointer"
                            title="Edit Penelitian"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClick(res)}
                            aria-label={`Hapus penelitian ${res.judul_penelitian}`}
                            className="p-1.5 rounded-lg hover:bg-error-soft dark:hover:bg-error/20 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark transition-all cursor-pointer"
                            title="Hapus Penelitian"
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
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-muted dark:text-on-dark-muted font-medium text-xs"
                >
                  Belum ada data penelitian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isTableLoading && researchList.length > 0 && (
        <div className="px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted dark:text-on-dark-muted">
              Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, researchList.length)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{researchList.length}</span> Penelitian
            </span>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
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
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Halaman sebelumnya"
              className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-muted dark:text-on-dark-muted text-xs">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      aria-label={`Halaman ${p}`}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        currentPage === p
                          ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                          : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Halaman berikutnya"
              className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
