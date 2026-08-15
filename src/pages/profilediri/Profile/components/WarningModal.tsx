import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, X, GraduationCap, Globe } from 'lucide-react';

interface WarningModalProps {
  show: boolean;
  onLengkapi: () => void;
  onNanti: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ show, onLengkapi, onNanti }) => {
  if (!show) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onNanti();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Close Button */}
        <button
          onClick={onNanti}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-50 text-amber-600 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            ID Publikasi Diperlukan
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
            Untuk sinkronisasi poin kinerja otomatis, Anda perlu melengkapi ID Google Scholar dan Scopus pada tab <span className="font-semibold text-slate-900 dark:text-slate-200">Konfigurasi ID</span>.
          </p>
        </div>

        {/* Required Integrations Preview Box */}
        <div className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-800/40">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Google Scholar ID
              </span>
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
              Belum terhubung
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Scopus Author ID
              </span>
            </div>
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
              Belum terhubung
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onLengkapi}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-[0.99] cursor-pointer"
          >
            <span>Lengkapi ID Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNanti}
            className="flex h-9 w-full items-center justify-center rounded-xl text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
