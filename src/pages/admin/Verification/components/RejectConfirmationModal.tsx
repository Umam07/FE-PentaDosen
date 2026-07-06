import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RejectConfirmationModalProps } from '../types/verification.types';

export default function RejectConfirmationModal({
  rejectingItem,
  onClose,
  feedbackText,
  onFeedbackChange,
  actionLoading,
  onConfirm
}: RejectConfirmationModalProps) {
  return (
    <AnimatePresence>
      {rejectingItem && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden p-6 space-y-6"
          >
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                Tolak Pengajuan
              </h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                Berikan alasan penolakan dokumen
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-300">
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Judul Pengajuan</p>
                <p className="uppercase leading-relaxed">{rejectingItem.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Catatan Umpan Balik <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={feedbackText}
                  onChange={(e) => onFeedbackChange(e.target.value)}
                  placeholder="Contoh: Dokumen PDF yang diunggah tidak terbaca atau salah file. Harap unggah ulang."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/20 focus:border-red-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                />
                <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                  * Field ini wajib diisi sebelum mengonfirmasi penolakan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!feedbackText.trim() || actionLoading}
                onClick={onConfirm}
                className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
                Tolak Pengajuan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
