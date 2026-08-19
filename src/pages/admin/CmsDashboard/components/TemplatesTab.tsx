import React from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { useTemplatesTab } from '../hooks/useTemplatesTab';

interface TemplatesTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

/**
 * Tab Pengunggahan Template Import Excel Kustom.
 */
export default function TemplatesTab({ triggerMessage }: TemplatesTabProps) {
  const {
    loading,
    uploadingType,
    handleFileUpload,
    getTemplateForType
  } = useTemplatesTab(triggerMessage);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
          Unggah Template Import Excel Kustom
        </h3>
        <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
          Dosen akan mengunduh template kustom yang diunggah di sini saat tombol &quot;Download Template&quot; diklik di modul masing-masing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { type: 'research', label: 'Template Import Penelitian' },
          { type: 'publication', label: 'Template Import Publikasi Jurnal' },
          { type: 'hki', label: 'Template Import HKI' },
          { type: 'buku', label: 'Template Import Buku' },
        ].map((item) => {
          const t = getTemplateForType(item.type);
          return (
            <div key={item.type} className="p-5 border border-hairline-light-soft dark:border-hairline-dark-soft rounded-xl flex flex-col justify-between gap-4 bg-surface-light-raised/40 dark:bg-surface-dark-elevated/20">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-chart-penelitian" />
                  {item.label}
                </h4>
                {t ? (
                  <div className="text-xs text-muted dark:text-on-dark-muted font-mono">
                    <p className="truncate">File aktif: <span className="font-semibold text-ink-heading dark:text-on-dark">{t.file_name}</span></p>
                    <p className="mt-0.5 text-muted-soft dark:text-on-dark-muted/70">Diunggah pada: {t.uploaded_at ? t.uploaded_at.substring(0, 16).replace('T', ' ') : ''}</p>
                  </div>
                ) : (
                  <p className="text-xs text-warning-dark dark:text-warning italic">
                    Belum ada template kustom (menggunakan fallback program ExcelJS)
                  </p>
                )}
              </div>

              <div>
                <label className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl cursor-pointer shadow-xs text-ink-heading dark:text-on-dark transition-colors ${uploadingType === item.type ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                  {uploadingType === item.type ? 'Uploading...' : 'Unggah File Excel'}
                  <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={(e) => handleFileUpload(e, item.type)} disabled={uploadingType === item.type} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
