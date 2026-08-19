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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Sinkronisasi Global</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          Otomasi Penarikan Data dari Scholar & Scopus
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        {syncState === 'idle' ? (
          <button 
            onClick={onStartMassSync}
            className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark-elevated/80 px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Jalankan Sinkronisasi Total
          </button>
        ) : (
          <button 
            onClick={onScrollToConsole}
            className="w-full md:w-auto flex items-center justify-center gap-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark px-5 py-3 rounded-xl transition-all active:scale-95 text-xs font-semibold uppercase tracking-wider shadow-xs cursor-pointer"
          >
            <Activity className="h-4 w-4 text-success-dark dark:text-success-on-dark animate-pulse" />
            Tampilkan Konsol Aktif ({progressPercent}%)
          </button>
        )}
      </div>
    </div>
  );
}
