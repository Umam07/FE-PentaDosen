import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import type { SyncHeaderProps } from '../types/adminSync.types';

export default function SyncHeader({
  syncState,
  progressPercent,
  onStartMassSync,
  onScrollToConsole
}: SyncHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">Sinkronisasi Global</h1>
        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          Otomasi Penarikan Data dari Scholar & Scopus
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        {syncState === 'idle' ? (
          <button 
            onClick={onStartMassSync}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl shadow-sm border border-primary-500 transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.15em]"
          >
            <RefreshCw className="h-4 w-4" />
            Jalankan Sinkronisasi Total
          </button>
        ) : (
          <button 
            onClick={onScrollToConsole}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.15em] border border-zinc-700"
          >
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
            Tampilkan Konsol Aktif ({progressPercent}%)
          </button>
        )}
      </div>
    </div>
  );
}
