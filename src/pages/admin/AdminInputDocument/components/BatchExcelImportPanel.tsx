import React from 'react';
import {
  Download, FileSpreadsheet, CheckCircle,
  XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import type { BatchExcelImportPanelProps } from '../types/adminInputDocument.types';

export default function BatchExcelImportPanel({
  mainCategory,
  isImporting,
  importProgress,
  importResult,
  message,
  messageType,
  isDragging,
  onDownloadTemplate,
  onImportExcel,
  onDragOver,
  onDragLeave,
  onDropFile,
}: BatchExcelImportPanelProps) {
  return (
    <div className="space-y-6">
      {/* Template Instructions & Download */}
      <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl p-5 border border-hairline-light dark:border-hairline-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark uppercase tracking-wider">
            Unduh Template Format Excel
          </h4>
          <p className="text-xs text-muted dark:text-on-dark-muted font-medium">
            Gunakan template Excel resmi dengan daftar dropdown agar data terformat dengan benar.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 text-accent dark:text-accent-on-dark" />
          Unduh Template ({mainCategory})
        </button>
      </div>

      {/* Drag & Drop Excel Import Zone */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider ml-1">
          Unggah File Excel Berisi Data Dosen
        </label>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) onDropFile(droppedFile);
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-accent bg-accent-soft/40 dark:bg-accent/15'
              : 'border-hairline-light dark:border-hairline-dark hover:border-accent/50 bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50'
          }`}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            disabled={isImporting}
            onChange={onImportExcel}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="p-3.5 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft text-accent dark:text-accent-on-dark">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                {isImporting ? 'Sedang Memproses File Excel...' : 'Klik atau Drag & Drop File Excel (.xlsx) di Sini'}
              </p>
              <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                Pastikan kolom Penta ID diisi sesuai kode dosen di sistem
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar during Import */}
      {isImporting && (
        <div className="space-y-2 p-5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
          <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
              Mengimpor data baris...
            </span>
            <span className="font-mono text-muted dark:text-on-dark-muted">{importProgress.current} / {importProgress.total}</span>
          </div>
          <div className="w-full h-2.5 bg-surface-light dark:bg-surface-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Message Notification */}
      {message && !isImporting && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
          messageType === 'success' 
            ? 'bg-success-soft text-success-dark border border-success-border dark:bg-success/15 dark:text-success-on-dark dark:border-success/30' 
            : 'bg-error-soft text-error border border-error-border dark:bg-error/15 dark:text-error-on-dark dark:border-error/30'
        }`}>
          {messageType === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          <p>{message}</p>
        </div>
      )}

      {/* Import Result Summary & Errors */}
      {importResult && (
        <div className="space-y-5 pt-4 border-t border-hairline-light dark:border-hairline-dark">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-success-soft dark:bg-success/15 border border-success-border dark:border-success/30 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-success-dark dark:text-success-on-dark block">Berhasil Diimpor</span>
              <span className="text-2xl font-bold text-success-dark dark:text-success-on-dark font-mono mt-0.5 block">{importResult.success}</span>
            </div>
            <div className="p-4 rounded-xl bg-error-soft dark:bg-error/15 border border-error-border dark:border-error/30 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-error dark:text-error-on-dark block">Gagal / Ditolak</span>
              <span className="text-2xl font-bold text-error dark:text-error-on-dark font-mono mt-0.5 block">{importResult.failed}</span>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="space-y-2.5">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-error" />
                Rincian Baris Gagal ({importResult.errors.length})
              </h5>
              <div className="max-h-60 overflow-y-auto rounded-xl border border-hairline-light dark:border-hairline-dark divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50">
                {importResult.errors.map((err, idx) => (
                  <div key={idx} className="p-3 text-xs flex justify-between items-center gap-4">
                    <span className="font-medium text-body dark:text-on-dark-soft truncate max-w-md">
                      <span className="font-mono text-muted dark:text-on-dark-muted">Baris {err.row}:</span> {err.title}
                    </span>
                    <span className="text-error dark:text-error-on-dark font-semibold shrink-0 text-[10px] font-mono">
                      {err.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
