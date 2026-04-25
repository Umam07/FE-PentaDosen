import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Activity, Clock, ShieldAlert, User as UserIcon, 
  ChevronLeft, ChevronRight, LogOut, RefreshCw, 
  FileText, Beaker, Award, BookOpen, Book, Filter, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminActivityLogs() {
  const { user } = useOutletContext<{ user: any }>();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs(currentPage, itemsPerPage, selectedAction);
  }, [currentPage, itemsPerPage, selectedAction]);

  // Reset to page 1 on search or filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAction]);

  const fetchLogs = async (page: number, limit: number, action: string) => {
    try {
      setLoading(true);
      let url = `/api/admin/activity-logs?page=${page}&per_page=${limit}`;
      if (action) url += `&action=${action}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionStyle = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    if (actionLower.includes('logout')) return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
    if (actionLower.includes('sync')) return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    if (actionLower.includes('submit') || actionLower.includes('upload')) return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    if (actionLower.includes('verify')) return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
    return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
  };

  const getActionIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return <UserIcon className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('logout')) return <LogOut className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('sync')) return <RefreshCw className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('mass sync')) return <RefreshCw className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('journal')) return <BookOpen className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('hki')) return <Award className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('research')) return <Beaker className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('book')) return <Book className="w-3.5 h-3.5 mr-1.5" />;
    if (actionLower.includes('submit') || actionLower.includes('upload')) return <FileText className="w-3.5 h-3.5 mr-1.5" />;
    return <Activity className="w-3.5 h-3.5 mr-1.5" />;
  };

  if (user?.role !== 'admin lppm') {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Akses Ditolak</h1>
        <p className="text-gray-500 mt-2">Halaman ini hanya dapat diakses oleh Admin LPPM.</p>
      </div>
    );
  }

  // Client-side search (optional, since it's already filtered on server if implemented, 
  // but let's keep it for small datasets if server search isn't available)
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Log Aktivitas</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Riwayat Tindakan Dosen & Admin
          </p>
        </div>
        <div className="flex bg-primary-50 dark:bg-primary-900/20 px-5 py-3 rounded-2xl border border-primary-100 dark:border-primary-900/30">
          <Activity className="text-primary-500 w-5 h-5 mr-3" />
          <span className="text-[11px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">
            {totalItems} Aktivitas Tercatat
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
               <div className="relative w-full sm:w-auto">
                 <select
                   value={selectedAction}
                   onChange={(e) => setSelectedAction(e.target.value)}
                   className="appearance-none text-[11px] font-black uppercase tracking-widest border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-10 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none w-full sm:w-[220px] transition-all"
                 >
                   <option value="">Semua Aksi</option>
                   <option value="create">Create (Submit/Upload)</option>
                   <option value="login">Login</option>
                   <option value="logout">Logout</option>
                   <option value="sync">Sync (Scholar/Scopus)</option>
                   <option value="verify">Verify (Admin Action)</option>
                 </select>
                 <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
            </div>

            <div className="relative w-full xl:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                placeholder="Cari aksi, deskripsi, atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Waktu</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Pengguna</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Aksi</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Deskripsi Detail</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log: any) => (
                  <tr key={log.id} className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mr-3 border border-gray-200 dark:border-zinc-700">
                          <UserIcon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{log.user?.name || 'Sistem / Anonim'}</p>
                          <p className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-wider font-bold">{log.user?.role || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center text-[10px] leading-none font-black rounded-full uppercase tracking-widest border ${getActionStyle(log.action)}`}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-widest italic">Belum ada log aktivitas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Matched with AdminAllDocuments.tsx */}
        {!loading && totalItems > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
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
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 ring-4 ring-primary-100 dark:ring-primary-900/20' 
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
    </div>
  );
}
