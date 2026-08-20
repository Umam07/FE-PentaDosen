import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface PublicationDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteDoc: any;
  setDeleteDoc: (doc: any) => void;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function PublicationDeleteModal({
  isOpen,
  onClose,
  deleteDoc,
  setDeleteDoc,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: PublicationDeleteModalProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose]);

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
        onShowMessage(data.message || 'Publikasi berhasil dihapus!', 'success');
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
            className="fixed inset-0 bg-ink-active/60 dark:bg-canvas-dark/80 backdrop-blur-xs" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-hairline-light dark:border-hairline-dark p-6 sm:p-7"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-error-soft dark:bg-error/15 border border-error-border dark:border-error/30 flex items-center justify-center text-error dark:text-error-on-dark">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark">Hapus Publikasi?</h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-left">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark line-clamp-2">{deleteDoc.title}</p>
                <p className="text-[11px] text-muted dark:text-on-dark-muted mt-1">{deleteDoc.category}</p>
              </div>
              <div className="flex gap-2.5 w-full mt-2">
                <button 
                  onClick={onClose} 
                  className="flex-1 px-4 py-2.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteInternal} 
                  disabled={isDeleteLoading} 
                  className="flex-1 px-4 py-2.5 bg-error hover:bg-error/90 dark:bg-error-dark dark:hover:bg-error text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
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
