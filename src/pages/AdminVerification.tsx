import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Check, X, FileText, ExternalLink, Award, Archive, 
  CalendarDays, ShieldAlert, CheckCircle2, Zap, 
  ChevronLeft, ChevronRight, Beaker, Landmark, Globe, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminVerification() {
  const { user } = useOutletContext<{ user: any }>();
  const [activeTab, setActiveTab ] = useState<'documents' | 'research'>('documents');
  const [documents, setDocuments] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (activeTab === 'documents') {
      fetchPendingDocuments();
    } else {
      fetchPendingResearch();
    }
    setCurrentPage(1);
  }, [activeTab]);

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
      // Backend already filters based on role:
      // Prodi sees 'Pending', Admin sees 'Verified by Prodi'
      setResearch(data.penelitian || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId: string, status: 'Approved' | 'Rejected') => {
    try {
      setActionLoading(docId);
      const endpoint = activeTab === 'documents' 
        ? `/api/admin/documents/${docId}/verify`
        : `/api/penelitian/${docId}/verify`;
        
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, role: user?.role }),
      });
      if (res.ok) {
        if (activeTab === 'documents') await fetchPendingDocuments();
        else await fetchPendingResearch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Pagination Logic
  const activeItems = activeTab === 'documents' ? documents : research;
  const totalPages = Math.ceil(activeItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activeItems.slice(indexOfFirstItem, indexOfLastItem);

  // Mencegah error jika user berada di halaman terakhir lalu menghapus/verify dokumen terakhir di halaman tersebut
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [documents.length, currentPage, totalPages]);

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-10">
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2rem] border border-gray-50 dark:border-zinc-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center bg-gray-50/10 border-b border-gray-50 dark:border-zinc-800 gap-4">
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl w-full md:w-auto">
             <button 
                onClick={() => setActiveTab('documents')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'documents' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200'}`}
             >
                Dokumen
             </button>
             <button 
                onClick={() => setActiveTab('research')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'research' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200'}`}
             >
                Penelitian
             </button>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-900/30">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
             <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                {loading ? 'Memuat...' : `${activeItems.length} Menunggu`}
             </span>
          </div>
        </div>

        {/* Existing Title Header (Optional: make smaller or keep it) */}
        <div className="px-6 py-7 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
               {activeTab === 'documents' ? <ShieldAlert className="h-4 w-4 lg:h-6 lg:w-6" /> : <Beaker className="h-4 w-4 lg:h-6 lg:w-6" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tighter">
                {user?.role === 'admin' ? 'LPPM' : 'Prodi'} Queue {activeTab === 'documents' ? 'Verifikasi Dokumen' : 'Verifikasi Penelitian'}
              </h3>
              <p className="text-gray-400 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Daftar Pengajuan Pending</p>
            </div>
          </div>
        </div>


        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800 animate-pulse p-8 shadow-inner">
             <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full w-48 mb-4"></div>
             <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-50/50 dark:bg-zinc-800/30 rounded-3xl"></div>
                ))}
             </div>
          </div>
        ) : currentItems.length > 0 ? (
          <div>
            {/* Tampilan Mobile (Card List) */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800/80">
              {currentItems.map((item: any) => (
                <div key={item.id} className="p-5 space-y-4 bg-white dark:bg-zinc-900">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{activeTab === 'documents' ? item.user_name : item.user?.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Dosen Pengaju</p>
                    </div>
                    <span className="text-[10px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">
                      {activeTab === 'documents' ? item.category : item.program}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                      {activeTab === 'documents' ? <FileText className="h-5 w-5 text-gray-400" /> : <Beaker className="h-5 w-5 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <a 
                        href={item.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-primary-600 flex items-center gap-1 uppercase tracking-tight line-clamp-1"
                      >
                        {activeTab === 'documents' ? item.title : item.judul_penelitian}
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-0.5 uppercase tracking-widest flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        {activeTab === 'documents' ? 'Published: ' + (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-') : 'Submitted: ' + new Date(item.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {activeTab === 'research' && (
                    <div className="grid grid-cols-2 gap-2">
                       <div className="bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                          <p className="text-[8px] font-black uppercase text-emerald-600 tracking-widest mb-0.5">Dana Disetujui</p>
                          <p className="text-xs font-black text-emerald-900 dark:text-emerald-100">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}</p>
                       </div>
                       <div className="bg-blue-50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                          <p className="text-[8px] font-black uppercase text-blue-600 tracking-widest mb-0.5">Skema/Fokus</p>
                          <p className="text-xs font-black text-blue-900 dark:text-blue-100 truncate">{item.skema} - {item.fokus}</p>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-50 dark:border-zinc-800">
                    <button
                      onClick={() => handleVerify(item.id, 'Approved')}
                      disabled={actionLoading === item.id}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? (
                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(item.id, 'Rejected')}
                      disabled={actionLoading === item.id}
                      className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tampilan Desktop (Table) */}
            <div className="hidden md:block overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                  <tr>
                    {['Dosen Pengaju', 'Informasi Detail', 'Program/Kategori', activeTab === 'research' ? 'Fiskal/Dana' : 'Periode Kinerja', 'Keputusan Verifikasi'].map((h, i) => (
                      <th key={i} className={`px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em] ${h === 'Keputusan Verifikasi' ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                  {currentItems.map((item: any) => (
                    <tr key={item.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all duration-200">
                      <td className="px-6 py-5 align-top">
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                             {activeTab === 'documents' ? item.user_name : item.user?.name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">NIDN Terlampir</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="p-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl group-hover:bg-primary-100 transition-colors">
                            {activeTab === 'documents' ? <FileText className="h-6 w-6 text-gray-400 group-hover:text-primary-600" /> : <Beaker className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />}
                          </div>
                          <div className="min-w-[150px] lg:min-w-[300px]">
                            <a 
                              href={item.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-primary-600 flex items-center gap-2 group/link uppercase tracking-tight line-clamp-1"
                            >
                              {activeTab === 'documents' ? item.title : item.judul_penelitian}
                              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                            <div className="flex items-center gap-3 mt-1.5">
                               <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                                 <CalendarDays className="w-3.5 h-3.5 mr-1 text-primary-500" />
                                 {activeTab === 'documents' ? 'Pub: ' + (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-') : 'Sub: ' + new Date(item.created_at).toLocaleDateString('id-ID')}
                               </p>
                                {activeTab === 'research' && (
                                 <div className="flex gap-2">
                                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/30 uppercase tracking-widest">
                                      {item.skema}
                                   </span>
                                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30 uppercase tracking-widest">
                                      {item.fokus}
                                   </span>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 rounded-2xl border border-primary-100 dark:border-primary-900/30 text-[10px] font-black uppercase tracking-widest shadow-sm">
                           {activeTab === 'documents' ? (
                             <>
                                <Award className="w-4 h-4" />
                                {item.category}
                             </>
                           ) : (
                             <>
                                {item.program === 'hibah luar negeri' ? <Globe className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                                {item.program}
                             </>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        {activeTab === 'documents' ? (
                          item.is_kpi_counted ? (
                            <div className="flex flex-col">
                               <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 w-fit">
                                  <Award className="w-3.5 h-3.5 shadow-inner" />
                                  KPI {item.accreditation_period}
                               </div>
                               <p className="text-[9px] font-black text-emerald-300 dark:text-emerald-500 mt-1 uppercase tracking-widest">Memasuki Periode Aktif</p>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit">
                              <Archive className="w-3.5 h-3.5" />
                              ARSIP
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2 text-emerald-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="text-sm font-black tracking-tight">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}</span>
                             </div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Dana Disetujui</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right font-medium align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(item.id, 'Approved')}
                            disabled={actionLoading === item.id}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                          >
                            {actionLoading === item.id ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 className="h-4 w-4" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(item.id, 'Rejected')}
                            disabled={actionLoading === item.id}
                            className="p-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50"
                            title="Reject Document"
                          >
                            <X className="h-5 w-5" />
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
          <div className="px-8 py-24 text-center">
            <div className="flex flex-col items-center">
               <div className="w-20 h-20 bg-gray-50/50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner ring-1 ring-black/5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-40 shadow-inner" />
               </div>
               <p className="text-base font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic mb-1">Queue processed</p>
               <p className="text-[10px] font-bold text-gray-300 dark:text-zinc-600 uppercase tracking-widest">Semua pengajuan telah ditindaklanjuti</p>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && activeItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-6 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] lg:text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activeItems.length)} of {activeItems.length} Entries
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 dark:text-zinc-600 tracking-wider">Show:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 py-1 pl-2 pr-6 focus:ring-4 focus:ring-primary-100/50 outline-none cursor-pointer"
                >
                  {[5, 10, 25, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => (
                    <React.Fragment key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-1 text-gray-300 dark:text-zinc-700 font-black">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 scale-105' 
                            : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 hover:text-primary-600'
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
                className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}