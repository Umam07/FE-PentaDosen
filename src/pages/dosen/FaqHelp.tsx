import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Search, ChevronDown, BookOpen,
  Globe, Award, Zap, FileText, X, MessageSquare, 
  FileQuestion, Send, Clock, CheckCircle2, Inbox, CheckCircle, AlertCircle,
  Image as ImageIcon, Trash2, Maximize2, ExternalLink, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';
import AnnouncementsBanner from './dashboard/components/AnnouncementsBanner';

export default function FaqHelp({ user }: { user: any }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // State Tiket Support Dosen
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  // State Modal Kirim Pesan ke Admin + Lampiran Gambar (Maks 10MB)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketImageFile, setTicketImageFile] = useState<File | null>(null);
  const [ticketImagePreview, setTicketImagePreview] = useState<string | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // State Modal Zoom/Preview Gambar
  const [fullViewImageUrl, setFullViewImageUrl] = useState<string | null>(null);

  // State Notifikasi Toast Sederhana
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMyTickets = async () => {
    if (!user?.id) return;
    setLoadingTickets(true);
    try {
      const res = await fetch(`/api/support-tickets?user_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyTickets(data.tickets || []);
      }
    } catch (e) {
      console.error('Error fetching support tickets:', e);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsRes, annRes] = await Promise.all([
          fetch('/api/cms/faqs'),
          fetch('/api/dosen/announcements')
        ]);

        if (faqsRes.ok) {
          const data = await faqsRes.json();
          setFaqs(data.faqs || []);
        }

        if (annRes.ok) {
          const data = await annRes.json();
          setAnnouncements(data.announcements || []);
        }
      } catch (e) {
        console.error('Error fetching FAQ/Announcements data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchMyTickets();
  }, [user]);

  const categories = ['Semua', 'Umum', 'Google Scholar', 'Scopus', 'Upload KPI', 'Penelitian'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'Semua' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: number) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const toggleTicketExpand = (id: number) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Google Scholar':
        return { icon: BookOpen, classes: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400' };
      case 'Scopus':
        return { icon: Globe, classes: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' };
      case 'Upload KPI':
        return { icon: Award, classes: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' };
      case 'Penelitian':
        return { icon: Zap, classes: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400' };
      case 'Umum':
      default:
        return { icon: FileText, classes: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400' };
    }
  };

  const scrollToSupport = () => {
    const el = document.getElementById('kontak-support');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const removeSelectedImage = () => {
    setTicketImageFile(null);
    if (ticketImagePreview) {
      URL.revokeObjectURL(ticketImagePreview);
      setTicketImagePreview(null);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
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

      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        showToast('Pesan Anda berhasil dikirim ke admin!', 'success');
        setTicketSubject('');
        setTicketMessage('');
        removeSelectedImage();
        setIsTicketModalOpen(false);
        fetchMyTickets();
      } else {
        const err = await res.json();
        showToast(err.message || 'Gagal mengirim pesan.', 'error');
      }
    } catch (e) {
      console.error('Error submitting ticket:', e);
      showToast('Terjadi kesalahan koneksi saat mengirim pesan.', 'error');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        );
      case 'dibalas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Dibalas Admin
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400 border border-slate-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-20">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-[999] p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-bold ${
              toastType === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
            }`}
          >
            {toastType === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER (Full-width di dalam kontainer utama halaman) */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/40">
          <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest leading-none mb-1.5">
            Pusat Dukungan
          </p>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            Bantuan &amp; FAQ
          </h2>
        </div>
      </div>

      {/* SECTION KONTEN TERPUSAT (max-width: 850px) */}
      <div className="max-w-[850px] mx-auto space-y-6">

        {/* 2. SEARCH BAR */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder="Cari panduan, kata kunci, atau pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3. ANNOUNCEMENTS BANNER */}
        <AnnouncementsBanner announcements={announcements} />

        {/* 4. TABS + FAQ ACCORDION */}
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">

          {/* Tabs Kategori */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const theme = getCategoryTheme(cat);
              const IconComponent = theme.icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
                  className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
                    isActive
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50/30 dark:bg-primary-950/20'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Body Accordion FAQ */}
          <div className="p-4 sm:p-5 space-y-2.5">
            {loading ? (
              <phantom-ui loading={true} animation="shimmer" className="block space-y-2.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="h-16 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center px-5 justify-between"
                  >
                    <div className="flex items-center gap-3 w-2/3">
                      <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                    </div>
                    <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                ))}
              </phantom-ui>
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                const theme = getCategoryTheme(faq.category);
                const ThemeIcon = theme.icon;

                return (
                  <div
                    key={faq.id}
                    className={`rounded-xl border overflow-hidden transition-all ${
                      isExpanded
                        ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 focus:outline-none group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.classes}`}>
                          <ThemeIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {faq.question}
                        </span>
                      </div>

                      <ChevronDown className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-900 dark:text-white' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            <p className="pl-[52px]">{faq.answer}</p>
                            {faq.file_url && (
                              <div className="mt-4 pl-[52px]">
                                <button
                                  onClick={() => setPreviewDoc({
                                    fileUrl: faq.file_url,
                                    title: faq.question,
                                    category: faq.category
                                  })}
                                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                  <span>Lihat Panduan PDF</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : searchQuery ? (
              <div className="py-14 px-4 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-slate-700">
                  <HelpCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Panduan Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
                  Tidak ada panduan yang cocok dengan kata kunci &quot;<span className="font-semibold text-slate-700 dark:text-slate-300">{searchQuery}</span>&quot;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Bersihkan Pencarian</span>
                </button>
              </div>
            ) : (
              <div className="py-14 px-4 text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-slate-700">
                  <FileQuestion className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Belum ada panduan untuk kategori ini
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
                  Panduan untuk kategori &quot;<span className="font-semibold text-slate-700 dark:text-slate-300">{activeCategory}</span>&quot; sedang disiapkan oleh administrator.
                </p>
                <button
                  onClick={scrollToSupport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                  <span>Kirim Pesan ke Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 5. CARD "PESAN KE ADMIN" */}
        <div id="kontak-support" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Punya Pertanyaan Lain?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kirim pesan beserta screenshot kendala Anda (maks 10MB), tim admin akan segera membalasnya.
            </p>
          </div>

          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Pesan</span>
          </button>
        </div>

        {/* 6. SECTION "RIWAYAT PESAN SAYA" */}
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Riwayat Pesan Saya</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {myTickets.length} Tiket
            </span>
          </div>

          {loadingTickets ? (
            <div className="py-8 text-center text-xs font-medium text-slate-400">
              Memuat riwayat pesan...
            </div>
          ) : myTickets.length > 0 ? (
            <div className="space-y-3">
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
                      onClick={() => toggleTicketExpand(ticket.id)}
                      className="w-full p-4 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {getTicketStatusBadge(ticket.status)}
                          {ticket.image_url && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                              <ImageIcon className="w-3 h-3 text-indigo-500" />
                              Gambar
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
                            {/* Full Question Text */}
                            <div className="space-y-2 bg-slate-100/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Isi Pesan Anda:
                              </p>
                              <p className="text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line">
                                {ticket.message}
                              </p>

                              {/* Preview Lampiran Gambar Dosen jika ada */}
                              {ticket.image_url && (
                                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <ImageIcon className="w-3.5 h-3.5" />
                                      Lampiran Tangkapan Layar:
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
                                      onClick={() => setFullViewImageUrl(ticket.image_url)}
                                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer"
                                    >
                                      <Maximize2 className="w-4 h-4" />
                                      <span>Perbesar Gambar</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Admin Reply Box */}
                            {ticket.admin_reply ? (
                              <div className="space-y-1 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50">
                                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                  <span>Balasan Tim Admin:</span>
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
                            ) : (
                              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 shrink-0" />
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
            <div className="py-10 text-center">
              <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Pesan yang Dikirim</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Pesan atau pertanyaan yang Anda kirim ke admin akan muncul di sini.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL FORM KIRIM PESAN KE ADMIN + LAMPIRAN GAMBAR */}
      <AnimatePresence>
        {isTicketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!submittingTicket) setIsTicketModalOpen(false); }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6 space-y-4 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kirim Pesan ke Admin</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Sampaikan kendala atau pertanyaan Anda
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4 overflow-y-auto flex-1 pr-1">
                {/* Input Subjek */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subjek Pesan <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kendala Upload PDF (opsional)"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                {/* Textarea Pesan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Isi Pesan / Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan pertanyaan atau kendala Anda secara detail..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                    className="w-full p-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 leading-relaxed"
                  />
                </div>

                {/* Upload Gambar Tangkapan Layar (Maks 10MB) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                      Lampirkan Gambar Kendala <span className="text-slate-400 font-normal">(Opsional)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Maks 10 MB</span>
                  </label>

                  {ticketImagePreview ? (
                    <div className="relative group rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ticketImagePreview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="min-w-0 text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {ticketImageFile?.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {ticketImageFile ? (ticketImageFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                        title="Hapus gambar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl p-4 cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 transition-colors group">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-xs font-semibold">Klik untuk memilih gambar / screenshot</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Format disukai: PNG, JPG, JPEG, WebP (Maks 10 MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={submittingTicket}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingTicket ? 'Mengirim...' : 'Kirim Pesan'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL ZOOM / PREVIEW GAMBAR FULL */}
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
                  <span>Pratinjau Tangkapan Layar Kendala</span>
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
                  alt="Full View Attachment"
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-md border border-slate-800"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />
    </div>
  );
}