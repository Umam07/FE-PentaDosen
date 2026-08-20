import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Check, Globe } from 'lucide-react';
import { calculateScopusBreakdown } from '../utils/calculations';
import { externalDocumentsService } from '../services/externalDocumentsService';

interface ScopusTableProps {
  documents: any[];
  isAlsoScholarCheck: (title: string) => boolean;
  onRefresh?: () => void;
  isPublic?: boolean;
}

export default function ScopusTable({
  documents,
  isAlsoScholarCheck,
  onRefresh,
  isPublic = false,
}: ScopusTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const toggleRow = (id: string | number) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const handleToggleCorresponding = async (docId: number, value: boolean) => {
    setUpdatingId(docId);
    try {
      const success = await externalDocumentsService.updateCorrespondingStatus(docId, value);
      if (success && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error updating corresponding status:', err);
    } finally {
      setUpdatingId(null);
    }
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
                Kategori &amp; Peran
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-body dark:text-on-dark-soft">
                Tahun &amp; Sitasi
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-body dark:text-on-dark-soft">
                Poin KPI
              </th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-semibold text-body dark:text-on-dark-soft">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {documents.map((doc, idx) => {
              const bd = calculateScopusBreakdown(doc);
              const isAlsoScholar = isAlsoScholarCheck(doc.title);
              const isExpanded = expandedRow === (doc.id || idx);
              const subtypeLabel = bd.isArticle ? 'Article' : (doc.subtype_description || doc.subtype || 'Non-Article');
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
                    {/* Informasi Publikasi */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark flex-shrink-0 mt-0.5">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-ink-heading dark:text-on-dark hover:underline transition-colors line-clamp-2 block"
                            title={doc.title}
                          >
                            {doc.title}
                          </a>

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

                    {/* Kategori & Peran */}
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="space-y-1">
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
                        <p className="text-xs text-muted dark:text-on-dark-muted font-medium">
                          {bd.role} {bd.totalAuthors > 1 && `(${bd.authorOrder ? `${bd.authorOrder}/` : ''}${bd.totalAuthors} Penulis)`}
                        </p>
                        {isAlsoScholar && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark text-[10px] font-semibold border border-success-border dark:border-success/30">
                            ✓ Google Scholar
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tahun & Sitasi */}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark font-mono font-semibold text-xs border border-hairline-light dark:border-hairline-dark">
                          {doc.year || '—'}
                        </span>
                        <p className="text-xs text-muted dark:text-on-dark-muted font-mono tabular-nums">
                          {bd.citations} Sitasi
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {!isPublic && showCorrespondingControls ? (
                        !bd.isCorrespondingConfirmed ? (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 rounded-lg text-xs font-semibold whitespace-nowrap">
                              <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                              Perlu Konfirmasi
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleCorresponding(doc.id, true)}
                                disabled={updatingId === doc.id}
                                className="px-2 py-1 bg-success hover:bg-success-dark text-on-ink rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                              >
                                {updatingId === doc.id ? '...' : 'Koresponden'}
                              </button>
                              <button
                                onClick={() => handleToggleCorresponding(doc.id, false)}
                                disabled={updatingId === doc.id}
                                className="px-2 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                              >
                                {updatingId === doc.id ? '...' : 'Bukan'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-soft dark:bg-success/10 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30">
                            <Check className="w-3 h-3" />
                            {bd.isCorresponding ? 'Corresponding' : 'Non-Corresponding'}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                          Tersinkron
                        </span>
                      )}
                    </td>

                    {/* Poin KPI */}
                    <td className="px-6 py-4 text-right">
                      <div className="space-y-1">
                        <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
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

                    {/* Aksi */}
                    <td className="px-6 py-4 text-center">
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                        title="Buka publikasi di Scopus"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>

                  {/* Expandable Breakdown Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border-b border-hairline-light dark:border-hairline-dark">
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
              </div>

              {/* Status and Action Buttons */}
              {!isPublic && showCorrespondingControls && !bd.isCorrespondingConfirmed && (
                <div className="p-3 rounded-2xl bg-warning-soft dark:bg-warning/20 border border-warning-border dark:border-warning/30 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-warning dark:text-warning-on-dark flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Konfirmasi Penulis:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleCorresponding(doc.id, true)}
                      disabled={updatingId === doc.id}
                      className="px-2.5 py-1 bg-success hover:bg-success-dark text-on-ink rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      Koresponden
                    </button>
                    <button
                      onClick={() => handleToggleCorresponding(doc.id, false)}
                      disabled={updatingId === doc.id}
                      className="px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      Bukan
                    </button>
                  </div>
                </div>
              )}

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

    </div>
  );
}

