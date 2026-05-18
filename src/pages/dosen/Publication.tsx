import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, FileText, CheckCircle, XCircle, Clock, CalendarDays, Shield, Archive, Award, Zap, ChevronLeft, ChevronRight, AlertCircle, Filter, ChevronDown, Download, FileSpreadsheet, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function Publication({ user }: { user: any }) {
  const location = useLocation();
  // Baca filter kategori dari URL query param (?kategori=HKI dsb)
  const urlKategori = new URLSearchParams(location.search).get('kategori') || '';

  const [documents, setDocuments] = useState([]);
  const [weights, setWeights] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  // State loading
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isWeightsLoading, setIsWeightsLoading] = useState(true);
  
  // State untuk form upload
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Link Research States
  const [approvedResearch, setApprovedResearch] = useState([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<any>(null);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  // === State untuk Pagination ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchWeights();
    fetchApprovedResearch();

    const loadDocuments = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      setIsTableLoading(false);
    };

    loadDocuments();
  }, []);

  // Sync category state saat user berpindah sub-kategori di sidebar
  useEffect(() => {
    if (urlKategori) {
      if (urlKategori === 'HKI') {
         setCategory('HKI Paten');
      } else {
         setCategory(urlKategori);
      }
    }
  }, [urlKategori]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/documents`);
      const data = await res.json();
      setDocuments(data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeights = async () => {
    setIsWeightsLoading(true);
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      setWeights(data.weights);
      // Kategori di-set dari urlKategori (pilihan sidebar), bukan dari dropdown
      if (urlKategori) {
        setCategory(urlKategori);
      } else if (data.weights.length > 0) {
        setCategory(data.weights[0].category);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeightsLoading(false);
    }
  };

  const fetchApprovedResearch = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/approved-penelitian`);
      const data = await res.json();
      if (data.success) {
        setApprovedResearch(data.penelitian);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkToResearch = async (penelitianId: number) => {
    if (!docToLink) return;
    try {
      setIsLinkingLoading(true);
      const res = await fetch(`/api/documents/${docToLink.id}/link-penelitian`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ penelitian_id: penelitianId })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Dokumen berhasil dihubungkan ke penelitian!');
        setMessageType('success');
        setIsLinkingModalOpen(false);
        fetchDocuments(); // Refresh to show linked research title
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal menghubungkan dokumen.');
      setMessageType('error');
    } finally {
      setIsLinkingLoading(false);
      setDocToLink(null);
    }
  };



  const scoringPreview = useMemo(() => {
    if (docType === 'arsip') {
      return {
        type: 'arsip' as const,
        message: 'Kategori Arsip: Dokumen disimpan sebagai arsip (0 Poin)',
        points: 0,
      };
    }

    if (!tahun) return null;

    const selectedWeight = weights.find((w: any) => w.category === category);
    const pts = selectedWeight ? (selectedWeight as any).weight_value : 0;

    return {
      type: 'kpi' as const,
      message: `Masuk Penghitungan KPI: +${pts} Poin`,
      points: pts,
    };
  }, [tahun, docType, category, weights]);

  // Filter dokumen berdasarkan kategori dari sidebar (query param)
  const filteredDocuments = useMemo(() => {
    if (!urlKategori) return documents;
    return documents.filter((d: any) =>
      (d.category || '').toLowerCase() === urlKategori.toLowerCase()
    );
  }, [documents, urlKategori]);

  const stats = useMemo(() => {
    const src = filteredDocuments;
    return {
      total: src.length,
      approved: src.filter((d: any) => d.status === 'Approved').length,
      pending: src.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Prodi').length,
      points: src.reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
    };
  }, [filteredDocuments]);

  const categoryStats = useMemo(() => {
    const map = new Map();
    documents.forEach((doc: any) => {
      const cat = doc.category || 'Belum Ada Kategori';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [documents]);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: any) => 
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      doc.is_kpi_counted
    );
  }, [title, documents]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !tahun) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    if (duplicateFound) {
      setMessage('Dokumen ini sudah terdata dalam sistem.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', user.id);
    formData.append('published_at', `${tahun}-01-01`);
    formData.append('doc_type', docType);

    try {
      setLoading(true);
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Dokumen berhasil diunggah!');
        setMessageType('success');
        setTitle('');
        setFile(null);
        setTahun(new Date().getFullYear().toString());
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1); // Reset ke halaman 1 setelah upload berhasil
        setIsTableLoading(false);
      } else {
        setMessage('Gagal mengunggah dokumen.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
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
        setFile(droppedFile);
      } else {
        setMessage('Hanya file PDF yang diperbolehkan.');
        setMessageType('error');
      }
    }
  };

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Template');
    const refSheet = workbook.addWorksheet('Referensi');
    refSheet.state = 'hidden';

    const validCategories = weights.map((w: any) => w.category);
    validCategories.forEach((cat, idx) => {
      refSheet.getCell(`A${idx + 1}`).value = cat;
    });

    sheet.columns = [
      { header: 'Judul Publikasi', key: 'judul', width: 40 },
      { header: 'Kategori', key: 'kategori', width: 30 },
      { header: 'Tahun Terbit', key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      judul: 'Implementasi AI dalam Pendidikan',
      kategori: validCategories[0] || 'Jurnal Internasional',
      tahun: new Date().getFullYear(),
      tipe: 'kpi'
    });

    for (let i = 2; i <= 1000; i++) {
      if (validCategories.length > 0) {
        sheet.getCell(`B${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`Referensi!$A$1:$A$${validCategories.length}`],
          showErrorMessage: true,
          errorTitle: 'Input Tidak Valid',
          error: 'Silakan pilih kategori dari daftar dropdown.'
        };
      }
      sheet.getCell(`D${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kpi,arsip"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih tipe dokumen (kpi / arsip).'
      };
    }

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Template_Import_Publikasi.xlsx');
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
          formData.append('title', row['Judul Publikasi'] || '');
          formData.append('category', row['Kategori'] || '');
          formData.append('published_at', `${row['Tahun Terbit'] || new Date().getFullYear()}-01-01`);
          formData.append('doc_type', (row['Tipe Dokumen'] || 'kpi').toLowerCase());

          const res = await fetch('/api/documents', {
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
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);

      } catch (err) {
        console.error(err);
        setMessage('Terjadi kesalahan saat mengimpor excel.');
        setMessageType('error');
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  // === Logika Pagination (gunakan filteredDocuments) ===
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">
      {/* Filter Banner (muncul hanya kalau ada kategori aktif) */}
      {urlKategori && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl"
        >
          <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <span className="text-xs font-black text-primary-800 dark:text-primary-200 uppercase tracking-widest">
            Menampilkan kategori: <span className="text-primary-600 dark:text-primary-400">{urlKategori}</span>
          </span>
          <span className="ml-auto text-[10px] font-bold text-primary-400 dark:text-primary-500 uppercase tracking-widest">
            {filteredDocuments.length} dokumen
          </span>
        </motion.div>
      )}

      {/* Dashboard Summary Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Dokumen', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
          { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
          { label: 'Total Poin KPI', value: stats.points, icon: Award, color: 'indigo' },
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

      {/* Upload Form Section */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Unggah Publikasi Baru</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Template Excel
              </button>
              <label className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                {isImporting ? 'Importing...' : 'Import Excel'}
                <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImportExcel} disabled={isImporting} />
              </label>
            </div>
          </div>
          
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`text-xs font-bold px-4 py-2 rounded-full flex items-center shadow-sm ${
                  messageType === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                }`}
              >
                {messageType === 'success' ? <CheckCircle className="w-3.5 h-3.5 mr-2" /> : <XCircle className="w-3.5 h-3.5 mr-2" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <form onSubmit={handleUpload} className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDocType('kpi')}
                className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                  docType === 'kpi'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10 ring-4 ring-emerald-500/10'
                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                  docType === 'kpi' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/10'
                }`}>
                  <Award className={`w-6 h-6 transition-colors ${docType === 'kpi' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <p className={`text-sm font-black uppercase tracking-tight ${docType === 'kpi' ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-zinc-200'}`}>
                    Poin Kedosanan (KPI)
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Automated Scoring System</p>
                </div>
                {docType === 'kpi' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setDocType('arsip')}
                className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                  docType === 'arsip'
                    ? 'border-gray-500 bg-gray-50 dark:bg-zinc-800 ring-4 ring-gray-500/10'
                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                  docType === 'arsip' ? 'bg-gray-200 dark:bg-zinc-700' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200/60 dark:group-hover:bg-zinc-700/60'
                }`}>
                  <Archive className={`w-6 h-6 transition-colors ${docType === 'arsip' ? 'text-gray-600 dark:text-zinc-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                </div>
                <div className="text-left min-w-0">
                  <p className={`text-sm font-black uppercase tracking-tight ${docType === 'arsip' ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-zinc-200'}`}>
                    Arsip / Dokumen Umum
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Storage Only (0 Points)</p>
                </div>
                {docType === 'arsip' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Judul Publikasi
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                    placeholder="Masukkan judul berkas/kegiatan..."
                  />
                  {docType === 'kpi' && title.length > 3 && !duplicateFound && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-[10px] font-bold text-primary-500 flex items-center bg-primary-50 px-2 py-1 rounded-lg w-fit"
                    >
                      <Zap className="w-3 h-3 mr-1.5 fill-current" />
                      Auto-Verification Enabled
                    </motion.p>
                  )}

                  {duplicateFound && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Dokumen Sudah Terdata (Akses Dibatasi)</p>
                        <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                          Dokumen dengan judul ini sudah terhitung dalam poin KPI. Pengunggahan dibatasi untuk menghindari duplikasi data dan kecurangan.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Kategori otomatis dari pilihan sidebar — ditampilkan sebagai badge readonly, ATAU grid kartu HKI */}
              {category && (() => {
                const activeWeight = weights.find((w: any) => w.category === category);
                
                if (urlKategori === 'HKI') {
                  const hkiOptions = [
                    { id: 'HKI Paten', label: 'Paten', pts: 40, icon: Award, color: 'blue' },
                    { id: 'HKI Paten Sederhana', label: 'Paten Sederhana', pts: 20, icon: Zap, color: 'emerald' },
                    { id: 'HKI Merk', label: 'Merk', pts: 5, icon: Shield, color: 'amber' },
                    { id: 'HKI Hak Cipta', label: 'Hak Cipta', pts: 5, icon: FileText, color: 'purple' },
                  ];
                  return (
                    <div className="md:col-span-2 space-y-3 mt-4 mb-2">
                      <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                        <Shield className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                        Jenis HKI
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {hkiOptions.map((opt) => (
                          <motion.button
                            key={opt.id}
                            type="button"
                            onClick={() => setCategory(opt.id)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                              category === opt.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10 shadow-md'
                                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                              category === opt.id 
                                ? 'bg-primary-100 dark:bg-primary-900/40 scale-110' 
                                : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30'
                            }`}>
                              <opt.icon className={`w-5 h-5 transition-colors ${category === opt.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
                            </div>
                            <p className={`text-[10px] sm:text-xs font-black uppercase text-center tracking-tight ${category === opt.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-500 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-zinc-200'}`}>
                              {opt.label}
                            </p>
                            <p className={`text-[9px] font-bold mt-1.5 transition-colors ${category === opt.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-400'}`}>+{opt.pts} Poin</p>
                            
                            <AnimatePresence>
                              {category === opt.id && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }} 
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  className="absolute top-2 right-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-primary-500" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Tampilkan Readonly Badge
                return (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                      Kategori Publikasi
                    </label>
                    <div className="w-full px-4 py-3 bg-primary-50 dark:bg-primary-950/20 border-2 border-primary-200 dark:border-primary-800/40 rounded-xl flex items-center gap-3">
                      <Shield className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm font-black text-primary-800 dark:text-primary-200 uppercase tracking-tight flex-1">
                        {category}
                      </span>
                      {activeWeight && (
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex-shrink-0">
                          +{activeWeight.weight_value} PTS
                        </span>
                      )}
                    </div>
                    {/* Hidden input agar form validation tetap berjalan */}
                    <input type="hidden" value={category} />
                  </div>
                );
              })()}

              <div className="space-y-2 relative">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                  Tahun Penelitian
                </label>
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-left flex justify-between items-center"
                >
                  <span className="text-gray-900 dark:text-zinc-100">{tahun}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isYearDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setIsYearDropdownOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-30 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden origin-top"
                      >
                        <div className="max-h-64 overflow-y-auto p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {Array.from({ length: 24 }, (_, i) => {
                            const y = (new Date().getFullYear() - 10 + i).toString();
                            return (
                              <button
                                key={y}
                                type="button"
                                onClick={() => {
                                  setTahun(y);
                                  setIsYearDropdownOpen(false);
                                }}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                  tahun === y 
                                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-none' 
                                    : 'border-transparent bg-gray-50/50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-300 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
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

              <div className="flex items-end">
                {scoringPreview ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={scoringPreview.type}
                    className={`w-full px-5 py-3 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    scoringPreview.type === 'kpi'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                      : 'bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30 text-primary-800 dark:text-primary-400'
                  }`}>
                    {scoringPreview.type === 'kpi' ? (
                      <Award className="h-6 w-6 shrink-0 text-emerald-600" />
                    ) : (
                      <Archive className="h-6 w-6 shrink-0" />
                    )}
                    <div className="min-w-0">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimation Result</p>
                       <p className="text-xs lg:text-sm font-black truncate">{scoringPreview.message}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-full px-5 py-3 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/30 flex items-center gap-4">
                     <Clock className="w-6 h-6 text-gray-300" />
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Waiting for parameters...</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  File Dokumen (PDF)
                </label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className={`relative group mt-1 flex justify-center px-6 py-10 lg:py-16 border-2 rounded-2xl lg:rounded-[2rem] transition-all duration-300 cursor-pointer ${
                    isDragging 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                      : file 
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                        : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/10'
                  }`}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="space-y-4 text-center">
                    <div className={`mx-auto h-16 w-16 lg:h-20 lg:w-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging ? 'scale-110 bg-primary-600' : 
                      file ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-primary-200'
                    }`}>
                      {file ? (
                        <CheckCircle className="h-8 w-8 lg:h-10 lg:w-10 text-emerald-600 animate-bounce" />
                      ) : (
                        <Upload className={`h-8 w-8 lg:h-10 lg:w-10 transition-colors ${isDragging ? 'text-white' : 'text-gray-400 dark:text-zinc-400 group-hover:text-primary-600'}`} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 px-4">
                      <p className={`text-base lg:text-xl font-black transition-colors ${file ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-900 dark:text-zinc-100'}`}>
                        {file ? 'Dokumen Tersegmentasi!' : 'Metode Drag & Drop'}
                      </p>
                      <p className="text-[11px] lg:text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                        {file ? file.name : 'Klik area ini atau jatuhkan file PDF Anda'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-zinc-800">
              <button
                type="submit"
                disabled={loading || !!duplicateFound}
                className="w-full sm:w-auto inline-flex items-center justify-center py-4 px-10 border border-transparent shadow-xl shadow-primary-200 dark:shadow-primary-900/30 text-sm font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? 'Processing...' : 'Submit Document'}
                {!loading && <Zap className="w-4 h-4 ml-2 fill-white" />}
              </button>
            </div>
          </form>

          {/* === Panel Informasi & Ringkasan Visual === */}
          <div className="space-y-6 lg:col-span-1">


            {/* 1. Card Panduan Poin KPI */}
            {isWeightsLoading ? (
              <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                  <div className="w-7 h-7 bg-gray-200 dark:bg-zinc-700 rounded-lg shrink-0"></div>
                  <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                </div>
                <div className="space-y-2 pr-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2 rounded-xl border border-gray-50 dark:border-zinc-800">
                      <div className="h-2.5 w-24 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                      <div className="h-4 w-12 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : weights.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Panduan Poin Kategori</h4>
                </div>
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {weights.slice(0, 5).map((w: any) => (
                    <div key={w.category} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2 rounded-xl border border-gray-50 dark:border-zinc-800 hover:border-gray-100 dark:hover:border-zinc-700 transition-colors">
                      <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-300 truncate max-w-[150px] uppercase tracking-wide" title={w.category}>{w.category}</span>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">+{w.weight_value} PTS</span>
                    </div>
                  ))}
                  {weights.length > 5 && (
                    <p className="text-[9px] font-black text-center text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">+ {weights.length - 5} kategori lainnya</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. Card Visual Chart (Jika Ada Dokumen) */}
            {isTableLoading ? (
               <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center animate-pulse">
                 <div className="w-full flex items-center gap-2 mb-2 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                   <div className="w-7 h-7 bg-gray-200 dark:bg-zinc-700 rounded-lg shrink-0"></div>
                   <div className="h-3 w-28 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                 </div>
                 <div className="h-40 w-full flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-700"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full mt-2 border-t border-gray-100/80 dark:border-zinc-800/80 pt-3">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 shrink-0"></div>
                       <div className="h-2 w-16 bg-gray-200 dark:bg-zinc-700 rounded"></div>
                     </div>
                   ))}
                 </div>
               </div>
            ) : documents.length > 0 && categoryStats.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5 flex flex-col items-center"
              >
                <div className="w-full flex items-center gap-2 mb-2 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Komposisi Dokumen</h4>
                </div>
                
                <div className="h-40 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryStats.slice(0, 5).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 5]} 
                            className="stroke-white dark:stroke-zinc-900 stroke-2 outline-none"
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 p-2 rounded-xl shadow-lg ring-1 ring-black/5">
                                <p className="text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400">{payload[0].name}</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{payload[0].value} <span className="text-xs font-bold text-gray-400">Berkas</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 w-full mt-2 border-t border-gray-100/80 dark:border-zinc-800/80 pt-3">
                  {categoryStats.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 5] }}></div>
                      <span className="text-[9px] font-black text-gray-500 dark:text-zinc-400 truncate uppercase tracking-dense leading-none" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Document History Table - FULLY RESPONSIVE */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
          <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Publikasi</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
            <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
              <tr>
                <th className="px-4 lg:px-8 py-4 text-left text-[9px] lg:text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Informasi Publikasi</th>
                <th className="hidden lg:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Kategori</th>
                <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tahun</th>
                <th className="px-4 lg:px-8 py-4 text-left text-[9px] lg:text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
                <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Klasifikasi</th>
                <th className="px-4 lg:px-8 py-4 text-right sm:text-left text-[9px] lg:text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              {isTableLoading ? (
                // 🔹 RESPONSIVE SKELETON 🔹
                [1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                    <td className="px-4 lg:px-8 py-4 lg:py-5">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="h-8 w-8 lg:h-9 lg:w-9 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                        <div className="space-y-2 w-full max-w-[120px] sm:max-w-[200px]">
                          <div className="h-3 lg:h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded"></div>
                          <div className="h-2 lg:h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded"></div></td>
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded"></div></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                    <td className="px-4 lg:px-8 py-4 flex justify-end sm:justify-start"><div className="h-6 lg:h-8 w-10 lg:w-16 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div></td>
                  </tr>
                ))
              ) : currentDocuments.length > 0 ? (
                // 🔹 DOKUMEN ASLI (Menggunakan currentDocuments untuk pagination) 🔹
                currentDocuments.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                          <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                          <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                            <span className="lg:hidden">{doc.published_at ? new Date(doc.published_at).getFullYear() : '-'} • </span>
                            {doc.category}
                          </p>
                          
                          {/* Link Research Button */}
                          <div className="mt-2 flex items-center gap-2">
                            {doc.penelitian ? (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                                <Link className="w-2.5 h-2.5" />
                                <span className="text-[8px] font-black uppercase tracking-tight truncate max-w-[100px]" title={doc.penelitian.judul_penelitian}>
                                  {doc.penelitian.judul_penelitian}
                                </span>
                                <button 
                                  onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                                  className="ml-1 text-[8px] font-black text-indigo-400 hover:text-indigo-600 uppercase"
                                >
                                  Ubah
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                                className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-md border border-gray-100 dark:border-zinc-700 text-[8px] font-black uppercase tracking-tight"
                              >
                                <Link className="w-2.5 h-2.5" />
                                Pilih Asal Penelitian
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-black text-gray-500 dark:text-zinc-400 font-mono tracking-tighter italic">
                      {doc.published_at ? new Date(doc.published_at).getFullYear() : '-'}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest ${
                        doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30' :
                        doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900/30' :
                        doc.status === 'Verified by Prodi' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/30' :
                        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-900/30'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        {(doc.status === 'Pending' || doc.status === 'Verified by Prodi') && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        <span className="hidden sm:inline">{doc.status === 'Verified by Prodi' ? 'Verified (Prodi)' : doc.status}</span>
                        <span className="sm:hidden">{doc.status === 'Approved' ? 'OK' : doc.status === 'Rejected' ? 'NO' : doc.status === 'Verified by Prodi' ? 'V-PRD' : 'Wait'}</span>
                      </div>
                    </td>
                    
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 shadow-sm">
                          <Award className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          KPI <span className="hidden lg:inline">Tercatat</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700">
                          <Archive className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className="flex flex-col items-end sm:items-start">
                        <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter">
                          +{doc.awarded_points} <span className="hidden sm:inline">PTS</span>
                        </span>
                        <span className="hidden sm:block text-[8px] lg:text-[9px] font-bold text-primary-300 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Performance</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 lg:px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                       <FileText className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                       <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">Inventory Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* === Pagination Controls === */}
        {!isTableLoading && documents.length > 0 && (
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

      {/* Linking Modal */}
      <AnimatePresence>
        {isLinkingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsLinkingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
            >
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600">
                    <Link className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Pilih Asal Penelitian</h3>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Hubungkan dokumen ini dengan penelitian yang relevan</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {approvedResearch.length > 0 ? (
                    approvedResearch.map((res: any) => (
                      <button
                        key={res.id}
                        disabled={isLinkingLoading}
                        onClick={() => handleLinkToResearch(res.id)}
                        className="w-full text-left p-5 rounded-2xl border-2 border-gray-50 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-300 leading-tight">
                              {res.judul_penelitian}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{res.tahun}</span>
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded-md">{res.program}</span>
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tidak ada penelitian yang disetujui</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-zinc-800">
                  <button 
                    onClick={() => setIsLinkingModalOpen(false)}
                    className="w-full py-4 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}