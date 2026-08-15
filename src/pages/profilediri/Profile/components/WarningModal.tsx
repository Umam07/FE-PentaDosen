import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8"
      >
        <div>
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            ID Publikasi Diperlukan
          </h3>

          <p className="mb-8 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            Untuk sinkronisasi poin performa Anda secara otomatis, Anda <span className="text-primary-600 dark:text-primary-400">diwajibkan</span> mengisi ID Google Scholar dan Scopus pada tab <span className="text-slate-900 dark:text-white">Konfigurasi ID</span>.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onLengkapi}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-black text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700"
            >
              Lengkapi ID Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNanti}
              className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
