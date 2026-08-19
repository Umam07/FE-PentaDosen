import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="p-10 flex flex-col items-center justify-center text-center">
      <ShieldAlert className="w-16 h-16 text-error mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Akses Ditolak</h1>
      <p className="text-xs font-medium text-muted dark:text-on-dark-muted mt-2">Halaman ini hanya dapat diakses oleh Admin Penelitian atau Admin Fakultas.</p>
    </div>
  );
}
