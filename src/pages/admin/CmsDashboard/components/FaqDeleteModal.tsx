import React, { useState, useEffect } from 'react';
import { Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Faq } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface FaqDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
  onSuccess: () => void;
  triggerMessage: (msg: string, type?: 'success' | 'error') => void;
}

/**
 * Komponen Modal Konfirmasi Hapus FAQ / Panduan.
 */
export default function FaqDeleteModal({
  isOpen,
  onClose,
  faq,
  onSuccess,
  triggerMessage
}: FaqDeleteModalProps) {
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
    if (!faq) return;
    try {
      setIsDeleteLoading(true);
      await cmsDashboardService.deleteFaq(faq.id);
      triggerMessage('Panduan FAQ berhasil dihapus.', 'success');
      onClose();
      onSuccess();
    } catch {
      triggerMessage('Gagal menghapus panduan.', 'error');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const getCategoryBadgeStyle = (categoryName?: string) => {
    const c = (categoryName || '').toLowerCase();
    if (c.includes('publikasi') || c.includes('scholar') || c.includes('scopus')) {
      return 'bg-accent-soft text-accent dark:text-accent-on-dark border-accent/20';
    }
    if (c.includes('buku')) {
      return 'bg-chart-buku/15 text-chart-buku border-chart-buku/30';
    }
    if (c.includes('hki')) {
      return 'bg-chart-hki/15 text-chart-hki border-chart-hki/30';
    }
    if (c.includes('penelitian')) {
      return 'bg-chart-penelitian/15 text-chart-penelitian border-chart-penelitian/30';
    }
    if (c.includes('kpi')) {
      return 'bg-success-soft text-success-dark dark:text-success-on-dark border-success-border';
    }
    return 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border-hairline-light-soft dark:border-hairline-dark-soft';
  };

  return (
    <AnimatePresence>
      {isOpen && faq && (
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
                <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Hapus Panduan / FAQ?</h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>

              {/* Card Detail Item yang Akan Dihapus */}
              <div className="w-full px-4 py-3.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${getCategoryBadgeStyle(faq.category)}`}>
                    <HelpCircle className="w-3 h-3" />
                    Kategori: {faq.category}
                  </span>
                </div>
                <p className="text-xs font-semibold text-ink-heading dark:text-on-dark tracking-tight line-clamp-2 leading-snug">
                  {faq.question}
                </p>
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
