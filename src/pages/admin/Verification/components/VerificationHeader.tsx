import React from 'react';
import { VerificationHeaderProps } from '../types/verification.types';

export default function VerificationHeader({
  totalPending,
  loading
}: VerificationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Antrean Verifikasi</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          Validasi Dokumen & Luaran Riset Dosen
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-warning-soft dark:bg-warning/15 px-4 py-2.5 rounded-xl border border-warning-border dark:border-warning/30">
           <div className="w-2 h-2 bg-warning dark:bg-warning-on-dark rounded-full animate-pulse"></div>
           <span className="text-xs font-mono font-semibold text-warning dark:text-warning-on-dark uppercase tracking-wider">
              {loading ? 'MEMUAT...' : `${totalPending} PENDING`}
           </span>
        </div>
      </div>
    </div>
  );
}
