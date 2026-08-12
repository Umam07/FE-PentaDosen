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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      
      {/* Table Header Filter controls */}
      <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="hidden md:flex p-2.5 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40">
             <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Tracker Kesiapan Data</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Status integrasi sistem eksternal per individu.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full xl:w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Cari nama dosen atau email..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
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
              className="w-full sm:w-[200px]"
            />
          )}
        </div>
      </div>

      {/* Table Rendering */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              {['Nama Dosen', 'Fakultas / Prodi', 'Scholar Status', 'Scopus Status', 'Kendali'].map((h, i) => (
                <th 
                  key={i} 
                  className={`px-6 py-3.5 text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider ${
                    ['Scholar Status', 'Scopus Status', 'Kendali'].includes(h) ? 'text-center' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
            {currentLecturers.map((l) => {
              const isCurrentlySyncing = currentSyncingId === l.id;
              
              return (
                <tr 
                  key={l.id} 
                  className={`group transition-colors 
                    ${selectedLecturerId === l.id ? 'bg-primary-50/20 dark:bg-primary-950/40' : 'hover:bg-gray-50/70 dark:hover:bg-zinc-800/40'}
                    ${isCurrentlySyncing ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' : ''}
                  `}
                >
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 font-bold text-xs border border-gray-200 dark:border-zinc-700 shadow-xs group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                        {l.thumbnail ? (
                          <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                        ) : (
                          l.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 group-hover:text-primary-600 transition-colors">
                            {l.name}
                          </p>
                          {isCurrentlySyncing && (
                            <span className="flex items-center text-[8px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse border border-emerald-100/20 shrink-0">
                              <Loader2 className="w-2.5 h-2.5 animate-spin mr-1 text-emerald-500" />
                              Syncing
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                           <Mail className="w-3.5 h-3.5 text-primary-400/70" />
                           {l.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100">
                        {l.program_studi || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                        {l.fakultas || 'N/A'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {l.scholar_id ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                           Scholar Connected
                        </span>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                          ID: {l.scholar_id}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-gray-200/60 dark:border-zinc-700/60 font-mono">
                         Belum Terhubung
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {l.scopus_id ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40">
                           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                           Scopus Connected
                        </span>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                          ID: {l.scopus_id}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-gray-200/60 dark:border-zinc-700/60 font-mono">
                         Belum Terhubung
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                     <button
                       onClick={() => onSelectLecturer(l.id)}
                       className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 border border-primary-200/60 dark:border-primary-800/40 rounded-xl transition-all cursor-pointer shadow-xs group/btn"
                     >
                       Kelola <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
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
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              Menampilkan <span className="font-semibold text-gray-800 dark:text-zinc-200">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCount)}</span> dari <span className="font-semibold text-gray-800 dark:text-zinc-200">{filteredCount}</span> Dosen
            </span>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-400">Limit:</span>
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

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange((p: number) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-gray-300 dark:text-zinc-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        currentPage === p 
                          ? 'bg-primary-600 text-white shadow-xs' 
                          : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
