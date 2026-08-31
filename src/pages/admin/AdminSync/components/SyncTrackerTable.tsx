import React from 'react';
import {
  Search, Users, GraduationCap, ChevronRight,
  ChevronLeft, Mail, Loader2
} from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/shared/TableFilterHeader';
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
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xs overflow-hidden">
      
      {/* Table Header Filter controls */}
      <TableFilterHeader
        icon={Users}
        title="Tracker Kesiapan Data"
        description="Status integrasi sistem eksternal per individu"
        showSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cari nama atau email dosen..."
        hasActiveFilter={Boolean(searchTerm || selectedFakultas)}
        onResetFilters={() => {
          onSearchChange('');
          onFakultasChange('');
        }}
      >
        {userRole === 'admin penelitian' && (
          <div className="w-full sm:w-[210px] md:w-[230px] shrink-0">
            <DropdownSelect
              value={selectedFakultas}
              onChange={(val) => onFakultasChange(String(val))}
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
            />
          </div>
        )}
      </TableFilterHeader>

      {/* ── 1. Desktop & Tablet Table View (md ke atas) ── */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs whitespace-nowrap">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              {['Nama Dosen', 'Fakultas / Prodi', 'Scholar Status', 'Scopus Status', 'Kendali'].map((h, i) => (
                <th 
                  key={i} 
                  className={`px-6 py-3.5 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider ${
                    ['Scholar Status', 'Scopus Status', 'Kendali'].includes(h) ? 'text-center' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {currentLecturers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-muted-soft dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-ink-heading dark:text-on-dark">Tidak ada dosen ditemukan</p>
                    <p className="text-xs text-muted dark:text-on-dark-muted">Coba ubah kata kunci pencarian atau sesuaikan filter fakultas yang dipilih.</p>
                    {(searchTerm || selectedFakultas) && (
                      <button
                        onClick={() => {
                          onSearchChange('');
                          onFakultasChange('');
                        }}
                        className="mt-2 px-4 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-semibold rounded-xl border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                      >
                        Reset Filter &amp; Pencarian
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentLecturers.map((l) => {
                const isCurrentlySyncing = currentSyncingId === l.id;
                
                return (
                  <tr 
                    key={l.id} 
                    className={`group transition-colors 
                      ${selectedLecturerId === l.id ? 'bg-accent-soft/30 dark:bg-accent-soft/10' : 'hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'}
                      ${isCurrentlySyncing ? 'bg-success-soft/20 dark:bg-success/10 border-l-4 border-l-success' : ''}
                    `}
                  >
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-muted font-bold font-mono text-xs border border-hairline-light dark:border-hairline-dark shadow-xs overflow-hidden shrink-0">
                          {l.thumbnail ? (
                            <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                          ) : (
                            l.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                              {l.name}
                            </p>
                            {isCurrentlySyncing && (
                              <span className="flex items-center text-[9px] font-semibold text-success-dark dark:text-success-on-dark bg-success-soft dark:bg-success/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-success-border shrink-0">
                                <Loader2 className="w-2.5 h-2.5 animate-spin mr-1 text-success" />
                                Syncing
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted flex items-center gap-1 mt-0.5">
                             <Mail className="w-3 h-3 text-muted-soft dark:text-on-dark-muted" />
                             {l.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-body-strong dark:text-on-dark">
                          {l.program_studi || 'N/A'}
                        </span>
                        <span className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-0.5">
                          {l.fakultas || 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {l.scholar_id ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-chart-scholar/10 text-chart-scholar dark:text-chart-scholar-dark border border-chart-scholar/20 uppercase tracking-wider">
                             <div className="w-1.5 h-1.5 bg-chart-scholar rounded-full animate-pulse"></div>
                             Scholar Connected
                          </span>
                          <p className="text-[10px] text-muted dark:text-on-dark-muted font-mono">
                            ID: {l.scholar_id}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-full border border-hairline-light-soft dark:border-hairline-dark-soft uppercase tracking-wider">
                           Belum Terhubung
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {l.scopus_id ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-chart-scopus/10 text-chart-scopus dark:text-chart-scopus-dark border border-chart-scopus/20 uppercase tracking-wider">
                             <div className="w-1.5 h-1.5 bg-chart-scopus rounded-full animate-pulse"></div>
                             Scopus Connected
                          </span>
                          <p className="text-[10px] text-muted dark:text-on-dark-muted font-mono">
                            ID: {l.scopus_id}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-full border border-hairline-light-soft dark:border-hairline-dark-soft uppercase tracking-wider">
                           Belum Terhubung
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                       <button
                         onClick={() => onSelectLecturer(l.id)}
                         className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-heading dark:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl transition-all cursor-pointer shadow-xs group/btn"
                       >
                         Kelola <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                       </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── 2. Mobile Responsive Card List View (< md) ── */}
      <div className="block md:hidden divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
        {currentLecturers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
              <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-muted-soft dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-ink-heading dark:text-on-dark">Tidak ada dosen ditemukan</p>
              <p className="text-xs text-muted dark:text-on-dark-muted">Coba ubah kata kunci pencarian atau sesuaikan filter fakultas yang dipilih.</p>
              {(searchTerm || selectedFakultas) && (
                <button
                  onClick={() => {
                    onSearchChange('');
                    onFakultasChange('');
                  }}
                  className="mt-2 px-4 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-semibold rounded-xl border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                >
                  Reset Filter &amp; Pencarian
                </button>
              )}
            </div>
          </div>
        ) : (
          currentLecturers.map((l) => {
            const isCurrentlySyncing = currentSyncingId === l.id;
            const isSelected = selectedLecturerId === l.id;

            return (
              <div
                key={l.id}
                className={`p-4 space-y-3 bg-surface-light dark:bg-surface-dark transition-colors ${
                  isSelected ? 'bg-accent-soft/30 dark:bg-accent-soft/10' : 'hover:bg-surface-light-raised/40 dark:hover:bg-surface-dark-elevated/40'
                } ${isCurrentlySyncing ? 'bg-success-soft/20 dark:bg-success/10 border-l-4 border-l-success' : ''}`}
              >
                {/* Top Section: Avatar, Name, Email, Syncing Badge & Action */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-muted font-bold font-mono text-xs border border-hairline-light dark:border-hairline-dark shadow-xs overflow-hidden shrink-0 mt-0.5">
                      {l.thumbnail ? (
                        <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                      ) : (
                        l.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-1 truncate">
                          {l.name}
                        </h4>
                        {isCurrentlySyncing && (
                          <span className="flex items-center text-[9px] font-semibold text-success-dark dark:text-success-on-dark bg-success-soft dark:bg-success/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-success-border shrink-0">
                            <Loader2 className="w-2.5 h-2.5 animate-spin mr-1 text-success" />
                            Syncing
                          </span>
                        )}
                      </div>
                      {l.email && (
                        <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 text-muted-soft dark:text-on-dark-muted shrink-0" />
                          <span className="truncate">{l.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0">
                    <button
                      onClick={() => onSelectLecturer(l.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-heading dark:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl transition-all cursor-pointer shadow-xs group/btn"
                    >
                      Kelola <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Middle Row: Fakultas / Prodi Badge */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark font-semibold text-[11px] border border-hairline-light dark:border-hairline-dark truncate max-w-[220px]">
                    {l.program_studi || 'N/A'}
                  </span>
                  {l.fakultas && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted text-[11px] border border-hairline-light dark:border-hairline-dark truncate max-w-[200px]">
                      {l.fakultas}
                    </span>
                  )}
                </div>

                {/* Integration Status Badges */}
                <div className="pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center gap-2 flex-wrap text-xs">
                  {/* Scholar Status */}
                  {l.scholar_id ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-chart-scholar/10 border border-chart-scholar/20 text-chart-scholar dark:text-chart-scholar-dark text-[10px] font-mono font-semibold uppercase tracking-wider shadow-xs">
                      <div className="w-1.5 h-1.5 bg-chart-scholar rounded-full animate-pulse shrink-0"></div>
                      <span className="truncate max-w-[140px]">Scholar: {l.scholar_id}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted text-[10px] font-mono uppercase tracking-wider italic">
                      Scholar: Belum Terhubung
                    </span>
                  )}

                  {/* Scopus Status */}
                  {l.scopus_id ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-chart-scopus/10 border border-chart-scopus/20 text-chart-scopus dark:text-chart-scopus-dark text-[10px] font-mono font-semibold uppercase tracking-wider shadow-xs">
                      <div className="w-1.5 h-1.5 bg-chart-scopus rounded-full animate-pulse shrink-0"></div>
                      <span className="truncate max-w-[140px]">Scopus: {l.scopus_id}</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted text-[10px] font-mono uppercase tracking-wider italic">
                      Scopus: Belum Terhubung
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredCount > 0 && (
        <div className="px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted dark:text-on-dark-muted">
              Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCount)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{filteredCount}</span> Dosen
            </span>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
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
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-muted-soft dark:text-on-dark-muted text-xs font-mono">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        currentPage === p 
                          ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-semibold shadow-xs' 
                          : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
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
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
