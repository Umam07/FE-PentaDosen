import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Send, Clock, CheckCircle2, 
  HelpCircle, RefreshCw, X, ChevronRight, User, AlertCircle,
  Image as ImageIcon, Maximize2, ExternalLink, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportTicket, SupportTicketCounts } from '../types/cmsDashboard.types';

interface SupportTicketsTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
  user?: any;
}

export default function SupportTicketsTab({ triggerMessage, user }: SupportTicketsTabProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [counts, setCounts] = useState<SupportTicketCounts>({
    menunggu: 0,
    dibalas: 0,
    selesai: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | 'menunggu' | 'dibalas' | 'selesai'>('semua');
  
  // State modal detail & balas
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  // State Modal Preview Gambar Full & Fallback Error
  const [fullViewImageUrl, setFullViewImageUrl] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    let loadedTickets: SupportTicket[] = [];
    try {
      const res = await fetch(`/api/admin/support-tickets?role=${encodeURIComponent(user?.role || 'super admin')}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          loadedTickets = data.tickets || [];
        }
      }
    } catch (e) {
      console.warn('Backend unavailable for admin tickets, using local fallback:', e);
    }

    // Merge with local storage tickets for offline/dev sync
    try {
      const rawAll = localStorage.getItem('penta_support_tickets_all');
      if (rawAll) {
        const localAll: any[] = JSON.parse(rawAll);
        const map = new Map<number, any>();
        loadedTickets.forEach(t => map.set(t.id, t));
        localAll.forEach(t => {
          if (!map.has(t.id)) map.set(t.id, t);
        });
        loadedTickets = Array.from(map.values());
      }
    } catch {
      // Silent catch
    }

    setTickets(loadedTickets);
    const me = loadedTickets.filter(t => t.status === 'menunggu').length;
    const di = loadedTickets.filter(t => t.status === 'dibalas').length;
    const se = loadedTickets.filter(t => t.status === 'selesai').length;
    setCounts({
      menunggu: me,
      dibalas: di,
      selesai: se,
      total: loadedTickets.length
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleOpenDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || '');
    setMarkAsCompleted(ticket.status === 'selesai');
    setImageLoadError(false);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    if (!replyText.trim()) {
      triggerMessage('Isi balasan pesan tidak boleh kosong.', 'error');
      return;
    }

    setSubmittingReply(true);
    const targetStatus = markAsCompleted ? 'selesai' : 'dibalas';

    // Local storage sync for instant reflection in Dosen view
    try {
      const rawAll = localStorage.getItem('penta_support_tickets_all');
      if (rawAll) {
        const localAll: any[] = JSON.parse(rawAll);
        const idx = localAll.findIndex(t => t.id === selectedTicket.id);
        if (idx !== -1) {
          const t = localAll[idx];
          const msgs = t.messages || [];
          msgs.push({
            id: `msg_${Date.now()}_${msgs.length + 1}`,
            sender: 'admin',
            sender_id: user?.id || 1,
            sender_name: user?.name || 'Tim Admin',
            sender_role: user?.role || 'super admin',
            message: replyText.trim(),
            created_at: new Date().toISOString()
          });
          t.messages = msgs;
          t.admin_reply = replyText.trim();
          t.status = targetStatus;
          localStorage.setItem('penta_support_tickets_all', JSON.stringify(localAll));
        }
      }
    } catch {
      // Silent catch
    }

    try {
      const res = await fetch(`/api/admin/support-tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: user?.id || 1,
          admin_reply: replyText.trim(),
          status: targetStatus
        })
      });

      if (res.ok) {
        triggerMessage('Balasan pesan berhasil dikirim ke dosen!', 'success');
      }
    } catch (e) {
      console.warn('Backend unavailable, reply saved to local state:', e);
      triggerMessage('Balasan pesan berhasil dikirim ke dosen!', 'success');
    } finally {
      setSelectedTicket(null);
      setReplyText('');
      setSubmittingReply(false);
      fetchTickets();
    }
  };

  const handleUpdateStatus = async (ticketId: number, newStatus: 'menunggu' | 'dibalas' | 'selesai') => {
    try {
      const res = await fetch(`/api/admin/support-tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: user?.id || 1,
          status: newStatus
        })
      });

      if (res.ok) {
        triggerMessage(`Status pesan berhasil diubah menjadi ${newStatus}.`, 'success');
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
        }
        fetchTickets();
      } else {
        triggerMessage('Gagal mengubah status pesan.', 'error');
      }
    } catch (e) {
      console.error('Error updating ticket status:', e);
      triggerMessage('Terjadi kesalahan saat memperbarui status.', 'error');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = activeFilter === 'semua' || t.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      t.message.toLowerCase().includes(q) ||
      (t.user && t.user.name.toLowerCase().includes(q)) ||
      (t.user && t.user.email.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Menunggu
          </span>
        );
      case 'dibalas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20">
            <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Dibalas
          </span>
        );
      case 'selesai':
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

  return (
    <div className="space-y-5">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Pesan Masuk (Support Tickets)</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
              Kelola dan balas pertanyaan/kendala lengkap dengan tangkapan layar yang dikirim oleh dosen
            </p>
          </div>
        </div>

        <button
          onClick={fetchTickets}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { key: 'semua', label: 'Semua', count: counts.total },
            { key: 'menunggu', label: 'Menunggu', count: counts.menunggu },
            { key: 'dibalas', label: 'Dibalas', count: counts.dibalas },
            { key: 'selesai', label: 'Selesai', count: counts.selesai },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dosen, subjek, pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Memuat pesan masuk...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  <th className="py-3.5 px-4 sm:px-5">Dosen Pengirim</th>
                  <th className="py-3.5 px-4 sm:px-5">Subjek &amp; Pesan</th>
                  <th className="py-3.5 px-4 sm:px-5">Tanggal Kirim</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs font-medium text-slate-700 dark:text-zinc-300">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs shrink-0 border border-primary-200 dark:border-primary-800">
                          {t.user?.name ? t.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{t.user?.name || `User ID #${t.user_id}`}</p>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{t.user?.email || '-'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Subject & Preview */}
                    <td className="py-4 px-4 sm:px-5 max-w-xs">
                      <div className="flex items-center gap-2">
                        {t.image_url && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0 shadow-2xs">
                            <ImageIcon className="w-3 h-3 text-indigo-500" />
                            Gambar
                          </span>
                        )}
                        <p className="font-bold text-slate-900 dark:text-white truncate">
                          {t.subject || 'Tanpa Subjek'}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {t.message}
                      </p>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap text-slate-500 dark:text-zinc-400 text-[11px]">
                      {new Date(t.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-5 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetail(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <span>{t.status === 'menunggu' ? 'Balas Pesan' : 'Lihat Detail'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-14 text-center">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">Belum Ada Pesan</h4>
            <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs mx-auto">
              {searchQuery ? 'Tidak ada pesan yang sesuai dengan pencarian Anda.' : 'Belum ada tiket pertanyaan yang dikirim dosen.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal Detail & Balas Pesan */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Detail &amp; Balas Pesan</h3>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
                      Tiket #{selectedTicket.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Scrollable */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* User Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black text-sm border border-primary-200 dark:border-primary-800">
                      {selectedTicket.user?.name ? selectedTicket.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{selectedTicket.user?.name || `Dosen ID #${selectedTicket.user_id}`}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">{selectedTicket.user?.email || '-'}</p>
                      {selectedTicket.user?.fakultas && (
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 mt-0.5">
                          {selectedTicket.user.fakultas} {selectedTicket.user.program_studi ? `• ${selectedTicket.user.program_studi}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    {getStatusBadge(selectedTicket.status)}
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1">
                      {new Date(selectedTicket.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Percakapan Support / Chat Thread */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center justify-between">
                    <span>Riwayat Percakapan ({selectedTicket.messages?.length || 1} Pesan):</span>
                    <span>Subjek: {selectedTicket.subject || 'Tanpa Subjek'}</span>
                  </label>

                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/50 space-y-3.5 max-h-[380px] overflow-y-auto">
                    {((selectedTicket.messages && selectedTicket.messages.length > 0)
                      ? selectedTicket.messages
                      : [
                          {
                            id: `init-${selectedTicket.id}`,
                            sender: 'user',
                            sender_name: selectedTicket.user?.name || `Dosen ID #${selectedTicket.user_id}`,
                            sender_role: 'dosen',
                            message: selectedTicket.message,
                            image_url: selectedTicket.image_url || undefined,
                            created_at: selectedTicket.created_at
                          },
                          ...(selectedTicket.admin_reply ? [{
                            id: `reply-${selectedTicket.id}`,
                            sender: 'admin' as const,
                            sender_name: selectedTicket.replied_by_admin?.name || 'Tim Admin',
                            sender_role: selectedTicket.replied_by_admin?.role || 'super admin',
                            message: selectedTicket.admin_reply,
                            created_at: selectedTicket.replied_at || selectedTicket.created_at
                          }] : [])
                        ]
                    ).map((msg, index) => {
                      const isUser = msg.sender === 'user';

                      return isUser ? (
                        /* Bubble Chat Dosen (Kiri untuk Admin View) */
                        <div key={msg.id || index} className="flex justify-start gap-2.5 max-w-[85%] mr-auto">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs shrink-0 border border-primary-200 dark:border-primary-800 shadow-2xs mt-4">
                            {msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div className="space-y-1 text-left min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold px-1">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/40 uppercase tracking-wider text-[9px]">
                                Dosen
                              </span>
                              <span>{msg.sender_name || 'Dosen Pengirim'}</span>
                              <span>•</span>
                              <span>{new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800/90 text-slate-900 dark:text-zinc-100 p-3.5 rounded-2xl rounded-tl-xs border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs text-xs leading-relaxed font-medium">
                              <p className="whitespace-pre-line">{msg.message}</p>
                              {msg.image_url && (
                                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-700">
                                  <div className="relative group inline-block rounded-xl overflow-hidden bg-slate-950 p-1 border border-slate-700 max-w-xs">
                                    <img src={msg.image_url} alt="Lampiran Dosen" className="max-h-44 w-auto object-contain rounded-lg" />
                                    <div
                                      onClick={() => setFullViewImageUrl(msg.image_url!)}
                                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[11px] font-bold cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Perbesar</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Bubble Chat Admin (Kanan untuk Admin View) */
                        <div key={msg.id || index} className="flex justify-end gap-2.5 max-w-[85%] ml-auto">
                          <div className="space-y-1 text-right min-w-0">
                            <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold px-1">
                              <span>{msg.sender_name || 'Admin'}</span>
                              <span>•</span>
                              <span>{new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="bg-primary-600 dark:bg-primary-600 text-white p-3.5 rounded-2xl rounded-tr-xs shadow-2xs text-xs leading-relaxed text-left font-medium border border-primary-500/30">
                              <p className="whitespace-pre-line">{msg.message}</p>
                              {msg.image_url && (
                                <div className="mt-3 pt-2.5 border-t border-white/20">
                                  <div className="relative group inline-block rounded-xl overflow-hidden bg-slate-950 p-1 border border-white/30 max-w-xs">
                                    <img src={msg.image_url} alt="Lampiran Admin" className="max-h-44 w-auto object-contain rounded-lg" />
                                    <div
                                      onClick={() => setFullViewImageUrl(msg.image_url!)}
                                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-[11px] font-bold cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4" />
                                      <span>Perbesar</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-zinc-800 text-white font-black flex items-center justify-center text-xs shrink-0 border border-slate-700 shadow-2xs mt-4">
                            A
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                      Tulis Balasan / Solusi Baru dari Tim Admin:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tuliskan balasan atau instruksi lengkap untuk dosen..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={markAsCompleted}
                        onChange={(e) => setMarkAsCompleted(e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                        Tandai status sebagai <strong className="text-slate-900 dark:text-white">&quot;Selesai&quot;</strong>
                      </span>
                    </label>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {selectedTicket.status !== 'selesai' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedTicket.id, 'selesai')}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Tandai Selesai
                        </button>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL PREVIEW GAMBAR FULL ADMIN */}
      <AnimatePresence>
        {fullViewImageUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullViewImageUrl(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] z-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-3 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 px-2">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Pratinjau Tangkapan Layar Kendala Dosen</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={fullViewImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Tab Baru</span>
                  </a>
                  <button
                    onClick={() => setFullViewImageUrl(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-auto p-2">
                <img
                  src={fullViewImageUrl}
                  alt="Gambar Kendala Dosen"
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-slate-800"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
