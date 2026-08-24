import React from 'react';
import { Users, RotateCcw } from 'lucide-react';

interface LecturerEmptyProps {
  onReset?: () => void;
}

export default function LecturerEmpty({ onReset }: LecturerEmptyProps) {
  return (
    <div className="col-span-full py-16 px-6 text-center space-y-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center border border-hairline-light dark:border-hairline-dark">
        <Users className="w-6 h-6 text-muted dark:text-on-dark-muted" />
      </div>
      
      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
          Dosen Tidak Ditemukan
        </h3>
        <p className="text-body dark:text-on-dark-soft text-xs leading-relaxed">
          Tidak ada profil dosen yang sesuai dengan kata kunci pencarian atau filter fakultas yang dipilih.
        </p>
      </div>

      {onReset && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset pencarian dan filter fakultas"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-ink text-on-ink hover:bg-ink-hover dark:bg-on-dark dark:text-ink-heading dark:hover:bg-on-dark-soft transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pencarian & Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
