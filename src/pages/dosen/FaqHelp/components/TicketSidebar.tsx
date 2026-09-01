import React, { useMemo } from 'react';
import { Search, X, Plus, Clock, CheckCircle2, Inbox } from 'lucide-react';
import type { SupportTicketItem } from '../types/faqHelp.types';
import { formatSidebarTicketDate } from '../utils/ticketDateUtils';

interface TicketSidebarProps {
  tickets: SupportTicketItem[];
  selectedTicketId: number | null;
  searchQuery: string;
  statusFilter: 'aktif' | 'selesai' | 'semua';
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: 'aktif' | 'selesai' | 'semua') => void;
  onSelectTicket: (ticketId: number) => void;
  onOpenCreateModal: () => void;
}

// Warna avatar stabil berdasarkan id/subject tiket
const AVATAR_COLORS = [
  'bg-[#8a7c68] text-white',
  'bg-[#5b6ba8] text-white',
  'bg-[#6b7a5e] text-white',
  'bg-[#8a6b6b] text-white',
  'bg-[#4f7082] text-white',
  'bg-[#7a648a] text-white',
];

export default function TicketSidebar({
  tickets,
  selectedTicketId,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelectTicket,
  onOpenCreateModal,
}: TicketSidebarProps) {
  const isCompleted = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'selesai' || s === 'completed' || s === 'closed';
  };

  const activeCount = useMemo(() => tickets.filter(t => !isCompleted(t.status)).length, [tickets]);
  const completedCount = useMemo(() => tickets.filter(t => isCompleted(t.status)).length, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesStatus =
        statusFilter === 'semua' ||
        (statusFilter === 'aktif' && !isCompleted(ticket.status)) ||
        (statusFilter === 'selesai' && isCompleted(ticket.status));

      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const subjectMatch = (ticket.subject || '').toLowerCase().includes(q);
      const messageMatch = (ticket.message || '').toLowerCase().includes(q);
      const idMatch = String(ticket.id).includes(q);
      return subjectMatch || messageMatch || idMatch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const getInitials = (subject?: string): string => {
    const clean = (subject || 'PD').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  return (
    <aside
      aria-label="Daftar Tiket Dukungan"
      className="flex flex-col h-full bg-surface-light dark:bg-surface-dark border-r border-hairline-light dark:border-hairline-dark"
    >
      {/* Sidebar Top: Header & Search */}
      <div className="p-4 sm:p-5 border-b border-hairline-light-soft dark:border-hairline-dark-soft space-y-3.5 shrink-0">
        
        {/* Title Bar & Kirim Pesan Baru */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight truncate">
              Pusat Pesan Tiket
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenCreateModal}
            aria-label="Buat Tiket Pesan Baru"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-[11px] font-semibold transition-all shadow-xs active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tiket Baru</span>
          </button>
        </div>

        {/* Input Cari Tiket */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
          <input
            type="text"
            placeholder="Cari subjek atau isi tiket..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Cari tiket percakapan"
            className="w-full pl-8.5 pr-8 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-hidden focus:border-accent dark:focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Hapus teks pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Status Tabs (Aktif, Selesai, Semua) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
          <button
            type="button"
            onClick={() => onStatusFilterChange('aktif')}
            aria-pressed={statusFilter === 'aktif'}
            aria-label={`Filter tiket aktif (${activeCount})`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'aktif'
                ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs'
                : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated/50'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Aktif · {activeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('selesai')}
            aria-pressed={statusFilter === 'selesai'}
            aria-label={`Filter tiket selesai (${completedCount})`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'selesai'
                ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs'
                : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated/50'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai · {completedCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('semua')}
            aria-pressed={statusFilter === 'semua'}
            aria-label={`Filter semua tiket (${tickets.length})`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'semua'
                ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs'
                : 'text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated/50'
            }`}
          >
            <Inbox className="w-3 h-3" />
            <span>Semua · {tickets.length}</span>
          </button>
        </div>
      </div>

      {/* Ticket Rows Stream */}
      <div className="flex-1 overflow-y-auto divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, idx) => {
            const isSelected = selectedTicketId === ticket.id;
            const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const initials = getInitials(ticket.subject);
            const isDone = isCompleted(ticket.status);

            const lastMessage =
              ticket.messages && ticket.messages.length > 0
                ? ticket.messages[ticket.messages.length - 1].message
                : ticket.message;

            const isUnreadReply =
              ticket.status === 'dibalas' ||
              (ticket.messages &&
                ticket.messages.length > 0 &&
                ticket.messages[ticket.messages.length - 1].sender === 'admin');

            return (
              <div
                key={ticket.id}
                role="button"
                tabIndex={0}
                aria-selected={isSelected}
                aria-label={`Buka tiket: ${ticket.subject || 'Tanpa Subjek'}`}
                onClick={() => onSelectTicket(ticket.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTicket(ticket.id);
                  }
                }}
                className={`relative px-4 sm:px-5 py-3.5 cursor-pointer transition-all select-none text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
                  isSelected
                    ? 'bg-surface-light-raised dark:bg-surface-dark-elevated font-medium'
                    : 'bg-transparent hover:bg-surface-light-raised/60 dark:hover:bg-surface-dark-soft/60'
                } ${isDone ? 'opacity-70' : ''}`}
              >
                {/* Active Indicator bar Royal Blue di kiri */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-accent dark:bg-accent-on-dark rounded-r-xs"
                  />
                )}

                <div className="flex items-start gap-3">
                  {/* Avatar Lingkaran Inisial */}
                  <div
                    aria-hidden="true"
                    className={`w-9 h-9 rounded-full ${avatarBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs border border-white/20 dark:border-white/10`}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header Row: Subject & Timestamp + Unread Dot */}
                    <div className="flex items-center justify-between gap-1.5">
                      <p
                        className={`text-[13px] truncate ${
                          isSelected
                            ? 'font-bold text-ink-heading dark:text-on-dark'
                            : 'font-semibold text-ink-heading dark:text-on-dark'
                        }`}
                      >
                        {ticket.subject || 'Tanpa Subjek'}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10.5px] font-mono text-muted dark:text-on-dark-muted">
                          {formatSidebarTicketDate(ticket.created_at)}
                        </span>
                        {isUnreadReply && !isDone && (
                          <span
                            className="w-2 h-2 rounded-full bg-accent dark:bg-accent-on-dark shrink-0"
                            title="Ada pesan baru"
                            aria-label="Ada pesan baru"
                          />
                        )}
                      </div>
                    </div>

                    {/* Snippet Pesan Terakhir */}
                    <p className="text-xs text-muted dark:text-on-dark-muted truncate mt-0.5">
                      {lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center space-y-2">
            <Inbox className="w-8 h-8 text-muted dark:text-on-dark-muted mx-auto opacity-50" />
            <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
              Tidak ada tiket ditemukan
            </p>
            <p className="text-[11px] text-muted dark:text-on-dark-muted max-w-[200px] mx-auto">
              {searchQuery
                ? 'Coba gunakan kata kunci pencarian yang lain.'
                : 'Belum ada tiket pada kategori ini.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
