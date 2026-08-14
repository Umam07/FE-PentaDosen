import React from 'react';
import { motion } from 'framer-motion';
import { User, Check } from 'lucide-react';
import { AuthorPreviewProps } from '../types/konfigurasi.types';

export const AuthorPreview: React.FC<AuthorPreviewProps> = ({ author, tone }) => {
  if (!author) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/25"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/60 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        {author.thumbnail ? (
          <img src={author.thumbnail} alt={author.name || 'Author'} className="h-full w-full object-cover" />
        ) : (
          <User className={`h-5 w-5 ${tone === 'scholar' ? 'text-blue-500 dark:text-blue-400' : 'text-orange-500 dark:text-orange-400'}`} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
            {author.name || 'Author Teridentifikasi'}
          </p>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Check className="h-2.5 w-2.5" />
            Valid
          </span>
        </div>
        {author.affiliations && (
          <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {author.affiliations}
          </p>
        )}
      </div>
    </motion.div>
  );
};

