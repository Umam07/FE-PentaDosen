import React from 'react';
import { Activity } from 'lucide-react';
import { ActivityLogsEmptyProps } from '../types/activityLogs.types';

export default function ActivityLogsEmpty({
  hasFilters
}: ActivityLogsEmptyProps) {
  return (
    <div className="px-8 py-32 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-primary-50/50 dark:bg-primary-900/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-primary-100/50 dark:ring-primary-900/20">
        <Activity className="w-12 h-12 text-primary-400 opacity-40" />
      </div>
      <p className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-2">
        {hasFilters ? 'Tidak Ditemukan' : 'Belum Ada Log'}
      </p>
      <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
        {hasFilters ? 'Coba ubah kata kunci atau filter yang digunakan' : 'Aktivitas dosen & admin akan tercatat di sini'}
      </p>
    </div>
  );
}
