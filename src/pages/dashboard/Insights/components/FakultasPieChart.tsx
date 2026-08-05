import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Search, Filter, Building2 } from 'lucide-react';
import { FakultasFormattedItem } from '../types';
import { renderActiveShape } from '../utils/chartHelpers';

interface FakultasPieChartProps {
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sortBy: 'points_desc' | 'points_asc' | 'alphabetical';
  setSortBy: (val: 'points_desc' | 'points_asc' | 'alphabetical') => void;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (val: boolean) => void;
  sortedAndFilteredData: FakultasFormattedItem[];
  activeDataIndex: number;
  setActiveIndex: (val: number) => void;
  totalFakultasPoints: number;
  onFakultasClick: (fullName: string) => void;
}

export default function FakultasPieChart({
  loading,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  showFilterDropdown,
  setShowFilterDropdown,
  sortedAndFilteredData,
  activeDataIndex,
  setActiveIndex,
  totalFakultasPoints,
  onFakultasClick
}: FakultasPieChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/60 dark:border-slate-800 p-8 lg:p-10 overflow-hidden relative group flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2.5 bg-primary-500 rounded-xl">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Poin KPI per Fakultas</h2>
            <phantom-ui loading={loading} animation="shimmer" className="inline-block">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                {totalFakultasPoints.toLocaleString()} Poin
              </span>
            </phantom-ui>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs max-w-sm">
            Distribusi metrik KPI di seluruh fakultas secara real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group/search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 focus:border-primary-500 outline-none w-40 transition-all dark:text-white" 
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-label="Filter peringkat"
              className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-500 dark:text-slate-400"
            >
              <Filter className="w-4 h-4" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1">
                <button 
                  onClick={() => { setSortBy('points_desc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'points_desc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Poin Tertinggi
                </button>
                <button 
                  onClick={() => { setSortBy('points_asc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'points_asc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Poin Terendah
                </button>
                <button 
                  onClick={() => { setSortBy('alphabetical'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${sortBy === 'alphabetical' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Nama (A-Z)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center flex-1">
        <div className="xl:col-span-7 h-[360px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <div className="w-48 h-48 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 animate-spin flex items-center justify-center">
                <Building2 className="w-10 h-10 opacity-30 animate-pulse" />
              </div>
            </div>
          ) : sortedAndFilteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip defaultIndex={activeDataIndex} content={() => null} />
                <Pie
                  activeShape={renderActiveShape}
                  data={sortedAndFilteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={125}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onClick={(entry: any) => {
                    if (entry && entry.fullName) {
                      onFakultasClick(entry.fullName);
                    }
                  }}
                  animationDuration={1500}
                  paddingAngle={5}
                  stroke="none"
                  cornerRadius={8}
                >
                  {sortedAndFilteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <Building2 className="w-16 h-16 mb-2 opacity-30" />
              <p className="text-sm font-bold">Tidak ada data visualisasi</p>
            </div>
          )}
        </div>

        <div className="xl:col-span-5 flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl border border-transparent animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-850 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-850 rounded w-full" />
                </div>
              </div>
            ))
          ) : sortedAndFilteredData.length > 0 ? (
            sortedAndFilteredData.map((f, i) => {
              const percentage = totalFakultasPoints > 0 ? ((f.value / totalFakultasPoints) * 100).toFixed(1) : '0';
              const isActive = activeDataIndex === i;
              
              return (
                <div 
                  key={f.fullName}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => onFakultasClick(f.fullName)}
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-all border cursor-pointer ${isActive ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-xs' : 'border-transparent'}`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0" 
                    style={{ backgroundColor: f.color }}
                  >
                    {f.name[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {f.name}
                      </p>
                      <span className="text-[10px] font-bold text-slate-900 dark:text-white">{percentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: f.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <Building2 className="w-10 h-10 mb-2 opacity-30 animate-pulse" />
              <p className="text-xs font-bold">Fakultas tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
