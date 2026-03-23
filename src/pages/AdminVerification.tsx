import React, { useState, useEffect } from 'react';
import { 
  Check, X, FileText, ExternalLink, Award, Archive, 
  CalendarDays, ShieldAlert, CheckCircle2, Zap, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminVerification() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Sekarang menggunakan state agar bisa diubah user

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId: string, status: 'Approved' | 'Rejected') => {
    try {
      setActionLoading(docId);
      const res = await fetch(`/api/admin/documents/${docId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchPendingDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="px-6 py-7 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-800/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
               <ShieldAlert className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tighter">Queue Verifikasi</h3>
              <p className="text-gray-400 dark:text-zinc-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Daftar Pengajuan Dokumen Internal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                {loading ? 'Memuat...' : `${documents.length} Dokumen Pending`}
             </span>
          </div>
        </div>

        {/* Table Responsive */}
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800 animate-pulse">
            {/* Desktop Skeleton */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                  <tr>
                    {['Dosen Pengunggah', 'Informasi Dokumen', 'Kategori Poin', 'Periode Kinerja', 'Aksi Keputusan'].map((h, i) => (
                      <th key={i} className={`px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em] ${h === 'Aksi Keputusan' ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                  {[...Array(itemsPerPage)].map((_, index) => (
                    <tr key={`skeleton-desktop-${index}`}>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-32"></div>
                          <div className="h-3 bg-gray-100 dark:bg-zinc-800/50 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="w-11 h-11 bg-gray-200 dark:bg-zinc-800 rounded-xl shrink-0"></div>
                          <div className="flex flex-col gap-2 w-full">
                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-48 lg:w-64"></div>
                            <div className="h-3 bg-gray-100 dark:bg-zinc-800/50 rounded w-32"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-xl w-20"></div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-xl w-24"></div>
                          <div className="h-3 bg-gray-100 dark:bg-zinc-800/50 rounded w-32"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                          <div className="h-9 w-9 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Skeleton */}
            <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800">
              {[...Array(itemsPerPage)].map((_, index) => (
                <div key={`skeleton-mobile-${index}`} className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 dark:bg-zinc-800/50 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-xl w-20"></div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-zinc-800/50 p-3 rounded-2xl">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                      <div className="h-3 bg-gray-100 dark:bg-zinc-800/50 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded-xl w-24"></div>
                    <div className="flex gap-2">
                      <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                      <div className="h-9 w-9 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentDocuments.length > 0 ? (
          <div>
            {/* Tampilan Mobile (Card List) */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800/80">
              {currentDocuments.map((doc: any) => (
                <div key={doc.id} className="p-4 space-y-4 bg-white dark:bg-zinc-900">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{doc.user_name}</p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Institutional Lecturer</p>
                    </div>
                    <span className="text-[10px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">
                      {doc.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-zinc-800/50 p-3 rounded-2xl">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-primary-600 flex items-center gap-1 uppercase tracking-tight line-clamp-1"
                      >
                        {doc.title}
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-0.5 uppercase tracking-widest flex items-center">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        Published: {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <div>
                      {doc.is_kpi_counted ? (
                        <div className="flex flex-col">
                           <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 w-fit">
                              <Award className="w-3.5 h-3.5" />
                              KPI {doc.accreditation_period}
                           </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit">
                          <Archive className="w-3.5 h-3.5" />
                          ARSIP
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(doc.id, 'Approved')}
                        disabled={actionLoading === doc.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10 transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50"
                      >
                        {actionLoading === doc.id ? (
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(doc.id, 'Rejected')}
                        disabled={actionLoading === doc.id}
                        className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50"
                        title="Reject Document"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tampilan Desktop (Table) */}
            <div className="hidden md:block overflow-x-auto scrollbar-hide">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                  <tr>
                    {['Dosen Pengunggah', 'Informasi Dokumen', 'Kategori Poin', 'Periode Kinerja', 'Aksi Keputusan'].map((h, i) => (
                      <th key={i} className={`px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em] ${h === 'Aksi Keputusan' ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                  {currentDocuments.map((doc: any) => (
                    <tr key={doc.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all duration-200">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{doc.user_name}</p>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Institutional Lecturer</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="p-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl group-hover:bg-primary-100 transition-colors">
                            <FileText className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />
                          </div>
                          <div className="min-w-[150px] lg:min-w-[300px]">
                            <a 
                              href={doc.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-black text-gray-700 dark:text-zinc-300 hover:text-primary-600 flex items-center gap-2 group/link uppercase tracking-tight line-clamp-1"
                            >
                              {doc.title}
                              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest flex items-center">
                              <CalendarDays className="w-3 h-3 mr-1" />
                              Published: {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] lg:text-xs font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-4 py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {doc.is_kpi_counted ? (
                          <div className="flex flex-col">
                             <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 w-fit">
                                <Award className="w-3.5 h-3.5 shadow-inner" />
                                KPI {doc.accreditation_period}
                             </div>
                             <p className="text-[9px] font-black text-emerald-300 dark:text-emerald-500 mt-1 uppercase tracking-widest">Memasuki Periode Aktif</p>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit">
                            <Archive className="w-3.5 h-3.5" />
                            ARSIP
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(doc.id, 'Approved')}
                            disabled={actionLoading === doc.id}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-emerald-900/10 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                          >
                            {actionLoading === doc.id ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 className="h-4 w-4" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(doc.id, 'Rejected')}
                            disabled={actionLoading === doc.id}
                            className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white rounded-xl transition-all border border-red-100 dark:border-red-900/30 hover:border-red-500 active:scale-95 disabled:opacity-50"
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
          <div className="px-8 py-20 text-center">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-50 shadow-inner" />
               </div>
               <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">Queue Processed (0 Results)</p>
            </div>
          </div>
        )}

        {/* Pagination Controls - Disembunyikan saat Loading */}
        {!loading && documents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, documents.length)} of {documents.length} entries
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-2 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Per Page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 py-1 pl-2 pr-6 focus:ring-2 focus:ring-primary-200 outline-none cursor-pointer"
                >
                  {[5, 10, 25, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => (
                    <React.Fragment key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-300 dark:text-zinc-600 font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30' 
                            : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
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