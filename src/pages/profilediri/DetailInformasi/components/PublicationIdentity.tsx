import React from 'react';
import { Globe, Hash, Fingerprint, User } from 'lucide-react';
import { IdentityBadge } from './IdentityBadge';
import { DetailInformasiUser } from '../types/detailInformasi.types';

interface PublicationIdentityProps {
  user: DetailInformasiUser | null | undefined;
}

export const PublicationIdentity: React.FC<PublicationIdentityProps> = ({ user }) => {
  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-300">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
            Identitas Publikasi
          </h3>
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            ID sinkronisasi performa publikasi
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <IdentityBadge label="Google Scholar" value={user?.scholar_id} icon={Globe} tone="blue" />
        <IdentityBadge label="Scopus" value={user?.scopus_id} icon={Hash} tone="orange" />
        <IdentityBadge label="Penta ID" value={user?.penta_id} icon={Fingerprint} tone="emerald" />

        <IdentityBadge label="NIDN / NIP" value={user?.nidn || user?.nip} icon={User} tone="violet" />
      </div>
    </div>
  );
};
