import React from 'react';
import { motion } from 'motion/react';
import { Filter } from 'lucide-react';

interface LecturerFilterStripProps {
  fakultasOptions: string[];
  selectedFakultas: string;
  onFakultasChange: (val: string) => void;
}

export default function LecturerFilterStrip({
  fakultasOptions,
  selectedFakultas,
  onFakultasChange
}: LecturerFilterStripProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5 px-1">
        <Filter className="w-4 h-4 text-primary-500" />
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-[0.25em]">Filter Fakultas</h4>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        {fakultasOptions.map((fak) => (
          <button
            key={fak}
            onClick={() => onFakultasChange(fak)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
              selectedFakultas === fak 
              ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20 scale-[1.02]' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500 dark:hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {fak}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
