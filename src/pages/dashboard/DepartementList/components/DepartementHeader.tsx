import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

interface DepartementHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
}

export default function DepartementHeader({ search, onSearchChange, onBack }: DepartementHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
      <div className="space-y-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold w-fit shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Dashboard</span>
        </button>
        <div className="space-y-3">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full border border-primary-500/20">
            Direktori Akademik
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Daftar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Fakultas</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium max-w-2xl leading-relaxed">
            Eksplorasi ekosistem akademik di seluruh Fakultas Universitas. 
            Data disinkronkan langsung dengan basis data kepegawaian.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-80 group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari fakultas..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 pr-6 py-3.5 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-sm font-semibold border border-slate-200 dark:border-slate-850 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 outline-none w-full transition-all shadow-xs dark:text-white" 
          />
        </div>
      </div>
    </div>
  );
}
