import React, { useMemo } from 'react';
import { MailCheck, Award, RotateCcw, Globe, Upload, Download, FileSpreadsheet, BookOpen } from 'lucide-react';
import type { SintaFilterType, SourceFilterType, ScopusFilterType } from '../types/publication.types';

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
  // Filter khusus dokumen Jurnal Nasional
  const jnDocs = useMemo(() => {
    return (documents || []).filter(
      (d: any) =>
        String(d.category || '').toLowerCase().includes('jurnal nasional') ||
        d.source === 'scholar' ||
        d.source === 'sinta' ||
        d.source === 'garuda'
    );
  }, [documents]);

  // Penghitungan Akreditasi SINTA
  const sintaCounts = useMemo(() => {
    const total = jnDocs.length;
    let s1 = 0, s2 = 0, s3 = 0, s4 = 0, s5 = 0, s6 = 0, nonSinta = 0;

    jnDocs.forEach((d: any) => {
      const rank = String(d.sinta_rank || '').toUpperCase();
      if (rank === 'S1') s1++;
      else if (rank === 'S2') s2++;
      else if (rank === 'S3') s3++;
      else if (rank === 'S4') s4++;
      else if (rank === 'S5') s5++;
      else if (rank === 'S6') s6++;
      else nonSinta++;
    });

    return { total, S1: s1, S2: s2, S3: s3, S4: s4, S5: s5, S6: s6, 'Non-SINTA': nonSinta };
  }, [jnDocs]);

  // Penghitungan Sumber Data
  const sourceCounts = useMemo(() => {
    const total = jnDocs.length;
    let external = 0;
    let manual = 0;

    jnDocs.forEach((d: any) => {
      if (d.source === 'scholar' || d.source === 'sinta' || d.source === 'garuda') {
        external++;
      } else {
        manual++;
      }
    });

    return { total, external, manual };
  }, [jnDocs]);

  // Penghitungan Korespondensi
  const correspondenceCounts = useMemo(() => {
    const total = jnDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    jnDocs.forEach((d: any) => {
      const subtypeStr = String(d.subtype || '').toLowerCase();
      const isArticle = !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
      const totalAuthors = Number(d.total_authors) || 1;

      if (isArticle && totalAuthors > 1 && !d.is_corresponding_confirmed) {
        unconfirmed++;
      } else {
        confirmed++;
      }
    });

    return { total, unconfirmed, confirmed };
  }, [jnDocs]);


  // Hitung filter aktif
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sintaFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (correspondenceFilter !== 'all') count++;
    if (crossIndexedOnly) count++;
    return count;
  }, [sintaFilter, sourceFilter, correspondenceFilter, crossIndexedOnly]);

  const handleResetAll = () => {
    setSintaFilter('all');
    setSourceFilter('all');
    setCorrespondenceFilter('all');
    if (setCrossIndexedOnly) setCrossIndexedOnly(false);
    onResetPage();
  };

  const neutralActiveChipClass =
    'bg-slate-900 border-slate-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-xs';
  const inactiveChipClass =
    'bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs">
      {/* Baris Atas: Action Bar */}
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
              Filter akreditasi SINTA, sumber data publikasi nasional, dan korespondensi
            </p>
          </div>
        </div>

        {/* 3 Tombol Aksi */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 shrink-0" />
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
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={onImportExcel}
              className="hidden"
              disabled={isImporting}
            />
          </label>
        </div>
      </div>

      {/* Section Filter Chips */}
      {showFilters && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Filter 1: Akreditasi SINTA */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  Akreditasi SINTA
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                  {sintaCounts.total} Dokumen
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Non-SINTA'] as SintaFilterType[]).map((val) => {
                  const isActive = sintaFilter === val;
                  const count = val === 'all' ? sintaCounts.total : sintaCounts[val];
                  const labelMap: Record<string, string> = {
                    all: 'Semua',
                    'Non-SINTA': 'Non-SINTA',
                  };
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setSintaFilter(val);
                        onResetPage();
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                        isActive ? neutralActiveChipClass : inactiveChipClass
                      }`}
                    >
                      <span>{labelMap[val] || val}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white dark:bg-black/20' : 'bg-slate-200/60 dark:bg-zinc-700/60 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 2: Sumber Data */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary-500" />
                  Sumber Data
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                  {sourceCounts.total} Dokumen
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Semua', count: sourceCounts.total },
                  { id: 'external', label: 'Google Scholar / SINTA', count: sourceCounts.external },
                  { id: 'manual', label: 'Input Manual', count: sourceCounts.manual },
                ].map((item) => {
                  const isActive = sourceFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSourceFilter(item.id as SourceFilterType);
                        onResetPage();
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                        isActive ? neutralActiveChipClass : inactiveChipClass
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white dark:bg-black/20' : 'bg-slate-200/60 dark:bg-zinc-700/60 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Status Korespondensi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <MailCheck className="w-3.5 h-3.5 text-amber-500" />
                  Status Korespondensi
                </label>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                  {correspondenceCounts.total} Dokumen
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Semua', count: correspondenceCounts.total },
                  { id: 'unconfirmed', label: 'Belum Konfirmasi', count: correspondenceCounts.unconfirmed },
                  { id: 'confirmed', label: 'Sudah Konfirmasi', count: correspondenceCounts.confirmed },
                ].map((item) => {
                  const isActive = correspondenceFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCorrespondenceFilter(item.id as ScopusFilterType);
                        onResetPage();
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                        isActive ? neutralActiveChipClass : inactiveChipClass
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white dark:bg-black/20' : 'bg-slate-200/60 dark:bg-zinc-700/60 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Reset Filter Button */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NationalFiltersBar;
