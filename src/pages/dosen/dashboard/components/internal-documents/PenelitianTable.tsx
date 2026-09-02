import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Info, CalendarDays } from 'lucide-react';
import Pagination from '../Pagination';
import type { DocTableBaseProps } from './internal-documents.types';
import { formatTanggal, formatRupiah } from './utils/formatting';
import { getResearchSchemaIcon } from '../../../research/utils/researchIconMapper';

export default function PenelitianTable({
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted">
                Judul Penelitian
              </th>
              <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Program &amp; Skema
              </th>
              <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Tanggal Pelaksanaan
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Status
              </th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Dana
              </th>
              <th className="px-6 py-4 text-right sm:text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Poin KPI
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Dokumen
              </th>
              <th className="px-4 py-4 w-12 text-center text-xs font-semibold text-muted dark:text-on-dark-muted whitespace-nowrap">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {currentItems.map((doc, idx) => {
              const SchemaIcon = getResearchSchemaIcon(doc.program, doc.skema);
              return (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group"
                >
                  {/* 1. Judul */}
                  <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark flex-shrink-0">
                        <SchemaIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ink-heading dark:text-on-dark truncate max-w-xs lg:max-w-sm" title={doc.title}>
                          {doc.title}
                        </p>
                        {doc.status === 'Rejected' && doc.catatan && (
                          <div className="mt-1.5 text-[11px] font-semibold text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-2 py-0.5 rounded-lg border border-error-border dark:border-error/30 w-fit">
                            Catatan: {doc.catatan}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Program & Skema */}
                  <td className="hidden lg:table-cell px-6 py-4">
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      {doc.program || '-'}
                    </p>
                    <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">
                      {doc.skema || '-'}{doc.fokus ? ` • ${doc.fokus}` : ''}
                    </p>
                  </td>

                  {/* 3. Tanggal Pelaksanaan */}
                  <td className="hidden md:table-cell px-6 py-4 text-left">
                    <span className="text-xs font-mono text-muted dark:text-on-dark-muted">
                      {formatTanggal(doc.tahun_pelaksanaan)}
                    </span>
                  </td>

                  {/* 4. Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${
                      doc.status === 'Approved'
                        ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                        : doc.status === 'Rejected'
                        ? 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark border-error-border dark:border-error/30'
                        : doc.status === 'Verified by Fakultas'
                        ? 'bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/30'
                        : 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  {/* 5. Dana */}
                  <td className="hidden sm:table-cell px-6 py-4 text-left text-xs font-mono font-bold text-ink-heading dark:text-on-dark tabular-nums">
                    {formatRupiah(doc.dana_disetujui || 0)}
                  </td>

                  {/* 6. Poin KPI */}
                  <td className="px-6 py-4 text-right sm:text-left">
                    <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                      +{Math.round(Number(doc.awarded_points) || 0)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
                    </span>
                  </td>

                  {/* 7. Dokumen */}
                  <td className="px-6 py-4">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                        aria-label={`Lihat PDF untuk ${doc.title}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark text-xs font-semibold border border-hairline-light dark:border-hairline-dark transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
                    ) : (
                      <span className="text-xs text-muted dark:text-on-dark-muted">—</span>
                    )}
                  </td>

                  {/* 8. Detail */}
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      aria-label={`Lihat rincian detail ${doc.title}`}
                      className="p-1.5 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                      title="Lihat Rincian Detail"
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
          const SchemaIcon = getResearchSchemaIcon(doc.program, doc.skema);
          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
              
              {/* Header: Title, Icon & Detail Trigger */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedDocForDetail(doc)}
                >
                  <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg text-muted dark:text-on-dark-muted shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark">
                    <SchemaIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug">
                      {doc.title}
                    </p>
                    <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 text-muted" />
                      {formatTanggal(doc.tahun_pelaksanaan)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDocForDetail(doc)}
                  aria-label={`Lihat detail ${doc.title}`}
                  className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted shrink-0 hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark cursor-pointer"
                  title="Lihat Detail"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {doc.program && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft font-semibold border border-hairline-light dark:border-hairline-dark">
                    {doc.program}
                  </span>
                )}
                {doc.skema && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                    {doc.skema}
                  </span>
                )}
                {Number(doc.dana_disetujui || 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark font-mono font-bold border border-success-border dark:border-success/30">
                    {formatRupiah(doc.dana_disetujui)}
                  </span>
                )}
              </div>

              {/* Rejection Feedback Note */}
              {doc.status === 'Rejected' && doc.catatan && (
                <div className="text-xs font-semibold text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 p-2.5 rounded-xl border border-error-border dark:border-error/30">
                  Catatan: {doc.catatan}
                </div>
              )}

              {/* Bottom Row: Status, File Link & Poin */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs border ${
                    doc.status === 'Approved'
                      ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30'
                      : doc.status === 'Rejected'
                      ? 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark border-error-border dark:border-error/30'
                      : 'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                  }`}>
                    {doc.status}
                  </span>

                  {doc.file_url && doc.file_url !== '-' && (
                    <button
                      type="button"
                      onClick={() => setPreviewDoc({ fileUrl: doc.file_url!, title: doc.title, category: doc.category })}
                      aria-label={`Lihat file ${doc.title}`}
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

