import React from 'react';
import { BarChart2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicationHeaderProps {
  urlKategori: string;
  onOpenMetricsModal?: () => void;
}

export default function PublicationHeader({ urlKategori, onOpenMetricsModal }: PublicationHeaderProps) {
  if (!urlKategori) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
    >
      {/* Left: Category Icon, Title & Concise Subtitle */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {urlKategori}
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 uppercase tracking-wider">
              Publikasi Ilmiah
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Kelola dan pantau publikasi ilmiah Anda pada kategori {urlKategori}.
          </p>
        </div>
      </div>

      {/* Right: Panduan Metriks Button */}
      {onOpenMetricsModal && (
        <button
          type="button"
          onClick={onOpenMetricsModal}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <BarChart2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Metriks Penilaian</span>
        </button>
      )}
    </motion.div>
  );
}
