import React, { useMemo } from 'react';
import { MailCheck, FileText, Award, RotateCcw, SlidersHorizontal, Globe, Database } from 'lucide-react';

export type ScopusFilterType = 'all' | 'unconfirmed' | 'confirmed';
export type ArticleFilterType = 'all' | 'article' | 'non-article';
export type QuartileFilterType = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'None';
export type SourceFilterType = 'all' | 'external' | 'manual';

interface ScopusFiltersBarProps {
  documents: any[];
  scopusFilter: ScopusFilterType;
  setScopusFilter: (val: ScopusFilterType) => void;
  articleFilter: ArticleFilterType;
  setArticleFilter: (val: ArticleFilterType) => void;
  quartileFilter: QuartileFilterType;
  setQuartileFilter: (val: QuartileFilterType) => void;
  sourceFilter: SourceFilterType;
  setSourceFilter: (val: SourceFilterType) => void;
  onResetPage: () => void;
}

export const ScopusFiltersBar: React.FC<ScopusFiltersBarProps> = ({
  documents,
  scopusFilter,
  setScopusFilter,
  articleFilter,
  setArticleFilter,
  quartileFilter,
  setQuartileFilter,
  sourceFilter,
  setSourceFilter,
  onResetPage,
}) => {
  // Filter only Jurnal Internasional documents for counter accuracy
  const jiDocs = useMemo(() => {
    return documents.filter(
      (d: any) => (d.category || '').toLowerCase() === 'jurnal internasional'
    );
  }, [documents]);

  // Correspondence Counts
  const correspondenceCounts = useMemo(() => {
    const total = jiDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    jiDocs.forEach((d: any) => {
      if (d.source === 'scopus') {
        const isArticle =
          !d.subtype ||
          d.subtype.toLowerCase() === 'ar' ||
          d.subtype.toLowerCase() === 'article';
        const totalAuthors = Number(d.total_authors) || 1;

        if (isArticle && totalAuthors > 1 && !d.is_corresponding_confirmed) {
          unconfirmed++;
        } else {
          confirmed++;
        }
      } else {
        confirmed++;
      }
    });

    return { total, unconfirmed, confirmed };
  }, [jiDocs]);

  // Article Type Counts
  const typeCounts = useMemo(() => {
    const total = jiDocs.length;
    let article = 0;
    let nonArticle = 0;

    jiDocs.forEach((d: any) => {
      if (d.source === 'scopus') {
        const isArt =
          !d.subtype ||
          d.subtype.toLowerCase() === 'ar' ||
          d.subtype.toLowerCase() === 'article';
        if (isArt) article++;
        else nonArticle++;
      } else {
        article++;
      }
    });

    return { total, article, nonArticle };
  }, [jiDocs]);

  // Quartile Counts
  const quartileCounts = useMemo(() => {
    const total = jiDocs.length;
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;
    let none = 0;

    jiDocs.forEach((d: any) => {
      const q = d.quartile && ['Q1', 'Q2', 'Q3', 'Q4'].includes(d.quartile) ? d.quartile : 'None';
      if (q === 'Q1') q1++;
      else if (q === 'Q2') q2++;
      else if (q === 'Q3') q3++;
      else if (q === 'Q4') q4++;
      else none++;
    });

    return { total, Q1: q1, Q2: q2, Q3: q3, Q4: q4, None: none };
  }, [jiDocs]);

  // Source Counts
  const sourceCounts = useMemo(() => {
    const total = jiDocs.length;
    let external = 0;
    let manual = 0;

    jiDocs.forEach((d: any) => {
      if (d.source === 'scopus' || d.source === 'scholar') {
        external++;
      } else {
        manual++;
      }
    });

    return { total, external, manual };
  }, [jiDocs]);

  const activeFiltersCount =
    (scopusFilter !== 'all' ? 1 : 0) +
    (articleFilter !== 'all' ? 1 : 0) +
    (quartileFilter !== 'all' ? 1 : 0) +
    (sourceFilter !== 'all' ? 1 : 0);

  const handleResetAll = () => {
    setScopusFilter('all');
    setArticleFilter('all');
    setQuartileFilter('all');
    setSourceFilter('all');
    onResetPage();
  };

  return (
    <div className="bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-sm p-4 sm:p-5 transition-all space-y-4">
      {/* Compact Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
                Filter Jurnal & Sumber Data
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  {activeFiltersCount} Filter Aktif
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Saring daftar publikasi berdasarkan sumber data (API vs Manual), status korespondensi, tipe artikel, dan quartile.
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hapus Semua Filter</span>
          </button>
        )}
      </div>

      {/* Filter Rows: 4 Horizontal Section Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Status Korespondensi */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <MailCheck className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Status Korespondensi</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua', count: correspondenceCounts.total },
              {
                id: 'unconfirmed',
                label: 'Perlu Konfirmasi',
                count: correspondenceCounts.unconfirmed,
                highlight: correspondenceCounts.unconfirmed > 0,
              },
              { id: 'confirmed', label: 'Terkonfirmasi', count: correspondenceCounts.confirmed },
            ].map((opt) => {
              const isActive = scopusFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setScopusFilter(opt.id as ScopusFilterType);
                    onResetPage();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? opt.id === 'unconfirmed'
                        ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                        : 'bg-orange-600 border-orange-600 text-white shadow-xs'
                      : opt.highlight
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                      : 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : opt.highlight
                        ? 'bg-amber-200/90 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tipe Artikel */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <FileText className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Tipe Artikel</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua Tipe', count: typeCounts.total },
              { id: 'article', label: 'Article / Journal', count: typeCounts.article },
              { id: 'non-article', label: 'Non-Article', count: typeCounts.nonArticle },
            ].map((opt) => {
              const isActive = articleFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setArticleFilter(opt.id as ArticleFilterType);
                    onResetPage();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Quartile Jurnal */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Quartile Jurnal</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua', count: quartileCounts.total, activeClass: 'bg-orange-600 border-orange-600 text-white shadow-xs' },
              { id: 'Q1', label: 'Q1', count: quartileCounts.Q1, activeClass: 'bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-500/20', badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
              { id: 'Q2', label: 'Q2', count: quartileCounts.Q2, activeClass: 'bg-blue-600 border-blue-600 text-white shadow-xs shadow-blue-500/20', badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' },
              { id: 'Q3', label: 'Q3', count: quartileCounts.Q3, activeClass: 'bg-amber-600 border-amber-600 text-white shadow-xs shadow-amber-500/20', badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' },
              { id: 'Q4', label: 'Q4', count: quartileCounts.Q4, activeClass: 'bg-purple-600 border-purple-600 text-white shadow-xs shadow-purple-500/20', badgeStyle: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' },
              { id: 'None', label: 'Non-Q', count: quartileCounts.None, activeClass: 'bg-slate-700 border-slate-700 text-white shadow-xs', badgeStyle: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' },
            ].map((opt) => {
              const isActive = quartileFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQuartileFilter(opt.id as QuartileFilterType);
                    onResetPage();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? opt.activeClass
                      : opt.badgeStyle
                      ? `${opt.badgeStyle} hover:opacity-90`
                      : 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Sumber Data (API External vs Input Manual) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Sumber Data</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Semua', count: sourceCounts.total },
              { id: 'external', label: '🌐 API External', count: sourceCounts.external },
              { id: 'manual', label: '✍️ Input Manual', count: sourceCounts.manual },
            ].map((opt) => {
              const isActive = sourceFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSourceFilter(opt.id as SourceFilterType);
                    onResetPage();
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScopusFiltersBar;