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
  iconColorClass = "bg-ink-soft dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-ink-border dark:border-hairline-dark shadow-xs",
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
    <div className={`relative z-30 p-6 border-b border-hairline-light dark:border-hairline-dark bg-canvas-light/60 dark:bg-surface-dark-elevated/40 backdrop-blur-xs rounded-t-2xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6 ${className}`}>
      {/* Left Sub-Header Info */}
      <div className="flex items-center gap-4 w-full xl:w-auto">
        {Icon && (
          <div className={`hidden md:flex p-3 rounded-lg shrink-0 ${iconColorClass}`}>
            {renderIcon()}
          </div>
        )}
        <div>
          <h3 className="text-base md:text-lg font-black text-ink-heading dark:text-on-dark uppercase tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest mt-0.5">
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
            className={`relative ${searchWidthClassName} h-11 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg shadow-xs focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all flex items-center group shrink-0`}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-on-dark-muted transition-colors group-focus-within:text-accent pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="block w-full h-full pl-10 pr-9 bg-transparent text-xs font-bold text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
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
              className="h-11 px-4 bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-[11px] font-black text-body dark:text-on-dark-soft uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              title="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted shrink-0" />
              <span className="hidden sm:inline">Reset</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
