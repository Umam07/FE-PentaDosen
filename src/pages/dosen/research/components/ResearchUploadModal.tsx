import React, { useState, useMemo } from 'react';
import { 
   Upload, Home, Landmark, Globe, CalendarDays, 
   Sparkles, XCircle, FileText, Archive 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/shared/BaseFormModal';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface ResearchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: string;
  setProgram: (val: string) => void;
  judulPenelitian: string;
  setJudulPenelitian: (val: string) => void;
  skema: string;
  setSkema: (val: string) => void;
  fokus: string;
  setFokus: (val: string) => void;
  danaDisetujui: string;
  setDanaDisetujui: (val: string) => void;
  tahun: Date | undefined;
  setTahun: (val: Date | undefined) => void;
  docType?: 'kpi' | 'arsip';
  setDocType?: (val: 'kpi' | 'arsip') => void;
  file: File | null;
  setFile: (val: File | null) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onErrorMsg: (msg: string) => void;
  uploadProgress?: number | null;
}

export default function ResearchUploadModal({
  isOpen,
  onClose,
  program,
  setProgram,
  judulPenelitian,
  setJudulPenelitian,
  skema,
  setSkema,
  fokus,
  setFokus,
  danaDisetujui,
  setDanaDisetujui,
  tahun,
  setTahun,
  docType = 'kpi',
  setDocType,
  file,
  setFile,
  loading,
  onSubmit,
  onErrorMsg,
  uploadProgress = null
}: ResearchUploadModalProps) {
  const [, setIsDragging] = useState(false);

  // Scoring preview calculated locally based on docType, program, and danaDisetujui
  const scoringPreview = useMemo(() => {
    if (docType === 'arsip') {
      return {
        base: 0,
        dana: '0',
        total: '0',
        message: 'Kategori Arsip: Dokumen disimpan sebagai arsip (0 Poin)',
      };
    }

    const rawValue = danaDisetujui.replace(/\./g, '');
    if (!rawValue || isNaN(Number(rawValue))) return null;

    let basePoints = 0;
    if (program === 'hibah luar negeri') basePoints = 10;
    else if (program === 'hibah dikti') basePoints = 6;
    else if (program === 'hibah internal') basePoints = 3;

    return {
      base: basePoints,
      dana: '0',
      total: basePoints.toString(),
      message: `Estimasi Poin: ${basePoints} Poin`,
    };
  }, [docType, program, danaDisetujui]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        if (droppedFile.size <= 10 * 1024 * 1024) {
          setFile(droppedFile);
        } else {
          onErrorMsg('Ukuran file maksimal 10MB.');
        }
      } else {
        onErrorMsg('Hanya file PDF yang diperbolehkan.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size <= 10 * 1024 * 1024) {
          setFile(selectedFile);
        } else {
          onErrorMsg('Ukuran file maksimal 10MB.');
        }
      } else {
        onErrorMsg('Hanya file PDF yang diperbolehkan.');
      }
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Penelitian Baru"
      subtitle="Registrasikan hasil penelitian hibah eksternal, internal, atau luar negeri"
      icon={Upload}
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
        {/* Selector Tipe Dokumen: KPI Dosen vs Arsip Umum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDocType?.('kpi')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'kpi'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
            }`}
          >
            <Sparkles className="w-4 h-4 text-warning" />
            <div className="text-left">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">KPI Dosen</p>
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Automated Scoring</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType?.('arsip')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'arsip'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
            }`}
          >
            <Archive className="w-4 h-4 text-muted dark:text-on-dark-muted" />
            <div className="text-left">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">Arsip Umum</p>
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Storage Only (0 Poin)</p>
            </div>
          </button>
        </div>

        {/* Program Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
            Kategori Program Penelitian <span className="text-error ml-0.5">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 3 },
              { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 6 },
              { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 10 },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setProgram(item.key)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  program === item.key
                    ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
                }`}
              >
                <div className="p-2 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft mb-1.5 border border-hairline-light/60 dark:border-hairline-dark/60">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-ink-heading dark:text-on-dark text-center">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                  +{item.pts} Pts Base
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Judul Penelitian */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
            Judul Penelitian <span className="text-error ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={judulPenelitian}
            onChange={(e) => setJudulPenelitian(e.target.value)}
            placeholder="Masukkan judul penelitian..."
            className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted-soft"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Skema */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
              Skema Penelitian <span className="text-error ml-0.5">*</span>
            </label>
            <select
              value={skema}
              onChange={(e) => setSkema(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
            >
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="">
                Pilih Skema...
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="kompetisi">
                Kompetisi
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="pembinaan">
                Pembinaan
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="lainnya">
                Lainnya
              </option>
            </select>
          </div>

          {/* Fokus */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
              Fokus Penelitian <span className="text-error ml-0.5">*</span>
            </label>
            <select
              value={fokus}
              onChange={(e) => setFokus(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
            >
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="">
                Pilih Fokus...
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="kesehatan">
                Kesehatan
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="ekonomi">
                Ekonomi
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="teknologi">
                Teknologi
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="sosial">
                Sosial
              </option>
              <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="lainnya">
                Lainnya
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Dana Disetujui */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
              Dana Disetujui <span className="text-error ml-0.5">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-xs font-bold text-muted dark:text-on-dark-muted">Rp</span>
              </div>
              <input
                type="text"
                required
                value={danaDisetujui}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  const formatted = val ? Number(val).toLocaleString('id-ID') : '';
                  setDanaDisetujui(formatted);
                }}
                placeholder="Contoh: 10.000.000"
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark font-mono placeholder:text-muted-soft"
              />
            </div>
          </div>

          {/* Tahun */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
              Tanggal Pelaksanaan <span className="text-error ml-0.5">*</span>
            </label>
            <DatePicker date={tahun} onDateChange={setTahun} placeholder="Pilih tanggal pelaksanaan" />
          </div>
        </div>

        {/* Drag and Drop PDF */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
            Laporan Kemajuan / Akhir (PDF) <span className="text-error ml-0.5">*</span>
          </label>
          {file ? (
            <div className="relative p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setFile(null)}
                disabled={loading}
                aria-label="Hapus file PDF yang dipilih"
                className="absolute top-3.5 right-3.5 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 text-body dark:text-on-dark-soft" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate pr-6">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 bg-hairline-light dark:bg-hairline-dark h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-ink dark:bg-on-dark h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-body dark:text-on-dark-soft min-w-[30px] text-right">
                  {uploadProgress !== null ? `${uploadProgress}%` : '100%'}
                </span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('res-file-input-modal')?.click()}
              className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-dark"
            >
              <input
                id="res-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
              <div className="space-y-2 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-surface-light dark:bg-surface-dark shadow-2xs border border-hairline-light dark:border-hairline-dark">
                  <Upload className="h-5 w-5 text-muted dark:text-on-dark-muted" />
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    Pilih File PDF Laporan Penelitian
                  </p>
                  <p className="text-[11px] text-muted dark:text-on-dark-muted truncate max-w-[250px]">
                    Klik atau seret file laporan ke sini (maks. 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-hairline-light dark:border-hairline-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-hairline-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mengunggah...' : 'Unggah Penelitian'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}
