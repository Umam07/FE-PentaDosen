import React from 'react';
import { 
   ChevronLeft, ChevronRight, Lock, Pencil, Trash2, 
   FileText, Info 
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
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Riwayat Penelitian
        </h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
          <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Informasi Penelitian
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Program & Skema
              </th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Tanggal Pelaksanaan
              </th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Dana
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Dokumen
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">
                Poin
              </th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                Detail
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-6 py-4 bg-slate-50/30 h-16"></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentItems.length > 0 ? (
              currentItems.map((res: any) => {
                const SchemaIcon = getResearchSchemaIcon(res.program, res.skema);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => onViewDetail(res)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors flex-shrink-0">
                          <SchemaIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                        <p
                          className="font-bold text-slate-900 dark:text-white truncate max-w-md"
                          title={res.judul_penelitian}
                        >
                          {res.judul_penelitian}
                        </p>
                        <p className="lg:hidden text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="md:hidden font-mono">{formatDateVal(res.tahun)} • </span>
                          <span>{res.program}</span>
                        </p>
                        {res.status === 'Rejected' && res.catatan && (
                          <div className="mt-2 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-200/60 dark:border-rose-900/40 w-fit">
                            Catatan: {res.catatan}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                      {res.program}
                    </p>
                    <div className="flex gap-1.5 mt-1">
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        {res.skema}
                      </span>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        {res.fokus}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-center">
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                      {formatDateVal(res.tahun)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-xs font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(res.dana_disetujui)}
                  </td>
                  <td className="px-6 py-4">
                    {res.file_url && res.file_url !== '-' ? (
                      <button
                        onClick={() =>
                          onPreviewPdf({
                            fileUrl: res.file_url,
                            title: res.judul_penelitian,
                            category: res.program,
                          })
                        }
                        className="inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Lihat
                      </button>
                    ) : (
                      <label className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors">
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
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40'
                          : res.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40'
                          : res.status === 'Verified by Fakultas'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60 dark:border-sky-900/40'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40'
                      }`}
                    >
                      {res.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : res.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100">
                      +{Math.round(res.awarded_points)} Pts
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onViewDetail(res)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center mx-auto cursor-pointer"
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-semibold cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60">
                          <Lock className="w-3 h-3" />
                          Terkunci
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditClick(res)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
                          title="Edit Penelitian"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteClick(res)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
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
                  className="px-6 py-12 text-center text-slate-400 font-medium text-xs"
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
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan <span className="font-semibold font-mono text-slate-900 dark:text-white">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, researchList.length)}</span> dari <span className="font-semibold font-mono text-slate-900 dark:text-white">{researchList.length}</span> Penelitian
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400 dark:text-slate-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        currentPage === p
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

