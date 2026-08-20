import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { CrossIndexedDocRowProps } from '../external-documents.types';
import { calculateScopusBreakdown } from '../utils/calculations';
import PointBreakdownBox from '../../../../publication/components/PointBreakdownBox';

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
              <Calendar className="w-3.5 h-3.5" /> {(scopusDoc || doc).year || '—'}
            </span>
          </div>

          <a
            href={(scopusDoc || doc).link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-slate-900 dark:text-white leading-snug hover:underline block line-clamp-2 mb-2"
          >
            {doc.title}
          </a>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {((scopusDoc || doc).journal || (scopusDoc || doc).source_name) && (
              <span className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-[240px]">
                {(scopusDoc || doc).journal || (scopusDoc || doc).source_name}
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
            <PointBreakdownBox
              doc={scopusDoc || doc}
              bd={bd}
              isCrossIndexed={true}
            />
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
