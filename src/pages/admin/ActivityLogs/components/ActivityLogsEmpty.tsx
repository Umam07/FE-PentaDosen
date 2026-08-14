import React from 'react';
import { Activity } from 'lucide-react';
import { ActivityLogsEmptyProps } from '../types/activityLogs.types';

export default function ActivityLogsEmpty({
  hasFilters
}: ActivityLogsEmptyProps) {
  return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-5 border border-gray-200/80 dark:border-zinc-700/80">
        <Activity className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
      </div>
      <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1">
        {hasFilters ? 'Aktivitas Tidak Ditemukan' : 'Belum Ada Log Aktivitas'}
      </p>
      <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-sm">
        {hasFilters ? 'Coba sesuaikan kata kunci pencarian atau filter aksi' : 'Riwayat aktivitas sistem akan tercatat secara otomatis di sini'}
      </p>
    </div>
  );
}
