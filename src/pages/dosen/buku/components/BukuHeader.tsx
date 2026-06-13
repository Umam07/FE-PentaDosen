import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function BukuHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 px-4 py-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl"
    >
      <Info className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
      <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed">
        <span className="font-bold">Pengelolaan Buku Dosen:</span> Registrasikan Karya Tulis, Buku Referensi, Ajar, dan Monograf Anda pada halaman ini.
      </p>
    </motion.div>
  );
}
