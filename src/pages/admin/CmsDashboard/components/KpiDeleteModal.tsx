import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cmsDashboardService } from '../services/cmsDashboardService';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface KpiDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string | null;
  onSuccess: () => void;
  triggerMessage: (msg: string, type?: 'success' | 'error') => void;
}

/**
 * Komponen Modal Konfirmasi Hapus Kategori KPI.
 */
export default function KpiDeleteModal({
  isOpen,
  onClose,
  category,
  onSuccess,
  triggerMessage
}: KpiDeleteModalProps) {
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
    if (!category) return;
    try {
      setIsDeleteLoading(true);
      await cmsDashboardService.deleteWeightCategory(category);
      triggerMessage('Kategori berhasil dihapus.', 'success');
      onClose();
      onSuccess();
    } catch {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 16 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 16 }} 
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 sm:p-8"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-error-soft border border-error-border flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Hapus Kategori KPI?</h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
                <p className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">{category}</p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={onClose} 
                  className="flex-1 px-4 py-2.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteInternal} 
                  disabled={isDeleteLoading} 
                  className="flex-1 px-4 py-2.5 bg-error hover:bg-error/90 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
