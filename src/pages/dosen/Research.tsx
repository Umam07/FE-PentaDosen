import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle, XCircle, Clock, 
  CalendarDays, Award, Zap, ChevronLeft, ChevronRight,
  Landmark, Globe, Home, DollarSign, Beaker, ChevronDown,
  PieChart as PieChartIcon, Download, FileSpreadsheet, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart as ReChartsPie, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';

export default function Research({ user }: { user: any }) {
  const location = useLocation();
  const urlKategori = new URLSearchParams(location.search).get('kategori') || '';

  const [researchList, setResearchList] = useState([]);
  const [judulPenelitian, setJudulPenelitian] = useState('');
  const [danaDisetujui, setDanaDisetujui] = useState('');
  
  const [program, setProgram] = useState(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') return 'hibah luar negeri';
    if (urlKategori === 'Penelitian Hibah Eksternal') return 'hibah dikti';
    return 'hibah internal';
  });

  useEffect(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') setProgram('hibah luar negeri');
    else if (urlKategori === 'Penelitian Hibah Eksternal') setProgram('hibah dikti');
    else if (urlKategori === 'Penelitian Internal Institusi') setProgram('hibah internal');
  }, [urlKategori]);

  const [skema, setSkema] = useState('');
  const [fokus, setFokus] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // State loading
  const [isTableLoading, setIsTableLoading] = useState(true);
  
  // State untuk form upload
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // === State Preview Modal ===
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // === State untuk Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const loadResearch = async () => {
      setIsTableLoading(true);
      await fetchResearch();
      setIsTableLoading(false);
    };

    loadResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      const res = await fetch(`/api/penelitian?user_id=${user.id}&role=${user.role}`);
      const data = await res.json();
      setResearchList(data.penelitian || []);
    } catch (err) {
      console.error(err);
      setResearchList([]);
    }
  };

  const scoringPreview = useMemo(() => {
    const rawValue = danaDisetujui.replace(/\./g, '');
    if (!rawValue || isNaN(Number(rawValue))) return null;

    let basePoints = 0;
    if (program === 'hibah luar negeri') basePoints = 60;
    else if (program === 'hibah dikti') basePoints = 50;
    else if (program === 'hibah internal') basePoints = 40;

    const danaPoints = (Number(rawValue) / 1000000) * 0.05;
    const totalPoints = basePoints + danaPoints;

    return {
      base: basePoints,
      dana: danaPoints.toFixed(2),
      total: totalPoints.toFixed(2),
      message: `Estimasi Poin: ${basePoints} (Program) + ${danaPoints.toFixed(2)} (Dana) = ${totalPoints.toFixed(2)} Poin`
    };
  }, [program, danaDisetujui]);

  const stats = useMemo(() => {
    return {
      total: researchList.length,
      approved: researchList.filter((d: any) => d.status === 'Approved').length,
      pending: researchList.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: researchList.reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0).toFixed(2)
    };
  }, [researchList]);

  const programStats = useMemo(() => {
    const map = new Map();
    researchList.forEach((res: any) => {
      const prog = res.program || 'N/A';
      map.set(prog, (map.get(prog) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [researchList]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !judulPenelitian || !danaDisetujui || !program || !skema || !fokus || !tahun) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage('Ukuran file maksimal 10MB.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('judul_penelitian', judulPenelitian);
    formData.append('dana_disetujui', danaDisetujui.replace(/\./g, ''));
    formData.append('user_id', user.id);
    formData.append('program', program);
    formData.append('skema', skema);
    formData.append('fokus', fokus);
    formData.append('tahun', tahun);

    try {
      setLoading(true);
      const res = await fetch('/api/penelitian', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Penelitian berhasil diunggah!');
        setMessageType('success');
        setJudulPenelitian('');
        setDanaDisetujui('');
        setSkema('');
        setFokus('');
        setFile(null);
        setIsUploadModalOpen(false); // Tutup modal saat sukses
        
        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        let errorMsg = data.message || 'Gagal mengunggah penelitian.';
        if (data.errors && data.errors.judul_penelitian) {
          errorMsg = data.errors.judul_penelitian[0];
        }
        setMessage(errorMsg);
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        if (droppedFile.size <= 10 * 1024 * 1024) {
          setFile(droppedFile);
        } else {
          setMessage('Ukuran file maksimal 10MB.');
          setMessageType('error');
        }
      } else {
        setMessage('Hanya file PDF yang diperbolehkan.');
        setMessageType('error');
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/cms/templates');
      if (res.ok) {
        const data = await res.json();
        const template = data.templates?.find((t: any) => t.type === 'research');
        if (template && template.file_url) {
          window.open(template.file_url, '_blank');
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch custom template, falling back to generated template', e);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Template');

    sheet.columns = [
      { header: 'Judul Penelitian', key: 'judul', width: 35 },
      { header: 'Dana Disetujui', key: 'dana', width: 20 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'Skema', key: 'skema', width: 20 },
      { header: 'Fokus', key: 'fokus', width: 20 },
      { header: 'Tahun', key: 'tahun', width: 15 },
    ];

    // Example row
    sheet.addRow({
      judul: 'Analisis Sistem AI',
      dana: 10000000,
      program: 'hibah internal',
      skema: 'kompetisi',
      fokus: 'kesehatan',
      tahun: 2024
    });

    // Add validation for rows 2 to 1000
    for (let i = 2; i <= 1000; i++) {
      // Program (C)
      sheet.getCell(`C${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"hibah internal,hibah dikti,hibah luar negeri"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih program dari daftar dropdown.'
      };
      
      // Skema (D)
      sheet.getCell(`D${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kompetisi,pembinaan"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih skema dari daftar dropdown.'
      };
      
      // Fokus (E)
      sheet.getCell(`E${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kesehatan,ekonomi"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih fokus dari daftar dropdown.'
      };
    }

    // Protect header row (optional visual enhancement)
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Template_Import_Penelitian.xlsx');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage('Membaca file excel...');
    setMessageType('success');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setMessage('File excel kosong.');
          setMessageType('error');
          setIsImporting(false);
          return;
        }

        setMessage(`Mengimpor ${data.length} data...`);
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('judul_penelitian', row['Judul Penelitian'] || '');
          formData.append('dana_disetujui', (row['Dana Disetujui'] || '').toString().replace(/\./g, ''));
          formData.append('program', (row['Program'] || '').toLowerCase());
          formData.append('skema', (row['Skema'] || '').toLowerCase());
          formData.append('fokus', (row['Fokus'] || '').toLowerCase());
          formData.append('tahun', (row['Tahun'] || '').toString());
          
          const res = await fetch('/api/penelitian', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData,
          });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
            try {
              const errData = await res.json();
              if (errData.errors) {
                const firstErrorKey = Object.keys(errData.errors)[0];
                lastErrorMessage = errData.errors[firstErrorKey][0];
              } else if (errData.message) {
                lastErrorMessage = errData.message;
              }
            } catch (e) {}
          }
        }

        let finalMsg = `Import selesai. Berhasil: ${successCount}, Gagal: ${failCount}`;
        if (failCount > 0 && lastErrorMessage) {
          finalMsg += ` (Error: ${lastErrorMessage})`;
        }
        setMessage(finalMsg);
        setMessageType(failCount === 0 ? 'success' : 'error');
        setIsUploadModalOpen(false); // Tutup modal saat sukses
        
        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
        setTimeout(() => setMessage(''), 4500);

      } catch (err) {
        console.error(err);
        setMessage('Terjadi kesalahan saat mengimpor excel.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 4500);
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUploadPdfForResearch = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setMessage('Hanya file PDF yang diperbolehkan.');
      setMessageType('error');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setMessage('Ukuran file maksimal 10MB.');
      setMessageType('error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/penelitian/${id}/upload-pdf`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('PDF berhasil diunggah!');
        setMessageType('success');
        
        setIsTableLoading(true);
        await fetchResearch();
        setIsTableLoading(false);
      } else {
        setMessage(data.message || 'Gagal mengunggah PDF.');
        setMessageType('error');
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat mengunggah PDF.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = researchList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(researchList.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Dashboard Summary Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Penelitian', value: stats.total, icon: Beaker, color: 'blue' },
          { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
          { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
          { label: 'Poin Penelitian', value: stats.points, icon: Award, color: 'indigo' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl ${
              item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' :
              item.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
              item.color === 'amber' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' :
              'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
            }`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">{item.label}</p>
              {isTableLoading ? (
                <div className="h-6 w-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 mt-0.5">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Upload Action Bar Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Kelola Hasil Penelitian</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Registrasikan penelitian baru atau impor data dari Excel secara massal</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95"
          >
            Unggah Penelitian Baru
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </button>
          <button 
            type="button"
            onClick={handleDownloadTemplate}
            className="inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm uppercase tracking-wider"
          >
            <Download className="w-4 h-4 mr-2" />
            Template
          </button>
          <label className={`inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer uppercase tracking-wider ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImportExcel} disabled={isImporting} />
          </label>
        </div>
      </motion.div>



          {/* History Table */}
          <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Penelitian</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800 text-sm">
            <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Penelitian</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Program & Skema</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tahun</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Dana</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Dokumen</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {isTableLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4 bg-gray-50/50 h-16"></td>
                  </tr>
                ))
              ) : currentItems.length > 0 ? (
                currentItems.map((res: any) => (
                  <tr key={res.id} className="hover:bg-primary-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <Beaker className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight truncate max-w-md">{res.judul_penelitian}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #RES-{res.id.toString().padStart(4, '0')}</p>
                          {res.status === 'Rejected' && res.catatan && (
                            <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                              Catatan Umpan Balik: {res.catatan}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-wide">{res.program}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">{res.skema}</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">{res.fokus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-black text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                        {res.tahun}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-emerald-600 tabular-nums">
                      {formatCurrency(res.dana_disetujui)}
                    </td>
                    <td className="px-6 py-4">
                      {res.file_url && res.file_url !== '-' ? (
                        <button
                          onClick={() => setPreviewDoc({ fileUrl: res.file_url, title: res.judul_penelitian, category: res.program })}
                          className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-md"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          Lihat
                        </button>
                      ) : (
                        <label className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary-600 cursor-pointer bg-gray-50 hover:bg-primary-50 px-2 py-1 rounded-md transition-colors">
                          {uploadingPdfId === res.id ? (
                            <span className="animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 mr-1" />
                              Upload
                              <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdfForResearch(e, res.id)} disabled={uploadingPdfId === res.id} />
                            </>
                          )}
                        </label>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        res.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        res.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                        res.status === 'Verified by Fakultas' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {res.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : res.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-primary-600">+{res.awarded_points}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
                    Belum ada data penelitian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* Enhanced Pagination Controls */}
        {!isTableLoading && researchList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, researchList.length)} of {researchList.length} entries
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-2 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Per Page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 py-1 pl-2 pr-6 focus:ring-2 focus:ring-primary-200 outline-none cursor-pointer"
                >
                  {[10, 25, 50, 100].map(val => (
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
          </section>


  {/* Upload Penelitian Modal Pop-up */}
  <AnimatePresence>
    {isUploadModalOpen && (
      <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
          onClick={() => setIsUploadModalOpen(false)}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 shrink-0">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-500" />
                Unggah Penelitian Baru
              </h3>
              <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Registrasikan hasil penelitian hibah eksternal, internal, atau luar negeri</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Left Side: Upload Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* Program Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori Program Penelitian</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { key: 'hibah internal', label: 'Hibah Internal', icon: Home, pts: 40 },
                        { key: 'hibah dikti', label: 'Hibah Dikti', icon: Landmark, pts: 50 },
                        { key: 'hibah luar negeri', label: 'Hibah Luar Negeri', icon: Globe, pts: 60 },
                      ].map(item => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setProgram(item.key)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            program === item.key
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-extrabold shadow-sm'
                              : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-500 hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                          <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{item.pts} Pts Base</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Judul Penelitian */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Penelitian</label>
                    <input
                      type="text"
                      required
                      value={judulPenelitian}
                      onChange={(e) => setJudulPenelitian(e.target.value)}
                      placeholder="Masukkan judul penelitian..."
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Skema */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Skema Penelitian</label>
                      <select
                        value={skema}
                        onChange={(e) => setSkema(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="">Pilih Skema...</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="kompetisi">Kompetisi</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="pembinaan">Pembinaan</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="lainnya">Lainnya</option>
                      </select>
                    </div>

                    {/* Fokus */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Fokus Penelitian</label>
                      <select
                        value={fokus}
                        onChange={(e) => setFokus(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="">Pilih Fokus...</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="kesehatan">Kesehatan</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="ekonomi">Ekonomi</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="teknologi">Teknologi</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="sosial">Sosial</option>
                        <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dana Disetujui */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Dana Disetujui</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-sm font-black text-gray-400 uppercase">Rp</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={danaDisetujui}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            const formatted = val ? Number(val).toLocaleString('id-ID') : '';
                            setDanaDisetujui(formatted);
                          }}
                          placeholder="Contoh: 10.000.000"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    {/* Tahun */}
                    <div className="space-y-2 relative">
                      <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                        Tahun Pelaksanaan
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-left flex justify-between items-center text-gray-900 dark:text-zinc-100"
                      >
                        <span>{tahun}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isYearDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setIsYearDropdownOpen(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute z-30 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden origin-top"
                            >
                              <div className="max-h-48 overflow-y-auto p-2.5 grid grid-cols-3 gap-1.5">
                                {Array.from({ length: 24 }, (_, i) => {
                                  const y = (new Date().getFullYear() - 10 + i).toString();
                                  return (
                                    <button
                                      key={y}
                                      type="button"
                                      onClick={() => { setTahun(y); setIsYearDropdownOpen(false); }}
                                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                        tahun === y
                                          ? 'bg-primary-600 border-primary-600 text-white'
                                          : 'border-transparent bg-gray-50/50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 hover:border-primary-200'
                                      }`}
                                    >
                                      {y}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Drag and Drop PDF */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Laporan Kemajuan / Akhir (PDF)</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('res-file-input-modal')?.click()}
                      className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                        isDragging 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                          : file 
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                            : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
                      }`}
                    >
                      <input
                        id="res-file-input-modal"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div className="space-y-3 text-center">
                        <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isDragging ? 'scale-110 bg-primary-600' : 
                          file ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                        }`}>
                          {file ? (
                            <CheckCircle className="h-6 w-6 text-emerald-600 animate-bounce" />
                          ) : (
                            <Upload className={`h-6 w-6 text-gray-400 group-hover:text-primary-600`} />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 px-4">
                          <p className="text-xs font-black text-gray-800 dark:text-zinc-200">
                            {file ? 'Laporan Terpilih!' : 'Drag & Drop PDF'}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                            {file ? file.name : 'Klik atau seret file laporan ke sini'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    {scoringPreview ? (
                      <div className="px-4 py-2.5 rounded-xl border-2 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                        <Upload className="h-5 w-5 shrink-0 text-emerald-600" />
                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Estimasi Poin</p>
                          <p className="text-xs font-black truncate">{scoringPreview.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="px-5 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {loading ? 'Mengunggah...' : 'Unggah Penelitian'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Side: Guidelines & Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* 1. Card Panduan Poin Penelitian */}
                <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Panduan Poin Penelitian</h4>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Hibah Luar Negeri', pts: '60 Pts Base', desc: 'Penelitian tingkat internasional' },
                      { label: 'Hibah Dikti (Eksternal)', pts: '50 Pts Base', desc: 'Hibah nasional / kementerian' },
                      { label: 'Hibah Internal Institusi', pts: '40 Pts Base', desc: 'Pendanaan internal kampus' },
                      { label: 'Multiplier Dana', pts: '+0.05 / Juta', desc: 'Tambahan poin dari dana disetujui' },
                    ].map((w) => (
                      <div key={w.label} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-50 dark:border-zinc-800 hover:border-gray-100 dark:hover:border-zinc-700 transition-colors">
                        <div>
                          <span className="block text-[10px] font-black text-gray-800 dark:text-zinc-300 uppercase tracking-wide">{w.label}</span>
                          <span className="block text-[9px] font-bold text-gray-400 mt-0.5">{w.desc}</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 shrink-0">
                          {w.pts}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Informasi Verifikasi */}
                <div className="p-4 bg-primary-50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/30 rounded-xl">
                  <h4 className="text-[10px] font-black uppercase text-primary-800 dark:text-primary-300 tracking-wider mb-1">Informasi Verifikasi</h4>
                  <p className="text-[9px] font-bold text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
                    Dokumen laporan penelitian yang diunggah akan diverifikasi terlebih dahulu sebelum masuk ke penghitungan performa kinerja KPI dosen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* Floating Toast Notification */}
  <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
            messageType === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/90 backdrop-blur border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-950/90 backdrop-blur border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-400'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
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
