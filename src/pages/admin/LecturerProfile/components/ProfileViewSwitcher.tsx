import React from 'react';
import { Globe, FileText } from 'lucide-react';
import { ProfileViewSwitcherProps } from '../types/lecturerProfile.types';

export default function ProfileViewSwitcher({
  activeView,
  onViewChange
}: ProfileViewSwitcherProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8">
      <div className="w-full sm:w-auto grid grid-cols-2 sm:flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-inner gap-1 sm:gap-1.5">
        {[
          { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
          { id: 'internal', label: 'Dokumen Internal', icon: FileText },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            className={`flex items-center justify-center gap-1.5 sm:gap-3 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all duration-300 ${
              activeView === view.id 
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md sm:shadow-xl shadow-primary-500/10' 
                : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <view.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeView === view.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
            <span className="truncate">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
