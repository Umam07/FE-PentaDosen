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
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-20">
      
      {/* 1. COMPACT HEADER BANNER — horizontal strip with inline search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 dark:border-slate-800 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 px-5 py-4 sm:px-7 sm:py-5">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10">
              <HelpCircle className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-[8px] font-black text-primary-400 uppercase tracking-[0.2em] leading-none mb-0.5">Pusat Dukungan</p>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-none">Bantuan &amp; FAQ</h2>
            </div>
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden md:block h-8 w-px bg-white/10 shrink-0" />

          {/* Right: Search Bar — grows to fill remaining space */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
            <input
              type="text"
              placeholder="Cari panduan, kata kunci, atau pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all text-white placeholder-slate-500"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. UNIFIED CARD: Tabs on top + FAQ Accordions below */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {/* Tab Header — flush inside the card */}
        <div className="flex items-center gap-0 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800 px-4 py-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const theme = getCategoryTheme(cat);
            const IconComponent = theme.icon;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap mr-1 ${
                  isActive 
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-md' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                {cat}
                {isActive && (
                  <motion.div
                    layoutId="faq-active-tab"
                    className="absolute inset-0 rounded-xl border border-primary-200 dark:border-primary-800/40 pointer-events-none"
                  />
                )}
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
                className="h-16 w-full bg-slate-50 dark:bg-slate-800/40 rounded-2xl animate-pulse flex items-center px-5 justify-between"
              >
                <div className="flex items-center gap-3 w-2/3">
                  <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
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
                  className="rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 focus:outline-none group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.classes} transition-transform duration-300 group-hover:scale-105`}>
                        <ThemeIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {faq.question}
                      </span>
                    </div>
                    
                    <div className={`p-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all flex-shrink-0 ${isExpanded ? 'text-primary-600 dark:text-primary-400' : ''}`}>
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
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                <HelpCircle className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Panduan Tidak Ditemukan</h3>
              <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tidak ada panduan yang cocok. Silakan coba kata kunci atau kategori lain.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
