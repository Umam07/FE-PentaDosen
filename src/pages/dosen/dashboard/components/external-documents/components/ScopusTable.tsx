import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, AlertTriangle, Check, Globe } from 'lucide-react';
import { calculateScopusBreakdown } from '../utils/calculations';
import { externalDocumentsService } from '../services/externalDocumentsService';
import PointBreakdownBox from '../../../../publication/components/PointBreakdownBox';

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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Informasi Publikasi
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Kategori &amp; Peran
              </th>
              <th className="hidden md:table-cell px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Tahun &amp; Sitasi
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Poin KPI
              </th>
              <th className="px-6 py-3.5 w-12 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
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
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Informasi Publikasi */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0 mt-0.5">
                          <Globe className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 block"
                            title={doc.title}
                          >
                            {doc.title}
                          </a>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
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

                          {/* Mobile info badges */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2 lg:hidden">
                            {bd.q && bd.q !== 'None' && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold text-[9px] border border-orange-200/50">
                                {bd.q}
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[9px]">
                              {bd.role}
                            </span>
                            {isAlsoScholar && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[9px] border border-emerald-200/50">
                                ✓ Scholar
                              </span>
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
                            <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-extrabold text-[10px] border border-orange-200/60 dark:border-orange-900/40">
                              {bd.q}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium text-[10px]">
                              Non-Q
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                            {subtypeLabel}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {bd.role} {bd.totalAuthors > 1 && `(${bd.authorOrder ? `${bd.authorOrder}/` : ''}${bd.totalAuthors} Penulis)`}
                        </p>
                        {isAlsoScholar && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-200/50">
                            ✓ Terindeks Google Scholar
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tahun & Sitasi */}
                    <td className="hidden md:table-cell px-6 py-4 text-center">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                          {doc.year || '—'}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium tabular-nums">
                          {bd.citations} Sitasi
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {!isPublic && showCorrespondingControls ? (
                        !bd.isCorrespondingConfirmed ? (
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-[10px] font-bold whitespace-nowrap">
                              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                              Perlu Konfirmasi
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleCorresponding(doc.id, true)}
                                disabled={updatingId === doc.id}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold transition-all disabled:opacity-50"
                              >
                                {updatingId === doc.id ? '...' : 'Koresponden'}
                              </button>
                              <button
                                onClick={() => handleToggleCorresponding(doc.id, false)}
                                disabled={updatingId === doc.id}
                                className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded text-[9px] font-bold transition-all disabled:opacity-50"
                              >
                                {updatingId === doc.id ? '...' : 'Bukan'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                            <Check className="w-3 h-3" />
                            {bd.isCorresponding ? 'Corresponding' : 'Non-Corresponding'}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Tersinkron
                        </span>
                      )}
                    </td>

                    {/* Poin KPI */}
                    <td className="px-6 py-4 text-right">
                      <div className="space-y-1">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                          +{Math.round(bd.totalPoints)} <span className="text-[10px] font-bold text-slate-400">pts</span>
                        </span>
                        <button
                          onClick={() => toggleRow(doc.id || idx)}
                          className="flex items-center justify-end gap-1 ml-auto text-[10px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
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
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 transition-colors"
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
                        <td colSpan={6} className="px-6 py-4 bg-slate-50/70 dark:bg-zinc-800/30 border-b border-gray-200 dark:border-zinc-800">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                  Rincian Perhitungan Poin SINTA (Scopus)
                                </h4>
                                <span className="text-xs font-extrabold text-primary-600 dark:text-primary-400">
                                  Total: {Math.round(bd.totalPoints)} Poin
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">Base Score ({bd.q})</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{bd.basePoints} pts</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">Bobot Peran</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{bd.pctStr || '-'}</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                                  <span className="block text-[10px] font-semibold text-slate-400 uppercase">Skenario Penilaian</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{bd.detailStr || '-'}</span>
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
    </div>
  );
}
