import React, { useState } from 'react';
import {
  Inbox, Plus, ChevronDown, Clock, MessageSquare, CheckCircle2,
  Image as ImageIcon, Maximize2, Send, Paperclip, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MyTicketsListProps, TicketMessage } from '../types/faqHelp.types';
import { sendTicketReply } from '../services/faqHelpService';

export default function MyTicketsList({
  loadingTickets,
  myTickets,
  expandedTicketId,
  user,
  onToggleTicketExpand,
  onOpenCreateModal,
  onZoomImage,
  onRefreshTickets,
  showToast,
}: MyTicketsListProps) {
  // State lokal untuk balasan pesan lanjutan oleh dosen
  const [replyText, setReplyText] = useState('');
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'aktif' | 'selesai' | 'semua'>('aktif');

  const isCompletedStatus = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    return s === 'selesai' || s === 'completed' || s === 'closed';
  };

  const activeCount = myTickets.filter(t => !isCompletedStatus(t.status)).length;
  const completedCount = myTickets.filter(t => isCompletedStatus(t.status)).length;

  const filteredTickets = myTickets.filter(t => {
    if (statusFilter === 'aktif') return !isCompletedStatus(t.status);
    if (statusFilter === 'selesai') return isCompletedStatus(t.status);
    return true;
  });

  const getTicketStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    switch (s) {
      case 'menunggu':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 font-mono">
            <Clock className="w-3 h-3 text-warning dark:text-warning-on-dark" />
            Menunggu Balasan Admin
          </span>
        );
      case 'dibalas':
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark border border-accent-border dark:border-accent/30 font-mono">
            <MessageSquare className="w-3 h-3 text-accent dark:text-accent-on-dark" />
            Dibalas Admin
          </span>
        );
      case 'selesai':
      case 'completed':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border border-success-border dark:border-success/30 font-mono">
            <CheckCircle2 className="w-3 h-3 text-success-dark dark:text-success-on-dark" />
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  const handleReplyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('File terlampir harus berupa gambar.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      if (showToast) showToast('Ukuran gambar tidak boleh melebihi 10 MB.', 'error');
      return;
    }

    setReplyImageFile(file);
    setReplyImagePreview(URL.createObjectURL(file));
  };

  const removeReplyImage = () => {
    setReplyImageFile(null);
    if (replyImagePreview) {
      URL.revokeObjectURL(replyImagePreview);
      setReplyImagePreview(null);
    }
  };

  const handleSendFollowUpReply = async (e: React.FormEvent, ticketId: number) => {
    e.preventDefault();
    if (!replyText.trim()) {
      if (showToast) showToast('Pesan balasan tidak boleh kosong.', 'error');
      return;
    }

    setSubmittingReply(true);
    try {
      const formData = new FormData();
      formData.append('sender', 'user');
      formData.append('sender_id', String(user?.id || 1));
      formData.append('message', replyText.trim());
      if (replyImageFile) {
        formData.append('image', replyImageFile);
      }

      const res = await sendTicketReply(ticketId, formData);
      if (res.ok) {
        if (showToast) showToast('Balasan pesan Anda berhasil dikirim ke admin!', 'success');
        setReplyText('');
        removeReplyImage();
        if (onRefreshTickets) onRefreshTickets();
      } else {
        if (showToast) showToast(res.data?.message || 'Gagal mengirim balasan pesan.', 'error');
      }
    } catch (err) {
      console.error('Error sending ticket reply:', err);
      if (showToast) showToast('Terjadi kesalahan saat mengirim pesan balasan.', 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 sm:p-6 space-y-4 shadow-xs">
      
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline-light-soft dark:border-hairline-dark-soft pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ink-soft dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
            <Inbox className="w-5 h-5 text-accent dark:text-accent-on-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark">
                Riwayat Pesan &amp; Konsultasi Saya
              </h3>
              <span className="text-[11px] font-semibold text-body dark:text-on-dark-soft bg-ink-soft dark:bg-surface-dark-elevated px-2 py-0.5 rounded-md font-mono">
                {myTickets.length} Tiket
              </span>
            </div>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Percakapan interaktif &amp; konsultasi kendala teknis dengan administrator
            </p>
          </div>
        </div>

        {/* Tombol Kirim Pesan Baru (Primary action) */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Kirim Pesan Baru</span>
        </button>
      </div>

      {/* Sub-Filter Tabs (Aktif, Selesai, Semua) */}
      {myTickets.length > 0 && (
        <div className="bg-surface-light-raised dark:bg-surface-dark-soft p-1.5 rounded-2xl border border-hairline-light dark:border-hairline-dark-soft flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-xs">
          {[
            { key: 'aktif', label: 'Aktif / Dalam Proses', count: activeCount, icon: Clock, iconColor: 'text-warning dark:text-warning-on-dark' },
            { key: 'selesai', label: 'Selesai', count: completedCount, icon: CheckCircle2, iconColor: 'text-success dark:text-success-on-dark' },
            { key: 'semua', label: 'Semua Pesan', count: myTickets.length, icon: Inbox, iconColor: 'text-muted dark:text-on-dark-muted' },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                className={`relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 outline-none select-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-ink-heading dark:text-on-dark'
                    : 'text-muted dark:text-on-dark-muted hover:text-body-strong dark:hover:text-on-dark hover:bg-surface-light-raised/80 dark:hover:bg-surface-dark-elevated/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-dosen-ticket-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xs border border-hairline-light dark:border-hairline-dark"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <TabIcon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono transition-colors ${
                    isActive
                      ? 'bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark'
                      : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Body Daftar Pesan */}
      {loadingTickets ? (
        <div className="py-12 text-center text-xs font-medium text-muted dark:text-on-dark-muted">
          Memuat riwayat pesan...
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-3 pt-1">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;

            // Dapatkan list pesan (multichat messages jika ada, atau fallback buatan dari message & admin_reply)
            const rawMessages: TicketMessage[] = (ticket.messages && ticket.messages.length > 0)
              ? ticket.messages
              : [
                  {
                    id: `init-${ticket.id}`,
                    sender: 'user',
                    sender_name: user?.name || 'Anda',
                    sender_role: 'dosen',
                    message: ticket.message,
                    image_url: ticket.image_url,
                    created_at: ticket.created_at
                  },
                  ...(ticket.admin_reply ? [{
                    id: `reply-${ticket.id}`,
                    sender: 'admin' as const,
                    sender_name: 'Tim Admin',
                    sender_role: 'admin penelitian',
                    message: ticket.admin_reply,
                    created_at: ticket.replied_at || ticket.created_at
                  }] : [])
                ];

            return (
              <div
                key={ticket.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs'
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-soft/40 hover:border-ink-border dark:hover:border-hairline-dark'
                }`}
              >
                <button
                  onClick={() => onToggleTicketExpand(ticket.id)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {getTicketStatusBadge(ticket.status)}
                      {rawMessages.some(m => !!m.image_url) && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted dark:text-on-dark-muted">
                          <ImageIcon className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                          <span>Lampiran Gambar</span>
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate">
                        {ticket.subject || 'Tanpa Subjek'}
                      </h4>
                    </div>
                    <p className="text-xs text-muted dark:text-on-dark-muted truncate pl-0.5">
                      {rawMessages[rawMessages.length - 1]?.message || ticket.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-medium font-mono text-muted dark:text-on-dark-muted hidden sm:inline">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted dark:text-on-dark-muted transition-transform duration-200 ${isExpanded ? 'rotate-180 text-ink-heading dark:text-on-dark' : ''}`} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="px-4 pb-5 pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft space-y-4">
                        
                        {/* Area Chat Conversation Thread */}
                        <div className="bg-surface-light-raised/60 dark:bg-surface-dark-soft p-3.5 sm:p-4 rounded-2xl border border-hairline-light dark:border-hairline-dark space-y-3.5 max-h-[420px] overflow-y-auto">
                          
                          <div className="text-center py-1">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted dark:text-on-dark-muted bg-surface-light dark:bg-surface-dark-elevated px-2.5 py-0.5 rounded-full border border-hairline-light-soft dark:border-hairline-dark-soft font-mono">
                              Percakapan Dimulai: {formatDate(ticket.created_at)}
                            </span>
                          </div>

                          {rawMessages.map((msg, index) => {
                            const isUserMsg = msg.sender === 'user';

                            return isUserMsg ? (
                              /* Bubble Chat Pengirim (Dosen - Kanan) */
                              <div key={msg.id || index} className="flex justify-end gap-2.5 max-w-[88%] sm:max-w-[80%] ml-auto">
                                <div className="space-y-1 text-right min-w-0">
                                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted dark:text-on-dark-muted font-medium px-1 font-mono">
                                    <span>{msg.sender_name || user?.name || 'Anda'}</span>
                                    <span>•</span>
                                    <span>{formatDate(msg.created_at)}</span>
                                  </div>
                                  <div className="bg-ink dark:bg-surface-dark-elevated text-white dark:text-on-dark p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed text-left font-normal border border-ink-hover dark:border-hairline-dark">
                                    <p className="whitespace-pre-line">{msg.message}</p>
                                    
                                    {/* Preview Lampiran Gambar */}
                                    {msg.image_url && (
                                      <div className="mt-3 pt-2.5 border-t border-white/20 dark:border-hairline-dark">
                                        <div className="relative group inline-block rounded-xl overflow-hidden bg-surface-dark p-1 border border-white/30 dark:border-hairline-dark max-w-xs">
                                          <img
                                            src={msg.image_url}
                                            alt="Lampiran"
                                            className="max-h-44 w-auto object-contain rounded-lg"
                                          />
                                          <div
                                            onClick={() => onZoomImage(msg.image_url!)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer"
                                          >
                                            <Maximize2 className="w-4 h-4" />
                                            <span>Perbesar</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark-soft font-bold flex items-center justify-center text-xs shrink-0 border border-hairline-light dark:border-hairline-dark shadow-xs mt-4">
                                  {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                                </div>
                              </div>
                            ) : (
                              /* Bubble Chat Penerima (Admin - Kiri) */
                              <div key={msg.id || index} className="flex justify-start gap-2.5 max-w-[88%] sm:max-w-[80%] mr-auto">
                                <div className="w-8 h-8 rounded-full bg-ink text-white dark:bg-surface-dark-elevated dark:text-on-dark font-bold flex items-center justify-center text-xs shrink-0 border border-hairline-dark shadow-xs mt-4">
                                  A
                                </div>
                                <div className="space-y-1 text-left min-w-0">
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted dark:text-on-dark-muted font-medium px-1 font-mono">
                                    <span className="font-semibold text-accent dark:text-accent-on-dark bg-accent-soft dark:bg-accent/15 px-1.5 py-0.5 rounded border border-accent-border dark:border-accent/30 uppercase tracking-wider text-[9px]">
                                      Admin
                                    </span>
                                    <span>{msg.sender_name || 'Tim Administrator'}</span>
                                    <span>•</span>
                                    <span>{formatDate(msg.created_at)}</span>
                                  </div>
                                  <div className="bg-surface-light dark:bg-surface-dark text-body-strong dark:text-on-dark p-3.5 sm:p-4 rounded-2xl rounded-tl-xs border border-hairline-light dark:border-hairline-dark shadow-xs text-xs leading-relaxed font-normal">
                                    <p className="whitespace-pre-line">{msg.message}</p>

                                    {/* Preview Lampiran Gambar Admin jika ada */}
                                    {msg.image_url && (
                                      <div className="mt-3 pt-2.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                                        <div className="relative group inline-block rounded-xl overflow-hidden bg-surface-dark p-1 border border-hairline-dark max-w-xs">
                                          <img
                                            src={msg.image_url}
                                            alt="Lampiran Admin"
                                            className="max-h-44 w-auto object-contain rounded-lg"
                                          />
                                          <div
                                            onClick={() => onZoomImage(msg.image_url!)}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold cursor-pointer"
                                          >
                                            <Maximize2 className="w-4 h-4" />
                                            <span>Perbesar</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Status Notice Banner jika Tiket Selesai */}
                        {ticket.status === 'selesai' && (
                          <div className="p-3 rounded-xl bg-success-soft dark:bg-success/15 border border-success-border dark:border-success/30 text-success-dark dark:text-success-on-dark text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success-dark dark:text-success-on-dark shrink-0" />
                            <span>Tiket ini ditandai selesai oleh admin. Mengirim pesan baru akan membuka kembali tiket ini.</span>
                          </div>
                        )}

                        {/* Form Kirim Pesan Balasan Lanjutan */}
                        <form onSubmit={(e) => handleSendFollowUpReply(e, ticket.id)} className="space-y-3 pt-1">
                          
                          {/* Preview Lampiran Gambar Balasan Dosen */}
                          {replyImagePreview && (
                            <div className="relative group inline-block rounded-xl overflow-hidden border border-hairline-light dark:border-hairline-dark bg-surface-dark p-1">
                              <img src={replyImagePreview} alt="Preview Lampiran" className="h-16 w-auto object-contain rounded-lg" />
                              <button
                                type="button"
                                onClick={removeReplyImage}
                                className="absolute top-1 right-1 p-1 bg-error text-white rounded-full hover:bg-error/90 shadow-md cursor-pointer transition-colors"
                                title="Hapus gambar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <label
                              className="p-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted dark:text-on-dark-muted cursor-pointer transition-colors shrink-0"
                              title="Lampirkan tangkapan layar/gambar"
                            >
                              <Paperclip className="w-4 h-4" />
                              <input type="file" accept="image/*" className="hidden" onChange={handleReplyImageChange} />
                            </label>

                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Ketik balasan atau pertanyaan susulan ke admin..."
                              className="flex-1 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:border-accent dark:focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                            />

                            <button
                              type="submit"
                              disabled={submittingReply || !replyText.trim()}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-xs font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{submittingReply ? 'Mengirim...' : 'Kirim'}</span>
                            </button>
                          </div>
                        </form>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-14 text-center">
          <Inbox className="w-10 h-10 text-muted dark:text-on-dark-muted mx-auto mb-2 opacity-60" />
          <h4 className="text-xs font-semibold text-ink-heading dark:text-on-dark mb-1">
            {statusFilter === 'aktif'
              ? 'Tidak Ada Pesan Aktif / Dalam Proses'
              : statusFilter === 'selesai'
              ? 'Belum Ada Pesan Selesai'
              : 'Belum Ada Pesan yang Dikirim'}
          </h4>
          <p className="text-xs text-muted dark:text-on-dark-muted max-w-xs mx-auto mb-4 leading-relaxed">
            {statusFilter === 'aktif'
              ? 'Semua pertanyaan atau konsultasi Anda telah diselesaikan oleh admin.'
              : statusFilter === 'selesai'
              ? 'Pesan atau konsultasi yang telah ditandai selesai oleh admin akan muncul di sini.'
              : 'Pesan atau pertanyaan yang Anda kirim ke admin akan muncul di sini.'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Pesan Baru</span>
          </button>
        </div>
      )}
    </div>
  );
}

