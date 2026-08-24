import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { DepartmentItem } from '../types';

interface DepartementCardProps {
  dept: DepartmentItem;
  index: number;
  onClick: () => void | Promise<void>;
  key?: React.Key;
}

export default function DepartementCard({ dept, index, onClick }: DepartementCardProps) {
  const IconComponent = dept.icon;

  return (
    <motion.div
      role="article"
      tabIndex={0}
      aria-label={`Fakultas ${dept.name}, ${dept.lecturerCount} Dosen, ${dept.documentCount} Dokumen`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05, ease: 'easeOut' }}
      className="group relative bg-surface-light dark:bg-surface-dark p-6 sm:p-7 rounded-3xl border border-hairline-light dark:border-hairline-dark shadow-xs hover:shadow-md hover:border-ink-border dark:hover:border-hairline-dark hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[460px] focus-visible:ring-2 focus-visible:ring-accent outline-none"
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-4">
          
          {/* Top Row: Icon Badge */}
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-2xs">
              <IconComponent className={`w-6 h-6 ${dept.textColor}`} />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors line-clamp-1">
              {dept.name}
            </h3>
            <p className="text-body dark:text-on-dark-soft text-xs leading-relaxed line-clamp-3">
              {dept.description}
            </p>
          </div>

          {/* Program Studi Badges */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider">
              Program Studi
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dept.prodi?.map((p: string) => (
                <span 
                  key={p} 
                  className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Micro-metrics & Action */}
        <div className="mt-5 pt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft space-y-3.5">
          
          {/* Micro-metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
            <div>
              <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Dosen</p>
              <p className="text-sm sm:text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">
                {dept.lecturerCount}
              </p>
            </div>
            <div className="border-x border-hairline-light-soft dark:border-hairline-dark-soft">
              <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Dokumen</p>
              <p className="text-sm sm:text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">
                {dept.documentCount}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Prodi</p>
              <p className="text-sm sm:text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">
                {dept.prodi?.length || 0}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between text-xs font-semibold text-muted group-hover:text-ink-heading dark:text-on-dark-muted dark:group-hover:text-on-dark transition-colors pt-0.5">
            <span className="text-[11px] font-semibold group-hover:underline">Lihat Direktori Dosen</span>
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
