import React from 'react';
import type { InternalDocument } from '../internal-documents.types';

interface ScopusMetaBadgesProps {
  doc: InternalDocument;
}

/**
 * Badge-badge metadata Scopus/SINTA yang muncul di bagian bawah drawer detail dokumen.
 * Hanya dirender kalau dokumen punya setidaknya satu dari: quartile, author_role, is_corresponding.
 */
export default function ScopusMetaBadges({ doc }: ScopusMetaBadgesProps) {
  const hasScopusData =
    doc.quartile || doc.author_role || doc.is_corresponding !== undefined;

  if (!hasScopusData) return null;

  return (
    <div className="col-span-2 pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-2">
      <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">
        Detail Scopus (Metrik SINTA)
      </p>
      <div className="flex flex-wrap gap-2">
        {doc.quartile && (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md border border-orange-100 dark:border-orange-900/30">
            Quartile: {doc.quartile}
          </span>
        )}
        {doc.author_role && (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/30">
            Peran: {doc.author_role}
          </span>
        )}
        {doc.is_hyperauthor ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900/30">
            Hyperauthor
          </span>
        ) : null}
        {doc.is_corresponding !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
              doc.is_corresponding
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                : 'text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'
            }`}
          >
            Korespondensi: {doc.is_corresponding ? 'Ya' : 'Tidak'}
          </span>
        )}
      </div>
    </div>
  );
}
