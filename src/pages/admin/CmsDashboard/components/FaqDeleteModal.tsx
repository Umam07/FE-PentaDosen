import React, { useState } from 'react';
import { Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Faq } from '../types/cmsDashboard.types';
import { cmsDashboardService } from '../services/cmsDashboardService';

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
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (c.includes('buku')) {
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
    if (c.includes('hki')) {
      return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    if (c.includes('penelitian')) {
      return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
    if (c.includes('kpi')) {
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
    return 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700';
  };

  return (
    <AnimatePresence>
      {isOpen && faq && (
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
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Hapus Panduan / FAQ?</h3>
                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>

              {/* Card Detail Item yang Akan Dihapus */}
              <div className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-800/70 rounded-2xl border border-gray-100 dark:border-zinc-700/80 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getCategoryBadgeStyle(faq.category)}`}>
                    <HelpCircle className="w-3 h-3" />
                    Kategori: {faq.category}
                  </span>
                </div>
                <p className="text-xs font-black text-gray-800 dark:text-zinc-200 tracking-tight line-clamp-2 leading-snug">
                  {faq.question}
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={onClose} 
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteInternal} 
                  disabled={isDeleteLoading} 
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
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
