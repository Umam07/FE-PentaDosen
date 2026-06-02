import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, 
  Globe, Award, FileText, Zap, Info 
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

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Google Scholar': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Scopus': return <Globe className="w-4 h-4 text-orange-500" />;
      case 'Upload KPI': return <Award className="w-4 h-4 text-emerald-500" />;
      case 'Penelitian': return <Zap className="w-4 h-4 text-indigo-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-r from-primary-600 to-indigo-700 rounded-[2.5rem] text-white shadow-xl shadow-primary-500/10 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Pusat Bantuan & Panduan</h2>
              <p className="text-xs font-bold opacity-80 mt-1">Temukan jawaban atas pertanyaan umum seputar integrasi Scholar, Scopus, dan perhitungan KPI.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 blur-xl" />
      </motion.div>

      {/* Search Input */}
      <div className="flex justify-center max-w-2xl mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari panduan atau pertanyaan di sini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/10 transition-all text-gray-900 dark:text-zinc-100 shadow-sm"
          />
        </div>
      </div>

      {/* Tabs Categories */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-gray-100 dark:border-zinc-800/80 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setExpandedFaqId(null); }}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/20'
                : 'bg-white dark:bg-zinc-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 border border-gray-100 dark:border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Lists */}
      <div className="max-w-3xl mx-auto space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-16 bg-white dark:bg-zinc-900 rounded-2xl animate-pulse" />)
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <motion.div
                key={faq.id}
                layout
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-zinc-800/50 rounded-xl shrink-0">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 dark:border-zinc-800/50 text-xs sm:text-sm font-bold text-gray-500 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
            Tidak ada panduan bantuan yang sesuai pencarian atau kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
