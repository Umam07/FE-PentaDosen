import React, { useState } from 'react';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnconfirmedCorrespondenceBannerProps {
  unconfirmedDocs: any[];
  onBulkConfirmAllNotCorresponding: () => Promise<void>;
  onOpenBulkModal: () => void;
  onFilterUnconfirmed: () => void;
  isNationalJournal?: boolean;
}

export default function UnconfirmedCorrespondenceBanner({
  unconfirmedDocs,
  onBulkConfirmAllNotCorresponding,
  onOpenBulkModal,
  onFilterUnconfirmed,
  isNationalJournal = false,
}: UnconfirmedCorrespondenceBannerProps) {
  const [isSettingAllFalse, setIsSettingAllFalse] = useState(false);

  if (!unconfirmedDocs || unconfirmedDocs.length === 0) return null;

  const count = unconfirmedDocs.length;

  const handleSetAllFalse = async () => {
    setIsSettingAllFalse(true);
    try {
      await onBulkConfirmAllNotCorresponding();
    } finally {
      setIsSettingAllFalse(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={
        isNationalJournal
          ? "bg-accent-soft/80 dark:bg-accent/15 border border-accent-border dark:border-accent/30 rounded-2xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3"
          : "bg-warning-soft/80 dark:bg-warning/15 border border-warning-border dark:border-warning/30 rounded-2xl px-4 py-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3"
      }
    >
      {/* Single-line Notice: Ikon + Teks Ringkas */}
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle
          className={
            isNationalJournal
              ? "w-4 h-4 text-accent dark:text-accent-on-dark shrink-0"
              : "w-4 h-4 text-warning dark:text-warning-on-dark shrink-0"
          }
        />
        <span
          className={
            isNationalJournal
              ? "text-xs font-semibold text-body-strong dark:text-on-dark truncate"
              : "text-xs font-semibold text-body-strong dark:text-on-dark truncate"
          }
        >
          {isNationalJournal ? (
            <>
              <strong className="font-bold">{count} Publikasi Jurnal Nasional</strong> perlu konfirmasi Akreditasi SINTA
            </>
          ) : (
            <>
              <strong className="font-bold">{count} Publikasi</strong> perlu konfirmasi status korespondensi
            </>
          )}
        </span>
      </div>

      {/* 2 Tombol Aksi Sejajar dalam Satu Baris */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          disabled={isSettingAllFalse}
          onClick={handleSetAllFalse}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
          title={isNationalJournal ? "Satu klik untuk konfirmasi status SINTA pada seluruh dokumen ini" : "Satu klik untuk konfirmasi bahwa Anda BUKAN Penulis Korespondensi pada seluruh dokumen ini"}
        >
          {isSettingAllFalse ? (
            <>
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {isNationalJournal ? `Set ${count} Publikasi: Non-SINTA` : `Set ${count} Publikasi: Bukan Corresponding`}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenBulkModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark shrink-0" />
          {isNationalJournal ? `Konfirmasi SINTA Massal (${count})` : `Konfirmasi Massal (${count})`}
        </button>
      </div>
    </motion.div>
  );
}
