import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, CheckCircle, XCircle, Clock, Download, 
  Search, FileDown, Award, Archive, CalendarDays, Filter,
  ChevronLeft, ChevronRight, Globe, User, GraduationCap, ShieldCheck, Zap, Eye,
  Beaker, Landmark, Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';

export default function AdminAllDocuments() {
  const { user } = useOutletContext<{ user: any }>();
  const [activeTab, setActiveTab ] = useState<'publikasi' | 'hki' | 'penelitian' | 'buku'>('publikasi');
  const [documents, setDocuments] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // === State Preview Modal ===
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Tab configurations: icons, descriptions, colors
  const tabDetails = {
    publikasi: {
      title: 'Daftar Publikasi',
      description: 'Pengelolaan Publikasi: Kelola, monitoring, dan validasi data publikasi ilmiah dosen.',
      icon: FileText,
      colorClass: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-primary-100/50 dark:border-primary-900/30'
    },
    hki: {
      title: 'Daftar HKI',
      description: 'Pengelolaan HKI: Kelola, monitoring, dan verifikasi data hak kekayaan intelektual dosen.',
      icon: Award,
      colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100/50 dark:border-indigo-900/30'
    },
    penelitian: {
      title: 'Daftar Penelitian',
      description: 'Pengelolaan Penelitian: Kelola, monitoring, dan laporan data penelitian dosen.',
      icon: Beaker,
      colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100/50 dark:border-emerald-900/30'
    },
    buku: {
      title: 'Daftar Buku',
      description: 'Pengelolaan Buku: Kelola, monitoring, dan verifikasi data buku akademik dosen.',
      icon: Book,
      colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100/50 dark:border-amber-900/30'
    }
  };

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [docsRes, resRes] = await Promise.all([
        fetch(`/api/admin/documents/all?role=${user?.role}&user_id=${user?.id}`),
        fetch(`/api/penelitian?role=${user?.role}&user_id=${user?.id}&all=true`)
      ]);
      
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
      }
      
      if (resRes.ok) {
        const resData = await resRes.json();
        setResearch(resData.penelitian || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id, user?.role]);

  // Kembalikan ke halaman 1 setiap kali melakukan pencarian atau filter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

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
      case 'Verified by Fakultas':
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

  // Helper to filter data based on active filters
  const getFilteredDataForTab = (tab: 'publikasi' | 'hki' | 'penelitian' | 'buku') => {
    let baseData: any[] = [];
    if (tab === 'penelitian') {
      baseData = research;
    } else if (tab === 'hki') {
      baseData = documents.filter((doc: any) => (doc.category || '').toLowerCase().includes('hki'));
    } else if (tab === 'buku') {
      baseData = documents.filter((doc: any) => (doc.category || '').toLowerCase().includes('buku'));
    } else { // publikasi
      baseData = documents.filter((doc: any) => 
        !(doc.category || '').toLowerCase().includes('hki') && 
        !(doc.category || '').toLowerCase().includes('buku')
      );
    }

    return baseData.filter(doc => {
      const titleText = tab === 'penelitian' ? doc.judul_penelitian : doc.title;
      const authorText = tab === 'penelitian' ? doc.user?.name : doc.user_name;
      const catText = tab === 'penelitian' ? doc.program : doc.category;

      const matchSearch = (titleText || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (authorText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (catText || '').toLowerCase().includes(searchTerm.toLowerCase());
            
      const itemFakultas = tab === 'penelitian' ? doc.user?.fakultas : doc.fakultas;
      const matchFakultas = selectedFakultas ? itemFakultas === selectedFakultas : true;

      return matchSearch && matchFakultas;
    });
  };

  // Dynamic Filtering based on activeTab (for UI rendering count)
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

  const filteredDocuments = useMemo(() => {
    return getFilteredDataForTab(activeTab);
  }, [activeTab, documents, research, searchTerm, selectedFakultas]);

  // Hitungan untuk Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handleExportExcel = async () => {
    if (documents.length === 0 && research.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const tabs: ('publikasi' | 'hki' | 'penelitian' | 'buku')[] = ['publikasi', 'hki', 'penelitian', 'buku'];

    tabs.forEach((tab) => {
      const data = getFilteredDataForTab(tab);
      const sheetName = tab.charAt(0).toUpperCase() + tab.slice(1);
      const sheet = workbook.addWorksheet(sheetName);

      // Show gridlines
      sheet.views = [{ showGridLines: true }];

      // Title Section
      sheet.mergeCells('A1:L1');
      const titleCell = sheet.getCell('A1');
      titleCell.value = `LAPORAN DATA ${sheetName.toUpperCase()} - PENTADOSEN`;
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(1).height = 30;

      // Subtitle Section
      sheet.mergeCells('A2:L2');
      const subtitleCell = sheet.getCell('A2');
      const dateStr = new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      subtitleCell.value = `Diekspor pada: ${dateStr}${selectedFakultas ? ` | Filter Fakultas: ${selectedFakultas}` : ''}${searchTerm ? ` | Kata Kunci: "${searchTerm}"` : ''}`;
      subtitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      sheet.getRow(2).height = 20;

      // Empty Row
      sheet.getRow(3).height = 10;

      // Define Columns and Headers
      let headers: string[] = [];
      let colWidths: { width: number }[] = [];

      if (tab === 'penelitian') {
        headers = [
          'No', 'ID Penelitian', 'Judul Penelitian', 'Program', 'Skema', 
          'Fokus', 'Dosen Pengaju', 'Fakultas', 'Status', 'Dana Disetujui', 
          'Poin Awarded', 'Tanggal Pengajuan'
        ];
        colWidths = [
          { width: 6 }, { width: 15 }, { width: 45 }, { width: 20 }, { width: 25 },
          { width: 20 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 20 },
          { width: 15 }, { width: 18 }
        ];
      } else {
        headers = [
          'No', 'ID Dokumen', `Judul ${sheetName}`, 'Kategori', 'Dosen Pengaju', 
          'Fakultas', 'Status', 'Tanggal Publikasi', 'Sumber', 'Status KPI', 
          'Poin Awarded', 'Tanggal Pengajuan'
        ];
        colWidths = [
          { width: 6 }, { width: 15 }, { width: 45 }, { width: 25 }, { width: 25 },
          { width: 25 }, { width: 15 }, { width: 18 }, { width: 12 }, { width: 15 },
          { width: 15 }, { width: 18 }
        ];
      }

      // Add Header Row
      const headerRowNumber = 4;
      const headerRow = sheet.getRow(headerRowNumber);
      headerRow.height = 28;
      
      headers.forEach((h, colIdx) => {
        const cell = headerRow.getCell(colIdx + 1);
        cell.value = h;
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        // Use primary indigo color for headers
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F46E5' } // Indigo 600
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF312E81' } },
          bottom: { style: 'medium', color: { argb: 'FF312E81' } },
          left: { style: 'thin', color: { argb: 'FF312E81' } },
          right: { style: 'thin', color: { argb: 'FF312E81' } }
        };
      });

      // Add Data Rows
      data.forEach((item, dataIdx) => {
        const rowNum = headerRowNumber + 1 + dataIdx;
        const row = sheet.getRow(rowNum);
        row.height = 22;

        let rowValues: any[] = [];
        const num = dataIdx + 1;
        const createdAt = item.created_at ? new Date(item.created_at) : null;

        if (tab === 'penelitian') {
          const author = item.user?.name || '';
          const fakultasVal = item.user?.fakultas || '';
          const dana = item.dana_disetujui || 0;
          rowValues = [
            num,
            item.id,
            item.judul_penelitian || '',
            item.program || '',
            item.skema || '',
            item.fokus || '',
            author,
            fakultasVal,
            item.status || 'Pending',
            dana,
            item.awarded_points || 0,
            createdAt
          ];
        } else {
          const author = item.user_name || '';
          const publishedAt = item.published_at ? new Date(item.published_at) : null;
          const source = item.file_url ? 'Manual' : 'Synced';
          const kpiStatus = item.is_kpi_counted ? 'KPI Aktif' : 'Arsip';
          rowValues = [
            num,
            item.id,
            item.title || '',
            item.category || '',
            author,
            item.fakultas || '',
            item.status || 'Pending',
            publishedAt,
            source,
            kpiStatus,
            item.awarded_points || 0,
            createdAt
          ];
        }

        // Write row values
        rowValues.forEach((val, colIdx) => {
          const cell = row.getCell(colIdx + 1);
          
          if (val instanceof Date) {
            cell.value = val;
            cell.numFmt = 'yyyy-mm-dd';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            cell.value = val ?? '-';
            
            // Alignment based on tab and column index
            if (tab === 'penelitian') {
              if ([2, 3, 4, 5, 6, 7].includes(colIdx)) {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              } else if (colIdx === 9) {
                cell.numFmt = '"Rp"#,##0';
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
              } else if (colIdx === 10) {
                cell.numFmt = '#,##0;-#,##0;0';
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              }
            } else {
              if ([2, 3, 4, 5].includes(colIdx)) {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              } else if (colIdx === 10) {
                cell.numFmt = '#,##0;-#,##0;0';
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              } else {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              }
            }
          }

          cell.font = { name: 'Arial', size: 10, color: { argb: 'FF334155' } };
          
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
          };

          if (dataIdx % 2 === 1) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF8FAFC' }
            };
          }
        });
      });

      colWidths.forEach((col, idx) => {
        sheet.getColumn(idx + 1).width = col.width;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    
    // File format: Semua-Dokumen_YYYYMMDD_HHMM.xlsx
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    
    const filename = `Semua-Dokumen_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
    saveAs(new Blob([buffer]), filename);
  };

  // Dynamic counts for top cards based on tab
  const totalCount = filteredDocsByTab.length;
  const approvedCount = filteredDocsByTab.filter(d => d.status === 'Approved').length;
  const pendingCount = filteredDocsByTab.filter(d => d.status === 'Pending' || d.status === 'Verified by Fakultas').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Semua Dokumen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Manajemen & Monitoring Seluruh Output Akademik
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={loading || (documents.length === 0 && research.length === 0)}
          className="flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
        >
          <FileDown className="h-4 w-4 mr-2 text-primary-600" />
          Export to excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: `Total ${activeTab}`, value: totalCount, icon: tabDetails[activeTab].icon, color: 'primary' },
          { label: 'Telah Disetujui', value: approvedCount, icon: Award, color: 'emerald' },
          { label: 'Menunggu Verifikasi', value: pendingCount, icon: Archive, color: 'gray' }
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

      {/* Navigation & Filters Card */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        
        {/* Card Header Tab Bar */}
        <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/10 overflow-x-auto scrollbar-hide">
          {(['publikasi', 'hki', 'penelitian', 'buku'] as const).map((tab) => {
             const IconComponent = tabDetails[tab].icon;
             return (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                   activeTab === tab 
                     ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-zinc-900' 
                     : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
                 }`}
               >
                 <IconComponent className="w-4 h-4" />
                 {tab}
               </button>
             );
          })}
        </div>

        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className={`hidden md:flex p-3 rounded-2xl shadow-sm border ${tabDetails[activeTab].colorClass}`}>
                 {React.createElement(tabDetails[activeTab].icon, { className: "h-6 w-6" })}
              </div>
              <div>
                 <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                   {tabDetails[activeTab].title}
                 </h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                   {tabDetails[activeTab].description}
                 </p>
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

              {/* Fakultas Filter Component */}
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
                {currentItems.map((doc) => {
                  const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
                  const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
                  const category = activeTab === 'penelitian' ? doc.program : doc.category;
                  const dateVal = activeTab === 'penelitian' ? doc.created_at : doc.published_at;

                  return (
                    <div key={doc.id} className="p-6 space-y-4 bg-white dark:bg-zinc-900">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 leading-snug uppercase tracking-tight">
                            {title}
                          </h4>
                          <div className="mt-2 flex items-center gap-2">
                             <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 uppercase tracking-tight border border-primary-100/50">
                                {category}
                             </span>
                             {activeTab !== 'penelitian' && !doc.file_url && (
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
                          <p className="text-[11px] font-bold text-gray-800 dark:text-zinc-300 truncate">{author}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {activeTab === 'penelitian' ? 'Diajukan' : 'Publikasi'}
                          </p>
                          <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {activeTab === 'penelitian' ? 'Skema / Fokus' : 'Status KPI'}
                          </p>
                          <div className="mt-0.5">
                            {activeTab === 'penelitian' ? (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 uppercase">
                                {doc.skema} / {doc.fokus}
                              </span>
                            ) : doc.is_kpi_counted ? (
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
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {activeTab === 'penelitian' ? 'Dana' : 'Poin'}
                          </p>
                          <p className="text-sm font-black text-gray-900 dark:text-zinc-100">
                            {activeTab === 'penelitian' 
                              ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui)
                              : `${doc.awarded_points || 0} PTS`}
                          </p>
                        </div>
                      </div>

                      {doc.status === 'Rejected' && doc.catatan && (
                        <div className="text-[10px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                          Catatan Umpan Balik: {doc.catatan}
                        </div>
                      )}

                      <div className="flex justify-end pt-2 gap-2">
                        {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                          <>
                            <button
                              onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title, category })}
                              className="inline-flex items-center px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              Preview
                            </button>
                            <a 
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-primary-500 hover:text-primary-600 text-gray-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm"
                            >
                              <Download className="w-4 h-4 mr-1.5" />
                              Unduh
                            </a>
                          </>
                        ) : (
                          <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-zinc-700 cursor-not-allowed italic">
                            <Globe className="w-3.5 h-3.5 mr-2" />
                            No File (Synced)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tampilan Desktop (Table) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                  <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">{activeTab === 'penelitian' ? 'Penelitian & Program' : 'Dokumen & Kategori'}</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Kontributor</th>
                      <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Tanggal</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">
                        {activeTab === 'penelitian' ? 'Dana' : 'Sumber'}
                      </th>
                      <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Poin</th>
                      <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                    {currentItems.map((doc) => {
                      const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
                      const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
                      const category = activeTab === 'penelitian' ? doc.program : doc.category;
                      const dateVal = activeTab === 'penelitian' ? doc.created_at : doc.published_at;

                      return (
                        <tr key={doc.id} className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] transition-colors">
                          <td className="px-6 py-6 max-w-[300px]">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-2">{title}</span>
                              <span className="mt-1.5 text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">{category}</span>
                              {doc.status === 'Rejected' && doc.catatan && (
                                <span className="mt-2 text-[9px] font-black text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30 w-fit lowercase tracking-wide leading-tight">
                                  Catatan: {doc.catatan}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-gray-500">
                                  {(author || 'D').charAt(0)}
                               </div>
                               <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{author}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap">
                            <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-zinc-500 italic">
                              <CalendarDays className="h-4 w-4 mr-1.5 text-gray-300" />
                              {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap text-center">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap text-center">
                            {activeTab === 'penelitian' ? (
                              <span className="text-xs font-black text-emerald-600 tabular-nums">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui || 0)}
                              </span>
                            ) : doc.file_url ? (
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
                                <span className="text-sm font-black text-gray-900 dark:text-zinc-100">{doc.awarded_points || 0}</span>
                                {activeTab !== 'penelitian' && doc.is_kpi_counted && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">KPI Verified</span>}
                             </div>
                          </td>
                          <td className="px-6 py-6 whitespace-nowrap text-right">
                            {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title, category })}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white rounded-xl border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                                  title="Preview Dokumen"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                </button>
                                <a 
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-primary-500 hover:text-primary-600 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                  title="Unduh File"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Unduh
                                </a>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 dark:text-zinc-700 text-[10px] font-black uppercase tracking-widest italic cursor-not-allowed">
                                 <Zap className="w-3.5 h-3.5" /> Auto-Sync
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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