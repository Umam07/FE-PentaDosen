import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicationActionBarProps {
  onUploadClick: () => void;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  unconfirmedDocs?: any[];
  isNationalJournal?: boolean;
  onBulkConfirmAllNotCorresponding?: () => Promise<void>;
  onOpenBulkModal?: () => void;
}

export default function PublicationActionBar({
  onUploadClick,
  onDownloadTemplate,
  onImportExcel,
  isImporting,
  unconfirmedDocs = [],
  isNationalJournal = false,
  onBulkConfirmAllNotCorresponding,
  onOpenBulkModal,
}: PublicationActionBarProps) {
  const [isSettingAllFalse, setIsSettingAllFalse] = useState(false);

  const handleSetAllFalse = async () => {
    if (!onBulkConfirmAllNotCorresponding) return;
    setIsSettingAllFalse(true);
    try {
      await onBulkConfirmAllNotCorresponding();
    } finally {
      setIsSettingAllFalse(false);
    }
  };

  const hasUnconfirmed = unconfirmedDocs && unconfirmedDocs.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-light dark:bg-surface-dark shadow-2xs rounded-2xl sm:rounded-3xl border border-hairline-light dark:border-hairline-dark p-4 sm:p-5 flex flex-col gap-3.5"
    >
      {/* Baris Atas: Header & Tombol Aksi Mutasi */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
              Kelola Publikasi Ilmiah
            </h3>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Registrasikan publikasi baru atau impor massal berkas Excel
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Unggah Publikasi Baru
          </button>
          <button 
            type="button"
            onClick={onDownloadTemplate}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
            Template
          </button>
          <label className={`flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors text-body dark:text-on-dark-soft shadow-2xs cursor-pointer whitespace-nowrap ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 shrink-0 text-muted dark:text-on-dark-muted" />
            {isImporting ? 'Mengimpor...' : 'Import Excel'}
            <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={onImportExcel} disabled={isImporting} />
          </label>
        </div>
      </div>

      {/* Baris Bawah: Strip Konfirmasi Terintegrasi */}
      {hasUnconfirmed && (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-warning-soft dark:bg-warning/20 text-warning dark:text-warning-on-dark border border-warning-border/60 dark:border-warning/30 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs text-body-strong dark:text-on-dark truncate">
              <strong className="font-bold text-ink-heading dark:text-on-dark font-mono">{unconfirmedDocs.length}</strong> {isNationalJournal ? 'publikasi Jurnal Nasional perlu konfirmasi Akreditasi SINTA' : 'publikasi perlu konfirmasi status korespondensi'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              disabled={isSettingAllFalse}
              onClick={handleSetAllFalse}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
              title={isNationalJournal ? "Satu klik untuk konfirmasi status SINTA pada seluruh dokumen ini menjadi Non-SINTA" : "Satu klik untuk konfirmasi bahwa Anda BUKAN Penulis Korespondensi pada seluruh dokumen ini"}
            >
              {isSettingAllFalse ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted shrink-0" />
                  <span>{isNationalJournal ? 'Set Semua: Non-SINTA' : 'Set Semua: Bukan Corresponding'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBulkModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark shrink-0" />
              <span>{isNationalJournal ? `Konfirmasi SINTA Massal (${unconfirmedDocs.length})` : `Konfirmasi Massal (${unconfirmedDocs.length})`}</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
