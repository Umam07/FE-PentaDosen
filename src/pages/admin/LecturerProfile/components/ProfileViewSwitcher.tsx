import React from 'react';
import { Globe, FileText } from 'lucide-react';
import { ProfileViewSwitcherProps } from '../types/lecturerProfile.types';

export default function ProfileViewSwitcher({
  activeView,
  onViewChange
}: ProfileViewSwitcherProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
      <div className="grid grid-cols-2 sm:flex w-full sm:w-auto p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl border border-hairline-light dark:border-hairline-dark gap-1">
        {[
          { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
          { id: 'internal', label: 'Dokumen Internal', icon: FileText },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as 'external' | 'internal')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
              activeView === view.id
                ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark'
            }`}
          >
            <view.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
