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
      <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs whitespace-nowrap">
        <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <tr>
            {['Nama Dosen', 'Fakultas / Prodi', 'ID Scholar', 'ID Scopus', 'Total KPI'].map((h, i) => (
              <th 
                key={i} 
                className={`px-6 py-3.5 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider ${
                  h === 'Total KPI' ? 'text-right pr-16' :
                  h === 'ID Scholar' || h === 'ID Scopus' ? 'text-center' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
          {items.map((lecturer, index) => (
            <motion.tr 
              key={lecturer.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className="group transition-colors hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated cursor-pointer"
              onClick={() => onItemClick(lecturer.id)}
            >
              {/* Nama Dosen Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3.5">
                  {lecturer.thumbnail ? (
                    <img 
                      src={lecturer.thumbnail} 
                      alt="" 
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-hairline-light dark:ring-hairline-dark transition-all shadow-xs"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-muted font-mono font-bold text-sm border border-hairline-light dark:border-hairline-dark">
                      {lecturer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors flex items-center gap-1.5">
                      {lecturer.name}
                      {lecturer.total_kpi_points > 100 && <BadgeCheck className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />}
                    </p>
                    <div className="flex items-center text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                      <Mail className="w-3 h-3 mr-1 text-muted-soft dark:text-on-dark-muted" />
                      {lecturer.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Fakultas / Prodi Column */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-body-strong dark:text-on-dark">
                    {lecturer.program_studi || 'N/A'}
                  </span>
                  {lecturer.fakultas && (
                    <span className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-0.5">
                      {lecturer.fakultas}
                    </span>
                  )}
                </div>
              </td>

              {/* Scholar ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scholar_id ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-chart-scholar/10 border border-chart-scholar/20 text-chart-scholar dark:text-chart-scholar-dark text-[10px] font-mono font-semibold uppercase tracking-wider shadow-xs">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{lecturer.scholar_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted text-[10px] font-mono uppercase tracking-wider italic">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Scopus ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scopus_id ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-chart-scopus/10 border border-chart-scopus/20 text-chart-scopus dark:text-chart-scopus-dark text-[10px] font-mono font-semibold uppercase tracking-wider shadow-xs">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{lecturer.scopus_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted text-[10px] font-mono uppercase tracking-wider italic">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Total KPI Column */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3 group/pts">
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-success-soft text-success-dark dark:text-success-on-dark font-mono font-semibold text-xs border border-success-border dark:border-success/30 shadow-xs tabular-nums">
                      {Math.round(lecturer.total_kpi_points || 0).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted group-hover/pts:text-ink-heading dark:group-hover/pts:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all duration-200 shadow-xs">
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
