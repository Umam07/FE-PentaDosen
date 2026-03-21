import { useState, useEffect } from 'react';
import { Check, X, FileText, ExternalLink, Award, Archive, CalendarDays, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminVerification() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/documents');
      const data = await res.json();
      setDocuments(data.documents);
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
        fetchPendingDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 font-black tracking-widest text-[10px] uppercase">Retrieving Queue...</p>
    </div>
  );

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
                {documents.length} Dokumen Pending
             </span>
          </div>
        </div>

        {/* Table Responsive */}
        <div className="overflow-x-auto scrollbar-hide">
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
              {documents.map((doc: any) => (
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
              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                       <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400 opacity-50 shadow-inner" />
                       </div>
                       <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">Queue Processed (0 Results)</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
