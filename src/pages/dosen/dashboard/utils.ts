export interface CategoryTheme {
  bg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
}

export const getCategoryTheme = (category: string): CategoryTheme => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('hki')) return {
    bg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
    border: 'border-indigo-100/50 dark:border-indigo-800/30 hover:border-indigo-500/50',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20'
  };
  if (cat.includes('buku')) return {
    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
    border: 'border-amber-100/50 dark:border-amber-800/30 hover:border-amber-500/50',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
    iconBg: 'group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20'
  };
  if (cat.includes('jurnal internasional')) return {
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-100/50 dark:border-blue-800/30 hover:border-blue-500/50',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
    iconBg: 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'
  };
  if (cat.includes('jurnal nasional')) return {
    bg: 'bg-cyan-50/50 dark:bg-cyan-900/10',
    border: 'border-cyan-100/50 dark:border-cyan-800/30 hover:border-cyan-500/50',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20'
  };
  if (cat.includes('penelitian')) return {
    bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    border: 'border-emerald-100/50 dark:border-emerald-800/30 hover:border-emerald-500/50',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20'
  };
  return {
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    border: 'border-slate-100 dark:border-slate-800 hover:border-primary-500/30',
    badgeBg: 'bg-primary-500/10',
    badgeText: 'text-primary-600 dark:text-primary-400',
    iconBg: 'group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20'
  };
};
