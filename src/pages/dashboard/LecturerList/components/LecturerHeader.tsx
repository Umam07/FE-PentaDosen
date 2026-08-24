import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft, X, Users, Building2 } from 'lucide-react';

interface LecturerHeaderProps {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  totalFiltered: number;
  onBack: () => void;
}

export default function LecturerHeader({
  searchTerm,
  onSearchTermChange,
  totalFiltered,
  onBack
}: LecturerHeaderProps) {
  return (
    <div className="relative p-6 sm:p-8 lg:p-10 rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs transition-colors">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left: Navigation, Title & Description */}
        <div className="space-y-5 max-w-2xl">
          <motion.button 
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onBack}
            aria-label="Kembali ke halaman sebelumnya"
            className="group inline-flex items-center gap-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors px-3 py-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali</span>
          </motion.button>
          
          <div className="space-y-2.5">
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-ink-heading dark:text-on-dark tracking-tight leading-tight"
            >
              Direktori <span className="text-accent dark:text-accent-on-dark">Dosen</span>
            </motion.h1>
            <p className="text-body dark:text-on-dark-soft text-sm sm:text-base leading-relaxed">
              Direktori profil dan portofolio akademik seluruh dosen <span className="font-semibold text-ink-heading dark:text-on-dark">Universitas YARSI</span> yang terintegrasi di PentaDosen.
            </p>
          </div>
        </div>

        {/* Right: Search Input & Quick Metrics */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
          
          {/* Search Box */}
          <div className="relative group flex-1 min-w-[260px] sm:min-w-[280px]">
            <label htmlFor="lecturer-search" className="sr-only">
              Cari nama dosen, fakultas, atau program studi
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-on-dark-muted group-focus-within:text-accent dark:group-focus-within:text-accent-on-dark transition-colors pointer-events-none" />
            <input 
              id="lecturer-search"
              type="text" 
              placeholder="Cari nama, fakultas, prodi..." 
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-semibold outline-none focus:border-accent dark:focus:border-accent-on-dark focus:ring-2 focus:ring-accent/15 transition-all text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchTermChange('')}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:block w-px h-9 bg-hairline-light dark:bg-hairline-dark shrink-0" />
          <div className="sm:hidden w-full h-px bg-hairline-light dark:bg-hairline-dark my-0.5" />

          {/* Quick Metrics */}
          <div className="flex items-center justify-around sm:justify-start gap-5 px-3 py-1 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-muted dark:text-on-dark-muted" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                  Dosen
                </p>
                <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark leading-tight">
                  {totalFiltered}
                </p>
              </div>
            </div>

            <div className="w-px h-7 bg-hairline-light-soft dark:border-hairline-dark-soft" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-muted dark:text-on-dark-muted" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                  Fakultas
                </p>
                <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark leading-tight">
                  6 Unit
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
