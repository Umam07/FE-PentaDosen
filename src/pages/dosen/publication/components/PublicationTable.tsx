import React from 'react';
import { 
  FileText, Upload, CheckCircle, XCircle, Clock, 
  Info, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PublicationTableProps {
  isTableLoading: boolean;
  currentDocuments: any[];
  filteredDocuments: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (doc: { fileUrl: string; title: string; category: string } | null) => void;
  uploadingPdfId: number | null;
  handleUploadPdf: (e: React.ChangeEvent<HTMLInputElement>, id: number) => Promise<void>;
}

export default function PublicationTable({
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
  handleUploadPdf
}: PublicationTableProps) {
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
        <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Publikasi</h3>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
          <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
            <tr>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Judul Publikasi</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
              <th className="px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin KPI</th>
              <th className="px-4 py-4 w-12 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Detail</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
            {isTableLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                  <td className="px-4 lg:px-8 py-4 lg:py-5">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="h-8 w-8 lg:h-9 lg:w-9 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                      <div className="space-y-2 w-full max-w-[120px] sm:max-w-[200px]">
                        <div className="h-3 lg:h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded"></div>
                        <div className="h-2 lg:h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                  <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                  <td className="px-4 lg:px-8 py-4 flex justify-end sm:justify-start"><div className="h-6 lg:h-8 w-10 lg:w-16 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div></td>
                  <td className="px-4 py-4 w-12"><div className="h-4 w-4 bg-gray-100 dark:bg-zinc-800 rounded mx-auto"></div></td>
                </tr>
              ))
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-primary-50/10 dark:hover:bg-primary-900/5 transition-colors group border-b border-gray-50 dark:border-zinc-800 last:border-0">
                  {/* Informasi Publikasi */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                      </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-md">
                        <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                          <span>{doc.published_at ? new Date(doc.published_at).getFullYear() : '-'} • </span>
                          {doc.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Dokumen */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                      </button>
                    ) : (
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap">
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

                  {/* Status */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest whitespace-nowrap ${
                      doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30' :
                      doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900/30' :
                      doc.status === 'Verified by Fakultas' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/30' :
                      'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-900/30'
                    }`}>
                      {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      {doc.status === 'Rejected' && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      {(doc.status === 'Pending' || doc.status === 'Verified by Fakultas') && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      <span className="hidden sm:inline">{doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : doc.status}</span>
                      <span className="sm:hidden">{doc.status === 'Approved' ? 'OK' : doc.status === 'Rejected' ? 'NO' : doc.status === 'Verified by Fakultas' ? 'V-FAK' : 'Wait'}</span>
                    </div>
                  </td>

                  {/* Poin */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter whitespace-nowrap">
                      +{doc.awarded_points} PTS
                    </span>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 lg:px-8 py-16 text-center">
                  <div className="flex flex-col items-center">
                     <FileText className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                     <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">Inventory Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Pagination Controls === */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDocuments.length)} of {filteredDocuments.length} entries
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
