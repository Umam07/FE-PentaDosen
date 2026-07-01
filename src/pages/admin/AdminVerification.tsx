import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  Check, X, FileText, ExternalLink, Award, Archive, 
  CalendarDays, ShieldAlert, CheckCircle2, Zap, 
  ChevronLeft, ChevronRight, Beaker, Landmark, Globe,
  Filter, GraduationCap, ShieldCheck, Clock, Eye, Search, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';

export default function AdminVerification() {
  const { user } = useOutletContext<{ user: any }>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab ] = useState<'publikasi' | 'hki' | 'penelitian' | 'buku'>('publikasi');

  useEffect(() => {
    if (tabParam && ['publikasi', 'hki', 'penelitian', 'buku'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  const [documents, setDocuments] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // === State Catatan Penolakan & Modal ===
  const [rejectingItem, setRejectingItem] = useState<{ id: string; title: string; type: 'documents' | 'research' } | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // === State Preview Modal ===
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (activeTab === 'penelitian') {
      fetchPendingResearch();
    } else {
      fetchPendingDocuments();
    }
    setCurrentPage(1);
  }, [activeTab, selectedFakultas]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/documents?role=${user?.role}&user_id=${user?.id}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingResearch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/penelitian?role=${user?.role}&user_id=${user?.id}`);
      const data = await res.json();
      setResearch(data.penelitian || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId: string, status: 'Approved' | 'Rejected', catatan?: string) => {
    try {
      setActionLoading(docId);
      const endpoint = activeTab === 'penelitian' 
        ? `/api/penelitian/${docId}/verify`
        : `/api/admin/documents/${docId}/verify`;
        
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, role: user?.role, admin_id: user?.id, catatan }),
      });
      if (res.ok) {
        if (activeTab === 'penelitian') await fetchPendingResearch();
        else await fetchPendingDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Dynamic Filtering by activeTab
  const filteredDocsByTab = useMemo(() => {
    if (activeTab === 'penelitian') return research;
    if (activeTab === 'hki') {
      return documents.filter((doc: any) => (doc.category || '').toLowerCase().includes('hki'));
    }
    if (activeTab === 'buku') {
      return documents.filter((doc: any) => (doc.category || '').toLowerCase().includes('buku'));
    }
    if (activeTab === 'publikasi') {
      return documents.filter((doc: any) => 
        !(doc.category || '').toLowerCase().includes('hki') && 
        !(doc.category || '').toLowerCase().includes('buku')
      );
    }
    return documents;
  }, [activeTab, documents, research]);

  // Pagination Logic with Search
  const activeItems = filteredDocsByTab.filter((item: any) => {
    const titleText = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
    const authorText = activeTab === 'penelitian' ? item.user?.name : item.user_name;
    const catText = activeTab === 'penelitian' ? item.program : item.category;

    const matchSearch = (titleText || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (authorText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (catText || '').toLowerCase().includes(searchTerm.toLowerCase());

    const itemFakultas = activeTab === 'penelitian' ? item.user?.fakultas : item.fakultas;
    const matchFakultas = selectedFakultas ? itemFakultas === selectedFakultas : true;

    return matchSearch && matchFakultas;
  });

  const totalPages = Math.ceil(activeItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [activeItems.length, currentPage, totalPages]);

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Antrean Verifikasi</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Validasi Dokumen & Luaran Riset Dosen
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 px-5 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
             <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
             <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
                {loading ? 'SYNCING...' : `${activeItems.length} PENDING`}
             </span>
          </div>
        </div>
      </div>

      {/* Filters & Content Section */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        
        {/* Card Header Premium Tab Bar */}
        <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/10 overflow-x-auto scrollbar-hide">
          {(['publikasi', 'hki', 'penelitian', 'buku'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap ${
                 activeTab === tab 
                   ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-zinc-900' 
                   : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
               }`}
             >
               {tab}
             </button>
          ))}
        </div>

        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
             <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
               <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
                  {activeTab === 'penelitian' ? <Beaker className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
               </div>
               <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    Queue Verifikasi {activeTab === 'publikasi' ? 'Publikasi' : activeTab === 'hki' ? 'HKI' : activeTab === 'buku' ? 'Buku' : 'Penelitian'}
                  </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{user?.role === 'admin lppm' ? 'Penelitian' : 'Fakultas'} • Pending Approval</p>
               </div>
             </div>

             <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                {/* Search Bar */}
                <div className="relative w-full xl:w-[400px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                    placeholder={`Cari judul, dosen, atau kategori ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {user?.role === 'admin lppm' && (
                  <div className="relative w-full sm:w-[220px]">
                    <select
                      value={selectedFakultas}
                      onChange={(e) => setSelectedFakultas(e.target.value)}
                      className="appearance-none w-full px-5 py-3 pl-11 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm"
                    >
                      <option value="">Semua Fakultas</option>
                      <option value="Fakultas Kedokteran">Kedokteran</option>
                      <option value="Fakultas Kedokteran Gigi">Kedokteran Gigi</option>
                      <option value="Fakultas Teknologi Informasi">Teknologi Informasi</option>
                      <option value="Fakultas Ekonomi dan Bisnis">Ekonomi dan Bisnis</option>
                      <option value="Fakultas Hukum">Hukum</option>
                      <option value="Fakultas Psikologi">Psikologi</option>
                    </select>
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sinkronisasi Antrean...</p>
             </div>
          ) : currentItems.length > 0 ? (
            <div>
              {/* Tampilan Mobile (Card List) */}
              <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
                {currentItems.map((item: any) => (
                  <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-zinc-900">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-1">{activeTab === 'penelitian' ? item.user?.name : item.user_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Dosen Pengaju</p>
                          {user?.role === 'admin lppm' && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100/50">
                              FAKULTAS VERIFIED
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">
                        {activeTab === 'penelitian' ? item.program : item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50">
                      <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 text-gray-400">
                        {activeTab === 'penelitian' ? <Beaker className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-800 dark:text-zinc-200 uppercase tracking-tight line-clamp-2 leading-snug">
                          {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-2 uppercase tracking-widest flex items-center">
                          <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary-500/70" />
                          {activeTab === 'penelitian' ? new Date(item.created_at).toLocaleDateString('id-ID') : (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
                        </p>
                      </div>
                    </div>

                    {activeTab === 'penelitian' && (
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[8px] font-black uppercase text-emerald-600 tracking-widest mb-1.5 leading-none">Dana Disetujui</p>
                            <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}
                            </p>
                         </div>
                         <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                            <p className="text-[8px] font-black uppercase text-blue-600 tracking-widest mb-1.5 leading-none">Skema/Fokus</p>
                            <p className="text-xs font-black text-blue-900 dark:text-blue-100 truncate">{item.skema}</p>
                         </div>
                      </div>
                    )}

                    {/* Action buttons — Preview + Approve + Reject (Mobile Side-By-Side Layout) */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                      {/* Preview file button — muncul jika ada file */}
                      {(() => {
                        const fileUrl = item.file_url;
                        const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
                        const kategori = activeTab === 'penelitian' ? item.program : item.category;
                        return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                          <button
                            onClick={() => setPreviewDoc({ fileUrl, title: judul, category: kategori })}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white rounded-xl border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </button>
                        ) : (
                          <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 rounded-xl border border-gray-100 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest cursor-not-allowed italic whitespace-nowrap">
                            <FileText className="h-4 w-4" />
                            No File
                          </div>
                        );
                      })()}
                      
                      {/* Approve Button */}
                      <button
                        onClick={() => handleVerify(item.id, 'Approved')}
                        disabled={actionLoading === item.id}
                        className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === item.id ? (
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        Approve
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => {
                          setRejectingItem({
                            id: item.id,
                            title: activeTab === 'penelitian' ? item.judul_penelitian : item.title,
                            type: activeTab === 'penelitian' ? 'research' : 'documents'
                          });
                          setFeedbackText('');
                        }}
                        disabled={actionLoading === item.id}
                        className="p-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50 shrink-0"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tampilan Desktop (Table) */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <tr>
                      {['Nama Dosen', 'Fakultas / Prodi', 'Informasi Detail', 'Program / Kategori', activeTab === 'penelitian' ? 'Dana' : 'Status Performa', 'Kendali'].map((h, i) => (
                        <th 
                          key={i} 
                          className={`px-6 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em] ${
                            ['Program / Kategori', 'Dana', 'Status Performa', 'Kendali'].includes(h) ? 'text-center' : 'text-left'
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                    {currentItems.map((item: any) => (
                      <tr key={item.id} className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/10 transition-all duration-200">
                        <td className="px-6 py-6 align-top text-left">
                          <div className="flex flex-col">
                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                               {activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name)}
                            </p>
                            <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">
                              <Mail className="w-3 h-3 mr-1.5 text-primary-400/70" />
                              {(activeTab === 'penelitian' ? item.user?.email : item.user?.email) || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 align-top text-left">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                              {(activeTab === 'penelitian' ? item.user?.program_studi : item.user?.program_studi) || 'N/A'}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                              {(activeTab === 'penelitian' ? item.user?.fakultas : item.fakultas) || 'N/A'}
                            </span>
                            {user?.role === 'admin lppm' && (
                              <div className="mt-1.5">
                                <span className="inline-flex items-center text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100/50">
                                  FAKULTAS VERIFIED
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-5">
                            <div className="shrink-0 p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-primary-100/50 transition-colors border border-gray-100 dark:border-zinc-800">
                              {activeTab === 'penelitian' ? <Beaker className="h-6 w-6 text-gray-400 group-hover:text-primary-600" /> : <FileText className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />}
                            </div>
                            <div className="max-w-[300px] lg:max-w-[400px]">
                              <p className="text-sm font-black text-gray-800 dark:text-zinc-200 uppercase tracking-tight leading-snug line-clamp-2">
                                {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                 <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                                   <CalendarDays className="w-4 h-4 mr-1.5 text-primary-500/70" />
                                   {activeTab === 'penelitian' ? 'Submitted: ' + new Date(item.created_at).toLocaleDateString('id-ID') : 'Published: ' + (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
                                 </p>
                                  {activeTab === 'penelitian' && (
                                   <div className="flex gap-2">
                                     <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-100/50 uppercase tracking-tight">
                                        {item.skema}
                                     </span>
                                     <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100/50 uppercase tracking-tight">
                                        {item.fokus}
                                     </span>
                                   </div>
                                 )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 align-top text-center">
                          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 rounded-xl border border-primary-100 dark:border-primary-900/30 text-[10px] font-black uppercase tracking-widest shadow-sm">
                             {activeTab === 'penelitian' ? (
                               <>
                                  {item.program === 'hibah luar negeri' ? <Globe className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                                  {item.program}
                               </>
                             ) : (
                               <>
                                  <Award className="w-3.5 h-3.5" />
                                  {item.category}
                               </>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-6 align-top text-center">
                          {activeTab === 'penelitian' ? (
                            <div className="flex flex-col gap-1 items-center">
                               <div className="flex items-center gap-2 text-emerald-600">
                                  <span className="text-sm font-black tracking-tight">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}
                                  </span>
                               </div>
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dana Disetujui</p>
                            </div>
                          ) : (
                            item.is_kpi_counted ? (
                              <div className="flex flex-col items-center">
                                 <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100/50 w-fit uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5" />
                                    KPI {item.accreditation_period}
                                 </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit uppercase tracking-widest">
                                  <Archive className="w-3.5 h-3.5" />
                                  ARSIP
                                </div>
                              </div>
                            )
                          )}
                        </td>
                        
                        {/* Desktop Verification Column - Side-by-Side Horizontal Buttons Layout */}
                        <td className="px-6 py-6 text-center align-top">
                          <div className="flex items-center justify-center gap-2 w-full">
                            {/* Tombol Preview File */}
                            {(() => {
                              const fileUrl = item.file_url;
                              const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
                              const kategori = activeTab === 'penelitian' ? item.program : item.category;
                              return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                                <button
                                  onClick={() => setPreviewDoc({ fileUrl, title: judul, category: kategori })}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white rounded-xl border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Preview
                                </button>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 rounded-xl border border-gray-100 dark:border-zinc-700 text-[9px] font-black uppercase tracking-widest cursor-not-allowed italic whitespace-nowrap">
                                  <FileText className="h-3.5 w-3.5" />
                                  No File
                                </div>
                              );
                            })()}
                            
                            {/* Approve */}
                            <button
                              onClick={() => handleVerify(item.id, 'Approved')}
                              disabled={actionLoading === item.id}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap font-sans font-black"
                            >
                              {actionLoading === item.id ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ShieldCheck className="h-4 w-4" />}
                              Approve
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => {
                                setRejectingItem({
                                  id: item.id,
                                  title: activeTab === 'penelitian' ? item.judul_penelitian : item.title,
                                  type: activeTab === 'penelitian' ? 'research' : 'documents'
                                });
                                setFeedbackText('');
                              }}
                              disabled={actionLoading === item.id}
                              className="p-2 bg-red-50 dark:bg-red-950/20 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50 shrink-0"
                              title="Reject"
                            >
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="px-8 py-32 text-center flex flex-col items-center">
               <div className="w-24 h-24 bg-primary-50/50 dark:bg-primary-900/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-primary-100/50 dark:ring-primary-900/20">
                  <CheckCircle2 className="w-12 h-12 text-primary-400 opacity-40" />
               </div>
               <p className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-2">Queue processed</p>
               <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">Semua pengajuan telah ditindaklanjuti secara sistematis</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && activeItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, activeItems.length)} of {activeItems.length}
              </span>
              <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold py-1 px-3 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer"
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
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => (
                    <React.Fragment key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-300 font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-sm' 
                            : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 hover:text-primary-600 shadow-sm'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reject Confirmation Modal with Feedback */}
      <AnimatePresence>
        {rejectingItem && (
          <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
              onClick={() => setRejectingItem(null)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden p-6 space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  Tolak Pengajuan
                </h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                  Berikan alasan penolakan dokumen
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-300">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Judul Pengajuan</p>
                  <p className="uppercase leading-relaxed">{rejectingItem.title}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                    Catatan Umpan Balik <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Contoh: Dokumen PDF yang diunggah tidak terbaca atau salah file. Harap unggah ulang."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-950/20 focus:border-red-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                  />
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    * Field ini wajib diisi sebelum mengonfirmasi penolakan.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="flex-1 px-5 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!feedbackText.trim() || actionLoading !== null}
                  onClick={async () => {
                    if (!feedbackText.trim()) return;
                    const docId = rejectingItem.id;
                    await handleVerify(docId, 'Rejected', feedbackText);
                    setRejectingItem(null);
                  }}
                  className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  Tolak Pengajuan
                </button>
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