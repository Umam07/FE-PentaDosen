import { FakultasTheme } from './types';

export const FAKULTAS_THEMES: Record<string, FakultasTheme> = {
  'Fakultas Kedokteran': {
    color: 'bg-[#6a9158]',
    textColor: 'text-[#6a9158] dark:text-[#8cb878]',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Kedokteran Gigi': {
    color: 'bg-[#8773ae]',
    textColor: 'text-[#8773ae] dark:text-[#a897cc]',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Teknologi Informasi': {
    color: 'bg-[#e09a67]',
    textColor: 'text-[#e09a67] dark:text-[#f2b58a]',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Ekonomi dan Bisnis': {
    color: 'bg-[#036aac]',
    textColor: 'text-[#036aac] dark:text-[#429cd4]',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Hukum': {
    color: 'bg-[#a93246]',
    textColor: 'text-[#a93246] dark:text-[#d65a6e]',
    bgColor: 'bg-surface-light-raised dark:bg-surface-dark-elevated',
    borderColor: 'border-hairline-light dark:border-hairline-dark',
    badgeClass: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark border-hairline-light dark:border-hairline-dark',
    glowColor: ''
  },
  'Fakultas Psikologi': {
    color: 'bg-[#8d396a]',
    textColor: 'text-[#8d396a] dark:text-[#bf6399]',
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
