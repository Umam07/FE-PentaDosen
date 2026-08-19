import React from 'react';
import { Activity } from 'lucide-react';
import { ActivityLogsEmptyProps } from '../types/activityLogs.types';

export default function ActivityLogsEmpty({
  hasFilters
}: ActivityLogsEmptyProps) {
  return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mb-4 border border-hairline-light-soft dark:border-hairline-dark-soft">
        <Activity className="w-8 h-8 text-muted-soft dark:text-on-dark-muted" />
      </div>
      <p className="text-xs font-bold text-ink-heading dark:text-on-dark mb-1">
        {hasFilters ? 'Aktivitas Tidak Ditemukan' : 'Belum Ada Log Aktivitas'}
      </p>
      <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm">
        {hasFilters ? 'Coba sesuaikan kata kunci pencarian atau filter aksi' : 'Riwayat aktivitas sistem akan tercatat secara otomatis di sini'}
      </p>
    </div>
  );
}
