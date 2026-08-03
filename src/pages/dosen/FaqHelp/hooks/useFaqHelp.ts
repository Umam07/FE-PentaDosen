import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  MainTab, FaqItem, AnnouncementItem, SupportTicketItem,
  UserSession, PreviewDocState, ToastState
} from '../types/faqHelp.types';
import {
  fetchFaqsAndAnnouncements, fetchUserSupportTickets, createSupportTicket
} from '../services/faqHelpService';

export function useFaqHelp(user: UserSession) {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('panduan');

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  // State Tiket Support Dosen
  const [myTickets, setMyTickets] = useState<SupportTicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [readTicketIds, setReadTicketIds] = useState<number[]>([]);

  // State Modal Kirim Pesan ke Admin + Lampiran Gambar
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketImageFile, setTicketImageFile] = useState<File | null>(null);
  const [ticketImagePreview, setTicketImagePreview] = useState<string | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // State Modal Zoom/Preview Gambar
  const [fullViewImageUrl, setFullViewImageUrl] = useState<string | null>(null);

  // State Toast Notification
  const [toast, setToast] = useState<ToastState>({ message: null, type: 'success' });

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: null, type: 'success' }), 4000);
  }, []);

  const loadMyTickets = useCallback(async (isSilent = false) => {
    const targetUserId = user?.id ? Number(user.id) : 1;
    if (!isSilent) setLoadingTickets(true);
    try {
      const tickets = await fetchUserSupportTickets(targetUserId);
      setMyTickets(tickets);
    } catch (e) {
      console.error('Error fetching support tickets:', e);
    } finally {
      if (!isSilent) setLoadingTickets(false);
    }
  }, [user?.id]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { faqs: faqsData, announcements: annData } = await fetchFaqsAndAnnouncements();
        setFaqs(faqsData);
        setAnnouncements(annData);
      } catch (e) {
        console.error('Error fetching FAQ/Announcements data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
    loadMyTickets();
  }, [user, loadMyTickets]);

  // Polling interval & custom storage event listener untuk update real-time pesan dosen
  useEffect(() => {
    const handleUpdate = () => {
      loadMyTickets(true);
    };

    window.addEventListener('penta_tickets_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const intervalId = setInterval(() => {
      loadMyTickets(true);
    }, 3000);

    return () => {
      window.removeEventListener('penta_tickets_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(intervalId);
    };
  }, [loadMyTickets]);

  // Handle hash navigation (#kontak-support)
  useEffect(() => {
    if (window.location.hash === '#kontak-support') {
      setActiveMainTab('pesan');
      setIsTicketModalOpen(true);
    }
  }, []);

  // Hitung tiket yang membutuhkan perhatian (status Menunggu/Dibalas) dan belum ditandai terbaca
  const unreadTicketCount = useMemo(() => {
    return myTickets.filter(t => {
      const s = (t.status || '').toLowerCase().trim();
      const isNeedsAttention = s === 'dibalas' || s === 'replied' || s === 'menunggu' || s === 'pending';
      return isNeedsAttention && !readTicketIds.includes(t.id);
    }).length;
  }, [myTickets, readTicketIds]);

  const handleTabSwitch = useCallback((tab: MainTab) => {
    setActiveMainTab(tab);
    if (tab === 'pesan') {
      const ids = myTickets.map(t => t.id);
      setReadTicketIds(prev => Array.from(new Set([...prev, ...ids])));
    }
  }, [myTickets]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      return (
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [faqs, searchQuery]);

  const toggleExpandFaq = useCallback((id: number) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  }, []);

  const toggleTicketExpand = useCallback((id: number) => {
    setExpandedTicketId(prev => (prev === id ? null : id));
  }, []);

  const handleImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('File yang dipilih harus berupa gambar (JPG, PNG, WebP, GIF).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Ukuran gambar terlalu besar. Maksimal 10 MB.', 'error');
      return;
    }

    setTicketImageFile(file);
    setTicketImagePreview(URL.createObjectURL(file));
  }, [showToast]);

  const removeSelectedImage = useCallback(() => {
    setTicketImageFile(null);
    if (ticketImagePreview) {
      URL.revokeObjectURL(ticketImagePreview);
      setTicketImagePreview(null);
    }
  }, [ticketImagePreview]);

  const handleCreateTicket = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) {
      showToast('Isi pesan tidak boleh kosong.', 'error');
      return;
    }

    setSubmittingTicket(true);
    try {
      const formData = new FormData();
      formData.append('user_id', String(user?.id || 1));
      formData.append('subject', ticketSubject.trim());
      formData.append('message', ticketMessage.trim());
      if (ticketImageFile) {
        formData.append('image', ticketImageFile);
      }

      const res = await createSupportTicket(formData);

      if (res.ok) {
        showToast('Pesan Anda berhasil dikirim ke admin!', 'success');
        setTicketSubject('');
        setTicketMessage('');
        removeSelectedImage();
        setIsTicketModalOpen(false);
        await loadMyTickets();
      } else {
        showToast(res.data?.message || 'Gagal mengirim pesan.', 'error');
      }
    } catch (e) {
      console.error('Error submitting ticket:', e);
      showToast('Terjadi kesalahan koneksi saat mengirim pesan.', 'error');
    } finally {
      setSubmittingTicket(false);
    }
  }, [ticketSubject, ticketMessage, ticketImageFile, user?.id, showToast, removeSelectedImage, loadMyTickets]);

  return {
    activeMainTab,
    setActiveMainTab,
    faqs,
    announcements,
    loading,
    searchQuery,
    setSearchQuery,
    expandedFaqId,
    previewDoc,
    setPreviewDoc,
    myTickets,
    loadingTickets,
    expandedTicketId,
    unreadTicketCount,
    isTicketModalOpen,
    setIsTicketModalOpen,
    ticketSubject,
    setTicketSubject,
    ticketMessage,
    setTicketMessage,
    ticketImageFile,
    ticketImagePreview,
    submittingTicket,
    fullViewImageUrl,
    setFullViewImageUrl,
    toast,
    showToast,
    loadMyTickets,
    handleTabSwitch,
    filteredFaqs,
    toggleExpandFaq,
    toggleTicketExpand,
    handleImageFileChange,
    removeSelectedImage,
    handleCreateTicket,
  };
}
