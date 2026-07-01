import React, { useState, useEffect } from 'react';
import { Pencil, Sparkles, Archive, Shield, CalendarDays, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseFormModal } from '../../../../components/ui/BaseFormModal';
import { HKI_CATEGORIES } from '../constants';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';

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
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editDocType, setEditDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    if (editDoc && isOpen) {
      setEditTitle(editDoc.title || '');
      setEditCategory(editDoc.category || 'HKI Paten');
      setEditDate(editDoc.published_at ? new Date(editDoc.published_at) : new Date());
      setEditDocType(editDoc.is_kpi_counted ? 'kpi' : 'arsip');
    }
  }, [editDoc, isOpen]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    try {
      setIsEditLoading(true);
      const res = await fetch(`/api/documents/${editDoc.id}`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle, 
          category: editCategory, 
          published_at: editDate ? formatToYYYYMMDD(editDate) : '', 
          doc_type: editDocType 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage(data.message || 'HKI berhasil diperbarui!', 'success');
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

          <div className="space-y-2 relative">
            <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
              Tanggal Perolehan
            </label>
            <DatePicker date={editDate} onDateChange={setEditDate} placeholder="Pilih tanggal perolehan" />
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
