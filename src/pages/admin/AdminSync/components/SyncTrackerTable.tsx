import React from 'react';
import {
  Search, Users, GraduationCap, ChevronRight,
  ChevronLeft, Mail, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import type { SyncTrackerTableProps } from '../types/adminSync.types';

export default function SyncTrackerTable({
  currentLecturers,
  filteredCount,
  selectedLecturerId,
  currentSyncingId,
  searchTerm,
  selectedFakultas,
  currentPage,
  itemsPerPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  userRole,
  onSearchChange,
  onFakultasChange,
  onSelectLecturer,
  onPageChange,
  onItemsPerPageChange,
}: SyncTrackerTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
      
      {/* Table Header Filter controls */}
      <div className="relative z-20 p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
               <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Tracker Kesiapan Data</h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Status integrasi sistem eksternal per individu</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full xl:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari nama dosen atau email..." 
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
              />
            </div>
            
            {userRole === 'admin penelitian' && (
              <DropdownSelect
                value={selectedFakultas}
                onChange={(val) => onFakultasChange(val)}
                options={[
                  { value: "", label: "Semua Fakultas" },
                  { value: "Fakultas Kedokteran", label: "Kedokteran" },
                  { value: "Fakultas Kedokteran Gigi", label: "Kedokteran Gigi" },
                  { value: "Fakultas Teknologi Informasi", label: "Teknologi Informasi" },
                  { value: "Fakultas Ekonomi dan Bisnis", label: "Ekonomi dan Bisnis" },
                  { value: "Fakultas Hukum", label: "Hukum" },
                  { value: "Fakultas Psikologi", label: "Psikologi" },
                ]}
                icon={<GraduationCap className="w-4 h-4" />}
                className="w-full sm:w-[220px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Rendering */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
          <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
            <tr>
              {['Nama Dosen', 'Fakultas / Prodi', 'Scholar Status', 'Scopus Status', 'Kendali'].map((h, i) => (
                <th 
                  key={i} 
                  className={`px-6 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em] ${
                    ['Scholar Status', 'Scopus Status', 'Kendali'].includes(h) ? 'text-center' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
            {currentLecturers.map((l) => {
              const isCurrentlySyncing = currentSyncingId === l.id;
              
              return (
                <tr 
                  key={l.id} 
                  className={`group transition-all duration-200 
                    ${selectedLecturerId === l.id ? 'bg-primary-50/20 dark:bg-primary-900/10' : 'hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/10'}
                    ${isCurrentlySyncing ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' : ''}
                  `}
                >
                  <td className="px-6 py-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 font-black text-lg border border-gray-200 dark:border-zinc-700 shadow-inner group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                        {l.thumbnail ? (
                          <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                        ) : (
                          l.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                            {l.name}
                          </p>
                          {isCurrentlySyncing && (
                            <span className="flex items-center text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse border border-emerald-100/20 shrink-0">
                              <Loader2 className="w-2.5 h-2.5 animate-spin mr-1 text-emerald-500" />
                              Syncing
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                           <Mail className="w-3.5 h-3.5 text-primary-400/70" />
                           {l.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-6 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                        {l.program_studi || 'N/A'}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                        {l.fakultas || 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-6 text-center">
                    {l.scholar_id ? (
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-2 text-[9px] font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3.5 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/40 uppercase tracking-wider shadow-sm">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                           Scholar Connected
                        </span>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 font-mono tracking-tight ml-1.5">
                          ID: {l.scholar_id}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-800/50 uppercase tracking-widest opacity-60">
                         Belum Terhubung
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-6 text-center">
                    {l.scopus_id ? (
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-2 text-[9px] font-black text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3.5 py-1.5 rounded-xl border border-orange-100 dark:border-orange-900/40 uppercase tracking-wider shadow-sm">
                           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                           Scopus Connected
                        </span>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 font-mono tracking-tight ml-1.5">
                          ID: {l.scopus_id}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-800/50 uppercase tracking-widest opacity-60">
                         Belum Terhubung
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-6 text-center">
                     <button
                       onClick={() => onSelectLecturer(l.id)}
                       className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-800 rounded-2xl text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest active:scale-95 transition-all shadow-sm inline-flex items-center gap-2.5 group/btn"
                     >
                       Kelola <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCount)} of {filteredCount}
            </span>
            <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-300 dark:text-zinc-600 tracking-widest">Limit:</span>
              <DropdownSelect
                value={itemsPerPage}
                onChange={(val) => { onItemsPerPageChange(val); onPageChange(1); }}
                options={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" }
                ]}
                size="sm"
                className="w-[85px]"
                position="top"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange((p: number) => Math.max(1, p - 1))}
              className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-2 text-gray-300 font-bold">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        currentPage === p 
                          ? 'bg-primary-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 hover:text-primary-600 shadow-sm'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange((p: number) => Math.min(totalPages, p + 1))}
              className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
