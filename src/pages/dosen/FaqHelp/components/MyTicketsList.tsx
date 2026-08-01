import React from 'react';
import {
  Inbox, Plus, ChevronDown, Clock, MessageSquare, CheckCircle2,
  Image as ImageIcon, ExternalLink, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MyTicketsListProps } from '../types/faqHelp.types';

export default function MyTicketsList({
  loadingTickets,
  myTickets,
  expandedTicketId,
  onToggleTicketExpand,
  onOpenCreateModal,
  onZoomImage,
}: MyTicketsListProps) {
  const getTicketStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    switch (s) {
      case 'menunggu':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Menunggu
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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
      
      {/* Header Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40 shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Riwayat Pesan Saya
              </h3>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {myTickets.length} Tiket
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Konsultasi &amp; bantuan teknis yang dikirimkan ke administrator
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

      {/* Body Daftar Pesan */}
      {loadingTickets ? (
        <div className="py-12 text-center text-xs font-medium text-slate-400">
          Memuat riwayat pesan...
        </div>
      ) : myTickets.length > 0 ? (
        <div className="space-y-3 pt-1">
          {myTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
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
                      {ticket.image_url && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          <ImageIcon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>Gambar</span>
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ticket.subject || 'Tanpa Subjek'}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate pl-0.5">
                      {ticket.message}
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
                      <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/50 space-y-3 text-xs leading-relaxed">
                        {/* Isi Pesan User */}
                        <div className="space-y-2 bg-slate-100/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Isi Pesan Anda:
                          </p>
                          <p className="text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line">
                            {ticket.message}
                          </p>

                          {/* Preview Lampiran Gambar Dosen */}
                          {ticket.image_url && (
                            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                  Lampiran Gambar:
                                </p>
                                <a
                                  href={ticket.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Buka di Tab Baru</span>
                                </a>
                              </div>
                              <div className="relative group inline-block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950/90 max-w-sm p-1.5">
                                <img
                                  src={ticket.image_url}
                                  alt="Lampiran Dosen"
                                  className="max-h-48 w-auto object-contain rounded-lg mx-auto"
                                />
                                <div
                                  onClick={() => onZoomImage(ticket.image_url!)}
                                  className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                  <span>Perbesar Gambar</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Balasan Tim Admin */}
                        {ticket.admin_reply ? (
                          <div className="space-y-1.5 bg-blue-50/70 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50">
                            <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">
                              <span className="flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Balasan Tim Admin:
                              </span>
                              {ticket.replied_at && (
                                <span>
                                  {new Date(ticket.replied_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-800 dark:text-slate-100 font-medium whitespace-pre-line">
                              {ticket.admin_reply}
                            </p>
                          </div>
                        ) : ticket.status === 'selesai' ? (
                          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Tiket pesan ini telah ditandai selesai.</span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <span>Pesan Anda telah diterima. Mohon tunggu balasan dari tim admin.</span>
                          </div>
                        )}
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
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Pesan yang Dikirim</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mb-4 leading-relaxed">
            Pesan atau pertanyaan yang Anda kirim ke admin akan muncul di sini.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Pesan Pertama</span>
          </button>
        </div>
      )}
    </div>
  );
}
