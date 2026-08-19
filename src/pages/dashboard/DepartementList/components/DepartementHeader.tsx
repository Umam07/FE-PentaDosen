import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft } from 'lucide-react';

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
    <div className="relative p-8 lg:p-12 rounded-[2.5rem] border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark mb-12 shadow-xs">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-6">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors px-3.5 py-1.5 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </motion.button>
          
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-extrabold text-ink-heading dark:text-on-dark tracking-tight leading-[0.9]"
            >
              Daftar <span className="text-accent dark:text-accent-on-dark">Fakultas</span>
            </motion.h1>
            <p className="text-muted dark:text-on-dark-muted font-medium max-w-xl text-base leading-relaxed">
              Eksplorasi ekosistem akademik di seluruh Fakultas Universitas. Data disinkronkan langsung dengan basis data kepegawaian.
            </p>
          </div>
        </div>

        {/* Grouped Hero Controls & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-3xl border border-hairline-light dark:border-hairline-dark">
          <div className="relative group flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-ink-heading transition-colors" />
            <input 
              type="text" 
              placeholder="Cari fakultas..." 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-2xl text-xs font-semibold outline-none focus:border-ink-border dark:focus:border-hairline-dark text-ink-heading dark:text-on-dark placeholder:text-muted transition-all"
            />
          </div>

          <div className="hidden sm:block w-px h-10 bg-hairline-light dark:bg-hairline-dark shrink-0"></div>
          <div className="sm:hidden w-full h-px bg-hairline-light dark:bg-hairline-dark my-1"></div>

          <div className="flex items-center gap-6 px-4 py-1 shrink-0">
            <div>
              <p className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">Terdaftar</p>
              <p className="text-base sm:text-lg font-extrabold font-mono text-ink-heading dark:text-on-dark">{totalFiltered} Fakultas</p>
            </div>
            <div className="w-px h-7 bg-hairline-light dark:bg-hairline-dark"></div>
            <div>
              <p className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">Status Data</p>
              <p className="text-base sm:text-lg font-extrabold text-success dark:text-success-on-dark">Terverifikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
