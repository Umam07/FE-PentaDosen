import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function BukuHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-5 py-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl"
    >
      <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
          Pengelolaan Buku Dosen
        </p>
        <p className="text-sm font-black uppercase tracking-tight">
          Buku Referensi, Ajar, dan Monograf Dosen
        </p>
      </div>
      <div className="ml-auto text-[10px] font-bold opacity-75 uppercase tracking-widest hidden md:flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" />
        Registrasikan Karya Tulis dan Buku Akademik Anda
      </div>
    </motion.div>
  );
}
