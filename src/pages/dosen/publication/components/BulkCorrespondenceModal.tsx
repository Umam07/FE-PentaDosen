import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkCorrespondenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  unconfirmedDocs: any[];
  onSaveBulk: (selections: Record<string | number, boolean>) => Promise<void>;
}

export default function BulkCorrespondenceModal({
  isOpen,
  onClose,
  unconfirmedDocs,
  onSaveBulk,
}: BulkCorrespondenceModalProps) {
  const [selections, setSelections] = useState<Record<string | number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && unconfirmedDocs) {
      // Default to false for all unconfirmed publications (since most co-authored papers are non-corresponding)
      const initial: Record<string | number, boolean> = {};
      unconfirmedDocs.forEach((doc) => {
        initial[doc.id] = doc.is_corresponding || false;
      });
      setSelections(initial);
    }
  }, [isOpen, unconfirmedDocs]);

  if (!isOpen) return null;

  const handleSetAll = (val: boolean) => {
    const next: Record<string | number, boolean> = {};
    unconfirmedDocs.forEach((doc) => {
      next[doc.id] = val;
    });
    setSelections(next);
  };

  const handleToggleDoc = (docId: string | number, val: boolean) => {
    setSelections((prev) => ({ ...prev, [docId]: val }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveBulk(selections);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const totalCount = unconfirmedDocs.length;
  const correspondingCount = Object.values(selections).filter(Boolean).length;
  const nonCorrespondingCount = totalCount - correspondingCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
                  Konfirmasi Massal Kepenulisan Korespondensi
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-0.5">
                  Verifikasi {totalCount} publikasi beranggota majemuk dalam satu tampilan cepat.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-bold text-slate-600 dark:text-zinc-300">
              Ringkasan Pilihan: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{correspondingCount} Ya</span> (Corresponding),{' '}
              <span className="text-slate-500 dark:text-zinc-400 font-extrabold">{nonCorrespondingCount} Tidak</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Set Serentak:</span>
              <button
                type="button"
                onClick={() => handleSetAll(false)}
                className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-slate-200/70 dark:bg-zinc-800 hover:bg-slate-300 text-slate-700 dark:text-zinc-300 transition-colors"
              >
                Semua TIDAK
              </button>
              <button
                type="button"
                onClick={() => handleSetAll(true)}
                className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-colors"
              >
                Semua YA
              </button>
            </div>
          </div>

          {/* Document List (Scrollable) */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
            {unconfirmedDocs.map((doc, idx) => {
              const isCorresponding = !!selections[doc.id];
              const year = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';

              return (
                <div
                  key={doc.id || idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCorresponding
                      ? 'bg-primary-50/30 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800/40'
                      : 'bg-slate-50/50 dark:bg-zinc-800/40 border-slate-100 dark:border-zinc-800'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300">
                        {doc.category || 'Jurnal Internasional'}
                      </span>
                      {doc.quartile && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                          {doc.quartile}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                        Tahun: {year} • {doc.total_authors || 1} Penulis
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  {/* Toggle Option */}
                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 hidden sm:inline">
                      Corresponding?
                    </span>
                    <div className="inline-flex p-1 bg-slate-200/80 dark:bg-zinc-800 rounded-xl border border-slate-300/40 dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() => handleToggleDoc(doc.id, true)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                          isCorresponding
                            ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                        }`}
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleDoc(doc.id, false)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                          !isCorresponding
                            ? 'bg-slate-700 text-white dark:bg-zinc-700 shadow-xs'
                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                        }`}
                      >
                        Tidak
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="p-5 bg-slate-50/80 dark:bg-zinc-900/80 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan ({totalCount})...
                </>
              ) : (
                <>
                  Simpan Semua Konfirmasi ({totalCount})
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
