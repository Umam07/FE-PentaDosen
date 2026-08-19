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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative bg-surface-light dark:bg-surface-dark p-7 rounded-3xl border border-hairline-light dark:border-hairline-dark shadow-xs hover:shadow-md hover:border-hairline-light dark:hover:border-hairline-dark transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[460px]"
      onClick={onClick}
    >
      <div className="relative z-10 flex flex-col h-full justify-between flex-1">
        <div className="space-y-5">
          {/* Icon and Title Header */}
          <div className="flex items-start justify-between">
            <div className={`w-14 h-14 rounded-2xl ${dept.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <dept.icon className={`w-7 h-7 ${dept.textColor}`} />
            </div>
          </div>

          {/* Title & Aligned Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-ink-heading dark:text-on-dark tracking-tight leading-tight group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
              {dept.name}
            </h3>
            <p className="text-body dark:text-on-dark-soft text-xs font-normal leading-relaxed text-justify">
              {dept.description}
            </p>
          </div>

          {/* Program Studi Badges */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest">Program Studi:</p>
            <div className="flex flex-wrap gap-1.5">
              {dept.prodi?.map((p: string) => (
                <span key={p} className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-md border transition-all ${dept.badgeBg}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Stats & Action */}
        <div className="mt-6 pt-5 border-t border-hairline-light dark:border-hairline-dark space-y-4">
          {/* Micro-metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark">
            <div>
              <p className="text-[9px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Dosen</p>
              <p className="text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">{dept.lecturerCount}</p>
            </div>
            <div className="border-x border-hairline-light dark:border-hairline-dark">
              <p className="text-[9px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Dokumen</p>
              <p className="text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">{dept.documentCount}</p>
            </div>
            <div>
              <p className="text-[9px] font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider mb-0.5">Prodi</p>
              <p className="text-base font-bold font-mono text-ink-heading dark:text-on-dark leading-none">{dept.prodi?.length || 0}</p>
            </div>
          </div>

          {/* Read more trigger */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <span>Lihat Direktori Dosen</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${dept.bgColor} text-slate-500 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300`}>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
