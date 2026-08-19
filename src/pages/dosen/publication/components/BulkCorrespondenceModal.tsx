import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkCorrespondenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  unconfirmedDocs: any[];
  onSaveBulk: (selections: Record<string | number, boolean | string>) => Promise<void>;
  isNationalJournal?: boolean;
}

const SINTA_RANKS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Non-SINTA'];

export default function BulkCorrespondenceModal({
  isOpen,
  onClose,
  unconfirmedDocs,
  onSaveBulk,
  isNationalJournal = false,
}: BulkCorrespondenceModalProps) {
  const [selections, setSelections] = useState<Record<string | number, boolean>>({});
  const [sintaSelections, setSintaSelections] = useState<Record<string | number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && unconfirmedDocs) {
      if (isNationalJournal) {
        const initialSinta: Record<string | number, string> = {};
        unconfirmedDocs.forEach((doc) => {
          initialSinta[doc.id] = doc.sinta_rank || 'Non-SINTA';
        });
        setSintaSelections(initialSinta);
      } else {
        const initial: Record<string | number, boolean> = {};
        unconfirmedDocs.forEach((doc) => {
          initial[doc.id] = doc.is_corresponding || false;
        });
        setSelections(initial);
      }
    }
  }, [isOpen, unconfirmedDocs, isNationalJournal]);

  if (!isOpen) return null;

  const handleSetAll = (val: boolean) => {
    const next: Record<string | number, boolean> = {};
    unconfirmedDocs.forEach((doc) => {
      next[doc.id] = val;
    });
    setSelections(next);
  };

  const handleSetAllSinta = (rank: string) => {
    const next: Record<string | number, string> = {};
    unconfirmedDocs.forEach((doc) => {
      next[doc.id] = rank;
    });
    setSintaSelections(next);
  };

  const handleToggleDoc = (docId: string | number, val: boolean) => {
    setSelections((prev) => ({ ...prev, [docId]: val }));
  };

  const handleSetSintaDoc = (docId: string | number, rank: string) => {
    setSintaSelections((prev) => ({ ...prev, [docId]: rank }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveBulk(isNationalJournal ? sintaSelections : selections);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const totalCount = unconfirmedDocs.length;
  const correspondingCount = Object.values(selections).filter(Boolean).length;
  const nonCorrespondingCount = totalCount - correspondingCount;

  const sintaConfirmedCount = Object.values(sintaSelections).filter((r) => r !== 'Non-SINTA').length;
  const sintaNonCount = totalCount - sintaConfirmedCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isNationalJournal ? 'Konfirmasi Massal Akreditasi SINTA' : 'Konfirmasi Massal Kepenulisan Korespondensi'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isNationalJournal
                    ? `Verifikasi ${totalCount} publikasi Jurnal Nasional dalam satu tampilan cepat.`
                    : `Verifikasi ${totalCount} publikasi beranggota majemuk dalam satu tampilan cepat.`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {isNationalJournal ? (
                <>
                  Ringkasan Pilihan: <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">{sintaConfirmedCount} SINTA</span>,{' '}
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">{sintaNonCount} Non-SINTA</span>
                </>
              ) : (
                <>
                  Ringkasan Pilihan: <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">{correspondingCount} Ya</span> (Corresponding),{' '}
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">{nonCorrespondingCount} Tidak</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Set Serentak:</span>
              {isNationalJournal ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetAllSinta('Non-SINTA')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Semua Non-SINTA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllSinta('S1')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white transition-colors cursor-pointer"
                  >
                    Semua S1
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetAll(false)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    Semua BUKAN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAll(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white transition-colors cursor-pointer"
                  >
                    Semua YA
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Document List (Scrollable) */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1">
            {unconfirmedDocs.map((doc, idx) => {
              const isCorresponding = !!selections[doc.id];
              const year = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';

              return (
                <div
                  key={doc.id || idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                    isNationalJournal
                      ? 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800'
                      : isCorresponding
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
                      : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        {doc.category || 'Jurnal Nasional'}
                      </span>
                      {doc.quartile && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {doc.quartile}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Tahun: {year} • {doc.total_authors || 1} Penulis
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  {/* Toggle / Selection Option */}
                  {isNationalJournal ? (
                    <div className="flex flex-col gap-1.5 shrink-0 lg:items-end">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Akreditasi SINTA:
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {SINTA_RANKS.map((rank) => {
                          const currentRank = sintaSelections[doc.id] || 'Non-SINTA';
                          const isSelected = currentRank === rank;

                          return (
                            <button
                              key={rank}
                              type="button"
                              onClick={() => handleSetSintaDoc(doc.id, rank)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {rank}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                        Corresponding?
                      </span>
                      <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleToggleDoc(doc.id, true)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isCorresponding
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDoc(doc.id, false)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            !isCorresponding
                              ? 'bg-slate-700 text-white dark:bg-slate-700 shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Tidak
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-semibold rounded-xl shadow-xs active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

