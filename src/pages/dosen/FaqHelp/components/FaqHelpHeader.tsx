import React from 'react';
import { HelpCircle } from 'lucide-react';
import type { FaqHelpHeaderProps } from '../types/faqHelp.types';

export default function FaqHelpHeader({
  title = "Panduan & Bantuan",
  subtitle = "Pusat Dukungan"
}: FaqHelpHeaderProps) {
  return (
    <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40">
        <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest leading-none mb-1.5">
          {subtitle}
        </p>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {title}
        </h2>
      </div>
    </div>
  );
}
