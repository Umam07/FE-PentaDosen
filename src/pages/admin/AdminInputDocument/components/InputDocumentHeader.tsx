import React from 'react';
import type { InputDocumentHeaderProps } from '../types/adminInputDocument.types';

export default function InputDocumentHeader({
  title = "Input Data Dosen",
  subtitle = "Bantu Dosen Menginput Dokumen"
}: InputDocumentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-heading dark:text-on-dark tracking-tight">{title}</h1>
        <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
