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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group relative bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[480px]"
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-5">
          {/* Top Row: Avatar & Penta ID */}
          <div className="flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl ${theme.bgColor} flex items-center justify-center font-bold text-lg ${theme.textColor} group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0`}>
              {lecturer.thumbnail ? (
                <img src={lecturer.thumbnail} alt={lecturer.name} className="w-full h-full object-cover" />
              ) : (
                lecturer.name.charAt(0)
              )}
            </div>
            <div className="px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft">
              <p className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">
                Penta ID: <span className="text-ink-heading dark:text-on-dark font-mono font-semibold">{lecturer.penta_id || `712400${index + 1}`}</span>
              </p>
            </div>
          </div>

          {/* Title & Info tags */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
              {lecturer.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[9px] font-bold tracking-wider px-2.5 py-0.5 rounded-md border ${theme.badgeClass}`}>
                {lecturer.fakultas || 'N/A'}
              </span>
              {lecturer.program_studi && (
                <span className="text-[9px] font-medium text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark px-2 py-0.5 rounded-md truncate max-w-[150px]">
                  {lecturer.program_studi}
                </span>
              )}
            </div>
          </div>

          {/* Scholar & Scopus Metrics block */}
          <div className="space-y-4 py-4 border-y border-hairline-light-soft dark:border-hairline-dark-soft">
            {/* Scholar Metrics */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-chart-scholar dark:text-chart-scholar-dark" />
                <span className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">Google Scholar</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center">
                <div>
                  <p className="text-[8px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Citations</p>
                  <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.total_citations || 0}</p>
                </div>
                <div className="border-l border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[8px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.h_index || 0}</p>
                </div>
              </div>
            </div>

            {/* Scopus Metrics */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-chart-scopus dark:text-chart-scopus-dark" />
                <span className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">Scopus</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center">
                <div>
                  <p className="text-[8px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Citations</p>
                  <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.scopus_total_citations || 0}</p>
                </div>
                <div className="border-l border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[8px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.scopus_h_index || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: KPI & Nav button with Tooltip */}
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-accent dark:text-accent-on-dark uppercase tracking-widest opacity-90">Total KPI</p>
            <p className="text-xl font-extrabold font-mono text-ink-heading dark:text-on-dark tracking-tight leading-none">
              {Math.round(lecturer.total_kpi_points).toLocaleString()}
            </p>
          </div>

          <div className="relative group/cta inline-flex items-center">
            <div 
              title="Lihat Profil Lengkap"
              aria-label="Lihat Profil Lengkap"
              className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.bgColor} ${theme.textColor} group-hover:bg-ink group-hover:text-on-ink dark:group-hover:bg-surface-dark-elevated dark:group-hover:text-on-dark transition-all duration-200`}
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="absolute bottom-full right-0 mb-2 hidden group-hover/cta:block px-2.5 py-1 text-[10px] font-bold text-on-ink bg-ink dark:bg-surface-dark-elevated dark:text-on-dark rounded-md whitespace-nowrap pointer-events-none z-20 shadow-md">
              Lihat Profil Lengkap
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <Sparkles className="absolute top-6 right-6 w-10 h-10 text-ink-heading/5 dark:text-on-dark/5 -rotate-12 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
    </motion.div>
  );
}
