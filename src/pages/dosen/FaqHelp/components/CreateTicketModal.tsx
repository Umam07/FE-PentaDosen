import React from 'react';
import { MessageSquare, X, Image as ImageIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CreateTicketModalProps } from '../types/faqHelp.types';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!submittingTicket) onClose(); }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4 max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kirim Pesan ke Admin</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                    Sampaikan kendala atau pertanyaan Anda
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Input Subjek */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subjek Pesan <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kendala Upload PDF (opsional)"
                  value={ticketSubject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* Textarea Pesan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Isi Pesan / Pertanyaan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan pertanyaan atau kendala Anda secara detail..."
                  value={ticketMessage}
                  onChange={(e) => onMessageChange(e.target.value)}
                  required
                  className="w-full p-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 leading-relaxed"
                />
              </div>

              {/* Upload Gambar Tangkapan Layar (Maks 10MB) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    Lampirkan Gambar Kendala <span className="text-slate-400 font-normal">(Opsional)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Maks 10 MB</span>
                </label>

                {ticketImagePreview ? (
                  <div className="relative group rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ticketImagePreview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {ticketImageFile?.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ticketImageFile ? (ticketImageFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                      title="Hapus gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl p-4 cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 transition-colors group">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-xs font-semibold">Klik untuk memilih gambar / screenshot</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Format disukai: PNG, JPG, JPEG, WebP (Maks 10 MB)</p>
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
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
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
