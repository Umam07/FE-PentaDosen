import React from 'react';
import { FileDown } from 'lucide-react';
import { LecturersHeaderProps } from '../types/lecturers.types';

export default function LecturersHeader({
  loading,
  exportDisabled,
  onExportExcel
}: LecturersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Database Dosen</h1>
        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          Manajemen Database Dosen, Dokumen Akademik & Pemantauan Kinerja
        </p>
      </div>
      <button
        onClick={onExportExcel}
        disabled={loading || exportDisabled}
        className="flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
      >
        <FileDown className="h-4 w-4 mr-2 text-primary-600" />
        Export to excel
      </button>
    </div>
  );
}
