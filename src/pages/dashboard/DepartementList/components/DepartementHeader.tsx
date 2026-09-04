import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

interface DepartementHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalFiltered: number;
  onBack?: () => void;
}

export default function DepartementHeader({
  search,
  onSearchChange,
  totalFiltered,
}: DepartementHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-body hover:text-ink-heading dark:text-on-dark-soft dark:hover:text-on-dark transition-colors font-medium hover:underline underline-offset-4"
          >
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4 text-muted dark:text-on-dark-muted shrink-0" aria-hidden="true" />
          <Link
            to="/insights"
            className="text-body hover:text-ink-heading dark:text-on-dark-soft dark:hover:text-on-dark transition-colors font-medium hover:underline underline-offset-4"
          >
            Insight
          </Link>
          <ChevronRight className="w-4 h-4 text-muted dark:text-on-dark-muted shrink-0" aria-hidden="true" />
          <span className="text-ink-heading dark:text-on-dark font-semibold" aria-current="page">
            Daftar Fakultas
          </span>
        </nav>
      </div>

      {/* Main Hero Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left: Stats Badges, Title & Description */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark text-[11px] font-mono">
              <Building2 className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
              <span>Terdaftar <strong className="font-bold text-ink-heading dark:text-on-dark">{totalFiltered} Unit</strong></span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-success-soft dark:bg-success/15 text-success dark:text-success-on-dark border border-success-border/50 dark:border-success/20 text-[11px] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-success dark:text-success-on-dark" />
              <span>Status <strong className="font-bold text-success-dark dark:text-success-on-dark">Terverifikasi</strong></span>
            </div>
          </div>

          <div className="space-y-2.5">
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-ink-heading dark:text-on-dark tracking-tight leading-tight"
            >
              Daftar <span className="text-accent dark:text-accent-on-dark">Fakultas</span>
            </motion.h1>
            <p className="text-body dark:text-on-dark-soft text-sm sm:text-base leading-relaxed max-w-2xl">
              Struktur dan direktori seluruh fakultas di lingkungan <span className="font-semibold text-ink-heading dark:text-on-dark">Universitas YARSI</span> beserta data dosen, program studi, dan dokumen Tri Dharma.
            </p>
          </div>
        </div>

        {/* Right: Search Input Only */}
        <div className="w-full sm:w-80 lg:w-88 shrink-0">
          <div className="relative group">
            <label htmlFor="department-search" className="sr-only">
              Cari fakultas atau program studi
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors pointer-events-none" />
            <input 
              id="department-search"
              type="text" 
              placeholder="Cari fakultas..." 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-11 pl-10 pr-9 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold outline-none focus:border-accent dark:focus:border-accent-on-dark focus:ring-2 focus:ring-accent/15 text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted shadow-2xs transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
