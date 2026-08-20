import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, X, GraduationCap, Globe } from 'lucide-react';
import { lockBodyScroll, unlockBodyScroll } from '../../../../lib/utils';

interface WarningModalProps {
  show: boolean;
  onLengkapi: () => void;
  onNanti: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ show, onLengkapi, onNanti }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onNanti();
    };
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      lockBodyScroll();
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unlockBodyScroll();
      };
    }
  }, [show, onNanti]);

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-canvas-dark/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-2xl border border-hairline-light bg-surface-light p-6 sm:p-7 shadow-2xl dark:border-hairline-dark dark:bg-surface-dark"
      >
        {/* Close Button */}
        <button
          onClick={onNanti}
          type="button"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-warning-border bg-warning-soft text-warning dark:border-warning-on-dark/30 dark:bg-warning/15 dark:text-warning-on-dark mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark">
            ID Publikasi Diperlukan
          </h3>

          <p className="mt-2 text-sm text-body dark:text-on-dark-soft leading-relaxed max-w-sm">
            Untuk sinkronisasi poin kinerja otomatis, Anda perlu melengkapi ID Google Scholar dan Scopus pada tab <span className="font-semibold text-ink-heading dark:text-on-dark">Konfigurasi ID</span>.
          </p>
        </div>

        {/* Required Integrations Preview Box */}
        <div className="mt-5 space-y-2 rounded-xl border border-hairline-light bg-surface-light-raised p-3 dark:border-hairline-dark dark:bg-surface-dark-elevated">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-200/60 bg-blue-50/80 text-chart-scholar dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-chart-scholar-dark">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-body-strong dark:text-on-dark">
                Google Scholar ID
              </span>
            </div>
            <span className="text-[11px] font-medium text-warning dark:text-warning-on-dark bg-warning-soft dark:bg-warning/15 px-2 py-0.5 rounded-md border border-warning-border dark:border-warning-on-dark/30">
              Belum terhubung
            </span>
          </div>

          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-200/60 bg-orange-50/80 text-chart-scopus dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-chart-scopus-dark">
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-body-strong dark:text-on-dark">
                Scopus Author ID
              </span>
            </div>
            <span className="text-[11px] font-medium text-warning dark:text-warning-on-dark bg-warning-soft dark:bg-warning/15 px-2 py-0.5 rounded-md border border-warning-border dark:border-warning-on-dark/30">
              Belum terhubung
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onLengkapi}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink px-4 text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <span>Lengkapi ID Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNanti}
            className="flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold text-muted transition-colors hover:bg-surface-light-raised hover:text-ink-heading dark:text-on-dark-muted dark:hover:bg-surface-dark-elevated dark:hover:text-on-dark cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
