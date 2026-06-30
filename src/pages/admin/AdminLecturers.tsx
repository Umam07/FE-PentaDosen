import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, Search, ChevronRight, Mail, BookOpen, ChevronLeft, Filter, BadgeCheck, FileDown
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function AdminLecturers() {
  const { user } = useOutletContext<{ user: any }>();
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/lecturers?role=${user?.role}&user_id=${user?.id}`);
      const data = await res.json();
      setLecturers(data.lecturers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLecturers = lecturers.filter((l: any) => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFakultas = selectedFakultas ? l.fakultas === selectedFakultas : true;
    return matchSearch && matchFakultas;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLecturers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);

  const handleExportExcel = async () => {
    if (filteredLecturers.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Daftar Dosen');

    // Show gridlines
    sheet.views = [{ showGridLines: true }];

    // Title Section
    sheet.mergeCells('A1:Q1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'DATABASE DOSEN - PENTADOSEN';
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(1).height = 30;

    // Metadata Section
    sheet.mergeCells('A2:Q2');
    const metaCell = sheet.getCell('A2');
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    metaCell.value = `Diekspor oleh : ${user?.name || 'Admin'}  |  Diekspor pada : ${dateStr}`;
    metaCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(2).height = 20;

    // Filter Section
    sheet.mergeCells('A3:Q3');
    const filterCell = sheet.getCell('A3');
    filterCell.value = `Filter Fakultas : ${selectedFakultas || 'Semua Fakultas'}  |  Kata Kunci : "${searchTerm || '-'}"`;
    filterCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(3).height = 20;

    // Empty row
    sheet.getRow(4).height = 10;

    // Headers & widths
    const headers = [
      'No', 'Penta ID', 'NIDN', 'Nama', 'Prodi', 'ID Scholar', 'ID Scopus',
      'Total KPI', 'Poin External', 'Poin Internal', 'Dokumen GS', 'Sitasi GS',
      'H-Index GS', 'I10-Index GS', 'Dokumen Scopus', 'Sitasi Scopus', 'H-Index Scopus'
    ];

    const colWidths = [
      { width: 6 }, { width: 14 }, { width: 16 }, { width: 35 }, { width: 25 }, 
      { width: 18 }, { width: 18 }, { width: 12 }, { width: 15 }, { width: 15 }, 
      { width: 14 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 16 }, 
      { width: 14 }, { width: 16 }
    ];

    // Set header row
    const headerRowNumber = 5;
    const headerRow = sheet.getRow(headerRowNumber);
    headerRow.height = 28;

    headers.forEach((h, colIdx) => {
      const cell = headerRow.getCell(colIdx + 1);
      cell.value = h;
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
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

    // Populate data
    filteredLecturers.forEach((lec, dataIdx) => {
      const rowNum = headerRowNumber + 1 + dataIdx;
      const row = sheet.getRow(rowNum);
      row.height = 22;

      const rowValues = [
        dataIdx + 1,
        lec.penta_id || '-',
        lec.nidn || '-',
        lec.name || '',
        lec.program_studi || '-',
        lec.scholar_id || '-',
        lec.scopus_id || '-',
        Math.round(lec.total_kpi_points || 0),
        Math.round(lec.poin_external || 0),
        Math.round(lec.poin_internal || 0),
        lec.scholar_document_count || 0,
        lec.total_citations || 0,
        lec.h_index || 0,
        lec.i10_index || 0,
        lec.scopus_document_count || 0,
        lec.scopus_total_citations || 0,
        lec.scopus_h_index || 0
      ];

      rowValues.forEach((val, colIdx) => {
        const cell = row.getCell(colIdx + 1);
        cell.value = val;
        cell.font = { name: 'Arial', size: 10, color: { argb: 'FF334155' } };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        // Alignments
        if (colIdx === 0 || colIdx === 1 || colIdx === 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (colIdx === 3 || colIdx === 4) {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        } else if (colIdx === 5 || colIdx === 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        // Formats
        if (colIdx === 7 || colIdx === 8 || colIdx === 9) {
          cell.numFmt = '#,##0.0;-#,##0.0;0.0';
        } else if (colIdx >= 10) {
          cell.numFmt = '#,##0';
        }

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

    const buffer = await workbook.xlsx.writeBuffer();
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    const filename = `Daftar-Dosen_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
    saveAs(new Blob([buffer]), filename);
  };

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Database Dosen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Manajemen Database Dosen, Dokumen Akademik & Pemantauan Kinerja
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={loading || filteredLecturers.length === 0}
          className="flex items-center justify-center px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm text-xs font-black uppercase tracking-widest text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <FileDown className="h-4 w-4 mr-2 text-primary-600" />
          Export to excel
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Eksplorasi Profil</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Daftar Dosen di Lingkungan {user?.role === 'admin lppm' ? 'Universitas' : 'Fakultas'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full xl:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama dosen atau program studi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                  disabled={loading}
                />
              </div>
              {user?.role === 'admin lppm' && (
                <div className="relative w-full sm:w-[220px]">
                  <select
                    value={selectedFakultas}
                    onChange={(e) => setSelectedFakultas(e.target.value)}
                    className="appearance-none w-full px-5 py-3 pl-11 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm"
                    disabled={loading}
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
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Memuat Database...</p>
             </div>
          ) : filteredLecturers.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <Users className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic tracking-[0.2em]">Data Tidak Ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800 whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                  <tr>
                    {['Nama Dosen', 'Fakultas / Prodi', 'ID Scholar', 'ID Scopus', 'Total KPI'].map((h, i) => (
                      <th 
                        key={i} 
                        className={`px-6 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em] ${
                          h === 'Total KPI' ? 'text-right pr-16' :
                          h === 'ID Scholar' || h === 'ID Scopus' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-100/0 divide-y divide-gray-50 dark:divide-zinc-800">
                  {currentItems.map((lecturer: any, index: number) => (
                    <motion.tr 
                      key={lecturer.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className="group transition-all hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] cursor-pointer"
                      onClick={() => navigate(`/admin/lecturers/${lecturer.id}`)}
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {lecturer.thumbnail ? (
                            <img 
                              src={lecturer.thumbnail} 
                              alt="" 
                              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary-100/50 transition-all shadow-md"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 text-lg font-black border border-gray-200 dark:border-zinc-700 shadow-inner">
                              {lecturer.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors flex items-center gap-1.5">
                              {lecturer.name}
                              {lecturer.total_kpi_points > 100 && <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />}
                            </p>
                            <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">
                              <Mail className="w-3 h-3 mr-1.5 text-primary-400/70" />
                              {lecturer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                            {lecturer.program_studi || 'N/A'}
                          </span>
                          {lecturer.fakultas && (
                            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                              {lecturer.fakultas}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        {lecturer.scholar_id ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                            <span className="font-mono">{lecturer.scholar_id}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider italic shadow-sm">
                            Not Configured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-center">
                        {lecturer.scopus_id ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <GraduationCap className="h-3.5 w-3.5 text-orange-500" />
                            <span className="font-mono">{lecturer.scopus_id}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/30 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider italic shadow-sm">
                            Not Configured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 group/pts">
                          <div className="text-right">
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider border border-emerald-500/20 shadow-inner tabular-nums">
                              {Math.round(lecturer.total_kpi_points || 0).toLocaleString()} pts
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-850 text-gray-400 group-hover/pts:text-primary-500 group-hover/pts:bg-primary-500/10 dark:group-hover/pts:bg-primary-500/20 group-hover/pts:border-primary-200/50 border border-transparent transition-all duration-300 shadow-sm">
                             <ChevronRight className="w-4 h-4 translate-x-0 group-hover/pts:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredLecturers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLecturers.length)} of {filteredLecturers.length}
              </span>
              <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold py-1 px-3 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer shadow-sm"
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
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 scale-105' 
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