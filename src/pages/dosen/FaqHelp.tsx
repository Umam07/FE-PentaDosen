import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Search, ChevronDown, BookOpen,
  Globe, Award, Zap, Info, FileText, X
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
  }, []);

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
      default:
        return { icon: Info, classes: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400' };
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-20">

      {/* 1. HEADER */}
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

      {/* 2. SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          placeholder="Cari panduan, kata kunci, atau pertanyaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium outline-none focus:border-primary-400 dark:focus:border-primary-700 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-950/40 transition-all text-slate-900 dark:text-white placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. ANNOUNCEMENTS */}
      <AnnouncementsBanner announcements={announcements} />

      {/* 4. TABS + FAQ ACCORDION */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat);
            const IconComponent = theme.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
                className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
                  isActive
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Accordion body */}
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
                  className={`rounded-xl border overflow-hidden transition-colors ${
                    isExpanded
                      ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                      : 'border-slate-150 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/20 hover:border-slate-250 dark:hover:border-slate-700'
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
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
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
          ) : (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                <HelpCircle className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Panduan Tidak Ditemukan</h3>
              <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tidak ada panduan yang cocok. Silakan coba kata kunci atau kategori lain.
              </p>
            </div>
          )}
        </div>
      </div>

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