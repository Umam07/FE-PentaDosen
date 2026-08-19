import React from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Info, CalendarDays } from 'lucide-react';
import Pagination from '../Pagination';
import type { DocTableBaseProps } from './internal-documents.types';
import { formatTanggal } from './utils/formatting';

export default function BukuTable({
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
      
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
          <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Informasi Buku</th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Kategori Buku</th>
              <th className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Tanggal Terbit</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Dokumen</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Klasifikasi</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Poin</th>
              <th className="hidden sm:table-cell px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Penelitian Asal</th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {currentItems.map((doc, idx) => {
              const docDate = formatTanggal(doc.published_at);
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
                        <Book className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs lg:max-w-sm" title={doc.title}>
                          {doc.title}
                        </p>
                        {doc.status === 'Rejected' && doc.catatan && (
                          <div className="mt-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-lg border border-rose-200/60 dark:border-rose-900/40 w-fit">
                            Catatan: {doc.catatan}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block truncate max-w-[150px]" title={doc.category}>
                      {doc.category}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {docDate}
                  </td>
                  <td className="px-6 py-4">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" /> Lihat Dokumen
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Tidak Ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      doc.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40'
                        : doc.status === 'Rejected'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40'
                        : doc.status === 'Verified by Fakultas'
                        ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/40'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {doc.is_joint ? 'Buku Bersama' : 'Buku Mandiri'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs tabular-nums">
                      +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[11px] font-normal text-slate-500">Pts</span>
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    {doc.penelitian ? (
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px] block" title={doc.penelitian.judul_penelitian}>
                        {doc.penelitian.judul_penelitian}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
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
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {currentItems.map((doc, idx) => {
          const docDate = formatTanggal(doc.published_at);

          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-white dark:bg-slate-900">
              
              {/* Header: Title, Icon & Detail Trigger */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedDocForDetail(doc)}
                >
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 shrink-0 mt-0.5 border border-slate-200/60 dark:border-slate-700/60">
                    <Book className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {doc.title}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 text-slate-400" />
                      {docDate}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {doc.category && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700/60">
                    {doc.category}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                  {doc.is_joint ? 'Buku Bersama' : 'Buku Mandiri'}
                </span>
                {doc.penelitian && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[160px]">
                    {doc.penelitian.judul_penelitian}
                  </span>
                )}
              </div>

              {/* Rejection Feedback Note */}
              {doc.status === 'Rejected' && doc.catatan && (
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                  Catatan: {doc.catatan}
                </div>
              )}

              {/* Bottom Row: Status, File Link & Poin */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs border ${
                    doc.status === 'Approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40'
                      : doc.status === 'Rejected'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/40'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40'
                  }`}>
                    {doc.status}
                  </span>

                  {doc.file_url && doc.file_url !== '-' && (
                    <button
                      onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" /> File
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[11px] font-normal text-slate-500">Pts</span>
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

