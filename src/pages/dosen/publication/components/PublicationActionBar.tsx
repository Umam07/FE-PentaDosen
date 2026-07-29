import React from 'react';
import { Upload, Zap, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicationActionBarProps {
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
}

export default function PublicationActionBar({
  onUploadClick,
  onDownloadTemplate,
  onImportExcel,
  isImporting
}: PublicationActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6"
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
        <div className="p-3 sm:p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm shrink-0">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight leading-tight">Kelola Publikasi Ilmiah Anda</h3>
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5 line-clamp-2">Registrasikan jurnal/prosiding baru atau impor data dari Excel secara massal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
        <button
          onClick={onUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 whitespace-nowrap"
        >
          Unggah Publikasi Baru
          <Zap className="w-4 h-4 ml-1.5 fill-white shrink-0" />
        </button>
        <button 
          type="button"
          onClick={onDownloadTemplate}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm uppercase tracking-wider whitespace-nowrap"
        >
          <Download className="w-4 h-4 mr-1.5 shrink-0" />
          Template
        </button>
        <label className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer uppercase tracking-wider whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
          <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0" />
          {isImporting ? 'Importing...' : 'Import Excel'}
          <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
        </label>
      </div>
    </motion.div>
  );
}
