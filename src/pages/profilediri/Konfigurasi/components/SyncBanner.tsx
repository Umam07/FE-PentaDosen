import React from 'react';
import { RefreshCw } from 'lucide-react';

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
  const hasConfiguredId = Boolean(scholarId || scopusId);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-600 dark:border-primary-900/30 dark:bg-primary-950/30 dark:text-primary-400">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Sinkronisasi Data Publikasi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hubungkan ID Scholar dan Scopus untuk memperbarui dokumen, sitasi, dan kalkulasi poin secara otomatis.
            </p>
          </div>
        </div>

        <button
          onClick={onSyncAll}
          disabled={loading || !hasConfiguredId}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-xs font-bold text-white transition-colors hover:bg-primary-700 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Menyinkronkan...' : 'Sinkronkan Semua'}
        </button>
      </div>
    </section>
  );
};

