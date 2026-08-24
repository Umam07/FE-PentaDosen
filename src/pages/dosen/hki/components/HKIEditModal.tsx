import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, Shield, CalendarDays, Upload, FileText, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { HKI_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';

interface HKIEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDoc: any;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function HKIEditModal({
  isOpen,
  onClose,
  editDoc,
  fetchDocuments,
  setIsTableLoading,
  onShowMessage
}: HKIEditModalProps) {
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('HKI Paten');
  const [editHkiType, setEditHkiType] = useState('');
  const [editInventorName, setEditInventorName] = useState('');
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editDocType, setEditDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  const [, setIsDragging] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (editDoc && isOpen) {
      setEditTitle(editDoc.title || '');
      setEditCategory(editDoc.category || 'HKI Paten');
      setEditHkiType(editDoc.hki_type || '');
      setEditInventorName(editDoc.inventor_name || '');
      setEditDate(editDoc.published_at ? new Date(editDoc.published_at) : new Date());
      setEditDocType(editDoc.is_kpi_counted ? 'kpi' : 'arsip');
      setFile(null);
    }
  }, [editDoc, isOpen]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    try {
      setIsEditLoading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', editTitle);
      formData.append('category', editCategory);
      formData.append('hki_type', editHkiType);
      formData.append('inventor_name', editInventorName);
      formData.append('published_at', editDate ? formatToYYYYMMDD(editDate) : '');
      formData.append('doc_type', editDocType);
      if (file) {
        formData.append('file', file);
      }

      const res = await uploadWithProgress(`/api/documents/${editDoc.id}`, 'POST', formData, setUploadProgress);
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'HKI berhasil diperbarui!', 'success');
        setFile(null);
        onClose();
        setIsTableLoading(true); 
        await fetchDocuments(); 
        setIsTableLoading(false);
      } else { 
        onShowMessage(res.data?.message || 'Gagal memperbarui.', 'error'); 
      }
    } catch { 
      onShowMessage('Terjadi kesalahan.', 'error'); 
    } finally { 
      setIsEditLoading(false); 
      setUploadProgress(null); 
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen && !!editDoc}
      onClose={onClose}
      title="Edit HKI"
      subtitle={editDoc ? 'Perbarui data HKI Anda' : undefined}
      icon={Pencil}
      maxWidthClass="max-w-lg"
    >
      {editDoc && (
        <form id="edit-hki-form" onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(['kpi', 'arsip'] as const).map(t => (
              <button 
                key={t} 
                type="button" 
                onClick={() => setEditDocType(t)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  editDocType === t 
                    ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10' 
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
                }`}
              >
                {t === 'kpi' ? <Sparkles className="w-4 h-4 text-warning" /> : <Archive className="w-4 h-4 text-muted dark:text-on-dark-muted" />}
                <div className="text-left">
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark">{t === 'kpi' ? 'KPI Dosen' : 'Arsip Umum'}</p>
                  <p className="text-[10px] text-muted dark:text-on-dark-muted">{t === 'kpi' ? 'Masuk KPI' : '0 Poin'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">
              Judul HKI <span className="text-error ml-0.5">*</span>
            </label>
            <input 
              type="text" 
              required 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted/60 dark:placeholder:text-on-dark-muted/60" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
              Jenis HKI <span className="text-error ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HKI_CATEGORIES.map(opt => (
                <button 
                  key={opt.id} 
                  type="button" 
                  onClick={() => setEditCategory(opt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    editCategory === opt.id 
                      ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10' 
                      : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-dark'
                  }`}
                >
                  <opt.icon className="w-4 h-4 text-muted dark:text-on-dark-muted" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-ink-heading dark:text-on-dark">{opt.label}</p>
                    <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted">+{opt.pts} Pts</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label htmlFor="editHkiType" className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">
                Kategori Spesifik (Opsional)
              </label>
              <input
                type="text"
                id="editHkiType"
                value={editHkiType}
                onChange={(e) => setEditHkiType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted/60 dark:placeholder:text-on-dark-muted/60"
                placeholder="Misal: Software, Desain Industri..."
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="editInventorName" className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">
                Nama Inventor (Opsional)
              </label>
              <input
                type="text"
                id="editInventorName"
                value={editInventorName}
                onChange={(e) => setEditInventorName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark placeholder:text-muted/60 dark:placeholder:text-on-dark-muted/60"
                placeholder="Masukkan nama inventor..."
              />
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
              Tanggal Perolehan <span className="text-error ml-0.5">*</span>
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal perolehan" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body-strong dark:text-on-dark-soft">File HKI (PDF)</label>
            {file ? (
              <div className="relative p-4 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={isEditLoading}
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
                onClick={() => document.getElementById('hki-edit-file-input')?.click()}
                className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/40 hover:bg-surface-light-raised dark:hover:bg-surface-dark hover:border-muted dark:hover:border-hairline-light-soft"
              >
                <input
                  id="hki-edit-file-input"
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
                      Pilih File PDF Dokumen HKI
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

