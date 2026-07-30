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
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="h-[3px] w-full bg-slate-200 dark:bg-zinc-700 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-5 p-5">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 flex flex-col items-center justify-center transition-colors">
            <span className="text-xl font-black text-slate-800 dark:text-zinc-100 leading-none tabular-nums">{bd.citations}</span>
            <span className="text-[7px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-2xs">
            +{Math.round(bd.totalPoints)} pts
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
              Scopus
            </span>
            {bd.q && bd.q !== 'None' && (
              <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
                {bd.q}
              </span>
            )}
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
              {bd.role}
            </span>
            <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-bold uppercase tracking-widest rounded-full bg-transparent">
              {subtypeLabel}
            </span>
            {isHyper && (
              <span className="px-2 py-0.5 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-[7px] font-black uppercase tracking-widest rounded-full bg-transparent">
                Hyperauthor
              </span>
            )}
            {isAlsoScholar && (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[7px] font-black uppercase tracking-widest rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                ✓ Scholar
              </span>
            )}
            {!isPublic && showCorrespondingControls && (
              <>
                {!bd.isCorrespondingConfirmed ? (
                  <span className="px-2 py-0.5 bg-orange-500 text-white dark:bg-orange-600 text-[7px] font-black uppercase rounded-full shadow-xs">
                    ⚠️ Perlu Konfirmasi
                  </span>
                ) : bd.isCorresponding ? (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[7px] font-black uppercase rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                    ✓ Corresponding
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[7px] font-black uppercase rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
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
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-orange-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
