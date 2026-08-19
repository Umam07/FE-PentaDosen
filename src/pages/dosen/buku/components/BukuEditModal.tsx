import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, CalendarDays, Upload, FileText, XCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { BUKU_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';

interface BukuEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editDoc: any;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function BukuEditModal({
  isOpen,
  onClose,
  editDoc,
  fetchDocuments,
  setIsTableLoading,
  onShowMessage
}: BukuEditModalProps) {
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Buku Referensi');
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editDocType, setEditDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (editDoc && isOpen) {
      setEditTitle(editDoc.title || '');
      setEditCategory(editDoc.category || 'Buku Referensi');
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
      formData.append('published_at', editDate ? formatToYYYYMMDD(editDate) : '');
      formData.append('doc_type', editDocType);
      if (file) {
        formData.append('file', file);
      }

      const res = await uploadWithProgress(`/api/documents/${editDoc.id}`, 'POST', formData, setUploadProgress);
      if (res.ok) {
        await new Promise(r => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'Buku berhasil diperbarui!', 'success');
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
      title="Edit Buku"
      subtitle={editDoc ? 'Perbarui data buku Anda' : undefined}
      icon={Pencil}
      iconColorClass="text-slate-700 dark:text-slate-200"
      maxWidthClass="max-w-lg"
    >
      {editDoc && (
        <form id="edit-buku-form" onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {(['kpi', 'arsip'] as const).map(t => (
              <button 
                key={t} 
                type="button" 
                onClick={() => setEditDocType(t)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  editDocType === t 
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/10' 
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {t === 'kpi' ? <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Archive className="w-4 h-4 text-slate-500" />}
                <div className="text-left">
                  <p className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">{t === 'kpi' ? 'KPI' : 'Arsip'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t === 'kpi' ? 'Masuk Poin KPI' : '0 Pts'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Judul Buku</label>
            <input 
              type="text" 
              required 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:bg-white dark:focus:bg-slate-900 focus:ring-3 focus:ring-accent/15 focus:border-accent transition-all outline-none text-sm text-slate-900 dark:text-white" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Kategori Buku
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BUKU_CATEGORIES.map((opt) => {
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setEditCategory(opt.value)}
                    className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      editCategory === opt.value
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/10'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all ${
                      editCategory === opt.value ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200/70'
                    }`}>
                      {IconComp && (
                        <IconComp className={`w-4 h-4 ${editCategory === opt.value ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <p className={`text-xs font-bold text-center tracking-tight ${
                      editCategory === opt.value ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] font-semibold font-mono mt-1 text-slate-600 dark:text-slate-400 tabular-nums">+{opt.points} Pts</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1 flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              Tanggal Terbit
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal terbit" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">File Buku (PDF)</label>
            {file ? (
              <div className="relative p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-4">
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={isEditLoading}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-6">
                      {file.name}
                    </p>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-slate-900 dark:bg-zinc-100 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 min-w-[35px] text-right">
                    {uploadProgress !== null ? `${uploadProgress}%` : '100%'}
                  </span>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('buku-edit-file-input')?.click()}
                className="relative group mt-1 flex justify-center px-6 py-6 border-2 rounded-xl transition-all duration-200 cursor-pointer border-slate-200 dark:border-slate-800 border-dashed bg-slate-50/40 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
              >
                <input
                  id="buku-edit-file-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                    <Upload className="h-5 w-5 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-4">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tarik & Lepaskan File PDF
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[250px]">
                      {editDoc.file_url && editDoc.file_url !== '-' ? 'File saat ini: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isEditLoading} 
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </BaseFormModal>
  );
}

