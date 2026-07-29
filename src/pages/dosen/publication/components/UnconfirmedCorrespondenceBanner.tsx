import React, { useState } from 'react';
import { AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnconfirmedCorrespondenceBannerProps {
  unconfirmedDocs: any[];
  onBulkConfirmAllNotCorresponding: () => Promise<void>;
  onOpenBulkModal: () => void;
  onFilterUnconfirmed: () => void;
}

export default function UnconfirmedCorrespondenceBanner({
  unconfirmedDocs,
  onBulkConfirmAllNotCorresponding,
  onOpenBulkModal,
  onFilterUnconfirmed,
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
      className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl px-4 py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      {/* Single-line Notice: Ikon + Teks Ringkas */}
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
        <span className="text-xs font-bold text-amber-950 dark:text-amber-200 truncate">
          <strong className="font-extrabold">{count} Publikasi</strong> perlu konfirmasi status korespondensi
        </span>
      </div>

      {/* 2 Tombol Aksi Sejajar dalam Satu Baris */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          disabled={isSettingAllFalse}
          onClick={handleSetAllFalse}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
          title="Satu klik untuk konfirmasi bahwa Anda BUKAN Penulis Korespondensi pada seluruh dokumen ini"
        >
          {isSettingAllFalse ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              SET {count} PUBLIKASI: BUKAN CORRESPONDING
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenBulkModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-amber-100/60 dark:hover:bg-zinc-700 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-xs transition-all active:scale-95 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          KONFIRMASI MASAL ({count})
        </button>
      </div>
    </motion.div>
  );
}
