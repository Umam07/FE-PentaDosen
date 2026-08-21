import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, BookOpen, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
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

  // Props konfirmasi SINTA terintegrasi
  unconfirmedDocs?: any[];
  onBulkConfirmAllNotCorresponding?: () => Promise<void>;
  onOpenBulkModal?: () => void;
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
  unconfirmedDocs = [],
  onBulkConfirmAllNotCorresponding,
  onOpenBulkModal,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isSettingAllFalse, setIsSettingAllFalse] = useState(false);

  const handleSetAllFalse = async () => {
    if (!onBulkConfirmAllNotCorresponding) return;
    setIsSettingAllFalse(true);
    try {
      await onBulkConfirmAllNotCorresponding();
    } finally {
      setIsSettingAllFalse(false);
    }
  };

  // Filter hanya dokumen Jurnal Nasional untuk penghitungan indikator filter
  const jnDocs = useMemo(() => {
    return (documents || []).filter((d: any) =>
      String(d.category || '').toLowerCase().includes('jurnal nasional')
    );
  }, [documents]);

  // Penghitungan status konfirmasi SINTA
  const sintaConfirmationCounts = useMemo(() => {
    const total = jnDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    jnDocs.forEach((d: any) => {
      if (!d.is_sinta_confirmed) {
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
      { id: 'all', label: 'Semua Status', count: sintaConfirmationCounts.total },
      { id: 'unconfirmed', label: 'Perlu Konfirmasi SINTA', count: sintaConfirmationCounts.unconfirmed },
      { id: 'confirmed', label: 'Terkonfirmasi SINTA', count: sintaConfirmationCounts.confirmed },
    ],
    [sintaConfirmationCounts]
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
      { id: 'external', label: 'External API', count: sourceCounts.external },
      { id: 'manual', label: 'Input Manual', count: sourceCounts.manual },
    ],
    [sourceCounts]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (correspondenceFilter !== 'all') count++;
    if (sintaFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (crossIndexedOnly) count++;
    return count;
  }, [correspondenceFilter, sintaFilter, sourceFilter, crossIndexedOnly]);

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
    <div className="bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Baris Atas: Judul Singkat & 3 Tombol Aksi Rata Kanan */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 pb-3.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                Kelola &amp; Filter Jurnal Nasional
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-surface-light-raised text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                  {activeFiltersCount} Filter Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Registrasi publikasi baru, impor massal, atau saring data
            </p>
          </div>
        </div>

        {/* 3 Tombol Aksi Rata Kanan */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Unggah Publikasi Baru
          </button>
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
            Template
          </button>
          <label className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs cursor-pointer whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
            {isImporting ? 'Mengimpor...' : 'Import Excel'}
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
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
          {/* Container Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Dropdown Status SINTA */}
            <FilterDropdown
              categoryLabel="Status SINTA"
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
              className="text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors ml-auto underline-offset-4 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* Strip Konfirmasi Akreditasi SINTA Terintegrasi */}
      {unconfirmedDocs && unconfirmedDocs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border border-warning-border/60 dark:border-warning/30 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs text-body-strong dark:text-on-dark truncate">
              <strong className="font-bold text-ink-heading dark:text-on-dark font-mono">{unconfirmedDocs.length}</strong> publikasi Jurnal Nasional perlu konfirmasi Akreditasi SINTA
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              disabled={isSettingAllFalse}
              onClick={handleSetAllFalse}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
              title="Satu klik untuk konfirmasi status SINTA pada seluruh dokumen ini menjadi Non-SINTA"
            >
              {isSettingAllFalse ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                  <span>Set Semua: Non-SINTA</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBulkModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark shrink-0" />
              <span>Konfirmasi SINTA Massal ({unconfirmedDocs.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NationalFiltersBar;
