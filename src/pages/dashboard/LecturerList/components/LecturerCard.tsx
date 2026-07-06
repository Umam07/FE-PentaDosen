import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { LecturerItem } from '../types';
import { getFakultasTheme } from '../constants';

interface LecturerCardProps {
  lecturer: LecturerItem;
  index: number;
  onClick: () => void | Promise<void>;
  key?: React.Key;
}

export default function LecturerCard({
  lecturer,
  index,
  onClick
}: LecturerCardProps) {
  const theme = getFakultasTheme(lecturer.fakultas);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ delay: index * 0.03 }}
      className={`group relative bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-xs hover:shadow-xl ${theme.glowColor} hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[480px]`}
      onClick={onClick}
    >
      {/* Decorative background glow */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 ${theme.color} opacity-[0.03] group-hover:opacity-10 group-hover:scale-125 rounded-full blur-xl transition-all duration-700`}></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-5">
          {/* Top Row: Avatar & Penta ID */}
          <div className="flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl ${theme.bgColor} flex items-center justify-center font-bold text-lg ${theme.textColor} shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden shrink-0`}>
              {lecturer.thumbnail ? (
                <img src={lecturer.thumbnail} alt={lecturer.name} className="w-full h-full object-cover" />
              ) : (
                lecturer.name.charAt(0)
              )}
            </div>
            <div className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100/50 dark:border-slate-800">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                Penta ID: <span className="text-slate-800 dark:text-slate-200 font-semibold">{lecturer.penta_id || `712400${index + 1}`}</span>
              </p>
            </div>
          </div>

          {/* Title & Info tags */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {lecturer.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeClass}`}>
                {lecturer.fakultas || 'N/A'}
              </span>
              {lecturer.program_studi && (
                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                  {lecturer.program_studi}
                </span>
              )}
            </div>
          </div>

          {/* Scholar & Scopus Metrics block */}
          <div className="space-y-4 py-4 border-y border-slate-100 dark:border-slate-800/60">
            {/* Scholar Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Google Scholar</span>
                </div>
                <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/50 dark:border-slate-900/50 text-center">
                <div>
                  <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Citations</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.total_citations || 0}</p>
                </div>
                <div className="border-l border-slate-200/50 dark:border-slate-800/50">
                  <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.h_index || 0}</p>
                </div>
              </div>
            </div>

            {/* Scopus Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">Scopus</span>
                </div>
                <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100/50 dark:border-slate-900/50 text-center">
                <div>
                  <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Citations</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.scopus_total_citations || 0}</p>
                </div>
                <div className="border-l border-slate-200/50 dark:border-slate-800/50">
                  <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{lecturer.scopus_h_index || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: KPI & Nav button */}
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest opacity-80">Total KPI</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              {Math.round(lecturer.total_kpi_points).toLocaleString()}
            </p>
          </div>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.bgColor} text-slate-500 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300`}>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <Sparkles className="absolute top-6 right-6 w-10 h-10 text-slate-900/5 dark:text-white/5 -rotate-12 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
    </motion.div>
  );
}
