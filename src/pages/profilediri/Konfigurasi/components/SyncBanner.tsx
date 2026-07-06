import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';

interface SyncBannerProps {
  loading: boolean;
  scholarId: string;
  scopusId: string;
  onSyncAll: () => Promise<void>;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  loading,
  scholarId,
  scopusId,
  onSyncAll,
}) => {
  return (
    <section className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-widest text-slate-950 dark:text-white">
              Sinkronisasi Data Publikasi
            </h2>
            <p className="mt-1 max-w-2xl text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Hubungkan Google Scholar dan Scopus agar metrik publikasi, sitasi, dan poin performa dapat diperbarui dari sumber eksternal.
            </p>
          </div>
        </div>
        <button
          onClick={onSyncAll}
          disabled={loading || (!scholarId && !scopusId)}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          Sinkronkan Semua
        </button>
      </div>
    </section>
  );
};
