import React, { useEffect } from 'react';
import { MessageSquare, X, Image as ImageIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CreateTicketModalProps } from '../types/faqHelp.types';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

export default function CreateTicketModal({
  isOpen,
  ticketSubject,
  ticketMessage,
  ticketImageFile,
  ticketImagePreview,
  submittingTicket,
  onClose,
  onSubjectChange,
  onMessageChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: CreateTicketModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submittingTicket) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [isOpen, onClose, submittingTicket]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!submittingTicket) onClose(); }}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark overflow-hidden z-10 p-6 space-y-4 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-hairline-light-soft dark:border-hairline-dark-soft pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-ink-soft dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                  <MessageSquare className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark">Kirim Pesan ke Admin</h3>
                  <p className="text-[10px] text-muted dark:text-on-dark-muted font-mono font-semibold uppercase tracking-wider">
                    Sampaikan kendala atau pertanyaan Anda
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted hover:text-body dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Input Subjek */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                  Subjek Pesan <span className="text-muted dark:text-on-dark-muted font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kendala Upload PDF (opsional)"
                  value={ticketSubject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:border-accent dark:focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
              </div>

              {/* Textarea Pesan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                  Isi Pesan / Pertanyaan <span className="text-error">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan pertanyaan atau kendala Anda secara detail..."
                  value={ticketMessage}
                  onChange={(e) => onMessageChange(e.target.value)}
                  required
                  className="w-full p-3.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:border-accent dark:focus:border-accent focus:ring-2 focus:ring-accent/15 leading-relaxed"
                />
              </div>

              {/* Upload Gambar Tangkapan Layar (Maks 10MB) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink-heading dark:text-on-dark flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                    Lampirkan Gambar Kendala <span className="text-muted dark:text-on-dark-muted font-normal">(Opsional)</span>
                  </span>
                  <span className="text-[10px] text-muted dark:text-on-dark-muted font-mono">Maks 10 MB</span>
                </label>

                {ticketImagePreview ? (
                  <div className="relative group rounded-xl border border-hairline-light dark:border-hairline-dark p-2 bg-surface-light-raised dark:bg-surface-dark-soft flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ticketImagePreview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-hairline-light dark:border-hairline-dark shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-ink-heading dark:text-on-dark truncate">
                          {ticketImageFile?.name}
                        </p>
                        <p className="text-[10px] text-muted dark:text-on-dark-muted font-mono">
                          {ticketImageFile ? (ticketImageFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="p-2 rounded-lg bg-error-soft hover:bg-error/20 dark:bg-error/15 dark:hover:bg-error/25 text-error dark:text-error-on-dark border border-error-border dark:border-error/30 transition-colors cursor-pointer"
                      title="Hapus gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-hairline-light dark:border-hairline-dark hover:border-accent dark:hover:border-accent rounded-xl p-4 cursor-pointer bg-surface-light-raised/40 dark:bg-surface-dark-soft/40 transition-colors group">
                    <div className="flex items-center gap-2 text-muted dark:text-on-dark-muted group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-semibold">Klik untuk memilih gambar / screenshot</span>
                    </div>
                    <p className="text-[10px] text-muted dark:text-on-dark-muted mt-1 font-mono">Format disukai: PNG, JPG, JPEG, WebP (Maks 10 MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light-raised hover:bg-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-body dark:text-on-dark text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingTicket ? 'Mengirim...' : 'Kirim Pesan'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

