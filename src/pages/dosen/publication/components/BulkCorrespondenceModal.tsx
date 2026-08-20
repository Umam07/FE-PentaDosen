import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

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
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-active/60 dark:bg-canvas-dark/80 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xl border border-hairline-light dark:border-hairline-dark overflow-hidden z-10 my-8 flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-surface-light dark:bg-surface-dark rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                <Sparkles className="w-5 h-5 text-accent dark:text-accent-on-dark" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark">
                  {isNationalJournal ? 'Konfirmasi Massal Akreditasi SINTA' : 'Konfirmasi Massal Kepenulisan Korespondensi'}
                </h3>
                <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
                  {isNationalJournal
                    ? `Verifikasi ${totalCount} publikasi Jurnal Nasional dalam satu tampilan cepat.`
                    : `Verifikasi ${totalCount} publikasi beranggota majemuk dalam satu tampilan cepat.`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets Bar */}
          <div className="px-5 py-3 bg-surface-light-raised/70 dark:bg-surface-dark-elevated/70 border-b border-hairline-light dark:border-hairline-dark flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-semibold text-body-strong dark:text-on-dark">
              {isNationalJournal ? (
                <>
                  Ringkasan Pilihan: <span className="text-success-dark dark:text-success-on-dark font-mono font-bold">{sintaConfirmedCount} SINTA</span>,{' '}
                  <span className="text-muted dark:text-on-dark-muted font-mono font-bold">{sintaNonCount} Non-SINTA</span>
                </>
              ) : (
                <>
                  Ringkasan Pilihan: <span className="text-success-dark dark:text-success-on-dark font-mono font-bold">{correspondingCount} Ya</span> (Corresponding),{' '}
                  <span className="text-muted dark:text-on-dark-muted font-mono font-bold">{nonCorrespondingCount} Tidak</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">Set Serentak:</span>
              {isNationalJournal ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetAllSinta('Non-SINTA')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                  >
                    Semua Non-SINTA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllSinta('S1')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink transition-colors cursor-pointer"
                  >
                    Semua S1
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSetAll(false)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                  >
                    Semua BUKAN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAll(true)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink transition-colors cursor-pointer"
                  >
                    Semua YA
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Document List (Scrollable) */}
          <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-surface-light dark:bg-surface-dark">
            {unconfirmedDocs.map((doc, idx) => {
              const isCorresponding = !!selections[doc.id];
              const year = doc.published_at ? new Date(doc.published_at).getFullYear() : '-';

              return (
                <div
                  key={doc.id || idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                    isNationalJournal
                      ? 'bg-surface-light dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark'
                      : isCorresponding
                      ? 'bg-success-soft/50 dark:bg-success/15 border-success-border dark:border-success/30'
                      : 'bg-surface-light dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-light-raised dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
                        {doc.category || 'Jurnal Nasional'}
                      </span>
                      {doc.quartile && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-surface-light-raised dark:bg-surface-dark text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark">
                          {doc.quartile}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-muted dark:text-on-dark-muted">
                        Tahun: {year} • {doc.total_authors || 1} Penulis
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  {/* Toggle / Selection Option */}
                  {isNationalJournal ? (
                    <div className="flex flex-col gap-1.5 shrink-0 lg:items-end">
                      <span className="text-[11px] font-semibold text-muted dark:text-on-dark-muted">
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
                                  ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                                  : 'bg-surface-light-raised dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light dark:hover:bg-surface-dark-elevated'
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
                      <span className="text-xs text-muted dark:text-on-dark-muted hidden sm:inline">
                        Corresponding?
                      </span>
                      <div className="inline-flex p-1 bg-surface-light-raised dark:bg-surface-dark rounded-xl border border-hairline-light dark:border-hairline-dark">
                        <button
                          type="button"
                          onClick={() => handleToggleDoc(doc.id, true)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isCorresponding
                              ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                              : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark'
                          }`}
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDoc(doc.id, false)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            !isCorresponding
                              ? 'bg-ink-hover text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-2xs'
                              : 'text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark'
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
          <div className="p-5 bg-surface-light-raised dark:bg-surface-dark-elevated border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-body dark:text-on-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink text-xs font-semibold rounded-lg shadow-2xs active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
      )}
    </AnimatePresence>
  );
}
