import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Zap, FileText, Beaker, ShieldCheck, Book, 
  Calendar, Search, ChevronLeft, ChevronRight, Info
} from 'lucide-react';

export default function LecturerDashboard({ user }: { user: any }) {
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/${user.id}/documents`);
        if (res.ok) {
          const data = await res.json();
          setInternalDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user?.id]);

  const internalDocumentsOnly = useMemo(() => {
    // Filter out auto-synced documents (which have empty file_url)
    return internalDocuments.filter(doc => doc.file_url && doc.file_url !== '');
  }, [internalDocuments]);

  const approvedDocs = useMemo(() => {
    return internalDocumentsOnly.filter(doc => doc.status === 'Approved');
  }, [internalDocumentsOnly]);

  const filteredDocs = useMemo(() => {
    if (categoryFilter === 'all') return approvedDocs;
    return approvedDocs.filter(doc => doc.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [approvedDocs, categoryFilter]);

  const currentYear = new Date().getFullYear();
  const threeYearsAgo = currentYear - 2;

  const stats = useMemo(() => {
    const total = approvedDocs.reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);
    const threeY = approvedDocs
      .filter(doc => {
        const year = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
        return year >= threeYearsAgo;
      })
      .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);
    const thisYear = approvedDocs
      .filter(doc => {
        const year = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
        return year === currentYear;
      })
      .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);

    return [
      { label: 'Total Poin Internal', val: total, icon: Award, color: 'text-amber-600', bg: 'bg-amber-500/10' },
      { label: 'Poin 3 Tahun Terakhir', val: threeY, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-500/10' },
      { label: 'Poin Tahun Ini', val: thisYear, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    ];
  }, [approvedDocs]);

  const categories = [
    { id: 'all', label: 'Semua', icon: FileText },
    { id: 'penelitian', label: 'Penelitian', icon: Beaker },
    { id: 'hki', label: 'HKI', icon: ShieldCheck },
    { id: 'buku', label: 'Buku', icon: Book },
  ];

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
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Dashboard Poin Internal</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Penghitungan poin dari dokumen yang diunggah secara mandiri</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.val.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 p-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategoryFilter(cat.id); setCurrentPage(1); }}
            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              categoryFilter === cat.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Dokumen Terverifikasi</h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-500/20">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Hanya data Approved</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Memuat data...</div>
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
                        <Calendar className="w-3 h-3" /> {doc.published_at ? new Date(doc.published_at).getFullYear() : (doc.tahun_pelaksanaan || '-')}
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

      {/* Info Banner */}
      <div className="p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
         <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
               <Info className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-lg font-black uppercase tracking-tight">Informasi Penghitungan Poin</h4>
               <p className="text-sm font-bold opacity-80 mt-1">Poin pada dashboard ini berasal dari dokumen yang telah diverifikasi (Approved) oleh Admin. Setiap kategori memiliki bobot poin yang berbeda sesuai dengan kebijakan akademik.</p>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
      </div>
    </div>
  );
}
