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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-canvas-dark/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        className="w-full max-w-sm rounded-2xl border border-hairline-light bg-surface-light p-6 text-center shadow-xl dark:border-hairline-dark dark:bg-surface-dark"
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-error-border bg-error-soft text-error dark:border-error-on-dark/30 dark:bg-error/20 dark:text-error-on-dark">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-bold text-ink-heading dark:text-on-dark">
          Hapus ID {platformName}?
        </h3>

        <p className="mt-1.5 text-xs text-muted dark:text-on-dark-muted leading-relaxed">
          ID {platformName} akan dilepas dari profil Anda dan data publikasi terkait tidak akan lagi disinkronkan secara otomatis.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-hairline-light bg-surface-light-raised px-4 text-xs font-bold text-body-strong transition-colors hover:bg-surface-light dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark dark:hover:bg-surface-dark cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-lg bg-error px-4 text-xs font-bold text-white transition-colors hover:bg-error/90 active:bg-error/80 cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

