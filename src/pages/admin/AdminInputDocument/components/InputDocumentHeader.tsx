import React from 'react';
import type { InputDocumentHeaderProps } from '../types/adminInputDocument.types';

export default function InputDocumentHeader({
  title = "Input Data Dosen",
  subtitle = "Bantu Dosen Menginput Dokumen"
}: InputDocumentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{title}</h1>
        <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
