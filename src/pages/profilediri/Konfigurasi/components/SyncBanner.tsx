import React from 'react';
import { RefreshCw } from 'lucide-react';

interface SyncBannerProps {
  loading: boolean;
  scholarId: string;
  scopusId: string;
  onSyncAll: () => Promise<void>;
  onSyncSinta?: () => Promise<void>;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  loading,
  scholarId,
  scopusId,
  onSyncAll,
  onSyncSinta,
}) => {
  const hasConfiguredId = Boolean(scholarId || scopusId);

  return (
    <section className="rounded-2xl border border-hairline-light bg-surface-light p-5 shadow-xs dark:border-hairline-dark dark:bg-surface-dark sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline-light bg-surface-light-raised text-body-strong dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark">
              Sinkronisasi Data Publikasi
            </h2>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Isi ID Scholar & Scopus secara manual, atau gunakan deteksi otomatis dari profil SINTA untuk mengisi ID Anda.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          {onSyncSinta && (
            <button
              onClick={onSyncSinta}
              disabled={loading}
              title="Deteksi dan isi Scopus ID serta Google Scholar ID secara otomatis berdasarkan nama dari profil SINTA"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline-light bg-surface-light-raised px-4 text-xs font-semibold text-ink transition-colors hover:bg-surface-light hover:border-ink/20 dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Mendeteksi ID...' : 'Isi ID dari SINTA'}
            </button>
          )}

          <button
            onClick={onSyncAll}
            disabled={loading || !hasConfiguredId}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-xs font-bold text-on-ink transition-colors hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-ink dark:hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Menyinkronkan...' : 'Sinkronkan Semua'}
          </button>
        </div>
      </div>
    </section>
  );
};

