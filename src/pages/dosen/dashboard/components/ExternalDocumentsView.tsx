import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Zap, ShieldCheck, Book, TrendingUp, Calendar, ExternalLink, Search,
  ChevronLeft, ChevronRight, Globe, Beaker, Filter
} from 'lucide-react';
import { ProfileTrendChart } from './ProfileCharts';
import { calculateScholarPoints } from '../pointsCalculator';

// === Sub-component: Scholar row with per-doc points + breakdown ===
function ScholarDocRow({ doc, docPoints, isAlsoScopus, scopusQuartile, idx }: {
  doc: any; docPoints: number; isAlsoScopus: boolean; scopusQuartile?: string | null; idx: number; normalizeTitle?: (t: string) => string; key?: React.Key;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const citations = doc.citations || 0;

  // Citation progress bar (reference max = 200)
  const citMax = 200;
  const citPct = Math.min(100, (citations / citMax) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-300 overflow-hidden"
    >
      {/* Brand accent stripe */}
      <div className="h-[3px] w-full bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-5 p-5">
        {/* Citation + Points Column */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-col items-center justify-center group-hover:bg-blue-100/60 dark:group-hover:bg-blue-950/50 transition-colors">
            <span className="text-xl font-black text-blue-700 dark:text-blue-300 leading-none tabular-nums">{citations}</span>
            <span className="text-[7px] font-black text-blue-400/80 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-sm shadow-blue-500/30">
            +{docPoints.toFixed(1)} pts
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {/* Scholar badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Scholar
            </span>
            {/* Also Scopus badge */}
            {isAlsoScopus && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">
                ✓ Scopus {scopusQuartile && scopusQuartile !== 'None' ? `(${scopusQuartile})` : ''}
              </span>
            )}
            {/* Year — pushed to the right */}
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" /> {doc.year || '—'}
            </span>
          </div>

          {/* Title */}
          <a
            href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors block line-clamp-2 mb-3"
          >
            {doc.title}
          </a>

          {/* Metadata row */}
          {doc.author && (
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 italic truncate max-w-[320px]">
                {doc.author}
              </span>
            </div>
          )}

          {/* Citation Progress Bar */}
          {citations > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sitasi</span>
                <span className="text-[8px] font-black text-blue-500">{citations} sitasi</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${citPct}%` }}
                  transition={{ delay: idx * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${showBreakdown
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 border-blue-200 dark:border-blue-900/50'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/60 dark:hover:bg-blue-950/20'
                }`}
            >
              {showBreakdown ? '▲ Sembunyikan' : '▼ Rincian Poin'}
            </button>
          </div>

          {/* Breakdown Panel */}
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/30">
                <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Rincian Perhitungan Poin (SINTA GS)</p>
              </div>
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen GS</p>
                    <p className="text-[9px] font-medium text-slate-400">Poin flat per publikasi Google Scholar</p>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 flex-shrink-0">+0.50</span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen Tersitasi</p>
                    <p className="text-[9px] font-medium text-slate-400">Poin tambahan flat jika sitasi &gt; 0</p>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
                    +{((citations) > 0 ? 0.50 : 0.00).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                      Sitasi (×{Math.min(citations, 500)} × 0.25)
                      {citations > 500 && ' (Cut-off 500)'}
                    </p>
                    <p className="text-[9px] font-medium text-slate-400">Nilai bobot per sitasi yang didapat</p>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
                    +{(Math.min(citations, 500) * 0.25).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">Total Poin</span>
                  <span className="text-base font-black text-blue-600">{docPoints.toFixed(2)} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* External Link button */}
        <a
          href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

// === Helper: Detailed Scopus breakdown calculation (60/40 schema + quartile) ===
// Quartile determines max base points:
//   Q1 = 40 pts, Q2 = 38 pts, Q3 = 35 pts, Q4 = 33 pts, None = 33 pts
// Then: Single = 100%, First = 60%, Member = 40% / (totalAuthors - 1)
const calculateScopusBreakdown = (pub: any) => {
  const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author' ? 'Member Author' : (pub.author_role || 'Member Author');
  const totalAuthors = Number(pub.total_authors) || 1;
  const authorOrder = Number(pub.author_order) || (role === 'First Author' || role === 'Single Author' ? 1 : 2);
  const isCorresponding = !!pub.is_corresponding;
  const isCorrespondingConfirmed = !!pub.is_corresponding_confirmed;
  const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
  const q = pub.quartile && ['Q1', 'Q2', 'Q3', 'Q4'].includes(pub.quartile) ? pub.quartile : 'None';
  const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';
  const docType = isArticle ? `Article ${q !== 'None' ? q : '(Tanpa Quartile)'}` : 'Non-Article';

  let awardedPoints = 0;
  let detailStr = '';
  let pctStr = '';
  const maxPoints = isArticle ? (q === 'Q1' ? 40 : q === 'Q2' ? 38 : q === 'Q3' ? 35 : 33) : 30;

  if (isArticle) {
    if (isHyper) {
      if (role === 'Single Author') {
        awardedPoints = 40;
        detailStr = `Scopus ${docType} Hyperauthor (Single Author)`;
        pctStr = '100% · >16 penulis = 40 pts';
      } else if (role === 'First Author') {
        awardedPoints = 24;
        detailStr = `Scopus ${docType} Hyperauthor (First Author)`;
        pctStr = 'Flat 24 pts · >16 penulis';
      } else {
        awardedPoints = 1;
        detailStr = `Scopus ${docType} Hyperauthor (Member Author)`;
        pctStr = 'Flat 1 pt · >16 penulis';
      }
    } else {
      // Base SKS points
      const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
      const basePoints = basePointsMap[q] ?? 33;

      if (totalAuthors === 1 || (authorOrder === 1 && totalAuthors === 1)) {
        awardedPoints = basePoints;
        detailStr = `Scopus ${docType} (Single Author)`;
        pctStr = `100% dari ${basePoints} pts`;
      } else if (totalAuthors === 2) {
        if (authorOrder === 1) {
          if (isCorresponding) {
            awardedPoints = 0.6 * basePoints;
            detailStr = `Scopus ${docType} (First & Corresponding Author)`;
            pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.5 * basePoints;
            detailStr = `Scopus ${docType} (First Author)`;
            pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
          }
        } else {
          if (isCorresponding) {
            awardedPoints = 0.5 * basePoints;
            detailStr = `Scopus ${docType} (2nd Author + Corresponding)`;
            pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (2nd Author)`;
            pctStr = `Skenario 1: 40% dari ${basePoints} pts`;
          }
        }
      } else {
        // > 2 Authors
        if (authorOrder === 1) {
          if (isCorresponding) {
            awardedPoints = 0.6 * basePoints;
            detailStr = `Scopus ${docType} (First & Corresponding Author)`;
            pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (First Author)`;
            pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
          }
        } else {
          // Member Author (2nd, 3rd, etc.)
          if (isCorresponding) {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (Member Author + Corresponding)`;
            pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
          } else {
            // Default Scenario 1
            awardedPoints = (0.4 * basePoints) / (totalAuthors - 1);
            detailStr = `Scopus ${docType} (Member Author)`;
            pctStr = `Skenario 1 (Default): 40% dari ${basePoints} pts ÷ ${totalAuthors - 1} anggota`;
          }
        }
      }
    }
  } else {
    // Non-Article
    if (role === 'Single Author') {
      awardedPoints = 30;
      detailStr = `Scopus ${docType} (Single Author)`;
      pctStr = '100% dari 30 pts';
    } else if (role === 'First Author') {
      awardedPoints = 18;
      detailStr = `Scopus ${docType} (First Author)`;
      pctStr = 'Flat 18 pts';
    } else {
      const memberCount = Math.max(1, totalAuthors - 1);
      awardedPoints = 12 / memberCount;
      detailStr = `Scopus ${docType} (Member Author)`;
      pctStr = `Pool 12 pts ÷ ${memberCount} anggota = ${(12 / memberCount).toFixed(2)} pts`;
    }
  }

  const totalPoints = Math.round(awardedPoints * 100) / 100;

  return {
    basePoints: totalPoints,
    totalPoints,
    maxPoints,
    detailStr,
    pctStr,
    totalAuthors,
    authorOrder,
    citations: Number(pub.citations) || 0,
    isArticle,
    isHyper,
    role,
    q,
    isCorresponding,
    isCorrespondingConfirmed
  };
};

// === Sub-component: Scopus row — SINTA points calculation (UPGRADED) ===
function ScopusDocRow({ doc, isAlsoScholar, idx, onRefresh }: {
  doc: any; isAlsoScholar: boolean; idx: number; onRefresh?: () => void; key?: React.Key;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isEditingCorresponding, setIsEditingCorresponding] = React.useState(false);
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

  // Citation progress bar (reference max = 200)
  const citMax = 200;
  const citPct = Math.min(100, (bd.citations / citMax) * 100);

  const handleToggleCorresponding = async (value: boolean) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/scopus-publications/${doc.id}/corresponding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_corresponding: value }),
      });

      if (res.ok) {
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
      {/* Quartile accent stripe */}
      <div className={`h-[3px] w-full ${qConf.barColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start gap-5 p-5">
        {/* Citation + Points Column */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex flex-col items-center justify-center group-hover:bg-orange-100/60 dark:group-hover:bg-orange-950/50 transition-colors">
            <span className="text-xl font-black text-orange-700 dark:text-orange-300 leading-none tabular-nums">{bd.citations}</span>
            <span className="text-[7px] font-black text-orange-400/80 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-sm shadow-orange-500/30">
            +{bd.totalPoints.toFixed(1)} pts
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {/* Scopus badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-orange-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              Scopus
            </span>
            {/* Quartile badge */}
            {bd.q && bd.q !== 'None' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${qConf.bg} ${qConf.text} rounded-full text-[7px] font-black uppercase tracking-widest border ${qConf.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${qConf.barColor} inline-block`} />
                {bd.q}
              </span>
            )}
            {/* Author role badge */}
            <span className={`px-2 py-0.5 ${rConf.bg} ${rConf.text} rounded-full text-[7px] font-black uppercase tracking-widest`}>
              {bd.role}
            </span>
            {/* Subtype badge */}
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[7px] font-bold uppercase tracking-wide">
              {subtypeLabel}
            </span>
            {/* Hyperauthor warning */}
            {isHyper && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-red-500/20">
                Hyperauthor
              </span>
            )}
            {/* Also Scholar badge */}
            {isAlsoScholar && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">
                ✓ Scholar
              </span>
            )}
            {/* Year — pushed to the right */}
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3 h-3" /> {doc.year || '—'}
            </span>
          </div>

          {/* Title */}
          <a
            href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-orange-600 dark:hover:text-orange-400 transition-colors block line-clamp-2 mb-3"
          >
            {doc.title}
          </a>

          {/* Metadata row */}
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

          {/* Corresponding Author Toggle Section */}
          {showCorrespondingControls && (
            <div className={`mt-3 mb-4 p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner transition-colors duration-200 ${
              !bd.isCorrespondingConfirmed && !isEditingCorresponding
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/30'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
            }`}>

              {/* ── Mode Statis: sudah dikonfirmasi & tidak sedang diedit ── */}
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

                  {/* Tombol Ubah */}
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
                /* ── Mode Input: belum dikonfirmasi atau sedang diedit ── */
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
                      /* Tombol Batal — hanya muncul saat mode edit */
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

          {/* Citation Progress Bar */}
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

          {/* Action Button */}
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

          {/* Breakdown Panel */}
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
                {/* Quartile badge */}
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
                {/* Max Points row */}
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Poin Maks {bd.q !== 'None' ? bd.q : 'Tanpa Quartile'}</p>
                    <p className="text-[9px] font-medium text-slate-400">Q1=40, Q2=38, Q3=35, Q4/None=33 pts</p>
                  </div>
                  <span className="text-[11px] font-black text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
                </div>
                {/* Role Points row */}
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
                  <span className="text-base font-black text-orange-600">{bd.totalPoints.toFixed(2)} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* External Link button */}
        <a
          href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-orange-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

// === Sub-component: Cross-Indexed row — use Scopus points ===
function CrossIndexedDocRow({ doc, scopusDoc, idx }: {
  doc: any; scopusDoc: any | undefined; idx: number; key?: React.Key;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const bd = calculateScopusBreakdown(scopusDoc || doc);
  const citations = bd.citations || 0;

  // Citation progress bar (reference max = 200)
  const citMax = 200;
  const citPct = Math.min(100, (citations / citMax) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/8 transition-all duration-300 overflow-hidden"
    >
      {/* Brand accent stripe */}
      <div className="h-[3px] w-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-5 p-5">
        {/* Citation + Points Column */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-[62px] h-[62px] rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex flex-col items-center justify-center group-hover:bg-emerald-100/60 dark:group-hover:bg-emerald-950/50 transition-colors">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 leading-none tabular-nums">{citations}</span>
            <span className="text-[7px] font-black text-emerald-400/80 uppercase tracking-widest mt-0.5">Sitasi</span>
          </div>
          <div className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-black tracking-wide whitespace-nowrap shadow-sm shadow-emerald-500/30">
            +{bd.totalPoints.toFixed(1)} pts
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            {/* Brand badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Scopus &amp; Scholar
            </span>
            {/* Source badge */}
            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-[7px] font-black uppercase tracking-widest border border-orange-500/20">
              Poin Scopus Digunakan
            </span>
            {/* Quartile badge */}
            {bd.q && bd.q !== 'None' && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${bd.q === 'Q1' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' : bd.q === 'Q2' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25' : bd.q === 'Q3' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25' : 'bg-slate-400/10 text-slate-500 dark:text-slate-400 border-slate-300/30'} rounded-full text-[7px] font-black uppercase tracking-widest border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${bd.q === 'Q1' ? 'bg-emerald-500' : bd.q === 'Q2' ? 'bg-teal-500' : bd.q === 'Q3' ? 'bg-blue-500' : 'bg-slate-400'} inline-block`} />
                {bd.q}
              </span>
            )}
            {/* Author role badge */}
            <span className={`px-2 py-0.5 ${bd.role === 'Single Author' ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400' : bd.role === 'First Author' ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-slate-400/10 text-slate-600 dark:text-slate-400'} rounded-full text-[7px] font-black uppercase tracking-widest`}>
              {bd.role}
            </span>
            {/* Year — pushed to the right */}
            <span className="ml-auto text-[8px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Calendar className="w-3.5 h-3.5" /> {doc.year || '—'}
            </span>
          </div>

          {/* Title */}
          <a
            href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block line-clamp-2 mb-3"
          >
            {doc.title}
          </a>

          {/* Metadata row */}
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

          {/* Citation Progress Bar */}
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

          {/* Action Button */}
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

          {/* Breakdown Panel */}
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
                {/* Quartile badge */}
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
                {/* Max Points row */}
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Poin Maks {bd.q !== 'None' ? bd.q : 'Tanpa Quartile'}</p>
                    <p className="text-[9px] font-medium text-slate-400">Q1=40, Q2=38, Q3=35, Q4/None=33 pts</p>
                  </div>
                  <span className="text-[11px] font-black text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
                </div>
                {/* Role Points row */}
                <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{bd.detailStr}</p>
                    <p className="text-[9px] font-bold text-emerald-600">{bd.pctStr}</p>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 flex-shrink-0">+{bd.basePoints.toFixed(2)}</span>
                </div>
                {bd.totalAuthors > 1 && (
                  <div className="flex justify-between items-center py-1 gap-2">
                    <p className="text-[9px] font-medium text-slate-400">Total penulis terdeteksi</p>
                    <span className="text-[9px] font-black text-slate-500">{bd.totalAuthors} penulis</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">Total Poin</span>
                  <span className="text-base font-black text-emerald-600">{bd.totalPoints.toFixed(2)} pts</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* External Link button */}
        <a
          href={doc.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0 self-start"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

interface ExternalDocumentsViewProps {
  publicationSubTab: 'scopus' | 'scholar' | 'cross_indexed' | 'metriks';
  setPublicationSubTab: (tab: 'scopus' | 'scholar' | 'cross_indexed' | 'metriks') => void;
  scopusChartData: any;
  scholarChartData: any;
  scopusData: any;
  scholarData: any;
  publications: any[];
  scopusPublications: any[];
  tabVariants: any;
  onRefresh?: () => void;
}

export default function ExternalDocumentsView({
  publicationSubTab,
  setPublicationSubTab,
  scopusChartData,
  scholarChartData,
  scopusData,
  scholarData,
  publications,
  scopusPublications,
  tabVariants,
  onRefresh
}: ExternalDocumentsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [scopusFilter, setScopusFilter] = useState<'all' | 'unconfirmed' | 'confirmed'>('all');
  const [articleFilter, setArticleFilter] = useState<'all' | 'article' | 'non-article'>('all');

  // Reset page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [publicationSubTab]);

  const currentYear = new Date().getFullYear();

  const normalizeTitle = (title: string) => {
    return title?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  };

  const baseCrossIndexedDocs = (publications || []).filter(scholarDoc => {
    const scholarTitle = normalizeTitle(scholarDoc.title);
    return (scopusPublications || []).some(scopusDoc => normalizeTitle(scopusDoc.title) === scholarTitle);
  });

  const scopusList = scopusPublications || [];
  const scholarList = publications || [];
  const crossIndexedDocs = baseCrossIndexedDocs;

  const filteredScopusList = useMemo(() => {
    let result = scopusList;

    // Korespondensi Filter
    if (scopusFilter === 'unconfirmed') {
      result = result.filter((doc: any) => {
        const totalAuthors = Number(doc.total_authors) || 1;
        const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
        return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
      });
    } else if (scopusFilter === 'confirmed') {
      result = result.filter((doc: any) => {
        const totalAuthors = Number(doc.total_authors) || 1;
        const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
        return !isArticle || totalAuthors <= 1 || doc.is_corresponding_confirmed;
      });
    }

    // Article/Non-Article Filter
    if (articleFilter === 'article') {
      result = result.filter((doc: any) => {
        return !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
      });
    } else if (articleFilter === 'non-article') {
      result = result.filter((doc: any) => {
        return doc.subtype && doc.subtype.toLowerCase() !== 'ar' && doc.subtype.toLowerCase() !== 'article';
      });
    }

    return result;
  }, [scopusList, scopusFilter, articleFilter]);

  // Pagination Helper Component
  const Pagination = ({ totalItems, currentPage, onPageChange, itemsPerPage, setItemsPerPage }: {
    totalItems: number,
    currentPage: number,
    onPageChange: (page: number) => void,
    itemsPerPage: number,
    setItemsPerPage: (limit: number) => void
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1 && totalItems <= 10) return null;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
          </span>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Limit:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); onPageChange(1); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black py-1 px-3 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer uppercase tracking-tighter"
            >
              {[10, 25, 50, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, index, array) => (
                <React.Fragment key={p}>
                  {index > 0 && array[index - 1] !== p - 1 && (
                    <span className="px-2 text-slate-300 font-bold">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === p
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 ring-4 ring-primary-100 dark:ring-primary-900/20'
                        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 hover:text-primary-600 shadow-sm'
                      }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key="insights"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm min-h-[500px] relative overflow-hidden">
        <div className="space-y-10 relative z-10">
          {/* Nested Publication Sub-tabs - Underline Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {/* pb-3 on inner div so overflow-x-auto doesn't clip bottom-0 underlines */}
            <div className="flex items-center gap-8 pb-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'scopus', label: 'Scopus Indexed' },
                { id: 'scholar', label: 'Google Scholar' },
                { id: 'cross_indexed', label: 'Cross-Indexed (Irisan)' },
                { id: 'metriks', label: 'Metriks Penilaian' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPublicationSubTab(sub.id as any)}
                  className={`group/tab relative pb-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${publicationSubTab === sub.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  {sub.label}
                  {/* Active indicator */}
                  {publicationSubTab === sub.id && (
                    <motion.div
                      layoutId="insights-subtab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-600 dark:bg-primary-500 rounded-full"
                    />
                  )}
                  {/* Hover underline — slides in from left when not active */}
                  {publicationSubTab !== sub.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full scale-x-0 group-hover/tab:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ===== RINGKASAN POIN PUBLIKASI INTERNAL ===== */}
          {(() => {
            const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const crossTitles = new Set(
              (scholarList).filter(sd =>
                (scopusList).some(s => normalizeT(s.title) === normalizeT(sd.title))
              ).map(d => normalizeT(d.title))
            );
            const crossPts = scopusList.filter(s => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusBreakdown(d).totalPoints, 0);
            const scopusOnly = scopusList.filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusBreakdown(d).totalPoints, 0);
            const scholarOnly = parseFloat(scholarList.filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScholarPoints(d), 0).toFixed(1));
            const grandTotal = parseFloat((crossPts + scopusOnly + scholarOnly).toFixed(1));
            const scopusOnlyCount = scopusList.length - crossTitles.size;
            const scholarOnlyCount = scholarList.length - crossTitles.size;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Scopus-only */}
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1">Scopus-Only</p>
                  <p className="text-xl font-black text-orange-700 dark:text-orange-300">{scopusOnly.toFixed(1)} <span className="text-[9px] font-bold">pts</span></p>
                  <p className="text-[9px] font-bold text-orange-400 mt-1">{scopusOnlyCount} dokumen · SINTA metrik</p>
                </div>
                {/* Scholar-only */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Scholar-Only</p>
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300">{scholarOnly.toFixed(1)} <span className="text-[9px] font-bold">pts</span></p>
                  <p className="text-[9px] font-bold text-blue-400 mt-1">{scholarOnlyCount} dokumen · SINTA GS metrik</p>
                </div>
                {/* Cross-indexed */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Cross-Indexed</p>
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{crossPts.toFixed(1)} <span className="text-[9px] font-bold">pts</span></p>
                  <p className="text-[9px] font-bold text-emerald-400 mt-1">{crossTitles.size} irisan · poin Scopus dipakai</p>
                </div>
                {/* Grand Total */}
                <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-2xl border border-violet-200 dark:border-violet-900/30">
                  <p className="text-[8px] font-black text-violet-500 uppercase tracking-widest mb-1">Total (No Double-Count)</p>
                  <p className="text-xl font-black text-violet-700 dark:text-violet-300">{grandTotal.toFixed(1)} <span className="text-[9px] font-bold">pts</span></p>
                  <p className="text-[9px] font-bold text-violet-400 mt-1">Scopus + Scholar + Cross</p>
                </div>
              </div>
            );
          })()}

          {/* Publication Content */}
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {publicationSubTab === 'scopus' ? (
                <motion.div
                  key="scopus"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-10"
                >
                {scopusChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      {/* Decorative Blobs */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover/chart-container:bg-orange-500/10 transition-colors duration-700"></div>
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover/chart-container:bg-amber-500/10 transition-colors duration-700"></div>

                      <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                              <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Analisis Tren Scopus</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Statistik Publikasi & Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">10 Tahun Terakhir</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <ProfileTrendChart
                            chartData={scopusChartData.chartData}
                            leftDomainMax={scopusChartData.leftMax}
                            rightDomainMax={scopusChartData.rightMax}
                            barColor="#10b981" // emerald-500
                            barGradientColor="#34d399" // emerald-400
                            lineColor="#f59e0b" // amber-500
                            areaGradientColor="#f59e0b"
                            gradientId="scopus"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {/* === Unconfirmed Publications Banner === */}
                      {(() => {
                        const unconfirmedScopusCount = (scopusList || []).filter((doc: any) => {
                          const totalAuthors = Number(doc.total_authors) || 1;
                          const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                          return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
                        }).length;

                        if (unconfirmedScopusCount === 0) return null;

                        return (
                          <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/25 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-inner flex-shrink-0">
                                <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Konfirmasi Penulis Korespondensi Diperlukan</h4>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                  Terdapat <span className="font-black text-orange-600 dark:text-orange-400">{unconfirmedScopusCount} publikasi Scopus</span> yang belum dikonfirmasi status penulis korespondensinya.
                                  Silakan perbarui status di bawah untuk memastikan perhitungan poin KPI Anda akurat.
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 self-end md:self-center">
                              <span className="px-4 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest block text-center shadow-md shadow-amber-500/20 animate-bounce">
                                {unconfirmedScopusCount} Perlu Update
                              </span>
                            </div>
                          </motion.div>
                        );
                      })()}

                      {/* === Formula Info Banner === */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50/60 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0 border border-orange-200/50 dark:border-orange-800/50">
                            <span className="text-orange-600 text-[13px] font-black">∑</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest">Formula Penilaian Scopus · Skema Persentase Baru</p>
                            <p className="text-[10px] font-bold text-orange-600/70 dark:text-orange-400/70 mt-0.5">
                              Base SKS (Q1=40, Q2=38, Q3=35, Q4=33) · Penghitungan persentase didasarkan pada peran penulis & status korespondensi
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* === Filter Bar === */}
                      <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-inner">
                        {/* Row 1: Filter Korespondensi */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Filter Korespondensi:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { id: 'all', label: 'Semua Dokumen', count: scopusList.length },
                              {
                                id: 'unconfirmed',
                                label: 'Perlu Konfirmasi',
                                count: scopusList.filter((doc: any) => {
                                  const totalAuthors = Number(doc.total_authors) || 1;
                                  const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                                  return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
                                }).length
                              },
                              {
                                id: 'confirmed',
                                label: 'Sudah Dikonfirmasi / Selesai',
                                count: scopusList.filter((doc: any) => {
                                  const totalAuthors = Number(doc.total_authors) || 1;
                                  const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
                                  return !isArticle || totalAuthors <= 1 || doc.is_corresponding_confirmed;
                                }).length
                              }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setScopusFilter(opt.id as any);
                                  setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${scopusFilter === opt.id
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-orange-600 hover:border-orange-400'
                                  }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>{opt.label}</span>
                                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${scopusFilter === opt.id
                                      ? 'bg-white/20 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {opt.count}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Row 2: Filter Tipe Dokumen */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-700/50 pt-4">
                          <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Filter Tipe Dokumen:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { id: 'all', label: 'Semua Tipe', count: scopusList.length },
                              {
                                id: 'article',
                                label: 'Article / Journal',
                                count: scopusList.filter((doc: any) => !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article').length
                              },
                              {
                                id: 'non-article',
                                label: 'Non-Article',
                                count: scopusList.filter((doc: any) => doc.subtype && doc.subtype.toLowerCase() !== 'ar' && doc.subtype.toLowerCase() !== 'article').length
                              }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setArticleFilter(opt.id as any);
                                  setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${articleFilter === opt.id
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-orange-600 hover:border-orange-400'
                                  }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>{opt.label}</span>
                                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black ${articleFilter === opt.id
                                      ? 'bg-white/20 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {opt.count}
                                  </span>
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {filteredScopusList.length > 0 ? (
                          filteredScopusList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                            const isAlsoScholar = crossIndexedDocs.some((c: any) => normalizeTitle(c.title) === normalizeTitle(doc.title));
                            return (
                              <ScopusDocRow
                                key={idx}
                                doc={doc}
                                isAlsoScholar={isAlsoScholar}
                                idx={idx}
                                onRefresh={onRefresh}
                              />
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-slate-300 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-100 dark:border-slate-800/80 rounded-[2rem]">
                            <Search className="w-6 h-6 opacity-30" />
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak Ada Dokumen</p>
                              <p className="text-[9px] font-bold text-slate-400/80 mt-1">Tidak ada dokumen yang cocok dengan filter yang dipilih.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Pagination
                        totalItems={filteredScopusList?.length || 0}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                      <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Data Tidak Ditemukan</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'scholar' ? (
                <motion.div
                  key="scholar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-10"
                >
                {scholarChartData.chartData.length > 0 ? (
                  <>
                    <div className="relative group/chart-container">
                      {/* Decorative Blobs */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover/chart-container:bg-blue-500/10 transition-colors duration-700"></div>
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover/chart-container:bg-indigo-500/10 transition-colors duration-700"></div>

                      <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                              <TrendingUp className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Tren Google Scholar</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Analisis Publikasi & Sitasi</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistik Tahunan</span>
                          </div>
                        </div>

                        <div className="h-[350px] w-full">
                          <ProfileTrendChart
                            chartData={scholarChartData.chartData}
                            leftDomainMax={scholarChartData.leftMax}
                            rightDomainMax={scholarChartData.rightMax}
                            barColor="#3b82f6" // blue-500
                            barGradientColor="#60a5fa" // blue-400
                            lineColor="#8b5cf6" // violet-500
                            areaGradientColor="#8b5cf6"
                            gradientId="scholar"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document List */}
                    <div className="space-y-6">
                      {/* Skema poin GS banner */}
                      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-[10px] font-black">i</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Skema Poin Google Scholar</p>
                          <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 mt-1">
                            Dihitung berdasarkan dokumen Google Scholar, jumlah sitasi, &amp; bonus tersitasi.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {scholarList?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                          const docPoints = calculateScholarPoints(doc);
                          const scopusMatch = (scopusPublications || []).find((s: any) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                          const isAlsoScopus = !!scopusMatch;
                          const scopusQuartile = scopusMatch ? scopusMatch.quartile : null;
                          return (
                            <ScholarDocRow
                              key={idx}
                              doc={doc}
                              docPoints={docPoints}
                              isAlsoScopus={isAlsoScopus}
                              scopusQuartile={scopusQuartile}
                              idx={idx}
                              normalizeTitle={normalizeTitle}
                            />
                          );
                        })}
                      </div>
                      <Pagination
                        totalItems={scholarList?.length || 0}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                      <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Data</p>
                    </div>
                  </div>
                )}
                </motion.div>
              ) : publicationSubTab === 'cross_indexed' ? (
                <motion.div
                  key="cross_indexed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Publikasi Terindeks Ganda</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Poin diambil dari Scopus (lebih besar)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Poin</p>
                      <p className="text-lg font-black text-emerald-600">
                        {crossIndexedDocs.reduce((acc: number, doc: any) => {
                          const sd = (scopusPublications || []).find((s: any) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                          return acc + calculateScopusBreakdown(sd || doc).totalPoints;
                        }, 0).toFixed(2)} pts
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {crossIndexedDocs?.length || 0} Total
                    </div>
                  </div>
                </div>

                {/* Info banner cross-indexed */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-[10px] font-black">i</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Deduplikasi Otomatis — Poin Scopus Digunakan</p>
                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                      Ketika judul ada di Scopus & Scholar, sistem memakai poin Scopus (kalkulasi SINTA) karena lebih besar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {crossIndexedDocs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                    const scopusDoc = (scopusPublications || []).find((s: any) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                    return (
                      <CrossIndexedDocRow
                        key={idx}
                        doc={doc}
                        scopusDoc={scopusDoc}
                        idx={idx}
                      />
                    );
                  })}
                  {crossIndexedDocs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Publikasi Terindeks Ganda</p>
                      </div>
                    </div>
                  )}
                </div>
                <Pagination
                  totalItems={crossIndexedDocs?.length || 0}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                />
                </motion.div>
              ) : publicationSubTab === 'metriks' ? (
                <motion.div
                  key="metriks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-8"
                >
                {/* Header Banner */}
                <div className="p-6 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 border border-slate-200 dark:border-slate-800 rounded-[2rem] relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Panduan Metriks Penilaian KPI (SINTA & Institusi)</h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                        Sistem menghitung poin secara otomatis dari publikasi terindeks Scopus & Google Scholar, serta dokumen internal (HKI, Buku, dan Penelitian) yang telah disetujui.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest block text-center shadow-md shadow-primary-500/20">
                        Sesuai Kebijakan KPI Terbaru
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
                </div>

                {/* Grid 1: Scopus */}
                <div className="grid grid-cols-1 gap-8">
                  {/* Card 1: Scopus Article - New Matrix Structure */}
                  <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                        <Book className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Matriks Penilaian KPI Publikasi</h4>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Sistem distribusi poin berdasarkan peran dan koresponden penulis</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Section 1: Single Author */}
                      <div className="bg-gradient-to-r from-violet-50/50 to-white dark:from-violet-950/10 dark:to-slate-950 rounded-2xl border border-violet-100 dark:border-violet-900/30 p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-1 h-8 bg-violet-500 rounded-full"></div>
                          <h5 className="text-sm font-black text-violet-700 dark:text-violet-400 uppercase tracking-wider">Single Author</h5>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-violet-200 dark:border-violet-800/50">
                                <th className="pb-3 pl-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                                <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Base SKS</th>
                                <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Jumlah Penulis</th>
                                <th className="pb-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="pb-3 pr-2 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <tr className="bg-violet-100/50 dark:bg-violet-900/10">
                                <td className="py-3 pl-2">Semua</td>
                                <td className="py-3 text-right">100%</td>
                                <td className="py-3 text-right">1</td>
                                <td className="py-3 text-violet-700 dark:text-violet-400 font-black">Single Author</td>
                                <td className="py-3 pr-2 text-right font-black text-violet-700 dark:text-violet-400">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Section 2: Author = 2 */}
                      <div className="bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-950/10 dark:to-slate-950 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                          <h5 className="text-sm font-black text-orange-700 dark:text-orange-400 uppercase tracking-wider">Jumlah Penulis = 2</h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Sub-Section 2a: First = Corresponding */}
                          <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-orange-100 dark:border-orange-900/20">
                            <h6 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              First = Corresponding
                            </h6>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  <tr>
                                    <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First + Corresponding</td>
                                    <td className="py-3 text-right font-black">60%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3">Member</td>
                                    <td className="py-3 text-right font-black">40%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Sub-Section 2b: First ≠ Corresponding */}
                          <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20">
                            <h6 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              First ≠ Corresponding
                            </h6>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Persentase</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  <tr>
                                    <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First Author</td>
                                    <td className="py-3 text-right font-black">50%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 text-blue-700 dark:text-blue-400 font-bold">Member + Corresponding</td>
                                    <td className="py-3 text-right font-black">50%</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Author > 2 */}
                      <div className="bg-gradient-to-r from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-slate-950 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                          <h5 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Jumlah Penulis &gt; 2</h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Sub-Section 3a: First = Corresponding */}
                          <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/20">
                            <h6 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              First = Corresponding
                            </h6>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  <tr>
                                    <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First + Corresponding</td>
                                    <td className="py-3 font-black">60%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3">Member</td>
                                    <td className="py-3 font-black">(40% / n-1)</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Sub-Section 3b: First ≠ Corresponding */}
                          <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5 border border-purple-100 dark:border-purple-900/20">
                            <h6 className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              First ≠ Corresponding
                            </h6>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  <tr>
                                    <td className="py-3 text-orange-700 dark:text-orange-400 font-bold">First Author</td>
                                    <td className="py-3 font-black">40%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 text-blue-700 dark:text-blue-400 font-bold">Member + Corresponding</td>
                                    <td className="py-3 font-black">40%</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3">Member</td>
                                    <td className="py-3 font-black">(20% / n-2)</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Fallback */}
                      <div className="bg-gradient-to-r from-red-50/50 to-white dark:from-red-950/10 dark:to-slate-950 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                          <h5 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Fallback (Corresponding Tidak Ditemukan)</h5>
                        </div>
                        <div className="bg-white dark:bg-slate-900/70 rounded-xl p-5">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                                  <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                  <th className="pb-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Persentase</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <tr className="bg-red-50/60 dark:bg-red-900/10">
                                  <td className="py-3 text-red-700 dark:text-red-400 font-black">First Author</td>
                                  <td className="py-3 font-black text-red-700 dark:text-red-400">60%</td>
                                </tr>
                                <tr className="bg-red-50/60 dark:bg-red-900/10">
                                  <td className="py-3 text-red-700 dark:text-red-400">Member</td>
                                  <td className="py-3 font-black text-red-700 dark:text-red-400">(40% / n-1)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Scopus Non-Article & Citations */}
                  <div className="space-y-6">
                    {/* Non-Article Card */}
                    <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Scopus Non-Article</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proceeding, Review, Book Chapter, dll.</p>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Kategori Peran</th>
                              <th className="pb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Poin KPI</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <tr>
                              <td className="py-3">Single Author</td>
                              <td className="py-3 text-right text-blue-600 font-black">30</td>
                            </tr>
                            <tr>
                              <td className="py-3">First Author (Penulis Utama)</td>
                              <td className="py-3 text-right text-blue-600 font-black">18</td>
                            </tr>
                            <tr>
                              <td className="py-3">Member Author (Anggota)</td>
                              <td className="py-3 text-right text-blue-600 font-black">12 ÷ n</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>

                    {/* Citations Card */}
                    <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
                          <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Metriks Sitasi Scopus</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dampak ilmiah publikasi Scopus</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
                          <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-600 text-[10px] font-black">1</div>
                          <div>
                            <p className="text-xs font-black text-emerald-800 dark:text-emerald-400">Poin Sitasi Terbagi</p>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Setiap sitasi bernilai 1 poin dan dibagi secara proporsional dengan jumlah penulis. (Poin = Citasi / Penulis)
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex items-start gap-3">
                          <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-purple-600 text-[10px] font-black">2</div>
                          <div>
                            <p className="text-xs font-black text-purple-800 dark:text-purple-400">Bonus Dokumen Tersitasi</p>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              Dokumen yang memiliki minimal 1 sitasi mendapatkan tambahan bonus flat sebesar **+5 Poin**.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Scholar Card */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                      <Globe className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Google Scholar (GS)</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Matriks Penyelarasan Publikasi Google Scholar</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Poin Per Dokumen Scholar (GS Document)</span>
                      <span className="text-blue-600 font-black">0.5 Pts</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Bonus Dokumen Tersitasi (Citations &gt; 0)</span>
                      <span className="text-blue-600 font-black">0.5 Pts</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400">Poin Per Sitasi (GS Citation)</span>
                      <span className="text-blue-600 font-black">0.25 Pts</span>
                    </div>
                    <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                      <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Ketentuan Batas Maksimal (Cut Off)</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Penghitungan poin dari jumlah sitasi dibatasi maksimal (cut-off) pada **500 sitasi** per dokumen publikasi.
                      </p>
                      <div className="mt-2.5 inline-block px-3 py-1.5 bg-blue-600/10 rounded-xl text-[9px] font-black text-blue-700 dark:text-blue-400">
                        Poin = 0.5 + (Citations &gt; 0 ? 0.5 : 0) + (Min(Citations, 500) * 0.25)
                      </div>
                    </div>
                  </div>
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
