import React, { useState } from 'react';
import { Plus, MessageSquare, Inbox } from 'lucide-react';
import type { MyTicketsListProps } from '../types/faqHelp.types';
import { sendTicketReply, updateUserTicketStatus } from '../services/faqHelpService';
import TicketSidebar from './TicketSidebar';
import TicketChatThread from './TicketChatThread';
import TicketComposer from './TicketComposer';

export default function MyTicketsList({
  loadingTickets,
  myTickets,
  selectedTicketId,
  user,
  onSelectTicket,
  onUpdateTicketStatus,
  onOpenCreateModal,
  onZoomImage,
  onRefreshTickets,
  showToast,
}: MyTicketsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'aktif' | 'selesai' | 'semua'>('aktif');

  // State balasan pesan
  const [replyText, setReplyText] = useState('');
  const [replyImageFile, setReplyImageFile] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // State mobile: apakah sedang membuka detail chat
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const currentSelectedId = selectedTicketId ?? (myTickets.length > 0 ? myTickets[0].id : null);
  const activeTicket = myTickets.find((t) => t.id === currentSelectedId) || null;

  const handleSelect = (ticketId: number) => {
    if (onSelectTicket) onSelectTicket(ticketId);
    setMobileChatOpen(true);
    setReplyText('');
    removeReplyImage();
  };

  const handleBackToList = () => {
    setMobileChatOpen(false);
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

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
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

      const res = await sendTicketReply(activeTicket.id, formData);
      if (res.ok) {
        setReplyText('');
        removeReplyImage();
        if (onRefreshTickets) onRefreshTickets();
      } else {
        if (showToast) showToast(res.data?.message || 'Gagal mengirim balasan pesan.', 'error');
      }
    } catch (err) {
      console.error('Error sending ticket reply:', err);
      if (showToast) showToast('Terjadi kesalahan saat mengirim balasan pesan.', 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdateStatusWrapper = async (ticketId: number, newStatus: string) => {
    if (onUpdateTicketStatus) {
      await onUpdateTicketStatus(ticketId, newStatus);
    } else {
      try {
        const res = await updateUserTicketStatus(ticketId, newStatus, user?.id);
        if (res.ok) {
          if (showToast) {
            showToast(
              newStatus === 'selesai' ? 'Tiket berhasil ditandai selesai.' : 'Tiket dibuka kembali.',
              'success'
            );
          }
          if (onRefreshTickets) onRefreshTickets();
        }
      } catch (e) {
        console.error('Error updating status:', e);
      }
    }
  };

  if (loadingTickets && myTickets.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center shadow-xs">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
          Memuat riwayat pesan &amp; konsultasi...
        </p>
      </div>
    );
  }

  if (myTickets.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center space-y-3 shadow-xs">
        <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted rounded-2xl flex items-center justify-center mx-auto mb-1 border border-hairline-light dark:border-hairline-dark">
          <Inbox className="w-7 h-7 opacity-60" />
        </div>
        <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark">
          Belum Ada Riwayat Pesan
        </h3>
        <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed">
          Punya kendala teknis atau pertanyaan seputar sinkronisasi data dan penghitungan poin KPI? Hubungi tim admin melalui tiket pesan.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenCreateModal}
            aria-label="Kirim Pesan Baru ke Admin"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-xs font-semibold transition-all shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim Pesan Baru</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark overflow-hidden shadow-xs flex flex-col sm:flex-row h-[580px] max-h-[85vh]">
      
      {/* Kolom Kiri: Sidebar List Tiket (Master ~280px) */}
      <div
        className={`w-full sm:w-[280px] md:w-[290px] shrink-0 h-full ${
          mobileChatOpen ? 'hidden sm:block' : 'block'
        }`}
      >
        <TicketSidebar
          tickets={myTickets}
          selectedTicketId={currentSelectedId}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onSelectTicket={handleSelect}
          onOpenCreateModal={onOpenCreateModal}
        />
      </div>

      {/* Kolom Kanan: Thread Percakapan & Composer (Detail) */}
      <div
        className={`flex-1 min-w-0 flex flex-col h-full ${
          !mobileChatOpen ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {activeTicket ? (
          <>
            <TicketChatThread
              ticket={activeTicket}
              user={user}
              onBackToList={handleBackToList}
              onZoomImage={onZoomImage}
              onUpdateStatus={handleUpdateStatusWrapper}
            />

            <TicketComposer
              replyText={replyText}
              replyImagePreview={replyImagePreview}
              replyImageFile={replyImageFile}
              submittingReply={submittingReply}
              onReplyTextChange={setReplyText}
              onImageChange={handleReplyImageChange}
              onRemoveImage={removeReplyImage}
              onSubmit={handleSendReply}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-light dark:bg-surface-dark">
            <div className="w-14 h-14 bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted rounded-2xl flex items-center justify-center mb-3 border border-hairline-light dark:border-hairline-dark shadow-xs">
              <MessageSquare className="w-7 h-7 opacity-60" />
            </div>
            <h3 className="text-sm font-bold text-ink-heading dark:text-on-dark mb-1">
              Pilih Tiket Percakapan
            </h3>
            <p className="text-xs text-muted dark:text-on-dark-muted max-w-xs leading-relaxed">
              Pilih salah satu tiket di sebelah kiri untuk melihat pesan atau mengirim tanggapan ke admin.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

