import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, Shield, CalendarDays, ChevronDown, Upload, CheckCircle } from 'lucide-react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';

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
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    if (editDoc && isOpen) {
      setEditTitle(editDoc.title || '');
      setEditCategory(editDoc.category || '');
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
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', editTitle);
      formData.append('category', editCategory);
      formData.append('published_at', editDate ? formatToYYYYMMDD(editDate) : '');
      formData.append('doc_type', editDocType);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`/api/documents/${editDoc.id}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage(data.message || 'Publikasi berhasil diperbarui!', 'success');
        setFile(null);
        onClose();
        setIsTableLoading(true); 
        await fetchDocuments(); 
        setIsTableLoading(false);
      } else { 
        onShowMessage(data.message || 'Gagal memperbarui.', 'error'); 
      }
    } catch { 
      onShowMessage('Terjadi kesalahan.', 'error'); 
    } finally { 
      setIsEditLoading(false); 
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen && !!editDoc}
      onClose={onClose}
      title="Edit Publikasi"
      subtitle={editDoc ? `Perbarui data publikasi #${editDoc.id}` : undefined}
      icon={Pencil}
      iconColorClass="text-blue-500"
      maxWidthClass="max-w-lg"
    >
      {editDoc && (
        <form id="edit-pub-form" onSubmit={handleUpdate} className="space-y-5">
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
                  <p className="text-[9px] text-gray-400">{t === 'kpi' ? 'Masuk Poin KPI' : '0 Pts'}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Publikasi</label>
            <input 
              type="text" 
              required 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-pub-category" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori Publikasi</label>
            <div className="relative">
              <select 
                id="edit-pub-category"
                value={editCategory} 
                onChange={e => setEditCategory(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer appearance-none"
              >
                {weights.map((w: any) => (
                  <option key={w.category} value={w.category}>{w.category} (+{w.weight_value} PTS)</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
              Tanggal Terbit
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal terbit" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File Publikasi (PDF)</label>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pub-edit-file-input')?.click()}
              className={`relative group mt-1 flex justify-center px-6 py-6 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                  : file 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                    : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
              }`}
            >
              <input
                id="pub-edit-file-input"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2 text-center">
                <div className={`mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDragging ? 'scale-110 bg-primary-600' : 
                  file ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                }`}>
                  {file ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 animate-bounce" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                    {file ? 'Publikasi Terpilih!' : 'Drag & Drop PDF'}
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                    {file ? file.name : editDoc.file_url && editDoc.file_url !== '-' ? 'Replaced current file: ' + editDoc.file_url.split('/').pop() : 'Pilih file PDF jika ingin memperbarui/mengunggah'}
                  </p>
                </div>
              </div>
            </div>
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </BaseFormModal>
  );
}
