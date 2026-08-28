import React, { useState } from 'react';
import { Pencil, Home, Landmark, Globe, CalendarDays, Upload, FileText, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/shared/BaseFormModal';
import { DatePicker } from '../../../../components/ui/DatePicker';

interface ResearchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDoc: any;
  editJudul: string;
  setEditJudul: (val: string) => void;
  editDana: string;
  setEditDana: (val: string) => void;
  editProgram: string;
  setEditProgram: (val: string) => void;
  editSkema: string;
  setEditSkema: (val: string) => void;
  editFokus: string;
  setEditFokus: (val: string) => void;
  editTahun: Date | undefined;
  setEditTahun: (val: Date | undefined) => void;
  editFile: File | null;
  setEditFile: (val: File | null) => void;
  isEditLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  uploadProgress?: number | null;
}

export default function ResearchEditModal({
  isOpen,
  onClose,
  editDoc,
  editJudul,
  setEditJudul,
  editDana,
  setEditDana,
  editProgram,
  setEditProgram,
  editSkema,
  setEditSkema,
  editFokus,
  setEditFokus,
  editTahun,
  setEditTahun,
  editFile,
  setEditFile,
  isEditLoading,
  onSubmit,
  uploadProgress = null
}: ResearchEditModalProps) {
  const [, setIsDragging] = useState(false);

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
        setEditFile(droppedFile);
      }
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen && !!editDoc}
      onClose={onClose}
      title="Edit Penelitian"
      subtitle={editDoc ? 'Perbarui data penelitian Anda' : undefined}
      icon={Pencil}
      maxWidthClass="max-w-2xl"
    >
      {editDoc && (
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Program */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
              Kategori Program <span className="text-error ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 3 },
                { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 6 },
                { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 10 },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setEditProgram(item.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    editProgram === item.key
                      ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                      : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-body dark:text-on-dark-soft mb-1" />
                  <span className="text-xs font-bold text-ink-heading dark:text-on-dark text-center">{item.label}</span>
                  <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">+{item.pts} Pts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Judul */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
              Judul Penelitian <span className="text-error ml-0.5">*</span>
            </label>
            <input
              type="text"
              required
              value={editJudul}
              onChange={(e) => setEditJudul(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted-soft"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Skema */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
                Skema <span className="text-error ml-0.5">*</span>
              </label>
              <select
                value={editSkema}
                onChange={(e) => setEditSkema(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
              >
                <option value="">Pilih Skema...</option>
                <option value="kompetisi">Kompetisi</option>
                <option value="pembinaan">Pembinaan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            {/* Fokus */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-body-strong dark:text-on-dark">
                Fokus <span className="text-error ml-0.5">*</span>
              </label>
              <select
                value={editFokus}
                onChange={(e) => setEditFokus(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
              >
                <option value="">Pilih Fokus...</option>
                <option value="kesehatan">Kesehatan</option>
                <option value="ekonomi">Ekonomi</option>
                <option value="teknologi">Teknologi</option>
                <option value="sosial">Sosial</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Dana */}
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
                  value={editDana}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEditDana(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
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
              <DatePicker date={editTahun} onDateChange={setEditTahun} placeholder="Pilih tanggal pelaksanaan" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark">File Laporan Penelitian (PDF)</label>
            {editFile ? (
              <div className="relative p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={() => setEditFile(null)}
                  disabled={isEditLoading}
                  aria-label="Hapus file PDF terpilih"
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
                      {editFile.name}
                    </p>
                    <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                      {(editFile.size / (1024 * 1024)).toFixed(2)} MB
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
                onClick={() => document.getElementById('research-edit-file-input')?.click()}
                className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-dark"
              >
                <input
                  id="research-edit-file-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-surface-light dark:bg-surface-dark shadow-2xs border border-hairline-light dark:border-hairline-dark">
                    <Upload className="h-5 w-5 text-muted dark:text-on-dark-muted" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-4">
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      Pilih File PDF Dokumen Penelitian
                    </p>
                    <p className="text-[11px] text-muted dark:text-on-dark-muted truncate max-w-[250px]">
                      {editDoc.file_url && editDoc.file_url !== '-' ? 'File saat ini: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-hairline-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isEditLoading}
              className="px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </BaseFormModal>
  );
}
