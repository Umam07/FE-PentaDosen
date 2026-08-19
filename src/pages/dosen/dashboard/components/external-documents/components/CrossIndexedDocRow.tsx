import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { CrossIndexedDocRowProps } from '../external-documents.types';
import { calculateScopusBreakdown } from '../utils/calculations';

export default function CrossIndexedDocRow({
  doc,
  scopusDoc,
  idx
}: CrossIndexedDocRowProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const bd = calculateScopusBreakdown(scopusDoc || doc);
  const citations = bd.citations || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.02 }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all overflow-hidden"
    >
      <div className="flex items-start gap-4 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
            <span className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 leading-none tabular-nums">{citations}</span>
            <span className="text-[9px] font-medium text-slate-400 mt-0.5">Sitasi</span>
          </div>
          <div className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-lg text-xs font-bold font-mono tabular-nums whitespace-nowrap">
            +{Math.round(bd.totalPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
              Scopus &amp; Scholar
            </span>
            <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md bg-slate-50 dark:bg-slate-800/50">
              Poin Scopus Digunakan
            </span>
            {bd.q && bd.q !== 'None' && (
              <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono rounded-md bg-slate-50 dark:bg-slate-800/50">
                {bd.q}
              </span>
            )}
            <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md bg-slate-50 dark:bg-slate-800/50">
              {bd.role}
            </span>
            <span className="ml-auto text-xs text-slate-400 flex items-center gap-1 flex-shrink-0 font-mono">
              <Calendar className="w-3.5 h-3.5" /> {doc.year || '—'}
            </span>
          </div>

          <a
            href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-slate-900 dark:text-white leading-snug hover:underline block line-clamp-2 mb-2"
          >
            {doc.title}
          </a>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {(doc.journal || doc.source_name) && (
              <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-[240px]">
                {doc.journal || doc.source_name}
              </span>
            )}
            {bd.totalAuthors > 0 && (
              <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                <span>Penulis:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {bd.role === 'Single Author' ? (
                    '1 of 1 (Single)'
                  ) : bd.authorOrder ? (
                    `${bd.authorOrder} of ${bd.totalAuthors}`
                  ) : bd.role === 'First Author' ? (
                    `1 of ${bd.totalAuthors}`
                  ) : (
                    `Member of ${bd.totalAuthors}`
                  )}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {showBreakdown ? '▲ Sembunyikan' : '▼ Rincian Poin'}
            </button>
          </div>

          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Rincian Poin Scopus — Skema 60/40 + Quartile (Cross-Indexed)</p>
              </div>
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900 text-xs">
                <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">Quartile Jurnal:</span>
                  {bd.q !== 'None' ? (
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      {bd.q}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Tidak terdeteksi</span>
                  )}
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Poin Maks {bd.q !== 'None' ? bd.q : 'Tanpa Quartile'}</p>
                    <p className="text-[11px] text-slate-400">Q1=40, Q2=38, Q3=35, Q4/None=33 pts</p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">{bd.maxPoints} pts</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{bd.detailStr}</p>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{bd.pctStr}</p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">+{Math.round(bd.basePoints)}</span>
                </div>
                {bd.totalAuthors > 1 && (
                  <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Poin Sitasi ({citations} Sitasi / {bd.totalAuthors} Penulis)</p>
                      <p className="text-[11px] text-slate-400">Dibagi rata ke seluruh penulis</p>
                    </div>
                    <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">+{bd.citationSharePoints.toFixed(2)}</span>
                  </div>
                )}
                {citations > 0 && (
                  <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Bonus Dokumen Tersitasi</p>
                      <p className="text-[11px] text-slate-400">Bonus flat dokumen memiliki sitasi</p>
                    </div>
                    <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">+5</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Total Poin</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{Math.round(bd.totalPoints)} Pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <a
          href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka dokumen "${doc.title}" di Google Scholar`}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all flex-shrink-0 self-start cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
