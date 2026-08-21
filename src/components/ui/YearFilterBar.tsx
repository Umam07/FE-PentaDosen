import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface YearFilterBarProps {
  /** Seluruh daftar tahun unik yang tersedia dari data user */
  availableYears: number[];
  /** Tahun yang sedang dipilih, atau null untuk "Semua Tahun" */
  selectedYear: number | null;
  /** Callback saat user mengubah pilihan tahun */
  onYearChange: (year: number | null) => void;
  /** Varian warna: 'zinc' (default untuk tabel), 'slate' (untuk tampilan dashboard external), atau 'inline' (untuk filter toolbar) */
  variant?: 'zinc' | 'slate' | 'inline';
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

  const isFiltered = selectedYear !== null;

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

  if (variant === 'inline') {
    return (
      <div className={`relative z-40 inline-block ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setSearchQuery('');
          }}
          className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg text-xs transition-all border cursor-pointer ${
            isFiltered
              ? 'border-hairline-dark/40 dark:border-hairline-light/40 text-ink-heading dark:text-on-dark font-bold bg-surface-light-raised dark:bg-surface-dark-elevated shadow-2xs'
              : 'border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft font-medium bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-light'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate">
              Tahun: <span className={isFiltered ? 'font-bold text-ink-heading dark:text-on-dark' : 'font-semibold text-body-strong dark:text-on-dark'}>{selectedYear !== null ? selectedYear : 'Semua'}</span>
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              isFiltered ? 'text-ink-heading dark:text-on-dark' : 'text-muted dark:text-on-dark-muted'
            } ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 z-[999] min-w-[170px] bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-lg py-1.5"
            >
              {/* Filter Pencarian jika opsi > 10 */}
              {sortedYears.length > 10 && (
                <div className="px-2.5 py-1.5 pb-2 border-b border-hairline-light dark:border-hairline-dark">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted dark:text-on-dark-muted pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari tahun..."
                      className="w-full pl-8 pr-7 py-1.5 bg-canvas-light dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs rounded-lg border border-hairline-light dark:border-hairline-dark outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* List Opsi Tahun */}
              <div className="max-h-[220px] overflow-y-auto py-1 space-y-0.5">
                {(!searchQuery || 'semua tahun'.includes(searchQuery.toLowerCase())) && (
                  <button
                    type="button"
                    onClick={() => {
                      onYearChange(null);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors duration-150 rounded-lg ${
                      selectedYear === null
                        ? 'bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold'
                        : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedYear === null ? (
                        <Check className="w-3.5 h-3.5 text-ink-heading dark:text-on-dark shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>Semua Tahun</span>
                    </div>
                  </button>
                )}

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
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors duration-150 rounded-lg ${
                          isSelected
                            ? 'bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold'
                            : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-ink-heading dark:text-on-dark shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>Tahun {year}</span>
                        </div>
                      </button>
                    );
                  })
                ) : searchQuery ? (
                  <div className="px-3 py-3 text-center text-xs text-muted dark:text-on-dark-muted">
                    Tahun tidak ditemukan
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const containerCls =
    variant === 'slate'
      ? 'flex items-center gap-3 py-2 px-1 mb-2 bg-slate-500/5 dark:bg-slate-900/10 rounded-xl p-2 border border-slate-150 dark:border-slate-800/50'
      : 'px-3.5 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between sm:justify-start gap-3 bg-gray-50/20 dark:bg-zinc-900/20';

  const labelCls =
    'flex items-center gap-1.5 text-[11px] text-muted dark:text-on-dark-muted font-normal select-none shrink-0';

  return (
    <div className={`${containerCls} ${className}`}>
      {/* Label */}
      <div className={labelCls}>
        <span>Tahun:</span>
      </div>

      {/* Custom Dropdown Filter Tahun */}
      <div className="relative z-50 inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setSearchQuery('');
          }}
          className={`flex items-center justify-between gap-2.5 px-3.5 py-2 bg-surface-light dark:bg-surface-dark-elevated border ${
            isFiltered
              ? 'border-ink-border dark:border-hairline-dark text-ink-heading dark:text-on-dark bg-ink-soft dark:bg-surface-dark font-black'
              : 'border-hairline-light dark:border-hairline-dark text-body-strong dark:text-on-dark font-extrabold'
          } rounded-lg text-[11px] uppercase tracking-wider outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-ink-border dark:hover:border-hairline-dark transition-all cursor-pointer min-w-[130px] sm:min-w-[150px] shadow-2xs`}
        >
          <span className="truncate">
            {selectedYear !== null ? `Tahun ${selectedYear}` : 'Semua Tahun'}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-muted dark:text-on-dark-muted shrink-0 ml-1"
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
              className="absolute right-0 top-full mt-1.5 z-[999] min-w-[170px] bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-xl py-1.5"
            >
              {/* Filter Pencarian/Search Input jika opsi tahun > 10 */}
              {sortedYears.length > 10 && (
                <div className="px-2.5 py-1.5 pb-2 border-b border-hairline-light dark:border-hairline-dark">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted dark:text-on-dark-muted pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari tahun..."
                      className="w-full pl-8 pr-7 py-1.5 bg-canvas-light dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-[10px] font-bold rounded-lg border border-hairline-light dark:border-hairline-dark outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:font-normal"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer"
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
                        ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-black'
                        : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                    }`}
                  >
                    <span>Semua Tahun</span>
                    {selectedYear === null && (
                      <Check className="w-3.5 h-3.5 text-on-ink dark:text-on-dark shrink-0 ml-2" />
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
                            ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-black'
                            : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                        }`}
                      >
                        <span>Tahun {year}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-on-ink dark:text-on-dark shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })
                ) : searchQuery ? (
                  <div className="px-3 py-3 text-center text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
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
