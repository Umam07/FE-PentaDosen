import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Info } from 'lucide-react';
import Pagination from '../Pagination';
import type { DocTableBaseProps } from './internal-documents.types';
import { formatTanggal } from './utils/formatting';

export default function DefaultCardList({
  filteredDocs,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
  setSelectedDocForDetail,
  setPreviewDoc,
  isPublic = false,
}: DocTableBaseProps) {
  return (
    <>
      <div className="p-5 grid grid-cols-1 gap-3.5">
        {filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc, idx) => {
          const dateStr = doc.published_at || doc.tahun_pelaksanaan;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center border border-hairline-light dark:border-hairline-dark shrink-0">
                <span className="text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none tabular-nums">
                  {Math.round(Number(doc.awarded_points) || 0)}
                </span>
                <span className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase mt-0.5">
                  Pts
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                    {doc.category}
                  </span>
                  <span className="text-xs text-muted dark:text-on-dark-muted flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                    {formatTanggal(dateStr)}
                  </span>
                </div>
                <h3
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-1 cursor-pointer hover:underline transition-colors"
                >
                  {doc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[10px] text-muted dark:text-on-dark-muted">
                    ID Dokumen
                  </span>
                  <span className="text-xs font-mono font-semibold text-muted dark:text-on-dark-muted">
                    {doc.id_dokumen || 'INT-' + doc.id}
                  </span>
                </div>
                {doc.file_url && doc.file_url !== '-' ? (
                  <button
                    onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                    className="p-2 bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark transition-all flex items-center justify-center cursor-pointer"
                    title="Lihat Dokumen"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="p-2 bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark transition-all flex items-center justify-center cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
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
    </>
  );
}

