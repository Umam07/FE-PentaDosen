import React from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft } from 'lucide-react';

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
    <div className="relative overflow-hidden p-8 lg:p-12 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-850 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-6">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </motion.button>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[0.9]"
            >
              Direktori <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Dosen</span>
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-base leading-relaxed">
              Basis data akademis terverifikasi untuk seluruh dosen <span className="text-slate-900 dark:text-white font-extrabold">Penta</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text"
              placeholder="Cari nama atau fakultas..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
            />
          </div>

          {/* Stats Summary in Header */}
          <div className="flex items-center gap-8 px-6 py-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 backdrop-blur-sm">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Terdaftar</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{totalFiltered} Orang</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-850"></div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fakultas</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">6 Unit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
