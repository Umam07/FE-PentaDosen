import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface ResearchDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteDoc: any;
  onDelete: () => void;
  isDeleteLoading: boolean;
}

export default function ResearchDeleteModal({
  isOpen,
  onClose,
  deleteDoc,
  onDelete,
  isDeleteLoading,
}: ResearchDeleteModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && deleteDoc && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden p-6 sm:p-7"
          >
            <div className="flex flex-col items-center text-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-error-soft dark:bg-error/15 flex items-center justify-center border border-error-border dark:border-error/30 text-error dark:text-error-on-dark">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Hapus Penelitian?
                </h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-1">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-left">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate">
                  {deleteDoc.judul_penelitian}
                </p>
                <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5">
                  {deleteDoc.program} • {deleteDoc.tahun}
                </p>
              </div>
              <div className="flex gap-2.5 w-full mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-hairline-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleteLoading}
                  className="flex-1 px-4 py-2.5 bg-error hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
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
