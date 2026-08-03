import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Send, Clock, CheckCircle2, 
  HelpCircle, RefreshCw, X, ChevronRight, ArrowLeft, User,
  Image as ImageIcon, ExternalLink, Eye
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
  
  // State tiket terpilih (Embedded Chat Room)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  // State Modal Preview Gambar Full
  const [fullViewImageUrl, setFullViewImageUrl] = useState<string | null>(null);

  // Ref untuk auto-scroll ke bawah saat ada pesan baru di chat room
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
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

    // Merge with local storage tickets for offline/dev sync and deduplicate
    try {
      const rawAll = localStorage.getItem('penta_support_tickets_all');
      if (rawAll) {
        const localAll: any[] = JSON.parse(rawAll);
        const map = new Map<string, any>();
        [...localAll, ...loadedTickets].forEach(t => {
          const key = `${t.user_id}_${(t.subject || '').trim()}_${(t.message || '').trim()}`;
          const existing = map.get(key);
          if (!existing) {
            map.set(key, t);
          } else if (t.id < 1000000000000 && existing.id >= 1000000000000) {
            map.set(key, t);
          }
        });
        loadedTickets = Array.from(map.values());
      }
    } catch {
      // Silent catch
    }

    // Urutkan tiket dari yang terbaru
    loadedTickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setTickets(loadedTickets);

    // Update selectedTicket jika sedang dibuka agar pesan baru dari dosen langsung muncul realtime
    setSelectedTicket(prev => {
      if (!prev) return null;
      const updated = loadedTickets.find(t => t.id === prev.id);
      return updated || prev;
    });

    const me = loadedTickets.filter(t => t.status === 'menunggu').length;
    const di = loadedTickets.filter(t => t.status === 'dibalas').length;
    const se = loadedTickets.filter(t => t.status === 'selesai').length;
    setCounts({
      menunggu: me,
      dibalas: di,
      selesai: se,
      total: loadedTickets.length
    });
    if (!isSilent) setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Polling interval 3s & event listener untuk real-time update
  useEffect(() => {
    const handleUpdate = () => {
      fetchTickets(true);
    };

    window.addEventListener('penta_tickets_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const intervalId = setInterval(() => {
      fetchTickets(true);
    }, 3000);

    return () => {
      window.removeEventListener('penta_tickets_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Auto-scroll ke pesan terbaru saat selectedTicket berubah atau pesan baru masuk
  useEffect(() => {
    if (selectedTicket) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages, selectedTicket?.id]);

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || '');
    setMarkAsCompleted(ticket.status === 'selesai');
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

    // Local storage sync for instant reflection in Dosen view & current tab
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

    // Trigger Custom Event real-time broadcast
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('penta_tickets_updated'));
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
      setReplyText('');
      setSubmittingReply(false);
      fetchTickets(true);
    }
  };

  const handleUpdateStatus = async (ticketId: number, newStatus: 'menunggu' | 'dibalas' | 'selesai') => {
    // Sync local state
    try {
      const rawAll = localStorage.getItem('penta_support_tickets_all');
      if (rawAll) {
        const localAll: any[] = JSON.parse(rawAll);
        const idx = localAll.findIndex(t => t.id === ticketId);
        if (idx !== -1) {
          localAll[idx].status = newStatus;
          localStorage.setItem('penta_support_tickets_all', JSON.stringify(localAll));
        }
      }
    } catch {
      // Silent catch
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('penta_tickets_updated'));
    }

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
      }
    } catch (e) {
      console.warn('Error updating status, updated locally:', e);
      triggerMessage(`Status pesan diubah menjadi ${newStatus}.`, 'success');
    } finally {
      fetchTickets(true);
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
    <div className="space-y-5">
      {/* Top Header Bar Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Pesan Masuk Support</h3>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
              Kelola dan balas obrolan interaktif serta kendala teknis dosen tanpa pop-up
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchTickets(false)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Master-Detail Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* SISI KIRI (MASTER): Daftar Tiket & Filter (Tampil Penuh di Mobile jika belum pilih tiket) */}
        <div className={`lg:col-span-5 space-y-4 ${selectedTicket ? 'hidden lg:block' : 'block'}`}>
          
          {/* Search Bar & Filter Status */}
          <div className="space-y-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama dosen, subjek, pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/60 hover:bg-slate-100 dark:hover:bg-zinc-750'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List Card Tiket Dosen */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Memuat pesan...</p>
              </div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const lastMsg = (t.messages && t.messages.length > 0) 
                  ? t.messages[t.messages.length - 1] 
                  : { message: t.message, created_at: t.created_at };

                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectTicket(t)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-primary-50/70 dark:bg-primary-950/30 border-primary-500 shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs shrink-0 border border-primary-200 dark:border-primary-800">
                          {t.user?.name ? t.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {t.user?.name || `Dosen #${t.user_id}`}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                            {t.user?.email || 'Dosen'}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {getStatusBadge(t.status)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {t.image_url && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800 shrink-0">
                            <ImageIcon className="w-2.5 h-2.5" /> Gambar
                          </span>
                        )}
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                          {t.subject || 'Tanpa Subjek'}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {lastMsg.message}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
                      <span>{formatDate(t.created_at)}</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5">
                        <span>Buka Chat</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <HelpCircle className="w-8 h-8 text-slate-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-zinc-400">Tidak ada pesan ditemukan</p>
              </div>
            )}
          </div>

        </div>

        {/* SISI KANAN (DETAIL): Ruang Percakapan Chat Embedded (Tanpa Pop-Up) */}
        <div className={`lg:col-span-7 ${!selectedTicket ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-2xs min-h-[580px] flex flex-col">
            
            {selectedTicket ? (
              <>
                {/* Embedded Chat Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Tombol kembali ke daftar (Mobile view) */}
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="lg:hidden p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 cursor-pointer"
                      title="Kembali ke Daftar Pesan"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black text-sm border border-primary-200 dark:border-primary-800 shrink-0">
                      {selectedTicket.user?.name ? selectedTicket.user.name.charAt(0).toUpperCase() : 'D'}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {selectedTicket.user?.name || `Dosen ID #${selectedTicket.user_id}`}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {selectedTicket.user?.email || '-'}
                        {selectedTicket.user?.fakultas ? ` • ${selectedTicket.user.fakultas}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown / Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(selectedTicket.status)}
                    
                    {selectedTicket.status !== 'selesai' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'selesai')}
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subjek Info Banner */}
                <div className="px-5 py-2.5 bg-primary-50/50 dark:bg-primary-950/20 border-b border-primary-100/50 dark:border-primary-900/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary-700 dark:text-primary-400 shrink-0">
                      Subjek:
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-zinc-100 truncate">
                      {selectedTicket.subject || 'Tanpa Subjek'}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 shrink-0">
                    Tiket #{selectedTicket.id}
                  </span>
                </div>

                {/* Embedded Chat Body / Thread Messages */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[380px] bg-slate-50/60 dark:bg-zinc-950/40 space-y-4">
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
                      <div key={msg.id || index} className="flex justify-start gap-2.5 max-w-[90%] sm:max-w-[82%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs shrink-0 border border-primary-200 dark:border-primary-800 shadow-2xs mt-4">
                          {msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'D'}
                        </div>
                        <div className="space-y-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold px-1">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-900/40 uppercase tracking-wider text-[9px]">
                              Dosen
                            </span>
                            <span>{msg.sender_name || 'Dosen Pengirim'}</span>
                            <span>•</span>
                            <span>{formatDate(msg.created_at)}</span>
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
                      <div key={msg.id || index} className="flex justify-end gap-2.5 max-w-[90%] sm:max-w-[82%] ml-auto">
                        <div className="space-y-1 text-right min-w-0">
                          <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold px-1">
                            <span>{msg.sender_name || 'Admin'}</span>
                            <span>•</span>
                            <span>{formatDate(msg.created_at)}</span>
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
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Form Kirim Balasan Langsung di Halaman (Non Pop-Up) */}
                <form onSubmit={handleSendReply} className="p-4 sm:p-5 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Tulis Balasan / Instruksi dari Admin:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ketik balasan untuk dosen pengirim..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 leading-relaxed"
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
                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Empty State (Saat Belum Ada Tiket yang Dipilih) */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-3 border border-primary-100 dark:border-primary-900/40 shadow-2xs">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight mb-1">
                  Pilih Pesan Masuk
                </h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs leading-relaxed">
                  Klik salah satu tiket pertanyaan dosen dari daftar di sebelah kiri untuk melihat riwayat percakapan dan membalas pesan.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

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
