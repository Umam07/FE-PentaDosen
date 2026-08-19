import React from 'react';
import { Users } from 'lucide-react';

export default function LecturerEmpty() {
  return (
    <div className="col-span-full py-20 text-center space-y-4">
      <div className="mx-auto w-20 h-20 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center border border-dashed border-hairline-light dark:border-hairline-dark">
        <Users className="w-8 h-8 text-muted dark:text-on-dark-muted" />
      </div>
      <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">Dosen Tidak Ditemukan</h3>
      <p className="text-muted dark:text-on-dark-muted text-xs font-medium">Coba gunakan kata kunci pencarian atau filter yang berbeda.</p>
    </div>
  );
}
