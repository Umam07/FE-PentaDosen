import React from 'react';
import { User, BookOpen, Clock, Tag } from 'lucide-react';
import type { SupportTicketItem, UserSession } from '../types/faqHelp.types';

interface TicketContextPanelProps {
  ticket: SupportTicketItem | null;
  user?: UserSession;
}

export default function TicketContextPanel({ ticket, user }: TicketContextPanelProps) {
  if (!ticket) return null;

  const isDone =
    (ticket.status || '').toLowerCase() === 'selesai' ||
    (ticket.status || '').toLowerCase() === 'completed' ||
    (ticket.status || '').toLowerCase() === 'closed';

  const formatFullDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const initials = user?.name
    ? user.name
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DS';

  return (
    <aside
      aria-label="Panel Informasi Tiket"
      className="hidden xl:flex flex-col w-[280px] shrink-0 border-l border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 space-y-5 overflow-y-auto"
    >
      {/* Profil Dosen */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
        <div
          aria-hidden="true"
          className="w-14 h-14 rounded-full bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark font-bold text-base flex items-center justify-center mb-3 shadow-xs border border-hairline-light dark:border-hairline-dark"
        >
          {initials}
        </div>
        <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark truncate max-w-full">
          {user?.name || 'Dosen Pengguna'}
        </h3>
        <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5 capitalize">
          {user?.role || 'Dosen Tetap'}
        </p>
      </div>

      {/* Rincian Tiket */}
      <div className="space-y-3 pb-5 border-b border-hairline-light-soft dark:border-hairline-dark-soft text-xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted font-mono">
          Detail Tiket
        </p>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted dark:text-on-dark-muted">Nomor Tiket</span>
          <span className="font-mono font-semibold text-ink-heading dark:text-on-dark">
            #{ticket.id}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted dark:text-on-dark-muted">Status</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
              isDone
                ? 'bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark'
                : ticket.status === 'dibalas'
                ? 'bg-accent-soft text-accent dark:bg-accent/15 dark:text-accent-on-dark'
                : 'bg-warning-soft text-warning dark:bg-warning/15 dark:text-warning-on-dark'
            }`}
          >
            {isDone ? 'Selesai' : ticket.status === 'dibalas' ? 'Dibalas' : 'Menunggu'}
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted dark:text-on-dark-muted">Total Pesan</span>
          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">
            {ticket.messages?.length || 1}
          </span>
        </div>

        <div className="space-y-1 py-1">
          <span className="text-muted dark:text-on-dark-muted">Waktu Dibuat</span>
          <p className="font-mono text-[11px] text-body dark:text-on-dark-soft">
            {formatFullDate(ticket.created_at)}
          </p>
        </div>
      </div>

      {/* Bantuan Cepat */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted dark:text-on-dark-muted font-mono">
          Bantuan Cepat
        </p>

        <div className="p-3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-ink-heading dark:text-on-dark">
            <BookOpen className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
            <span>Butuh panduan lain?</span>
          </div>
          <p className="text-[11px] text-muted dark:text-on-dark-muted leading-relaxed">
            Anda dapat melihat FAQ dan manual book resmi di tab <strong>Panduan</strong> untuk solusi instan kendala umum.
          </p>
        </div>
      </div>
    </aside>
  );
}
