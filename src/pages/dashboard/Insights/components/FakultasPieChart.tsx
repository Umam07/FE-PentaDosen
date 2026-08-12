import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Search, Filter, Building2, PieChart as PieIcon, BarChart2 } from 'lucide-react';
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
  chartViewMode?: 'donut' | 'bar';
  setChartViewMode?: (val: 'donut' | 'bar') => void;
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
  onFakultasClick,
  chartViewMode = 'donut',
  setChartViewMode
}: FakultasPieChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 overflow-hidden relative flex flex-col justify-between"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Poin KPI per Fakultas</h2>
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">
              {totalFakultasPoints.toLocaleString()} Poin Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proporsi distribusi capaian KPI fakultas secara real-time.
          </p>
        </div>
        
        {/* Controls: Search, Sort Filter, and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          {setChartViewMode && (
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setChartViewMode('donut')}
                title="Donut Chart View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === 'donut'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <PieIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartViewMode('bar')}
                title="Bar Matrix View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === 'bar'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari fakultas..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 focus:border-primary-500 dark:focus:border-primary-400 outline-none w-36 sm:w-44 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-label="Filter peringkat"
              className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            >
              <Filter className="w-4 h-4" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1">
                <button 
                  onClick={() => { setSortBy('points_desc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'points_desc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Poin Tertinggi
                </button>
                <button 
                  onClick={() => { setSortBy('points_asc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'points_asc' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Poin Terendah
                </button>
                <button 
                  onClick={() => { setSortBy('alphabetical'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'alphabetical' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  Nama (A-Z)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Section: Donut or Bar View */}
      {chartViewMode === 'donut' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center flex-1">
          {/* Chart Display */}
          <div className="xl:col-span-7 h-[320px] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <div className="w-40 h-40 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 animate-spin flex items-center justify-center">
                  <Building2 className="w-8 h-8 opacity-30 animate-pulse" />
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
                    innerRadius={80}
                    outerRadius={115}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onClick={(entry: any) => {
                      if (entry && entry.fullName) {
                        onFakultasClick(entry.fullName);
                      }
                    }}
                    animationDuration={1200}
                    paddingAngle={4}
                    stroke="none"
                    cornerRadius={6}
                  >
                    {sortedAndFilteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Building2 className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-xs font-semibold">Fakultas tidak ditemukan</p>
              </div>
            )}
          </div>

          {/* Interactive Legend List */}
          <div className="xl:col-span-5 flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full" />
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
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all border cursor-pointer ${
                      isActive 
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs' 
                        : 'border-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs" 
                      style={{ backgroundColor: f.color }}
                    >
                      {f.name[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {f.name}
                        </p>
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
            ) : null}
          </div>
        </div>
      ) : (
        /* Bar Matrix View */
        <div className="space-y-4 py-2">
          {sortedAndFilteredData.map((f) => {
            const percentage = totalFakultasPoints > 0 ? ((f.value / totalFakultasPoints) * 100).toFixed(1) : '0';
            return (
              <div 
                key={f.fullName} 
                onClick={() => onFakultasClick(f.fullName)}
                className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{f.fullName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{f.value.toLocaleString()} Poin KPI</span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
