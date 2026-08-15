import React from 'react';
import { createPortal } from 'react-dom';
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

  const platformName = type === 'scholar' ? 'Google Scholar' : 'Scopus';

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          Hapus ID {platformName}?
        </h3>

        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          ID {platformName} akan dilepas dari profil Anda dan data publikasi terkait tidak akan lagi disinkronkan secara otomatis.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 bg-slate-100 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition-colors hover:bg-red-700 active:bg-red-800"
          >
            Ya, Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

