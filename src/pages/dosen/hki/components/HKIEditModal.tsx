import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, Shield, CalendarDays, ChevronDown, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { HKI_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';
import { FileText, XCircle } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
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
      subtitle={editDoc ? `Perbarui data HKI #${editDoc.id}` : undefined}
      icon={Pencil}
      iconColorClass="text-blue-500"
      maxWidthClass="max-w-lg"
    >
      {editDoc && (
        <form id="edit-hki-form" onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {(['kpi', 'arsip'] as const).map(t => (
              <button 
                key={t} 
                type="button" 
                onClick={() => setEditDocType(t)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  editDocType === t 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200'
                }`}
              >
                {t === 'kpi' ? <Sparkles className="w-4 h-4 text-emerald-500" /> : <Archive className="w-4 h-4 text-gray-400" />}
                <div className="text-left">
                  <p className="text-[11px] font-black uppercase tracking-tight">{t === 'kpi' ? 'KPI' : 'Arsip'}</p>
                  <p className="text-[9px] text-gray-400">{t === 'kpi' ? 'Masuk KPI' : '0 Pts'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul HKI</label>
            <input 
              type="text" 
              required 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
              Jenis HKI
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HKI_CATEGORIES.map(opt => (
                <button 
                  key={opt.id} 
                  type="button" 
                  onClick={() => setEditCategory(opt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
                    editCategory === opt.id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
                      : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200'
                  }`}
                >
                  <opt.icon className={`w-4 h-4 ${editCategory === opt.id ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-tight">{opt.label}</p>
                    <p className="text-[8px] text-gray-400">+{opt.pts} Pts</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="editHkiType" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Kategori Spesifik (Opsional)
              </label>
              <input
                type="text"
                id="editHkiType"
                value={editHkiType}
                onChange={(e) => setEditHkiType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                placeholder="Misal: Software, Desain Industri..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="editInventorName" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Nama Inventor (Opsional)
              </label>
              <input
                type="text"
                id="editInventorName"
                value={editInventorName}
                onChange={(e) => setEditInventorName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                placeholder="Masukkan nama inventor..."
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
              Tanggal Perolehan
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal perolehan" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File HKI (PDF)</label>
            {file ? (
              <div className="relative p-5 bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col gap-4">
                <button 
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={isEditLoading}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-850 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-gray-900 dark:text-zinc-100 truncate pr-6 uppercase tracking-tight">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gray-900 dark:bg-zinc-100 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-zinc-400 min-w-[30px] text-right">
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
                className={`relative group mt-1 flex justify-center px-6 py-6 border-2 rounded-xl transition-all duration-300 cursor-pointer border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400`}
              >
                <input
                  id="hki-edit-file-input"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-2 text-center">
                  <div className={`mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-4">
                    <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                      Drag & Drop PDF
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                      {editDoc.file_url && editDoc.file_url !== '-' ? 'Replaced current file: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui/mengunggah'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isEditLoading} 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </BaseFormModal>
  );
}
