import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, CalendarDays, Upload, Award, BarChart3, FileText, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';

interface PublicationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDoc: any;
  weights: any[];
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function PublicationEditModal({
  isOpen,
  onClose,
  editDoc,
  weights,
  fetchDocuments,
  setIsTableLoading,
  onShowMessage
}: PublicationEditModalProps) {
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editDocType, setEditDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [editSintaRank, setEditSintaRank] = useState<string>('Non-SINTA');
  const [editCitations, setEditCitations] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [, setIsDragging] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (editDoc && isOpen) {
      setEditTitle(editDoc.title || '');
      setEditCategory(editDoc.category || '');
      setEditDate(editDoc.published_at ? new Date(editDoc.published_at) : new Date());
      setEditDocType(editDoc.is_kpi_counted ? 'kpi' : 'arsip');
      setEditSintaRank(editDoc.sinta_rank || 'Non-SINTA');
      setEditCitations(editDoc.citations !== undefined && editDoc.citations !== null ? String(editDoc.citations) : '');
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
      formData.append('published_at', editDate ? formatToYYYYMMDD(editDate) : '');
      formData.append('doc_type', editDocType);
      if ((editCategory || '').toLowerCase().includes('jurnal nasional')) {
        formData.append('sinta_rank', editSintaRank);
        if (editCitations !== '') {
          formData.append('citations', editCitations);
        }
      } else if ((editCategory || '').toLowerCase().includes('jurnal internasional')) {
        if (editCitations !== '') {
          formData.append('citations', editCitations);
        }
      }
      if (file) {
        formData.append('file', file);
      }

      const res = await uploadWithProgress(`/api/documents/${editDoc.id}`, 'POST', formData, setUploadProgress);
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'Publikasi berhasil diperbarui!', 'success');
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
      title="Edit Publikasi"
      subtitle={editDoc ? `Perbarui data publikasi #${editDoc.id}` : undefined}
      icon={Pencil}
      maxWidthClass="max-w-lg"
    >
      {editDoc && (
        <form id="edit-pub-form" onSubmit={handleUpdate} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {(['kpi', 'arsip'] as const).map(t => (
              <button 
                key={t} 
                type="button" 
                onClick={() => setEditDocType(t)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  editDocType === t 
                    ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10' 
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-light'
                }`}
              >
                {t === 'kpi' ? <Sparkles className="w-4 h-4 text-warning dark:text-warning-on-dark" /> : <Archive className="w-4 h-4 text-muted dark:text-on-dark-muted" />}
                <div className="text-left">
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark">{t === 'kpi' ? 'KPI Dosen' : 'Arsip Umum'}</p>
                  <p className="text-[10px] text-muted dark:text-on-dark-muted">{t === 'kpi' ? 'Masuk Poin KPI' : '0 Poin'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft">
              Judul Publikasi <span className="text-error ml-0.5">*</span>
            </label>
            <input 
              type="text" 
              required 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark" 
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="edit-pub-category" className="text-xs font-semibold text-body dark:text-on-dark-soft">
              Kategori Publikasi <span className="text-error ml-0.5">*</span>
            </label>
            <select 
              id="edit-pub-category"
              value={editCategory} 
              onChange={e => setEditCategory(e.target.value)} 
              required
              className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
            >
              {weights
                .filter((w: any) => {
                  const catLower = (w.category || '').toLowerCase();
                  return !catLower.includes('hki') && 
                         !catLower.includes('paten') && 
                         !catLower.includes('cipta') && 
                         !catLower.includes('merk') && 
                         !catLower.includes('merek') && 
                         !catLower.includes('buku') && 
                         !catLower.includes('monograf') && 
                         !catLower.includes('ajar') && 
                         !catLower.includes('referensi') && 
                         !catLower.includes('laporan') && 
                         !catLower.includes('proposal');
                })
                .map((w: any) => (
                  <option key={w.category} value={w.category} className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark">
                    {w.category} (+{w.weight_value} Pts)
                  </option>
                ))}
            </select>
          </div>

          {(editCategory || '').toLowerCase().includes('jurnal nasional') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="edit-pub-sinta-rank" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-warning dark:text-warning-on-dark" />
                  Akreditasi SINTA <span className="text-error ml-0.5">*</span>
                </label>
                <select
                  id="edit-pub-sinta-rank"
                  value={editSintaRank}
                  onChange={(e) => setEditSintaRank(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer font-mono"
                >
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="Non-SINTA">Non-SINTA (Tidak Terakreditasi)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S1">SINTA 1 (S1)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S2">SINTA 2 (S2)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S3">SINTA 3 (S3)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S4">SINTA 4 (S4)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S5">SINTA 5 (S5)</option>
                  <option className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark" value="S6">SINTA 6 (S6)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edit-pub-citations" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                  Jumlah Sitasi (Opsional)
                </label>
                <input
                  type="number"
                  id="edit-pub-citations"
                  min="0"
                  value={editCitations}
                  onChange={(e) => setEditCitations(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark font-mono"
                />
              </div>
            </div>
          )}

          {(editCategory || '').toLowerCase().includes('jurnal internasional') && (
            <div className="space-y-1.5">
              <label htmlFor="edit-pub-citations-international" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                Jumlah Sitasi (Opsional)
              </label>
              <input
                type="number"
                id="edit-pub-citations-international"
                min="0"
                value={editCitations}
                onChange={(e) => setEditCitations(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark font-mono"
              />
            </div>
          )}

          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
              Tanggal Terbit <span className="text-error ml-0.5">*</span>
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal terbit" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-body dark:text-on-dark-soft">File Publikasi (PDF)</label>
            {file ? (
              <div className="relative p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
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
                  <div className="flex-1 bg-surface-light dark:bg-surface-dark h-1.5 rounded-full overflow-hidden border border-hairline-light dark:border-hairline-dark">
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
                onClick={() => document.getElementById('pub-edit-file-input')?.click()}
                className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/40 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-light"
              >
                <input
                  id="pub-edit-file-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-surface-light dark:bg-surface-dark shadow-2xs border border-hairline-light dark:border-hairline-dark">
                    <Upload className="h-5 w-5 text-muted dark:text-on-dark-muted" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-4">
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      Pilih File PDF Dokumen Publikasi
                    </p>
                    <p className="text-[11px] text-muted dark:text-on-dark-muted truncate max-w-[250px]">
                      {editDoc.file_url && editDoc.file_url !== '-' ? 'File saat ini: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui file dokumen'}
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
              className="px-4 py-2.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-all cursor-pointer"
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
