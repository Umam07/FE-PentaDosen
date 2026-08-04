import { FakultasTheme } from './types';

export const FAKULTAS_THEMES: Record<string, FakultasTheme> = {
  'Fakultas Kedokteran': {
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30',
    glowColor: ''
  },
  'Fakultas Kedokteran Gigi': {
    color: 'bg-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/30',
    glowColor: ''
  },
  'Fakultas Teknologi Informasi': {
    color: 'bg-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/20',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-900/30',
    glowColor: ''
  },
  'Fakultas Ekonomi dan Bisnis': {
    color: 'bg-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30',
    glowColor: ''
  },
  'Fakultas Hukum': {
    color: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    badgeClass: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-100/50 dark:border-red-900/30',
    glowColor: ''
  },
  'Fakultas Psikologi': {
    color: 'bg-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    badgeClass: 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-100/50 dark:border-pink-900/30',
    glowColor: ''
  }
};

export const getFakultasTheme = (fakultasName?: string): FakultasTheme => {
  return FAKULTAS_THEMES[fakultasName || ''] || {
    color: 'bg-primary-500',
    textColor: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
    badgeClass: 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border-primary-100/50 dark:border-primary-900/30',
    glowColor: ''
  };
};
