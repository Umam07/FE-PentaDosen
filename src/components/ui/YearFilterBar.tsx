import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface YearFilterBarProps {
  /** Seluruh daftar tahun unik yang tersedia dari data user */
  availableYears: number[];
  /** Tahun yang sedang dipilih, atau null untuk "Semua Tahun" */
  selectedYear: number | null;
  /** Callback saat user mengubah pilihan tahun */
  onYearChange: (year: number | null) => void;
  /** Varian warna: 'zinc' (default untuk tabel) atau 'slate' (untuk tampilan dashboard external) */
  variant?: 'zinc' | 'slate';
  /** Class tambahan opsional */
  className?: string;
}

export default function YearFilterBar({
  availableYears,
  selectedYear,
  onYearChange,
  variant = 'zinc',
  className = '',
}: YearFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat user mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & urutkan daftar tahun secara dinamis (terbaru ke terlama, unik, angka valid)
  const sortedYears = useMemo(() => {
    const validYears = availableYears
      .filter((y) => typeof y === 'number' && !isNaN(y) && y > 1900 && y <= 2100)
      .sort((a, b) => b - a);
    return Array.from(new Set(validYears));
  }, [availableYears]);

  // Saring opsi berdasarkan kata kunci pencarian jika search bar digunakan (>10 opsi)
  const filteredYears = useMemo(() => {
    if (!searchQuery.trim()) return sortedYears;
    return sortedYears.filter((y) => y.toString().includes(searchQuery.trim()));
  }, [sortedYears, searchQuery]);

  // Jika tidak ada data tahun sama sekali dan tidak ada filter aktif, jangan tampilkan komponen
  if (sortedYears.length === 0 && selectedYear === null) {
    return null;
  }

  const containerCls =
    variant === 'slate'
      ? 'flex items-center gap-3 py-2 px-1 mb-2 bg-slate-500/5 dark:bg-slate-900/10 rounded-xl p-2 border border-slate-150 dark:border-slate-800/50'
      : 'px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-zinc-850 bg-gray-50/20 dark:bg-zinc-900/20';

  const labelCls =
    'flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 shrink-0';

  const isFiltered = selectedYear !== null;

  return (
    <div className={`${containerCls} ${className}`}>
      {/* Label */}
      <div className={labelCls}>
        <Calendar className="w-4 h-4 text-primary-500" />
        <span>Filter Tahun:</span>
      </div>

      {/* Custom Dropdown Filter Tahun */}
      <div className="relative z-50 inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setSearchQuery('');
          }}
          className={`flex items-center justify-between gap-2.5 px-3.5 py-2 bg-white dark:bg-zinc-800/90 border ${
            isFiltered
              ? 'border-primary-500/60 dark:border-primary-500/60 text-primary-700 dark:text-primary-300 bg-primary-50/40 dark:bg-primary-950/20 font-black'
              : 'border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-extrabold'
          } rounded-xl text-[11px] uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 hover:border-primary-400 dark:hover:border-primary-500/60 transition-all cursor-pointer min-w-[150px] shadow-2xs`}
        >
          <span className="truncate">
            {selectedYear !== null ? `Tahun ${selectedYear}` : 'Semua Tahun'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-slate-400 dark:text-zinc-500 shrink-0 ml-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full mt-1.5 z-[999] min-w-[170px] w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl py-1.5"
            >
              {/* Filter Pencarian/Search Input jika opsi tahun > 10 */}
              {sortedYears.length > 10 && (
                <div className="px-2.5 py-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari tahun..."
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-zinc-800/80 text-slate-800 dark:text-zinc-200 text-[10px] font-bold rounded-lg border border-slate-200/80 dark:border-zinc-700/60 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder:font-normal"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* List Opsi Tahun */}
              <div className="max-h-[220px] overflow-y-auto py-1 space-y-0.5">
                {/* Opsi: Semua Tahun */}
                {(!searchQuery || 'semua tahun'.includes(searchQuery.toLowerCase())) && (
                  <button
                    type="button"
                    onClick={() => {
                      onYearChange(null);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-[11px] font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                      selectedYear === null
                        ? 'bg-primary-50/80 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-black'
                        : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100/70 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    <span>Semua Tahun</span>
                    {selectedYear === null && (
                      <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0 ml-2" />
                    )}
                  </button>
                )}

                {/* List Opsi Tahun Dinamis */}
                {filteredYears.length > 0 ? (
                  filteredYears.map((year) => {
                    const isSelected = selectedYear === year;
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          onYearChange(year);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-[11px] font-black uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? 'bg-primary-50/80 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-black'
                            : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100/70 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-zinc-100'
                        }`}
                      >
                        <span>Tahun {year}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })
                ) : searchQuery ? (
                  <div className="px-3 py-3 text-center text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Tahun tidak ditemukan
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
