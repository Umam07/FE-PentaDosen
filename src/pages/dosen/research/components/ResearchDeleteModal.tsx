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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden p-6 sm:p-7"
          >
            <div className="flex flex-col items-center text-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center border border-red-200/60 dark:border-red-800/60">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Hapus Penelitian?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {deleteDoc.judul_penelitian}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {deleteDoc.program} • {deleteDoc.tahun}
                </p>
              </div>
              <div className="flex gap-2.5 w-full mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleteLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
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

