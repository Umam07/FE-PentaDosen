import React from 'react';
import {
  Download, Upload, FileSpreadsheet, CheckCircle,
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
    <div className="space-y-8">
      {/* Template Instructions & Download */}
      <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-6 border border-hairline-light dark:border-hairline-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h4 className="text-sm font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">
            Unduh Template Format Excel
          </h4>
          <p className="text-xs text-body dark:text-on-dark-soft font-medium">
            Gunakan template Excel resmi dengan daftar dropdown agar data terformat dengan benar.
          </p>
        </div>
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="flex items-center gap-2.5 px-6 py-3 bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Unduh Template ({mainCategory})
        </button>
      </div>

      {/* Drag & Drop Excel Import Zone */}
      <div className="space-y-3">
        <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
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
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
              : 'border-gray-200 dark:border-zinc-700 hover:border-primary-400 bg-gray-50/50 dark:bg-zinc-800/30'
          }`}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            disabled={isImporting}
            onChange={onImportExcel}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600">
              <FileSpreadsheet className="w-10 h-10" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 dark:text-zinc-100">
                {isImporting ? 'Sedang Memproses File Excel...' : 'Klik atau Drag & Drop File Excel (.xlsx) di Sini'}
              </p>
              <p className="text-xs text-gray-400 font-bold mt-1">
                Pastikan kolom Penta ID diisi sesuai kode dosen di sistem
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar during Import */}
      {isImporting && (
        <div className="space-y-2 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-600 dark:text-zinc-300">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
              Mengimpor data baris...
            </span>
            <span className="font-mono">{importProgress.current} / {importProgress.total}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Message Notification */}
      {message && !isImporting && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 ${
          messageType === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40' 
            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40'
        }`}>
          {messageType === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
          <p className="text-xs font-bold">{message}</p>
        </div>
      )}

      {/* Import Result Summary & Errors */}
      {importResult && (
        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">Berhasil Diimpor</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-1 block">{importResult.success}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 block">Gagal / Ditolak</span>
              <span className="text-2xl font-black text-rose-700 dark:text-rose-300 font-mono mt-1 block">{importResult.failed}</span>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Rincian Baris Gagal ({importResult.errors.length})
              </h5>
              <div className="max-h-60 overflow-y-auto rounded-2xl border border-gray-100 dark:border-zinc-800 divide-y divide-gray-100 dark:divide-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                {importResult.errors.map((err, idx) => (
                  <div key={idx} className="p-3 text-xs flex justify-between items-center gap-4">
                    <span className="font-bold text-gray-700 dark:text-zinc-300 truncate max-w-md">
                      Baris {err.row}: {err.title}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">
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
