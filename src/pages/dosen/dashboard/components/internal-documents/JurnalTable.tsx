import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Info, CalendarDays } from 'lucide-react';
import Pagination from '../Pagination';
import type { DocTableBaseProps } from './internal-documents.types';
import { formatTanggal } from './utils/formatting';

export default function JurnalTable({
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
    <>
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs">
          <thead className="bg-surface-light-raised/70 dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Judul Publikasi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Status</th>
              <th className="px-6 py-4 text-right sm:text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Poin KPI</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">Dokumen</th>
              <th className="px-4 py-4 w-12 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {currentItems.map((doc, idx) => {
              const docDate = formatTanggal(doc.published_at);
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group"
                >
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ink-heading dark:text-on-dark truncate max-w-xs lg:max-w-sm" title={doc.title}>
                          {doc.title}
                        </p>
                        <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                          <span>{docDate} • </span>
                          {doc.category}
                        </p>
                        {(doc.quartile || doc.author_role) && (
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {doc.quartile && (
                              <span className="px-1.5 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-[10px] font-mono font-semibold rounded border border-hairline-light dark:border-hairline-dark">
                                {doc.quartile}
                              </span>
                            )}
                            {doc.author_role && (
                              <span className="px-1.5 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-[10px] font-semibold rounded border border-hairline-light dark:border-hairline-dark">
                                {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                              </span>
                            )}
                            {doc.is_hyperauthor && (
                              <span className="px-1.5 py-0.5 bg-danger-soft dark:bg-danger/20 text-danger dark:text-danger-on-dark text-[10px] font-semibold rounded border border-danger-border dark:border-danger/30">
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
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark text-xs font-semibold border border-hairline-light dark:border-hairline-dark transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
                    ) : (
                      <span className="text-xs text-muted dark:text-on-dark-muted">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                      doc.status === 'Approved'
                        ? 'bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                        : doc.status === 'Rejected'
                        ? 'bg-danger-soft dark:bg-danger/20 text-danger dark:text-danger-on-dark border-danger-border dark:border-danger/30'
                        : doc.status === 'Verified by Fakultas'
                        ? 'bg-accent-soft dark:bg-accent/10 text-accent dark:text-accent-on-dark border-accent-border dark:border-accent/30'
                        : 'bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-ink-heading dark:text-on-dark text-xs tabular-nums">
                      +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
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
      <div className="block md:hidden divide-y divide-hairline-light dark:divide-hairline-dark">
        {currentItems.map((doc, idx) => {
          const docDate = formatTanggal(doc.published_at);
          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
              
              {/* Header: Title, Icon & Detail Trigger */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedDocForDetail(doc)}
                >
                  <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg text-muted dark:text-on-dark-muted shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug">
                      {doc.title}
                    </p>
                    <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5 flex items-center gap-1.5">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-muted" />
                        {docDate}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted shrink-0 hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chips / Badges Row */}
              {(doc.quartile || doc.author_role || doc.is_hyperauthor) && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {doc.quartile && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-mono font-semibold border border-hairline-light dark:border-hairline-dark">
                      {doc.quartile}
                    </span>
                  )}
                  {doc.author_role && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft font-semibold border border-hairline-light dark:border-hairline-dark">
                      {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                    </span>
                  )}
                  {doc.is_hyperauthor && (
                    <span className="px-2 py-0.5 rounded-md bg-danger-soft dark:bg-danger/20 text-danger dark:text-danger-on-dark font-semibold border border-danger-border dark:border-danger/30">
                      Hyperauthor
                    </span>
                  )}
                </div>
              )}

              {/* Rejection Feedback Note */}
              {doc.status === 'Rejected' && doc.catatan && (
                <div className="text-xs font-semibold text-danger dark:text-danger-on-dark bg-danger-soft dark:bg-danger/20 p-2.5 rounded-xl border border-danger-border dark:border-danger/30">
                  Catatan: {doc.catatan}
                </div>
              )}

              {/* Bottom Row: Status, File Link & Poin */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs border ${
                    doc.status === 'Approved'
                      ? 'bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                      : doc.status === 'Rejected'
                      ? 'bg-danger-soft dark:bg-danger/20 text-danger dark:text-danger-on-dark border-danger-border dark:border-danger/30'
                      : 'bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                  }`}>
                    {doc.status}
                  </span>

                  {doc.file_url && doc.file_url !== '-' && (
                    <button
                      onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-xs font-semibold border border-hairline-light dark:border-hairline-dark hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                    >
                      <FileText className="w-3 h-3" /> File
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                  +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
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
    </>
  );
}

