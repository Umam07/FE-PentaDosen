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
      className="lg:col-span-8 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-xs border border-hairline-light dark:border-hairline-dark p-6 sm:p-8 overflow-hidden relative flex flex-col justify-between"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-hairline-light dark:border-hairline-dark">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-ink-heading dark:text-on-dark tracking-tight">Poin KPI per Fakultas</h2>
            <span className="px-2.5 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark text-xs font-mono font-semibold rounded-full border border-hairline-light dark:border-hairline-dark">
              {totalFakultasPoints.toLocaleString()} Poin Total
            </span>
          </div>
          <p className="text-xs text-muted dark:text-on-dark-muted">
            Proporsi distribusi capaian KPI fakultas secara real-time.
          </p>
        </div>
        
        {/* Controls: Search, Sort Filter, and View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          {setChartViewMode && (
            <div className="inline-flex p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
              <button
                onClick={() => setChartViewMode('donut')}
                title="Donut Chart View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === 'donut'
                    ? 'bg-surface-light dark:bg-surface-dark text-accent dark:text-accent-on-dark shadow-xs'
                    : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                }`}
              >
                <PieIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartViewMode('bar')}
                title="Bar Matrix View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  chartViewMode === 'bar'
                    ? 'bg-surface-light dark:bg-surface-dark text-accent dark:text-accent-on-dark shadow-xs'
                    : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
            <input 
              type="text" 
              placeholder="Cari fakultas..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(0);
              }}
              className="pl-8 pr-3 py-1.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-xs font-medium border border-hairline-light dark:border-hairline-dark focus:border-accent dark:focus:border-accent outline-none w-36 sm:w-44 transition-all text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted" 
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              aria-label="Filter peringkat"
              className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark hover:bg-ink-soft dark:hover:bg-surface-dark transition-all cursor-pointer text-body dark:text-on-dark"
            >
              <Filter className="w-4 h-4" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xl z-50 p-2 space-y-1">
                <button 
                  onClick={() => { setSortBy('points_desc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'points_desc' ? 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark' : 'text-body dark:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'}`}
                >
                  Poin Tertinggi
                </button>
                <button 
                  onClick={() => { setSortBy('points_asc'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'points_asc' ? 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark' : 'text-body dark:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'}`}
                >
                  Poin Terendah
                </button>
                <button 
                  onClick={() => { setSortBy('alphabetical'); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${sortBy === 'alphabetical' ? 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark' : 'text-body dark:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'}`}
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted dark:text-on-dark-muted">
                <div className="w-40 h-40 rounded-full border-4 border-hairline-light dark:border-hairline-dark border-t-accent animate-spin flex items-center justify-center">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted dark:text-on-dark-muted">
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
                  <div className="w-8 h-8 rounded-lg bg-hairline-light dark:bg-hairline-dark shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-hairline-light dark:bg-hairline-dark rounded w-1/2" />
                    <div className="h-2 bg-hairline-light dark:bg-hairline-dark rounded w-full" />
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
                        ? 'bg-surface-light-raised dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark shadow-xs' 
                        : 'border-transparent hover:bg-surface-light-raised/60 dark:hover:bg-surface-dark-elevated/40'
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
                        <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate">
                          {f.name}
                        </p>
                        <span className="text-[11px] font-mono font-bold text-ink-heading dark:text-on-dark">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-hairline-light dark:bg-hairline-dark rounded-full overflow-hidden">
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
                className="p-4 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark hover:border-hairline-light-soft dark:hover:border-hairline-dark-soft transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="text-sm font-bold text-ink-heading dark:text-on-dark">{f.fullName}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono font-semibold text-body dark:text-on-dark-soft">{f.value.toLocaleString()} Poin KPI</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark font-mono font-bold text-ink-heading dark:text-on-dark">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-hairline-light dark:bg-hairline-dark rounded-full overflow-hidden">
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
