import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { VerificationEmptyProps } from '../types/verification.types';

export default function VerificationEmpty({
  activeTab
}: VerificationEmptyProps) {
  return (
    <div className="px-8 py-32 text-center flex flex-col items-center">
       <div className="w-24 h-24 bg-primary-50/50 dark:bg-primary-900/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-primary-100/50 dark:ring-primary-900/20">
          <CheckCircle2 className="w-12 h-12 text-primary-400 opacity-40" />
       </div>
       <p className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-2">Queue processed</p>
       <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">Semua pengajuan telah ditindaklanjuti secara sistematis</p>
    </div>
  );
}
