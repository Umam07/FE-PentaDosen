import React from 'react';
import { Upload, Zap, Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';

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
      className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Kelola Dokumen HKI Anda</h3>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Registrasikan HKI baru atau impor data dari Excel secara massal</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onUploadClick}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
        >
          Unggah HKI Baru
        </button>
        <button 
          type="button"
          onClick={onDownloadTemplate}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm uppercase tracking-wider"
        >
          <Download className="w-4 h-4 mr-2" />
          Template
        </button>
        <label className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm cursor-pointer uppercase tracking-wider whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
          <FileSpreadsheet className="w-4 h-4 mr-2 shrink-0 text-slate-500 dark:text-zinc-400" />
          {isImporting ? 'Importing...' : 'Import Excel'}
          <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
        </label>
      </div>
    </motion.div>
  );
}
