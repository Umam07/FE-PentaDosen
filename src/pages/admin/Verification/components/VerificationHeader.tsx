import React from 'react';
import { VerificationHeaderProps } from '../types/verification.types';

export default function VerificationHeader({
  totalPending,
  loading
}: VerificationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Antrean Verifikasi</h1>
        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          Validasi Dokumen & Luaran Riset Dosen
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 px-5 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
           <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
           <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
              {loading ? 'SYNCING...' : `${totalPending} PENDING`}
           </span>
        </div>
      </div>
    </div>
  );
}
