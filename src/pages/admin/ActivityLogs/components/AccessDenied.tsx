import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="p-10 flex flex-col items-center justify-center text-center">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Akses Ditolak</h1>
      <p className="text-gray-500 dark:text-zinc-400 mt-2">Halaman ini hanya dapat diakses oleh Admin Penelitian atau Admin Fakultas.</p>
    </div>
  );
}
