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
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden p-6 space-y-6"
          >
            <div>
              <h3 className="text-lg font-black text-ink-heading dark:text-on-dark uppercase tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-error" />
                Tolak Pengajuan
              </h3>
              <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-0.5">
                Berikan alasan penolakan dokumen
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark text-xs font-bold text-body-strong dark:text-on-dark">
                <p className="text-[9px] uppercase tracking-widest text-muted dark:text-on-dark-muted mb-1">Judul Pengajuan</p>
                <p className="uppercase leading-relaxed">{rejectingItem.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted dark:text-on-dark-muted uppercase tracking-widest ml-1">
                  Catatan Umpan Balik <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  value={feedbackText}
                  onChange={(e) => onFeedbackChange(e.target.value)}
                  placeholder="Contoh: Dokumen PDF yang diunggah tidak terbaca atau salah file. Harap unggah ulang."
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg font-bold focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-error/20 focus:border-error transition-all outline-none text-sm text-ink-heading dark:text-on-dark"
                />
                <p className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">
                  * Field ini wajib diisi sebelum mengonfirmasi penolakan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark text-body-strong dark:text-on-dark rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-hairline-light dark:border-hairline-dark"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!feedbackText.trim() || actionLoading}
                onClick={onConfirm}
                className="flex-1 px-5 py-3 bg-error hover:bg-error-hover disabled:opacity-50 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
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
