import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Zap, ShieldCheck, Book, TrendingUp, Calendar, ExternalLink, Search, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { ProfileTrendChart } from './ProfileCharts';

// === Sub-component: Scholar row with per-doc points + breakdown ===
function ScholarDocRow({ doc, docPoints, isAlsoScopus, idx }: {
  doc: any; docPoints: number; isAlsoScopus: boolean; idx: number; normalizeTitle?: (t: string) => string;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex items-start gap-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors flex-shrink-0">
        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{doc.citations || 0}</span>
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md text-[7px] font-black uppercase tracking-widest">Scholar</span>
          {isAlsoScopus && (
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">Juga di Scopus</span>
          )}
          <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {doc.year || 'Unknown'}
          </span>
        </div>
        <a
          href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors block line-clamp-2 mb-3"
        >
          {doc.title}
        </a>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
            +{docPoints.toFixed(1)} PTS
          </span>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all uppercase tracking-widest"
          >
            {showBreakdown ? '↑ Sembunyikan' : '? Rincian'}
          </button>
        </div>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1.5"
          >
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Rincian Perhitungan Poin:</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Dokumen (×1)</span>
              <span className="text-[10px] font-black text-blue-600">+0.5 pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Sitasi (×{doc.citations || 0} × 0.1)</span>
              <span className="text-[10px] font-black text-blue-600">+{((doc.citations || 0) * 0.1).toFixed(1)} pts</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase">Total</span>
              <span className="text-[10px] font-black text-blue-700 dark:text-blue-400">= {docPoints.toFixed(1)} pts</span>
            </div>
          </motion.div>
        )}
      </div>
      <a
        href={doc.link || '#'}
        target="_blank"
        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white transition-all flex-shrink-0"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

// === Sub-component: Scopus row — 40 pts per doc + 1 pt per citation ===
function ScopusDocRow({ doc, isAlsoScholar, idx }: {
  doc: any; isAlsoScholar: boolean; idx: number;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const docPoints = 40 + (doc.citations || 0) * 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex items-start gap-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors flex-shrink-0">
        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{doc.citations || 0}</span>
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-md text-[7px] font-black uppercase tracking-widest">Scopus</span>
          {isAlsoScholar && (
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">Juga di Scholar</span>
          )}
          <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {doc.year || 'Unknown'}
          </span>
        </div>
        <a
          href={doc.link || `https://www.scopus.com/results/results.uri?s=TITLE(%22${encodeURIComponent(doc.title)}%22)`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug hover:text-primary-600 dark:hover:text-primary-400 transition-colors block line-clamp-2 mb-3"
        >
          {doc.title}
        </a>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
            +{docPoints} PTS
          </span>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black text-slate-500 hover:text-orange-600 hover:border-orange-300 transition-all uppercase tracking-widest"
          >
            {showBreakdown ? '↑ Sembunyikan' : '? Rincian'}
          </button>
        </div>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1.5"
          >
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Rincian Perhitungan Poin:</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Jurnal/Dokumen (×1)</span>
              <span className="text-[10px] font-black text-orange-600">+40 pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Sitasi (×{doc.citations || 0} × 1)</span>
              <span className="text-[10px] font-black text-orange-600">+{(doc.citations || 0)} pts</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase">Total</span>
              <span className="text-[10px] font-black text-orange-700 dark:text-orange-400">= {docPoints} pts</span>
            </div>
          </motion.div>
        )}
      </div>
      <a
        href={doc.link || '#'}
        target="_blank"
        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary-500 hover:text-white transition-all flex-shrink-0"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

// === Sub-component: Cross-Indexed row — use Scopus points (40 + citations) ===
function CrossIndexedDocRow({ doc, scopusDoc, idx }: {
  doc: any; scopusDoc: any | undefined; idx: number;
}) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  const citations = (scopusDoc?.citations ?? doc.citations) || 0;
  const docPoints = 40 + citations;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group flex items-start gap-6 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-emerald-100 dark:border-slate-700 flex-shrink-0">
        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{citations}</span>
        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">Sitasi</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">Scopus & Scholar</span>
          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-orange-500/20">Poin Scopus (Lebih Besar)</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {doc.year || 'Unknown'}
          </span>
        </div>
        <a
          href={doc.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(doc.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block line-clamp-2 mb-3"
        >
          {doc.title}
        </a>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
            +{docPoints} PTS
          </span>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-all uppercase tracking-widest"
          >
            {showBreakdown ? '↑ Sembunyikan' : '? Rincian'}
          </button>
        </div>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1.5"
          >
            <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Rincian Poin Scopus (diambil karena lebih besar):</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Jurnal/Dokumen (×1)</span>
              <span className="text-[10px] font-black text-emerald-600">+40 pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Sitasi Scopus (×{citations} × 1)</span>
              <span className="text-[10px] font-black text-emerald-600">+{citations} pts</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase">Total</span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">= {docPoints} pts</span>
            </div>
          </motion.div>
        )}
      </div>
      <a
        href={doc.link || '#'}
        target="_blank"
        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all flex-shrink-0"
      >
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
}


interface PentaInsightProps {
  insightsSubTab: 'publikasi' | 'penelitian' | 'hki' | 'buku';
  setInsightsSubTab: (tab: 'publikasi' | 'penelitian' | 'hki' | 'buku') => void;
  publicationSubTab: 'scopus' | 'scholar' | 'cross_indexed';
  setPublicationSubTab: (tab: 'scopus' | 'scholar' | 'cross_indexed') => void;
  scopusChartData: any;
  scholarChartData: any;
  scopusData: any;
  scholarData: any;
  publications: any[];
  scopusPublications: any[];
  internalDocuments: any[];
  tabVariants: any;
}

export default function PentaInsight({
  insightsSubTab,
  setInsightsSubTab,
  publicationSubTab,
  setPublicationSubTab,
  scopusChartData,
  scholarChartData,
  scopusData,
  scholarData,
  publications,
  scopusPublications,
  internalDocuments,
  tabVariants
}: PentaInsightProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilter3Years, setIsFilter3Years] = useState(false);

  // Reset page when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [insightsSubTab, publicationSubTab, isFilter3Years]);

  const getCategorizedDocs = (categoryKeywords: string[]) => {
    return internalDocuments.filter(d => 
      categoryKeywords.some(k => d.category?.toLowerCase().includes(k))
    );
  };

  const rawResearchDocs = getCategorizedDocs(['penelitian', 'proposal', 'laporan']);
  const hkiDocs = getCategorizedDocs(['hki', 'kekayaan intelektual']);
  const bookDocs = getCategorizedDocs(['buku', 'ajar']);

  const currentYear = new Date().getFullYear();
  const threeYearsAgo = currentYear - 2;

  const researchDocs = isFilter3Years
    ? rawResearchDocs.filter(doc => {
        const year = doc.published_at ? new Date(doc.published_at).getFullYear() : Number(doc.tahun_pelaksanaan || currentYear);
        return year >= threeYearsAgo;
      })
    : rawResearchDocs;

  const normalizeTitle = (title: string) => {
    return title?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  };

  const baseCrossIndexedDocs = (publications || []).filter(scholarDoc => {
    const scholarTitle = normalizeTitle(scholarDoc.title);
    return (scopusPublications || []).some(scopusDoc => normalizeTitle(scopusDoc.title) === scholarTitle);
  });

  const scopusList = isFilter3Years 
    ? (scopusPublications || []).filter(doc => Number(doc.year) >= threeYearsAgo)
    : (scopusPublications || []);

  const scholarList = isFilter3Years
    ? (publications || []).filter(doc => Number(doc.year) >= threeYearsAgo)
    : (publications || []);

  const crossIndexedDocs = isFilter3Years
    ? baseCrossIndexedDocs.filter(doc => Number(doc.year) >= threeYearsAgo)
    : baseCrossIndexedDocs;

  // Pagination Helper Component
  const Pagination = ({ totalItems, currentPage, onPageChange, itemsPerPage, setItemsPerPage }: { 
    totalItems: number, 
    currentPage: number, 
    onPageChange: (page: number) => void,
    itemsPerPage: number,
    setItemsPerPage: (limit: number) => void
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1 && totalItems <= 10) return null;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
      <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
          </span>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Limit:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); onPageChange(1); }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black py-1 px-3 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer uppercase tracking-tighter"
            >
              {[10, 25, 50, 100].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, index, array) => (
                <React.Fragment key={p}>
                  {index > 0 && array[index - 1] !== p - 1 && (
                    <span className="px-2 text-slate-300 font-bold">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      currentPage === p 
                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 ring-4 ring-primary-100 dark:ring-primary-900/20' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 hover:text-primary-600 shadow-sm'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key="insights"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      {/* Insights Sub-Navigation - More Elegant Style */}
      <div className="flex flex-wrap items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        {[
          { id: 'publikasi', label: 'Publikasi', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { id: 'penelitian', label: 'Penelitian', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { id: 'hki', label: 'HKI', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { id: 'buku', label: 'Buku & Modul', icon: Book, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInsightsSubTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 min-w-[140px] ${
              insightsSubTab === tab.id 
                ? `${tab.bg} ${tab.color} ring-1 ring-inset ring-current/20` 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${insightsSubTab === tab.id ? tab.color : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm min-h-[500px] relative overflow-hidden">
         {insightsSubTab === 'publikasi' && (
            <div className="space-y-10 relative z-10">
               {/* Nested Publication Sub-tabs - Underline Style */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-10">
                     {[
                       { id: 'scopus', label: 'Scopus Indexed' },
                       { id: 'scholar', label: 'Google Scholar' },
                       { id: 'cross_indexed', label: 'Cross-Indexed (Irisan)' }
                     ].map((sub) => (
                       <button
                         key={sub.id}
                         onClick={() => setPublicationSubTab(sub.id as any)}
                         className={`relative pb-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                           publicationSubTab === sub.id 
                             ? 'text-primary-600 dark:text-primary-400' 
                             : 'text-slate-400 hover:text-slate-600'
                         }`}
                       >
                         {sub.label}
                         {publicationSubTab === sub.id && (
                           <motion.div 
                             layoutId="insights-subtab-indicator"
                             className="absolute bottom-[-9px] left-0 right-0 h-1 bg-primary-600 dark:bg-primary-500 rounded-full" 
                           />
                         )}
                       </button>
                     ))}
                  </div>

                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                       Filter 3 Tahun Terakhir (Dianggap KPI)
                     </span>
                     <button
                        onClick={() => setIsFilter3Years(!isFilter3Years)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                           isFilter3Years ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                     >
                        <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${
                           isFilter3Years ? 'transform translate-x-5' : ''
                        }`} />
                     </button>
                  </div>
               </div>

               {/* ===== RINGKASAN POIN PUBLIKASI INTERNAL ===== */}
               {(() => {
                  const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                  const crossTitles = new Set(
                    (scholarList).filter(sd =>
                      (scopusList).some(s => normalizeT(s.title) === normalizeT(sd.title))
                    ).map(d => normalizeT(d.title))
                  );
                  const crossPts   = scopusList.filter(s => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 40 + (d.citations || 0), 0);
                  const scopusOnly = scopusList.filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 40 + (d.citations || 0), 0);
                  const scholarOnly = parseFloat(scholarList.filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 0.5 + (d.citations || 0) * 0.1, 0).toFixed(1));
                  const grandTotal = parseFloat((crossPts + scopusOnly + scholarOnly).toFixed(1));
                  const scopusOnlyCount = scopusList.length - crossTitles.size;
                  const scholarOnlyCount = scholarList.length - crossTitles.size;

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Scopus-only */}
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-1">Scopus-Only</p>
                        <p className="text-xl font-black text-orange-700 dark:text-orange-300">{scopusOnly} <span className="text-[9px] font-bold">pts</span></p>
                        <p className="text-[9px] font-bold text-orange-400 mt-1">{scopusOnlyCount} dokumen · 40+sitasi/dok</p>
                      </div>
                      {/* Scholar-only */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Scholar-Only</p>
                        <p className="text-xl font-black text-blue-700 dark:text-blue-300">{scholarOnly} <span className="text-[9px] font-bold">pts</span></p>
                        <p className="text-[9px] font-bold text-blue-400 mt-1">{scholarOnlyCount} dokumen · 0.5+sitasi×0.1/dok</p>
                      </div>
                      {/* Cross-indexed */}
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Cross-Indexed</p>
                        <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{crossPts} <span className="text-[9px] font-bold">pts</span></p>
                        <p className="text-[9px] font-bold text-emerald-400 mt-1">{crossTitles.size} irisan · poin Scopus dipakai</p>
                      </div>
                      {/* Grand Total */}
                      <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-2xl border border-violet-200 dark:border-violet-900/30">
                        <p className="text-[8px] font-black text-violet-500 uppercase tracking-widest mb-1">Total (No Double-Count)</p>
                        <p className="text-xl font-black text-violet-700 dark:text-violet-300">{grandTotal} <span className="text-[9px] font-bold">pts</span></p>
                        <p className="text-[9px] font-bold text-violet-400 mt-1">Scopus + Scholar + Cross</p>
                      </div>
                    </div>
                  );
               })()}

               {/* Publication Content */}
               <div className="space-y-12">
                  {publicationSubTab === 'scopus' ? (
                     <div className="space-y-10">
                        {scopusChartData.chartData.length > 0 ? (
                           <>
                              <div className="relative group/chart-container">
                                 {/* Decorative Blobs */}
                                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover/chart-container:bg-orange-500/10 transition-colors duration-700"></div>
                                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover/chart-container:bg-amber-500/10 transition-colors duration-700"></div>
                                 
                                 <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                                             <TrendingUp className="w-6 h-6 text-orange-500" />
                                          </div>
                                          <div>
                                             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Analisis Tren Scopus</h4>
                                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Statistik Publikasi & Sitasi</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">10 Tahun Terakhir</span>
                                       </div>
                                    </div>
                                    
                                    <div className="h-[350px] w-full">
                                       <ProfileTrendChart 
                                          chartData={scopusChartData.chartData} 
                                          leftDomainMax={scopusChartData.leftMax} 
                                          rightDomainMax={scopusChartData.rightMax}
                                          barColor="#10b981" // emerald-500
                                          barGradientColor="#34d399" // emerald-400
                                          lineColor="#f59e0b" // amber-500
                                          areaGradientColor="#f59e0b"
                                          gradientId="scopus"
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Document List */}
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Dokumen</h4>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                          Terindeks oleh Scopus Database {isFilter3Years && '(3 Tahun Terakhir)'}
                                       </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="text-right">
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Poin Scopus</p>
                                          <p className="text-lg font-black text-orange-600">
                                             {scopusList.reduce((acc: number, doc: any) => acc + 40 + (doc.citations || 0), 0)} pts
                                          </p>
                                       </div>
                                       <div className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                          {scopusList?.length || 0} Total
                                       </div>
                                    </div>
                                 </div>

                                 {/* Skema poin Scopus banner */}
                                 <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                       <span className="text-orange-600 text-[10px] font-black">i</span>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest">Skema Poin Scopus</p>
                                       <p className="text-[10px] font-bold text-orange-600/70 dark:text-orange-400/70 mt-1">
                                          +40 poin per jurnal/dokumen &nbsp;·&nbsp; +1 poin per sitasi
                                       </p>
                                    </div>
                                 </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    {scopusList?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                                       const isAlsoScholar = crossIndexedDocs.some((c: any) => normalizeTitle(c.title) === normalizeTitle(doc.title));
                                       return (
                                       <ScopusDocRow
                                          key={idx}
                                          doc={doc}
                                          isAlsoScholar={isAlsoScholar}
                                          idx={idx}
                                       />
                                       );
                                    })}
                                 </div>
                                 <Pagination 
                                    totalItems={scopusList?.length || 0} 
                                    currentPage={currentPage} 
                                    onPageChange={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                 />
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                 <Search className="w-8 h-8 opacity-40" />
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Data Tidak Ditemukan</p>
                                 <p className="text-[10px] font-bold text-slate-400 mt-2">Sinkronisasi ID Scopus Anda di menu Konfigurasi.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : publicationSubTab === 'scholar' ? (
                     <div className="space-y-10">
                        {scholarChartData.chartData.length > 0 ? (
                           <>
                              <div className="relative group/chart-container">
                                 {/* Decorative Blobs */}
                                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover/chart-container:bg-blue-500/10 transition-colors duration-700"></div>
                                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover/chart-container:bg-indigo-500/10 transition-colors duration-700"></div>
                                 
                                 <div className="relative bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                                             <TrendingUp className="w-6 h-6 text-blue-500" />
                                          </div>
                                          <div>
                                             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Tren Google Scholar</h4>
                                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Analisis Publikasi & Dampak Sitasi</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statistik Tahunan</span>
                                       </div>
                                    </div>
                                    
                                    <div className="h-[350px] w-full">
                                       <ProfileTrendChart 
                                          chartData={scholarChartData.chartData} 
                                          leftDomainMax={scholarChartData.leftMax} 
                                          rightDomainMax={scholarChartData.rightMax}
                                          barColor="#3b82f6" // blue-500
                                          barGradientColor="#60a5fa" // blue-400
                                          lineColor="#8b5cf6" // violet-500
                                          areaGradientColor="#8b5cf6"
                                          gradientId="scholar"
                                       />
                                    </div>
                                 </div>
                              </div>

                              {/* Document List */}
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                       <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Dokumen Scholar</h4>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                          Data publikasi dari Google Scholar {isFilter3Years && '(3 Tahun Terakhir)'}
                                       </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className="text-right">
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Poin GS</p>
                                          <p className="text-lg font-black text-blue-600">
                                             {scholarList.reduce((acc: number, doc: any) => acc + 0.5 + (doc.citations || 0) * 0.1, 0).toFixed(1)} pts
                                          </p>
                                       </div>
                                       <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                          {scholarList?.length || 0} Total
                                       </div>
                                    </div>
                                 </div>

                                 {/* Skema poin banner */}
                                 <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                       <span className="text-blue-600 text-[10px] font-black">i</span>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Skema Poin Google Scholar</p>
                                       <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 mt-1">
                                          +0.5 poin per dokumen &nbsp;·&nbsp; +0.1 poin per sitasi
                                       </p>
                                    </div>
                                 </div>

                                  <div className="grid grid-cols-1 gap-4">
                                    {scholarList?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                                       const docPoints = 0.5 + (doc.citations || 0) * 0.1;
                                       const isAlsoScopus = crossIndexedDocs.some((c: any) => normalizeTitle(c.title) === normalizeTitle(doc.title));
                                       return (
                                       <ScholarDocRow
                                          key={idx}
                                          doc={doc}
                                          docPoints={docPoints}
                                          isAlsoScopus={isAlsoScopus}
                                          idx={idx}
                                          normalizeTitle={normalizeTitle}
                                       />
                                       );
                                    })}
                                 </div>
                                 <Pagination 
                                    totalItems={scholarList?.length || 0} 
                                    currentPage={currentPage} 
                                    onPageChange={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    setItemsPerPage={setItemsPerPage}
                                 />
                              </div>
                           </>
                        ) : (
                           <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                 <Search className="w-8 h-8 opacity-40" />
                              </div>
                              <div className="text-center">
                                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Data</p>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : publicationSubTab === 'cross_indexed' ? (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Publikasi Terindeks Ganda</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Poin diambil dari Scopus (lebih besar) {isFilter3Years && ' - 3 Tahun Terakhir'}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="text-right">
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Poin</p>
                                 <p className="text-lg font-black text-emerald-600">
                                    {crossIndexedDocs.reduce((acc: number, doc: any) => {
                                       const sd = (scopusPublications || []).find((s: any) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                                       return acc + 40 + ((sd?.citations ?? doc.citations) || 0);
                                    }, 0)} pts
                                 </p>
                              </div>
                              <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                 {crossIndexedDocs?.length || 0} Total
                              </div>
                           </div>
                        </div>

                        {/* Info banner cross-indexed */}
                        <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                           <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-emerald-600 text-[10px] font-black">i</span>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Deduplikasi Otomatis — Poin Scopus Digunakan</p>
                              <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                                 Ketika judul ada di Scopus & Scholar, sistem memakai poin Scopus (40 + sitasi) karena lebih besar.
                              </p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                           {crossIndexedDocs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => {
                              const scopusDoc = (scopusPublications || []).find((s: any) => normalizeTitle(s.title) === normalizeTitle(doc.title));
                              return (
                              <CrossIndexedDocRow
                                 key={idx}
                                 doc={doc}
                                 scopusDoc={scopusDoc}
                                 idx={idx}
                              />
                              );
                           })}
                           {crossIndexedDocs.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-6">
                                 <div className="text-center">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Belum Ada Publikasi Terindeks Ganda</p>
                                 </div>
                              </div>
                           )}
                        </div>
                        <Pagination 
                           totalItems={crossIndexedDocs?.length || 0} 
                           currentPage={currentPage} 
                           onPageChange={setCurrentPage}
                           itemsPerPage={itemsPerPage}
                           setItemsPerPage={setItemsPerPage}
                        />
                     </div>
                  ) : null}
               </div>
            </div>
         )}

         {insightsSubTab === 'penelitian' && (
            <div className="space-y-8 relative z-10">
               <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Daftar Penelitian</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data penelitian yang terdaftar di database</p>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {researchDocs.length > 0 ? (
                    <>
                      {researchDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-orange-500/30 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-orange-500/10 rounded-2xl">
                              <Zap className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{doc.category || 'Penelitian'}</p>
                              <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight mt-1">{doc.title}</h5>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{doc.status || 'Verified'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                               {doc.published_at ? new Date(doc.published_at).getFullYear() : '2024'}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-2 py-24 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <Zap className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Penelitian Tidak Ditemukan</p>
                    </div>
                  )}
               </div>
               {researchDocs.length > 0 && (
                 <Pagination 
                   totalItems={researchDocs.length} 
                   currentPage={currentPage} 
                   onPageChange={setCurrentPage}
                   itemsPerPage={itemsPerPage}
                   setItemsPerPage={setItemsPerPage}
                 />
               )}
            </div>
         )}

         {insightsSubTab === 'hki' && (
            <div className="space-y-8 relative z-10">
               <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Hak Kekayaan Intelektual</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daftar Paten, Hak Cipta, dan HKI lainnya</p>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hkiDocs.length > 0 ? (
                    <>
                      {hkiDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                        >
                          <div className="relative z-10">
                            <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
                            <h5 className="text-lg font-black text-white mb-4 leading-tight">{doc.title}</h5>
                            <div className="inline-flex px-3 py-1.5 bg-white/10 rounded-xl">
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                 {doc.identifier || `REG-IDN-${new Date(doc.published_at).getFullYear() || 2024}-${idx}`}
                              </span>
                            </div>
                          </div>
                          <TrendingUp className="absolute -right-10 -bottom-10 w-32 h-32 opacity-10 text-white" />
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-2 py-24 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data HKI Tidak Ditemukan</p>
                    </div>
                  )}
               </div>
               {hkiDocs.length > 0 && (
                 <Pagination 
                   totalItems={hkiDocs.length} 
                   currentPage={currentPage} 
                   onPageChange={setCurrentPage}
                   itemsPerPage={itemsPerPage}
                   setItemsPerPage={setItemsPerPage}
                 />
               )}
            </div>
         )}

         {insightsSubTab === 'buku' && (
            <div className="space-y-8 relative z-10">
               <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Buku & Modul</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Karya tulis, buku ajar, dan modul akademik</p>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookDocs.length > 0 ? (
                    <>
                      {bookDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-purple-500/30 hover:shadow-xl transition-all"
                        >
                          <div className="flex gap-6">
                            <div className="w-24 h-32 bg-slate-50 dark:bg-slate-800 rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                              <Book className="w-8 h-8 text-slate-300" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.2em] mb-2">{doc.category || 'Buku'}</p>
                              <h5 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-purple-600 transition-colors">{doc.title}</h5>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                <span className="px-2 py-0.5 border border-slate-200 dark:border-slate-700 rounded-md">ISBN Verified</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-2 py-24 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                      <Book className="w-10 h-10 mx-auto mb-4 text-slate-300" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Data Buku Tidak Ditemukan</p>
                    </div>
                  )}
               </div>
               {bookDocs.length > 0 && (
                 <Pagination 
                   totalItems={bookDocs.length} 
                   currentPage={currentPage} 
                   onPageChange={setCurrentPage}
                   itemsPerPage={itemsPerPage}
                   setItemsPerPage={setItemsPerPage}
                 />
               )}
            </div>
         )}
      </div>
    </motion.div>
  );
}
