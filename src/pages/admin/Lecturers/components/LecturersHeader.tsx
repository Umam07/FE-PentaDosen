import React from 'react';
import { FileDown } from 'lucide-react';
import { LecturersHeaderProps } from '../types/lecturers.types';

export default function LecturersHeader({
  loading,
  exportDisabled,
  onExportExcel
}: LecturersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Database Dosen</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          Manajemen Database Dosen, Dokumen Akademik & Pemantauan Kinerja
        </p>
      </div>
      <button
        onClick={onExportExcel}
        disabled={loading || exportDisabled}
        className="flex items-center justify-center px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark transition-all disabled:opacity-40 active:scale-95 cursor-pointer shadow-xs"
      >
        <FileDown className="h-4 w-4 mr-2 text-accent dark:text-accent-on-dark" />
        Export to excel
      </button>
    </div>
  );
}
