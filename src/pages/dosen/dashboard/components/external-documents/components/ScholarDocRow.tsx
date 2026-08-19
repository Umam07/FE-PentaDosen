import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { ScholarDocRowProps } from '../external-documents.types';

export default function ScholarDocRow({
  doc,
  docPoints,
  isAlsoScopus,
  scopusQuartile,
  idx
}: ScholarDocRowProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const citations = doc.citations || 0;

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
            +{Math.round(docPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-md bg-slate-50 dark:bg-slate-800/50">
              Google Scholar
            </span>
            {isAlsoScopus && (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                ✓ Scopus {scopusQuartile && scopusQuartile !== 'None' ? `(${scopusQuartile})` : ''}
              </span>
            )}
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

          {doc.author && (
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-[320px]">
                {doc.author}
              </span>
            </div>
          )}

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
                <p className="text-xs font-bold text-slate-900 dark:text-white">Rincian Perhitungan Poin (SINTA GS)</p>
              </div>
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900 text-xs">
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Dokumen GS</p>
                    <p className="text-[11px] text-slate-400">Poin flat per publikasi Google Scholar</p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">+0.50</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Dokumen Tersitasi</p>
                    <p className="text-[11px] text-slate-400">Poin tambahan flat jika sitasi &gt; 0</p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">
                    +{((citations) > 0 ? 0.50 : 0.00).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Sitasi (×{Math.min(citations, 500)} × 0.25)
                      {citations > 500 && ' (Cut-off 500)'}
                    </p>
                    <p className="text-[11px] text-slate-400">Nilai bobot per sitasi yang didapat</p>
                  </div>
                  <span className="font-bold font-mono text-slate-900 dark:text-white flex-shrink-0">
                    +{(Math.min(citations, 500) * 0.25).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Total Poin</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{Math.round(docPoints)} Pts</span>
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

