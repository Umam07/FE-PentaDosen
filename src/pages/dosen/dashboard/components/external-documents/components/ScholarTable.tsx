import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { calculateScholarPoints } from '../../../pointsCalculator';

interface ScholarTableProps {
  documents: any[];
  scopusPublications?: any[];
  isPublic?: boolean;
}

export default function ScholarTable({
  documents,
  scopusPublications = [],
  isPublic = false,
}: ScholarTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);

  const toggleRow = (id: string | number) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const normalizeTitle = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      
      {/* ── 1. Desktop / Tablet Table View (md and above) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Informasi Publikasi
              </th>
              <th className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Pengindeks
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                Tahun &amp; Sitasi
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
              const docPoints = calculateScholarPoints(doc);
              const scopusMatch = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
              const isAlsoScopus = !!scopusMatch;
              const scopusQuartile = scopusMatch ? scopusMatch.quartile : null;
              const isExpanded = expandedRow === (doc.id || idx);
              const citations = Number(doc.citations) || 0;
              const linkUrl = doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`;

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
                          <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-sm lg:max-w-md">
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 block"
                            title={doc.title}
                          >
                            {doc.title}
                          </a>

                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                            {doc.author && (
                              <span className="italic truncate max-w-[280px]">
                                {doc.author}
                              </span>
                            )}
                            {(doc.journal || doc.publication) && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[200px]">{doc.journal || doc.publication}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Pengindeks */}
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200/60 dark:border-blue-900/40">
                          Google Scholar
                        </span>
                        {isAlsoScopus && (
                          <div>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-200/50">
                              ✓ Terindeks Scopus {scopusQuartile && scopusQuartile !== 'None' ? `(${scopusQuartile})` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Tahun & Sitasi */}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                          {doc.year || '—'}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium tabular-nums">
                          {citations} Sitasi
                        </p>
                      </div>
                    </td>

                    {/* Poin KPI */}
                    <td className="px-6 py-4 text-right">
                      <div className="space-y-1">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                          +{Math.round(docPoints)} <span className="text-[10px] font-bold text-slate-400">pts</span>
                        </span>
                        <button
                          onClick={() => toggleRow(doc.id || idx)}
                          className="flex items-center justify-end gap-1 ml-auto text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
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
                        title="Buka publikasi di Google Scholar"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>

                  {/* Expandable Breakdown Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-slate-50/70 dark:bg-zinc-800/30 border-b border-gray-200 dark:border-zinc-800">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                  Rincian Skema Poin SINTA (Google Scholar)
                                </h4>
                                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                                  Total: {Math.round(docPoints)} Poin
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                                  <div>
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Dokumen GS</span>
                                    <span className="text-[10px] text-slate-500">Poin flat publikasi</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">+0.50</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                                  <div>
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Bonus Tersitasi</span>
                                    <span className="text-[10px] text-slate-500">Jika sitasi &gt; 0</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">{citations > 0 ? '+0.50' : '+0.00'}</span>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                                  <div>
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Poin Sitasi ({citations})</span>
                                    <span className="text-[10px] text-slate-500">0.25 pts / sitasi</span>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">+{(Math.min(citations, 500) * 0.25).toFixed(2)}</span>
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
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-zinc-800">
        {documents.map((doc, idx) => {
          const docPoints = calculateScholarPoints(doc);
          const scopusMatch = scopusPublications.find((s) => normalizeTitle(s.title) === normalizeTitle(doc.title));
          const isAlsoScopus = !!scopusMatch;
          const scopusQuartile = scopusMatch ? scopusMatch.quartile : null;
          const isExpanded = expandedRow === (doc.id || idx);
          const citations = Number(doc.citations) || 0;
          const linkUrl = doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`;

          return (
            <div key={doc.id || idx} className="p-4 space-y-3 bg-white dark:bg-zinc-900">
              
              {/* Header: Title & External Link */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight line-clamp-2 leading-snug hover:text-blue-600"
                    >
                      {doc.title}
                    </a>
                    {(doc.journal || doc.publication) && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5 truncate">
                        {doc.journal || doc.publication}
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0 hover:bg-slate-200"
                  title="Buka di Google Scholar"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Chips / Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/50">
                  Google Scholar
                </span>
                {doc.year && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {doc.year}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-medium tabular-nums">
                  {citations} Sitasi
                </span>
                {isAlsoScopus && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-bold border border-emerald-200/50">
                    ✓ Scopus {scopusQuartile && scopusQuartile !== 'None' ? `(${scopusQuartile})` : ''}
                  </span>
                )}
              </div>

              {/* Bottom Row: Score & Detail Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs">
                  <span className="text-slate-400">Poin Scholar: </span>
                  <strong className="text-slate-900 dark:text-white font-extrabold tabular-nums">
                    +{Math.round(docPoints)} pts
                  </strong>
                </div>

                <button
                  onClick={() => toggleRow(doc.id || idx)}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
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
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-[11px]">
                      <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-1.5">
                        <span className="font-semibold text-slate-500">Dokumen GS:</span>
                        <strong className="text-slate-900 dark:text-white">+0.50 pts</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-1.5">
                        <span className="font-semibold text-slate-500">Bonus Tersitasi:</span>
                        <strong className="text-slate-900 dark:text-white">{citations > 0 ? '+0.50 pts' : '+0.00 pts'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-500">Poin Sitasi ({citations}):</span>
                        <strong className="text-slate-900 dark:text-white">+{(Math.min(citations, 500) * 0.25).toFixed(2)} pts</strong>
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
