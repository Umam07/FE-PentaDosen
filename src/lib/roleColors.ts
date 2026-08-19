/**
 * Shared Constant & Helper untuk Sistem Warna Badge & Avatar Role.
 * Menggunakan prinsip flat & minimal dengan soft-background (bukan solid mencolok).
 */

export interface RoleColorStyle {
  badge: string;
  avatar: string;
}

export const ROLE_COLOR_MAP: Record<string, RoleColorStyle> = {
  'super admin': {
    badge: 'bg-error-soft text-error border-error-border dark:bg-surface-dark-elevated dark:text-error-on-dark dark:border-hairline-dark',
    avatar: 'bg-error-soft text-error dark:bg-surface-dark-elevated dark:text-error-on-dark'
  },
  'admin fakultas': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-surface-dark-elevated dark:text-purple-300 dark:border-hairline-dark',
    avatar: 'bg-purple-100 text-purple-700 dark:bg-surface-dark-elevated dark:text-purple-300'
  },
  'admin penelitian': {
    badge: 'bg-ink-soft text-ink-heading border-ink-border dark:bg-surface-dark-elevated dark:text-on-dark dark:border-hairline-dark',
    avatar: 'bg-ink-soft text-ink-heading dark:bg-surface-dark-elevated dark:text-on-dark'
  },
  'reviewer': {
    badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-surface-dark-elevated dark:text-teal-300 dark:border-hairline-dark',
    avatar: 'bg-teal-100 text-teal-700 dark:bg-surface-dark-elevated dark:text-teal-300'
  },
  'dosen': {
    badge: 'bg-ink-soft text-body border-ink-border dark:bg-surface-dark-elevated dark:text-on-dark-soft dark:border-hairline-dark',
    avatar: 'bg-ink-soft text-body-strong dark:bg-surface-dark-elevated dark:text-on-dark'
  },
  'staf': {
    badge: 'bg-ink-soft text-body border-ink-border dark:bg-surface-dark-elevated dark:text-on-dark-soft dark:border-hairline-dark',
    avatar: 'bg-ink-soft text-body-strong dark:bg-surface-dark-elevated dark:text-on-dark'
  }
};

const DEFAULT_ROLE_STYLE: RoleColorStyle = {
  badge: 'bg-ink-soft text-body border-ink-border dark:bg-surface-dark-elevated dark:text-on-dark-soft dark:border-hairline-dark',
  avatar: 'bg-ink-soft text-body-strong dark:bg-surface-dark-elevated dark:text-on-dark'
};

export function getRoleBadgeStyle(role?: string): string {
  if (!role) return DEFAULT_ROLE_STYLE.badge;
  const key = role.toLowerCase().trim();
  return ROLE_COLOR_MAP[key]?.badge || DEFAULT_ROLE_STYLE.badge;
}

export function getRoleAvatarStyle(role?: string): string {
  if (!role) return DEFAULT_ROLE_STYLE.avatar;
  const key = role.toLowerCase().trim();
  return ROLE_COLOR_MAP[key]?.avatar || DEFAULT_ROLE_STYLE.avatar;
}
