import React from 'react';
import { Search, X, RotateCcw, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TableFilterHeaderProps {
  /** Ikon header (komponen LucideIcon atau JSX element) */
  icon?: LucideIcon | React.ReactNode;
  /** Class styling container ikon */
  iconColorClass?: string;
  /** Judul utama header */
  title: React.ReactNode;
  /** Deskripsi / subtitle header */
  description?: React.ReactNode;

  /** Menampilkan search box */
  showSearch?: boolean;
  /** Value teks pencarian */
  searchTerm?: string;
  /** Handler saat teks pencarian berubah */
  onSearchChange?: (val: string) => void;
  /** Handler opsional saat form search di-submit */
  onSearchSubmit?: (e: React.FormEvent) => void;
  /** Teks placeholder search input */
  searchPlaceholder?: string;
  /** Class width untuk search input container */
  searchWidthClassName?: string;

  /** Sub-komponen filter tambahan (DropdownSelect, dll) */
  children?: React.ReactNode;

  /** Flag apakah ada filter yang sedang aktif */
  hasActiveFilter?: boolean;
  /** Handler saat tombol reset diklik */
  onResetFilters?: () => void;

  /** Class override untuk container paling luar */
  className?: string;
}

export function TableFilterHeader({
  icon: Icon,
  iconColorClass = "bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40 shadow-xs",
  title,
  description,
  showSearch = true,
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Cari nama atau email dosen...",
  searchWidthClassName = "w-full sm:w-[280px] md:w-[320px] xl:w-[360px]",
  children,
  hasActiveFilter,
  onResetFilters,
  className = "",
}: TableFilterHeaderProps) {
  const isFilterActive = hasActiveFilter !== undefined 
    ? hasActiveFilter 
    : Boolean(searchTerm);

  const handleSearchSubmitInternal = (e: React.FormEvent) => {
    if (onSearchSubmit) {
      onSearchSubmit(e);
    } else {
      e.preventDefault();
    }
  };

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const LucideIconComp = Icon as React.ElementType;
    return <LucideIconComp className="h-6 w-6" />;
  };

  return (
    <div className={`relative z-30 p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/20 backdrop-blur-xs rounded-t-2xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 ${className}`}>
      {/* Left Sub-Header Info */}
      <div className="flex items-center gap-4 w-full xl:w-auto">
        {Icon && (
          <div className={`hidden md:flex p-3 rounded-2xl shrink-0 ${iconColorClass}`}>
            {renderIcon()}
          </div>
        )}
        <div>
          <h3 className="text-base md:text-lg font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls Bar (Search + Custom Dropdowns + Reset) */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full xl:w-auto">
        {/* Search Input Box */}
        {showSearch && (
          <form 
            onSubmit={handleSearchSubmitInternal} 
            className={`relative ${searchWidthClassName} h-11 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xs focus-within:ring-4 focus-within:ring-primary-100 dark:focus-within:ring-primary-900/20 focus-within:border-primary-500 transition-all flex items-center group shrink-0`}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 transition-colors group-focus-within:text-primary-500 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="block w-full h-full pl-10 pr-9 bg-transparent text-xs font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        )}

        {/* Extra Dropdowns & Filter Controls */}
        {children}

        {/* Reset Filter Button */}
        <AnimatePresence mode="wait">
          {isFilterActive && onResetFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              type="button"
              onClick={onResetFilters}
              className="h-11 px-4 bg-gray-100 hover:bg-gray-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-400 shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
