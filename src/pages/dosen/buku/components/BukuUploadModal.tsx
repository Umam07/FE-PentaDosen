import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle,
  CalendarDays, FileText, XCircle, BookOpen, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/shared/BaseFormModal';
import { BUKU_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';

interface BukuUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  documents: any[];
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function BukuUploadModal({
  isOpen,
  onClose,
  user,
  documents,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: BukuUploadModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Buku Referensi');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: any) => 
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      doc.is_kpi_counted
    );
  }, [title, documents]);

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
        setFile(droppedFile);
      } else {
        onShowMessage('Hanya file PDF yang diperbolehkan.', 'error');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !date) {
      onShowMessage('Harap lengkapi semua field.', 'error');
      return;
    }

    if (duplicateFound) {
      onShowMessage('Buku ini sudah terdata dalam sistem.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', user.id);
    formData.append('published_at', date ? formatToYYYYMMDD(date) : '');
    formData.append('doc_type', docType);

    try {
      setLoading(true);
      setUploadProgress(0);
      const res = await uploadWithProgress('/api/documents', 'POST', formData, setUploadProgress);
      
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'Buku berhasil diunggah!', 'success');
        setTitle('');
        setFile(null);
        setDate(new Date());
        onClose();
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        let errorMsg = res.data?.message || 'Gagal mengunggah buku.';
        if (res.data?.errors && res.data.errors.title) {
          errorMsg = res.data.errors.title[0];
        }
        onShowMessage(errorMsg, 'error');
      }
    } catch {
      onShowMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Buku Baru"
      subtitle="Daftarkan Buku Ajar, Referensi, atau Monograf"
      icon={Upload}
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleUpload} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => setDocType('kpi')}
            className={`group relative flex items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
              docType === 'kpi'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 transition-colors ${
              docType === 'kpi' ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted'
            }`}>
              <Sparkles className="w-4 h-4 text-warning" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
                Dokumen KPI Dosen
              </p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">Dihitung otomatis dalam metrik penilaian</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType('arsip')}
            className={`group relative flex items-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
              docType === 'arsip'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mr-3 transition-colors ${
              docType === 'arsip' ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted'
            }`}>
              <Archive className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">
                Arsip Pribadi / Umum
              </p>
              <p className="text-[11px] text-muted dark:text-on-dark-muted">Penyimpanan mandiri (0 Poin KPI)</p>
            </div>
          </button>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="buku-title" className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">
            Judul Buku <span className="text-error">*</span>
          </label>
          <input 
            type="text"
            id="buku-title"
            required
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Masukkan judul buku..."
            className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted/60 dark:placeholder:text-on-dark-muted/60" 
          />
          {docType === 'kpi' && title.length > 3 && !duplicateFound && (
            <p className="text-[11px] font-semibold text-muted dark:text-on-dark-muted flex items-center bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-lg w-fit mt-1 border border-hairline-light dark:border-hairline-dark">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-warning fill-current" />
              Sistem verifikasi otomatis siap memproses
            </p>
          )}
          {duplicateFound && (
            <div className="p-3 rounded-xl bg-warning-soft dark:bg-warning/15 border border-warning-border dark:border-warning/30 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-warning dark:text-warning-on-dark shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark">Dokumen Sudah Terdata</p>
                <p className="text-[11px] text-body dark:text-on-dark-soft leading-relaxed mt-0.5">
                  Buku dengan judul ini sudah terhitung dalam poin KPI. Pengunggahan dibatasi untuk menghindari duplikasi data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Kategori Buku Card Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
            Kategori Buku <span className="text-error ml-0.5">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {BUKU_CATEGORIES.map((opt) => {
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    category === opt.value
                      ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                      : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-all ${
                    category === opt.value ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink' : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft'
                  }`}>
                    {IconComp && (
                      <IconComp className="w-4 h-4" />
                    )}
                  </div>
                  <p className="text-xs font-bold text-center tracking-tight text-ink-heading dark:text-on-dark">
                    {opt.label}
                  </p>
                  <p className="text-[11px] font-semibold font-mono tabular-nums mt-0.5 text-muted dark:text-on-dark-muted">+{opt.points} Pts</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
            Tanggal Terbit <span className="text-error ml-0.5">*</span>
          </label>
          <DatePicker date={date} onDateChange={setDate} placeholder="Pilih tanggal terbit" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">
            File Buku (PDF) <span className="text-error">*</span>
          </label>
          {file ? (
            <div className="relative p-4 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => setFile(null)}
                disabled={loading}
                className="absolute top-3.5 right-3.5 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 text-muted dark:text-on-dark-muted" />
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
                <div className="flex-1 bg-surface-light-raised dark:bg-surface-dark h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-ink dark:bg-on-dark h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-muted dark:text-on-dark-muted min-w-[30px] text-right">
                  {uploadProgress !== null ? `${uploadProgress}%` : '100%'}
                </span>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('buku-file-input-modal')?.click()}
              className="relative group mt-1 flex justify-center px-6 py-7 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/40 hover:bg-surface-light-raised dark:hover:bg-surface-dark hover:border-muted dark:hover:border-hairline-light-soft"
            >
              <input
                id="buku-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-surface-light dark:bg-surface-dark-elevated shadow-2xs border border-hairline-light dark:border-hairline-dark">
                  <Upload className="h-5 w-5 text-muted dark:text-on-dark-muted" />
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    Pilih File PDF Buku
                  </p>
                  <p className="text-[11px] text-muted dark:text-on-dark-muted">
                    Klik untuk memilih atau seret file ke area ini
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
            disabled={loading || !!duplicateFound}
            className="px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mengunggah...' : 'Kirim Buku'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}


