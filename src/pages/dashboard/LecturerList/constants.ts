import { FakultasTheme } from './types';

export const FAKULTAS_THEMES: Record<string, FakultasTheme> = {
  'Fakultas Kedokteran': {
    color: 'bg-emerald-600 dark:bg-emerald-400',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Kedokteran Gigi': {
    color: 'bg-indigo-600 dark:bg-indigo-400',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Teknologi Informasi': {
    color: 'bg-amber-600 dark:bg-amber-400',
    textColor: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Ekonomi dan Bisnis': {
    color: 'bg-sky-600 dark:bg-sky-400',
    textColor: 'text-sky-700 dark:text-sky-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Hukum': {
    color: 'bg-rose-600 dark:bg-rose-400',
    textColor: 'text-rose-700 dark:text-rose-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Psikologi': {
    color: 'bg-purple-600 dark:bg-purple-400',
    textColor: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  }
};

export const getFakultasTheme = (fakultasName?: string): FakultasTheme => {
  return FAKULTAS_THEMES[fakultasName || ''] || {
    color: 'bg-accent dark:bg-accent-on-dark',
    textColor: 'text-accent dark:text-accent-on-dark',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  };
};
