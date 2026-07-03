import React, { useEffect, useMemo } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface YearFilterBarProps {
  /** All unique years extracted from the dataset */
  availableYears: number[];
  /** Currently selected year, or null for "All" */
  selectedYear: number | null;
  /** Called when user clicks a year button */
  onYearChange: (year: number | null) => void;
  /** Color variant: 'zinc' (default internal tables) or 'slate' (dashboard external views) */
  variant?: 'zinc' | 'slate';
}

export default function YearFilterBar({
  availableYears,
  selectedYear,
  onYearChange,
  variant = 'zinc',
}: YearFilterBarProps) {
  const sorted = useMemo(() => [...availableYears].sort((a, b) => b - a), [availableYears]);



  if (availableYears.length === 0) return null;

  const containerCls = variant === 'slate'
    ? 'flex flex-wrap items-center gap-2 py-3 px-1 mb-2'
    : 'px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-2 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10';

  const labelCls = variant === 'slate'
    ? 'flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0'
    : 'flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest shrink-0';

  const inactiveCls = variant === 'slate'
    ? 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
    : 'bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400';

  return (
    <div className={containerCls}>
      {/* Label */}
      <div className={labelCls}>
        <CalendarDays className="w-3.5 h-3.5" />
        Filter Tahun:
      </div>

      {/* Year pills */}
      {sorted.map((year) => (
        <motion.button
          key={year}
          layout
          onClick={() => onYearChange(selectedYear === year ? null : year)}
          className={`relative inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
            selectedYear === year
              ? 'bg-primary-600 text-white shadow-sm'
              : inactiveCls
          }`}
        >
          {year}
          <AnimatePresence>
            {selectedYear === year && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="ml-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
}
