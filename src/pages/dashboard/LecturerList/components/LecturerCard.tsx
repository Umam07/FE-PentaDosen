import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
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
      role="article"
      tabIndex={0}
      aria-label={`Profil Dosen ${lecturer.name}, ${lecturer.fakultas || ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.03, 0.3), ease: 'easeOut' }}
      className="group relative bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[480px] focus-visible:ring-2 focus-visible:ring-accent outline-none"
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-4">
          
          {/* Top Row: Avatar & Penta ID */}
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-center font-bold text-lg text-ink-heading dark:text-on-dark group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0 shadow-2xs">
              {lecturer.thumbnail ? (
                <img 
                  src={lecturer.thumbnail} 
                  alt={`Foto ${lecturer.name}`} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="font-mono">{lecturer.name.charAt(0)}</span>
              )}
            </div>

            <div className="px-2.5 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft">
              <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
                Penta ID: <span className="text-ink-heading dark:text-on-dark font-mono font-bold">{lecturer.penta_id || `712400${index + 1}`}</span>
              </p>
            </div>
          </div>

          {/* Name & Academic Units */}
          <div className="space-y-2.5">
            <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight line-clamp-2 leading-snug min-h-[2.75rem] group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
              {lecturer.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.color}`} />
                <span>{lecturer.fakultas || 'N/A'}</span>
              </span>
              
              {lecturer.program_studi && (
                <span className="text-[10px] font-medium text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft px-2 py-0.5 rounded-md truncate max-w-[160px]">
                  {lecturer.program_studi}
                </span>
              )}
            </div>
          </div>

          {/* Scholar & Scopus Metrics block */}
          <div className="space-y-3.5 py-3 border-y border-hairline-light-soft dark:border-hairline-dark-soft">
            
            {/* Scholar Metrics */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-chart-scholar dark:text-chart-scholar-dark" />
                <span className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Google Scholar</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center">
                <div>
                  <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Sitasi</p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.total_citations || 0}</p>
                </div>
                <div className="border-l border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.h_index || 0}</p>
                </div>
              </div>
            </div>

            {/* Scopus Metrics */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-chart-scopus dark:text-chart-scopus-dark" />
                <span className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">Scopus</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-center">
                <div>
                  <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Sitasi</p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.scopus_total_citations || 0}</p>
                </div>
                <div className="border-l border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">H-Index</p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-ink-heading dark:text-on-dark">{lecturer.scopus_h_index || 0}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Total KPI & Action CTA */}
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-accent dark:text-accent-on-dark uppercase tracking-wider">
              Total KPI
            </p>
            <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark tracking-tight leading-none">
              {Math.round(lecturer.total_kpi_points).toLocaleString()}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark transition-colors">
            <span className="text-[11px] font-semibold group-hover:underline">Lihat Profil</span>
            <div 
              aria-hidden="true"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft group-hover:bg-ink group-hover:text-on-ink group-hover:border-ink dark:group-hover:bg-surface-dark-elevated dark:group-hover:text-accent-on-dark transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
