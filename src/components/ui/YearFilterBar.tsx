import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

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
    ? 'flex items-center gap-3 py-2 px-1 mb-2 bg-slate-500/5 dark:bg-slate-900/10 rounded-xl p-2 border border-slate-150 dark:border-slate-800/50'
    : 'px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-zinc-850 bg-gray-50/20 dark:bg-zinc-900/20 backdrop-blur-md';

  const labelCls = 'flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 shrink-0';

  return (
    <div className={containerCls}>
      {/* Label */}
      <div className={labelCls}>
        <Calendar className="w-4 h-4 text-primary-500" />
        <span>Filter Tahun:</span>
      </div>

      {/* Dropdown Selector */}
      <select
        value={selectedYear ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onYearChange(val === '' ? null : parseInt(val));
        }}
        className="px-3.5 py-2 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-150 border border-slate-200 dark:border-zinc-700 rounded-xl text-[11px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer min-w-[140px]"
      >
        <option value="">Semua Tahun</option>
        {sorted.map((year) => (
          <option key={year} value={year}>
            Tahun {year}
          </option>
        ))}
      </select>
    </div>
  );
}
