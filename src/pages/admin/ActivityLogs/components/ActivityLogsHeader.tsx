import React from 'react';
import { FileDown } from 'lucide-react';
import { ActivityLogsHeaderProps } from '../types/activityLogs.types';

export default function ActivityLogsHeader({
  totalItems,
  loading,
  onExportExcel,
  exportDisabled
}: ActivityLogsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Log Aktivitas</h1>
        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          Riwayat Tindakan Dosen &amp; Admin
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExportExcel}
          disabled={exportDisabled}
          className="flex items-center justify-center px-6 py-3.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <FileDown className="h-4 w-4 mr-2 text-primary-600" />
          Export to excel
        </button>
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-5 py-3.5 rounded-2xl border border-primary-100 dark:border-primary-900/30">
          <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <span className="text-[11px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">
            {loading ? 'SYNCING...' : `${totalItems} Aktivitas Tercatat`}
          </span>
        </div>
      </div>
    </div>
  );
}
