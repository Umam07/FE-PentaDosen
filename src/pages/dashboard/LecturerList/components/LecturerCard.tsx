import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ArrowUpRight } from 'lucide-react';
import { LecturerItem } from '../types';

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
  return (
    <motion.div
      role="article"
      tabIndex={0}
      aria-label={`Profil Dosen ${lecturer.name}`}
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
      className="group relative bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark hover:border-ink-border dark:hover:border-hairline-dark-soft hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[440px] focus-visible:ring-2 focus-visible:ring-accent outline-none"
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-4">
          
          {/* Top Row: Avatar & Study Program Badge */}
          <div className="flex justify-between items-start gap-3">
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

            {lecturer.program_studi && (
              <span className="inline-flex items-center text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0 max-w-[160px] truncate">
                {lecturer.program_studi}
              </span>
            )}
          </div>

          {/* Lecturer Name */}
          <div>
            <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight line-clamp-2 leading-snug min-h-[2.75rem] group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
              {lecturer.name}
            </h3>
          </div>

          {/* Primary Metric: Total Capaian KPI Tile */}
          <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark flex items-center justify-between">
            <span className="text-xs font-semibold text-muted dark:text-on-dark-muted">
              Total Capaian KPI
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-mono font-bold text-ink-heading dark:text-on-dark tabular-nums">
                {Math.round(lecturer.total_kpi_points).toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-muted dark:text-on-dark-muted">
                Poin
              </span>
            </div>
          </div>

          {/* Secondary Metrics: Scholar & Scopus H-Index Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google Scholar Tile */}
            <div className="p-3 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 rounded-2xl border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-chart-scholar/10 dark:bg-chart-scholar-dark/15 text-chart-scholar dark:text-chart-scholar-dark shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider block leading-none">
                    Scholar
                  </span>
                  <span className="text-[10px] font-medium text-muted-soft dark:text-on-dark-muted leading-none">
                    H-Index
                  </span>
                </div>
              </div>
              <span className="text-base font-mono font-bold text-ink-heading dark:text-on-dark tabular-nums shrink-0">
                {lecturer.h_index || 0}
              </span>
            </div>

            {/* Scopus Tile */}
            <div className="p-3 bg-surface-light-raised/60 dark:bg-surface-dark-elevated/60 rounded-2xl border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-chart-scopus/10 dark:bg-chart-scopus-dark/15 text-chart-scopus dark:text-chart-scopus-dark shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider block leading-none">
                    Scopus
                  </span>
                  <span className="text-[10px] font-medium text-muted-soft dark:text-on-dark-muted leading-none">
                    H-Index
                  </span>
                </div>
              </div>
              <span className="text-base font-mono font-bold text-ink-heading dark:text-on-dark tabular-nums shrink-0">
                {lecturer.scopus_h_index || 0}
              </span>
            </div>
          </div>

        </div>

        {/* Card Action Footer */}
        <div className="pt-3.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] text-muted dark:text-on-dark-muted">
            Penta ID: <span className="font-semibold text-ink-heading dark:text-on-dark">{lecturer.penta_id || `712400${index + 1}`}</span>
          </span>

          <div className="inline-flex items-center gap-1 font-semibold text-muted dark:text-on-dark-muted group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
            <span>Lihat Profil</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
