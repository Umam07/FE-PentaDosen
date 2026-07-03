import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, ChevronDown, BookOpen, 
  Globe, Award, Zap, Info, FileText, Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';

const AnnouncementCard: React.FC<{ ann: any }> = ({ ann }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongContent = ann.content.length > 180;
  
  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-xl border border-amber-250 dark:border-amber-900/35 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-300 dark:hover:border-amber-900/50 transition-all duration-200 p-5 pl-7"
    >
      {/* Left accent indicator line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 dark:bg-amber-600 rounded-r-full" />

      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-amber-100/70 dark:bg-amber-950/30 border border-amber-200/30 dark:border-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 shadow-sm">
          <Megaphone className="w-4 h-4" />
        </div>
        
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200/30 dark:border-amber-900/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              PENGUMUMAN
            </span>
            {ann.created_at && (
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Diterbitkan: {new Date(ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
            {ann.title}
          </h4>
          
          <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
            {isLongContent && !isExpanded ? (
              <>
                {ann.content.slice(0, 180)}...
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Selengkapnya
                </button>
              </>
            ) : (
              <>
                {ann.content}
                {isLongContent && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="block mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Sembunyikan
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
        return {
          icon: BookOpen,
          classes: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
        };
      case 'Scopus': 
        return {
          icon: Globe,
          classes: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
        };
      case 'Upload KPI': 
        return {
          icon: Award,
          classes: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
        };
      case 'Penelitian': 
        return {
          icon: Zap,
          classes: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400'
        };
      default: 
        return {
          icon: Info,
          classes: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400'
        };
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-20">
      
      {/* 1. COMPACT HEADER BANNER — title only, no search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 shadow-sm"
      >
        <div className="relative z-10 flex items-center gap-4 px-5 py-4 sm:px-7">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 dark:border-slate-800">
            <HelpCircle className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest leading-none mb-1">Pusat Dukungan</p>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white leading-none">Bantuan &amp; FAQ</h2>
          </div>
        </div>
      </motion.div>

      {/* 2. STANDALONE SEARCH BAR — high contrast, fully visible */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="relative group"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
        <input
          type="text"
          placeholder="Cari panduan, kata kunci, atau pertanyaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-sm font-medium outline-none focus:border-slate-400 dark:focus:border-slate-700 transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="text-xs font-black">✕</span>
          </button>
        )}
      </motion.div>

      {/* 3. ANNOUNCEMENTS SECTION */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-2">
            <Megaphone className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-400">
              Pengumuman Terbaru ({announcements.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        </motion.div>
      )}

      {/* 4. UNIFIED CARD: Tabs on top + FAQ Accordions below */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Tab Header — flush inside the card */}
        <div className="flex border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat);
            const IconComponent = theme.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
                className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer select-none ${
                  isActive 
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion Body */}
        <div className="p-4 sm:p-6 space-y-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div 
                key={i} 
                className="h-16 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse flex items-center px-5 justify-between"
              >
                <div className="flex items-center gap-3 w-2/3">
                  <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                </div>
                <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            ))
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              const theme = getCategoryTheme(faq.category);
              const ThemeIcon = theme.icon;

              return (
                <motion.div
                  key={faq.id}
                  layout="position"
                  className="rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 focus:outline-none group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.classes} transition-transform duration-300 group-hover:scale-105`}>
                        <ThemeIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    
                    <div className={`p-1 rounded-md text-slate-400 group-hover:text-slate-650 dark:group-hover:text-slate-300 transition-all flex-shrink-0 ${isExpanded ? 'text-slate-900 dark:text-white' : ''}`}>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                          <p className="pl-[52px]">{faq.answer}</p>
                          {faq.file_url && (
                            <div className="mt-4 pl-[52px]">
                              <button
                                onClick={() => setPreviewDoc({
                                  fileUrl: faq.file_url,
                                  title: faq.question,
                                  category: faq.category
                                })}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
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
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                <HelpCircle className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Panduan Tidak Ditemukan</h3>
              <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tidak ada panduan yang cocok. Silakan coba kata kunci atau kategori lain.
              </p>
            </motion.div>
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
