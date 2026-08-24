import React from 'react';
import { UserX, ArrowLeft } from 'lucide-react';
import { ProfileNotFoundProps } from '../types/lecturerProfile.types';

export default function ProfileNotFound({ onBack }: ProfileNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-3xl border border-dashed border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline-light bg-surface-light-raised text-muted dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-muted mb-4">
        <UserX className="h-8 w-8" />
      </div>
      <h2 className="text-lg font-bold text-ink-heading dark:text-on-dark">
        Dosen Tidak Ditemukan
      </h2>
      <p className="text-xs text-muted dark:text-on-dark-muted mt-1 max-w-sm">
        Data profil dosen yang Anda cari tidak ditemukan atau ID tidak valid dalam sistem PentaDosen.
      </p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-on-ink hover:bg-ink-hover dark:bg-on-dark dark:text-ink dark:hover:bg-on-dark-soft rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Daftar Dosen</span>
      </button>
    </div>
  );
}
