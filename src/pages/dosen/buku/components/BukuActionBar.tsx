import React from 'react';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface BukuActionBarProps {
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

export default function BukuActionBar({
  onUploadClick,
  onDownloadTemplate,
  onImportExcel,
  isImporting
}: BukuActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 shadow-xs rounded-2xl lg:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6"
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
        <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-xs shrink-0">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Kelola Buku Referensi & Ajar
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registrasikan buku baru atau impor data dari Excel secara massal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 justify-end">
        <button
          onClick={onUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        >
          Unggah Buku Baru
        </button>
        <button 
          type="button"
          onClick={onDownloadTemplate}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 mr-1.5 shrink-0" />
          Template
        </button>
        <label className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-3 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 shadow-xs cursor-pointer whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
          <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0 text-slate-500 dark:text-slate-400" />
          {isImporting ? 'Mengimpor...' : 'Import Excel'}
          <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
        </label>
      </div>
    </motion.div>
  );
}

