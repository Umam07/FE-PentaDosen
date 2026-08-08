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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Menunggu Balasan Admin
          </span>
        );
      case 'dibalas':
      case 'replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
            <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Dibalas Admin
          </span>
        );
      case 'selesai':
      case 'completed':
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
      
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40 shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Riwayat Pesan &amp; Konsultasi Saya
              </h3>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {myTickets.length} Tiket
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Percakapan interaktif &amp; konsultasi kendala teknis dengan administrator
            </p>
          </div>
        </div>

        {/* Tombol Kirim Pesan Baru */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Kirim Pesan Baru</span>
        </button>
      </div>

      {/* Sub-Filter Tabs (Aktif, Selesai, Semua) */}
      {myTickets.length > 0 && (
        <div className="bg-slate-100/80 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { key: 'aktif', label: 'Aktif / Dalam Proses', count: activeCount, icon: Clock, iconColor: 'text-amber-500' },
            { key: 'selesai', label: 'Selesai', count: completedCount, icon: CheckCircle2, iconColor: 'text-emerald-500' },
            { key: 'semua', label: 'Semua Pesan', count: myTickets.length, icon: Inbox, iconColor: 'text-primary-500' },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                className={`relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 outline-none select-none cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-700/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-dosen-ticket-tab"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-zinc-700"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <TabIcon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/60'
                      : 'bg-slate-200/80 dark:bg-zinc-700/80 text-slate-700 dark:text-zinc-300'
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
        <div className="py-12 text-center text-xs font-medium text-slate-400">
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
                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700'
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
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          <ImageIcon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>Lampiran Gambar</span>
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ticket.subject || 'Tanpa Subjek'}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate pl-0.5">
                      {rawMessages[rawMessages.length - 1]?.message || ticket.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:inline">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-900 dark:text-white' : ''}`} />
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
                      <div className="px-4 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                        
                        {/* Area Chat Conversation Thread */}
                        <div className="bg-slate-50/70 dark:bg-slate-950/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3.5 max-h-[420px] overflow-y-auto">
                          
                          <div className="text-center py-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                              Percakapan Dimulai: {formatDate(ticket.created_at)}
                            </span>
                          </div>

                          {rawMessages.map((msg, index) => {
                            const isUserMsg = msg.sender === 'user';

                            return isUserMsg ? (
                              /* Bubble Chat Pengirim (Dosen - Kanan) */
                              <div key={msg.id || index} className="flex justify-end gap-2.5 max-w-[88%] sm:max-w-[80%] ml-auto">
                                <div className="space-y-1 text-right min-w-0">
                                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-1">
                                    <span>{msg.sender_name || user?.name || 'Anda'}</span>
                                    <span>•</span>
                                    <span>{formatDate(msg.created_at)}</span>
                                  </div>
                                  <div className="bg-primary-600 dark:bg-primary-600 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed text-left font-medium border border-primary-500/30">
                                    <p className="whitespace-pre-line">{msg.message}</p>
                                    
                                    {/* Preview Lampiran Gambar */}
                                    {msg.image_url && (
                                      <div className="mt-3 pt-2.5 border-t border-white/20">
                                        <div className="relative group inline-block rounded-xl overflow-hidden bg-slate-950/80 p-1 border border-white/30 max-w-xs">
                                          <img
                                            src={msg.image_url}
                                            alt="Lampiran"
                                            className="max-h-44 w-auto object-contain rounded-lg"
                                          />
                                          <div
                                            onClick={() => onZoomImage(msg.image_url!)}
                                            className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold cursor-pointer"
                                          >
                                            <Maximize2 className="w-4 h-4" />
                                            <span>Perbesar</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs shrink-0 border border-primary-200 dark:border-primary-800 shadow-2xs mt-4">
                                  {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                                </div>
                              </div>
                            ) : (
                              /* Bubble Chat Penerima (Admin - Kiri) */
                              <div key={msg.id || index} className="flex justify-start gap-2.5 max-w-[88%] sm:max-w-[80%] mr-auto">
                                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-black flex items-center justify-center text-xs shrink-0 border border-slate-700 shadow-2xs mt-4">
                                  A
                                </div>
                                <div className="space-y-1 text-left min-w-0">
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-1">
                                    <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/40 uppercase tracking-wider text-[9px]">
                                      Admin
                                    </span>
                                    <span>{msg.sender_name || 'Tim Administrator'}</span>
                                    <span>•</span>
                                    <span>{formatDate(msg.created_at)}</span>
                                  </div>
                                  <div className="bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-2xs text-xs leading-relaxed font-medium">
                                    <p className="whitespace-pre-line">{msg.message}</p>

                                    {/* Preview Lampiran Gambar Admin jika ada */}
                                    {msg.image_url && (
                                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700">
                                        <div className="relative group inline-block rounded-xl overflow-hidden bg-slate-950/80 p-1 border border-slate-700 max-w-xs">
                                          <img
                                            src={msg.image_url}
                                            alt="Lampiran Admin"
                                            className="max-h-44 w-auto object-contain rounded-lg"
                                          />
                                          <div
                                            onClick={() => onZoomImage(msg.image_url!)}
                                            className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold cursor-pointer"
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
                          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Tiket ini ditandai selesai oleh admin. Mengirim pesan baru akan membuka kembali tiket ini.</span>
                          </div>
                        )}

                        {/* Form Kirim Pesan Balasan Lanjutan */}
                        <form onSubmit={(e) => handleSendFollowUpReply(e, ticket.id)} className="space-y-3 pt-1">
                          
                          {/* Preview Lampiran Gambar Balasan Dosen */}
                          {replyImagePreview && (
                            <div className="relative group inline-block rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 p-1">
                              <img src={replyImagePreview} alt="Preview Lampiran" className="h-16 w-auto object-contain rounded-lg" />
                              <button
                                type="button"
                                onClick={removeReplyImage}
                                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md cursor-pointer transition-colors"
                                title="Hapus gambar"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <label
                              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors shrink-0"
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
                              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />

                            <button
                              type="submit"
                              disabled={submittingReply || !replyText.trim()}
                              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
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
          <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {statusFilter === 'aktif'
              ? 'Tidak Ada Pesan Aktif / Dalam Proses'
              : statusFilter === 'selesai'
              ? 'Belum Ada Pesan Selesai'
              : 'Belum Ada Pesan yang Dikirim'}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
            {statusFilter === 'aktif'
              ? 'Semua pertanyaan atau konsultasi Anda telah diselesaikan oleh admin.'
              : statusFilter === 'selesai'
              ? 'Pesan atau konsultasi yang telah ditandai selesai oleh admin akan muncul di sini.'
              : 'Pesan atau pertanyaan yang Anda kirim ke admin akan muncul di sini.'}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Pesan Baru</span>
          </button>
        </div>
      )}
    </div>
  );
}
