import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, XCircle, Clock, Download, 
  Search, FileDown, Award, Archive, CalendarDays, Filter,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAllDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [searchTerm, periodFilter]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents/all');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
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

    return matchSearch && matchPeriod;
  });

  // Hitungan untuk Pagination (Berdasarkan filteredDocuments, bukan semua documents)
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportCSV = () => {
    if (filteredDocuments.length === 0) return;

    const headers = ['ID,Judul Dokumen,Kategori,Dosen Pengaju,Status,Tgl Publikasi,Periode Akreditasi,KPI,Points,Tanggal Pengajuan'];

    const rows = filteredDocuments.map(doc => {
      const title = doc.title.replace(/"/g, '""');
      const dateStr = new Date(doc.created_at).toLocaleDateString('id-ID');
      const pubDate = doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-';
      const kpiStatus = doc.is_kpi_counted ? 'KPI Aktif' : 'Arsip';
      return `"${doc.id}","${title}","${doc.category}","${doc.user_name}","${doc.status}","${pubDate}","${doc.accreditation_period || '-'}","${kpiStatus}","${doc.awarded_points || 0}","${dateStr}"`;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Seluruh Dokumen</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Dokumen</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{documents.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider">KPI Aktif</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{kpiCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
            <Archive className="w-6 h-6 text-gray-500 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Arsip</p>
            <p className="text-2xl font-bold text-gray-500 dark:text-zinc-400">{archiveCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Period Filter */}
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-zinc-700 rounded-md px-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Semua Dokumen</option>
                  <option value="kpi">KPI Aktif {kpiPeriod ? `(${kpiPeriod.label})` : ''}</option>
                  <option value="archive">Arsip Saja</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportCSV}
                disabled={filteredDocuments.length === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <FileDown className="h-4 w-4 mr-2 text-primary-600" />
                Export CSV {periodFilter !== 'all' && `(${periodFilter})`}
              </button>
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md leading-5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Cari judul, dosen, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data dokumen...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Tidak ada dokumen yang ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead className="bg-gray-50 dark:bg-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Informasi Dokumen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Dosen Pengaju
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Tgl. Publikasi
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    KPI
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    File
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                {/* Gunakan currentItems, bukan filteredDocuments langsung */}
                {currentItems.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-zinc-100 line-clamp-2">{doc.title}</div>
                      <div className="text-sm text-primary-600 dark:text-primary-400 mt-1">{doc.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">{doc.user_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
                        <CalendarDays className="h-4 w-4 mr-1.5 text-gray-400" />
                        {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className={`text-sm font-medium ${
                          doc.status === 'Approved' ? 'text-emerald-700 dark:text-emerald-400' : 
                          doc.status === 'Rejected' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {doc.is_kpi_counted ? (
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          <Award className="w-3 h-3 mr-1" />
                          {doc.accreditation_period}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                          <Archive className="w-3 h-3 mr-1" />
                          Arsip
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-zinc-100 font-bold">
                      {doc.awarded_points || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a 
                        href={`/storage/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-zinc-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none"
                      >
                        <Download className="w-4 h-4 mr-1.5 text-gray-400" />
                        Unduh
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls - Disembunyikan saat Loading atau Data Kosong */}
        {!loading && filteredDocuments.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDocuments.length)} of {filteredDocuments.length} entries
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