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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Log Aktivitas</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          Riwayat &amp; Audit Trail Aktivitas Dosen &amp; Administrator
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onExportExcel}
          disabled={exportDisabled}
          className="flex items-center justify-center px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark transition-all disabled:opacity-40 active:scale-95 cursor-pointer shadow-xs"
        >
          <FileDown className="h-4 w-4 mr-2 text-accent dark:text-accent-on-dark" />
          Export to excel
        </button>
        <div className="flex items-center bg-surface-light-raised dark:bg-surface-dark-elevated px-4 py-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark">
          <span className="text-[10px] font-semibold font-mono text-muted dark:text-on-dark-muted uppercase tracking-wider">
            {loading ? 'MEMUAT...' : `${totalItems} Aktivitas Tercatat`}
          </span>
        </div>
      </div>
    </div>
  );
}
