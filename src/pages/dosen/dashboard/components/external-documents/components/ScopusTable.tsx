import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Check, Globe } from 'lucide-react';
import { calculateScopusBreakdown, formatScopusSubtype } from '../utils/calculations';

interface ScopusTableProps {
  documents: any[];
  isAlsoScholarCheck: (title: string) => boolean;
  onRefresh?: () => void;
  isPublic?: boolean;
  children?: React.ReactNode;
}

export default function ScopusTable({
  documents,
  isAlsoScholarCheck,
  onRefresh,
  isPublic = false,
  children,
}: ScopusTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);

  const toggleRow = (id: string | number) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
      
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                Informasi Publikasi
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                <div className="flex flex-col items-start">
                  <span>Kategori</span>
                  <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Peran</span>
                </div>
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                <div className="flex flex-col items-start">
                  <span>Tahun</span>
                  <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Sitasi</span>
                </div>
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-body dark:text-on-dark-soft">
                Poin KPI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {documents.map((doc, idx) => {
              const bd = calculateScopusBreakdown(doc);
              const isAlsoScholar = isAlsoScholarCheck(doc.title);
              const isExpanded = expandedRow === (doc.id || idx);
              const subtypeLabel = bd.isArticle ? 'Article' : formatScopusSubtype(doc.subtype, doc.subtype_description);
              const showCorrespondingControls = bd.isArticle && bd.totalAuthors > 1;
              const linkUrl = doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`;

              return (
                <React.Fragment key={doc.id || idx}>
                  <motion.tr
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group"
                  >
                    {/* Informasi Publikasi (Clickable Cell) */}
                    <td
                      className="px-6 py-4 cursor-pointer group/cell text-left align-top"
                      onClick={() => window.open(linkUrl, '_blank', 'noopener,noreferrer')}
                      title="Buka publikasi di Scopus"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark flex-shrink-0 group-hover/cell:text-ink-heading dark:group-hover/cell:text-on-dark group-hover/cell:border-ink-heading/30 dark:group-hover/cell:border-on-dark/30 transition-colors">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
                          <div className="flex items-start gap-1.5">
                            <span
                              className="font-bold text-ink-heading dark:text-on-dark group-hover/cell:underline transition-colors line-clamp-2 block"
                            >
                              {doc.title}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted group-hover/cell:text-ink-heading dark:group-hover/cell:text-on-dark shrink-0 opacity-0 group-hover/cell:opacity-100 transition-opacity mt-0.5" />
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted dark:text-on-dark-muted">
                            {doc.source_name || doc.journal ? (
                              <span className="italic truncate max-w-[240px]">
                                {doc.source_name || doc.journal}
                              </span>
                            ) : null}
                            {doc.authors && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[180px]">{doc.authors}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori & Peran (Atas & Bawah) */}
                    <td className="hidden lg:table-cell px-6 py-4 text-left align-top">
                      <div className="flex flex-col items-start gap-1.5">
                        {/* Kategori (Atas) */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {bd.q && bd.q !== 'None' ? (
                            <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold font-mono text-[10px] border border-hairline-light dark:border-hairline-dark">
                              {bd.q}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted font-medium text-[10px] border border-hairline-light dark:border-hairline-dark">
                              Non-Q
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft font-semibold text-[10px] border border-hairline-light dark:border-hairline-dark">
                            {subtypeLabel}
                          </span>
                        </div>
                        {/* Peran (Bawah) */}
                        <div className="flex flex-col gap-0.5">
                          <p className="text-xs text-body dark:text-on-dark-soft font-medium">
                            {bd.role} {bd.totalAuthors > 1 && `(${bd.authorOrder ? `${bd.authorOrder}/` : ''}${bd.totalAuthors} Penulis)`}
                          </p>
                          {isAlsoScholar && (
                            <span className="inline-flex items-center self-start px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark text-[10px] font-semibold border border-success-border dark:border-success/30 mt-0.5">
                              ✓ Google Scholar
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tahun & Sitasi (Atas & Bawah) */}
                    <td className="px-6 py-4 text-left align-top">
                      <div className="flex flex-col items-start gap-1.5">
                        {/* Tahun (Atas) */}
                        <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                          {doc.year || '—'}
                        </span>
                        {/* Sitasi (Bawah) */}
                        <p className="text-xs text-muted dark:text-on-dark-muted font-mono tabular-nums">
                          {bd.citations} Sitasi
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-left align-top">
                      {!isPublic && showCorrespondingControls && !bd.isCorrespondingConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 rounded-lg text-xs font-semibold whitespace-nowrap">
                          <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                          Perlu Konfirmasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30 whitespace-nowrap">
                          <Check className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                    </td>

                    {/* Poin KPI */}
                    <td className="px-6 py-4 text-right align-top">
                      <div className="flex flex-col items-end gap-1.5 text-right">
                        <span className="block text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                          +{Math.round(bd.totalPoints)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
                        </span>
                        <button
                          onClick={() => toggleRow(doc.id || idx)}
                          className="flex items-center justify-end gap-1 ml-auto text-xs font-semibold text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Tutup' : 'Rincian'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>

                  {/* Expandable Breakdown Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark space-y-3">
                              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-2">
                                <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark">
                                  Rincian Perhitungan Poin SINTA (Scopus)
                                </h4>
                                <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                                  Total: {Math.round(bd.totalPoints)} Pts
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                                  <span className="block text-xs text-muted dark:text-on-dark-muted">Base Score ({bd.q})</span>
                                  <span className="font-mono font-bold text-ink-heading dark:text-on-dark">{bd.basePoints} pts</span>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                                  <span className="block text-xs text-muted dark:text-on-dark-muted">Bobot Peran</span>
                                  <span className="font-bold text-ink-heading dark:text-on-dark">{bd.pctStr || '-'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                                  <span className="block text-xs text-muted dark:text-on-dark-muted">Skenario Penilaian</span>
                                  <span className="font-semibold text-ink-heading dark:text-on-dark">{bd.detailStr || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 2. Mobile Responsive Stack Cards View (< md) ── */}
      <div className="block md:hidden divide-y divide-hairline-light dark:divide-hairline-dark">
        {documents.map((doc, idx) => {
          const bd = calculateScopusBreakdown(doc);
          const isAlsoScholar = isAlsoScholarCheck(doc.title);
          const isExpanded = expandedRow === (doc.id || idx);
          const subtypeLabel = bd.isArticle ? 'Article' : (doc.subtype_description || doc.subtype || 'Non-Article');
          const showCorrespondingControls = bd.isArticle && bd.totalAuthors > 1;
          const linkUrl = doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`;

          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
              
              {/* Header: Title & External Link */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg text-muted dark:text-on-dark-muted shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug hover:underline"
                    >
                      {doc.title}
                    </a>
                    {(doc.source_name || doc.journal) && (
                      <p className="text-[11px] text-muted dark:text-on-dark-muted italic mt-0.5 truncate">
                        {doc.source_name || doc.journal}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted shrink-0 hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark cursor-pointer"
                  title="Buka di Scopus"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {bd.q && bd.q !== 'None' ? (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold font-mono border border-hairline-light dark:border-hairline-dark">
                    {bd.q}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted font-medium border border-hairline-light dark:border-hairline-dark">
                    Non-Q
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft font-semibold border border-hairline-light dark:border-hairline-dark">
                  {subtypeLabel}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft font-semibold border border-hairline-light dark:border-hairline-dark">
                  {bd.role}
                </span>
                {doc.year && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark font-mono font-semibold border border-hairline-light dark:border-hairline-dark">
                    {doc.year}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted font-mono tabular-nums border border-hairline-light dark:border-hairline-dark">
                  {bd.citations} Sitasi
                </span>
                {isAlsoScholar && (
                  <span className="px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark font-semibold border border-success-border dark:border-success/30">
                    ✓ Scholar
                  </span>
                )}
                {!isPublic && showCorrespondingControls && !bd.isCorrespondingConfirmed ? (
                  <span className="px-2 py-0.5 rounded-md bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark font-semibold border border-warning-border dark:border-warning/30 inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Perlu Konfirmasi
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark font-semibold border border-success-border dark:border-success/30 inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Approved
                  </span>
                )}
              </div>

              {/* Bottom Row: Score & Detail Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs">
                  <span className="text-muted dark:text-on-dark-muted">Poin SINTA: </span>
                  <strong className="text-ink-heading dark:text-on-dark font-bold font-mono tabular-nums">
                    +{Math.round(bd.totalPoints)} Pts
                  </strong>
                </div>

                <button
                  onClick={() => toggleRow(doc.id || idx)}
                  className="flex items-center gap-1 text-xs font-semibold text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark py-1 px-2 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated cursor-pointer"
                >
                  <span>{isExpanded ? 'Tutup Rincian' : 'Lihat Rincian'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Mobile Expandable Breakdown Box */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2"
                  >
                    <div className="p-3 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark space-y-2 text-xs">
                      <div className="flex justify-between border-b border-hairline-light dark:border-hairline-dark pb-1.5">
                        <span className="text-muted dark:text-on-dark-muted">Base Score ({bd.q}):</span>
                        <strong className="font-mono text-ink-heading dark:text-on-dark">{bd.basePoints} pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-hairline-light dark:border-hairline-dark pb-1.5">
                        <span className="text-muted dark:text-on-dark-muted">Bobot Peran:</span>
                        <strong className="text-ink-heading dark:text-on-dark">{bd.pctStr || '-'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted dark:text-on-dark-muted">Skenario:</span>
                        <strong className="text-ink-heading dark:text-on-dark">{bd.detailStr || '-'}</strong>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

