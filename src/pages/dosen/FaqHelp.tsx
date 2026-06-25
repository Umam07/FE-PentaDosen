import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, ChevronDown, BookOpen, 
  Globe, Award, Zap, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqHelp({ user }: { user: any }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/cms/faqs');
        if (res.ok) {
          const data = await res.json();
          setFaqs(data.faqs || []);
        }
      } catch (e) {
        console.error('Error fetching FAQs:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
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
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-8 pb-20">
      
      {/* 1. PREMIUM COMPACT HEADER BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-6 sm:px-8 sm:py-7 dark:border-slate-800 shadow-sm"
      >
        {/* Soft glowing decorations */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner text-white">
              <HelpCircle className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <span className="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] leading-none">Pusat Dukungan</span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-0.5">Bantuan & FAQ</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Temukan jawaban atas pertanyaan umum seputar integrasi Scholar, Scopus, perhitungan poin, dan tata cara verifikasi dokumen kinerja.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. SEARCH BAR & FILTERS SECTION */}
      <div className="space-y-6">
        {/* Sleek Search Bar */}
        <div className="flex justify-center max-w-2xl mx-auto w-full">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari panduan, kata kunci, atau pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 dark:focus:border-primary-500/30 transition-all text-slate-900 dark:text-white shadow-sm"
            />
          </div>
        </div>

        {/* Elegant Pills Categories (LecturerDashboard style) */}
        <div className="flex justify-center w-full">
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => {
              const theme = getCategoryTheme(cat);
              const IconComponent = theme.icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                    isActive 
                      ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-xl shadow-primary-500/10' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. FAQ LISTS ACCORDIONS */}
      <div className="max-w-3xl mx-auto space-y-4">
        {loading ? (
          /* Premium skeletons */
          [1, 2, 3].map(i => (
            <div 
              key={i} 
              className="h-16 w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 animate-pulse flex items-center px-6 justify-between"
            >
              <div className="flex items-center gap-3 w-2/3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
              </div>
              <div className="h-5 w-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
          ))
        ) : filteredFaqs.length > 0 ? (
          /* Actual FAQs */
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const theme = getCategoryTheme(faq.category);
            const ThemeIcon = theme.icon;

            return (
              <motion.div
                key={faq.id}
                layout="position"
                className="bg-white dark:bg-slate-900/40 rounded-[1.75rem] border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.classes} transition-transform duration-300 group-hover:scale-105 shadow-sm`}>
                      <ThemeIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate pr-2">
                      {faq.question}
                    </span>
                  </div>
                  
                  <div className={`p-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all ${isExpanded ? 'rotate-180 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400' : ''}`}>
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
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
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100/50 dark:border-slate-800/30 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        <p className="pl-14">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm max-w-xl mx-auto"
          >
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100 dark:border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Panduan Tidak Ditemukan</h3>
            <p className="text-xs font-bold text-slate-400 max-w-xs mx-auto leading-relaxed">
              Tidak ada panduan bantuan yang cocok dengan pencarian atau kategori ini. Silakan coba kata kunci lain.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
