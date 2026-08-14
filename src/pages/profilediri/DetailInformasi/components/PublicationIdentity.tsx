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
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Identitas Publikasi & Riset Ilmiah
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrasi akun pengindeks internasional untuk sinkronisasi dokumen & sitasi
            </p>
          </div>
        </div>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('integrasi')}
            className="inline-flex items-center self-start sm:self-auto rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
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

