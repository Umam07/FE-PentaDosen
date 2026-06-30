import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Info } from 'lucide-react';
import Pagination from '../Pagination';

interface JurnalTableProps {
  filteredDocs: any[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (preview: { fileUrl: string; title: string; category: string } | null) => void;
}

export default function JurnalTable({
  filteredDocs,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setSelectedDocForDetail,
  setPreviewDoc,
}: JurnalTableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-800/30">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Judul Publikasi</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Poin KPI</th>
              <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDocs
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((doc: any, idx: number) => {
                const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';
                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-primary-50/20 dark:hover:bg-primary-900/10 transition-colors group"
                  >
                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                            {doc.title}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            <span>{docYear} • </span>
                            {doc.category}
                          </p>
                          {(doc.quartile || doc.author_role) && (
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {doc.quartile && (
                                <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase rounded border border-orange-100/50 dark:border-orange-900/20">
                                  {doc.quartile}
                                </span>
                              )}
                              {doc.author_role && (
                                <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-100/50 dark:border-indigo-900/20">
                                  {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                                </span>
                              )}
                              {doc.is_hyperauthor && (
                                <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded border border-red-100/50 dark:border-red-900/20">
                                  Hyper
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.file_url && doc.file_url !== '-' ? (
                        <button
                          onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tidak Ada File</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        doc.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : doc.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                          : doc.status === 'Verified by Fakultas'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-emerald-900/30'
                          : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                      }`}>
                        {doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : (doc.status || 'Pending')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                        +{Math.round(Number(doc.awarded_points) || 0)} PTS
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDocForDetail(doc)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center mx-auto"
                        title="Lihat Detail"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Pagination 
        totalItems={filteredDocs.length} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}
