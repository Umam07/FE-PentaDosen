import React, { useState, useEffect, useMemo } from 'react';
import { Upload, BookOpen, CheckCircle, XCircle, Clock, CalendarDays, ChevronLeft, ChevronRight, Filter, ChevronDown, AlertCircle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const BUKU_CATEGORIES = [
  { label: 'Buku Referensi', value: 'Buku Referensi', points: 40 },
  { label: 'Buku Ajar', value: 'Buku Ajar', points: 20 },
  { label: 'Buku Monograf', value: 'Buku Monograf', points: 20 },
];

export default function Buku({ user }: { user: any }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Buku Referensi');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterKategori, setFilterKategori] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const load = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      setIsTableLoading(false);
    };
    load();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/documents`);
      const data = await res.json();
      // Filter hanya dokumen kategori buku
      const bukuDocs = (data.documents || []).filter((d: any) =>
        BUKU_CATEGORIES.some(bc => bc.value.toLowerCase() === (d.category || '').toLowerCase())
      );
      setDocuments(bukuDocs);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocuments = useMemo(() => {
    if (!filterKategori) return documents;
    return documents.filter(d => d.category === filterKategori);
  }, [documents, filterKategori]);

  const stats = useMemo(() => {
    const cutoffYear = currentYear - 2;
    const valid = filteredDocuments.filter(d => {
      const y = d.published_at ? new Date(d.published_at).getFullYear() : 0;
      return d.status === 'Approved' && y >= cutoffYear;
    });
    return {
      total: filteredDocuments.length,
      approved: filteredDocuments.filter(d => d.status === 'Approved').length,
      pending: filteredDocuments.filter(d => d.status === 'Pending' || d.status === 'Verified by Prodi').length,
      points: valid.reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0),
      validCount: valid.length,
    };
  }, [filteredDocuments, currentYear]);

  const selectedCat = BUKU_CATEGORIES.find(c => c.value === category);
  const scoringPreview = docType === 'arsip'
    ? { type: 'arsip', points: 0, message: 'Arsip — tidak dihitung KPI (0 Poin)' }
    : { type: 'kpi', points: selectedCat?.points || 0, message: `KPI: +${selectedCat?.points || 0} Poin` };

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find(doc =>
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && doc.is_kpi_counted
    );
  }, [title, documents]);

  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Template');

    sheet.columns = [
      { header: 'Judul Buku', key: 'judul', width: 40 },
      { header: 'Kategori', key: 'kategori', width: 25 },
      { header: 'Tahun Terbit', key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      judul: 'Dasar-Dasar Kecerdasan Buatan',
      kategori: 'Buku Referensi',
      tahun: new Date().getFullYear(),
      tipe: 'kpi'
    });

    for (let i = 2; i <= 1000; i++) {
      sheet.getCell(`B${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Buku Referensi,Buku Ajar,Buku Monograf"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih kategori dari daftar dropdown.'
      };
      
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
    saveAs(new Blob([buffer]), 'Template_Import_Buku.xlsx');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        setMessage(`Mengimpor ${data.length} data...`);
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('title', row['Judul Buku'] || '');
          formData.append('category', row['Kategori'] || 'Buku Referensi');
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
        setMessage('Terjadi kesalahan saat membaca file Excel.');
        setMessageType('error');
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      setMessage('Hanya file PDF atau gambar yang diperbolehkan.');
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
      const res = await fetch(`/api/documents/${id}/upload-pdf`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Dokumen berhasil diunggah!');
        setMessageType('success');
        
        setIsTableLoading(true);
        await fetchDocuments();
        setIsTableLoading(false);
      } else {
        setMessage(data.message || 'Gagal mengunggah dokumen.');
        setMessageType('error');
      }
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !tahun) {
      setMessage('Harap lengkapi semua field.'); setMessageType('error'); return;
    }
    if (duplicateFound) {
      setMessage('Dokumen ini sudah terdata.'); setMessageType('error'); return;
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
      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Buku berhasil diunggah!'); setMessageType('success');
        setTitle(''); setFile(null); setTahun(currentYear.toString());
        setIsTableLoading(true); await fetchDocuments(); setCurrentPage(1); setIsTableLoading(false);
      } else {
        let errorMsg = data.message || 'Gagal mengunggah.';
        if (data.errors && data.errors.title) {
          errorMsg = data.errors.title[0];
        }
        setMessage(errorMsg); 
        setMessageType('error'); 
      }
    } catch { setMessage('Terjadi kesalahan.'); setMessageType('error'); }
    finally { setLoading(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const paginatedDocs = filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
    if (status === 'Rejected') return 'text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
  };
  const getStatusIcon = (status: string) => {
    if (status === 'Approved') return <CheckCircle className="w-3.5 h-3.5" />;
    if (status === 'Rejected') return <XCircle className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Buku</h1>
          <p className="text-sm font-bold text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">Buku Referensi · Buku Ajar · Buku Monograf</p>
        </div>
        <div className="flex gap-3">
          {BUKU_CATEGORIES.map(bc => (
            <div key={bc.value} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 rounded-xl text-center">
              <p className="text-[8px] font-black text-purple-500 uppercase tracking-widest">{bc.label}</p>
              <p className="text-sm font-black text-purple-700 dark:text-purple-300">+{bc.points} pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Buku', value: stats.total, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
          { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
          { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { label: 'Total Poin KPI', value: `${stats.points} pts`, icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-7 shadow-sm space-y-5">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
             <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Unggah Buku</h2>
             <div className="flex flex-wrap items-center gap-2">
              <button 
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm"
              >
                <Download className="w-3 h-3 mr-1" />
                Template
              </button>
              <label className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
                <FileSpreadsheet className="w-3 h-3 mr-1" />
                {isImporting ? 'Proses...' : 'Import'}
                <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImportExcel} disabled={isImporting} />
              </label>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold ${messageType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {messageType === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {duplicateFound && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Judul ini sudah ada di database.
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Judul */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Judul Buku</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Masukkan judul buku..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-800 dark:text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer">
                {BUKU_CATEGORIES.map(bc => <option key={bc.value} value={bc.value}>{bc.label} (+{bc.points} pts)</option>)}
              </select>
            </div>

            {/* Tahun */}
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Tahun Terbit</label>
              <button type="button" onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-bold text-gray-800 dark:text-white flex items-center justify-between">
                <span>{tahun}</span><ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {isYearDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl max-h-48 overflow-auto">
                  {years.map(y => (
                    <button key={y} type="button" onClick={() => { setTahun(y); setIsYearDropdownOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-bold transition-colors ${tahun === y ? 'bg-purple-50 text-purple-700' : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tipe Dokumen */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Tipe Dokumen</label>
              <div className="grid grid-cols-2 gap-2">
                {(['kpi', 'arsip'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setDocType(t)}
                    className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${docType === t ? 'bg-purple-600 text-white border-purple-600' : 'bg-white dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700 hover:border-purple-300'}`}>
                    {t === 'kpi' ? '📊 KPI' : '🗄️ Arsip'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scoring preview */}
            {scoringPreview && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest ${scoringPreview.type === 'kpi' ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-100 text-purple-700 dark:text-purple-400' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500'}`}>
                {scoringPreview.type === 'kpi' ? '⭐' : '🗄️'} {scoringPreview.message}
              </div>
            )}

            {/* Upload zona */}
            <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${isDragging ? 'border-purple-400 bg-purple-50/50' : 'border-gray-200 dark:border-zinc-700 hover:border-purple-300'}`}
              onClick={() => document.getElementById('buku-file-input')?.click()}>
              <input id="buku-file-input" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-300" />
              {file ? <p className="text-xs font-bold text-purple-600 truncate">{file.name}</p>
                : <p className="text-xs font-bold text-gray-400">Klik atau seret file ke sini</p>}
            </div>

            <button type="submit" disabled={loading || !!duplicateFound}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-purple-500/20">
              {loading ? 'Mengunggah...' : 'Unggah Buku'}
            </button>
          </form>

          {/* Remove bottom import section */}
        </div>

        {/* Document List */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
            {['', ...BUKU_CATEGORIES.map(b => b.value)].map(k => (
              <button key={k} onClick={() => { setFilterKategori(k); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterKategori === k ? 'bg-purple-600 text-white' : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-200 dark:border-zinc-700 hover:border-purple-300'}`}>
                {k || 'Semua'}
              </button>
            ))}
          </div>

          {isTableLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-zinc-700">
              <BookOpen className="w-10 h-10 text-gray-200 mb-4" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Belum ada dokumen buku</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedDocs.map((doc: any, i: number) => {
                  const catInfo = BUKU_CATEGORIES.find(bc => bc.value === doc.category);
                  const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
                  const isValid = doc.status === 'Approved' && docYear >= currentYear - 2;
                  return (
                    <motion.div key={doc.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-snug line-clamp-2">{doc.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {catInfo && (
                              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 rounded-md text-[7px] font-black uppercase tracking-widest">
                                {catInfo.label}
                              </span>
                            )}
                            {doc.file_url && doc.file_url !== '-' ? (
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-[7px] font-black uppercase tracking-widest transition-colors">
                                <FileText className="w-2.5 h-2.5" /> Lihat
                              </a>
                            ) : (
                              <label className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 hover:text-purple-600 hover:bg-purple-50 text-[7px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                                {uploadingPdfId === doc.id ? (
                                  <span className="animate-pulse">Uploading...</span>
                                ) : (
                                  <>
                                    <Upload className="w-2.5 h-2.5" /> Upload File
                                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                                  </>
                                )}
                              </label>
                            )}
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-widest ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)} {doc.status}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" /> {docYear || '—'}
                            </span>
                            {isValid && catInfo && (
                              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-md text-[7px] font-black uppercase tracking-widest">
                                +{catInfo.points} PTS KPI
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredDocuments.length)} / {filteredDocuments.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                      className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:text-purple-600 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-black text-gray-600 dark:text-zinc-300 px-3">{currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                      className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:text-purple-600 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
