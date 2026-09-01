import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  MainTab, FaqItem, AnnouncementItem, SupportTicketItem,
  UserSession, PreviewDocState, ToastState
} from '../types/faqHelp.types';
import {
  fetchFaqsAndAnnouncements, fetchUserSupportTickets, createSupportTicket, updateUserTicketStatus
} from '../services/faqHelpService';

export const DEFAULT_CURATED_FAQS: FaqItem[] = [
  {
    id: 101,
    question: 'Bagaimana cara menghubungkan dan sinkronisasi SINTA Author ID?',
    answer: 'Untuk menghubungkan akun SINTA:\n1. Buka menu Sinkronisasi pada sidebar atau navigasi profil.\n2. Masukkan SINTA Author ID Anda pada kolom yang disediakan.\n3. Klik tombol "Cek SINTA" untuk memverifikasi data profil dan afiliasi universitas.\n4. Setelah data terverifikasi sesuai, klik "Simpan & Sinkronkan" untuk menarik publikasi dan sitasi secara otomatis.',
    category: 'Integrasi SINTA & Scopus',
  },
  {
    id: 102,
    question: 'Bagaimana cara menghubungkan Scopus ID dan verifikasi dokumen Quartile (Q1–Q4)?',
    answer: 'PentaDosen otomatis menghitung Quartile Scopus berdasarkan metadata resmi:\n1. Pastikan Scopus Author ID Anda sudah tersimpan di profil.\n2. Sistem akan menyinkronkan daftar artikel jurnal bereputasi internasional.\n3. Nilai bobot Quartile (Q1: 40 poin, Q2: 30 poin, Q3: 20 poin, Q4: 10 poin) akan otomatis dihitung ke dalam capaian KPI Tri Dharma.',
    category: 'Integrasi SINTA & Scopus',
  },
  {
    id: 103,
    question: 'Bagaimana aturan dan formula perhitungan bobot poin KPI Tri Dharma?',
    answer: 'Perhitungan skor didasarkan pada matriks bobot resmi universitas:\n• Jurnal Internasional Bereputasi (Scopus Q1: 40 poin, Q2: 30 poin, Q3: 20 poin, Q4: 10 poin)\n• Jurnal Nasional Terakreditasi (SINTA 1–2: 25 poin, SINTA 3–4: 20 poin, SINTA 5–6: 15 poin)\n• Buku Ajar / Monograf Ber-ISBN: 20–40 poin\n• Hak Kekayaan Intelektual (Paten / Hak Cipta bersertifikat): 15–40 poin\n• Penelitian & Pengabdian Masyarakat: Berdasarkan skema pendanaan internal/eksternal.',
    category: 'Poin KPI & Skor',
  },
  {
    id: 104,
    question: 'Bagaimana cara mengunggah dokumen Buku, Penelitian, atau HKI baru?',
    answer: '1. Masuk ke menu dokumen yang sesuai (Buku / Penelitian / HKI) di navigasi sidebar.\n2. Klik tombol "Tambah Dokumen / Upload Berkas".\n3. Lengkapi formulir metadata (Judul, No. ISBN / No. Permohonan HKI, Tahun, dan Penulis Anggota).\n4. Lampirkan berkas bukti dokumen dalam format PDF (maksimal 10 MB).\n5. Simpan berkas. Dokumen akan berstatus "Menunggu Verifikasi" hingga divalidasi oleh verifikator LPPM.',
    category: 'Dokumen & Tri Dharma',
  },
  {
    id: 105,
    question: 'Berapa lama proses validasi dokumen penelitian dan publikasi oleh admin LPPM?',
    answer: 'Proses verifikasi dokumen umumnya membutuhkan waktu 1–3 hari kerja. Anda dapat memantau status validasi (Disetujui / Perlu Revisi / Ditolak) secara langsung di halaman dokumen masing-masing atau melalui notifikasi dashboard.',
    category: 'Dokumen & Tri Dharma',
  },
  {
    id: 106,
    question: 'Bagaimana jika terdapat kendala login SSO atau lupa kata sandi akun?',
    answer: 'PentaDosen terintegrasi dengan Single Sign-On (SSO) LDAP Universitas. Jika Anda mengalami kendala login:\n• Pastikan format username/email dan kata sandi sesuai dengan akun SSO YARSI Anda.\n• Jika lupa kata sandi SSO, silakan hubungi tim Pusat Data dan Informasi (Pusdatin) atau kirim tiket bantuan ke helpdesk LPPM.',
    category: 'Akun & Akses',
  },
];

export function useFaqHelp(user: UserSession) {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('panduan');

  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  // State Tiket Support Dosen
  const [myTickets, setMyTickets] = useState<SupportTicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
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
      // Auto-pilih tiket pertama jika belum ada tiket terpilih
      setSelectedTicketId(prev => {
        if (prev && tickets.some(t => t.id === prev)) return prev;
        return tickets.length > 0 ? tickets[0].id : null;
      });
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
        setFaqs(faqsData && faqsData.length > 0 ? faqsData : DEFAULT_CURATED_FAQS);
        setAnnouncements(annData);
      } catch (e) {
        console.error('Error fetching FAQ/Announcements data:', e);
        setFaqs(DEFAULT_CURATED_FAQS);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
    loadMyTickets();
  }, [user, loadMyTickets]);

  // Polling pintar & event listener: hanya polling saat tab "Pesan Saya" aktif dan browser terlihat
  useEffect(() => {
    // 1. Event listener lokal untuk instant update saat user kirim/balas pesan
    const handleLocalUpdate = () => {
      loadMyTickets(true);
    };

    window.addEventListener('penta_tickets_updated', handleLocalUpdate);

    // Jika tab bukan 'pesan', jangan jalankan polling sama sekali
    if (activeMainTab !== 'pesan') {
      return () => {
        window.removeEventListener('penta_tickets_updated', handleLocalUpdate);
      };
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let consecutiveErrors = 0;

    const performSmartPoll = async () => {
      // Jangan fetch jika browser tab sedang diminimize / di background
      if (document.visibilityState === 'hidden') {
        return;
      }

      try {
        await loadMyTickets(true);
        consecutiveErrors = 0;
      } catch {
        consecutiveErrors += 1;
        // Jika error berturut-turut > 3 kali (backend mati/offline), jeda lebih lama
        if (consecutiveErrors >= 3 && intervalId) {
          clearInterval(intervalId);
          intervalId = setInterval(performSmartPoll, 45000); // perlambat ke 45s
        }
      }
    };

    // Set polling default setiap 15 detik (cukup responsif & hemat resource)
    intervalId = setInterval(performSmartPoll, 15000);

    // Saat user kembali ke tab browser (visibility change), langsung fetch 1x
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeMainTab === 'pesan') {
        performSmartPoll();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('penta_tickets_updated', handleLocalUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeMainTab, loadMyTickets]);

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

  const getFaqCategoryKey = useCallback((faq: FaqItem): string => {
    const rawCat = (faq.category || '').toLowerCase().trim();
    if (rawCat.includes('sinta') || rawCat.includes('scopus') || rawCat.includes('integrasi') || rawCat.includes('scholar') || rawCat.includes('sync')) {
      return 'integrasi';
    }
    if (rawCat.includes('poin') || rawCat.includes('kpi') || rawCat.includes('bobot') || rawCat.includes('skor') || rawCat.includes('hitung')) {
      return 'poin';
    }
    if (rawCat.includes('dokumen') || rawCat.includes('buku') || rawCat.includes('penelitian') || rawCat.includes('hki') || rawCat.includes('publikasi') || rawCat.includes('upload')) {
      return 'dokumen';
    }
    if (rawCat.includes('akun') || rawCat.includes('password') || rawCat.includes('login') || rawCat.includes('profil') || rawCat.includes('email')) {
      return 'akun';
    }

    // Fallback analyze question & answer text
    const text = `${faq.question} ${faq.answer}`.toLowerCase();
    if (text.includes('sinta') || text.includes('scopus') || text.includes('scholar') || text.includes('sinkron')) {
      return 'integrasi';
    }
    if (text.includes('poin') || text.includes('kpi') || text.includes('bobot') || text.includes('skor') || text.includes('perhitungan')) {
      return 'poin';
    }
    if (text.includes('buku') || text.includes('penelitian') || text.includes('hki') || text.includes('publikasi') || text.includes('jurnal') || text.includes('upload') || text.includes('dokumen')) {
      return 'dokumen';
    }
    if (text.includes('akun') || text.includes('password') || text.includes('login') || text.includes('profil') || text.includes('kata sandi')) {
      return 'akun';
    }

    return 'umum';
  }, []);

  const categories = useMemo(() => {
    const list = [
      { id: 'semua', name: 'Semua Panduan' },
      { id: 'integrasi', name: 'Integrasi SINTA & Scopus' },
      { id: 'poin', name: 'Poin KPI & Skor' },
      { id: 'dokumen', name: 'Dokumen & Tri Dharma' },
      { id: 'akun', name: 'Akun & Akses' },
    ];

    return list.map(c => {
      if (c.id === 'semua') {
        return { ...c, count: faqs.length };
      }
      const count = faqs.filter(f => getFaqCategoryKey(f) === c.id).length;
      return { ...c, count };
    });
  }, [faqs, getFaqCategoryKey]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.category || '').toLowerCase().includes(q)
      );

      if (!matchesSearch) return false;

      if (selectedCategory === 'semua') return true;
      return getFaqCategoryKey(faq) === selectedCategory;
    });
  }, [faqs, searchQuery, selectedCategory, getFaqCategoryKey]);

  const toggleExpandFaq = useCallback((id: number) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  }, []);

  const toggleTicketExpand = useCallback((id: number) => {
    setExpandedTicketId(prev => (prev === id ? null : id));
    setSelectedTicketId(id);
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
        if (res.data?.ticket?.id) {
          setSelectedTicketId(res.data.ticket.id);
        }
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

  const handleUpdateTicketStatus = useCallback(async (ticketId: number, status: string) => {
    try {
      const res = await updateUserTicketStatus(ticketId, status, user?.id);
      if (res.ok) {
        showToast(
          status === 'selesai' ? 'Tiket berhasil ditandai selesai.' : 'Tiket dibuka kembali.',
          'success'
        );
        await loadMyTickets(true);
      } else {
        showToast('Gagal memperbarui status tiket.', 'error');
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      showToast('Terjadi kesalahan saat memperbarui status tiket.', 'error');
    }
  }, [user?.id, showToast, loadMyTickets]);

  return {
    activeMainTab,
    setActiveMainTab,
    faqs,
    announcements,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    expandedFaqId,
    previewDoc,
    setPreviewDoc,
    myTickets,
    loadingTickets,
    expandedTicketId,
    selectedTicketId,
    setSelectedTicketId,
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
    handleUpdateTicketStatus,
  };
}
