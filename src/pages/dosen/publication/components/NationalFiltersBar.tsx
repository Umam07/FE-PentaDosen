import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, BookOpen } from 'lucide-react';
import FilterDropdown, { FilterOption } from './FilterDropdown';

import type { SintaFilterType, SourceFilterType, ScopusFilterType } from '../types/publication.types';
export type { SintaFilterType, SourceFilterType, ScopusFilterType };

interface NationalFiltersBarProps {
  documents: any[];
  sintaFilter: SintaFilterType;
  setSintaFilter: (val: SintaFilterType) => void;
  sourceFilter: SourceFilterType;
  setSourceFilter: (val: SourceFilterType) => void;
  correspondenceFilter: ScopusFilterType;
  setCorrespondenceFilter: (val: ScopusFilterType) => void;
  crossIndexedOnly?: boolean;
  setCrossIndexedOnly?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onResetPage: () => void;

  // Props aksi toolbar publikasi
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  showFilters?: boolean;
}

export const NationalFiltersBar: React.FC<NationalFiltersBarProps> = ({
  documents,
  sintaFilter,
  setSintaFilter,
  sourceFilter,
  setSourceFilter,
  correspondenceFilter,
  setCorrespondenceFilter,
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

  // Filter hanya dokumen Jurnal Nasional untuk penghitungan indikator filter
  const jnDocs = useMemo(() => {
    return (documents || []).filter((d: any) =>
      String(d.category || '').toLowerCase().includes('jurnal nasional')
    );
  }, [documents]);

  // Penghitungan status korespondensi
  const correspondenceCounts = useMemo(() => {
    const total = jnDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    jnDocs.forEach((d: any) => {
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
    });

    return { total, unconfirmed, confirmed };
  }, [jnDocs]);

  // Penghitungan SINTA Rank
  const sintaCounts = useMemo(() => {
    const total = jnDocs.length;
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let s5 = 0;
    let s6 = 0;
    let nonSinta = 0;

    jnDocs.forEach((d: any) => {
      const rank = String(d.sinta_rank || 'Non-SINTA').toUpperCase();
      if (rank === 'S1') s1++;
      else if (rank === 'S2') s2++;
      else if (rank === 'S3') s3++;
      else if (rank === 'S4') s4++;
      else if (rank === 'S5') s5++;
      else if (rank === 'S6') s6++;
      else nonSinta++;
    });

    return { total, S1: s1, S2: s2, S3: s3, S4: s4, S5: s5, S6: s6, NonSinta: nonSinta };
  }, [jnDocs]);

  // Penghitungan Sumber Data
  const sourceCounts = useMemo(() => {
    const total = jnDocs.length;
    let external = 0;
    let manual = 0;

    jnDocs.forEach((d: any) => {
      if (['scopus', 'scholar', 'sinta', 'garuda'].includes(d.source)) {
        external++;
      } else {
        manual++;
      }
    });

    return { total, external, manual };
  }, [jnDocs]);

  // Data opsi untuk masing-masing dropdown filter
  const statusOptions: FilterOption[] = useMemo(
    () => [
      { id: 'all', label: 'Semua', count: correspondenceCounts.total },
      { id: 'unconfirmed', label: 'Perlu Konfirmasi', count: correspondenceCounts.unconfirmed, isUrgent: true },
      { id: 'confirmed', label: 'Terkonfirmasi', count: correspondenceCounts.confirmed },
    ],
    [correspondenceCounts]
  );

  const sintaOptions: FilterOption[] = useMemo(
    () => [
      { id: 'all', label: 'Semua Akreditasi', count: sintaCounts.total },
      { id: 'S1', label: 'SINTA 1 (S1)', count: sintaCounts.S1 },
      { id: 'S2', label: 'SINTA 2 (S2)', count: sintaCounts.S2 },
      { id: 'S3', label: 'SINTA 3 (S3)', count: sintaCounts.S3 },
      { id: 'S4', label: 'SINTA 4 (S4)', count: sintaCounts.S4 },
      { id: 'S5', label: 'SINTA 5 (S5)', count: sintaCounts.S5 },
      { id: 'S6', label: 'SINTA 6 (S6)', count: sintaCounts.S6 },
      { id: 'Non-SINTA', label: 'Non-SINTA', count: sintaCounts.NonSinta },
    ],
    [sintaCounts]
  );

  const sourceOptions: FilterOption[] = useMemo(
    () => [
      { id: 'all', label: 'Semua', count: sourceCounts.total },
      { id: 'external', label: '🌐 External API', count: sourceCounts.external },
      { id: 'manual', label: '✍️ Input Manual', count: sourceCounts.manual },
    ],
    [sourceCounts]
  );

  // Hitung jumlah filter yang sedang aktif
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (correspondenceFilter !== 'all') count++;
    if (sintaFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (crossIndexedOnly) count++;
    return count;
  }, [correspondenceFilter, sintaFilter, sourceFilter, crossIndexedOnly]);

  // Menandakan apakah ada filter yang berbeda dari default "Semua"
  const hasActiveFilter = useMemo(() => {
    return (
      correspondenceFilter !== 'all' ||
      sintaFilter !== 'all' ||
      sourceFilter !== 'all' ||
      crossIndexedOnly
    );
  }, [correspondenceFilter, sintaFilter, sourceFilter, crossIndexedOnly]);

  const handleResetAll = () => {
    setCorrespondenceFilter('all');
    setSintaFilter('all');
    setSourceFilter('all');
    if (setCrossIndexedOnly) setCrossIndexedOnly(false);
    onResetPage();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs">
      {/* Baris Atas: Judul Singkat & 3 Tombol Aksi Rata Kanan */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
                Kelola & Filter Jurnal Nasional
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
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
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
          <label className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-black bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-700 dark:text-zinc-300 shadow-xs cursor-pointer uppercase tracking-wider whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 shrink-0 text-slate-500 dark:text-zinc-400" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input
              type="file"
              accept=".xlsx, .xls"
              className="sr-only"
              onChange={onImportExcel}
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      {/* Baris Bawah: Row Dropdown Filter Flat */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Container Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Dropdown Status Korespondensi */}
            <FilterDropdown
              categoryLabel="Status"
              options={statusOptions}
              activeValue={correspondenceFilter}
              isOpen={openDropdownId === 'status'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'status' : null)}
              onSelectOption={(val) => {
                setCorrespondenceFilter(val as ScopusFilterType);
                onResetPage();
              }}
            />

            {/* 2. Dropdown Akreditasi SINTA */}
            <FilterDropdown
              categoryLabel="Akreditasi SINTA"
              options={sintaOptions}
              activeValue={sintaFilter}
              isOpen={openDropdownId === 'sinta'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'sinta' : null)}
              onSelectOption={(val) => {
                setSintaFilter(val as SintaFilterType);
                onResetPage();
              }}
            />

            {/* 3. Dropdown Sumber Data */}
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

          {/* Tombol teks "Reset Filter" di ujung kanan row */}
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

export default NationalFiltersBar;

