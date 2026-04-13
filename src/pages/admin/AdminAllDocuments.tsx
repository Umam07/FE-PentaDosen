import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, XCircle, Clock, Download, 
  Search, FileDown, Award, Archive, CalendarDays, Filter,
  ChevronLeft, ChevronRight, Globe, User, GraduationCap, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

export default function AdminAllDocuments() {
  const { user } = useOutletContext<{ user: any }>();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [kpiPeriod, setKpiPeriod] = useState<any>(null);
  const [periodFilter, setPeriodFilter] = useState('all');

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchDocuments();
    fetchPeriods();
  }, []);

  // Kembalikan ke halaman 1 setiap kali melakukan pencarian atau filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, periodFilter, selectedFakultas]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/documents/all?role=${user?.role}&user_id=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriods = async () => {
    try {
      const res = await fetch('/api/accreditation-periods');
      if (res.ok) {
        const data = await res.json();
        setKpiPeriod(data.kpi_period);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Verified by Prodi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Period filter: all, kpi or archive
    const matchPeriod = periodFilter === 'all' 
      ? true
      : periodFilter === 'kpi'
        ? doc.is_kpi_counted === true || doc.is_kpi_counted === 1
        : periodFilter === 'archive'
          ? !doc.is_kpi_counted || doc.is_kpi_counted === 0
          : true;
          
    const matchFakultas = selectedFakultas ? doc.fakultas === selectedFakultas : true;

    return matchSearch && matchPeriod && matchFakultas;
  });

  // Hitungan untuk Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportCSV = () => {
    if (filteredDocuments.length === 0) return;

    const headers = ['ID,Judul Dokumen,Kategori,Dosen Pengaju,Status,Tgl Publikasi,Sumber,KPI,Points,Tanggal Pengajuan'];

    const rows = filteredDocuments.map(doc => {
      const title = doc.title.replace(/"/g, '""');
      const dateStr = new Date(doc.created_at).toLocaleDateString('id-ID');
      const pubDate = doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-';
      const kpiStatus = doc.is_kpi_counted ? 'KPI Aktif' : 'Arsip';
      const source = doc.file_url ? 'Manual' : 'Synced';
      return `"${doc.id}","${title}","${doc.category}","${doc.user_name}","${doc.status}","${pubDate}","${source}","${kpiStatus}","${doc.awarded_points || 0}","${dateStr}"`;
    });

    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const exportLabel = periodFilter === 'all' ? 'Semua' : periodFilter;
    link.href = url;
    link.setAttribute('download', `Data_Dokumen_${exportLabel}_PentaDosen.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Count stats
  const kpiCount = documents.filter(d => d.is_kpi_counted === true || d.is_kpi_counted === 1).length;
  const archiveCount = documents.filter(d => !d.is_kpi_counted || d.is_kpi_counted === 0).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Vault Dokumen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Manajemen & Monitoring Seluruh Output Akademik
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredDocuments.length === 0}
          className="flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
        >
          <FileDown className="h-4 w-4 mr-2 text-primary-600" />
          Export CSV {periodFilter !== 'all' && `(${periodFilter})`}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Dokumen', value: documents.length, icon: FileText, color: 'primary' },
          { label: 'KPI Aktif', value: kpiCount, icon: Award, color: 'emerald' },
          { label: 'Arsip Umum', value: archiveCount, icon: Archive, color: 'gray' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.02)] rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-6 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
              stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
              stat.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' :
              'bg-gray-50 dark:bg-zinc-800 text-gray-400'
            }`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className={`text-3xl font-black mt-0.5 ${
                stat.color === 'emerald' ? 'text-emerald-600' :
                stat.color === 'primary' ? 'text-primary-600' :
                'text-gray-900 dark:text-zinc-100'
              }`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation & Filters */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {/* Fakultas Filter Component */}
              {user?.role === 'admin lppm' && (
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedFakultas}
                    onChange={(e) => setSelectedFakultas(e.target.value)}
                    className="appearance-none text-[11px] font-black uppercase tracking-widest border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-10 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none w-full sm:w-[220px] transition-all"
                  >
                    <option value="">Semua Fakultas</option>
                    <option value="Fakultas Kedokteran">Kedokteran</option>
                    <option value="Fakultas Kedokteran Gigi">Kedokteran Gigi</option>
                    <option value="Fakultas Teknologi Informasi">Teknologi Informasi</option>
                    <option value="Fakultas Ekonomi Bisnis">Ekonomi Bisnis</option>
                    <option value="Fakultas Hukum">Hukum</option>
                    <option value="Fakultas Psikologi">Psikologi</option>
                  </select>
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              )}

              {/* Period Filter */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="appearance-none text-[11px] font-black uppercase tracking-widest border border-gray-200 dark:border-zinc-700 rounded-2xl pl-10 pr-10 py-3 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none w-full sm:w-[220px] transition-all"
                >
                  <option value="all">Semua Dokumen</option>
                  <option value="kpi">KPI Aktif {kpiPeriod ? `(${kpiPeriod.label})` : ''}</option>
                  <option value="archive">Arsip Saja</option>
                </select>
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="relative w-full xl:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                placeholder="Cari judul, dosen, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sinkronisasi Data...</p>
             </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Data Tidak Ditemukan</p>
            </div>
          ) : (
            <div>
              {/* Tampilan Mobile (Card List) */}
              <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
                {currentItems.map((doc) => (
                  <div key={doc.id} className="p-6 space-y-4 bg-white dark:bg-zinc-900">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 leading-snug uppercase tracking-tight">
                          {doc.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-2">
                           <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 uppercase tracking-tight border border-primary-100/50">
                              {doc.category}
                           </span>
                           {!doc.file_url && (
                             <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 uppercase tracking-tight border border-orange-100/50 flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" /> Synced
                             </span>
                           )}
                        </div>
                      </div>
                      <div className="shrink-0">{getStatusBadge(doc.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dosen</p>
                        <p className="text-[11px] font-bold text-gray-800 dark:text-zinc-300 truncate">{doc.user_name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Publikasi</p>
                        <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status KPI</p>
                        <div className="mt-0.5">
                          {doc.is_kpi_counted ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 uppercase">
                              {doc.accreditation_period}
                            </span>
                          ) : (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-400 uppercase">
                              Arsip
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Poin Achieved</p>
                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100">+{doc.awarded_points || 0} PTS</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      {doc.file_url ? (
                        <a 
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                        >
                          <Download className="w-4 h-4 mr-1.5" />
                          Unduh Berkas
                        </a>
                      ) : (
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-zinc-700 cursor-not-allowed italic">
                          <Globe className="w-3.5 h-3.5 mr-2" />
                          No File (Synced)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tampilan Desktop (Table) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Dokumen & Kategori</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Kontributor</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Publikasi</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Sumber</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Poin</th>
                      <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                    {currentItems.map((doc) => (
                      <tr key={doc.id} className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] transition-colors">
                        <td className="px-6 py-6 max-w-[300px]">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-2">{doc.title}</span>
                            <span className="mt-1.5 text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">{doc.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-gray-500">
                                {doc.user_name?.charAt(0)}
                             </div>
                             <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{doc.user_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-zinc-500 italic">
                            <CalendarDays className="h-4 w-4 mr-1.5 text-gray-300" />
                            {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-center">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-center">
                          {doc.file_url ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                               <User className="w-3 h-3" /> Manual
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-900/30">
                               <Globe className="w-3 h-3" /> Synced
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-center">
                           <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-gray-900 dark:text-zinc-100">+{doc.awarded_points || 0}</span>
                              {doc.is_kpi_counted && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">KPI Verified</span>}
                           </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-right">
                          {doc.file_url ? (
                            <a 
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-primary-500 hover:text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Unduh
                            </a>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 dark:text-zinc-700 text-[10px] font-black uppercase tracking-widest italic cursor-not-allowed">
                               <Zap className="w-3.5 h-3.5" /> Auto-Sync
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredDocuments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocuments.length)} of {filteredDocuments.length}
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