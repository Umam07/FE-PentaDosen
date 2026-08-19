import React from 'react';
import { Mail, BookOpen, GraduationCap, BadgeCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { LecturersTableProps } from '../types/lecturers.types';

export default function LecturersTable({
  items,
  onItemClick
}: LecturersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs whitespace-nowrap">
        <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <tr>
            {['Nama Dosen', 'Fakultas / Prodi', 'ID Scholar', 'ID Scopus', 'Total KPI'].map((h, i) => (
              <th 
                key={i} 
                className={`px-6 py-3.5 text-xs font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider ${
                  h === 'Total KPI' ? 'text-right pr-16' :
                  h === 'ID Scholar' || h === 'ID Scopus' ? 'text-center' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark bg-surface-light dark:bg-surface-dark">
          {items.map((lecturer, index) => (
            <motion.tr 
              key={lecturer.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="group transition-colors hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated cursor-pointer"
              onClick={() => onItemClick(lecturer.id)}
            >
              {/* Nama Dosen Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {lecturer.thumbnail ? (
                    <img 
                      src={lecturer.thumbnail} 
                      alt="" 
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-hairline-light dark:ring-hairline-dark transition-all shadow-xs"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-muted text-lg font-black border border-hairline-light dark:border-hairline-dark shadow-inner">
                      {lecturer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-ink-heading dark:text-on-dark group-hover:text-accent transition-colors flex items-center gap-1.5">
                      {lecturer.name}
                      {lecturer.total_kpi_points > 100 && <BadgeCheck className="w-3.5 h-3.5 text-accent" />}
                    </p>
                    <div className="flex items-center text-xs font-medium text-muted dark:text-on-dark-muted mt-1">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-muted" />
                      {lecturer.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Fakultas / Prodi Column */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink-heading dark:text-on-dark">
                    {lecturer.program_studi || 'N/A'}
                  </span>
                  {lecturer.fakultas && (
                    <span className="text-xs font-medium text-muted dark:text-on-dark-muted mt-1">
                      {lecturer.fakultas}
                    </span>
                  )}
                </div>
              </td>

              {/* Scholar ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scholar_id ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3b6fe0]/10 border border-[#3b6fe0]/20 text-[#3b6fe0] dark:text-[#7fa4ea] text-[10px] font-black uppercase tracking-widest shadow-xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="font-mono">{lecturer.scholar_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted text-[10px] font-bold uppercase tracking-wider italic shadow-xs">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Scopus ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scopus_id ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e07b39]/10 border border-[#e07b39]/20 text-[#e07b39] dark:text-[#d99568] text-[10px] font-black uppercase tracking-widest shadow-xs">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="font-mono">{lecturer.scopus_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted text-[10px] font-bold uppercase tracking-wider italic shadow-xs">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Total KPI Column */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3 group/pts">
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-success-soft text-success dark:text-success-on-dark font-black font-mono text-xs uppercase tracking-wider border border-success-border dark:border-hairline-dark shadow-xs tabular-nums">
                      {Math.round(lecturer.total_kpi_points || 0).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted group-hover/pts:text-accent border border-hairline-light dark:border-hairline-dark transition-all duration-200 shadow-xs">
                     <ChevronRight className="w-4 h-4 translate-x-0 group-hover/pts:translate-x-1 transition-transform" />
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
