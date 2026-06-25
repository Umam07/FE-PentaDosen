import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Archive, Link, Info, FileText } from 'lucide-react';
import { HKI_CATEGORIES } from '../../../hki/constants';
import Pagination from '../Pagination';

interface HKITableProps {
  filteredDocs: any[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (preview: { fileUrl: string; title: string; category: string } | null) => void;
}

export default function HKITable({
  filteredDocs,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setSelectedDocForDetail,
  setPreviewDoc,
}: HKITableProps) {
  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-800/30">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Informasi HKI</th>
              <th className="hidden lg:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Kategori HKI</th>
              <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Tahun</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Status</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Klasifikasi</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Poin</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
              <th className="px-6 py-4 w-12 text-center text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-[0.15em]">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDocs
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((doc: any, idx: number) => {
                const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
                const DocIcon = catConfig ? catConfig.icon : Shield;
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
                          <DocIcon className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate max-w-xs lg:max-w-sm" title={doc.title}>
                            {doc.title}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            <span className="lg:hidden">{docYear} • </span>
                            ID: {doc.id_dokumen || ('INTERNAL-' + doc.id)}
                          </p>
                          {doc.status === 'Rejected' && doc.catatan && (
                            <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                              Catatan Umpan Balik: {doc.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block truncate max-w-[150px]" title={doc.category}>
                        {doc.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 font-mono italic">
                      {docYear}
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
                    <td className="hidden sm:table-cell px-6 py-4">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-xl border border-primary-100">
                          <Sparkles className="w-3 h-3" /> KPI
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-100">
                          <Archive className="w-3 h-3" /> Arsip
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-primary-600 whitespace-nowrap">
                        +{Number(doc.awarded_points) || 0} PTS
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      {doc.penelitian ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 max-w-[150px] truncate" title={doc.penelitian.judul_penelitian}>
                          <Link className="w-2.5 h-2.5 shrink-0" />
                          <span className="text-[9px] font-black uppercase tracking-tight truncate">
                            {doc.penelitian.judul_penelitian}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">-</span>
                      )}
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
