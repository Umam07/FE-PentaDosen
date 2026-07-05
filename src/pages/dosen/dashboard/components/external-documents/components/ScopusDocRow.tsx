import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { ScopusDocRowProps } from '../external-documents.types';
import { calculateScopusBreakdown } from '../utils/calculations';
import { externalDocumentsService } from '../services/externalDocumentsService';

export default function ScopusDocRow({
  doc,
  isAlsoScholar,
  idx,
  onRefresh,
  isPublic = false
}: ScopusDocRowProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingCorresponding, setIsEditingCorresponding] = useState(false);
  const bd = calculateScopusBreakdown(doc);

  // Quartile color mapping
  const quartileConfig: Record<string, { bg: string; text: string; border: string; barColor: string }> = {
    Q1: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/25', barColor: 'bg-emerald-500' },
    Q2: { bg: 'bg-teal-500/10', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-500/25', barColor: 'bg-teal-500' },
    Q3: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/25', barColor: 'bg-blue-500' },
    Q4: { bg: 'bg-slate-400/10', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-300/30', barColor: 'bg-slate-400' },
  };
  const qConf = quartileConfig[bd.q] ?? quartileConfig['Q4'];

  // Author role color
  const roleConfig: Record<string, { bg: string; text: string }> = {
    'Single Author': { bg: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400' },
    'First Author': { bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400' },
    'Member Author': { bg: 'bg-slate-400/10', text: 'text-slate-600 dark:text-slate-400' },
    'Co-Author': { bg: 'bg-slate-400/10', text: 'text-slate-600 dark:text-slate-400' },
  };
  const rConf = roleConfig[bd.role] ?? roleConfig['Member Author'];

  const subtypeLabel = bd.isArticle ? 'Article' : (doc.subtype_description || doc.subtype || 'Non-Article');
  const isHyper = bd.totalAuthors > 16;
  const showCorrespondingControls = bd.isArticle && bd.totalAuthors > 1;

  // Batas perhitungan poin sitasi diset maksimal 200 di UI progress bar
  const citMax = 200;
  const citPct = Math.min(100, (bd.citations / citMax) * 100);

  const handleToggleCorresponding = async (value: boolean) => {
    setIsUpdating(true);
    try {
      const success = await externalDocumentsService.updateCorrespondingStatus(doc.id, value);
      if (success) {
        if (onRefresh) {
          onRefresh();
        }
        setIsEditingCorresponding(false);
      } else {
        console.error('Failed to update corresponding status');
      }
    } catch (err) {
      console.error('Error updating corresponding status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/8 transition-all duration-300 overflow-hidden"
    >
      <div className={`h-[3px] w-full ${qConf.barColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start gap-5 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex flex-col items-center justify-center group-hover:bg-orange-100/60 dark:group-hover:bg-orange-950/50 transition-colors">
            <span className="text-xl font-black text-orange-700 dark:text-orange-300 leading-none tabular-nums">{bd.citations}</span>
            <span className="text-[7px] font-black text-orange-400/80 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-sm shadow-orange-500/30">
            +{Math.round(bd.totalPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-orange-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              Scopus
            </span>
            {bd.q && bd.q !== 'None' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${qConf.bg} ${qConf.text} rounded-full text-[7px] font-black uppercase tracking-widest border ${qConf.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${qConf.barColor} inline-block`} />
                {bd.q}
              </span>
            )}
            <span className={`px-2 py-0.5 ${rConf.bg} ${rConf.text} rounded-full text-[7px] font-black uppercase tracking-widest`}>
              {bd.role}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[7px] font-bold uppercase tracking-wide">
              {subtypeLabel}
            </span>
            {isHyper && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-red-500/20">
                Hyperauthor
              </span>
            )}
            {isAlsoScholar && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">
                ✓ Scholar
              </span>
            )}
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3 h-3" /> {doc.year || '—'}
            </span>
          </div>

          <a
            href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-orange-600 dark:hover:text-orange-400 transition-colors block line-clamp-2 mb-3"
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
                <span className="text-orange-600 dark:text-orange-400 font-bold">
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

          {/* Konfirmasi status korespondensi untuk co-author. Skema poin KPI berbeda jika corresponding author */}
          {!isPublic && showCorrespondingControls && (
            <div className={`mt-3 mb-4 p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner transition-colors duration-200 ${
              !bd.isCorrespondingConfirmed && !isEditingCorresponding
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/30'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
            }`}>

              {bd.isCorrespondingConfirmed && !isEditingCorresponding ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-emerald-500/20 shadow-sm">
                      ✓ Dikonfirmasi
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Penulis korespondensi:
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider border shadow-sm ${
                      bd.isCorresponding
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                        : 'bg-slate-200/60 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 border-slate-300/40 dark:border-slate-600/40'
                    }`}>
                      {bd.isCorresponding ? '✓ Ya' : '✗ Tidak'}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsEditingCorresponding(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:text-orange-600 hover:border-orange-400 dark:hover:border-orange-500/50 dark:hover:text-orange-400 transition-all whitespace-nowrap shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Ubah
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    {isEditingCorresponding ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-blue-500/20 shadow-sm">
                        ✏️ Ubah Pilihan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-amber-500/20 animate-pulse shadow-sm">
                        ⚠️ Perlu Konfirmasi
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      Apakah Anda penulis korespondensi?
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleCorresponding(true)}
                      className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border bg-orange-600 border-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-md shadow-orange-500/20 disabled:opacity-50"
                    >
                      Ya
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleCorresponding(false)}
                      className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
                    >
                      Tidak
                    </button>
                    {isUpdating ? (
                      <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : isEditingCorresponding && (
                      <button
                        onClick={() => setIsEditingCorresponding(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Batal"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {bd.citations > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sitasi</span>
                <span className="text-[8px] font-black text-orange-500">{bd.citations} sitasi</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${citPct}%` }}
                  transition={{ delay: idx * 0.04 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${showBreakdown
                  ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 border-orange-200 dark:border-orange-900/50'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/60 dark:hover:bg-orange-950/20'
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
              className="mt-3 rounded-2xl border border-orange-100 dark:border-orange-900/30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-orange-50 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/30">
                <p className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Rincian Kalkulasi Poin SINTA (Skema Persentase + Quartile)</p>
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
                    <p className="text-[9px] font-bold text-orange-500">{bd.pctStr}</p>
                  </div>
                  <span className="text-[11px] font-black text-orange-600 flex-shrink-0">+{bd.basePoints.toFixed(2)}</span>
                </div>
                {bd.totalAuthors > 1 && (
                  <div className="flex justify-between items-center py-1 gap-2">
                    <p className="text-[9px] font-medium text-slate-400">Total penulis terdeteksi</p>
                    <span className="text-[9px] font-black text-slate-500">{bd.totalAuthors} penulis</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">Total Poin</span>
                  <span className="text-base font-black text-orange-600">{Math.round(bd.totalPoints)} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <a
          href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka dokumen "${doc.title}" di Scopus`}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-orange-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
