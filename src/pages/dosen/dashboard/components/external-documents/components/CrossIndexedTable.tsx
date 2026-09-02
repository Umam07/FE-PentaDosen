import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, Layers, Check } from 'lucide-react';
import { calculateScopusBreakdown } from '../utils/calculations';

interface CrossIndexedTableProps {
  documents: any[];
  scopusPublications?: any[];
  isPublic?: boolean;
  children?: React.ReactNode;
}

export default function CrossIndexedTable({
  documents,
  scopusPublications = [],
  isPublic = false,
  children,
}: CrossIndexedTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);

  const toggleRow = (id: string | number) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const normalizeTitle = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    <>
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs">
          <thead className="bg-surface-light-raised/70 dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                Judul Publikasi
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                <div className="flex flex-col items-start">
                  <span>Kategori</span>
                  <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Skema Deduplikasi</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                <div className="flex flex-col items-start">
                  <span>Tahun</span>
                  <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Sitasi</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-body dark:text-on-dark-soft">
                Poin KPI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {documents.map((doc, idx) => {
              const scopusDoc = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
              const bd = calculateScopusBreakdown(scopusDoc || doc);
              const isExpanded = expandedRow === (doc.id || idx);
              const linkUrl = doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`;

              return (
                <React.Fragment key={doc.id || idx}>
                  <motion.tr
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-surface-light-raised/60 dark:hover:bg-surface-dark-elevated/30 transition-colors group"
                  >
                    {/* 1. Judul Publikasi */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark flex-shrink-0 mt-0.5">
                          <Layers className="w-4 h-4 text-ink dark:text-on-dark" />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-ink-heading dark:text-on-dark hover:text-accent dark:hover:text-accent-on-dark transition-colors line-clamp-2 inline-flex items-center gap-1.5 group/link"
                            title={doc.title}
                          >
                            <span>{doc.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted group-hover/link:text-accent dark:group-hover/link:text-accent-on-dark shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5 italic truncate max-w-[280px]">
                            {doc.source_name || doc.journal || 'Scopus & Scholar'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Kategori & Deduplikasi */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark text-[10px] font-semibold rounded-md border border-success-border dark:border-success/30">
                            Scopus &amp; Scholar
                          </span>
                          {bd.q && bd.q !== 'None' && (
                            <span className="px-2 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-[10px] font-mono font-bold rounded-md border border-hairline-light dark:border-hairline-dark">
                              {bd.q}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-body dark:text-on-dark-soft font-medium">
                          {bd.role} {bd.totalAuthors > 0 && `(${bd.totalAuthors} Penulis)`}
                        </span>
                      </div>
                    </td>

                    {/* 3. Tahun & Sitasi */}
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                          {doc.year || '—'}
                        </span>
                        <span className="text-xs text-muted dark:text-on-dark-muted font-mono tabular-nums">
                          {bd.citations} Sitasi
                        </span>
                      </div>
                    </td>

                    {/* 4. Status */}
                    <td className="px-6 py-4 align-top">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30 whitespace-nowrap">
                        <Check className="w-3.5 h-3.5 text-success-dark dark:text-success-on-dark shrink-0" />
                        Approved (Scopus Priority)
                      </span>
                    </td>

                    {/* 5. Poin KPI & Detail */}
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="font-mono font-bold text-ink-heading dark:text-on-dark text-xs tabular-nums">
                          +{Math.round(bd.totalPoints)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
                        </span>
                        <button
                          onClick={() => toggleRow(doc.id || idx)}
                          className="flex items-center justify-end gap-1 ml-auto text-[11px] font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
                          title={isExpanded ? 'Tutup Rincian' : 'Lihat Rincian Poin Scopus'}
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
                                  Rincian Poin Scopus (Prioritas Lebih Tinggi)
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
          const scopusDoc = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
          const bd = calculateScopusBreakdown(scopusDoc || doc);
          const isExpanded = expandedRow === (doc.id || idx);
          const linkUrl = doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`;

          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
              
              {/* Header: Title, Icon & Detail Trigger */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => toggleRow(doc.id || idx)}
                >
                  <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg text-muted dark:text-on-dark-muted shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark">
                    <Layers className="w-4 h-4 text-ink dark:text-on-dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug">
                      {doc.title}
                    </p>
                    {(doc.source_name || doc.journal) && (
                      <p className="text-[11px] text-muted dark:text-on-dark-muted italic mt-0.5 truncate">
                        {doc.source_name || doc.journal}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleRow(doc.id || idx)}
                  className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted shrink-0 hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark cursor-pointer"
                  title="Lihat Rincian"
                >
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark font-semibold border border-success-border dark:border-success/30">
                  Scopus &amp; Scholar
                </span>
                {bd.q && bd.q !== 'None' && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold font-mono border border-hairline-light dark:border-hairline-dark">
                    {bd.q}
                  </span>
                )}
                {doc.year && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark font-mono font-semibold border border-hairline-light dark:border-hairline-dark">
                    {doc.year}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted font-mono tabular-nums border border-hairline-light dark:border-hairline-dark">
                  {bd.citations} Sitasi
                </span>
              </div>

              {/* Bottom Row: Status, File Link & Score */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-xs border bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30">
                    <Check className="w-3 h-3" /> Approved
                  </span>

                  <a
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-xs font-semibold border border-hairline-light dark:border-hairline-dark hover:bg-surface-light dark:hover:bg-surface-dark cursor-pointer"
                  >
                    <Layers className="w-3 h-3 text-ink dark:text-on-dark" /> Publikasi
                  </a>
                </div>

                <div className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                  +{Math.round(bd.totalPoints)} <span className="text-[11px] font-normal text-muted dark:text-on-dark-muted">Pts</span>
                </div>
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
    </>
  );
}

