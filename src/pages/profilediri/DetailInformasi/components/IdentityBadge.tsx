import React from 'react';
import { IdentityBadgeProps } from '../types/detailInformasi.types';

const TONES = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-100 dark:border-blue-900/40',
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    label: 'text-blue-700 dark:text-blue-300',
    value: 'text-blue-900 dark:text-blue-100',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-100 dark:border-rose-900/40',
    icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
    label: 'text-rose-700 dark:text-rose-300',
    value: 'text-rose-900 dark:text-rose-100',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-100 dark:border-orange-900/40',
    icon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    label: 'text-orange-700 dark:text-orange-300',
    value: 'text-orange-900 dark:text-orange-100',
  },

  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-100 dark:border-emerald-900/40',
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    label: 'text-emerald-700 dark:text-emerald-300',
    value: 'text-emerald-900 dark:text-emerald-100',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    border: 'border-violet-100 dark:border-violet-900/40',
    icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    label: 'text-violet-700 dark:text-violet-300',
    value: 'text-violet-900 dark:text-violet-100',
  },
} as const;

export const IdentityBadge: React.FC<IdentityBadgeProps> = ({
  label,
  value,
  icon: Icon,
  tone,
}) => {
  const t = TONES[tone];

  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm ${t.bg} ${t.border}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-black uppercase tracking-widest ${t.label}`}>{label}</p>
        <p className={`mt-0.5 truncate font-mono text-sm font-black ${t.value}`} title={value || 'Belum diisi'}>
          {value || 'Belum diisi'}
        </p>
      </div>
    </div>
  );
};
