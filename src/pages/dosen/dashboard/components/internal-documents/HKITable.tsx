import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Info, CalendarDays } from 'lucide-react';
import { HKI_CATEGORIES } from '../../../hki/constants';
import Pagination from '../Pagination';
import type { DocTableBaseProps } from './internal-documents.types';
import { formatTanggal } from './utils/formatting';

export default function HKITable({
  filteredDocs,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  setSelectedDocForDetail,
  setPreviewDoc,
  isPublic = false,
}: DocTableBaseProps) {
  const currentItems = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Informasi HKI</th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Kategori HKI</th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Tanggal Perolehan</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Dokumen</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Status</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Klasifikasi</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Poin</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Penelitian Asal</th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
            {currentItems.map((doc, idx) => {
              const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
              const DocIcon = catConfig ? catConfig.icon : Shield;
              const docDate = formatTanggal(doc.published_at);
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
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
                  <td className="hidden md:table-cell px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {docDate}
                  </td>
                  <td className="px-6 py-4">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
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
                      {doc.status}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                      {doc.is_joint ? 'HKI Bersama' : 'HKI Mandiri'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                      +{Math.round(Number(doc.awarded_points) || 0)} pts
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    {doc.penelitian ? (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px] block" title={doc.penelitian.judul_penelitian}>
                        {doc.penelitian.judul_penelitian}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
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

      {/* ── 2. Mobile Responsive Stack Cards View (< md) ── */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-zinc-800">
        {currentItems.map((doc, idx) => {
          const catConfig = HKI_CATEGORIES.find(c => c.id === doc.category);
          const DocIcon = catConfig ? catConfig.icon : Shield;
          const docDate = formatTanggal(doc.published_at);

          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-white dark:bg-zinc-900">
              
              {/* Header: Title, Icon & Detail Trigger */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedDocForDetail(doc)}
                >
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 shrink-0 mt-0.5">
                    <DocIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight line-clamp-2 leading-snug hover:text-primary-600">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-slate-400" />
                        {docDate}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 hover:bg-slate-200"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {doc.category && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    {doc.category}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200/50 dark:border-slate-700/50">
                  {doc.is_joint ? 'HKI Bersama' : 'HKI Mandiri'}
                </span>
                {doc.penelitian && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 truncate max-w-[160px]">
                    {doc.penelitian.judul_penelitian}
                  </span>
                )}
              </div>

              {/* Rejection Feedback Note */}
              {doc.status === 'Rejected' && doc.catatan && (
                <div className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                  Catatan: {doc.catatan}
                </div>
              )}

              {/* Bottom Row: Status, File Link & Poin */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider ${
                    doc.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      : doc.status === 'Rejected'
                      ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                      : 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                  }`}>
                    {doc.status}
                  </span>

                  {doc.file_url && doc.file_url !== '-' && (
                    <button
                      onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider hover:bg-blue-100"
                    >
                      <FileText className="w-3 h-3" /> File
                    </button>
                  )}
                </div>

                <div className="text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                  +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[10px] font-bold text-slate-400">pts</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {!isPublic && (
        <Pagination
          totalItems={filteredDocs.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      )}
    </div>
  );
}
