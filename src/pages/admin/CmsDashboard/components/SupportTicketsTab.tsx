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
    try {
      const res = await fetch(`/api/admin/support-tickets?role=${encodeURIComponent(user?.role || 'super admin')}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      } else {
        triggerMessage('Gagal mengambil daftar tiket pesan.', 'error');
      }
    } catch (e) {
      console.error('Error fetching admin support tickets:', e);
      triggerMessage('Terjadi kesalahan saat memuat data tiket.', 'error');
    } finally {
      setLoading(false);
    }
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
    try {
      const targetStatus = markAsCompleted ? 'selesai' : 'dibalas';
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
        setSelectedTicket(null);
        setReplyText('');
        fetchTickets();
      } else {
        const err = await res.json();
        triggerMessage(err.message || 'Gagal mengirim balasan pesan.', 'error');
      }
    } catch (e) {
      console.error('Error sending reply:', e);
      triggerMessage('Terjadi kesalahan saat mengirim balasan.', 'error');
    } finally {
      setSubmittingReply(false);
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        );
      case 'dibalas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Dibalas
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400 border border-slate-500/20">
            <CheckCircle2 className="w-3 h-3" />
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

                {/* Question Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    Subjek &amp; Isi Pesan Dosen:
                  </label>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedTicket.subject || 'Tanpa Subjek'}
                    </h5>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {selectedTicket.message}
                    </p>

                    {/* Lampiran Gambar Kendala Dosen (Tampilan Baru & Interaktif) */}
                    {selectedTicket.image_url && (
                      <div className="mt-3 pt-3.5 border-t border-slate-100 dark:border-zinc-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Lampiran Tangkapan Layar Kendala Dosen
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFullViewImageUrl(selectedTicket.image_url || null)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              <Maximize2 className="w-3 h-3" />
                              <span>Perbesar</span>
                            </button>
                            <a
                              href={selectedTicket.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Tab Baru</span>
                            </a>
                          </div>
                        </div>

                        {/* Visual Image Preview Box */}
                        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-700/80 bg-slate-950/90 dark:bg-zinc-950 flex items-center justify-center p-2 min-h-[160px] max-h-80 shadow-inner">
                          {!imageLoadError ? (
                            <>
                              <img
                                src={selectedTicket.image_url}
                                alt="Tangkapan Layar Kendala Dosen"
                                onError={() => setImageLoadError(true)}
                                className="max-h-72 w-auto max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                              />
                              <div 
                                onClick={() => setFullViewImageUrl(selectedTicket.image_url || null)}
                                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white cursor-pointer backdrop-blur-[1px]"
                              >
                                <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                                  <Eye className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                                  Klik untuk Memperbesar Gambar
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="p-6 text-center space-y-2 text-slate-400">
                              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">Gagal Memuat Pratinjau Gambar</p>
                              <a
                                href={selectedTicket.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary-400 underline font-semibold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Buka Gambar Secara Langsung</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Reply if any */}
                {selectedTicket.admin_reply && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Balasan Sebelumnya:
                    </label>
                    <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                      <p>{selectedTicket.admin_reply}</p>
                      {selectedTicket.replied_at && (
                        <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                          Dibalas pada: {new Date(selectedTicket.replied_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                      Tulis / Edit Balasan Admin:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tuliskan balasan atau solusi untuk dosen..."
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
                        disabled={submittingReply}
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
