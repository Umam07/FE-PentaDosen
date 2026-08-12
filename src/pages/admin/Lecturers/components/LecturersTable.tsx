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
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs whitespace-nowrap">
        <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
          <tr>
            {['Nama Dosen', 'Fakultas / Prodi', 'ID Scholar', 'ID Scopus', 'Total KPI'].map((h, i) => (
              <th 
                key={i} 
                className={`px-6 py-3.5 text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider ${
                  h === 'Total KPI' ? 'text-right pr-16' :
                  h === 'ID Scholar' || h === 'ID Scopus' ? 'text-center' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
          {items.map((lecturer, index) => (
            <motion.tr 
              key={lecturer.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 cursor-pointer"
              onClick={() => onItemClick(lecturer.id)}
            >
              {/* Nama Dosen Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {lecturer.thumbnail ? (
                    <img 
                      src={lecturer.thumbnail} 
                      alt="" 
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary-100/50 transition-all shadow-md"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 text-lg font-black border border-gray-200 dark:border-zinc-700 shadow-inner">
                      {lecturer.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors flex items-center gap-1.5">
                      {lecturer.name}
                      {lecturer.total_kpi_points > 100 && <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />}
                    </p>
                    <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">
                      <Mail className="w-3 h-3 mr-1.5 text-primary-400/70" />
                      {lecturer.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Fakultas / Prodi Column */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {lecturer.program_studi || 'N/A'}
                  </span>
                  {lecturer.fakultas && (
                    <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                      {lecturer.fakultas}
                    </span>
                  )}
                </div>
              </td>

              {/* Scholar ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scholar_id ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-mono">{lecturer.scholar_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider italic shadow-sm">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Scopus ID Column */}
              <td className="px-6 py-4 text-center">
                {lecturer.scopus_id ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <GraduationCap className="h-3.5 w-3.5 text-orange-500" />
                    <span className="font-mono">{lecturer.scopus_id}</span>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider italic shadow-sm">
                    Not Configured
                  </span>
                )}
              </td>

              {/* Total KPI Column */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3 group/pts">
                  <div className="text-right">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-500/20 shadow-inner tabular-nums">
                      {Math.round(lecturer.total_kpi_points || 0).toLocaleString()} pts
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-850 text-gray-400 group-hover/pts:text-primary-500 group-hover/pts:bg-primary-500/10 dark:group-hover/pts:bg-primary-500/20 group-hover/pts:border-primary-200/50 border border-transparent transition-all duration-300 shadow-sm">
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
