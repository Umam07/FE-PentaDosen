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
      const res = await fetch(`/api/admin/support-tickets?role=${encodeURIComponent(user?.role || 'admin penelitian')}`);
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
            sender_role: user?.role || 'admin penelitian',
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-warning-soft text-warning-dark border border-warning-border dark:bg-warning/15 dark:text-warning dark:border-warning/30">
            <Clock className="w-3 h-3 text-warning" />
            Menunggu
          </span>
        );
      case 'dibalas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent-soft text-accent border border-accent/20 dark:bg-accent/15 dark:text-accent-on-dark dark:border-accent/30">
            <MessageSquare className="w-3 h-3 text-accent dark:text-accent-on-dark" />
            Dibalas
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success-dark border border-success-border dark:bg-success/15 dark:text-success-on-dark dark:border-success/30">
            <CheckCircle2 className="w-3 h-3 text-success" />
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">Pesan Masuk Support</h3>
            </div>
            <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">
              Kelola dan respon obrolan serta kendala teknis dari civitas dosen.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchTickets(false)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Master-Detail Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* SISI KIRI (MASTER): Daftar Tiket & Filter */}
        <div className={`lg:col-span-5 space-y-4 ${selectedTicket ? 'hidden lg:block' : 'block'}`}>
          
          {/* Search Bar & Filter Status */}
          <div className="space-y-3 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Cari nama dosen, subjek, pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink-heading dark:hover:text-on-dark"
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs'
                        : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${isActive ? 'bg-white/20 text-on-ink dark:text-on-dark' : 'bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted'}`}>
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
              <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted dark:text-on-dark-muted">Memuat pesan...</p>
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
                        ? 'bg-surface-light-raised dark:bg-surface-dark-elevated border-hairline-light dark:border-hairline-dark shadow-xs'
                        : 'bg-surface-light dark:bg-surface-dark border-hairline-light-soft dark:border-hairline-dark-soft hover:border-hairline-light dark:hover:border-hairline-dark'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark flex items-center justify-center font-bold text-xs shrink-0 border border-hairline-light-soft dark:border-hairline-dark-soft">
                          {t.user?.name ? t.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark truncate">
                            {t.user?.name || `Dosen #${t.user_id}`}
                          </h4>
                          <p className="text-[10px] text-muted dark:text-on-dark-muted truncate">
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
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-chart-hki/15 text-chart-hki px-1.5 py-0.2 rounded border border-chart-hki/30 shrink-0">
                            <ImageIcon className="w-2.5 h-2.5" /> Gambar
                          </span>
                        )}
                        <h5 className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate">
                          {t.subject || 'Tanpa Subjek'}
                        </h5>
                      </div>
                      <p className="text-xs text-body dark:text-on-dark-soft line-clamp-2 leading-relaxed">
                        {lastMsg.message}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between text-[10px] font-mono text-muted dark:text-on-dark-muted">
                      <span>{formatDate(t.created_at)}</span>
                      <span className="font-sans font-semibold text-accent dark:text-accent-on-dark flex items-center gap-0.5">
                        <span>Buka Chat</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark">
                <HelpCircle className="w-8 h-8 text-muted-soft dark:text-on-dark-muted mx-auto mb-2" />
                <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">Tidak ada pesan ditemukan</p>
              </div>
            )}
          </div>

        </div>

        {/* SISI KANAN (DETAIL): Ruang Percakapan Chat Embedded */}
        <div className={`lg:col-span-7 ${!selectedTicket ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-xs min-h-[580px] flex flex-col">
            
            {selectedTicket ? (
              <>
                {/* Embedded Chat Header */}
                <div className="p-4 sm:p-5 border-b border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Tombol kembali ke daftar (Mobile view) */}
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="lg:hidden p-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark cursor-pointer"
                      title="Kembali ke Daftar Pesan"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark flex items-center justify-center font-bold text-sm border border-hairline-light-soft dark:border-hairline-dark-soft shrink-0">
                      {selectedTicket.user?.name ? selectedTicket.user.name.charAt(0).toUpperCase() : 'D'}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate">
                        {selectedTicket.user?.name || `Dosen ID #${selectedTicket.user_id}`}
                      </h4>
                      <p className="text-[11px] text-muted dark:text-on-dark-muted truncate">
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
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-success-soft hover:bg-success-soft/80 text-success-dark dark:text-success-on-dark border border-success-border text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subjek Info Banner */}
                <div className="px-5 py-2.5 bg-surface-light-raised/70 dark:bg-surface-dark-elevated/50 border-b border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted shrink-0">
                      Subjek:
                    </span>
                    <span className="font-semibold text-ink-heading dark:text-on-dark truncate">
                      {selectedTicket.subject || 'Tanpa Subjek'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted dark:text-on-dark-muted shrink-0">
                    Tiket #{selectedTicket.id}
                  </span>
                </div>

                {/* Embedded Chat Body / Thread Messages */}
                <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[380px] bg-surface-light-raised/30 dark:bg-surface-dark-elevated/20 space-y-4">
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
                          sender_role: selectedTicket.replied_by_admin?.role || 'admin penelitian',
                          message: selectedTicket.admin_reply,
                          created_at: selectedTicket.replied_at || selectedTicket.created_at
                        }] : [])
                      ]
                  ).map((msg, index) => {
                    const isUser = msg.sender === 'user';

                    return isUser ? (
                      /* Bubble Chat Dosen (Kiri untuk Admin View) */
                      <div key={msg.id || index} className="flex justify-start gap-2.5 max-w-[90%] sm:max-w-[82%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold flex items-center justify-center text-xs shrink-0 border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs mt-4">
                          {msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'D'}
                        </div>
                        <div className="space-y-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-muted dark:text-on-dark-muted font-semibold px-1">
                            <span className="font-semibold text-success-dark dark:text-success-on-dark bg-success-soft px-1.5 py-0.2 rounded border border-success-border uppercase tracking-wider text-[9px]">
                              Dosen
                            </span>
                            <span>{msg.sender_name || 'Dosen Pengirim'}</span>
                            <span>•</span>
                            <span className="font-mono">{formatDate(msg.created_at)}</span>
                          </div>
                          <div className="bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark p-3.5 rounded-2xl rounded-tl-xs border border-hairline-light dark:border-hairline-dark shadow-xs text-xs leading-relaxed font-medium">
                            <p className="whitespace-pre-line">{msg.message}</p>
                            {msg.image_url && (
                              <div className="mt-3 pt-2.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                                <div className="relative group inline-block rounded-xl overflow-hidden bg-black/80 p-1 border border-hairline-light dark:border-hairline-dark max-w-xs">
                                  <img src={msg.image_url} alt="Lampiran Dosen" className="max-h-44 w-auto object-contain rounded-lg" />
                                  <div
                                    onClick={() => setFullViewImageUrl(msg.image_url!)}
                                    className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-semibold cursor-pointer"
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
                          <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted dark:text-on-dark-muted font-semibold px-1">
                            <span>{msg.sender_name || 'Admin'}</span>
                            <span>•</span>
                            <span className="font-mono">{formatDate(msg.created_at)}</span>
                          </div>
                          <div className="bg-ink dark:bg-surface-dark-elevated text-on-ink dark:text-on-dark p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed text-left font-medium border border-transparent">
                            <p className="whitespace-pre-line">{msg.message}</p>
                            {msg.image_url && (
                              <div className="mt-3 pt-2.5 border-t border-white/20">
                                <div className="relative group inline-block rounded-xl overflow-hidden bg-black/80 p-1 border border-white/30 max-w-xs">
                                  <img src={msg.image_url} alt="Lampiran Admin" className="max-h-44 w-auto object-contain rounded-lg" />
                                  <div
                                    onClick={() => setFullViewImageUrl(msg.image_url!)}
                                    className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-semibold cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Perbesar</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold flex items-center justify-center text-xs shrink-0 border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs mt-4">
                          A
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatMessagesEndRef} />
                </div>

                {/* Form Kirim Balasan Langsung di Halaman */}
                <form onSubmit={handleSendReply} className="p-4 sm:p-5 border-t border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light dark:bg-surface-dark space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                      Tulis Balasan / Instruksi dari Admin:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ketik balasan untuk dosen pengirim..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-xl text-xs font-medium text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={markAsCompleted}
                        onChange={(e) => setMarkAsCompleted(e.target.checked)}
                        className="rounded border-hairline-light dark:border-hairline-dark text-accent focus:ring-accent cursor-pointer"
                      />
                      <span className="text-xs font-medium text-ink-heading dark:text-on-dark">
                        Tandai status sebagai <strong className="text-ink-heading dark:text-on-dark">&quot;Selesai&quot;</strong>
                      </span>
                    </label>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReply ? 'Mengirim...' : 'Kirim Balasan'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
                <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark rounded-2xl flex items-center justify-center mb-3 border border-hairline-light-soft dark:border-hairline-dark-soft shadow-xs">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-ink-heading dark:text-on-dark uppercase tracking-tight mb-1">
                  Pilih Pesan Masuk
                </h4>
                <p className="text-xs text-muted dark:text-on-dark-muted max-w-xs leading-relaxed">
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
              className="fixed inset-0 bg-ink/60 dark:bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh] z-10 overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xl p-4 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-hairline-light-soft dark:border-hairline-dark-soft px-2">
                <div className="flex items-center gap-2 text-ink-heading dark:text-on-dark text-xs font-bold">
                  <ImageIcon className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                  <span>Pratinjau Tangkapan Layar Kendala Dosen</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={fullViewImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark text-xs font-semibold border border-hairline-light dark:border-hairline-dark transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Tab Baru</span>
                  </a>
                  <button
                    onClick={() => setFullViewImageUrl(null)}
                    className="p-1.5 rounded-xl text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-auto p-2">
                <img
                  src={fullViewImageUrl}
                  alt="Gambar Kendala Dosen"
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-xs border border-hairline-light-soft dark:border-hairline-dark-soft"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
