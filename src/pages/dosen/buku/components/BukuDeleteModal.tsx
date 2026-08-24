import React, { useState, useEffect } from 'react';
import { Trash2, Book, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

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

  const publishedYear = deleteDoc?.published_at 
    ? (() => {
        const str = String(deleteDoc.published_at).trim();
        if (/^\d{4}$/.test(str)) return str;
        const d = new Date(str);
        return !isNaN(d.getTime()) ? d.getFullYear() : str;
      })()
    : null;

  return (
    <AnimatePresence>
      {isOpen && deleteDoc && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-ink/40 dark:bg-canvas-dark/80 backdrop-blur-xs" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 8 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.96, y: 8 }} 
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 sm:p-7"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-error-soft dark:bg-error/15 border border-error-border/60 dark:border-error/30 flex items-center justify-center text-error dark:text-error-on-dark shadow-2xs">
                <Trash2 className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Hapus Buku?
                </h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-1 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Dokumen akan dihapus permanen dari sistem.
                </p>
              </div>

              <div className="w-full p-3.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark flex items-start gap-3 text-left">
                <div className="p-2 bg-surface-light dark:bg-surface-dark rounded-lg border border-hairline-light/80 dark:border-hairline-dark/80 text-muted dark:text-on-dark-muted shrink-0 mt-0.5 shadow-2xs">
                  <Book className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-2" title={deleteDoc.title}>
                    {deleteDoc.title}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark font-medium text-body dark:text-on-dark-soft">
                      {deleteDoc.category}
                    </span>
                    {publishedYear && (
                      <span className="font-mono text-muted dark:text-on-dark-muted">
                        • {publishedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 w-full mt-1">
                <button 
                  type="button"
                  onClick={onClose} 
                  disabled={isDeleteLoading}
                  className="flex-1 px-4 py-2.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteInternal} 
                  disabled={isDeleteLoading} 
                  className="flex-1 px-4 py-2.5 bg-error hover:bg-error/90 dark:bg-error-dark dark:hover:bg-error text-white rounded-xl text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isDeleteLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    'Ya, Hapus'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
