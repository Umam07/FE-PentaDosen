import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { VerificationEmptyProps } from '../types/verification.types';

export default function VerificationEmpty({
  activeTab
}: VerificationEmptyProps) {
  return (
    <div className="px-8 py-24 text-center flex flex-col items-center">
       <div className="w-20 h-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl flex items-center justify-center mb-6 border border-hairline-light-soft dark:border-hairline-dark-soft">
          <CheckCircle2 className="w-10 h-10 text-success-dark dark:text-success-on-dark opacity-80" />
       </div>
       <p className="text-lg font-bold text-ink-heading dark:text-on-dark uppercase tracking-tight mb-1">Antrean Bersih</p>
       <p className="text-xs font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider leading-relaxed">Semua pengajuan {activeTab} telah diverifikasi</p>
    </div>
  );
}
