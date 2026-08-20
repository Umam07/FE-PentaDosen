import React from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface HKIActionBarProps {
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

export default function HKIActionBar({
  onUploadClick,
  onDownloadTemplate,
  onImportExcel,
  isImporting
}: HKIActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark shadow-2xs rounded-2xl sm:rounded-3xl border border-hairline-light dark:border-hairline-dark p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6"
    >
      <div className="flex items-center gap-3.5 w-full lg:w-auto">
        <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
          <Upload className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">Kelola Dokumen HKI Anda</h2>
          <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">Registrasikan HKI baru atau impor data dari Excel secara massal</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
        <button
          type="button"
          onClick={onUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        >
          Unggah HKI Baru
        </button>
        <button 
          type="button"
          onClick={onDownloadTemplate}
          className="w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
          Template
        </button>
        <label className={`w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2.5 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs cursor-pointer whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
          <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
          {isImporting ? 'Mengimpor...' : 'Import Excel'}
          <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
        </label>
      </div>
    </motion.div>
  );
}

