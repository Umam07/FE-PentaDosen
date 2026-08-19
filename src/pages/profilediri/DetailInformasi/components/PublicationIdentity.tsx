import React from 'react';
import { Globe, Hash, Sparkles } from 'lucide-react';
import { IdentityBadge } from './IdentityBadge';
import { DetailInformasiUser } from '../types/detailInformasi.types';

interface PublicationIdentityProps {
  user: DetailInformasiUser | null | undefined;
  onNavigateTab?: (tab: 'integrasi' | 'info') => void;
}

export const PublicationIdentity: React.FC<PublicationIdentityProps> = ({
  user,
  onNavigateTab,
}) => {
  return (
    <div className="rounded-3xl border border-hairline-light bg-surface-light p-6 shadow-xs dark:border-hairline-dark dark:bg-surface-dark sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline-light bg-surface-light-raised text-body-strong dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark">
              Identitas Publikasi & Riset Ilmiah
            </h3>
            <p className="text-xs text-muted dark:text-on-dark-muted">
              Integrasi akun pengindeks internasional untuk sinkronisasi dokumen & sitasi
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center self-start sm:self-auto rounded-lg border border-hairline-light bg-surface-light-raised px-3.5 py-1.5 text-xs font-semibold text-body-strong transition-colors hover:bg-surface-light hover:text-ink-heading dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark cursor-pointer"
          >
            Kelola di Konfigurasi ID
          </button>
        )}
      </div>

      {/* Grid: Google Scholar & Scopus only (No NIDN / Penta ID redundancy) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IdentityBadge
          platform="scholar"
          label="Google Scholar"
          description="ID Peneliti & Sitasi Akademik"
          value={user?.scholar_id}
          icon={Globe}
          onNavigateTab={onNavigateTab}
        />
        <IdentityBadge
          platform="scopus"
          label="Scopus Author"
          description="Pengindeks Jurnal & Sitasi Internasional"
          value={user?.scopus_id}
          icon={Hash}
          onNavigateTab={onNavigateTab}
        />
      </div>
    </div>
  );
};

