import React from 'react';
import { BarChart2, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchHeaderProps {
  onOpenMetricsModal?: () => void;
}

export default function ResearchHeader({ onOpenMetricsModal }: ResearchHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
    >
      {/* Left: Icon, Title & Subtitle */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
          <Beaker className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark">
              Pengelolaan Penelitian
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
              Dokumen Internal
            </span>
          </div>
          <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5 truncate">
            Daftarkan dan kelola data penelitian serta hibah Anda pada halaman ini.
          </p>
        </div>
      </div>

      {/* Right: Panduan Metriks Button */}
      {onOpenMetricsModal && (
        <button
          type="button"
          onClick={onOpenMetricsModal}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <BarChart2 className="w-4 h-4 text-muted dark:text-on-dark-muted" />
          <span>Metriks Penilaian</span>
        </button>
      )}
    </motion.div>
  );
}
