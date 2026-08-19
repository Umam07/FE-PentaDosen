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
      className="flex items-center gap-3 rounded-xl border border-success-border bg-success-soft p-3.5 dark:border-success-on-dark/30 dark:bg-success/15"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-hairline-light bg-surface-light text-muted dark:border-hairline-dark dark:bg-surface-dark dark:text-on-dark-muted">
        {author.thumbnail ? (
          <img src={author.thumbnail} alt={author.name || 'Author'} className="h-full w-full object-cover" />
        ) : (
          <User className={`h-5 w-5 ${tone === 'scholar' ? 'text-chart-scholar dark:text-chart-scholar-dark' : 'text-chart-scopus dark:text-chart-scopus-dark'}`} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs font-bold text-ink-heading dark:text-on-dark">
            {author.name || 'Author Teridentifikasi'}
          </p>
          <span className="inline-flex items-center gap-1 rounded-md border border-success-border bg-success-soft px-1.5 py-0.5 text-[9px] font-bold text-success dark:border-success-on-dark/30 dark:bg-success/20 dark:text-success-on-dark">
            <Check className="h-2.5 w-2.5" />
            Valid
          </span>
        </div>
        {author.affiliations && (
          <p className="mt-0.5 truncate text-[11px] text-muted dark:text-on-dark-muted">
            {author.affiliations}
          </p>
        )}
      </div>
    </motion.div>
  );
};

