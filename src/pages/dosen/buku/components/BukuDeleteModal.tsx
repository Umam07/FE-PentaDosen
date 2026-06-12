import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BukuDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteDoc: any;
  setDeleteDoc: (doc: any) => void;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function BukuDeleteModal({
  isOpen,
  onClose,
  deleteDoc,
  setDeleteDoc,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: BukuDeleteModalProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteInternal = async () => {
    if (!deleteDoc) return;
    try {
      setIsDeleteLoading(true);
      const res = await fetch(`/api/documents/${deleteDoc.id}`, {
        method: 'DELETE', 
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        onShowMessage(data.message || 'Buku berhasil dihapus!', 'success');
        onClose(); 
        setDeleteDoc(null);
        setIsTableLoading(true); 
        await fetchDocuments(); 
        setCurrentPage(1); 
        setIsTableLoading(false);
      } else { 
        onShowMessage(data.message || 'Gagal menghapus.', 'error'); 
      }
    } catch { 
      onShowMessage('Terjadi kesalahan.', 'error'); 
    } finally { 
      setIsDeleteLoading(false); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && deleteDoc && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-gray-950/70 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }} 
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Hapus Buku?</h3>
                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                <p className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{deleteDoc.title}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">{deleteDoc.category}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={onClose} 
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteInternal} 
                  disabled={isDeleteLoading} 
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-red-900/30 transition-all active:scale-95 disabled:opacity-60"
                >
                  {isDeleteLoading ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
