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
            className="fixed inset-0 bg-canvas-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark overflow-hidden p-6 space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-error" />
                Tolak Pengajuan
              </h3>
              <p className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-1">
                Berikan alasan penolakan dokumen
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-xs font-semibold text-body-strong dark:text-on-dark">
                <p className="text-[10px] uppercase font-mono tracking-wider text-muted dark:text-on-dark-muted mb-1">Judul Pengajuan</p>
                <p className="leading-relaxed">{rejectingItem.title}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft uppercase tracking-wider">
                  Catatan Umpan Balik <span className="text-error">*</span>
                </label>
                <textarea
                  required
                  value={feedbackText}
                  onChange={(e) => onFeedbackChange(e.target.value)}
                  placeholder="Contoh: Dokumen PDF yang diunggah tidak terbaca atau salah file. Harap unggah ulang."
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg font-sans text-xs font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted"
                />
                <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted">
                  * Field ini wajib diisi sebelum mengonfirmasi penolakan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border border-hairline-light dark:border-hairline-dark shadow-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!feedbackText.trim() || actionLoading}
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 bg-error hover:bg-error-hover disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
