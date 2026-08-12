import React from 'react';
import { 
  ChevronLeft, ChevronRight, Lock, Pencil, Trash2, 
  FileText, Upload, Info 
} from 'lucide-react';
import { motion } from 'motion/react';
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
    <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
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
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Informasi Penelitian
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Program & Skema
              </th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Tanggal Pelaksanaan
              </th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Dana
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Dokumen
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Poin
              </th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Detail
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={9} className="px-6 py-4 bg-gray-50/50 h-16"></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentItems.length > 0 ? (
              currentItems.map((res: any) => {
                const SchemaIcon = getResearchSchemaIcon(res.program, res.skema);
                return (
                  <tr key={res.id} className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="px-6 py-4 cursor-pointer" onClick={() => onViewDetail(res)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 transition-colors flex-shrink-0">
                          <SchemaIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                        </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                        <p
                          className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight truncate max-w-md"
                          title={res.judul_penelitian}
                        >
                          {res.judul_penelitian}
                        </p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                          <span className="md:hidden">{formatDateVal(res.tahun)} • </span>
                          <span className="lg:hidden">{res.program} • </span>
                          ID: #RES-{res.id.toString().padStart(4, '0')}
                        </p>
                        {res.status === 'Rejected' && res.catatan && (
                          <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                            Catatan Umpan Balik: {res.catatan}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <p className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-wide">
                      {res.program}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">
                        {res.skema}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">
                        {res.fokus}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-center">
                    <span className="text-xs font-black text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                      {formatDateVal(res.tahun)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-xs font-black text-gray-900 dark:text-zinc-100 tabular-nums">
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
                        className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-md"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Lihat
                      </button>
                    ) : (
                      <label className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary-600 cursor-pointer bg-gray-50 hover:bg-primary-50 px-2 py-1 rounded-md transition-colors">
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
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        res.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : res.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : res.status === 'Verified by Fakultas'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {res.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : res.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-primary-600">
                      +{Math.round(res.awarded_points)}
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onViewDetail(res)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center justify-center mx-auto"
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
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 text-[9px] font-black uppercase tracking-widest cursor-not-allowed">
                          <Lock className="w-3 h-3" />
                          Terkunci
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditClick(res)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                          title="Edit Penelitian"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteClick(res)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all"
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
                  className="px-6 py-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest"
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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              Menampilkan <span className="font-semibold text-gray-800 dark:text-zinc-200">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, researchList.length)}</span> dari <span className="font-semibold text-gray-800 dark:text-zinc-200">{researchList.length}</span> Penelitian
            </span>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-400">Limit:</span>
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
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-gray-300 dark:text-zinc-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        currentPage === p
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
