import React from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle } from 'lucide-react';
import { AuthorPreviewProps } from '../types/konfigurasi.types';

export const AuthorPreview: React.FC<AuthorPreviewProps> = ({ author, tone }) => {
  if (!author) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-slate-300 dark:bg-slate-900">
        {author.thumbnail ? (
          <img src={author.thumbnail} alt={author.name || 'Author'} className="h-full w-full object-cover" />
        ) : (
          <User className={`h-6 w-6 ${tone === 'scholar' ? 'text-blue-300' : 'text-rose-300'}`} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950 dark:text-white">{author.name}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">
          {author.affiliations}
        </p>
      </div>
      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-300" />
    </motion.div>
  );
};
