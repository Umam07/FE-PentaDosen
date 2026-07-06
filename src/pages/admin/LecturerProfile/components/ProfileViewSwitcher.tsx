import React from 'react';
import { Globe, FileText } from 'lucide-react';
import { ProfileViewSwitcherProps } from '../types/lecturerProfile.types';

export default function ProfileViewSwitcher({
  activeView,
  onViewChange
}: ProfileViewSwitcherProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mt-8">
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
        {[
          { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
          { id: 'internal', label: 'Dokumen Internal', icon: FileText },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            className={`flex items-center gap-3 px-6 lg:px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
              activeView === view.id 
                ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-xl shadow-primary-500/10' 
                : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <view.icon className={`w-4 h-4 ${activeView === view.id ? 'text-primary-600' : 'text-slate-400'}`} />
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
