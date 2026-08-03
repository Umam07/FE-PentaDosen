import React, { useMemo } from 'react';
import { MailCheck, FileText, Award, RotateCcw, Globe, Upload, Zap, Download, FileSpreadsheet } from 'lucide-react';

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
  crossIndexedOnly?: boolean;
  setCrossIndexedOnly?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onResetPage: () => void;
  // Props aksi toolbar publikasi (penggabungan section aksi dan filter)
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  showFilters?: boolean;
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
  crossIndexedOnly = false,
  setCrossIndexedOnly,
  onResetPage,
  onUploadClick,
  onDownloadTemplate,
  onImportExcel,
  isImporting,
  showFilters = true,
}) => {
  // Filter hanya dokumen Jurnal Internasional/Nasional untuk penghitungan indikator filter
  const jiDocs = useMemo(() => {
    return documents.filter(
      (d: any) =>
        (d.category || '').toLowerCase() === 'jurnal internasional' ||
        (d.category || '').toLowerCase() === 'jurnal nasional' ||
        d.source === 'scopus'
    );
  }, [documents]);

  // Penghitungan status korespondensi
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

  // Penghitungan tipe artikel
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

  // Penghitungan Quartile
  const quartileCounts = useMemo(() => {
    const total = jiDocs.length;
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;
    let none = 0;

    jiDocs.forEach((d: any) => {
      const q = (d.quartile || '').toUpperCase();
      if (q === 'Q1') q1++;
      else if (q === 'Q2') q2++;
      else if (q === 'Q3') q3++;
      else if (q === 'Q4') q4++;
      else none++;
    });

    return { total, Q1: q1, Q2: q2, Q3: q3, Q4: q4, None: none };
  }, [jiDocs]);

  // Penghitungan Sumber Data
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

  // Hitung jumlah filter yang sedang aktif
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (scopusFilter !== 'all') count++;
    if (articleFilter !== 'all') count++;
    if (quartileFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (crossIndexedOnly) count++;
    return count;
  }, [scopusFilter, articleFilter, quartileFilter, sourceFilter, crossIndexedOnly]);

  const handleResetAll = () => {
    setScopusFilter('all');
    setArticleFilter('all');
    setQuartileFilter('all');
    setSourceFilter('all');
    if (setCrossIndexedOnly) setCrossIndexedOnly(false);
    onResetPage();
  };

  // Class warna netral untuk chip filter yang aktif (sesuai ketentuan Poin 4)
  const neutralActiveChipClass =
    'bg-slate-900 border-slate-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-xs';
  const inactiveChipClass =
    'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs">
      {/* Baris Atas: Judul Singkat & 3 Tombol Aksi Rata Kanan */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
                Kelola & Filter Publikasi
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                  {activeFiltersCount} Filter Aktif
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
              Registrasi publikasi baru, impor massal, atau saring data
            </p>
          </div>
        </div>

        {/* 3 Tombol Aksi Rata Kanan */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 whitespace-nowrap"
          >
            Unggah Publikasi Baru
          </button>
          <button 
            type="button"
            onClick={onDownloadTemplate}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-black bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-700 dark:text-zinc-300 shadow-xs uppercase tracking-wider whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            Template
          </button>
          <label className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-black bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-xs cursor-pointer uppercase tracking-wider whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
          </label>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-zinc-800 transition-colors shrink-0"
              title="Hapus Semua Filter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Baris Bawah: Filter Chips per Grup (tanpa heading besar) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 pt-1">
          {/* 1. Status Korespondensi */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <MailCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Status Korespondensi</span>
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
                    className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                      isActive
                        ? neutralActiveChipClass
                        : opt.highlight
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                        : inactiveChipClass
                    }`}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-100'
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
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Tipe Artikel</span>
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
                    className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                      isActive ? neutralActiveChipClass : inactiveChipClass
                    }`}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-100'
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
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Quartile Jurnal</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Semua', count: quartileCounts.total },
                { id: 'Q1', label: 'Q1', count: quartileCounts.Q1 },
                { id: 'Q2', label: 'Q2', count: quartileCounts.Q2 },
                { id: 'Q3', label: 'Q3', count: quartileCounts.Q3 },
                { id: 'Q4', label: 'Q4', count: quartileCounts.Q4 },
                { id: 'None', label: 'Non-Q', count: quartileCounts.None },
              ].map((opt) => {
                const isActive = quartileFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setQuartileFilter(opt.id as QuartileFilterType);
                      onResetPage();
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                      isActive ? neutralActiveChipClass : inactiveChipClass
                    }`}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-100'
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

          {/* 4. Sumber Data */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
              <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Sumber Data</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Semua', count: sourceCounts.total },
                { id: 'external', label: '🌐 External API', count: sourceCounts.external },
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
                    className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                      isActive ? neutralActiveChipClass : inactiveChipClass
                    }`}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-100'
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
      )}
    </div>
  );
};

export default ScopusFiltersBar;