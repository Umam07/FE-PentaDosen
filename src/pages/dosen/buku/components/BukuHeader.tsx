import React from 'react';
import { Info, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';

interface BukuHeaderProps {
  onOpenMetricsModal?: () => void;
}

export default function BukuHeader({ onOpenMetricsModal }: BukuHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/80 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-medium text-indigo-900 dark:text-indigo-200 leading-relaxed">
          <span className="font-bold">Pengelolaan Buku Dosen:</span> Registrasikan Karya Tulis, Buku Referensi, Ajar, dan Monograf Anda pada halaman ini.
        </p>
      </div>

      {onOpenMetricsModal && (
        <button
          type="button"
          onClick={onOpenMetricsModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all whitespace-nowrap self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Metriks Penilaian
        </button>
      )}
    </motion.div>
  );
}
