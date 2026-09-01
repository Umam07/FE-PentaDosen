import React, { useRef, useEffect } from 'react';
import {
  ArrowLeft, CheckCircle2, RefreshCw,
  Maximize2, Clock, MessageSquare, ShieldCheck
} from 'lucide-react';
import type { SupportTicketItem, TicketMessage, UserSession } from '../types/faqHelp.types';
import { groupMessagesByDate, formatMessageTime } from '../utils/ticketDateUtils';

interface TicketChatThreadProps {
  ticket: SupportTicketItem | null;
  user?: UserSession;
  onBackToList: () => void;
  onZoomImage: (url: string) => void;
  onUpdateStatus?: (ticketId: number, newStatus: string) => void;
}

export default function TicketChatThread({
  ticket,
  user,
  onBackToList,
  onZoomImage,
  onUpdateStatus,
}: TicketChatThreadProps) {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const lastTicketIdRef = useRef<number | null>(null);
  const prevMsgCountRef = useRef<number>(0);

  const currentMsgCount = (ticket?.messages?.length || 0) + (ticket?.admin_reply ? 1 : 0);

  // Smart Auto-scroll: hanya scroll jika ganti tiket atau pesan bertambah saat posisi di dekat bawah
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el || !ticket) return;

    const isTicketChanged = lastTicketIdRef.current !== ticket.id;
    const isNewMessageAdded = currentMsgCount > prevMsgCountRef.current;

    if (isTicketChanged) {
      // Saat berganti tiket: scroll ke paling bawah
      lastTicketIdRef.current = ticket.id;
      prevMsgCountRef.current = currentMsgCount;
      requestAnimationFrame(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      });
      return;
    }

    if (isNewMessageAdded) {
      // Cek apakah posisi scroll user sedang di dekat bawah (toleransi 150px)
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      prevMsgCountRef.current = currentMsgCount;

      if (isNearBottom) {
        requestAnimationFrame(() => {
          if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
          }
        });
      }
      // Jika user sedang membaca chat sebelumnya di atas, posisi scroll tidak akan terganggu
    }
  }, [ticket?.id, currentMsgCount]);

  if (!ticket) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-light dark:bg-surface-dark">
        <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted rounded-2xl flex items-center justify-center mb-3 border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
          <MessageSquare className="w-7 h-7 opacity-60" />
        </div>
        <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark mb-1">
          Pilih Tiket Percakapan
        </h3>
        <p className="text-xs text-muted dark:text-on-dark-muted max-w-xs leading-relaxed">
          Pilih salah satu tiket dari daftar di sebelah kiri untuk melihat riwayat percakapan atau mengirim balasan ke admin.
        </p>
      </div>
    );
  }

  const isDone =
    (ticket.status || '').toLowerCase() === 'selesai' ||
    (ticket.status || '').toLowerCase() === 'completed' ||
    (ticket.status || '').toLowerCase() === 'closed';

  // Format list pesan utuh
  const rawMessages: TicketMessage[] =
    ticket.messages && ticket.messages.length > 0
      ? ticket.messages
      : [
          {
            id: `init-${ticket.id}`,
            sender: 'user',
            sender_name: user?.name || 'Anda',
            sender_role: 'dosen',
            message: ticket.message,
            image_url: ticket.image_url,
            created_at: ticket.created_at,
          },
          ...(ticket.admin_reply
            ? [
                {
                  id: `reply-${ticket.id}`,
                  sender: 'admin' as const,
                  sender_name: 'Admin PentaDosen',
                  sender_role: 'admin penelitian',
                  message: ticket.admin_reply,
                  created_at: ticket.replied_at || ticket.created_at,
                },
              ]
            : []),
        ];

  const groupedDates = groupMessagesByDate(rawMessages);

  const getStatusBadge = () => {
    if (isDone) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>Selesai</span>
        </span>
      );
    }
    if (ticket.status === 'dibalas') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark border border-accent-border dark:border-accent/30 font-mono">
          <MessageSquare className="w-3 h-3" />
          <span>Dibalas Admin</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 font-mono">
        <Clock className="w-3 h-3" />
        <span>Menunggu Balasan</span>
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-light dark:bg-surface-dark overflow-hidden">
      
      {/* Header Tiket Percakapan */}
      <header className="shrink-0 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark gap-3 z-10 shadow-2xs">
        
        <div className="flex items-center gap-3 min-w-0">
          {/* Tombol Back di Mobile */}
          <button
            type="button"
            onClick={onBackToList}
            aria-label="Kembali ke daftar tiket"
            className="lg:hidden p-2 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light dark:hover:bg-surface-dark transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark truncate leading-tight">
              {ticket.subject || 'Tanpa Subjek'}
            </h1>
            <p className="text-[11px] text-muted dark:text-on-dark-muted mt-0.5 truncate">
              Tiket <span className="font-mono font-semibold text-ink-heading dark:text-on-dark">#{ticket.id}</span>
              {' '}— dibuka oleh {user?.name || 'Dosen'}
            </p>
          </div>
        </div>

        {/* Action Controls di Header */}
        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}

          {onUpdateStatus && (
            <button
              type="button"
              onClick={() => onUpdateStatus(ticket.id, isDone ? 'menunggu' : 'selesai')}
              aria-label={isDone ? 'Buka kembali tiket ini' : 'Tandai tiket ini selesai'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated text-body dark:text-on-dark text-xs font-semibold transition-all cursor-pointer shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            >
              {isDone ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka Kembali</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success dark:text-success-on-dark" />
                  <span className="hidden sm:inline">Tandai Selesai</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Area Thread Pesan (Scrollable) */}
      <div
        ref={chatScrollRef}
        aria-label="Riwayat Percakapan Tiket"
        className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-light dark:bg-surface-dark space-y-5 scroll-smooth"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          
          {groupedDates.map((group) => (
            <div key={group.dateKey} className="space-y-3.5">
              
              {/* Date Divider (Tengah) */}
              <div className="flex items-center justify-center my-3">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft shadow-2xs">
                  {group.dateLabel}
                </span>
              </div>

              {/* Render Pesan-Pesan di Hari Ini */}
              {group.messages.map((msg, mIdx) => {
                const isUser = msg.sender === 'user';
                const timeStr = formatMessageTime(msg.created_at);

                return isUser ? (
                  /* ================= BUBBLE DOSEN / USER (KANAN) ================= */
                  <div key={msg.id || mIdx} className="flex flex-col items-end group/msg">
                    <div className="bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark px-4 py-2.5 rounded-2xl rounded-tr-xs text-[13.5px] leading-relaxed max-w-[85%] sm:max-w-[75%] border border-ink-hover dark:border-hairline-dark shadow-xs text-left">
                      <p className="whitespace-pre-line">{msg.message}</p>

                      {/* Lampiran Gambar Dosen */}
                      {msg.image_url && (
                        <div className="mt-2.5 pt-2 border-t border-white/20 dark:border-hairline-dark">
                          <div className="relative group inline-block rounded-xl overflow-hidden bg-black/40 p-1 border border-white/30 dark:border-hairline-dark max-w-xs">
                            <img
                              src={msg.image_url}
                              alt="Lampiran Dosen"
                              className="max-h-48 w-auto object-contain rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => onZoomImage(msg.image_url!)}
                              aria-label="Perbesar gambar lampiran"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer w-full h-full"
                            >
                              <Maximize2 className="w-4 h-4" />
                              <span>Perbesar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp Bersih di Bawah Bubble */}
                    {timeStr && (
                      <span className="text-[10.5px] font-mono text-muted dark:text-on-dark-muted mt-1 mr-1">
                        {timeStr}
                      </span>
                    )}
                  </div>
                ) : (
                  /* ================= BUBBLE ADMIN (KIRI) ================= */
                  <div key={msg.id || mIdx} className="flex items-end gap-2.5 group/msg">
                    {/* Avatar Admin */}
                    <div
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark font-bold text-[11px] flex items-center justify-center shrink-0 mb-5 border border-hairline-dark shadow-2xs"
                    >
                      AD
                    </div>

                    <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
                      {/* Admin Header Name & Tag */}
                      <div className="flex items-center gap-1.5 text-[11px] text-muted dark:text-on-dark-muted font-medium mb-1 ml-0.5">
                        <span className="font-semibold text-ink-heading dark:text-on-dark">
                          {msg.sender_name || 'Admin PentaDosen'}
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-semibold text-accent dark:text-accent-on-dark bg-accent-soft dark:bg-accent/15 px-1.5 py-0.2 rounded border border-accent-border dark:border-accent/30 uppercase tracking-wider text-[9px] font-mono">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Admin</span>
                        </span>
                      </div>

                      {/* Bubble Isi Pesan Admin */}
                      <div className="bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark px-4 py-2.5 rounded-2xl rounded-tl-xs text-[13.5px] leading-relaxed border border-hairline-light dark:border-hairline-dark shadow-xs text-left">
                        <p className="whitespace-pre-line">{msg.message}</p>

                        {/* Lampiran Gambar Admin jika ada */}
                        {msg.image_url && (
                          <div className="mt-2.5 pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                            <div className="relative group inline-block rounded-xl overflow-hidden bg-black/20 dark:bg-black/60 p-1 border border-hairline-light dark:border-hairline-dark max-w-xs">
                              <img
                                src={msg.image_url}
                                alt="Lampiran Admin"
                                className="max-h-48 w-auto object-contain rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => onZoomImage(msg.image_url!)}
                                aria-label="Perbesar gambar lampiran admin"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer w-full h-full"
                              >
                                <Maximize2 className="w-4 h-4" />
                                <span>Perbesar</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timestamp Bersih di Bawah Bubble */}
                      {timeStr && (
                        <span className="text-[10.5px] font-mono text-muted dark:text-on-dark-muted mt-1 ml-1">
                          {timeStr}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Status Alert Banner Jika Tiket Selesai */}
          {isDone && (
            <div className="my-3 p-3.5 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-dashed border-hairline-light dark:border-hairline-dark text-xs text-muted dark:text-on-dark-muted flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success dark:text-success-on-dark shrink-0" />
              <span>
                Tiket ini telah ditandai selesai. Mengirim pesan balasan baru akan otomatis membuka kembali percakapan.
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
