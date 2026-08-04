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
    <div className="relative p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 shadow-xs">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-6">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </motion.button>
          
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[0.9]"
            >
              Daftar <span className="text-primary-600 dark:text-primary-400">Fakultas</span>
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-base leading-relaxed">
              Eksplorasi ekosistem akademik di seluruh Fakultas Universitas. Data disinkronkan langsung dengan basis data kepegawaian.
            </p>
          </div>
        </div>

        {/* Grouped Hero Controls & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="relative group flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text"
              placeholder="Cari fakultas..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all dark:text-white"
            />
          </div>

          <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          <div className="sm:hidden w-full h-px bg-slate-200 dark:bg-slate-800 my-1"></div>

          <div className="flex items-center gap-6 px-4 py-1 shrink-0">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Terdaftar</p>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{totalFiltered} Fakultas</p>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status Data</p>
              <p className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Terverifikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
