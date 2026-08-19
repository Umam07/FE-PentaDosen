import React from 'react';
import { Users } from 'lucide-react';

export default function LecturersEmpty() {
  return (
    <div className="p-20 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mb-4 border border-hairline-light-soft dark:border-hairline-dark-soft">
        <Users className="w-8 h-8 text-muted-soft dark:text-on-dark-muted" />
      </div>
      <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Data Tidak Ditemukan</p>
    </div>
  );
}
