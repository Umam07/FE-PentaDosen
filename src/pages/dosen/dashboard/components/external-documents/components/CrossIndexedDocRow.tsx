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

  // Batas perhitungan poin sitasi diset maksimal 200 di UI progress bar
  const citMax = 200;
  const citPct = Math.min(100, (citations / citMax) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="h-[3px] w-full bg-slate-200 dark:bg-zinc-700 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-5 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 flex flex-col items-center justify-center transition-colors">
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 leading-none tabular-nums">{citations}</span>
            <span className="text-[7px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-2xs">
            +{Math.round(bd.totalPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
              Scopus &amp; Scholar
            </span>
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
              Poin Scopus Digunakan
            </span>
            {bd.q && bd.q !== 'None' && (
              <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
                {bd.q}
              </span>
            )}
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
              {bd.role}
            </span>
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" /> {doc.year || '—'}
            </span>
          </div>

          <a
            href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block line-clamp-2 mb-3"
          >
            {doc.title}
          </a>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            {(doc.journal || doc.source_name) && (
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 italic truncate max-w-[220px]">
                {doc.journal || doc.source_name}
              </span>
            )}
            {bd.totalAuthors > 0 && (
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800/40 flex items-center gap-1">
                <span>Penulis:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
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

          {citations > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sitasi</span>
                <span className="text-[8px] font-black text-emerald-500">{citations} sitasi</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${citPct}%` }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${showBreakdown
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200 dark:border-emerald-900/50'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20'
                }`}
            >
              {showBreakdown ? '▲ Sembunyikan' : '▼ Rincian Poin'}
            </button>
          </div>

          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Rincian Poin Scopus — Skema 60/40 + Quartile (Cross-Indexed)</p>
              </div>
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quartile Jurnal:</span>
                  {bd.q !== 'None' ? (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${bd.q === 'Q1' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        bd.q === 'Q2' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
                          bd.q === 'Q3' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>{bd.q}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Tidak terdeteksi</span>
                  )}
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Poin Maks {bd.q !== 'None' ? bd.q : 'Tanpa Quartile'}</p>
                    <p className="text-[9px] font-medium text-slate-400">Q1=40, Q2=38, Q3=35, Q4/None=33 pts</p>
                  </div>
                  <span className="text-[11px] font-black text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{bd.detailStr}</p>
                    <p className="text-[9px] font-bold text-emerald-600">{bd.pctStr}</p>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 flex-shrink-0">+{Math.round(bd.basePoints)}</span>
                </div>
                {bd.totalAuthors > 1 && (
                  <div className="flex justify-between items-center py-1 gap-2">
                    <p className="text-[9px] font-medium text-slate-400">Total penulis terdeteksi</p>
                    <span className="text-[9px] font-black text-slate-500">{bd.totalAuthors} penulis</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">Total Poin</span>
                  <span className="text-base font-black text-emerald-600">{Math.round(bd.totalPoints)} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <a
          href={doc.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka dokumen "${doc.title}" di Portal Eksternal`}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
