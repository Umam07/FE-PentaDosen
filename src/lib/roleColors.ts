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
    badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50',
    avatar: 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
  },
  'admin fakultas': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50',
    avatar: 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
  },
  'admin penelitian': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
    avatar: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
  },
  'reviewer': {
    badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50',
    avatar: 'bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300'
  },
  'dosen': {
    badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    avatar: 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
  },
  'staf': {
    badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    avatar: 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
  }
};

const DEFAULT_ROLE_STYLE: RoleColorStyle = {
  badge: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  avatar: 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300'
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
