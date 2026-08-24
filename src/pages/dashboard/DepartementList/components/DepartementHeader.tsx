import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft, X, Building2, CheckCircle2 } from 'lucide-react';

interface DepartementHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalFiltered: number;
  onBack: () => void;
}

export default function DepartementHeader({
  search,
  onSearchChange,
  totalFiltered,
  onBack
}: DepartementHeaderProps) {
  return (
    <div className="space-y-8">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onBack}
          aria-label="Kembali ke Insight Platform"
          className="group inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent rounded-md py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-150" />
          <span>Kembali ke Insight</span>
        </motion.button>

        <div className="text-[11px] font-mono font-semibold text-muted dark:text-on-dark-muted tracking-wider uppercase">
          PENTADOSEN / FAKULTAS
        </div>
      </div>

      {/* Main Hero Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        
        {/* Left: Category Pill, Title & Description */}
        <div className="space-y-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-light dark:bg-surface-dark text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-[11px] font-mono tracking-wider uppercase font-semibold shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
            <span>Unit Akademik</span>
          </motion.div>

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
              Struktur dan direktori seluruh fakultas di lingkungan <span className="font-semibold text-ink-heading dark:text-on-dark">Universitas YARSI</span> beserta persebaran dosen, program studi, dan dokumen Tri Dharma.
            </p>
          </div>
        </div>

        {/* Right: Search Input & Status Counters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          {/* Search Box */}
          <div className="relative group flex-1 lg:w-72">
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

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5 px-3.5 h-11 bg-surface-light dark:bg-surface-dark rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
              <Building2 className="w-4 h-4 text-muted dark:text-on-dark-muted shrink-0" />
              <div className="leading-tight">
                <span className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider block">Terdaftar</span>
                <span className="text-xs font-bold font-mono text-ink-heading dark:text-on-dark">
                  {totalFiltered} Unit
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 h-11 bg-success-soft dark:bg-success/15 rounded-xl border border-success-border/50 dark:border-success/20 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-success dark:text-success-on-dark shrink-0" />
              <div className="leading-tight">
                <span className="text-[9px] font-bold text-success-dark/80 dark:text-success-on-dark/80 uppercase tracking-wider block">Status</span>
                <span className="text-xs font-bold text-success-dark dark:text-success-on-dark">
                  Terverifikasi
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
