import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

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
      {/* Baris Utama: Aksi Sinkronisasi */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-hairline-light bg-surface-light-raised text-body-strong dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark">
              Sinkronisasi Data Publikasi
            </h2>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Isi ID Scholar & Scopus secara mandiri, atau gunakan deteksi otomatis dari profil SINTA.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
          {onSyncSinta && (
            <button
              onClick={onSyncSinta}
              disabled={loading}
              title="Deteksi dan isi Scopus ID serta Google Scholar ID secara otomatis berdasarkan nama dari profil SINTA"
              aria-label="Deteksi dan isi ID dari profil SINTA"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline-light bg-surface-light-raised px-4 text-xs font-semibold text-ink transition-colors hover:bg-surface-light hover:border-ink/20 dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              {loading ? 'Mendeteksi ID...' : 'Isi ID dari SINTA'}
            </button>
          )}

          <button
            onClick={onSyncAll}
            disabled={loading || !hasConfiguredId}
            aria-label="Sinkronkan semua data publikasi"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-xs font-bold text-on-ink transition-colors hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-ink dark:hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            {loading ? 'Menyinkronkan...' : 'Sinkronkan Semua'}
          </button>
        </div>
      </div>

      {/* Sub-baris: Edukasi Kebijakan Penguncian ID & Bantuan Admin (Langsung terlihat tanpa scroll) */}
      <div className="mt-4 pt-3.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center gap-2 text-xs text-muted dark:text-on-dark-muted">
        <ShieldCheck className="h-4 w-4 shrink-0 text-accent dark:text-accent-on-dark" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-ink-heading dark:text-on-dark">Integritas Data:</strong> ID publikasi yang telah tersimpan terkunci otomatis. Untuk perubahan atau koreksi ID, silakan hubungi <strong className="font-semibold text-body-strong dark:text-on-dark">Admin Penelitian</strong>.
        </p>
      </div>
    </section>
  );
};



