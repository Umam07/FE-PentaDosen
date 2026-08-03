import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { ScopusDocRowProps } from '../external-documents.types';
import { calculateScopusBreakdown } from '../utils/calculations';
import { externalDocumentsService } from '../services/externalDocumentsService';
import PointBreakdownBox from '../../../../publication/components/PointBreakdownBox';

export default function ScopusDocRow({
  doc,
  isAlsoScholar,
  idx,
  onRefresh,
  isPublic = false
}: ScopusDocRowProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const bd = calculateScopusBreakdown(doc);

  const subtypeLabel = bd.isArticle ? 'Article' : (doc.subtype_description || doc.subtype || 'Non-Article');
  const isHyper = bd.totalAuthors > 16;
  const showCorrespondingControls = bd.isArticle && bd.totalAuthors > 1;

  const handleToggleCorresponding = async (value: boolean) => {
    setIsUpdating(true);
    try {
      const success = await externalDocumentsService.updateCorrespondingStatus(doc.id, value);
      if (success) {
        if (onRefresh) {
          onRefresh();
        }
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
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="h-[3px] w-full bg-slate-200 dark:bg-zinc-700 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-4 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          {/* Kotak indikator sitasi versi compact netral (ringan, tidak mendominasi judul) */}
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center shadow-2xs">
            <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-none tabular-nums">{bd.citations}</span>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 rounded-full text-[8px] font-black tracking-wide whitespace-nowrap">
            +{Math.round(bd.totalPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {/* Metadata informatif: Badge netral (outline) */}
            <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-black uppercase tracking-wider rounded-full bg-slate-50/50 dark:bg-slate-800/30">
              Scopus
            </span>
            {bd.q && bd.q !== 'None' && (
              <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-black uppercase tracking-wider rounded-full bg-slate-50/50 dark:bg-slate-800/30">
                {bd.q}
              </span>
            )}
            <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-black uppercase tracking-wider rounded-full bg-slate-50/50 dark:bg-slate-800/30">
              {bd.role}
            </span>
            <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-bold uppercase tracking-wider rounded-full bg-slate-50/50 dark:bg-slate-800/30">
              {subtypeLabel}
            </span>
            {isHyper && (
              <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[8px] font-black uppercase tracking-wider rounded-full bg-slate-50/50 dark:bg-slate-800/30">
                Hyperauthor
              </span>
            )}

            {/* Status settled: Soft Green badge */}
            {isAlsoScholar && (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                ✓ Scholar
              </span>
            )}

            {/* Urgency Status: Solid Soft Amber/Orange (HANYA untuk Perlu Konfirmasi) */}
            {!isPublic && showCorrespondingControls && (
              <>
                {!bd.isCorrespondingConfirmed ? (
                  <span className="px-2.5 py-0.5 bg-amber-600 dark:bg-amber-600/90 text-white text-[8px] font-black uppercase tracking-wider rounded-full shadow-xs">
                    ⚠️ Perlu Konfirmasi
                  </span>
                ) : bd.isCorresponding ? (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                    ✓ Corresponding
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                    Non-Corresponding
                  </span>
                )}
              </>
            )}
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3 h-3" /> {doc.year || '—'}
            </span>
          </div>

          <a
            href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-amber-600 dark:hover:text-amber-400 transition-colors block line-clamp-2 mb-3"
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
                <span className="text-amber-600 dark:text-amber-400 font-bold">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${showBreakdown
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                }`}
            >
              {showBreakdown ? '▲ Sembunyikan' : '▼ Rincian Poin'}
            </button>
          </div>

          {showBreakdown && (
            <PointBreakdownBox
              doc={doc}
              bd={bd}
              isCrossIndexed={isAlsoScholar}
              showCorrespondingControls={showCorrespondingControls}
              updatingCorrespondingId={isUpdating ? doc.id : null}
              handleToggleCorresponding={async (_id, isCorr) => {
                await handleToggleCorresponding(isCorr);
              }}
            />
          )}
        </div>

        <a
          href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka dokumen "${doc.title}" di Scopus`}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
