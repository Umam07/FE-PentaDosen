import type { TicketMessage } from '../types/faqHelp.types';

export interface DateGroupedMessages {
  dateKey: string;
  dateLabel: string;
  messages: TicketMessage[];
}

/**
 * Format jam bersih (HH:mm) untuk bubble percakapan
 */
export function formatMessageTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace('.', ':');
  } catch {
    return '';
  }
}

/**
 * Mendapatkan label tanggal (Hari ini, Kemarin, atau d MMM yyyy)
 */
export function getDateDividerLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Percakapan';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';

    const isCurrentYear = d.getFullYear() === now.getFullYear();
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      ...(isCurrentYear ? {} : { year: 'numeric' })
    });
  } catch {
    return 'Percakapan';
  }
}

/**
 * Format ringkas untuk list sidebar tiket (Jam jika hari ini, Kemarin jika kemarin, tgl singkat jika lalu)
 */
export function formatSidebarTicketDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace('.', ':');
    }
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Mengelompokkan pesan-pesan obrolan berdasarkan hari kalender
 */
export function groupMessagesByDate(messages: TicketMessage[]): DateGroupedMessages[] {
  if (!messages || messages.length === 0) return [];

  const groupsMap = new Map<string, { label: string; msgs: TicketMessage[] }>();

  messages.forEach((msg) => {
    try {
      const d = new Date(msg.created_at);
      const dateKey = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : 'unknown';

      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, {
          label: getDateDividerLabel(msg.created_at),
          msgs: []
        });
      }
      groupsMap.get(dateKey)!.msgs.push(msg);
    } catch {
      if (!groupsMap.has('unknown')) {
        groupsMap.set('unknown', { label: 'Percakapan', msgs: [] });
      }
      groupsMap.get('unknown')!.msgs.push(msg);
    }
  });

  return Array.from(groupsMap.entries()).map(([dateKey, group]) => ({
    dateKey,
    dateLabel: group.label,
    messages: group.msgs
  }));
}
