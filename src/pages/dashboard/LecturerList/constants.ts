import { FakultasTheme } from './types';

export const FAKULTAS_THEMES: Record<string, FakultasTheme> = {
  'Fakultas Kedokteran': {
    color: 'bg-[#6a9158]',
    textColor: 'text-[#6a9158] dark:text-[#8cb878]',
    bgColor: 'bg-[#6a9158]/10',
    borderColor: 'border-[#6a9158]/20',
    badgeClass: 'bg-[#6a9158]/10 text-[#6a9158] dark:text-[#8cb878] border-[#6a9158]/20',
    glowColor: ''
  },
  'Fakultas Kedokteran Gigi': {
    color: 'bg-[#8773ae]',
    textColor: 'text-[#8773ae] dark:text-[#a897cc]',
    bgColor: 'bg-[#8773ae]/10',
    borderColor: 'border-[#8773ae]/20',
    badgeClass: 'bg-[#8773ae]/10 text-[#8773ae] dark:text-[#a897cc] border-[#8773ae]/20',
    glowColor: ''
  },
  'Fakultas Teknologi Informasi': {
    color: 'bg-[#e09a67]',
    textColor: 'text-[#e09a67] dark:text-[#f2b58a]',
    bgColor: 'bg-[#e09a67]/10',
    borderColor: 'border-[#e09a67]/20',
    badgeClass: 'bg-[#e09a67]/10 text-[#e09a67] dark:text-[#f2b58a] border-[#e09a67]/20',
    glowColor: ''
  },
  'Fakultas Ekonomi dan Bisnis': {
    color: 'bg-[#036aac]',
    textColor: 'text-[#036aac] dark:text-[#429cd4]',
    bgColor: 'bg-[#036aac]/10',
    borderColor: 'border-[#036aac]/20',
    badgeClass: 'bg-[#036aac]/10 text-[#036aac] dark:text-[#429cd4] border-[#036aac]/20',
    glowColor: ''
  },
  'Fakultas Hukum': {
    color: 'bg-[#a93246]',
    textColor: 'text-[#a93246] dark:text-[#d65a6e]',
    bgColor: 'bg-[#a93246]/10',
    borderColor: 'border-[#a93246]/20',
    badgeClass: 'bg-[#a93246]/10 text-[#a93246] dark:text-[#d65a6e] border-[#a93246]/20',
    glowColor: ''
  },
  'Fakultas Psikologi': {
    color: 'bg-[#8d396a]',
    textColor: 'text-[#8d396a] dark:text-[#bf6399]',
    bgColor: 'bg-[#8d396a]/10',
    borderColor: 'border-[#8d396a]/20',
    badgeClass: 'bg-[#8d396a]/10 text-[#8d396a] dark:text-[#bf6399] border-[#8d396a]/20',
    glowColor: ''
  }
};

export const getFakultasTheme = (fakultasName?: string): FakultasTheme => {
  return FAKULTAS_THEMES[fakultasName || ''] || {
    color: 'bg-accent',
    textColor: 'text-accent dark:text-accent-on-dark',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
    badgeClass: 'bg-accent-soft dark:bg-accent/10 text-accent dark:text-accent-on-dark border-accent-border/50 dark:border-accent/20',
    glowColor: ''
  };
};
