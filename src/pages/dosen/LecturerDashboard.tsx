import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Zap, FileText, Beaker, ShieldCheck, Book, 
  Calendar, Search, ChevronLeft, ChevronRight, Info, Globe, ArrowUpRight,
  BookMarked, RefreshCw
} from 'lucide-react';

import PentaInsight from '../profilediri/PentaInsight';

export default function LecturerDashboard({ user }: { user: any }) {
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'all' | 'internal' | 'external'>('all');
  const [isKPIFilter, setIsKPIFilter] = useState(false); // Filter for 3-year points (KPI)
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed'>('scopus');

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [docsRes, profileRes] = await Promise.all([
        fetch(`/api/users/${user.id}/documents`),
        fetch(`/api/users/${user.id}`)
      ]);

      if (docsRes.ok) {
        const data = await docsRes.json();
        setInternalDocuments(data.documents || []);
      }

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);


  const internalDocumentsOnly = useMemo(() => {
    return internalDocuments.filter(doc => doc.file_url && doc.file_url !== '');
  }, [internalDocuments]);

  const approvedDocs = useMemo(() => {
    return internalDocumentsOnly.filter(doc => doc.status === 'Approved');
  }, [internalDocumentsOnly]);

  const currentYear = new Date().getFullYear();
  const threeYearsAgo = currentYear - 2;

  const apiPoints = useMemo(() => {
    if (!profileData) return { total: 0, scopus: 0, scholar: 0 };
    
    const { publications = [], scopusPublications = [] } = profileData;
    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const crossTitles = new Set(
      (publications || []).filter((sd: any) => (scopusPublications || []).some((s: any) => normalizeT(s.title) === normalizeT(sd.title)))
        .map((d: any) => normalizeT(d.title))
    );
    
    const filteredScopus = isKPIFilter 
      ? (scopusPublications || []).filter((s: any) => Number(s.year) >= threeYearsAgo)
      : (scopusPublications || []);
    
    const filteredScholar = isKPIFilter
      ? (publications || []).filter((s: any) => Number(s.year) >= threeYearsAgo)
      : (publications || []);
    
    const scopusPts = filteredScopus.reduce((a: number, d: any) => a + 40 + (d.citations || 0), 0);
    const scholarPts = parseFloat(
      filteredScholar.filter((s: any) => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 0.5 + (d.citations || 0) * 0.1, 0).toFixed(1)
    );
    
    return {
      total: parseFloat((scopusPts + scholarPts).toFixed(1)),
      scopus: scopusPts,
      scholar: scholarPts
    };
  }, [profileData, isKPIFilter]);

  const internalPoints = useMemo(() => {
    const baseDocs = isKPIFilter
      ? approvedDocs.filter(d => {
          const year = d.published_at ? new Date(d.published_at).getFullYear() : (Number(d.tahun_pelaksanaan) || 0);
          return year >= threeYearsAgo;
        })
      : approvedDocs;
    
    return baseDocs.reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);
  }, [approvedDocs, isKPIFilter]);

  const grandTotal = parseFloat((apiPoints.total + internalPoints).toFixed(1));

  const filteredDocs = useMemo(() => {
    let base = approvedDocs;
    if (isKPIFilter) {
      base = base.filter(d => {
        const year = d.published_at ? new Date(d.published_at).getFullYear() : (Number(d.tahun_pelaksanaan) || 0);
        return year >= threeYearsAgo;
      });
    }
    if (categoryFilter === 'all') return base;
    return base.filter(doc => doc.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [approvedDocs, categoryFilter, isKPIFilter]);

  const stats = useMemo(() => {
    const internal3Y = approvedDocs
      .filter(doc => {
        const year = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
        return year >= threeYearsAgo;
      })
      .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);
    
    const internalThisYear = approvedDocs
      .filter(doc => {
        const year = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
        return year === currentYear;
      })
      .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);

    return [
      { 
        label: isKPIFilter ? 'Poin Internal (3Thn)' : 'Poin Internal (Total)', 
        val: internalPoints, 
        icon: FileText, 
        color: 'text-amber-600', 
        bg: 'bg-amber-500/10' 
      },
      { 
        label: isKPIFilter ? 'Poin API (3Thn)' : 'Poin API (Total)', 
        val: apiPoints.total, 
        icon: Globe, 
        color: 'text-blue-600', 
        bg: 'bg-blue-500/10' 
      },
      { 
        label: isKPIFilter ? 'KPI Kontribusi' : 'Total Kontribusi', 
        val: internalPoints + apiPoints.total, 
        icon: TrendingUp, 
        color: 'text-primary-600', 
        bg: 'bg-primary-500/10' 
      },
    ];
  }, [approvedDocs, apiPoints, internalPoints]);


  const scholarChartData = useMemo(() => {
    const publications = profileData?.publications || [];
    if (!publications || publications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    publications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profileData]);

  const scopusChartData = useMemo(() => {
    const scopusPublications = profileData?.scopusPublications || [];
    if (!scopusPublications || scopusPublications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    scopusPublications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profileData]);

  const categories = [
    { id: 'all', label: 'Semua', icon: FileText },
    { id: 'penelitian', label: 'Penelitian', icon: Beaker },
    { id: 'hki', label: 'HKI', icon: ShieldCheck },
    { id: 'buku', label: 'Buku', icon: Book },
    { id: 'jurnal internasional', label: 'Jurnal Internasional', icon: Globe },
    { id: 'jurnal nasional', label: 'Jurnal Nasional', icon: BookMarked },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const Pagination = ({ totalItems, currentPage, onPageChange, itemsPerPage, setItemsPerPage }: any) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Menampilkan {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalItems, currentPage * itemsPerPage)} dari {totalItems}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      {/* Information Banner at the very top */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
      >
         <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md flex-shrink-0">
               <Info className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest">Informasi Penghitungan Poin</h4>
               <p className="text-xs font-bold opacity-80 mt-1 leading-relaxed">
                  Poin pada dashboard ini berasal dari dokumen yang telah diverifikasi (Approved) oleh Admin. Setiap kategori memiliki bobot poin yang berbeda sesuai dengan kebijakan akademik.
               </p>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
      </motion.div>

      {/* View Switcher Tabs & KPI Toggle */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border border-slate-200/60 dark:border-slate-700 shadow-inner overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'all', label: 'Ringkasan Performa', icon: Award },
            { id: 'internal', label: 'Dokumen Internal', icon: FileText },
            { id: 'external', label: 'Dokumen Eksternal (API)', icon: Globe },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id as any); setCurrentPage(1); }}
              className={`flex items-center gap-3 px-6 lg:px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activeView === view.id 
                  ? 'bg-white dark:bg-slate-900 text-primary-600 shadow-xl shadow-primary-500/10' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <view.icon className={`w-4 h-4 ${activeView === view.id ? 'text-primary-600' : 'text-slate-400'}`} />
              {view.label}
            </button>
          ))}
        </div>

        {/* KPI / 3-Year Toggle */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Mode Perhitungan</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isKPIFilter ? 'Rentang 3 Tahun (KPI)' : 'Seluruh Dokumen (Total)'}</span>
           </div>
           <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-500 hover:text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200/60 dark:border-slate-700 shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Dokumen'}
            </button>

            <button
              onClick={() => setIsKPIFilter(!isKPIFilter)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                 isKPIFilter ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
           >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                 isKPIFilter ? 'translate-x-6' : ''
              }`} />
           </button>
        </div>
      </div>

      {activeView === 'all' && (
        <>
          {/* Header & Grand Total Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  Dashboard <span className="text-primary-600">Performa</span>
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">
              {isKPIFilter 
                ? 'Menampilkan akumulasi poin dalam rentang 3 tahun terakhir (KPI)' 
                : 'Menampilkan akumulasi seluruh poin dari semua dokumen yang terdaftar'}
            </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 px-6 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.val.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* GRAND TOTAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group overflow-hidden bg-slate-900 dark:bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl group-hover:bg-blue-500/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 dark:bg-slate-900/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 dark:border-slate-900/10">
                  <Award className="w-8 h-8 text-primary-400 dark:text-primary-600" />
                </div>
                <p className="text-[10px] font-black text-white/40 dark:text-slate-400 uppercase tracking-[0.3em] mb-2">
              {isKPIFilter ? 'KPI Performance Score (3Thn)' : 'Total Performance Score'}
            </p>
                <h2 className="text-6xl font-black text-white dark:text-slate-900 tracking-tighter mb-4">
                  {grandTotal.toLocaleString()}
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-slate-900/5 rounded-full border border-white/5 dark:border-slate-900/5">
                  <span className="text-[10px] font-black text-primary-400 dark:text-primary-600 uppercase tracking-widest">Akumulasi Seluruh Poin</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40 dark:text-slate-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress & Contribution Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Kontribusi Poin</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Perbandingan sumber poin Anda</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-amber-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase">Internal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full bg-blue-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase">API</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(internalPoints / (grandTotal || 1)) * 100}%` }}
                        className="h-full bg-amber-500"
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(apiPoints.total / (grandTotal || 1)) * 100}%` }}
                        className="h-full bg-blue-500"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                         <p className="text-[8px] font-black text-amber-600 uppercase mb-1">Internal Share</p>
                         <p className="text-lg font-black text-amber-700">{grandTotal > 0 ? ((internalPoints / grandTotal) * 100).toFixed(1) : 0}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                         <p className="text-[8px] font-black text-blue-600 uppercase mb-1">API Share</p>
                         <p className="text-lg font-black text-blue-700">{grandTotal > 0 ? ((apiPoints.total / grandTotal) * 100).toFixed(1) : 0}%</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                <div className="relative z-10 h-full flex flex-col justify-between">
                   <div>
                      <h3 className="text-lg font-black uppercase tracking-tight">Status Verifikasi</h3>
                      <p className="text-xs font-bold opacity-70 mt-1">Dokumen internal memerlukan verifikasi Admin untuk mendapatkan poin.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                         <p className="text-[8px] font-black text-white/60 uppercase mb-1">Approved Docs</p>
                         <p className="text-2xl font-black text-white">{approvedDocs.length}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                         <p className="text-[8px] font-black text-white/60 uppercase mb-1">Pending Docs</p>
                         <p className="text-2xl font-black text-white">{internalDocumentsOnly.filter(d => d.status === 'Pending').length}</p>
                      </div>
                   </div>
                </div>
                <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 text-white" />
             </div>
          </div>
        </>
      )}

      {activeView === 'internal' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Daftar Dokumen Internal</h2>
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCategoryFilter(cat.id); setCurrentPage(1); }}
                  className={`flex items-center gap-2 py-2 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    categoryFilter === cat.id 
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Memuat data...</div>
            ) : filteredDocs.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-primary-500/30 transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-primary-50 transition-colors">
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{Number(doc.awarded_points) || 0}</span>
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">PTS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 bg-primary-500/10 text-primary-600 rounded-md text-[7px] font-black uppercase tracking-widest">{doc.category}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {doc.published_at ? new Date(doc.published_at).getFullYear() : (doc.tahun_pelaksanaan || '-')}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-1">{doc.title}</h3>
                      </div>
                      <div className="hidden sm:flex flex-col items-end text-right gap-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID Dokumen</span>
                         <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{doc.id_dokumen || 'INTERNAL-' + doc.id}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Pagination 
                  totalItems={filteredDocs.length} 
                  currentPage={currentPage} 
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            ) : (
              <div className="py-24 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tidak ada data ditemukan</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
             <div className="p-4 bg-amber-500/10 rounded-3xl border border-amber-500/20">
                <FileText className="w-8 h-8 text-amber-600" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ringkasan Poin Internal</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total akumulasi poin dari dokumen terverifikasi</p>
             </div>
             <div className="ml-auto flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Poin Internal:</p>
                <p className="text-3xl font-black text-amber-600 leading-none">{internalPoints.toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}

      {activeView === 'external' && (
        <div className="space-y-8">
          <PentaInsight 
            publicationSubTab={publicationSubTab}
            setPublicationSubTab={setPublicationSubTab}
            scopusChartData={scopusChartData}
            scholarChartData={scholarChartData}
            scopusData={profileData?.scopusData}
            scholarData={profileData?.scholarData}
            publications={profileData?.publications || []}
            scopusPublications={profileData?.scopusPublications || []}
            tabVariants={tabVariants}
            isKPIFilter={isKPIFilter}
          />

          <div className="flex items-center gap-6">
             <div className="p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                <Globe className="w-8 h-8 text-blue-600" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ringkasan Poin Eksternal (API)</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Poin otomatis dari database Scopus dan Google Scholar</p>
             </div>
             <div className="ml-auto flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Poin API:</p>
                <p className="text-3xl font-black text-blue-600 leading-none">{apiPoints.total.toLocaleString()}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Scopus Poin</p>
                <p className="text-4xl font-black text-orange-700 leading-none">{apiPoints.scopus.toLocaleString()} <span className="text-xs">pts</span></p>
                <p className="text-[9px] font-bold text-orange-400 uppercase mt-4">Berdasarkan jumlah dokumen & sitasi Scopus</p>
             </div>
             <div className="p-8 bg-blue-500/5 rounded-[2.5rem] border border-blue-500/10">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Google Scholar Poin</p>
                <p className="text-4xl font-black text-blue-700 leading-none">{apiPoints.scholar.toLocaleString()} <span className="text-xs">pts</span></p>
                <p className="text-[9px] font-bold text-blue-400 uppercase mt-4">Berdasarkan jumlah dokumen & sitasi Scholar</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );

}
