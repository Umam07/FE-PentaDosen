import React, { useMemo, useState } from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import FilterDropdown, { FilterOption } from './FilterDropdown';

import type { ScopusFilterType, ArticleFilterType, QuartileFilterType, SourceFilterType } from '../types/publication.types';
export type { ScopusFilterType, ArticleFilterType, QuartileFilterType, SourceFilterType };

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
  // State untuk melacak ID dropdown mana yang sedang terbuka (agar hanya 1 yang terbuka di satu waktu)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Filter hanya dokumen Jurnal Internasional/Nasional untuk penghitungan indikator filter
  const jiDocs = useMemo(() => {
    return (documents || []).filter(
      (d: any) =>
        String(d.category || '').toLowerCase().includes('jurnal internasional') ||
        String(d.category || '').toLowerCase().includes('jurnal nasional') ||
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
        const subtypeStr = String(d.subtype || '').toLowerCase();
        const isArticle =
          !d.subtype ||
          subtypeStr === 'ar' ||
          subtypeStr === 'article';
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
        const subtypeStr = String(d.subtype || '').toLowerCase();
        const isArt =
          !d.subtype ||
          subtypeStr === 'ar' ||
          subtypeStr === 'article';
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
      const q = String(d.quartile || '').toUpperCase();
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

  // Data opsi untuk masing-masing dropdown filter
  const statusOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua', count: correspondenceCounts.total },
    { id: 'unconfirmed', label: 'Perlu Konfirmasi', count: correspondenceCounts.unconfirmed, isUrgent: true },
    { id: 'confirmed', label: 'Terkonfirmasi', count: correspondenceCounts.confirmed },
  ], [correspondenceCounts]);

  const articleOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Tipe', count: typeCounts.total },
    { id: 'article', label: 'Article / Journal', count: typeCounts.article },
    { id: 'non-article', label: 'Non-Article', count: typeCounts.nonArticle },
  ], [typeCounts]);

  const quartileOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua', count: quartileCounts.total },
    { id: 'Q1', label: 'Q1', count: quartileCounts.Q1 },
    { id: 'Q2', label: 'Q2', count: quartileCounts.Q2 },
    { id: 'Q3', label: 'Q3', count: quartileCounts.Q3 },
    { id: 'Q4', label: 'Q4', count: quartileCounts.Q4 },
    { id: 'None', label: 'Non-Q', count: quartileCounts.None },
  ], [quartileCounts]);

  const sourceOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua', count: sourceCounts.total },
    { id: 'external', label: '🌐 External API', count: sourceCounts.external },
    { id: 'manual', label: '✍️ Input Manual', count: sourceCounts.manual },
  ], [sourceCounts]);

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

  // Menandakan apakah ada filter yang berbeda dari default "Semua"
  const hasActiveFilter = useMemo(() => {
    return scopusFilter !== 'all' || articleFilter !== 'all' || quartileFilter !== 'all' || sourceFilter !== 'all' || crossIndexedOnly;
  }, [scopusFilter, articleFilter, quartileFilter, sourceFilter, crossIndexedOnly]);

  const handleResetAll = () => {
    setScopusFilter('all');
    setArticleFilter('all');
    setQuartileFilter('all');
    setSourceFilter('all');
    if (setCrossIndexedOnly) setCrossIndexedOnly(false);
    onResetPage();
  };

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

        {/* 2 Tombol Aksi & Import Excel Rata Kanan */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Unggah Publikasi Baru
          </button>
          <button 
            type="button"
            onClick={onDownloadTemplate}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-black bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-700 dark:text-zinc-300 shadow-xs uppercase tracking-wider whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            Template
          </button>
          {/* Tombol Import Excel disamakan dengan Template (border-slate-200, bg transparan/putih, text-slate-700) */}
          <label className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-black bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-700 dark:text-zinc-300 shadow-xs cursor-pointer uppercase tracking-wider whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 shrink-0 text-slate-500 dark:text-zinc-400" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
          </label>
        </div>
      </div>

      {/* Baris Bawah: Row 4 Dropdown Filter Flat */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Container 4 Filter Dropdown (flex-wrap dengan gap konsisten gap-3) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Dropdown Status Korespondensi */}
            <FilterDropdown
              categoryLabel="Status"
              options={statusOptions}
              activeValue={scopusFilter}
              isOpen={openDropdownId === 'status'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'status' : null)}
              onSelectOption={(val) => {
                setScopusFilter(val as ScopusFilterType);
                onResetPage();
              }}
            />

            {/* 2. Dropdown Tipe Artikel */}
            <FilterDropdown
              categoryLabel="Tipe Artikel"
              options={articleOptions}
              activeValue={articleFilter}
              isOpen={openDropdownId === 'article'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'article' : null)}
              onSelectOption={(val) => {
                setArticleFilter(val as ArticleFilterType);
                onResetPage();
              }}
            />

            {/* 3. Dropdown Quartile Jurnal */}
            <FilterDropdown
              categoryLabel="Quartile Jurnal"
              options={quartileOptions}
              activeValue={quartileFilter}
              isOpen={openDropdownId === 'quartile'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'quartile' : null)}
              onSelectOption={(val) => {
                setQuartileFilter(val as QuartileFilterType);
                onResetPage();
              }}
            />

            {/* 4. Dropdown Sumber Data */}
            <FilterDropdown
              categoryLabel="Sumber Data"
              options={sourceOptions}
              activeValue={sourceFilter}
              isOpen={openDropdownId === 'source'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'source' : null)}
              onSelectOption={(val) => {
                setSourceFilter(val as SourceFilterType);
                onResetPage();
              }}
            />
          </div>

          {/* Tombol teks "Reset Filter" di ujung kanan row, warna neutral slate dengan underline hover */}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors ml-auto underline-offset-4 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ScopusFiltersBar;