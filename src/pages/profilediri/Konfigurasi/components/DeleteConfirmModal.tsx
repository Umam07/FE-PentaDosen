import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { IntegrationTone } from '../types/konfigurasi.types';

interface DeleteConfirmModalProps {
  type: IntegrationTone | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  type,
  onClose,
  onConfirm,
}) => {
  if (!type) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950 dark:text-white">
          Konfirmasi Hapus
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          ID {type === 'scholar' ? 'Google Scholar' : 'Scopus'} akan dilepas dari profil dan data sinkronisasinya tidak lagi ditampilkan.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-black text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
          >
            Hapus ID
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
