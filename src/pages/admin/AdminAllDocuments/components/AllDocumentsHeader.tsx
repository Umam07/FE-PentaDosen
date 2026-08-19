import React from 'react';
import { FileDown } from 'lucide-react';
import type { AllDocumentsHeaderProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsHeader({
  loading,
  hasData,
  onExportExcel
}: AllDocumentsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Semua Dokumen</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          Manajemen & Monitoring Seluruh Output Akademik
        </p>
      </div>
      <button
        onClick={onExportExcel}
        disabled={loading || !hasData}
        className="flex items-center justify-center px-5 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-xs text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
      >
        <FileDown className="h-4 w-4 mr-2 text-accent dark:text-accent-on-dark" />
        Export to Excel
      </button>
    </div>
  );
}
