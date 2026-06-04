import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Activity, Clock, ShieldAlert, User as UserIcon, 
  ChevronLeft, ChevronRight, LogOut, RefreshCw, 
  FileText, Beaker, Award, BookOpen, Book, Filter, Search,
  TrendingUp, Zap, Shield
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

  const getActionConfig = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('login'))   return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', dot: 'bg-emerald-500', icon: <UserIcon className="w-3.5 h-3.5" />, ring: 'ring-emerald-100 dark:ring-emerald-900/30', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' };
    if (a.includes('logout'))  return { badge: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', dot: 'bg-rose-500', icon: <LogOut className="w-3.5 h-3.5" />, ring: 'ring-rose-100 dark:ring-rose-900/30', iconBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' };
    if (a.includes('sync'))    return { badge: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', dot: 'bg-blue-500', icon: <RefreshCw className="w-3.5 h-3.5" />, ring: 'ring-blue-100 dark:ring-blue-900/30', iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' };
    if (a.includes('verify'))  return { badge: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20', dot: 'bg-purple-500', icon: <Shield className="w-3.5 h-3.5" />, ring: 'ring-purple-100 dark:ring-purple-900/30', iconBg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' };
    if (a.includes('submit') || a.includes('upload')) return { badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', dot: 'bg-amber-500', icon: <FileText className="w-3.5 h-3.5" />, ring: 'ring-amber-100 dark:ring-amber-900/30', iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' };
    if (a.includes('journal')) return { badge: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20', dot: 'bg-sky-500', icon: <BookOpen className="w-3.5 h-3.5" />, ring: 'ring-sky-100 dark:ring-sky-900/30', iconBg: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' };
    if (a.includes('hki'))     return { badge: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20', dot: 'bg-indigo-500', icon: <Award className="w-3.5 h-3.5" />, ring: 'ring-indigo-100 dark:ring-indigo-900/30', iconBg: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' };
    if (a.includes('research')) return { badge: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', dot: 'bg-teal-500', icon: <Beaker className="w-3.5 h-3.5" />, ring: 'ring-teal-100 dark:ring-teal-900/30', iconBg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' };
    if (a.includes('book'))    return { badge: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', dot: 'bg-orange-500', icon: <Book className="w-3.5 h-3.5" />, ring: 'ring-orange-100 dark:ring-orange-900/30', iconBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' };
    return { badge: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700', dot: 'bg-gray-400', icon: <Activity className="w-3.5 h-3.5" />, ring: 'ring-gray-100 dark:ring-zinc-800', iconBg: 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400' };
  };

  if (user?.role !== 'admin lppm' && user?.role !== 'admin fakultas') {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Akses Ditolak</h1>
        <p className="text-gray-500 mt-2">Halaman ini hanya dapat diakses oleh Admin Penelitian atau Admin Fakultas.</p>
      </div>
    );
  }

  const filteredLogs = logs.filter((log: any) => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Stats
  const loginCount  = logs.filter((l: any) => l.action.toLowerCase().includes('login')).length;
  const verifyCount = logs.filter((l: any) => l.action.toLowerCase().includes('verify')).length;
  const syncCount   = logs.filter((l: any) => l.action.toLowerCase().includes('sync')).length;

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Log Aktivitas</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Riwayat Tindakan Dosen &amp; Admin
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 px-5 py-3 rounded-2xl border border-primary-100 dark:border-primary-900/30">
          <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <span className="text-[11px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">
            {loading ? 'SYNCING...' : `${totalItems} Aktivitas Tercatat`}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Sesi Login', value: loginCount, icon: UserIcon, color: 'emerald', desc: 'Login berhasil tercatat' },
          { label: 'Aksi Verifikasi', value: verifyCount, icon: Shield, color: 'purple', desc: 'Dokumen diverifikasi admin' },
          { label: 'Sinkronisasi Data', value: syncCount, icon: RefreshCw, color: 'blue', desc: 'Sync Scholar / Scopus' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-5 flex items-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
              stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
              stat.color === 'purple'  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                                         'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
            }`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em]">{stat.label}</p>
              <p className={`text-3xl font-black mt-0.5 ${
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'purple'  ? 'text-purple-600' :
                                           'text-blue-600'
              }`}>{stat.value}</p>
              <p className="text-[9px] font-bold text-gray-300 dark:text-zinc-600 uppercase tracking-wider mt-0.5">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">

        {/* Filter & Search Bar — matches AdminVerification.tsx layout */}
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

            {/* Left: Sub-header */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                  Riwayat Log Sistem
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {user?.role === 'admin lppm' ? 'Penelitian' : 'Fakultas'} • Audit Trail
                </p>
              </div>
            </div>

            {/* Right: Search + Filter — grouped same side like AdminVerification.tsx */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {/* Search */}
              <div className="relative w-full xl:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                  placeholder="Cari aksi, deskripsi, atau nama dosen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Aksi */}
              <div className="relative w-full sm:w-[220px]">
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="appearance-none w-full px-5 py-3 pl-11 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm"
                >
                  <option value="">Semua Aksi</option>
                  <option value="create">Create (Submit/Upload)</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="sync">Sync (Scholar/Scopus)</option>
                  <option value="verify">Verify (Admin Action)</option>
                </select>
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Log Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Memuat Log Aktivitas...</p>
            </div>
          ) : filteredLogs.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <tr>
                      {['Waktu', 'Pengguna', 'Aksi', 'Deskripsi Detail'].map((h) => (
                        <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                    <AnimatePresence>
                      {filteredLogs.map((log: any, idx: number) => {
                        const cfg = getActionConfig(log.action);
                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] transition-colors duration-150"
                          >
                            {/* Time */}
                            <td className="px-6 py-5 whitespace-nowrap align-top">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                                <div>
                                  <p className="text-[11px] font-black text-gray-700 dark:text-zinc-300 tabular-nums">
                                    {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </p>
                                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* User */}
                            <td className="px-6 py-5 align-top">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ring-2 ${cfg.ring} ${cfg.iconBg}`}>
                                  {cfg.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                                    {log.user?.name || 'Sistem / Anonim'}
                                  </p>
                                  <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
                                    {log.user?.role || 'System'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Action Badge */}
                            <td className="px-6 py-5 whitespace-nowrap align-top">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${cfg.badge}`}>
                                {cfg.icon}
                                {log.action}
                              </span>
                            </td>

                            {/* Description */}
                            <td className="px-6 py-5 align-top max-w-[360px]">
                              <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 leading-relaxed">
                                {log.description}
                              </p>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Timeline */}
              <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
                {filteredLogs.map((log: any, idx: number) => {
                  const cfg = getActionConfig(log.action);
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="p-5 space-y-3 bg-white dark:bg-zinc-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ring-2 ${cfg.ring} ${cfg.iconBg}`}>
                            {cfg.icon}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                              {log.user?.name || 'Sistem'}
                            </p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{log.user?.role || 'System'}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${cfg.badge} shrink-0`}>
                          {cfg.icon}
                          {log.action}
                        </span>
                      </div>

                      <div className="bg-gray-50/50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100/50 dark:border-zinc-800/50 space-y-2">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 leading-relaxed">{log.description}</p>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-8 py-32 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-primary-50/50 dark:bg-primary-900/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner ring-1 ring-primary-100/50 dark:ring-primary-900/20">
                <Activity className="w-12 h-12 text-primary-400 opacity-40" />
              </div>
              <p className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] mb-2">
                {searchTerm || selectedAction ? 'Tidak Ditemukan' : 'Belum Ada Log'}
              </p>
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-relaxed">
                {searchTerm || selectedAction ? 'Coba ubah kata kunci atau filter yang digunakan' : 'Aktivitas dosen & admin akan tercatat di sini'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, totalItems)} of {totalItems}
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
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30'
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
